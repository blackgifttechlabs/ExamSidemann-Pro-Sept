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
  Bug,
  Wrench,
  Scan,
  Radio,
  Network,
  Cpu,
  UserCheck,
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
  Gauge,
  Monitor,
  Power,
  Cog,
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
  { id: 'vuln-assessment', label: 'Vulnerability Assessment' },
  { id: 'pen-testing', label: 'Penetration Testing' },
  { id: 'prioritize', label: 'Prioritization' },
  { id: 'scanning', label: 'Scanning' },
  { id: 'rootkits', label: 'Rootkits & Exploits' },
  { id: 'ids-ips', label: 'IDS/IPS' },
  { id: 'apt', label: 'APT' },
  { id: 'reporting', label: 'Reporting' },
  { id: 'practice', label: 'Practice' },
  { id: 'exam-tips', label: 'Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome3: React.FC = () => {
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
        text: 'A vulnerability assessment identifies weaknesses, while penetration testing exploits them to understand real-world impact.',
      },
      {
        title: 'Pro Tip',
        text: 'Always prioritize vulnerabilities using CVSS scores – focus on the ones with the highest impact and exploitability.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five stages of penetration testing: Reconnaissance, Scanning, Gaining Access, Maintaining Access, Analysis & Reporting.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse a vulnerability scanner (which identifies weaknesses) with a penetration test (which exploits them).',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'A vulnerability assessment identifies weaknesses, while penetration testing exploits them to understand real-world impact.',
      },
      {
        title: 'Pro Tip',
        text: 'Always prioritize vulnerabilities using CVSS scores – focus on the ones with the highest impact and exploitability.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five stages of penetration testing: Reconnaissance, Scanning, Gaining Access, Maintaining Access, Analysis & Reporting.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse a vulnerability scanner (which identifies weaknesses) with a penetration test (which exploits them).',
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Scan size={14} className="inline mr-1" /> VULNERABILITY ASSESSMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 3{' '}
            <span className="text-purple-300 font-bold italic">
              Vulnerability Assessment & Penetration Testing
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master vulnerability assessments, penetration testing, vulnerability scanning, rootkits, APTs, and reporting.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scan size={14} className="inline mr-1" /> Assessment
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Bug size={14} className="inline mr-1" /> Pen Testing
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
                placeholder="Search for a concept, tool, or stage..."
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
                Introduction to Vulnerability Assessment & Penetration Testing
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Vulnerability assessment is the systematic process of identifying, classifying, and prioritizing security weaknesses. Penetration testing goes a step further by actively exploiting those weaknesses to understand real-world impact. Together, they form the foundation of proactive security.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Vulnerability assessment is like checking your home for unlocked doors and windows (identifying weaknesses). Penetration testing is like actually trying to open them to see if a burglar could get in (exploiting vulnerabilities).
                </p>
              </div>
            </div>

            {/* 2. Vulnerability Assessment */}
            <div
              ref={(el) => {
                sectionRefs.current['vuln-assessment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Vulnerability Assessment
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A vulnerability assessment is a systematic process of identifying, classifying, and prioritizing security weaknesses in a system or network. By identifying and addressing vulnerabilities, organizations can reduce the risk of cyberattacks.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Threats Eliminated by Vulnerability Assessment
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>SQL Injection, XSS, and Other Code Injection Attacks:</strong> By identifying and patching vulnerabilities in web applications, organizations can prevent attackers from injecting malicious code.</li>
                  <li><strong>Privilege Escalation:</strong> By understanding and controlling user privileges, organizations can limit the damage that can be caused by unauthorized access.</li>
                  <li><strong>Unprotected Defaults:</strong> By configuring systems with strong security settings, organizations can reduce the risk of exploitation.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Types of Vulnerability Assessments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Host Assessment</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Focuses on individual systems (servers, workstations, mobile devices). Identifies OS, application, and configuration vulnerabilities.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Network and Wireless Assessment</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Examines network infrastructure (routers, switches, access points). Identifies misconfigurations, protocol weaknesses.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Database Assessment</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Evaluates database security – access controls, encryption, SQL injection vulnerabilities.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Application Scans</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Analyzes web applications and software for XSS, buffer overflows, and other flaws.</p>
                </div>
              </div>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which type of vulnerability assessment focuses on individual systems like servers and workstations?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 0)} /> a) Host Assessment
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 0)} /> b) Network Assessment
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 0)} /> c) Application Scan
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 0 ? '✅ Correct! Host assessment targets individual systems.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Penetration Testing */}
            <div
              ref={(el) => {
                sectionRefs.current['pen-testing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Penetration Testing
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Penetration testing (pen testing) is a simulated cyberattack performed on a target system or network to identify vulnerabilities and assess security risks. It involves actively exploiting weaknesses to understand the potential impact of a real-world attack.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Steps Involved in Penetration Testing
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Reconnaissance:</strong> Gather information about the target (infrastructure, services, potential vulnerabilities).</li>
                  <li><strong>Scanning:</strong> Scan for open ports, running services, and vulnerabilities.</li>
                  <li><strong>Exploitation:</strong> Exploit vulnerabilities to gain unauthorized access.</li>
                  <li><strong>Post-Exploitation:</strong> Escalate privileges, steal data, or deploy malware.</li>
                  <li><strong>Reporting:</strong> Document findings, impact, and recommendations.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Types of Penetration Testing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Black Box</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Tester has no prior knowledge. Must gather info through reconnaissance.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">White Box</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Tester has detailed knowledge of the target (infrastructure, apps, configs).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Grey Box</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Tester has limited information (e.g., IP addresses, network topology overview).</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Application Areas of Penetration Testing
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Web Applications:</strong> SQL injection, XSS, CSRF.</li>
                  <li><strong>Network Infrastructure:</strong> Routers, switches, firewalls.</li>
                  <li><strong>Wireless Networks:</strong> Weak encryption, unauthorized access points.</li>
                  <li><strong>Cloud Environments:</strong> IaaS, PaaS, SaaS security.</li>
                  <li><strong>Mobile Applications:</strong> Data privacy, secure coding, malware protection.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Significant Penetration Testing Tools
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Hping3:</strong> Flexible network scanning and testing.</li>
                  <li><strong>Nmap:</strong> Powerful network scanning for open ports and services.</li>
                  <li><strong>SuperScan:</strong> Network scanner for ports, services, OS.</li>
                  <li><strong>p0f:</strong> Passive OS fingerprinting.</li>
                  <li><strong>Xprobe2:</strong> Vulnerability scanner.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Penetration Testing vs. Vulnerability Assessment
              </h3>
              <Table
                headers={["Feature", "Penetration Testing", "Vulnerability Assessment"]}
                rows={[
                  ["Approach", "Simulates real-world attacks", "Identifies potential vulnerabilities"],
                  ["Focus", "Exploiting vulnerabilities", "Identifying weaknesses"],
                  ["Level of Detail", "In-depth analysis", "Broad overview"],
                  ["Tools", "Metasploit, Kali Linux", "Nmap, Nessus, OpenVAS"],
                  ["Skillset", "Technical hacking expertise", "Security knowledge and tool usage"],
                ]}
                title="Comparison"
              />
            </div>

            {/* 4. Prioritizing Vulnerabilities */}
            <div
              ref={(el) => {
                sectionRefs.current['prioritize'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Prioritizing Vulnerabilities
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Prioritizing vulnerabilities is crucial to allocate resources effectively. Common methods include:
                </p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Vulnerability Severity Score (CVSS):</strong> Standardized scoring system.</li>
                  <li><strong>Ease of Remediation:</strong> Effort required to fix.</li>
                  <li><strong>Vulnerability Publication Date:</strong> Recently discovered may be more critical.</li>
                  <li><strong>Popularity of the Vulnerable Software:</strong> Widely used software is more likely to be targeted.</li>
                  <li><strong>Application Type:</strong> Critical systems get higher priority.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Optimal Remediation Options
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Patching:</strong> Apply security updates.</li>
                  <li><strong>Configuration Changes:</strong> Modify settings to mitigate risk.</li>
                  <li><strong>Workarounds:</strong> Temporary solutions while permanent fix is developed.</li>
                  <li><strong>Network Segmentation:</strong> Isolate vulnerable systems.</li>
                  <li><strong>IDS/IPS:</strong> Monitor and block malicious traffic.</li>
                  <li><strong>Web Application Firewalls (WAF):</strong> Protect web apps.</li>
                </ul>
              </div>
            </div>

            {/* 5. Vulnerability Scanning */}
            <div
              ref={(el) => {
                sectionRefs.current['scanning'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Vulnerability Scanning
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Vulnerability scanning is the process of using automated tools to scan systems and networks for weaknesses like outdated software, weak passwords, and misconfigurations.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Types of Vulnerability Scanners
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Network Scanners</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Analyze routers, switches, firewalls.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Web Application Scanners</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Find SQL injection, XSS, CSRF in web apps.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Host-Based Scanners</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Check OS, applications, configurations on individual systems.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Database Scanners</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Identify database vulnerabilities (weak passwords, unauthorized access, SQL injection).</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Categorizing Vulnerability Scanners
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Based on Host:</strong> Scans individual systems.</li>
                  <li><strong>Based on Cloud:</strong> Scans cloud infrastructure.</li>
                  <li><strong>Based on Database:</strong> Scans databases.</li>
                  <li><strong>Based on Network:</strong> Scans networks (open ports, weak services, misconfigurations).</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Analyzing Vulnerability Assessment Tools
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Nessus:</strong> Popular scanner with broad features (network, web, database).</li>
                  <li><strong>OpenVAS:</strong> Open-source scanner, customizable.</li>
                  <li><strong>Qualys:</strong> Cloud-based vulnerability management platform.</li>
                  <li><strong>Nmap:</strong> Powerful network scanning (ports, services, OS).</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Network Security with Vulnerability Assessment
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Vulnerability Identification (Scanning):</strong> Use tools to find weaknesses.</li>
                  <li><strong>Analysis:</strong> Understand potential consequences, likelihood of exploitation.</li>
                  <li><strong>Risk Assessment:</strong> Evaluate overall risk (criticality, impact, cost of remediation).</li>
                  <li><strong>Remediation:</strong> Patch, configure, deploy controls, monitor continuously.</li>
                </ul>
              </div>
            </div>

            {/* 6. Rootkits and Exploits */}
            <div
              ref={(el) => {
                sectionRefs.current['rootkits'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Gaining Root Access & Rootkits
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Root access (administrative access) allows full control over a system. Attackers use various techniques to gain this level of access.
                </p>
                <h4 className="font-bold text-sm mt-4 mb-2 text-indigo-600 dark:text-indigo-400">Procedure for Gaining Root Access</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Exploiting Vulnerabilities:</strong> Buffer overflows, SQL injection, XSS.</li>
                  <li><strong>Password Cracking:</strong> Brute-force, dictionary attacks.</li>
                  <li><strong>Social Engineering:</strong> Manipulating users.</li>
                  <li><strong>Phishing Attacks:</strong> Tricking users to click malicious links.</li>
                  <li><strong>Backdoor Access:</strong> Installing malicious software.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Types of Rootkits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">User-Mode Rootkits</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Operate at user level; detectable by traditional antivirus.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Kernel-Mode Rootkits</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Modify kernel to hide presence; very difficult to detect and remove.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Categorizing Exploits
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Buffer Overflow:</strong> Arbitrary code execution.</li>
                  <li><strong>SQL Injection:</strong> Manipulate databases.</li>
                  <li><strong>Cross-Site Scripting (XSS):</strong> Inject malicious code into web pages.</li>
                  <li><strong>Remote Code Execution (RCE):</strong> Execute code on a remote system.</li>
                  <li><strong>Privilege Escalation:</strong> Gain higher privileges.</li>
                </ul>
              </div>
            </div>

            {/* 7. IDS/IPS and Brute Force */}
            <div
              ref={(el) => {
                sectionRefs.current['ids-ips'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Brute Force Attacks and IDS/IPS
              </h2>

              <Table
                headers={["Feature", "Brute Force Entry Attacks", "Intrusion Detection Systems"]}
                rows={[
                  ["Definition", "A technique used to guess passwords by trying all possible combinations.", "A system that monitors network traffic and system activity for signs of intrusion."],
                  ["Goal", "Gain unauthorized access to a system.", "Detect and respond to security threats."],
                  ["Techniques", "Dictionary attacks, brute-force, hybrid attacks.", "Signature-based, anomaly-based, behavior-based detection."],
                  ["Countermeasures", "Strong password policies, account lockout, IDS.", "IDS, SIEM, network security monitoring."],
                ]}
                title="Comparison"
              />

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Implementing Intrusion Prevention Systems (IPS)
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Signature-based IPS:</strong> Detects known attack signatures.</li>
                  <li><strong>Anomaly-based IPS:</strong> Detects deviations from normal traffic patterns.</li>
                  <li><strong>Hybrid IPS:</strong> Combines both techniques.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Buffer Overflow Attacks
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A buffer overflow occurs when a program writes more data to a buffer than it can hold, causing adjacent memory to be overwritten. This can lead to crashes, data corruption, or remote code execution. Prevention: safe coding practices (input validation, bounds checking).
                </p>
              </div>
            </div>

            {/* 8. Advanced Persistent Threat (APT) */}
            <div
              ref={(el) => {
                sectionRefs.current['apt'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Advanced Persistent Threat (APT)
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  An Advanced Persistent Threat (APT) is a sophisticated, well-resourced, and patient cyberattack campaign carried out by highly skilled attackers, often nation-states or organized crime.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Tools and Methods for Maintaining Access
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Backdoors:</strong> Remote access code.</li>
                  <li><strong>Rootkits:</strong> Hide attacker presence.</li>
                  <li><strong>Botnets:</strong> Compromised computer networks.</li>
                  <li><strong>Living-off-the-Land (LOL) Attacks:</strong> Use legitimate system tools to evade detection.</li>
                  <li><strong>Persistence Mechanisms:</strong> Maintain access after reboots or updates.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Benefits of Advanced Persistent Threat Testing
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Identify vulnerabilities.</li>
                  <li>Assess security posture.</li>
                  <li>Improve incident response.</li>
                  <li>Train security teams.</li>
                  <li>Stay ahead of adversaries.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Phases of an APT
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Reconnaissance:</strong> Gather info.</li>
                  <li><strong>Intrusion:</strong> Exploit vulnerabilities to gain initial access.</li>
                  <li><strong>Persistence:</strong> Establish foothold.</li>
                  <li><strong>Privilege Escalation:</strong> Gain higher-level access.</li>
                  <li><strong>Lateral Movement:</strong> Move across the network.</li>
                  <li><strong>Data Exfiltration:</strong> Steal sensitive data.</li>
                  <li><strong>C&C Communication:</strong> Maintain contact with attacker's infrastructure.</li>
                </ul>
              </div>

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which phase of an APT involves moving across the network to compromise additional systems?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 4)} /> a) Persistence
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 4)} /> b) Privilege Escalation
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 2, 4)} /> c) Reconnaissance
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 3, 4)} /> d) Lateral Movement
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 3 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 3 ? '✅ Correct! Lateral movement is moving across the network.' : '❌ Incorrect. The correct answer is d.'}
                  </div>
                )}
              </div>
            </div>

            {/* 9. Reporting */}
            <div
              ref={(el) => {
                sectionRefs.current['reporting'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Performing Final Analysis and Reporting
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  When reporting vulnerabilities, it's essential to provide clear, concise, and actionable information. A well-structured report should include:
                </p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Executive Summary:</strong> Brief overview, key findings, recommendations, impact.</li>
                  <li><strong>Vulnerability Details:</strong>
                    <ul className="list-disc pl-5 mt-1">
                      <li><strong>Vulnerability ID:</strong> Unique identifier.</li>
                      <li><strong>Vulnerability Description:</strong> Clear explanation.</li>
                      <li><strong>Affected Systems:</strong> List of systems/applications.</li>
                      <li><strong>Severity Rating:</strong> CVSS or other rating.</li>
                      <li><strong>Potential Impact:</strong> Consequences if exploited.</li>
                      <li><strong>Remediation Steps:</strong> Actionable steps to fix.</li>
                      <li><strong>References:</strong> CVE entries, vendor advisories.</li>
                    </ul>
                  </li>
                  <li><strong>Methodology:</strong> Assessment methods and tools used.</li>
                  <li><strong>Conclusion:</strong> Summary and overall risk assessment.</li>
                  <li><strong>Appendices:</strong> Supporting information (scan results, logs, screenshots).</li>
                </ul>
              </div>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which section of a vulnerability report gives a brief overview of key findings and recommendations?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 0)} /> a) Executive Summary
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 0)} /> b) Vulnerability Details
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 2, 0)} /> c) Methodology
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 0 ? '✅ Correct! The Executive Summary provides a high-level overview.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
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
                question="Q1. What is the difference between a vulnerability assessment and a penetration test?"
                answer="A vulnerability assessment is a systematic process of identifying, classifying, and prioritizing security weaknesses. It does not actively exploit them. A penetration test is a simulated cyberattack that actively exploits vulnerabilities to understand the real-world impact and assess the security posture."
              />

              <QuestionReveal
                question="Q2. List the five stages of a penetration test."
                answer="1. Reconnaissance – gather information about the target.\n2. Scanning – identify open ports, services, and vulnerabilities.\n3. Gaining Access – exploit vulnerabilities to gain unauthorized access.\n4. Maintaining Access – establish persistent access (backdoors, rootkits).\n5. Analysis and Reporting – document findings, impact, and recommendations."
              />

              <QuestionReveal
                question="Q3. What is a rootkit and what are its types?"
                answer="A rootkit is malicious software that allows attackers to maintain persistent, covert access to a computer system. Types: User-Mode Rootkits (operate at user level, detectable by antivirus) and Kernel-Mode Rootkits (modify the OS kernel to hide presence, very difficult to detect and remove)."
              />

              <QuestionReveal
                question="Q4. Explain the difference between an Intrusion Detection System (IDS) and an Intrusion Prevention System (IPS)."
                answer="An IDS monitors network traffic and system activity for signs of intrusion and alerts administrators. It does not actively block traffic. An IPS goes a step further by actively monitoring and blocking malicious traffic in real-time. IPS can be signature-based, anomaly-based, or hybrid."
              />

              <QuestionReveal
                question="Q5. What is an Advanced Persistent Threat (APT) and what are its phases?"
                answer="An APT is a sophisticated, well-resourced cyberattack campaign often carried out by nation-states or organized crime. Phases: Reconnaissance, Intrusion, Persistence, Privilege Escalation, Lateral Movement, Data Exfiltration, and C&C Communication."
              />

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which type of penetration testing gives the tester no prior knowledge of the target?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 0)} /> a) Black Box
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 0)} /> b) White Box
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 2, 0)} /> c) Grey Box
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 0 ? '✅ Correct! Black Box gives no prior knowledge.' : '❌ Incorrect. The correct answer is a.'}
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Know the Stages of Penetration Testing</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Reconnaissance, Scanning, Exploitation, Post-Exploitation, Reporting – understand what happens in each.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Differentiate VA vs PT</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Vulnerability Assessment identifies weaknesses; Penetration Testing exploits them to assess real-world impact.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Rootkits and APTs</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Know the types of rootkits (user-mode, kernel-mode) and the phases of an APT.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Vulnerability Scanning Tools</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Nessus, OpenVAS, Qualys, Nmap – know their primary uses.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Reporting</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A good report includes executive summary, vulnerability details, methodology, conclusion, and appendices.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Assess. Exploit. Report. Secure. 🛡️</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Vulnerability Insight
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
                  <span>Pen Testing Stages</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Rootkit Types</span>
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
                Vulnerability assessment and penetration testing are complementary. Assessments give you a broad view of weaknesses, while penetration testing validates the true risk. Always prioritize vulnerabilities based on severity and business impact, and document everything clearly for effective remediation.
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
                <strong className="text-white">Vulnerability assessment</strong> identifies and prioritizes weaknesses, while <strong>penetration testing</strong> exploits them to validate risk.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Penetration testing stages</strong>: Reconnaissance, Scanning, Exploitation, Post-Exploitation, Reporting.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Vulnerability scanning tools</strong> like Nessus, OpenVAS, and Nmap help automate the identification of weaknesses.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Rootkits</strong> (user-mode and kernel-mode) and <strong>APTs</strong> require advanced detection and response strategies.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Reporting</strong> must be clear, actionable, and include executive summaries, detailed vulnerability information, and remediation recommendations.
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
            Sidemann Academic Registry • Vulnerability Assessment & Penetration Testing 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;