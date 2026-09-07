import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Wifi,
  MapPin,
  Activity,
  Shield,
  Search,
  RefreshCw,
  ChevronUp,
  X,
  BookOpen,
  Lightbulb,
  GraduationCap,
  Brain,
  Server,
  Database,
  HardDrive,
  Cloud,
  Lock,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Thermometer,
  Droplet,
  Radio,
  Satellite,
  Phone,
  Globe,
  DollarSign,
  TrendingUp,
  Share2,
  Download,
  Upload,
  Settings,
  Cog,
  BarChart3,
  ListChecks,
  ClipboardCheck,
  Clipboard,
  Component,
  Cable,
  Plug,
  Power,
  Monitor,
  Cpu,
  Microchip,
  Network,
  Printer,
  Smartphone,
  Tablet,
  Laptop,
  Server as ServerIcon,
  Database as DatabaseIcon,
  Cloud as CloudIcon,
  Wifi as WifiIcon,
  ClipboardList,
  Eye,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'site-survey-steps', label: 'Site Survey Steps' },
  { id: 'site-survey-continued', label: 'Site Survey (cont.)' },
  { id: 'environmental-factors', label: 'Environmental Factors' },
  { id: 'user-requirements-1', label: 'User Requirements (Pt 1)' },
  { id: 'user-requirements-2', label: 'User Requirements (Pt 2)' },
  { id: 'internet-tech-1', label: 'Internet Tech (Pt 1)' },
  { id: 'internet-tech-2', label: 'Internet Tech (Pt 2)' },
  { id: 'budget-devices', label: 'Budget & Devices' },
  { id: 'devices-continued', label: 'Devices (cont.)' },
  { id: 'services-ip', label: 'Services & IP' },
  { id: 'exam-tips', label: 'Exam Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome1: React.FC = () => {
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
        text: 'A network site survey is like doing homework before a big project – it helps avoid costly mistakes and ensures optimal performance.',
      },
      {
        title: 'Pro Tip',
        text: 'Always check building materials during a site survey – concrete and brick are the biggest Wi-Fi killers.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 6 steps of a site survey: Plan, Inspect, Measure, Record, Report, Review & Approve.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a router (connects networks) with a switch (connects devices within a network). They serve different purposes.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'A network site survey is like doing homework before a big project – it helps avoid costly mistakes and ensures optimal performance.',
      },
      {
        title: 'Pro Tip',
        text: 'Always check building materials during a site survey – concrete and brick are the biggest Wi-Fi killers.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 6 steps of a site survey: Plan, Inspect, Measure, Record, Report, Review & Approve.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a router (connects networks) with a switch (connects devices within a network). They serve different purposes.',
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

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Wifi size={14} className="inline mr-1" /> NETWORK SITE SURVEY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 1{' '}
            <span className="text-emerald-300 font-bold italic">
              Network Site Survey
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the systematic process of site surveys – from planning and
            inspection to signal measurement, reporting, and environmental
            factors that affect network performance.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <MapPin size={14} className="inline mr-1" /> Survey
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Wifi size={14} className="inline mr-1" /> Wi-Fi
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
                placeholder="Search for a concept, step, or technology..."
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
                What Is a Network Site Survey?
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A network site survey is a thorough investigation and evaluation of a physical location to determine the best way to design and set up a computer network. It involves walking through the space, gathering information, measuring signals, and creating a plan that ensures optimal performance, coverage, and security.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Imagine your school decided to build a new sports hall. Before they start laying bricks, the builders will first come and look at the ground – is it flat? Is it rocky? Is there enough space? They measure everything, check for problems, and only then do they start building. A network site survey is exactly the same idea, but for computer networks.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">What a Site Survey Looks At</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li>How big is the space?</li>
                  <li>What are the walls made of?</li>
                  <li>Where are the power sockets?</li>
                  <li>Are there things in the building that might block or interfere with Wi-Fi signals?</li>
                  <li>How many people will be using the network and where will they be sitting?</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">If an exam question asks you to define a network site survey, always mention TWO things: (1) it is a physical evaluation of a space, and (2) its purpose is to determine the best setup for a network infrastructure.</p>
              </div>
            </div>

            {/* 2. Site Survey Steps (Part 1) */}
            <div
              ref={(el) => {
                sectionRefs.current['site-survey-steps'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Conducting a Site Survey – Step by Step (Part 1)
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">We'll use a coffee shop as our ongoing example – imagine you've been hired to set up the Wi-Fi and network for a brand new coffee shop.</p>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><ClipboardCheck size={14} /> Step 1: Planning and Preparation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Before you even set foot in the building, you need to plan what you're going to do.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><strong>Define the scope:</strong> How many users? What will they do (browsing, payments, etc.)? How much bandwidth is needed?</li>
                    <li><strong>Get building blueprints:</strong> Floor plans help you mark where equipment will go.</li>
                    <li><strong>Gather survey tools:</strong> Wi-Fi analyzer, heatmap software, notebook, measuring tape.</li>
                    <li><strong>Schedule the survey:</strong> Choose a time that causes least disruption (e.g., before opening or after closing).</li>
                  </ul>
                </div>

                {/* Step 2 */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><Eye size={14} /> Step 2: Site Inspection</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Physically walk through the space and observe everything.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><strong>Building materials:</strong> Concrete/brick attenuate signals heavily; glass and wood are easier; metal reflects signals.</li>
                    <li><strong>Interference sources:</strong> Microwave ovens, cordless phones, fluorescent lights – these can disrupt Wi-Fi.</li>
                    <li><strong>Power outlets:</strong> Check where electricity is available – every device needs power.</li>
                    <li><strong>Existing cabling:</strong> Are there old network cables that can be reused?</li>
                  </ul>
                </div>

                {/* Step 3 */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1"><Activity size={14} /> Step 3: Signal Strength Measurement</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Measure Wi-Fi signal strength at many points across the building using a Wi-Fi analyzer.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Take readings near the entrance, in the middle, in corners, behind walls, in bathrooms, and in the kitchen.</li>
                    <li>Identify <strong>dead zones</strong> – areas with weak or no signal.</li>
                    <li>Use software to create a <strong>heatmap</strong> – a colour-coded picture showing signal coverage.</li>
                  </ul>
                </div>
              </div>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which building material is the WORST for Wi-Fi signal penetration?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 1)} /> a) Glass
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 1)} /> b) Concrete
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 1)} /> c) Wood
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 1 ? '✅ Correct! Concrete and brick attenuate signals heavily.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Site Survey Steps (Part 2) */}
            <div
              ref={(el) => {
                sectionRefs.current['site-survey-continued'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Conducting a Site Survey – Step by Step (Part 2)
              </h2>

              <div className="space-y-6">
                {/* Step 4 */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><FileText size={14} /> Step 4: Data Recording and Analysis</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Organize and analyze all gathered information.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><strong>Record</strong> – notes, photographs, measurements, marked-up floor plans.</li>
                    <li><strong>Analyze</strong> – identify dead zones, interference sources, and constraints.</li>
                    <li>Example: A dead zone caused by a thick concrete wall may require an access point on the other side.</li>
                  </ul>
                </div>

                {/* Step 5 */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><ClipboardList size={14} /> Step 5: Report Generation and Recommendations</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Create a formal report for the client with your findings and recommendations.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Executive summary of findings</li>
                    <li>Signal strength measurements and heatmaps</li>
                    <li>Recommended placement of access points, cabling, and equipment</li>
                    <li>Solutions for problems (e.g., signal boosters, shielded cables)</li>
                    <li>Cost estimates (optional)</li>
                  </ul>
                </div>

                {/* Step 6 */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle size={14} /> Step 6: Review and Approval</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Share the report with the client and get their approval before any physical work begins.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Client may have preferences or budget constraints.</li>
                    <li>Address questions and concerns.</li>
                    <li>Only after approval should installation proceed.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Additional Important Considerations</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Security:</strong> Should the network have separate guest and staff networks? (Network segmentation)</li>
                  <li><strong>Scalability:</strong> Will the network need to grow in the future? Plan for expansion.</li>
                  <li><strong>Compliance:</strong> Some industries (hospitals, banks) have strict regulatory requirements.</li>
                </ul>
              </div>

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What is the final step before starting physical installation?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 2)} /> a) Signal measurement
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 2)} /> b) Report generation
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 2, 2)} /> c) Review and approval
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 2 ? '✅ Correct! Review and approval must happen before installation.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Environmental Factors */}
            <div
              ref={(el) => {
                sectionRefs.current['environmental-factors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Environmental Factors and Network Design
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">The physical environment – the building, temperature, dust, and electrical equipment – all have a huge impact on network performance.</p>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">Physical Obstructions</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Walls and Materials</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><strong>Concrete/brick:</strong> High attenuation (signal loss).</li>
                    <li><strong>Metal:</strong> Reflects signals, causes interference.</li>
                    <li><strong>Glass/wood:</strong> Low attenuation, pass signals easily.</li>
                    <li><strong>Water:</strong> Absorbs signals – fish tanks or many people can weaken signals.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Furniture & Equipment</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Large metal furniture (shelving, filing cabinets) can block and reflect signals just like walls.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Distance</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">The further away from a router/access point, the weaker the signal. Wired Ethernet has a maximum cable length of 100 meters before signal degradation.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Electromagnetic Interference (EMI)</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><strong>Microwave ovens</strong> – operate at 2.4 GHz, disrupt Wi-Fi.</li>
                    <li><strong>Cordless phones</strong> – same frequency.</li>
                    <li><strong>Fluorescent lights</strong> – produce electrical noise that can interfere with data cables.</li>
                    <li><strong>Industrial equipment</strong> – motors, generators, welding equipment.</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Environmental Conditions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Temperature</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Too hot = overheating, malfunctions; too cold = condensation, component damage. Keep equipment in climate-controlled rooms.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Humidity</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">High moisture causes corrosion and short circuits. Use dehumidifiers in equipment rooms.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Dust and Debris</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Dust clogs vents, causes overheating. Use dust filters, schedule regular cleaning.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Security Considerations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Physical Security</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Locked equipment cabinets, server rooms with restricted access, security cameras, access logs.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Signal Leakage</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Wi-Fi signals can extend beyond the building. Use directional antennas or reduce transmit power to keep signals inside.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Additional Factors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Power Availability</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Ensure enough outlets, reliable supply, and backup power (UPS) for critical equipment.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400">Existing Infrastructure</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Check for old cables that can be reused – but test them first for speed and damage.</p>
                </div>
              </div>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which of the following is a common source of electromagnetic interference for Wi-Fi?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 0)} /> a) Microwave oven
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 0)} /> b) Glass windows
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 2, 0)} /> c) Wooden desks
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 0 ? '✅ Correct! Microwave ovens are a common EMI source at 2.4 GHz.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
              </div>
            </div>

            {/* 5. Gathering User Requirements (Part 1) */}
            <div
              ref={(el) => {
                sectionRefs.current['user-requirements-1'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Gathering User Requirements – Part 1
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Before designing a network, you need to understand exactly what the people who will USE the network actually need. There are four main methods for gathering this information.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Method 1: Interviews</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">A direct, face-to-face (or online) conversation with users or representatives.</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Advantages:</strong> In-depth exploration, clarification, non-verbal cues, building trust.</li>
                  <li><strong>Types:</strong> One-on-one or group interviews.</li>
                  <li><strong>Challenges:</strong> Time-consuming, interviewer bias, user availability, social desirability bias.</li>
                  <li><strong>Overcoming:</strong> Pilot interviews, train interviewers, offer incentives, guarantee anonymity.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Method 2: Questionnaires</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">A written list of questions that users answer on their own.</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Advantages:</strong> Efficiency at scale, easy data analysis, anonymity.</li>
                  <li><strong>Limitations:</strong> Limited exploration, misinterpretation, lower response rates (response bias).</li>
                  <li><strong>Design tips:</strong> Clear language, variety of question types (multiple choice, Likert scale, open-ended), pilot testing.</li>
                </ul>
              </div>

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which method allows for immediate clarification of vague answers?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 0)} /> a) Interviews
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 0)} /> b) Questionnaires
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 0 ? '✅ Correct! Interviews allow immediate clarification.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
              </div>
            </div>

            {/* 6. Gathering User Requirements (Part 2) */}
            <div
              ref={(el) => {
                sectionRefs.current['user-requirements-2'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Gathering User Requirements – Part 2
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">Method 3: Observation</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Watching users as they work and interact with the network in their natural environment.</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Advantages:</strong> Unbiased, real-world data; contextual understanding.</li>
                  <li><strong>Challenges:</strong> Hawthorne Effect (people change behavior when watched), limited scope, ethical considerations.</li>
                  <li><strong>How to observe well:</strong> Plan what to look for, document carefully, triangulate with other methods.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Method 4: Published Documents</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Existing written materials – reports, manuals, research papers – that contain relevant information.</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Types:</strong> Departmental reports, industry research, technical documentation, social media analysis.</li>
                  <li><strong>Advantages:</strong> Cost-effective, broad scope, historical context.</li>
                  <li><strong>Limitations:</strong> May be outdated, may not be specific enough, accuracy concerns.</li>
                </ul>
              </div>

              {/* Quiz 5 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which method is most cost-effective for gathering requirements from a large number of users?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 0, 1)} /> a) Interviews
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 1, 1)} /> b) Questionnaires
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 2, 1)} /> c) Observation
                  </label>
                </div>
                {showQuiz5Result && (
                  <div className={`mt-2 p-2 rounded ${quiz5Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz5Answer === 1 ? '✅ Correct! Questionnaires are efficient for large numbers.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 7. Internet Technologies (Part 1) */}
            <div
              ref={(el) => {
                sectionRefs.current['internet-tech-1'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Service Providers & Internet Technologies – Part 1
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  An Internet Service Provider (ISP) provides the connection between your network and the internet. Different ISPs use different technologies to deliver that connection.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">DSL (Digital Subscriber Line)</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Uses existing telephone lines to carry internet data alongside voice calls.</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>How it works:</strong> A DSL filter separates voice and data; a DSLAM at the ISP's central office handles connections.</li>
                  <li><strong>Advantages:</strong> Widely available, affordable, always-on, faster than dial-up.</li>
                  <li><strong>Disadvantages:</strong> Speed decreases with distance from the central office, slower than fiber/cable, susceptible to interference.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Cable Broadband</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Uses the same coaxial cables that carry cable TV signals.</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>How it works:</strong> Splitter separates TV from internet; channel bonding combines multiple channels for faster speed; cable modem converts signal.</li>
                  <li><strong>Advantages:</strong> Fast speeds (up to 1 Gbps), widely available in urban areas.</li>
                  <li><strong>Disadvantages:</strong> Shared bandwidth (slower during peak times), asymmetric speeds (download faster than upload), installation costs.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Dial-Up Internet</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Uses a telephone line to dial a number and connect to the internet each time; then disconnect.</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Advantages:</strong> Simple setup, available almost anywhere with a phone line, very low cost.</li>
                  <li><strong>Disadvantages:</strong> Extremely slow (max 56 kbps), ties up phone line, not always on, unreliable.</li>
                </ul>
              </div>
            </div>

            {/* 8. Internet Technologies (Part 2) */}
            <div
              ref={(el) => {
                sectionRefs.current['internet-tech-2'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Service Providers & Internet Technologies – Part 2
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">PSTN (Public Switched Telephone Network)</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">The global infrastructure of telephone lines, exchanges, and switching equipment that makes traditional landline calls possible.</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>How it works:</strong> Telephone exchanges route calls through switches and trunks.</li>
                  <li><strong>Advantages:</strong> Very reliable, critical for emergencies (works when mobile networks are down), wide availability.</li>
                  <li><strong>Disadvantages:</strong> No mobility, aging infrastructure, limited features, vulnerable to physical damage.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Satellite Internet</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Uses satellites in orbit to transmit internet signals – valuable for remote locations.</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>How it works:</strong> Uplink from user to satellite, downlink from satellite to ISP ground station (or direct).</li>
                  <li><strong>Types of orbits:</strong> Geostationary (high latency) vs Low Earth Orbit (LEO – lower latency, modern constellations like Starlink).</li>
                  <li><strong>Advantages:</strong> Global coverage, disaster resilience, broadband speeds (modern LEO).</li>
                  <li><strong>Disadvantages:</strong> Latency (delay) – especially for GEO; weather dependence (rain fade); high cost; limited bandwidth.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Wireless / Untethered Communication</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Transmitting data without physical cables using electromagnetic waves (radio, microwave, infrared).</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>How it works:</strong> Modulation → propagation → reception → demodulation.</li>
                  <li><strong>Benefits:</strong> Mobility, convenience, innovation enabler, broad coverage.</li>
                  <li><strong>Challenges:</strong> Security (interception), range limitations, interference, bandwidth limitations.</li>
                  <li><strong>Future:</strong> 5G networks, Wi-Fi 6, millimeter wave (mmWave).</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">ISPs in Zimbabwe</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>TelOne:</strong> Government-owned – offers ADSL and Blaze (SIM-based mobile internet).</li>
                  <li><strong>Liquid Intelligent Technologies:</strong> Large fiber optic network – premium high-speed connectivity.</li>
                  <li><strong>Others:</strong> Powertel, ZOL (Wibroniks – wireless), NetOne (mobile data), Africom, Telecontract, Utande.</li>
                  <li><strong>Choosing an ISP:</strong> Consider coverage, speed, data allowance, pricing, customer service.</li>
                </ul>
              </div>
            </div>

            {/* 9. Budget & Devices (Part 1) */}
            <div
              ref={(el) => {
                sectionRefs.current['budget-devices'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Budget & Network Devices (Part 1)
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">The Network Budget</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Financial planning document that ensures you have enough money to build, run, and maintain the network.</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Capital Expenditure (CapEx):</strong> One-time, large purchases – hardware (routers, switches, servers), software licenses, cabling.</li>
                  <li><strong>Operational Expenditure (OpEx):</strong> Ongoing, recurring costs – ISP fees, software subscriptions, maintenance, electricity.</li>
                  <li><strong>Expansion Budget:</strong> Future growth – additional devices, software upgrades, bandwidth expansion.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Network Devices</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Router</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Connects different networks and directs data between them (e.g., home network to internet). Uses IP addresses and routing tables.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Switch</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Connects devices within a single network using MAC addresses. Unmanaged (simple) or managed (configurable).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Firewall</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Monitors and filters traffic based on security rules. Stateful (tracks connections) or stateless. Often includes VPN and IDS/IPS capabilities.</p>
                </div>
              </div>
            </div>

            {/* 10. Network Devices (Part 2) */}
            <div
              ref={(el) => {
                sectionRefs.current['devices-continued'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Devices (Part 2)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Wireless Access Point (WAP)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Creates a Wi-Fi network. Connects to wired network and broadcasts wireless signal. Supports standards like Wi-Fi 5/6, bands 2.4/5 GHz.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Wireless Range Extender</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Receives existing Wi-Fi signal, amplifies, and rebroadcasts to extend coverage. Reduces speed by half.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">VoIP Endpoints (IP Phones)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Phones that make calls over the internet instead of traditional phone lines. Cheaper calls, but dependent on internet quality.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Multilayer Switch</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A switch that can also perform routing functions using IP addresses (Layer 3). Combines switching and routing.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400">Wireless LAN Controller (WLC)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Central device that manages multiple WAPs from one place – coordinates them like an orchestra conductor.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-pink-600 dark:text-pink-400">Load Balancer</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Distributes incoming requests across multiple servers to prevent any one server from becoming overloaded.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">IDS/IPS</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Intrusion Detection System (alerts) vs Intrusion Prevention System (actively blocks). Uses signature-based or anomaly-based detection.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Proxy Server vs VPN Concentrator</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Proxy: intermediary for specific applications (no encryption). VPN: secure encrypted tunnel for ALL traffic.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">VoIP PBX</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manages internal and external phone calls over the internet – like a hotel phone system.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400">IOS/NOS</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Internetwork Operating System – the software that runs on network devices and manages the entire network.</p>
                </div>
              </div>
            </div>

            {/* 11. Services & IP Addressing */}
            <div
              ref={(el) => {
                sectionRefs.current['services-ip'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Services, Topologies, Diagrams & IP Addressing
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">DNS – Domain Name System</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Translates human-friendly domain names (www.google.com) into machine-friendly IP addresses.</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>How it works:</strong> Your device checks cache → query to DNS resolver → resolver checks cache → queries root/TLD/authoritative servers → returns IP address.</li>
                  <li><strong>Benefits:</strong> Human-friendly, flexible (companies can change IP addresses without users noticing), redundant.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">DHCP – Dynamic Host Configuration Protocol</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Automatically assigns IP addresses to devices on a network.</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>DORA Process:</strong> Discover (device broadcasts), Offer (server offers an IP), Request (device requests), Acknowledge (server confirms).</li>
                  <li><strong>Benefits:</strong> Eliminates manual configuration, prevents IP conflicts, efficient address reuse.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Network Topologies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Bus</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">All devices connected to a single central cable. Simple, cheap, but single point of failure (SPoF).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Ring</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Devices in a circle; data travels one direction. SPoF.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Star</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">All devices connect to a central switch – most common, easy to manage, but central switch is SPoF.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Mesh</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Every device connects to multiple others – no SPoF, but expensive and complex.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Network Diagrams</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">A visual map of the network. <strong>Physical diagram</strong> = actual connections; <strong>Logical diagram</strong> = data flow.</p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">IP Addressing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">IPv4</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">32-bit, dotted decimal (192.168.1.1). Classes: A (1-126), B (128-191), C (192-223). Private ranges: 10.x.x.x, 172.16-31.x.x, 192.168.x.x.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">CIDR</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">/24 = 254 hosts, /25 = 126 hosts, /26 = 62 hosts. FLSM (same size subnets) vs VLSM (different sizes – more efficient).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">IPv6</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">128-bit, colon-hexadecimal (2001:db8::1). Created because we ran out of IPv4 addresses.</p>
                </div>
              </div>
            </div>

            {/* 12. Exam Tips */}
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Site Survey Steps</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Know all 6 steps in order: Planning, Inspection, Signal Measurement, Data Recording & Analysis, Report Generation, Review & Approval.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Environmental Factors</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Concrete/brick = high attenuation. EMI sources: microwaves, cordless phones, fluorescent lights. Temperature, humidity, dust also matter.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 User Requirements Methods</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Interviews, Questionnaires, Observation, Published Documents – each has pros and cons.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Internet Technologies</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">DSL = telephone lines, speed drops with distance. Cable = shared bandwidth = slowdowns at peak times. Satellite = high latency, weather dependent.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Network Devices</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Router = between networks (IP). Switch = within network (MAC). Firewall = security barrier. WAP = Wi-Fi. Know their roles.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 DNS & DHCP</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">DNS = translates names to IP addresses. DHCP = automatically assigns IP addresses (DORA process).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Topologies</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Bus/Ring = SPoF. Star = most common. Mesh = no SPoF but expensive.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Survey. Plan. Design. Deploy. 🌐</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Site Survey Insight
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
                  <span>Survey Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>User Requirement Methods</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                A proper site survey is the foundation of any successful network deployment. It saves money, prevents problems, and ensures users get the performance they need. Never skip the survey – it's your roadmap to success.
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
                <strong className="text-white">A network site survey</strong> is a thorough evaluation of a physical space to determine the optimal network design.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Six survey steps</strong> – Plan, Inspect, Measure, Record, Report, Review – ensure nothing is overlooked.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Environmental factors</strong> – building materials, EMI, temperature, humidity, dust – all affect network performance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">User requirements</strong> must be gathered using interviews, questionnaires, observation, and published documents to ensure the network meets real needs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Internet technologies</strong> (DSL, cable, satellite, wireless) have different trade-offs; choosing the right one depends on location, budget, and requirements.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Network devices</strong> – routers, switches, firewalls, WAPs – each serve a specific role; understand their functions and specifications.
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
            Sidemann Academic Registry • Network Site Survey 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;