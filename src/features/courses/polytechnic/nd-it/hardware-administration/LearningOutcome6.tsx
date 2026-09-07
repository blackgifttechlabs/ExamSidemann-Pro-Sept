import React, { useState, useEffect, useRef } from 'react';
import {
  Wrench,
  ClipboardList,
  Calendar,
  Boxes,
  FileText,
  GraduationCap,
  Users,
  Lightbulb,
  Shield,
  Eye,
  Sliders,
  Download,
  Handshake,
  Zap,
  FlaskConical,
  Fan,
  HardDrive,
  Server,
  Cog,
  CheckCircle,
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
  Clock,
  AlertCircle,
  Activity,
  Gauge,
  Monitor,
  Power,
  ListChecks,
  Component,
  SquareStack,
  Cable,
  PlugZap,
  Thermometer,
  ShieldCheck,
  Trash2,
  Upload,
  Cloud,
  GitBranch,
  Zap as ZapIcon,
  Wifi,
  CloudOff,
  HardDrive as HardDriveIcon,
} from 'lucide-react';
import { AdSense } from '../../../../analytics/AdSense';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'factors', label: 'Factors' },
  { id: 'types', label: 'Types' },
  { id: 'tools', label: 'Tools' },
  { id: 'informing-users', label: 'Informing Users' },
  { id: 'impact', label: 'Impact' },
  { id: 'procedure', label: 'Procedure' },
  { id: 'automated', label: 'Automated' },
  { id: 'evaluation', label: 'Evaluation' },
  { id: 'practice', label: 'Practice' },
  { id: 'exam-tips', label: 'Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome6: React.FC = () => {
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
        text: 'Preventive maintenance is like servicing your car – regular checks prevent costly breakdowns and extend the life of your hardware.',
      },
      {
        title: 'Pro Tip',
        text: 'Always inform users about scheduled maintenance at least 48 hours in advance to minimise disruption.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 10 factors with the acronym "HICMSDTMBC" – Hardware Inventory, Criticality, Maintenance types, Schedule, Spare parts, Documentation, Training, Monitoring, Budgeting, Compliance.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse corrective maintenance (fixing broken things) with preventive maintenance (preventing breakage). They are two different approaches.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Preventive maintenance is like servicing your car – regular checks prevent costly breakdowns and extend the life of your hardware.',
      },
      {
        title: 'Pro Tip',
        text: 'Always inform users about scheduled maintenance at least 48 hours in advance to minimise disruption.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 10 factors with the acronym "HICMSDTMBC" – Hardware Inventory, Criticality, Maintenance types, Schedule, Spare parts, Documentation, Training, Monitoring, Budgeting, Compliance.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse corrective maintenance (fixing broken things) with preventive maintenance (preventing breakage). They are two different approaches.',
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

  const [showQuiz1Result, setShowQuiz1Result] = useState(false);
  const [showQuiz2Result, setShowQuiz2Result] = useState(false);
  const [showQuiz3Result, setShowQuiz3Result] = useState(false);
  const [showQuiz4Result, setShowQuiz4Result] = useState(false);

  const checkAnswer = (quizNumber: number, selectedAnswer: number, correctAnswer: number) => {
    switch (quizNumber) {
      case 1:
        setQuiz1Answer(selectedAnswer);
        setShowQuiz1Result(true);
        break;
      case 2:
        setQuiz2Answer(selectedAnswer);
        setShowQuiz2Result(true);
        break;
      case 3:
        setQuiz3Answer(selectedAnswer);
        setShowQuiz3Result(true);
        break;
      case 4:
        setQuiz4Answer(selectedAnswer);
        setShowQuiz4Result(true);
        break;
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
            className="text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
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
      <header className="bg-[#134e4a] dark:bg-[#042f2e] border-b border-teal-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Database size={14} className="inline mr-1" /> HARDWARE MAINTENANCE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 6{' '}
            <span className="text-cyan-300 font-bold italic">
              Hardware Maintenance Plan
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the art of keeping IT hardware reliable and long‑lasting — from
            planning maintenance schedules to using the right tools and documenting
            everything correctly.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Wrench size={14} className="inline mr-1" /> Maintenance
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ClipboardList size={14} className="inline mr-1" /> Planning
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
                placeholder="Search for a factor, tool, or procedure..."
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
                What is a Hardware Maintenance Plan?
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Think of a hardware maintenance plan like servicing your car or your generator at home. You don't wait for the car to break down in the middle of Harare CBD before you check the oil — you service it regularly to avoid problems! A hardware maintenance plan is exactly that — a written, organised schedule that tells IT people <strong>WHAT</strong> to maintain, <strong>WHEN</strong> to maintain it, and <strong>HOW</strong> to do it.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Exam Highlight</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  <strong>The examiner loves asking "List and explain factors to consider when preparing a hardware maintenance plan."</strong> There are <strong>10 factors</strong> — memorise all 10!
                </p>
              </div>
            </div>

            {/* 2. The 10 Factors */}
            <div
              ref={(el) => {
                sectionRefs.current['factors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The 10 Factors to Consider
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><Boxes size={14} /> 1. Hardware Inventory</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A complete list of all computer equipment — type, model, configuration, warranty details, location. Helps IT staff know exactly what they are working with and avoid unnecessary spending.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><Eye size={14} /> 2. Criticality Assessment</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Rank computers by importance. Critical systems (servers, medical equipment) must be maintained more frequently and fixed immediately.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><Cog size={14} /> 3. Maintenance Types</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Decide which maintenance approach is best suited for each piece of hardware. Using the wrong type wastes time and money. There are 6 types of maintenance.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1"><Calendar size={14} /> 4. Maintenance Schedule</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A timetable stating when each maintenance task must happen — daily, weekly, monthly, annually. Choosing the right time (e.g., off-peak hours) minimises disruption.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><Boxes size={14} /> 5. Spare Parts Inventory</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Keep commonly needed replacement parts (RAM, hard drives, fans) in stock. Minimises downtime.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"><FileText size={14} /> 6. Documentation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Record what maintenance was done, when, and why. Creates a history, helps identify patterns, and aids future technicians.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1"><GraduationCap size={14} /> 7. Training</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Ensure IT staff know the correct and safe way to maintain hardware. Reduces mistakes and prevents damage.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1"><Activity size={14} /> 8. Monitoring and Logging</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Use software to continuously watch performance (temperatures, fan speeds, CPU usage). Log readings over time to spot warning signs early.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle size={14} /> 9. Budgeting</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Set aside money to cover all maintenance costs — spare parts, tools, software licenses, technician fees. Proactive budgeting is cheaper than emergency spending.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1"><Shield size={14} /> 10. Compliance</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Follow industry standards, government regulations, and data security laws. Includes properly destroying data on old hard drives.</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">📌 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Remember there are exactly <strong>10 factors</strong> — the examiner may ask you to list them! Each factor has a specific purpose in the maintenance plan.</p>
              </div>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which factor ensures that IT staff have the proper skills to perform maintenance safely?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 1)} /> a) Documentation
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 1)} /> b) Training
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 1)} /> c) Budgeting
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 1 ? '✅ Correct! Training ensures staff are skilled and safe.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 3. The 6 Types of Maintenance */}
            <div
              ref={(el) => {
                sectionRefs.current['types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The 6 Types of Hardware Maintenance
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><Shield size={14} /> 1. Preventive Maintenance</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">The most common type! Regular, planned maintenance done BEFORE anything goes wrong. Includes cleaning dust, tightening connections, replacing thermal paste. Goal: PREVENT failures. "Prevention is better than cure."</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1"><Eye size={14} /> 2. Predictive Maintenance</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Uses monitoring tools and data analysis to PREDICT when a component is likely to fail BEFORE it does. Example: increasing hard drive errors predict imminent failure. More advanced, used in large organisations.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><Wrench size={14} /> 3. Corrective Maintenance</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">REACTIVE — fixing something that has ALREADY broken. Example: a computer won't start, printer stops working. Goal is to fix quickly to reduce downtime. Relying ONLY on this is the most expensive approach.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><Sliders size={14} /> 4. Condition-Based Maintenance</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Maintain based on the ACTUAL CONDITION of the hardware. Check dust levels — only clean if there's significant build-up. Check temperatures — only replace thermal paste if temps are too high. Efficient because resources are only used when needed.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1"><Download size={14} /> 5. Software Updates</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Keeping drivers and firmware up to date ensures hardware performs well, maintains compatibility, and stays secure. Regular updates are essential for security hardware like firewalls and routers.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1"><Handshake size={14} /> 6. Vendor Maintenance Agreements</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Service contracts with the manufacturer/supplier. Their technicians come to service equipment regularly and replace faulty parts. Common for expensive servers and enterprise hardware.</p>
                </div>
              </div>

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which type of maintenance is performed BEFORE a failure occurs?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 0)} /> a) Preventive maintenance
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 0)} /> b) Corrective maintenance
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 2, 0)} /> c) Vendor maintenance
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 0 ? '✅ Correct! Preventive maintenance aims to stop failures before they happen.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Tools */}
            <div
              ref={(el) => {
                sectionRefs.current['tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Types of Tools Used in Hardware Maintenance
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-1"><Zap size={14} /> ESD (Electrostatic Discharge) Tools</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Static electricity can destroy computer chips. ESD tools prevent this by redirecting static away from components.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-sm">ESD Wrist Strap</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Worn on wrist, connects you to ground</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-sm">Anti-Static Mat</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Placed on workbench to dissipate static</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-sm">ESD Bags</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Shielded bags for storing/transporting components</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><Wrench size={14} /> Hand Tools</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-sm">Screwdrivers</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Phillips, Flathead, Torx</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-sm">Needle-nose Pliers</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">For tiny components</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-sm">Spudger</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Plastic pry tool for gentle opening</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-sm">Flashlight</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">To see inside dark computer cases</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1"><FlaskConical size={14} /> Diagnostic Tools</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-sm">Multimeter</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Measures voltage, current, resistance</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-sm">Memory Diagnostic</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Tests RAM for errors (MemTest86)</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-sm">Benchmarking Tools</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Stress tests CPU/GPU (Cinebench)</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-sm">System Monitoring</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Monitors temperatures & performance</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1"><Fan size={14} /> Cleaning Tools</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-sm">Compressed Air Can</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Blows dust from vents, fans, keyboards</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-sm">Microfiber Cloth</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Lint-free cloth for screens and surfaces</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="font-bold block text-sm">Cotton Swabs</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">For cleaning tight/delicate areas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Informing Users */}
            <div
              ref={(el) => {
                sectionRefs.current['informing-users'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Why Inform Users About Scheduled Maintenance?
              </h2>

              <Table
                headers={["#", "Reason", "Simple Meaning"]}
                rows={[
                  ["1", "Minimises Disruption", "Users can plan around the downtime"],
                  ["2", "Sets Expectations", "No one is surprised when things go offline"],
                  ["3", "Improves User Experience", "Shows respect for users' time"],
                  ["4", "Reduces Support Tickets", "Fewer 'my computer is broken!' calls"],
                  ["5", "Encourages User Preparation", "Users save their work first"],
                  ["6", "Transparency & Trust", "Builds confidence in IT department"],
                  ["7", "Identifying Critical Tasks", "Users can flag urgent work that can't stop"],
                  ["8", "Feedback Opportunities", "Users can share concerns or suggestions"],
                ]}
                title="8 Reasons to Inform Users"
              />
            </div>

            {/* 6. Determining Impact */}
            <div
              ref={(el) => {
                sectionRefs.current['impact'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Determining the Impact of Maintenance on Users
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Before doing maintenance, IT staff need to think about HOW MUCH it will affect the people using the computers. Not all maintenance affects everyone equally.</p>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Factors affecting impact:</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Type of Hardware</strong> — Maintaining a server affects EVERYONE. Maintaining one person's mouse affects almost nobody.</li>
                  <li><strong>Maintenance Duration</strong> — 30 minutes of downtime is less disruptive than 8 hours.</li>
                  <li><strong>Time of Day</strong> — 2am maintenance affects almost no one. 10am maintenance affects everyone!</li>
                  <li><strong>Applications Used</strong> — If users depend heavily on a specific system (like a payroll system on payday!), impact is HUGE.</li>
                </ul>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2">How to assess impact:</h4>
                <ol className="list-decimal pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Identify which systems will be affected</li>
                  <li>Count how many users will be affected</li>
                  <li>Check which applications they use</li>
                  <li>Communicate clearly what will and won't be available</li>
                </ol>
              </div>
            </div>

            {/* 7. Maintenance Procedure */}
            <div
              ref={(el) => {
                sectionRefs.current['procedure'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Hardware Maintenance Procedure (Step-by-Step)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><CheckCircle size={14} /> PHASE 1: PREPARATION</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Schedule & Communicate — Tell users when maintenance will happen</li>
                    <li>Backup Data — Save all important data before starting</li>
                    <li>Set Up Work Area — Clean, well-lit, ESD-safe workspace</li>
                    <li>Power Down & Disconnect — Safely shut down and unplug everything</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><Wrench size={14} /> PHASE 2: DOING THE MAINTENANCE</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Physical Cleaning — Use compressed air to blow out dust</li>
                    <li>Visual Inspection — Look for burnt components, loose cables, damage</li>
                    <li>Thermal Paste Replacement — Optional but recommended for CPUs running hot</li>
                    <li>Component Tightening — Make sure all RAM, cards, and cables are firmly seated</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><Cog size={14} /> PHASE 3: REASSEMBLY & TESTING</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Reassemble — Put everything back carefully</li>
                    <li>Power Up — Reconnect power and switch on</li>
                    <li>System Monitoring — Check temperatures and fan speeds immediately</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1"><FileText size={14} /> PHASE 4: FINAL STEPS</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Documentation — Write down everything you did</li>
                    <li>User Notification — Tell users maintenance is complete and they can resume work</li>
                  </ul>
                </div>
              </div>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What is the first phase of a hardware maintenance procedure?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 1)} /> a) Reassembly and Testing
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 1)} /> b) Preparation
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 2, 1)} /> c) Documentation
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 1 ? '✅ Correct! Preparation includes scheduling, backup, and setting up the workspace.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 8. Automated Tools */}
            <div
              ref={(el) => {
                sectionRefs.current['automated'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Automated Tools for Hardware Maintenance
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><Activity size={14} /> System Monitoring Software</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Watches temperatures, fan speeds, CPU usage in real-time.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><Download size={14} /> Driver Updaters</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Automatically scans and updates outdated hardware drivers.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><HardDrive size={14} /> Disk Defragmentation Tools</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Organises data on hard drives for faster performance.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><Cog size={14} /> Firmware Update Utilities</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Updates the built-in software on hardware components.</p>
                </div>
              </div>
            </div>

            {/* 9. Evaluating and Documenting */}
            <div
              ref={(el) => {
                sectionRefs.current['evaluation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Evaluating and Documenting Maintenance
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><CheckCircle size={14} /> After maintenance, check these 4 things:</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><strong>System Stability</strong> — Does the computer crash or shut down unexpectedly?</li>
                    <li><strong>Temperature Monitoring</strong> — Are temperatures back to normal levels?</li>
                    <li><strong>Performance Monitoring</strong> — Run benchmarks. Is the computer as fast as expected?</li>
                    <li><strong>User Feedback</strong> — Ask the users! Did maintenance solve their reported problems?</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><FileText size={14} /> What to write in your documentation:</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Date & Time of maintenance</li>
                    <li>System Info — Which computer/hardware?</li>
                    <li>Maintenance Performed — What tasks did you do?</li>
                    <li>Observations — What did you notice?</li>
                    <li>Parts Replaced — What was swapped out and why?</li>
                    <li>Testing Results — What happened when you tested it?</li>
                    <li>Next Steps — Any follow-up actions needed?</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 10. Practice Exercises */}
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
                question="Q1. List and briefly explain FIVE factors to consider when preparing a hardware maintenance plan."
                answer="1. Hardware Inventory — Maintain a complete list of all hardware assets including model, location, and warranty info.\n2. Criticality Assessment — Rank hardware by importance so critical systems get priority maintenance.\n3. Maintenance Schedule — Create a timetable for when each maintenance task will be performed.\n4. Spare Parts Inventory — Keep common replacement parts in stock to reduce downtime.\n5. Documentation — Record all maintenance activities for future reference and troubleshooting."
              />

              <QuestionReveal
                question="Q2. Differentiate between preventive and corrective maintenance."
                answer="Preventive maintenance is PROACTIVE — it is done on a regular schedule BEFORE any failure occurs, with the goal of preventing problems. For example, cleaning dust every month. Corrective maintenance is REACTIVE — it is done AFTER a failure has already occurred, with the goal of fixing the problem. For example, replacing a fan that has stopped working. Preventive is cheaper in the long run; corrective is unavoidable but more expensive and disruptive."
              />

              <QuestionReveal
                question="Q3. What are ESD tools and why are they important?"
                answer="ESD stands for Electrostatic Discharge. ESD tools are specially designed to prevent static electricity from damaging sensitive computer components. Examples include the ESD wrist strap (connects the technician to ground), anti-static mat (placed on the workbench), and ESD bags (for storing components). They are important because even a small, imperceptible static shock can permanently destroy components like RAM and CPUs."
              />

              <QuestionReveal
                question="Q4. Give FOUR reasons why users should be informed about scheduled hardware maintenance."
                answer="1. Minimises Disruption — Users can plan their work around the maintenance window.\n2. Sets Expectations — Users know in advance that systems will be unavailable.\n3. Encourages User Preparation — Users can save their work and back up important files.\n4. Reduces Support Tickets — Informed users won't flood IT support with 'my computer is down' calls."
              />

              <QuestionReveal
                question="Q5. List the FOUR phases of a hardware maintenance procedure."
                answer="1. Preparation — Schedule maintenance, communicate with users, back up data, set up workspace, power down.\n2. Maintenance — Physical cleaning, visual inspection, thermal paste replacement, component tightening.\n3. Reassembly and Testing — Put everything back, power on, monitor temperatures and fan speeds.\n4. Final Steps — Document everything and notify users that maintenance is complete."
              />

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which type of maintenance uses monitoring data to predict failures?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 2)} /> a) Preventive
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 2)} /> b) Corrective
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 2, 2)} /> c) Predictive
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 2 ? '✅ Correct! Predictive maintenance uses data to foresee failures.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Know the 10 Factors</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Be able to list and explain all 10 factors: Inventory, Criticality, Types, Schedule, Spare Parts, Documentation, Training, Monitoring, Budgeting, Compliance.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Differentiate Maintenance Types</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Preventive (proactive), Predictive (data-driven), Corrective (reactive), Condition-based, Software updates, Vendor agreements.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 ESD Tools & Importance</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Wrist strap, mat, bags. They prevent static damage to components.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 User Communication</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Inform users to minimise disruption and set expectations. Give advance notice.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Documentation</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Record everything – date, steps, observations, results. Creates a valuable history.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Plan it. Maintain it. Document it. 💪</p>
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
                  <span>Maintenance Factors</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Maintenance Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Hardware maintenance is common sense – treat your computers the way you'd treat your own valuable possessions. Study these concepts, relate them to everyday life, and you'll ace this exam!
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
                <strong className="text-white">A hardware maintenance plan</strong> is a written schedule that tells what, when, and how to maintain equipment.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">10 factors</strong> must be considered: inventory, criticality, maintenance types, schedule, spare parts, documentation, training, monitoring, budgeting, and compliance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">6 maintenance types</strong> – preventive, predictive, corrective, condition‑based, software updates, vendor agreements – each with a specific purpose.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Tools</strong> include ESD protection, hand tools, diagnostics, and cleaning supplies. Use them correctly.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Communicate with users</strong> to minimise disruption, and <strong>document everything</strong> for future reference.
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
            Sidemann Academic Registry • Hardware Maintenance Plan 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome6;