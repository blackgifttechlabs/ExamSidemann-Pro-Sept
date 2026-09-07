import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  AlertTriangle,
  Search,
  Lock,
  Database,
  FileText,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  Globe,
  Server,
  HardDrive,
  Wifi,
  Smartphone,
  Cloud,
  Mail,
  Image,
  FileCode,
  GitBranch,
  Terminal,
  Fingerprint,
  Eye,
  Key,
  Zap,
  ChevronUp,
  X,
  RefreshCw,
  BookOpen,
  Sparkles,
  Lightbulb,
  GraduationCap,
  Brain,
  ChevronRight,
  Target,
  Users,
  Scale,
  Cpu,
  Microchip,
  Network,
  FolderSearch,
  FileSearch,
  ListChecks,
  ClipboardCheck,
  Clipboard,
  Component,
  Cable,
  Plug,
  Gauge,
  Monitor,
  Power,
  Thermometer,
  Droplet,
  Cog,
  User,
  LockKeyhole,
  Link,
  Share2,
  Download,
  Upload,
  CloudOff,
  ShieldCheck,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Pen,
  Trash2,
  File,
  Folder,
  Copy,
  Check,
  ClipboardList,
  Files,
  Database as DatabaseIcon,
  Server as ServerIcon,
  Globe as GlobeIcon,
  Wifi as WifiIcon,
  Smartphone as SmartphoneIcon,
  Cloud as CloudIcon,
  Mail as MailIcon,
  Image as ImageIcon,
  FileCode as FileCodeIcon,
  GitBranch as GitBranchIcon,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { AdSense } from '../../../../analytics/AdSense';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'frameworks', label: 'Frameworks' },
  { id: 'components', label: 'Risk Components' },
  { id: 'steps', label: 'Assessment Steps' },
  { id: 'identifying-risk', label: 'Identifying Risk' },
  { id: 'analyzing-risk', label: 'Analyzing Risk' },
  { id: 'tools', label: 'Tools & Evaluation' },
  { id: 'goals', label: 'Cybersecurity Goals' },
  { id: 'practice', label: 'Practice' },
  { id: 'exam-tips', label: 'Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome2: React.FC = () => {
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
        text: 'The CIA Triad – Confidentiality, Integrity, Availability – is the foundation of information security. Every security control aims to protect one or more of these principles.',
      },
      {
        title: 'Pro Tip',
        text: 'In risk assessment, always start with asset identification – you cannot protect what you do not know exists.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the risk formula: Risk = Threat Probability × Vulnerability Severity × Asset Value.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse a vulnerability (a weakness) with a threat (a potential cause of harm). They are different!',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The CIA Triad – Confidentiality, Integrity, Availability – is the foundation of information security. Every security control aims to protect one or more of these principles.',
      },
      {
        title: 'Pro Tip',
        text: 'In risk assessment, always start with asset identification – you cannot protect what you do not know exists.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the risk formula: Risk = Threat Probability × Vulnerability Severity × Asset Value.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse a vulnerability (a weakness) with a threat (a potential cause of harm). They are different!',
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
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Shield size={14} className="inline mr-1" /> CYBERSECURITY RISK
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 2{' '}
            <span className="text-sky-300 font-bold italic">
              Cybersecurity Risk & Risk Assessment
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master cybersecurity risk assessment frameworks, IT risk components,
            threat identification, risk analysis, security tools, and the CIA Triad.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <AlertTriangle size={14} className="inline mr-1" /> Risk Assessment
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Lock size={14} className="inline mr-1" /> Security Tools
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
                placeholder="Search for a framework, tool, or risk concept..."
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
                Introduction to Cybersecurity Risk Assessment
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A cybersecurity risk assessment is a systematic process to identify, assess, and prioritize potential cybersecurity threats and vulnerabilities. It helps organizations understand their risk exposure and allocate resources effectively to mitigate risks.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Risk assessment is like checking your home for hazards – you look for unlocked doors (vulnerabilities), consider who might break in (threats), and decide what to protect first (assets). Then you take action to secure the most critical areas.
                </p>
              </div>
            </div>

            {/* 2. Frameworks */}
            <div
              ref={(el) => {
                sectionRefs.current['frameworks'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Cybersecurity Risk Assessment Frameworks
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">NIST Cybersecurity Framework (CSF)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Provides a comprehensive approach with five core functions: Identify, Protect, Detect, Respond, and Recover.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">ISO/IEC 27001</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">International standard for information security management systems (ISMS). Provides structured risk assessment and management.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">COBIT 5</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Focuses on governance and management of enterprise IT, includes a risk assessment model for IT risks.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">FAIR (Factor Analysis of Information Risk)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Quantitative framework that measures and quantifies risk in financial terms.</p>
                </div>
              </div>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which framework provides a quantitative approach to measuring risk in financial terms?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 3)} /> a) NIST CSF
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 3)} /> b) ISO 27001
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 3)} /> c) COBIT 5
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 3, 3)} /> d) FAIR
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 3 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 3 ? '✅ Correct! FAIR quantifies risk in financial terms.' : '❌ Incorrect. The correct answer is d.'}
                  </div>
                )}
              </div>
            </div>

            {/* 3. IT Risk Assessment Components */}
            <div
              ref={(el) => {
                sectionRefs.current['components'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                IT Risk Assessment Components
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Asset Identification:</strong> Identify all IT assets – hardware, software, data, networks.</li>
                  <li><strong>Threat Identification:</strong> Identify potential threats – cyberattacks, natural disasters, human error.</li>
                  <li><strong>Vulnerability Assessment:</strong> Assess vulnerabilities – software weaknesses, weak passwords, misconfigurations.</li>
                  <li><strong>Risk Assessment:</strong> Combine threat and vulnerability assessments to calculate potential impact.</li>
                  <li><strong>Risk Mitigation:</strong> Develop strategies – technical, administrative, physical controls.</li>
                  <li><strong>Risk Monitoring and Review:</strong> Continuously monitor and review for emerging threats.</li>
                </ul>
              </div>
            </div>

            {/* 4. Steps to Perform a Cybersecurity Risk Assessment */}
            <div
              ref={(el) => {
                sectionRefs.current['steps'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Steps to Perform a Cybersecurity Risk Assessment
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Identify Assets:</strong> Catalog all IT assets.</li>
                  <li><strong>Threat Modeling:</strong> Identify potential threats.</li>
                  <li><strong>Vulnerability Assessment:</strong> Conduct scans to find weaknesses.</li>
                  <li><strong>Risk Analysis:</strong> Assess likelihood and impact.</li>
                  <li><strong>Risk Prioritization:</strong> Rank risks by severity.</li>
                  <li><strong>Risk Mitigation:</strong> Implement controls (technical, administrative, physical).</li>
                  <li><strong>Continuous Monitoring and Review:</strong> Regularly review and update.</li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Risk Formula</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic mt-1">
                  <strong>Risk = Threat Probability × Vulnerability Severity × Asset Value</strong>
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">Importance of Regular Assessments</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li>Identify and mitigate risks proactively.</li>
                  <li>Comply with regulations.</li>
                  <li>Protect sensitive data.</li>
                  <li>Maintain business continuity.</li>
                  <li>Improve security posture.</li>
                </ul>
              </div>
            </div>

            {/* 5. Identifying Risk */}
            <div
              ref={(el) => {
                sectionRefs.current['identifying-risk'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Identifying Risk
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">Steps in Risk Identification</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Asset Identification:</strong> Identify valuable assets (hardware, software, data, networks). Categorize by criticality.</li>
                  <li><strong>Threat Assessment:</strong> Identify internal threats (malicious insiders, human error) and external threats (hackers, cybercriminals, natural disasters).</li>
                  <li><strong>Vulnerability Assessment:</strong> Assess software vulnerabilities, network weaknesses, human vulnerabilities (phishing).</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Asset-Threat-Vulnerability (ATV) Cycle</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Identify Assets</strong> → <strong>Identify Threats</strong> → <strong>Identify Vulnerabilities</strong> → <strong>Assess Risk</strong></li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Signs of Vulnerability to Cyberattacks</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Frequent phishing attempts</li>
                  <li>Unusual network traffic</li>
                  <li>System slowdowns or crashes</li>
                  <li>Unauthorized access attempts</li>
                  <li>Data breaches</li>
                  <li>Ransomware attacks</li>
                  <li>DDoS attacks</li>
                  <li>Malware infections</li>
                  <li>Insider threats</li>
                </ul>
              </div>

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What is the correct order of the Asset-Threat-Vulnerability (ATV) cycle?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 0)} /> a) Assets → Threats → Vulnerabilities → Risk
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 0)} /> b) Threats → Assets → Vulnerabilities → Risk
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 2, 0)} /> c) Vulnerabilities → Assets → Threats → Risk
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 0 ? '✅ Correct! The cycle is Assets → Threats → Vulnerabilities → Risk.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
              </div>
            </div>

            {/* 6. Analyzing Risk */}
            <div
              ref={(el) => {
                sectionRefs.current['analyzing-risk'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Analyzing Risk
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">Benefits of Risk Analysis</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Prioritization – helps rank risks.</li>
                  <li>Resource allocation – efficient use of resources.</li>
                  <li>Decision making – informs new projects.</li>
                  <li>Risk mitigation – identifies strategies.</li>
                  <li>Compliance – meets regulations.</li>
                  <li>Insurance planning – informs decisions.</li>
                  <li>Business continuity – minimizes disruption.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Risk Analysis Process</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Risk Identification:</strong> Identify potential risks.</li>
                  <li><strong>Risk Assessment:</strong> Evaluate likelihood and impact.</li>
                  <li><strong>Risk Prioritization:</strong> Rank risks.</li>
                  <li><strong>Risk Treatment:</strong> Develop strategies (mitigate, transfer, accept).</li>
                  <li><strong>Risk Monitoring and Review:</strong> Continuously monitor.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Types of Risk</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Operational Risk:</strong> Internal processes and systems.</li>
                  <li><strong>Financial Risk:</strong> Financial transactions and investments.</li>
                  <li><strong>Strategic Risk:</strong> Business strategy.</li>
                  <li><strong>Regulatory Risk:</strong> Changes in laws.</li>
                  <li><strong>Reputational Risk:</strong> Damage to reputation.</li>
                  <li><strong>Cybersecurity Risk:</strong> Cyberattacks and data breaches.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Risk Management Plan</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Risk Identification:</strong> Detailed list of risks.</li>
                  <li><strong>Risk Assessment:</strong> Likelihood and impact evaluation.</li>
                  <li><strong>Risk Prioritization:</strong> Severity ranking.</li>
                  <li><strong>Risk Treatment Strategies:</strong>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Risk Avoidance – eliminate the activity.</li>
                      <li>Risk Reduction – implement controls.</li>
                      <li>Risk Transfer – transfer to third party (insurance).</li>
                      <li>Risk Acceptance – accept and monitor.</li>
                    </ul>
                  </li>
                  <li><strong>Risk Monitoring and Review:</strong> Regular updates.</li>
                </ul>
              </div>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which risk treatment strategy involves transferring the risk to a third party?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 2)} /> a) Risk Avoidance
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 2)} /> b) Risk Reduction
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 2, 2)} /> c) Risk Transfer
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 3, 2)} /> d) Risk Acceptance
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 2 ? '✅ Correct! Risk Transfer moves the risk to a third party (e.g., insurance).' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
              </div>
            </div>

            {/* 7. Tools and Evaluation */}
            <div
              ref={(el) => {
                sectionRefs.current['tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Cybersecurity Tools and Evaluation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Firewalls</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Filter network traffic to protect systems from unauthorized access.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Antivirus Software</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Detects, prevents, and removes malware.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">PKI Services</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Secures communication and digital transactions using public/private key cryptography.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">MDR Services</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Managed Detection and Response – 24/7 monitoring, detection, and response.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Penetration Testing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Simulates attacks to identify vulnerabilities.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">Staff Training</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Educates employees on cybersecurity best practices.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Troubleshooting Cybersecurity Risks Using Tools</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Firewall:</strong> Block suspicious traffic.</li>
                  <li><strong>Antivirus:</strong> Keep updated and run scans.</li>
                  <li><strong>PKI:</strong> Strong encryption and key management.</li>
                  <li><strong>MDR:</strong> Proactive detection and rapid response.</li>
                  <li><strong>Penetration Testing:</strong> Regular tests to find weaknesses.</li>
                  <li><strong>Staff Training:</strong> Regular security awareness training.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Cybersecurity Challenges</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Evolving Threats – threats constantly evolve.</li>
                  <li>Complex IT Environments – difficult to secure all components.</li>
                  <li>Human Error – mistakes lead to breaches.</li>
                  <li>Supply Chain Attacks – targeting third-party vendors.</li>
                  <li>Data Privacy Regulations – compliance is complex.</li>
                  <li>Remote Work Security – unique challenges.</li>
                  <li>IoT Security – limited resources and poor security.</li>
                  <li>Cloud Security – securing cloud applications and data.</li>
                </ul>
              </div>

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which tool simulates attacks to identify vulnerabilities?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 4)} /> a) Firewall
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 4)} /> b) Antivirus
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 2, 4)} /> c) MDR
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 3, 4)} /> d) Penetration Testing
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 3 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 3 ? '✅ Correct! Penetration testing simulates attacks.' : '❌ Incorrect. The correct answer is d.'}
                  </div>
                )}
              </div>
            </div>

            {/* 8. Documenting Cybersecurity Goals */}
            <div
              ref={(el) => {
                sectionRefs.current['goals'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Documenting Cybersecurity Goals
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  The primary goal of cybersecurity is to protect digital assets from unauthorized access, use, disclosure, disruption, modification, or destruction.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">The CIA Triad</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Confidentiality</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Protecting sensitive information from unauthorized disclosure.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Integrity</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Ensuring the accuracy and completeness of information.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Availability</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Ensuring that information and systems are accessible when needed.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Types of Cybersecurity Threats</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Malware – malicious software.</li>
                  <li>Phishing – deceptive tactics.</li>
                  <li>Ransomware – encrypts files and demands ransom.</li>
                  <li>DoS/DDoS – overwhelm systems.</li>
                  <li>Man-in-the-Middle – intercept communication.</li>
                  <li>SQL Injection – exploit web application vulnerabilities.</li>
                  <li>Zero-Day Exploits – unknown vulnerabilities.</li>
                  <li>Insider Threats – malicious employees/contractors.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Systems Affected by Security Breaches</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Computers and Servers – malware, unauthorized access.</li>
                  <li>Networks – data theft, service disruption.</li>
                  <li>Mobile Devices – malware, phishing, data theft.</li>
                  <li>Cloud-Based Systems – data breaches, misconfigurations.</li>
                  <li>IoT Devices – compromised for attacks or data collection.</li>
                </ul>
              </div>

              {/* Quiz 5 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which principle of the CIA Triad ensures that information is accessible when needed?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 0, 2)} /> a) Confidentiality
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 1, 2)} /> b) Integrity
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 2, 2)} /> c) Availability
                  </label>
                </div>
                {showQuiz5Result && (
                  <div className={`mt-2 p-2 rounded ${quiz5Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz5Answer === 2 ? '✅ Correct! Availability ensures accessibility.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
              </div>
            </div>

            {/* 9. Practice Exercises */}
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
                question="Q1. List and explain FOUR types of cybersecurity risk assessment frameworks."
                answer="1. NIST Cybersecurity Framework (CSF) – consists of five core functions: Identify, Protect, Detect, Respond, and Recover.\n\n2. ISO/IEC 27001 – international standard for information security management systems (ISMS).\n\n3. COBIT 5 – focuses on governance and management of enterprise IT.\n\n4. FAIR (Factor Analysis of Information Risk) – quantitative framework that measures risk in financial terms."
              />

              <QuestionReveal
                question="Q2. What is the risk formula and what does each component mean?"
                answer="Risk = Threat Probability × Vulnerability Severity × Asset Value\n\n- Threat Probability: How likely is a threat to occur?\n- Vulnerability Severity: How severe is the weakness that could be exploited?\n- Asset Value: How valuable is the asset being protected?"
              />

              <QuestionReveal
                question="Q3. Differentiate between a vulnerability and a threat."
                answer="A vulnerability is a weakness in a system that could be exploited (e.g., unpatched software). A threat is a potential cause of harm (e.g., a hacker). Threats exploit vulnerabilities to cause damage."
              />

              <QuestionReveal
                question="Q4. Explain the CIA Triad and give an example of each."
                answer="Confidentiality – protecting information from unauthorized access (e.g., encryption).\n\nIntegrity – ensuring accuracy and completeness of information (e.g., checksums).\n\nAvailability – ensuring information is accessible when needed (e.g., redundancy)."
              />

              <QuestionReveal
                question="Q5. List THREE cybersecurity tools and their purposes."
                answer="1. Firewall – filters network traffic to block unauthorized access.\n\n2. Antivirus Software – detects and removes malware.\n\n3. Penetration Testing – simulates attacks to identify vulnerabilities."
              />
            </div>

            {/* 10. Exam Tips */}
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Know the Frameworks</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Be able to list and explain NIST CSF, ISO 27001, COBIT 5, and FAIR.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Risk Formula</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Risk = Threat Probability × Vulnerability Severity × Asset Value – understand each component.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 The CIA Triad</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Confidentiality, Integrity, Availability – give examples of each.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Risk Treatment Strategies</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Avoidance, Reduction, Transfer, Acceptance – know when to use each.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Cybersecurity Tools</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Firewalls, Antivirus, PKI, MDR, Penetration Testing, Staff Training – know their purposes.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Assess risks. Protect assets. Stay secure. 🔒</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Risk Insight
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
                  <span>Frameworks</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>CIA Triad</span>
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
                Risk assessment is about identifying what you have (assets), what could go wrong (threats), and how it could go wrong (vulnerabilities). Then you prioritize and take action. It's a continuous process, not a one-time event.
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
                <strong className="text-white">Cybersecurity risk assessment</strong> is the systematic process of identifying, assessing, and prioritizing risks to information assets.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Frameworks</strong> like NIST CSF, ISO 27001, COBIT 5, and FAIR provide structured approaches to risk management.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Risk formula</strong>: Risk = Threat Probability × Vulnerability Severity × Asset Value.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">The CIA Triad</strong> – Confidentiality, Integrity, Availability – is the foundation of information security.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Risk treatment strategies</strong> include avoidance, reduction, transfer, and acceptance – choose based on risk tolerance.
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
            Sidemann Academic Registry • Cybersecurity Risk Assessment 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;