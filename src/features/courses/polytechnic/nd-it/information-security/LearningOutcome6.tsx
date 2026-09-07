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
  TrendingUp,
  Bell,
  Radar,
  Monitor,
  Settings,
  BookOpen,
  Users,
  Briefcase,
  Scale,
  DollarSign,
  Heart,
  CreditCard,
  Ticket,
  AlertCircle,
  LifeBuoy,
  ClipboardList,
  BookCopy,
  GitPullRequest,
  ChevronUp,
  X,
  RefreshCw,
  Sparkles,
  Lightbulb,
  GraduationCap,
  Brain,
  ChevronRight,
  Target,
  Gauge,
  Power,
  Cog,
  LockKeyhole,
  Link,
  Share2,
  Download,
  Upload,
  CloudOff,
  ShieldCheck,
  ListChecks,
  ClipboardCheck,
  Clipboard,
  Component,
  Cable,
  Plug,
  Thermometer,
  Droplet,
  User,
  Share,
  BellRing,
  RadarIcon,
  Settings2,
  ActivitySquare,
} from 'lucide-react';
import { AdSense } from '../../../../analytics/AdSense';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'incidents-problems-events', label: 'Incidents & Problems' },
  { id: 'identifying-incidents', label: 'Identifying Incidents' },
  { id: 'managing-incidents', label: 'Managing Incidents' },
  { id: 'incident-response-plan', label: 'Incident Response Plan' },
  { id: 'differentiating', label: 'Differentiating Incidents' },
  { id: 'sops', label: 'SOPs' },
  { id: 'cybersecurity-solutions', label: 'Security Solutions' },
  { id: 'best-practices', label: 'Best Practices' },
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
        text: 'In a trouble ticketing system, an incident is a one-time event, a problem is the root cause, and an event is any significant occurrence in the IT environment.',
      },
      {
        title: 'Pro Tip',
        text: 'SOPs (Standard Operating Procedures) are essential for consistency in SOCs – they reduce errors and improve response times.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the incident response phases: Identify → Contain → Eradicate → Recover → Lessons Learned.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse an incident (service interruption) with a problem (root cause). One incident can be caused by one problem, or one problem can cause many incidents.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'In a trouble ticketing system, an incident is a one-time event, a problem is the root cause, and an event is any significant occurrence in the IT environment.',
      },
      {
        title: 'Pro Tip',
        text: 'SOPs (Standard Operating Procedures) are essential for consistency in SOCs – they reduce errors and improve response times.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the incident response phases: Identify → Contain → Eradicate → Recover → Lessons Learned.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse an incident (service interruption) with a problem (root cause). One incident can be caused by one problem, or one problem can cause many incidents.',
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
      <header className="bg-[#134e4a] dark:bg-[#042f2e] border-b border-teal-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Ticket size={14} className="inline mr-1" /> INCIDENT MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 6{' '}
            <span className="text-cyan-300 font-bold italic">
              Incident Management & Standard Operating Procedures
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master trouble ticketing, incident identification, response plans,
            SOPs, cybersecurity solutions, and best practices for effective
            incident management.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <AlertCircle size={14} className="inline mr-1" /> Incidents
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ClipboardList size={14} className="inline mr-1" /> SOPs
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
                placeholder="Search for a concept, SOP type, or attack vector..."
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
                Introduction to Incident Management & SOPs
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Incident management is the process of identifying, analyzing, and responding to security incidents to minimize damage and restore normal operations. Standard Operating Procedures (SOPs) provide the structured, step-by-step instructions that ensure consistency and efficiency in handling incidents.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Incident management is like a fire department – when a fire breaks out (incident), you need to respond quickly (contain it), put it out (eradicate), check for remaining hotspots (recover), and figure out why it happened (lessons learned). SOPs are like the firefighter's manual – it tells everyone exactly what to do.
                </p>
              </div>
            </div>

            {/* 2. Incidents, Problems, and Events */}
            <div
              ref={(el) => {
                sectionRefs.current['incidents-problems-events'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Incidents, Problems, and Events in Trouble Ticketing Systems
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">In a trouble ticketing system, incidents, problems, and events are distinct categories used to classify and manage IT issues.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Incident</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A one-time event that interrupts a service or process.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Problem</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">The root cause of one or more incidents.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Event</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A significant occurrence in the IT environment, such as a system failure or security alert.</p>
                </div>
              </div>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What is the root cause of one or more incidents called?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 1)} /> a) Incident
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 1)} /> b) Problem
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 1)} /> c) Event
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 1 ? '✅ Correct! A problem is the root cause of one or more incidents.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Identifying Security Incidents */}
            <div
              ref={(el) => {
                sectionRefs.current['identifying-incidents'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Identifying Security Incidents
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">Detecting Security Incidents</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Security Information and Event Management (SIEM) systems:</strong> Monitor and analyze security events across the network.</li>
                  <li><strong>Intrusion Detection Systems (IDS):</strong> Detect network intrusions and anomalies.</li>
                  <li><strong>Endpoint Detection and Response (EDR):</strong> Monitor endpoint devices for malicious activity.</li>
                  <li><strong>User Reports:</strong> Employees may report suspicious activity or security breaches.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Common Attack Vectors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Phishing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Deceiving users into revealing sensitive information.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Malware</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Malicious software designed to harm systems.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Denial-of-Service (DoS) Attacks</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Overwhelming a system with traffic to make it unavailable.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">SQL Injection</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Exploiting vulnerabilities in web applications to access or manipulate databases.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Cross-Site Scripting (XSS)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Injecting malicious code into web pages to steal user data or hijack sessions.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Types of Security Incidents and Prevention</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Data Breaches:</strong> Implement strong access controls, encryption, and DLP measures.</li>
                  <li><strong>Malware Infections:</strong> Use antivirus, firewalls, and keep systems updated.</li>
                  <li><strong>Phishing Attacks:</strong> Train employees to recognize phishing attempts.</li>
                  <li><strong>Denial-of-Service Attacks:</strong> Implement firewalls and intrusion prevention systems.</li>
                  <li><strong>Insider Threats:</strong> Conduct security awareness training and enforce access controls.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Identifying Trends in Incident Causes</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Analyze incident logs to identify patterns and trends.</li>
                  <li>Conduct regular security assessments to identify vulnerabilities.</li>
                  <li>Monitor threat intelligence feeds to stay informed about the latest threats.</li>
                </ul>
              </div>

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which system monitors and analyzes security events across the network?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 0)} /> a) SIEM
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 0)} /> b) IDS
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 2, 0)} /> c) EDR
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 0 ? '✅ Correct! SIEM monitors and analyzes security events.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Managing IT Incidents */}
            <div
              ref={(el) => {
                sectionRefs.current['managing-incidents'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Managing IT Incidents
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Incident Identification</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Detect and classify the incident.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Incident Containment</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Isolate the affected system or network.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Incident Eradication</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Remove the root cause of the incident.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Incident Recovery</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Restore affected systems and data.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Incident Lessons Learned</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Analyze the incident to identify lessons learned and improve future response.</p>
                </div>
              </div>
            </div>

            {/* 5. Creating an Incident Response Plan */}
            <div
              ref={(el) => {
                sectionRefs.current['incident-response-plan'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Creating an Incident Response Plan
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Incident Response Team</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Assemble a team of skilled professionals to handle incidents.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Incident Reporting</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Establish procedures for reporting and documenting incidents.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Incident Classification</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Develop a system for classifying incidents based on severity and impact.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Incident Containment</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Outline steps to isolate affected systems and prevent further damage.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Incident Eradication</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Describe procedures for removing the root cause.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">Incident Recovery</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Define steps to restore systems and data.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h4 className="text-xs font-bold text-pink-600 dark:text-pink-400">Post-Incident Analysis</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Conduct a thorough analysis to identify lessons learned and improve future response.</p>
                </div>
              </div>
            </div>

            {/* 6. Differentiating Between Incidents */}
            <div
              ref={(el) => {
                sectionRefs.current['differentiating'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Differentiating Between Incidents
              </h2>

              <Table
                headers={["Factor", "What It Means"]}
                rows={[
                  ["Severity", "High-severity incidents require immediate attention, while low-severity incidents may be less urgent."],
                  ["Impact", "Evaluate the impact of the incident on business operations and data security."],
                  ["Root Cause", "Determine the underlying cause to prevent recurrence."],
                  ["Required Actions", "Identify the specific actions needed to resolve the incident."],
                ]}
                title="Key Factors for Differentiation"
              />
            </div>

            {/* 7. Standard Operating Procedures (SOPs) */}
            <div
              ref={(el) => {
                sectionRefs.current['sops'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Standard Operating Procedures (SOPs)
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Standard Operating Procedures (SOPs) are detailed step-by-step instructions on how to perform specific tasks. In cybersecurity, SOPs provide a standardized approach to handling various tasks, ensuring consistency and efficiency.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Importance of SOPs in SOCs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Consistency</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Ensures tasks are performed consistently, reducing errors.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Efficiency</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Streamlines processes and reduces task completion time.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Training</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Provides a valuable resource for training new staff.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Compliance</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Helps organizations comply with industry regulations.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Risk Mitigation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Reduces the risk of human error and security breaches.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Problems Resolved by SOPs</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Inconsistency:</strong> SOPs provide a standardized approach.</li>
                  <li><strong>Lack of Documentation:</strong> SOPs document processes for reference.</li>
                  <li><strong>Inefficiency:</strong> SOPs identify and eliminate inefficiencies.</li>
                  <li><strong>Human Error:</strong> Following SOPs reduces mistakes.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Types of SOPs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Checklists</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A list of tasks to be completed, often for simple processes.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Step-by-Step Lists</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A detailed list of steps providing a clear sequence of actions.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Hierarchical Lists</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A hierarchical breakdown showing the relationship between steps.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Process Flowcharts</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Visual representations using diagrams to show task flow.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Process of Creating SOPs</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Identify Processes:</strong> Determine which processes need an SOP.</li>
                  <li><strong>Establish a Review Process:</strong> Define a process for reviewing and updating SOPs.</li>
                  <li><strong>Collect Necessary Data:</strong> Gather information on specific steps.</li>
                  <li><strong>Write the Workflow:</strong> Develop clear, concise instructions.</li>
                  <li><strong>Publish SOPs:</strong> Distribute to relevant staff.</li>
                  <li><strong>Maintain and Update SOPs:</strong> Regularly review and update.</li>
                </ul>
              </div>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which type of SOP uses diagrams to show the flow of tasks?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 3)} /> a) Checklist
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 3)} /> b) Step-by-Step List
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 2, 3)} /> c) Hierarchical List
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 3, 3)} /> d) Process Flowchart
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 3 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 3 ? '✅ Correct! Process flowcharts use diagrams.' : '❌ Incorrect. The correct answer is d.'}
                  </div>
                )}
              </div>
            </div>

            {/* 8. Categories of Cybersecurity Solutions */}
            <div
              ref={(el) => {
                sectionRefs.current['cybersecurity-solutions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Categories of Cybersecurity Solutions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Application Security</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Web Application Firewalls (WAFs)</li>
                    <li>Static Application Security Testing (SAST)</li>
                    <li>Dynamic Application Security Testing (DAST)</li>
                    <li>Interactive Application Security Testing (IAST)</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Endpoint Security</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Antivirus and Anti-Malware</li>
                    <li>Endpoint Detection and Response (EDR)</li>
                    <li>Endpoint Protection Platforms (EPP)</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Network Security</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Firewalls</li>
                    <li>Intrusion Detection Systems (IDS)</li>
                    <li>Intrusion Prevention Systems (IPS)</li>
                    <li>Virtual Private Networks (VPNs)</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">IoT Security</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Device Security (firmware, authentication)</li>
                    <li>Network Security (protocols, access)</li>
                    <li>Data Security (encryption)</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Cloud Security</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Cloud Access Security Broker (CASB)</li>
                    <li>Cloud Security Posture Management (CSPM)</li>
                    <li>Cloud Workload Protection Platforms (CWPP)</li>
                  </ul>
                </div>
              </div>

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which solution protects cloud applications by enforcing security policies?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 0)} /> a) CASB
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 0)} /> b) CSPM
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 2, 0)} /> c) CWPP
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 0 ? '✅ Correct! CASB enforces security policies for cloud applications.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
              </div>
            </div>

            {/* 9. Basic Cybersecurity Best Practices */}
            <div
              ref={(el) => {
                sectionRefs.current['best-practices'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Basic Cybersecurity Best Practices
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Strong User Authentication</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Use strong, unique passwords</li>
                    <li>Enable multi-factor authentication (MFA)</li>
                    <li>Enforce regular password changes</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Patching & Updates</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Keep systems and software updated</li>
                    <li>Apply security patches promptly</li>
                    <li>Use automated patch management</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Backup & Encryption</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Regularly back up important data</li>
                    <li>Encrypt sensitive data at rest and in transit</li>
                    <li>Test backup restoration regularly</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Employee Training</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Provide regular security awareness training</li>
                    <li>Educate about phishing and social engineering</li>
                    <li>Conduct phishing simulations</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Incident Response Plan</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Create a plan for detection, containment, eradication, recovery, and lessons learned</li>
                    <li>Test the plan regularly</li>
                    <li>Update based on lessons learned</li>
                  </ul>
                </div>
              </div>

              {/* Quiz 5 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which best practice helps ensure you can recover from data loss or ransomware?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 0, 2)} /> a) Strong passwords
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 1, 2)} /> b) Patching
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 2, 2)} /> c) Regular backups
                  </label>
                </div>
                {showQuiz5Result && (
                  <div className={`mt-2 p-2 rounded ${quiz5Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz5Answer === 2 ? '✅ Correct! Regular backups enable recovery from data loss.' : '❌ Incorrect. The correct answer is c.'}
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
                question="Q1. What is the difference between an incident, a problem, and an event in a trouble ticketing system?"
                answer="An incident is a one-time event that interrupts a service or process. A problem is the root cause of one or more incidents. An event is any significant occurrence in the IT environment, such as a system failure or security alert."
              />

              <QuestionReveal
                question="Q2. List the five phases of incident management."
                answer="1. Incident Identification – Detect and classify the incident.\n2. Incident Containment – Isolate the affected system or network.\n3. Incident Eradication – Remove the root cause.\n4. Incident Recovery – Restore affected systems and data.\n5. Incident Lessons Learned – Analyze and improve future response."
              />

              <QuestionReveal
                question="Q3. What are Standard Operating Procedures (SOPs) and why are they important in a SOC?"
                answer="SOPs are detailed step-by-step instructions on how to perform specific tasks. They are important because they ensure consistency, efficiency, provide training resources, help with compliance, and reduce the risk of human error and security breaches."
              />

              <QuestionReveal
                question="Q4. List FOUR types of Standard Operating Procedures."
                answer="1. Checklists – a list of tasks to complete.\n2. Step-by-Step Lists – detailed sequence of actions.\n3. Hierarchical Lists – breakdown showing relationships between steps.\n4. Process Flowcharts – visual diagrams showing task flow and decision points."
              />

              <QuestionReveal
                question="Q5. List THREE categories of cybersecurity solutions and give an example of each."
                answer="1. Application Security – Web Application Firewalls (WAFs), SAST, DAST, IAST.\n2. Endpoint Security – Antivirus, EDR, EPP.\n3. Network Security – Firewalls, IDS, IPS, VPNs."
              />
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Know the Difference</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Incident (one-time interruption) vs Problem (root cause) vs Event (significant occurrence).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Incident Management Phases</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Identify → Contain → Eradicate → Recover → Lessons Learned – know each.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 SOP Types</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Checklists, Step-by-Step Lists, Hierarchical Lists, Process Flowcharts.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Attack Vectors</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Phishing, Malware, DoS, SQL Injection, XSS – know how to prevent each.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Best Practices</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Strong authentication, patching, backups, training, incident response plan.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Identify. Respond. Recover. Document. 🚨</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Incident Insight
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
                  <span>Incident Phases</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>SOP Types</span>
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
                Incident management is about being prepared – know the difference between incidents, problems, and events. Have a plan, train your team, and document everything. SOPs are your playbook – they ensure everyone knows what to do when things go wrong. The goal is to minimize damage and return to normal as quickly as possible.
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
                <strong className="text-white">Incidents</strong> are service interruptions, <strong>problems</strong> are root causes, and <strong>events</strong> are significant occurrences – know the difference.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Incident management</strong> follows five phases: Identify, Contain, Eradicate, Recover, Lessons Learned.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">SOPs</strong> (Standard Operating Procedures) ensure consistency, efficiency, and reduced errors – types include checklists, step-by-step lists, hierarchical lists, and flowcharts.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Common attack vectors</strong> include phishing, malware, DoS, SQL injection, and XSS – each requires specific prevention strategies.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Cybersecurity solutions</strong> fall into categories: application, endpoint, network, IoT, and cloud security.
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
            Sidemann Academic Registry • Incident Management & SOPs 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome6;