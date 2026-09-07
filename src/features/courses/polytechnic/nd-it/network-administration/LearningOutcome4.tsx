import React, { useState, useEffect, useRef } from 'react';
import {
  Network,
  Search,
  Settings,
  LifeBuoy,
  Layers,
  ToolCase,
  FileText,
  Map,
  BarChart2,
  ClipboardList,
  Activity,
  Shield,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Download,
  Upload,
  RefreshCw,
  Server,
  Router,
  Wifi,
  Globe,
  Cloud,
  Database,
  HardDrive,
  Cpu,
  Terminal,
  Code,
  Command,
  BookOpen,
  Users,
  UserCheck,
  UserX,
  Fingerprint,
  KeyRound,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Power,
  Wrench,
  Hammer,
  PenTool,
  Scissors,
  Ruler,
  Compass,
  MapPin,
  Home,
  Building,
  Briefcase,
  GitBranch,
  GitMerge,
  Link,
  Link2,
  WifiOff,
  Radio,
  Satellite,
  Antenna,
  Phone,
  Smartphone,
  Tablet,
  Laptop,
  Printer,
  Monitor,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  GraduationCap,
  Award,
  Sparkles,
  BookMarked,
  ListChecks,
  FileCheck,
  FileWarning,
  Folder,
  FolderOpen,
  Archive,
  Package,
  Box,
  Boxes,
  ScanIcon,
  HelpCircle,
  ChevronRight,
  X,
  RefreshCw as RefreshIcon,
  ChevronUp as ChevronUpIcon,
  Sparkles as SparklesIcon,
  Brain,
} from 'lucide-react';
import { AdSense } from '../../../../analytics/AdSense';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'methodology', label: 'Troubleshooting Methodology' },
  { id: 'approaches', label: 'OSI Approaches' },
  { id: 'tools', label: 'Command Line Tools' },
  { id: 'documentation', label: 'Network Documentation' },
  { id: 'diagrams', label: 'Network Diagrams' },
  { id: 'baselines', label: 'Baselines' },
  { id: 'policies', label: 'Policies & Procedures' },
  { id: 'config-mgmt', label: 'Configuration Management' },
  { id: 'disaster-recovery', label: 'Disaster Recovery' },
  { id: 'backups', label: 'Backup Types' },
  { id: 'practice', label: 'Practice Q&A' },
  { id: 'exam-tips', label: 'Exam Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome4: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(null);

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
        text: 'The CompTIA 7-step troubleshooting model is the industry standard for systematic problem-solving in networks.',
      },
      {
        title: 'Pro Tip',
        text: 'Always start troubleshooting by asking the user: "What changed?" – most problems are caused by recent changes.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 7 steps: Identify, Theory, Test, Plan, Implement, Verify, Document – "ITT PIVD".',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse Differential backups (changes since FULL) with Incremental backups (changes since LAST backup).',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The CompTIA 7-step troubleshooting model is the industry standard for systematic problem-solving in networks.',
      },
      {
        title: 'Pro Tip',
        text: 'Always start troubleshooting by asking the user: "What changed?" – most problems are caused by recent changes.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 7 steps: Identify, Theory, Test, Plan, Implement, Verify, Document – "ITT PIVD".',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse Differential backups (changes since FULL) with Incremental backups (changes since LAST backup).',
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

  // ─── Quiz state ──────────────────────────────────────────────────────────
  const [quiz1Answer, setQuiz1Answer] = useState<number | null>(null);
  const [quiz2Answer, setQuiz2Answer] = useState<number | null>(null);
  const [quiz3Answer, setQuiz3Answer] = useState<number | null>(null);
  const [quiz4Answer, setQuiz4Answer] = useState<number | null>(null);
  const [quiz5Answer, setQuiz5Answer] = useState<number | null>(null);

  const [showQuiz1Result, setShowQuiz1Result] = useState(false);
  const [showQuiz2Result, setShowQuiz2Result] = useState(false);
  const [showQuiz3Result, setShowQuiz3Result] = useState(false);
  const [showQuiz4Result, setShowQuiz4Result] = useState(false);
  const [showQuiz5Result, setShowQuiz5Result] = useState(false);

  const checkAnswer = (quizNumber: number, selectedAnswer: number, correctAnswer: number) => {
    switch (quizNumber) {
      case 1: setQuiz1Answer(selectedAnswer); setShowQuiz1Result(true); break;
      case 2: setQuiz2Answer(selectedAnswer); setShowQuiz2Result(true); break;
      case 3: setQuiz3Answer(selectedAnswer); setShowQuiz3Result(true); break;
      case 4: setQuiz4Answer(selectedAnswer); setShowQuiz4Result(true); break;
      case 5: setQuiz5Answer(selectedAnswer); setShowQuiz5Result(true); break;
    }
  };

  // ─── Table Component ──────────────────────────────────────────────────────
  const Table = ({ headers, rows, title }: { headers: string[]; rows: string[][]; title?: string }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-[#121212]">
      {title && (
        <div className="px-4 py-2 font-semibold bg-slate-50 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm">
          {title}
        </div>
      )}
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-50 dark:bg-[#1a1a1a]">
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
            <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-[#121212]' : 'bg-slate-50 dark:bg-[#1a1a1a]'}>
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

  // ─── Question Reveal Component ────────────────────────────────────────────
  const QuestionReveal = ({ question, answer }: { question: string; answer: string }) => {
    const [revealed, setRevealed] = useState(false);
    return (
      <div className="bg-white dark:bg-[#121212] p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-4">
        <p className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">{question}</p>
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            Click to reveal answer
          </button>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-slate-800 dark:text-slate-200 whitespace-pre-line text-sm">{answer}</p>
            <button
              onClick={() => setRevealed(false)}
              className="text-xs text-slate-500 dark:text-slate-400 mt-2 hover:underline"
            >
              Hide answer
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Search size={14} className="inline mr-1" /> TROUBLESHOOTING
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 4{' '}
            <span className="text-amber-300 font-bold italic">
              Network Maintenance & Reporting
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the art of systematic troubleshooting, network maintenance
            routines, documentation, baselines, policies, and creating professional
            status reports.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Wrench size={14} className="inline mr-1" /> Maintenance
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileText size={14} className="inline mr-1" /> Reporting
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
                placeholder="Search for a methodology, tool, or process..."
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
      <div id="lesson-scroll-area" className="mx-auto px-[5px] sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Left column: sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* 1. Introduction */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Introduction to Network Maintenance & Reporting
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Network maintenance and reporting is the backbone of a reliable IT infrastructure. It involves systematic troubleshooting, regular upkeep of hardware and software, creating and maintaining documentation, establishing baselines, and producing professional reports that keep stakeholders informed. These skills separate reactive fire-fighters from proactive, professional network administrators.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Think of network maintenance like servicing a car. You don't just fix it when it breaks – you have a regular service schedule (preventive maintenance), you keep records of what was done (documentation), you know what "normal" looks like (baselines), and you have a plan for when things go really wrong (disaster recovery). A good mechanic doesn't just guess – they follow a systematic process.
                </p>
              </div>
            </div>

            {/* 2. Troubleshooting Methodology */}
            <div
              ref={(el) => {
                sectionRefs.current['methodology'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Troubleshooting Methodology
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A systematic, step-by-step approach to finding and fixing network problems. Without a method, you're just guessing! The CompTIA 7-step troubleshooting model is the industry standard.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">The 7-Step Troubleshooting Model</h3>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><Search size={14} /> Step 1: Identify the Problem</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Gather information. Ask the user: "What changed?" "When did it start?" Look for error messages. Duplicate the problem if possible.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><Brain size={14} /> Step 2: Establish a Theory</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Brainstorm possible causes. Start with the simplest explanation (e.g., is it plugged in?). List potential causes from most likely to least likely.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1"><Activity size={14} /> Step 3: Test the Theory</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Test your theories one by one. If a theory is confirmed, move to the next step. If not, establish a new theory.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><ClipboardList size={14} /> Step 4: Establish a Plan of Action</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Decide how to fix the problem. Consider the impact on users (e.g., will the server need a restart?). Plan for a rollback if the fix fails.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><Wrench size={14} /> Step 5: Implement the Solution</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Apply the fix. Be careful not to introduce new problems.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1"><CheckCircle size={14} /> Step 6: Verify Functionality</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Check if the problem is truly gone. Test related systems. Implement preventive measures to stop it from happening again.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1"><FileText size={14} /> Step 7: Document Findings</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Write down what the problem was, how you fixed it, and when. This creates a knowledge base for future issues.</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Memorise these 7 steps IN ORDER. Examiners love asking "What is the next step after establishing a theory?"</p>
              </div>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What is Step 4 of the CompTIA 7-step troubleshooting model?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 3)} /> a) Test the Theory
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 3)} /> b) Identify the Problem
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 3)} /> c) Implement the Solution
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 3, 3)} /> d) Establish a Plan of Action
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 3 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 3 ? '✅ Correct! Step 4 is Establish a Plan of Action.' : '❌ Incorrect. The correct answer is d.'}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Troubleshooting Approaches (OSI Model) */}
            <div
              ref={(el) => {
                sectionRefs.current['approaches'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Troubleshooting Approaches (OSI Model)
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">You can use the OSI model to guide your troubleshooting. There are 3 main strategies:</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Bottom-Up Approach</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Start at Layer 1 (Physical) and work your way up. Check cables first, then NICs, then IP settings, etc.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Good for complex problems</li>
                    <li>Ensures physical layer is solid</li>
                    <li>Time-consuming if problem is at application layer</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Top-Down Approach</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Start at Layer 7 (Application) and work down. Check if the app works, then DNS, then IP, etc.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Fast if problem is software-related</li>
                    <li>Good for simple user errors</li>
                    <li>Difficult if the problem is a loose cable</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Divide and Conquer</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Start at Layer 3 (Network) or Layer 4 (Transport). Ping the device. If it works, problem is higher up. If not, it's lower down.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Usually the fastest method</li>
                    <li>Eliminates half the layers immediately</li>
                    <li>Requires experience to know where to start</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">💡 Pro Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Divide and Conquer is usually the most efficient method for experienced admins. Ping is your best friend here!</p>
              </div>
            </div>

            {/* 4. Essential Command Line Tools */}
            <div
              ref={(el) => {
                sectionRefs.current['tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Essential Command Line Tools
              </h2>

              <Table
                headers={["Command", "What it does", "Use case"]}
                rows={[
                  ["ping", "Sends ICMP echo requests to a target IP", "Test connectivity (is the device online?)"],
                  ["ipconfig / ifconfig", "Displays current IP configuration", "Check your own IP, subnet mask, gateway"],
                  ["tracert / traceroute", "Shows the path data takes to reach a destination", "Find where the connection is breaking"],
                  ["nslookup", "Queries DNS servers", "Test DNS resolution"],
                  ["netstat", "Shows active network connections and ports", "See what apps are using the network"],
                ]}
                title="Command Line Tools"
              />

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Know what each command does and when to use it. Examiners love scenario-based questions like "Which command would you use to find where a connection is breaking?"</p>
              </div>

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which command shows the complete path data takes to reach a destination?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 2)} /> a) ping
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 2)} /> b) ipconfig
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 2, 2)} /> c) traceroute
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 2 ? '✅ Correct! traceroute maps the path to a destination.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
              </div>
            </div>

            {/* 5. Network Documentation */}
            <div
              ref={(el) => {
                sectionRefs.current['documentation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Documentation
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  If you don't write it down, you (or the next admin) will have to figure it out from scratch. Good documentation saves HOURS of troubleshooting time.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Why Document?</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><strong>Consistency:</strong> Everyone follows the same procedures.</li>
                <li><strong>Efficiency:</strong> Faster troubleshooting and problem resolution.</li>
                <li><strong>Knowledge Transfer:</strong> New staff can get up to speed quickly.</li>
                <li><strong>Compliance:</strong> Many industries require documented processes.</li>
                <li><strong>Reduced Downtime:</strong> Problems are fixed faster when you know what you're dealing with.</li>
              </ul>
            </div>

            {/* 6. Network Diagrams */}
            <div
              ref={(el) => {
                sectionRefs.current['diagrams'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Diagrams
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Physical Diagram</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Shows physical location of devices, cable runs, rack layouts, and physical connections. Like a floor plan for your network hardware.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Logical Diagram</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Shows IP addresses, subnets, VLANs, routing protocols, and data flow. Focuses on how data moves, not where cables are.</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">💡 Pro Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Keep both diagrams updated. A physical diagram helps you find the device, a logical diagram helps you understand how it fits into the network. Outdated diagrams are almost as bad as no diagrams!</p>
              </div>
            </div>

            {/* 7. Baselines */}
            <div
              ref={(el) => {
                sectionRefs.current['baselines'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Baselines
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A baseline is a snapshot of "normal" network performance – the typical values for bandwidth usage, CPU usage, error rates, latency, and packet loss when everything is working correctly. Baselines are like a healthy person's medical records – you need to know what normal looks like to know when something is wrong.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Why Baselines Matter</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><strong>Detect problems early:</strong> When performance deviates from the baseline, you know something is changing.</li>
                <li><strong>Capacity planning:</strong> Baselines over time show growth trends, helping you plan upgrades.</li>
                <li><strong>Troubleshooting reference:</strong> Is the network slow now, or was it always this slow? Baselines answer that question.</li>
                <li><strong>Justify investments:</strong> Show management objective data that upgrades are needed.</li>
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">What to Baseline</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>Bandwidth utilisation (peak and average)</li>
                <li>CPU utilisation on routers and switches</li>
                <li>Memory usage on network devices</li>
                <li>Packet loss and error rates</li>
                <li>Latency (response time)</li>
                <li>Number of active users or connections</li>
              </ul>
            </div>

            {/* 8. Policies & Procedures */}
            <div
              ref={(el) => {
                sectionRefs.current['policies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Policies & Procedures
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Acceptable Use Policy (AUP)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Defines what users are allowed and not allowed to do on the network. Covers personal use, prohibited sites, and consequences of violation.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Security Policy</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Outlines security requirements – password policies, access controls, encryption standards, and security breach procedures.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Backup Procedures</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Defines what gets backed up, how often, where backups are stored, and how to restore data. Essential for disaster recovery.</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Know the difference between these policies and what each one covers. Examiners often ask about AUP specifically.</p>
              </div>
            </div>

            {/* 9. Configuration Management */}
            <div
              ref={(el) => {
                sectionRefs.current['config-mgmt'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Configuration Management
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Configuration management is the practice of tracking and controlling changes to network device configurations. Without it, you never know when something changed, who changed it, or how to roll back if something breaks.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">What to Track</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><strong>Device Configurations:</strong> Full configs of routers, switches, firewalls.</li>
                <li><strong>Software Versions:</strong> Firmware and OS versions on all network devices.</li>
                <li><strong>Patch Levels:</strong> Which security patches have been applied and when.</li>
                <li><strong>Change Logs:</strong> Who made what change and when.</li>
                <li><strong>Hardware Inventory:</strong> Model numbers, serial numbers, warranties.</li>
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Benefits</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><strong>Rapid recovery:</strong> If a device fails, you can quickly restore its configuration.</li>
                <li><strong>Security auditing:</strong> Know exactly what changes were made and by whom.</li>
                <li><strong>Consistency:</strong> Ensure all devices meet security standards.</li>
                <li><strong>Troubleshooting:</strong> A change log often reveals what caused a problem.</li>
              </ul>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which document defines what users are allowed to do on the network?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 0)} /> a) Acceptable Use Policy (AUP)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 0)} /> b) Security Policy
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 2, 0)} /> c) Backup Procedures
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 0 ? '✅ Correct! The AUP defines acceptable user behaviour.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
              </div>
            </div>

            {/* 10. Disaster Recovery */}
            <div
              ref={(el) => {
                sectionRefs.current['disaster-recovery'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Disaster Recovery
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A Disaster Recovery Plan (DRP) is a documented process for recovering IT systems and data after a catastrophic event – fire, flood, cyberattack, hardware failure, or human error. It's your "Plan B" when everything goes wrong.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Key Components of a DRP</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><strong>Emergency Contacts:</strong> Who to call and in what order.</li>
                <li><strong>Recovery Procedures:</strong> Step-by-step instructions for restoring systems.</li>
                <li><strong>Backup Verification:</strong> How to confirm backups are usable.</li>
                <li><strong>Recovery Time Objective (RTO):</strong> How quickly systems must be restored.</li>
                <li><strong>Recovery Point Objective (RPO):</strong> How much data loss is acceptable.</li>
              </ul>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">💡 Pro Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">RTO (Recovery Time Objective) = TIME – how long until systems are back up. RPO (Recovery Point Objective) = DATA – how much data can you afford to lose. A shorter RTO costs more; a shorter RPO means more frequent backups.</p>
              </div>
            </div>

            {/* 11. Backup Types */}
            <div
              ref={(el) => {
                sectionRefs.current['backups'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Types of Backups
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Full Backup</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Backs up EVERYTHING. Slowest backup, uses most storage, but fastest restore.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>✅ Fastest restore</li>
                    <li>❌ Slowest backup</li>
                    <li>❌ Uses most storage</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Differential Backup</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Backs up everything changed since the last FULL backup. Faster backup, medium storage, slower restore.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>✅ Faster backup than full</li>
                    <li>❌ Slower restore (needs full + last differential)</li>
                    <li>📊 Medium storage</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Incremental Backup</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Backs up everything changed since the LAST backup (full or incremental). Fastest backup, least storage, slowest restore.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>✅ Fastest backup</li>
                    <li>✅ Least storage</li>
                    <li>❌ Slowest restore (needs full + ALL incrementals)</li>
                  </ul>
                </div>
              </div>

              <Table
                headers={["Backup Type", "Speed", "Storage", "Restore Speed"]}
                rows={[
                  ["Full", "Slowest", "Most", "Fastest"],
                  ["Differential", "Faster", "Medium", "Medium"],
                  ["Incremental", "Fastest", "Least", "Slowest"],
                ]}
                title="Backup Type Comparison"
              />

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Know the difference between Differential and Incremental backups. Differential = changes since FULL. Incremental = changes since LAST backup. This is a VERY common exam question!</p>
              </div>

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which backup type backs up everything changed since the last FULL backup?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 1)} /> a) Full
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 1)} /> b) Differential
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 2, 1)} /> c) Incremental
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 1 ? '✅ Correct! Differential backs up changes since the last FULL.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 12. Practice Q&A */}
            <div
              ref={(el) => {
                sectionRefs.current['practice'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Practice Questions & Answers
              </h2>

              <QuestionReveal
                question="Q1. List the 7 steps of the CompTIA troubleshooting model in order."
                answer="1. Identify the Problem\n2. Establish a Theory\n3. Test the Theory\n4. Establish a Plan of Action\n5. Implement the Solution\n6. Verify Functionality\n7. Document Findings"
              />

              <QuestionReveal
                question="Q2. What are the 3 troubleshooting approaches based on the OSI model?"
                answer="1. Bottom-Up – Start at Layer 1 (Physical) and work up. Good for complex problems.\n\n2. Top-Down – Start at Layer 7 (Application) and work down. Good for software/user errors.\n\n3. Divide and Conquer – Start at Layer 3/4. Use ping to determine if problem is higher or lower. Usually the fastest method."
              />

              <QuestionReveal
                question="Q3. What is the difference between a physical diagram and a logical diagram?"
                answer="A physical diagram shows the physical location of devices, cable runs, and physical connections – it's like a floor plan for hardware. A logical diagram shows IP addresses, subnets, VLANs, and data flow – it focuses on how data moves, not where cables are."
              />

              <QuestionReveal
                question="Q4. What is a baseline and why is it important?"
                answer="A baseline is a snapshot of 'normal' network performance – typical values for bandwidth usage, CPU usage, error rates, and latency when everything is working correctly. It is important because it helps detect problems early (deviations from normal), supports capacity planning, provides a troubleshooting reference, and helps justify investments by showing objective data."
              />

              <QuestionReveal
                question="Q5. What is the difference between RTO and RPO?"
                answer="RTO (Recovery Time Objective) is the maximum acceptable amount of TIME that a system can be down after a disaster – how quickly it must be restored. RPO (Recovery Point Objective) is the maximum acceptable amount of DATA LOSS – how far back in time a recovery can go. A shorter RTO costs more; a shorter RPO means more frequent backups."
              />

              <QuestionReveal
                question="Q6. Differentiate between Differential and Incremental backups."
                answer="A Differential Backup copies everything changed since the last FULL backup. It is faster than a full backup, uses medium storage, and restore requires the full backup + the latest differential backup.\n\nAn Incremental Backup copies everything changed since the LAST backup (whether full or incremental). It is the fastest backup, uses the least storage, but restore is slowest because it requires the full backup + EVERY incremental backup in the chain."
              />

              <QuestionReveal
                question="Q7. What is configuration management and why is it important?"
                answer="Configuration management is the practice of tracking and controlling changes to network device configurations. It is important because it enables rapid recovery (restore configs if a device fails), provides security auditing (know who changed what), ensures consistency across devices, and helps troubleshooting (change logs often reveal what caused a problem)."
              />

              {/* Quiz 5 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What does RPO stand for in disaster recovery planning?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 0, 1)} /> a) Recovery Time Objective
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 1, 1)} /> b) Recovery Point Objective
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 2, 1)} /> c) Risk Prevention Objective
                  </label>
                </div>
                {showQuiz5Result && (
                  <div className={`mt-2 p-2 rounded ${quiz5Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz5Answer === 1 ? '✅ Correct! RPO is about data loss tolerance.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 13. Exam Tips */}
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 7-Step Troubleshooting Model</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Know the steps IN ORDER: Identify → Theory → Test → Plan → Implement → Verify → Document.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 OSI Approaches</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Bottom-Up (physical first), Top-Down (application first), Divide and Conquer (start at Layer 3/4).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Command Line Tools</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">ping, ipconfig, traceroute, nslookup, netstat – know what each does and when to use it.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Backup Types</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Full (everything), Differential (changes since FULL), Incremental (changes since LAST backup).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 RTO vs RPO</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">RTO = Time to recover; RPO = Data loss tolerance. Both are critical in disaster recovery planning.</p>
                </div>
              </div>

              {/* Cheat Sheet */}
              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-lg text-blue-800 dark:text-blue-300 mb-4">📋 Quick Cheat Sheet</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Troubleshooting steps</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">7</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">OSI approaches</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">3</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Backup types</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">3</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">DRP key metrics</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">2 (RTO, RPO)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Maintain. Document. Recover. Report. 📋</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Maintenance Insight
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
                  <span>Troubleshooting Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Backup Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Network maintenance and reporting is what separates professionals from amateurs. Always follow a systematic troubleshooting process, document everything, establish baselines, and have a disaster recovery plan. These skills are what employers are really looking for – not just technical knowledge, but the discipline to keep a network running smoothly.
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
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Systematic troubleshooting</strong> follows the 7-step model: Identify, Theory, Test, Plan, Implement, Verify, Document.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">OSI troubleshooting approaches</strong> include Bottom-Up, Top-Down, and Divide and Conquer – each has its strengths.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Essential command line tools</strong> – ping, ipconfig, traceroute, nslookup, netstat – are the first line of defence in troubleshooting.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Network documentation</strong> includes physical/logical diagrams, baselines, policies, and configuration management – all critical for maintaining a healthy network.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Backup types</strong> – Full, Differential, Incremental – have trade-offs between speed, storage, and restore time.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Disaster recovery</strong> requires understanding RTO (time to recover) and RPO (data loss tolerance) to plan effectively.
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
            Sidemann Academic Registry • Network Maintenance & Reporting 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;
