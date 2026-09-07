import React, { useState, useEffect, useRef } from 'react';
import {
  Boxes,
  ClipboardList,
  Eye,
  Shield,
  ChartLine,
  Wrench,
  FileText,
  Cloud,
  DollarSign,
  ChartBar,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  GraduationCap,
  Award,
  Brain,
  ChevronRight,
  Search,
  Database,
  RefreshCw,
  BookOpen,
  ChevronUp,
  X,
  Sparkles,
  Target,
  Scale,
  Globe,
  Lock,
  Cpu,
  Server,
  Microchip,
  Activity,
  Gauge,
  Monitor,
  Power,
  ListChecks,
  Component,
  SquareStack,
  Cable,
  PlugZap,
  ShieldCheck,
  HardDrive,
  Cloud as CloudIcon,
  Zap as ZapIcon,
  Droplet,
  Thermometer,
  Cog,
  Users,
  Trash2,
  Pen,
  Search as SearchIcon,
  FileSearch,
  ClipboardCheck,
  Clipboard,
  List,
  Table,
  Copy,
  Check,
  DollarSign as DollarSignIcon,
  TrendingUp,
} from 'lucide-react';
import { AdSense } from '../../../../analytics/AdSense';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'reasons', label: '8 Reasons' },
  { id: 'prepare', label: 'Prepare a List' },
  { id: 'verification', label: 'Physical Verification' },
  { id: 'maintenance', label: 'Maintaining Inventory' },
  { id: 'software', label: 'Evaluation Software' },
  { id: 'reports', label: 'Inventory Reports' },
  { id: 'practice', label: 'Practice' },
  { id: 'exam-tips', label: 'Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome8: React.FC = () => {
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
        text: 'Hardware inventory management is like taking a census of your IT equipment – it gives you a clear picture of what you have and where it is.',
      },
      {
        title: 'Pro Tip',
        text: 'Always record serial numbers – they are the unique fingerprint of each device and critical for warranty claims and theft recovery.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 8 reasons for inventory management with the acronym "ASROCDAC" – Asset visibility, Security, Resource optimization, Maintenance, Software licensing, Disaster recovery, Cost control, Auditing.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a Status Report (what you have) with an Exception Report (what is wrong). They serve different purposes.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Hardware inventory management is like taking a census of your IT equipment – it gives you a clear picture of what you have and where it is.',
      },
      {
        title: 'Pro Tip',
        text: 'Always record serial numbers – they are the unique fingerprint of each device and critical for warranty claims and theft recovery.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 8 reasons for inventory management with the acronym "ASROCDAC" – Asset visibility, Security, Resource optimization, Maintenance, Software licensing, Disaster recovery, Cost control, Auditing.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a Status Report (what you have) with an Exception Report (what is wrong). They serve different purposes.',
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
            className="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
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
      <header className="bg-[#7c2d12] dark:bg-[#431407] border-b border-orange-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Boxes size={14} className="inline mr-1" /> INVENTORY MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 8{' '}
            <span className="text-orange-300 font-bold italic">
              Hardware Inventory Management
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the essential practice of tracking, organising, and maintaining
            a complete record of all IT hardware assets – from creation to disposal.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Boxes size={14} className="inline mr-1" /> Inventory
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ClipboardList size={14} className="inline mr-1" /> Tracking
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
                placeholder="Search for a reason, data point, or report type..."
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
                What is Hardware Inventory Management?
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Hardware inventory management is the process of keeping a detailed, updated record of EVERY piece of computer equipment an organisation owns — where it is, what condition it's in, who's using it, and when the warranty expires. This list affects security, budgeting, maintenance, disaster recovery, and more.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Exam Highlight</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  <strong>Hardware Inventory Management has 8 reasons why it's important — learn all 8!</strong>
                </p>
              </div>
            </div>

            {/* 2. 8 Reasons */}
            <div
              ref={(el) => {
                sectionRefs.current['reasons'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                8 Reasons Why Hardware Inventory Management is Crucial
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><Eye size={14} /> 1. Improved Asset Visibility</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Knowing EXACTLY what you have, where it is, and what condition it's in. Essential for planning maintenance, budgeting, and responding to problems.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><Shield size={14} /> 2. Enhanced Security</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Helps detect theft, unauthorised equipment, and potential security breaches early. Missing hardware is spotted immediately.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><ChartLine size={14} /> 3. Optimised Resource Management</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Redistribute unused hardware instead of buying new. Track old equipment for proactive replacement planning.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><Wrench size={14} /> 4. Streamlined Maintenance</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Know which machines need servicing, when last maintenance was done, and what parts they use. Enables bulk ordering.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1"><FileText size={14} /> 5. Simplified Software Licensing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Track software installations to ensure legal compliance and avoid fines for unlicensed software.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1"><CloudIcon size={14} /> 6. Disaster Recovery Planning</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Essential for knowing what was lost and prioritising critical system recovery. Speeds up the recovery process.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><DollarSignIcon size={14} /> 7. Cost Control</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Track lifecycle of devices, budget for replacements proactively. Prevents expensive emergency purchases.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1"><ChartBar size={14} /> 8. Auditing and Reporting</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Makes audits smooth and fast. Provides valuable data for management reports and strategic planning.</p>
                </div>
              </div>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which reason for inventory management helps detect missing hardware quickly?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 1)} /> a) Cost Control
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 1)} /> b) Enhanced Security
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 1)} /> c) Resource Management
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 1 ? '✅ Correct! Enhanced Security helps detect missing hardware.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 3. How to Prepare a Hardware Inventory List */}
            <div
              ref={(el) => {
                sectionRefs.current['prepare'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                How to Prepare a Hardware Inventory List
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Step 1: Define Your Data Points</h4>
                  <Table
                    headers={["Data Point", "What It Means", "Example"]}
                    rows={[
                      ["Hardware Type", "What kind of device is it?", "Desktop PC, Laptop, Server"],
                      ["Manufacturer & Model", "Who made it and what model?", "HP EliteBook 840 G7"],
                      ["Serial Number", "Unique ID stamped on the device", "5CG1234XYZ"],
                      ["IP Address", "Network address (if connected)", "192.168.1.45"],
                      ["Location", "Where is it physically?", "Harare HQ, 2nd Floor, Finance Dept"],
                      ["User/Department", "Who uses it?", "Tendai Moyo, Accounts Dept"],
                      ["Warranty Info", "When does warranty expire?", "Start: Jan 2023, End: Jan 2026"],
                      ["Software Installed", "What software is on it?", "Windows 11, Microsoft Office 2021"],
                      ["Notes", "Any extra relevant details", "Screen has crack, RAM upgraded to 16GB"],
                    ]}
                  />
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Step 2: Data Collection Methods</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-blue-600 dark:text-blue-400 block">Manual Inventory</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Physically go to each device and record information. Time-consuming but reliable for small organisations.</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-green-600 dark:text-green-400 block">Automated Discovery Tools</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Software scans the network and auto-detects devices and specs. Fast for large organisations.</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-amber-600 dark:text-amber-400 block">Existing Records</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Use purchase invoices, old IT records, and helpdesk tickets as a starting point.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Step 3: Standardisation and Organisation</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><span className="font-bold">Naming Convention:</span> Create a consistent naming system (e.g., HRE-FIN-HP840-001).</li>
                    <li><span className="font-bold">Storage:</span> Keep inventory in a central, accessible place — spreadsheet or dedicated software.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Step 4: Integration with Existing Systems</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><span className="font-bold">Helpdesk Integration:</span> Automatically pull inventory records when support tickets are raised.</li>
                    <li><span className="font-bold">Purchasing Integration:</span> Auto-add new hardware when purchased, auto-remove when disposed.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Step 5: Regular Updates and Audits</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Update inventory whenever hardware is added, moved, changed, or disposed. Conduct regular physical audits to ensure accuracy.</p>
                </div>
              </div>

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which data point uniquely identifies a specific device?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 1)} /> a) Hardware Type
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 1)} /> b) Serial Number
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 2, 1)} /> c) IP Address
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 1 ? '✅ Correct! Serial Number is unique to each device.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Routine Physical Verification */}
            <div
              ref={(el) => {
                sectionRefs.current['verification'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Routine Physical Verification of Hardware Inventory
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Routine physical verification</span> means physically checking that every item on your inventory list actually exists where it's supposed to be.
                </p>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Benefits:</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Improved Data Accuracy</strong> — Find and fix mistakes.</li>
                  <li><strong>Enhanced Security</strong> — Detect theft and unauthorised hardware.</li>
                  <li><strong>Streamlined Maintenance</strong> — Confirm actual condition.</li>
                  <li><strong>Efficient Resource Allocation</strong> — Discover unused hardware.</li>
                  <li><strong>Simplified Disaster Recovery</strong> — Accurate information for recovery.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                How Often Should You Verify?
              </h3>
              <Table
                headers={["Organisation Size", "Recommended Frequency"]}
                rows={[
                  ["Small (less than 50 devices)", "Every 3 months (Quarterly)"],
                  ["Medium (50–250 devices)", "Every 6 months (Bi-annual)"],
                  ["Large (more than 250 devices)", "Every 12 months (Annual)"],
                  ["High-value/sensitive equipment", "Monthly or every 2 months"],
                  ["Newly added/removed hardware", "Immediately upon addition or removal"],
                ]}
              />

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                How to Carry Out Physical Verification — Step by Step
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-blue-600 dark:text-blue-400 block">1. Gather Documents</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Get your inventory list and verification checklist.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-green-600 dark:text-green-400 block">2. Divide and Conquer</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Split the work into sections (by floor, department, etc.).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-amber-600 dark:text-amber-400 block">3. Physical Inspection</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Go to each device, check serial number, condition, and location.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-purple-600 dark:text-purple-400 block">4. Data Recording</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Write down any discrepancies found.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-cyan-600 dark:text-cyan-400 block">5. Reconciliation</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Update the inventory to reflect what you actually found.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-pink-600 dark:text-pink-400 block">6. Reporting</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Summarise findings and actions taken.</p>
                </div>
              </div>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> How often should a medium-sized organisation (50–250 devices) conduct physical verification?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 1)} /> a) Monthly
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 1)} /> b) Every 6 months
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 2, 1)} /> c) Annually
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 1 ? '✅ Correct! Medium organisations should verify every 6 months.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 5. Maintaining an Updated Inventory */}
            <div
              ref={(el) => {
                sectionRefs.current['maintenance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Maintaining an Updated Inventory List — Best Practices
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><Cog size={14} /> Automate Where Possible</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Use network discovery tools to auto-update inventory.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><Wrench size={14} /> Integrate with Other Systems</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Connect inventory to purchasing and helpdesk for automatic updates.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><Pen size={14} /> Change Management Procedures</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Formal process for any hardware change to update inventory immediately.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><Trash2 size={14} /> Regular Data Cleansing</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Periodically review and remove old, duplicate, or irrelevant entries.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h5 className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1"><Users size={14} /> Encourage User Reporting</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Train staff to report changes in their hardware so the inventory stays accurate.</p>
                </div>
              </div>
            </div>

            {/* 6. Evaluating Inventory Software */}
            <div
              ref={(el) => {
                sectionRefs.current['software'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Evaluating Hardware Inventory Management Software
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Phase 1: Needs Assessment</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>How many devices do you have?</li>
                    <li>What features do you need?</li>
                    <li>What is your budget?</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Phase 2: Software Evaluation</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Research available options (Lansweeper, Spiceworks, GLPI, etc.)</li>
                    <li>Use free trials and demos</li>
                    <li>Read user reviews</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Phase 3: Key Evaluation Criteria</h4>
                  <Table
                    headers={["Criteria", "What to Look For"]}
                    rows={[
                      ["Discovery & Asset Tracking", "Can it automatically find devices and track changes?"],
                      ["Reporting & Analytics", "Does it generate useful reports on inventory and trends?"],
                      ["Scalability & Security", "Will it grow with the organisation? Is data secure?"],
                      ["Ease of Use & Integration", "Is the interface simple? Does it connect with existing tools?"],
                      ["Vendor Support", "Does the vendor provide training, updates, and help?"],
                    ]}
                  />
                </div>
              </div>

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which phase of software evaluation involves understanding your organisation's size and feature needs?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 0)} /> a) Needs Assessment
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 0)} /> b) Software Evaluation
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 2, 0)} /> c) Key Criteria
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 0 ? '✅ Correct! Needs Assessment is the first phase.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
              </div>
            </div>

            {/* 7. Inventory Reports */}
            <div
              ref={(el) => {
                sectionRefs.current['reports'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Inventory Reports — Two Types You Must Know
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><FileText size={14} /> Status Report</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A regular snapshot showing the CURRENT STATE of all hardware — counts, types, locations, users. Generated routinely (e.g., monthly).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><AlertTriangle size={14} /> Exception Report</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Generated after physical verification, highlighting DISCREPANCIES — missing hardware, unauthorised devices, configuration mismatches. Shows what's WRONG.</p>
                </div>
              </div>

              {/* Quiz 5 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which type of report highlights discrepancies found during physical verification?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 0, 1)} /> a) Status Report
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 1, 1)} /> b) Exception Report
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 2, 1)} /> c) Audit Report
                  </label>
                </div>
                {showQuiz5Result && (
                  <div className={`mt-2 p-2 rounded ${quiz5Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz5Answer === 1 ? '✅ Correct! Exception reports show discrepancies.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 8. Practice Exercises */}
            <div
              ref={(el) => {
                sectionRefs.current['practice'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Practice Exercise Questions & Answers
              </h2>

              <QuestionReveal
                question="Q1. List and explain FIVE reasons why hardware inventory management is important."
                answer="1. Improved Asset Visibility — Gives IT management a clear, accurate picture of all hardware assets.\n\n2. Enhanced Security — Helps detect missing or unauthorised hardware quickly.\n\n3. Streamlined Maintenance — Enables proper scheduling of preventive maintenance and spare parts management.\n\n4. Cost Control — Tracks hardware lifecycles and enables proactive replacement planning.\n\n5. Disaster Recovery Planning — Provides accurate information on all critical systems for faster recovery."
              />

              <QuestionReveal
                question="Q2. List SIX data points that should be recorded in a hardware inventory list."
                answer="1. Hardware Type\n2. Manufacturer and Model\n3. Serial Number\n4. Location\n5. User or Department\n6. Warranty Information\n\n*(Also acceptable: IP Address, Software Installed, Notes)*"
              />

              <QuestionReveal
                question="Q3. What is routine physical verification and why is it important?"
                answer="Routine physical verification is the process of physically checking all hardware assets against the inventory list to confirm accuracy. It is important because it improves data accuracy, enhances security by detecting missing or unauthorised hardware, and identifies underutilised resources."
              />

              <QuestionReveal
                question="Q4. How frequently should physical verification be conducted for different inventory sizes?"
                answer="Small (less than 50 devices): Quarterly (every 3 months).\nMedium (50–250 devices): Bi-annual (every 6 months).\nLarge (more than 250 devices): Annual (once a year)."
              />

              <QuestionReveal
                question="Q5. Differentiate between a Hardware Inventory Status Report and a Hardware Inventory Exception Report."
                answer="A Status Report shows the current state of all hardware assets — what you HAVE. An Exception Report highlights discrepancies found during verification — what is WRONG."
              />

              <QuestionReveal
                question="Q6. List THREE methods of data collection for hardware inventory."
                answer="1. Manual Inventory — Physically inspect each device.\n2. Automated Discovery Tools — Software scans the network.\n3. Existing Records — Use purchase invoices and old IT records."
              />
            </div>

            {/* 9. Exam Tips */}
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Know the 8 Reasons</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Asset visibility, Security, Resource management, Maintenance, Software licensing, Disaster recovery, Cost control, Auditing – be able to explain each.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Data Points</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Know at least 6 data points for an inventory record (type, model, serial, location, user, warranty).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Physical Verification</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Understand why it's done, frequency based on size, and the step-by-step process.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Reports</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Status Report (snapshot) vs Exception Report (discrepancies) – know the difference.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Software Evaluation</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Three phases: Needs Assessment, Software Evaluation, Key Criteria – and the 5 criteria.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Track it. Verify it. Report it. Own it. 📋</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Inventory Insight
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
                  <span>Reasons for Inventory</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Report Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">2</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Hardware Inventory Management is the foundation of good IT governance. Think of it as being the "guardian" of an organisation's most valuable equipment. Knowing exactly what you have and where it is makes the difference between a well-run IT department and a chaotic one.
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
                <strong className="text-white">Hardware inventory management</strong> is the detailed tracking of all IT assets – critical for security, maintenance, and cost control.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">8 reasons</strong> make it crucial: asset visibility, security, resource optimisation, maintenance, software licensing, disaster recovery, cost control, and auditing.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Key data points</strong> include type, model, serial number, location, user, and warranty – these form the foundation of your inventory.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Physical verification</strong> ensures accuracy; frequency depends on organisation size (quarterly for small, annual for large).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Inventory software</strong> should be evaluated based on discovery, reporting, scalability, ease of use, and vendor support.
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
            Sidemann Academic Registry • Hardware Inventory Management 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome8;