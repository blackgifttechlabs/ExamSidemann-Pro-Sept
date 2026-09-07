import React, { useState, useEffect, useRef } from 'react';
import {
  Fingerprint,
  Shield,
  Search,
  Lock,
  Database,
  FileText,
  BarChart3,
  AlertTriangle,
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
  Zap,
  Cpu,
  Microchip,
  HardDrive as HardDriveIcon,
  Network,
  FolderSearch,
  FileSearch,
  ListChecks,
  ClipboardCheck,
  Clipboard,
  Component,
  SquareStack,
  Cable,
  Plug,
  Gauge,
  Monitor,
  Power,
  Thermometer,
  Droplet,
  Cog,
  User,
  Key,
  Eye,
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
  { id: 'intro', label: 'Intro' },
  { id: 'forensics', label: 'Forensics & IR' },
  { id: 'security-plan', label: 'Security Plan' },
  { id: 'browsing', label: 'Browsing vs Search' },
  { id: 'evidence-collection', label: 'Evidence Collection' },
  { id: 'preserving-evidence', label: 'Preserving Evidence' },
  { id: 'acquiring-data', label: 'Acquiring Data' },
  { id: 'forensic-analysis', label: 'Analysis vs Forensics' },
  { id: 'tools', label: 'Tools & Challenges' },
  { id: 'incident-response', label: 'Incident Response Steps' },
  { id: 'exam-tips', label: 'Tips' },
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
        text: 'Digital forensics is the scientific process of identifying, preserving, analyzing, and presenting digital evidence in a court of law.',
      },
      {
        title: 'Pro Tip',
        text: 'Always maintain a clear chain of custody – every time evidence is handled, document who, when, and why.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the phases of digital forensics: Identification, Preservation, Collection, Examination, Analysis, Reporting – "IPCEAR".',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse forensic data analysis (extracting insights) with digital forensics (the entire investigative process). They are different.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Digital forensics is the scientific process of identifying, preserving, analyzing, and presenting digital evidence in a court of law.',
      },
      {
        title: 'Pro Tip',
        text: 'Always maintain a clear chain of custody – every time evidence is handled, document who, when, and why.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the phases of digital forensics: Identification, Preservation, Collection, Examination, Analysis, Reporting – "IPCEAR".',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse forensic data analysis (extracting insights) with digital forensics (the entire investigative process). They are different.',
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
            <Fingerprint size={14} className="inline mr-1" /> DIGITAL FORENSICS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 1{' '}
            <span className="text-emerald-300 font-bold italic">
              Digital Forensics & Incident Response
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master digital forensics, incident response, evidence collection,
            acquisition methods, forensic tools, and security planning.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Forensics
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Database size={14} className="inline mr-1" /> Evidence
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
                placeholder="Search for a concept, tool, or phase..."
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
                Introduction to Digital Forensics & Incident Response
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Digital forensics is the scientific process of identifying, preserving, analyzing, and presenting digital evidence in a court of law. Incident response is the coordinated set of activities to detect, analyze, contain, eradicate, recover from, and learn from a security incident. Together, they form the backbone of cyber security investigations.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Digital forensics is like a detective investigation – you collect clues (evidence), preserve them carefully, analyze them, and present your findings. Incident response is like emergency services – you need to stop the fire, rescue victims, and prevent it from happening again.
                </p>
              </div>
            </div>

            {/* 2. Digital Forensics & Incident Response */}
            <div
              ref={(el) => {
                sectionRefs.current['forensics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Digital Forensics & Incident Response
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">Digital Forensics</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>Definition:</strong> Digital forensics is the scientific process of identifying, preserving, analyzing, and presenting digital evidence in a court of law or other legal proceedings.
                </p>
                <h4 className="font-bold text-sm mt-4 mb-2 text-indigo-600 dark:text-indigo-400">Phases of Digital Forensics:</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Identification:</strong> Identifying potential digital evidence and its relevance.</li>
                  <li><strong>Preservation:</strong> Preserving evidence integrity by creating accurate copies.</li>
                  <li><strong>Collection:</strong> Gathering evidence systematically without compromising integrity.</li>
                  <li><strong>Examination:</strong> Analyzing evidence to extract information and identify patterns.</li>
                  <li><strong>Analysis:</strong> Interpreting data to draw conclusions and formulate hypotheses.</li>
                  <li><strong>Reporting:</strong> Documenting findings in a clear, concise report for legal use.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Incident Response</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>Definition:</strong> Incident response is a coordinated set of activities to detect, analyze, contain, eradicate, recover from, and learn from a security incident.
                </p>
                <h4 className="font-bold text-sm mt-4 mb-2 text-indigo-600 dark:text-indigo-400">Incident Response Basics:</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Incident Identification:</strong> Detect and recognize security incidents as they occur.</li>
                  <li><strong>Containment:</strong> Isolate affected systems to prevent further damage.</li>
                  <li><strong>Eradication:</strong> Remove the root cause of the incident.</li>
                  <li><strong>Recovery:</strong> Restore systems to their normal state.</li>
                  <li><strong>Lessons Learned:</strong> Analyze the incident to improve security measures.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Pre- vs Post-Attack Response</h3>
              <Table
                headers={["Feature", "Pre-Attack Response", "Post-Attack Response"]}
                rows={[
                  ["Focus", "Prevention and preparedness", "Detection, containment, and recovery"],
                  ["Activities", "Risk assessments, vulnerability scans, security awareness training", "Incident investigation, forensic analysis, system restoration"],
                  ["Mindset", "Proactive", "Reactive"],
                  ["Goals", "Minimize the likelihood of attacks", "Minimize the impact of attacks"],
                  ["Key Considerations", "Security policies, procedures, and technologies", "Incident response team, communication plans, and forensic tools"],
                ]}
                title="Comparison"
              />

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Incident Handling Steps</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Preparation:</strong> Develop an incident response plan, train staff, and establish procedures.</li>
                  <li><strong>Identification:</strong> Detect and classify security incidents.</li>
                  <li><strong>Containment:</strong> Isolate affected systems.</li>
                  <li><strong>Eradication:</strong> Remove the root cause.</li>
                  <li><strong>Recovery:</strong> Restore systems to normal.</li>
                  <li><strong>Lessons Learned:</strong> Analyze the incident to improve security.</li>
                </ul>
              </div>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which phase of digital forensics involves creating an exact copy of the original evidence?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 1)} /> a) Identification
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 1)} /> b) Preservation
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 1)} /> c) Collection
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 1 ? '✅ Correct! Preservation involves creating accurate copies.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Preparing a System Security Plan */}
            <div
              ref={(el) => {
                sectionRefs.current['security-plan'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Preparing a System Security Plan
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Asset Identification:</strong> Identify all critical systems and data.</li>
                  <li><strong>Threat Assessment:</strong> Evaluate potential threats and vulnerabilities.</li>
                  <li><strong>Risk Assessment:</strong> Assess the likelihood and impact of potential threats.</li>
                  <li><strong>Security Controls:</strong> Implement appropriate security controls to mitigate risks.</li>
                  <li><strong>Policy and Procedures:</strong> Develop security policies and procedures to guide staff behavior.</li>
                  <li><strong>Training and Awareness:</strong> Train staff on security best practices.</li>
                  <li><strong>Testing and Evaluation:</strong> Regularly test security controls and procedures.</li>
                  <li><strong>Monitoring and Review:</strong> Continuously monitor systems and review security plans.</li>
                </ul>
              </div>
            </div>

            {/* 4. Manual Browsing vs Automated Searches */}
            <div
              ref={(el) => {
                sectionRefs.current['browsing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Manual Browsing vs Automated Searches
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">Manual Browsing</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">The investigator manually examines digital media to identify relevant files and artifacts. Allows deep dives but is time-consuming and prone to human error.</p>

                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Automated Searches</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Utilizes software tools to systematically scan for keywords, file types, or patterns. Faster and more objective but may generate false positives.</p>
              </div>

              <Table
                headers={["Feature", "Manual Browsing", "Automated Search"]}
                rows={[
                  ["Speed", "Slow", "Fast"],
                  ["Scalability", "Limited to smaller datasets", "Can handle large datasets"],
                  ["Accuracy", "Prone to human error", "More objective and accurate"],
                  ["Efficiency", "Requires significant time and effort", "Highly efficient"],
                  ["Flexibility", "Allows for deep dives and contextual analysis", "Less flexible, relies on predefined criteria"],
                ]}
                title="Feature Comparison"
              />

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which method is more suitable for large datasets?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 1)} /> a) Manual Browsing
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 1)} /> b) Automated Search
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 1 ? '✅ Correct! Automated searches handle large datasets efficiently.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 5. Digital Evidence Collection */}
            <div
              ref={(el) => {
                sectionRefs.current['evidence-collection'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Digital Evidence Collection
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Steps in Digital Forensics (Recap)</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Identification:</strong> Identifying potential sources of evidence.</li>
                  <li><strong>Preservation:</strong> Creating exact copies without altering original data.</li>
                  <li><strong>Collection:</strong> Gathering evidence systematically.</li>
                  <li><strong>Examination:</strong> Analyzing evidence to extract information.</li>
                  <li><strong>Analysis:</strong> Interpreting data to draw conclusions.</li>
                  <li><strong>Reporting:</strong> Documenting findings.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Branches of Digital Forensics</h3>
              <Table
                headers={["Branch", "Description"]}
                rows={[
                  ["Network Forensics", "Analyzing network traffic to identify breaches and attacks."],
                  ["Mobile Device Forensics", "Examining data on smartphones and tablets."],
                  ["Database Forensics", "Analyzing databases to extract evidence."],
                  ["Cloud Forensics", "Investigating evidence in cloud environments."],
                  ["Memory Forensics", "Analyzing volatile memory (RAM) for real-time activity."],
                  ["Email Forensics", "Analyzing email communications for evidence of cybercrime."],
                ]}
                title="Forensic Branches"
              />

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Main Processes in Digital Evidence Collection</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Identification:</strong> Identifying potential sources of digital evidence.</li>
                  <li><strong>Acquisition:</strong> Using specialized forensic tools to create exact copies.</li>
                  <li><strong>Authentication:</strong> Verifying integrity and authenticity of evidence.</li>
                  <li><strong>Analysis:</strong> Examining evidence to extract relevant information.</li>
                  <li><strong>Interpretation:</strong> Interpreting analyzed data to draw conclusions.</li>
                  <li><strong>Documentation:</strong> Documenting the entire process.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Types of Collectible Data</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>System Files:</strong> OS files, configuration, logs.</li>
                  <li><strong>Application Data:</strong> User data, settings, temporary files.</li>
                  <li><strong>Network Data:</strong> Traffic, emails, browsing history.</li>
                  <li><strong>Multimedia Data:</strong> Images, videos, audio.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Types of Evidence</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Direct Evidence:</strong> Directly proves a fact (e.g., confession).</li>
                  <li><strong>Circumstantial Evidence:</strong> Indirectly suggests a fact (e.g., fingerprints).</li>
                  <li><strong>Documentary Evidence:</strong> Written documents (e.g., emails, reports).</li>
                  <li><strong>Digital Evidence:</strong> Any information in digital form.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Challenges in Digital Evidence Collection</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Volatility of Data:</strong> Evidence can be easily modified or deleted.</li>
                  <li><strong>Complexity of Devices:</strong> Modern devices store data in complex formats.</li>
                  <li><strong>Legal and Ethical Considerations:</strong> Compliance with legal standards.</li>
                  <li><strong>Data Volume and Variety:</strong> Large amounts of data can be overwhelming.</li>
                  <li><strong>Security Risks:</strong> Protecting evidence from unauthorized access.</li>
                </ul>
              </div>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which branch of digital forensics deals with analyzing RAM?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 2)} /> a) Network Forensics
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 2)} /> b) Mobile Device Forensics
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 2, 2)} /> c) Memory Forensics
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 2 ? '✅ Correct! Memory forensics analyzes RAM.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
              </div>
            </div>

            {/* 6. Preserving Digital Evidence */}
            <div
              ref={(el) => {
                sectionRefs.current['preserving-evidence'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Preserving Digital Evidence
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">Critical Steps</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Immediate Isolation:</strong> Isolate device from network to prevent alteration.</li>
                  <li><strong>Create a Forensic Image:</strong> Create a bit-by-bit copy of the original device.</li>
                  <li><strong>Chain of Custody:</strong> Document handling from seizure to court.</li>
                  <li><strong>Secure Storage:</strong> Store device and image in a secure location.</li>
                  <li><strong>Regular Verification:</strong> Periodically verify integrity of stored evidence.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Methods to Preserve Evidence</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Disk Imaging:</strong> Creating a bit-by-bit copy of a storage device.</li>
                  <li><strong>Memory Dumping:</strong> Capturing contents of volatile memory (RAM).</li>
                  <li><strong>Network Traffic Capture:</strong> Recording network traffic.</li>
                  <li><strong>File System Analysis:</strong> Analyzing file system to recover deleted files.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Problems in Preserving Evidence</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Data Volatility:</strong> Evidence can be easily modified or deleted.</li>
                  <li><strong>Data Corruption:</strong> Physical damage or software errors.</li>
                  <li><strong>Encryption:</strong> Encrypted data can be difficult to access.</li>
                  <li><strong>Chain of Custody Issues:</strong> Breaks in custody can compromise admissibility.</li>
                  <li><strong>Legal and Ethical Challenges:</strong> Complex guidelines.</li>
                  <li><strong>Storage and Preservation Costs:</strong> Long-term storage can be expensive.</li>
                </ul>
              </div>
            </div>

            {/* 7. Acquiring Data */}
            <div
              ref={(el) => {
                sectionRefs.current['acquiring-data'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Acquiring Data
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">Types of Forensic Acquisition Methods</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Physical Acquisition:</strong> Bit-by-bit copy of entire storage device, including unallocated space.</li>
                  <li><strong>Logical Acquisition:</strong> Copying specific files and folders only.</li>
                  <li><strong>Sparse Acquisition:</strong> Copying only specific sectors containing relevant data.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Digital Evidence Storage Formats</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Raw Format:</strong> Raw binary copy, preserving integrity.</li>
                  <li><strong>Expert Witness Format (EWF):</strong> Compressed version of raw format.</li>
                  <li><strong>EnCase Format:</strong> Proprietary format with compression, encryption, metadata.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Determining Best Acquisition Method</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Scope of Investigation:</strong> Broad = physical, targeted = logical/sparse.</li>
                  <li><strong>Time Constraints:</strong> Logical/sparse may be faster.</li>
                  <li><strong>Storage Space:</strong> Physical requires more storage.</li>
                  <li><strong>Legal Requirements:</strong> Compliance may dictate method.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Contingency Planning</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Backup Procedures:</strong> Regular backups of forensic tools and data.</li>
                  <li><strong>Emergency Procedures:</strong> Handling unexpected issues (power outages, failures).</li>
                  <li><strong>Chain of Custody:</strong> Detailed handling records.</li>
                  <li><strong>Data Validation:</strong> Regular integrity checks.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Using Acquisition Tools</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>FTK Imager:</strong> Creating forensic images and analysis.</li>
                  <li><strong>EnCase:</strong> Comprehensive forensic suite.</li>
                  <li><strong>X-Ways Forensics:</strong> Advanced analysis.</li>
                  <li><strong>The Sleuth Kit (TSK):</strong> Command-line tools.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Validating Data Acquisitions</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Hash Value Verification:</strong> Comparing hash values to verify integrity.</li>
                  <li><strong>File System Consistency Checks:</strong> Verifying file system integrity.</li>
                  <li><strong>Time-Based Analysis:</strong> Analyzing timestamps for inconsistencies.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">RAID Acquisition Methods</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Logical Acquisition:</strong> Acquiring data from individual disks.</li>
                  <li><strong>Physical Acquisition:</strong> Imaging each disk.</li>
                  <li><strong>RAID Reconstruction:</strong> Reassembling the array to access data.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Remote Network Acquisition Tools</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Remote Forensic Acquisition Tools:</strong> Remote control of acquisition.</li>
                  <li><strong>Network Forensics Tools:</strong> Capturing and analyzing network traffic.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Forensic Tools for Data Acquisition</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>FTK Imager</li>
                  <li>EnCase</li>
                  <li>X-Ways Forensics</li>
                  <li>The Sleuth Kit (TSK)</li>
                  <li>Oxygen Forensic Suite</li>
                  <li>Mobile Device Forensic Tools (Cellebrite, GrayKey)</li>
                  <li>Cloud Forensic Tools (Magnet Axiom Cloud)</li>
                </ul>
              </div>

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which acquisition method creates a bit-by-bit copy of the entire storage device?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 0)} /> a) Physical Acquisition
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 0)} /> b) Logical Acquisition
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 2, 0)} /> c) Sparse Acquisition
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 0 ? '✅ Correct! Physical acquisition copies everything.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
              </div>
            </div>

            {/* 8. Differentiating Forensic Data Analysis and Digital Forensics */}
            <div
              ref={(el) => {
                sectionRefs.current['forensic-analysis'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Differentiating Forensic Data Analysis and Digital Forensics
              </h2>

              <Table
                headers={["Feature", "Forensic Data Analysis", "Digital Forensics"]}
                rows={[
                  ["Focus", "Extracting and interpreting digital evidence", "Identifying, preserving, and analyzing digital evidence"],
                  ["Scope", "Specific to data analysis", "Broader scope, encompassing all aspects of digital investigation"],
                  ["Techniques", "Data mining, statistical analysis, machine learning", "File system analysis, network analysis, memory analysis"],
                  ["Tools", "Data analysis tools (e.g., Tableau, Python)", "Forensic analysis tools (e.g., FTK Imager, EnCase)"],
                  ["Skillset", "Data analysis, statistics, programming", "Digital forensics, computer science, networking"],
                  ["Goal", "Derive insights from data", "Reconstruct digital events and identify perpetrators"],
                  ["Application", "Business intelligence, fraud investigation", "Criminal investigations, civil litigation, IP disputes"],
                ]}
                title="Comparison"
              />
            </div>

            {/* 9. Data Forensic Tools and Software */}
            <div
              ref={(el) => {
                sectionRefs.current['tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Data Forensic Tools and Software
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>FTK Imager:</strong> Creating forensic images and analysis.</li>
                  <li><strong>EnCase:</strong> Comprehensive forensic software suite.</li>
                  <li><strong>X-Ways Forensics:</strong> Advanced forensic analysis.</li>
                  <li><strong>The Sleuth Kit (TSK):</strong> Command-line tools for analysis.</li>
                  <li><strong>Autopsy:</strong> Graphical interface for TSK.</li>
                  <li><strong>Volatility:</strong> Memory forensics for RAM analysis.</li>
                  <li><strong>Wireshark:</strong> Network protocol analyzer.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Challenges in Digital Forensics</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Data Volume and Complexity:</strong> Analysis can be time-consuming.</li>
                  <li><strong>Data Volatility:</strong> Evidence can be easily modified.</li>
                  <li><strong>Encryption:</strong> Difficult to access encrypted data.</li>
                  <li><strong>Emerging Technologies:</strong> Constant need to adapt.</li>
                  <li><strong>Legal and Ethical Considerations:</strong> Complex guidelines.</li>
                  <li><strong>Skill Shortages:</strong> Lack of skilled professionals.</li>
                  <li><strong>International Cooperation:</strong> Challenges in cross-border investigations.</li>
                  <li><strong>Cost:</strong> Investigations can be expensive.</li>
                </ul>
              </div>
            </div>

            {/* 10. Completing an Incident Response and Documenting Steps */}
            <div
              ref={(el) => {
                sectionRefs.current['incident-response'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Completing an Incident Response and Documenting Steps
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  An incident response is a coordinated set of activities to detect, analyze, contain, eradicate, recover from, and learn from a security incident. Detailed documentation is crucial for legal, regulatory, and internal review purposes.
                </p>

                <h4 className="font-bold text-sm mt-4 mb-2 text-indigo-600 dark:text-indigo-400">Incident Identification:</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Timestamp:</strong> Record the exact time the incident was first detected.</li>
                  <li><strong>Detection Method:</strong> Describe how it was discovered (e.g., alert, user report).</li>
                  <li><strong>Initial Assessment:</strong> Outline preliminary scope and impact.</li>
                </ul>

                <h4 className="font-bold text-sm mt-4 mb-2 text-indigo-600 dark:text-indigo-400">Containment:</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Isolation:</strong> Steps taken to isolate affected systems.</li>
                  <li><strong>Network Segmentation:</strong> How traffic was rerouted.</li>
                  <li><strong>System Shutdown:</strong> Document shutdown if necessary.</li>
                </ul>

                <h4 className="font-bold text-sm mt-4 mb-2 text-indigo-600 dark:text-indigo-400">Eradication:</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Malware Removal:</strong> Tools and techniques used.</li>
                  <li><strong>System Cleanup:</strong> Restoring system files and configurations.</li>
                  <li><strong>Patching and Updates:</strong> Application of security patches.</li>
                </ul>

                <h4 className="font-bold text-sm mt-4 mb-2 text-indigo-600 dark:text-indigo-400">Recovery:</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>System Restoration:</strong> Process of restoring systems.</li>
                  <li><strong>Data Recovery:</strong> Recovery of lost or corrupted data.</li>
                  <li><strong>User Account Reset:</strong> Steps to reset compromised accounts.</li>
                </ul>

                <h4 className="font-bold text-sm mt-4 mb-2 text-indigo-600 dark:text-indigo-400">Lessons Learned:</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Root Cause Analysis:</strong> Identify root cause.</li>
                  <li><strong>Security Gaps:</strong> Weaknesses that contributed.</li>
                  <li><strong>Recommendations:</strong> Proposed improvements.</li>
                </ul>

                <h4 className="font-bold text-sm mt-4 mb-2 text-indigo-600 dark:text-indigo-400">Additional Documentation:</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Evidence Collection:</strong> Document collection, preservation, analysis.</li>
                  <li><strong>Communication Logs:</strong> Record all communications.</li>
                  <li><strong>Timeline:</strong> Create a timeline of events.</li>
                  <li><strong>Financial Impact:</strong> Assess cost of the incident.</li>
                </ul>
              </div>

              {/* Quiz 5 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What is the purpose of the "Lessons Learned" phase in incident response?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 0, 2)} /> a) To isolate affected systems
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 1, 2)} /> b) To analyze the root cause and improve security
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 2, 2)} /> c) To restore systems to normal
                  </label>
                </div>
                {showQuiz5Result && (
                  <div className={`mt-2 p-2 rounded ${quiz5Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz5Answer === 1 ? '✅ Correct! Lessons Learned identifies root cause and suggests improvements.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 11. Exam Tips */}
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Know the Phases</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Memorize the digital forensics phases (Identification, Preservation, Collection, Examination, Analysis, Reporting) and incident response steps.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Differentiate Analysis vs Forensics</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Forensic Data Analysis is about extracting insights; Digital Forensics is the entire investigative process.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Acquisition Methods</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Physical (bit-by-bit), Logical (files/folders), Sparse (specific sectors) – understand when to use each.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Chain of Custody</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Document every handling of evidence – critical for admissibility in court.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Common Tools</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">FTK Imager, EnCase, TSK, Autopsy, Volatility, Wireshark – know their primary uses.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Investigate. Preserve. Analyze. Report. 🔍</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Forensics Insight
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
                  <span>Forensics Phases</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Acquisition Methods</span>
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
                Digital forensics and incident response are about preserving truth and ensuring justice. Always maintain the integrity of evidence, document every step, and follow legal and ethical standards. These skills are invaluable in today's digital world.
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
                <strong className="text-white">Digital forensics</strong> is the scientific process of identifying, preserving, analyzing, and presenting digital evidence.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Incident response</strong> involves detection, containment, eradication, recovery, and lessons learned.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Acquisition methods</strong> include physical (bit-by-bit), logical (files/folders), and sparse (specific sectors).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Chain of custody</strong> is critical for evidence admissibility – document every handling.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Forensic tools</strong> like FTK Imager, EnCase, and Volatility help acquire and analyze evidence efficiently.
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
            Sidemann Academic Registry • Digital Forensics & Incident Response 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;