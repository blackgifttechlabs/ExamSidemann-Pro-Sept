import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  BarChart2,
  Bell,
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  AlertCircle,
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
  FileText,
  BookOpen,
  Users,
  UserCheck,
  UserX,
  Fingerprint,
  KeyRound,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Zap,
  Power,
  Wrench,
  Hammer,
  PenTool,
  Scissors,
  Ruler,
  Compass,
  Map,
  MapPin,
  Home,
  Building,
  Briefcase,
  Layers,
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
  ClipboardList,
  ListChecks,
  FileCheck,
  FileWarning,
  Folder,
  FolderOpen,
  Archive,
  Package,
  Box,
  ToolCase,
  Boxes,
  Search,
  X,
  RefreshCw as RefreshIcon,
  ChevronRight,
  Target,
  Scale,
  Globe as GlobeIcon,
  HardDrive as HardDriveIcon,
  Server as ServerIcon,
  Database as DatabaseIcon,
  Cloud as CloudIcon,
  Wifi as WifiIcon,
  ChevronUp as ChevronUpIcon,
  Sparkles as SparklesIcon,
  DollarSign,
} from 'lucide-react';
import { AdSense } from '../../../../analytics/AdSense';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'monitoring', label: 'Monitoring' },
  { id: 'reasons', label: '5 Reasons' },
  { id: 'utilities', label: 'Utilities' },
  { id: 'logs', label: 'Monitoring Logs' },
  { id: 'security-intro', label: 'Security Intro' },
  { id: 'firewall-types', label: 'Firewall Types' },
  { id: 'app-vs-network', label: 'App vs Network Layer' },
  { id: 'stateful-vs-stateless', label: 'Stateful vs Stateless' },
  { id: 'ids-vs-ips', label: 'IDS vs IPS' },
  { id: 'vpn-concentrator', label: 'VPN Concentrator' },
  { id: 'firewall-features', label: 'Firewall Features' },
  { id: 'scanning-filtering', label: 'Scanning & Filtering' },
  { id: 'signature-zones', label: 'Signatures & Zones' },
  { id: 'physical-security', label: 'Physical Security' },
  { id: 'access-restriction', label: 'Access Restriction' },
  { id: 'protocols', label: 'Secure vs Unsecure Protocols' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'upgrades', label: 'Upgrades' },
  { id: 'documentation-updates', label: 'Documentation' },
  { id: 'servicing', label: 'Servicing' },
  { id: 'maintenance-types', label: 'Maintenance Types' },
  { id: 'practice', label: 'Practice Q&A' },
  { id: 'exam-tips', label: 'Exam Tips' },
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
        text: 'Network monitoring is like a CCTV system for your network – it watches everything and alerts you when something goes wrong.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use SSH instead of Telnet – SSH encrypts all communication, Telnet sends everything in plain text.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 5 firewall types: Packet-Filtering, Stateful, Application Layer, Proxy, and Next-Generation Firewall.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse IDS (detects and alerts) with IPS (detects and actively blocks). They serve different purposes!',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Network monitoring is like a CCTV system for your network – it watches everything and alerts you when something goes wrong.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use SSH instead of Telnet – SSH encrypts all communication, Telnet sends everything in plain text.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 5 firewall types: Packet-Filtering, Stateful, Application Layer, Proxy, and Next-Generation Firewall.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse IDS (detects and alerts) with IPS (detects and actively blocks). They serve different purposes!',
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
  const [quiz6Answer, setQuiz6Answer] = useState<number | null>(null);

  const [showQuiz1Result, setShowQuiz1Result] = useState(false);
  const [showQuiz2Result, setShowQuiz2Result] = useState(false);
  const [showQuiz3Result, setShowQuiz3Result] = useState(false);
  const [showQuiz4Result, setShowQuiz4Result] = useState(false);
  const [showQuiz5Result, setShowQuiz5Result] = useState(false);
  const [showQuiz6Result, setShowQuiz6Result] = useState(false);

  const checkAnswer = (quizNumber: number, selectedAnswer: number, correctAnswer: number) => {
    switch (quizNumber) {
      case 1: setQuiz1Answer(selectedAnswer); setShowQuiz1Result(true); break;
      case 2: setQuiz2Answer(selectedAnswer); setShowQuiz2Result(true); break;
      case 3: setQuiz3Answer(selectedAnswer); setShowQuiz3Result(true); break;
      case 4: setQuiz4Answer(selectedAnswer); setShowQuiz4Result(true); break;
      case 5: setQuiz5Answer(selectedAnswer); setShowQuiz5Result(true); break;
      case 6: setQuiz6Answer(selectedAnswer); setShowQuiz6Result(true); break;
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
            <Activity size={14} className="inline mr-1" /> NETWORK MONITORING
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 3{' '}
            <span className="text-purple-300 font-bold italic">
              Network Monitoring & Security
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master network monitoring, security devices, firewalls, protocols,
            troubleshooting, maintenance, and the tools that keep networks
            alive and secure.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Security
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Activity size={14} className="inline mr-1" /> Monitoring
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
                placeholder="Search for a concept, tool, or protocol..."
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
                Introduction to Network Monitoring & Security
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Network monitoring is the practice of continuously watching and analysing everything happening on your network — checking that devices are working, data is flowing correctly, and no security threats are present. Think of your network like the water pipes in a building. Network monitoring is like having a team of plumbers constantly checking the pressure, flow rate, and condition of those pipes — so they can catch a leak BEFORE it floods the whole building.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Think about how a bank like CBZ or FBC relies on their network every second of every day. If their network slows down or crashes, transactions stop, ATMs go offline, and customers get frustrated. Network monitoring is what prevents that from happening by catching problems early.
                </p>
              </div>
            </div>

            {/* 2. What Gets Monitored */}
            <div
              ref={(el) => {
                sectionRefs.current['monitoring'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                What Gets Monitored?
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Network Devices</strong> — Are routers, switches, and firewalls working properly?</li>
                  <li><strong>Traffic Flow</strong> — How much data is moving and what kind of data is it?</li>
                  <li><strong>Performance Metrics</strong> — Bandwidth usage, latency (delays), and packet loss</li>
                </ul>
              </div>
            </div>

            {/* 3. 5 Reasons */}
            <div
              ref={(el) => {
                sectionRefs.current['reasons'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                5 Reasons Why Network Monitoring is Important
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><AlertCircle size={14} /> 1. Prevent Problems</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">By continuously watching the network, you can spot warning signs BEFORE they turn into actual outages.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><BarChart2 size={14} /> 2. Maintain Efficiency</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Ensures the network is always running at its best — data flows freely, applications respond quickly, and users can do their work without frustration.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1"><Shield size={14} /> 3. Boost Security</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Helps detect unusual or suspicious activity — for example, if a large amount of data suddenly starts leaving the network at 3am, that could be a sign of a data breach.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><Wrench size={14} /> 4. Diagnose Issues Quickly</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">When something goes wrong, monitoring data tells you exactly WHERE the problem is and WHAT caused it.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><DollarSign size={14} /> 5. Optimise Resources</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Shows which parts of the network are heavily used and which are barely used. Helps management make smart decisions about where to invest in upgrades.</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Know all 5 reasons and be able to EXPLAIN each one — not just list the name. The examiner wants to see that you understand WHY each one matters!</p>
              </div>
            </div>

            {/* 4. Network Monitoring Utilities */}
            <div
              ref={(el) => {
                sectionRefs.current['utilities'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Monitoring Utilities
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Network monitoring utilities are specialised software tools that do the actual work of monitoring your network automatically. Think of them as the instruments on a pilot's dashboard — they show you everything happening in real time so you can make informed decisions.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">5 Core Functions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Traffic Monitoring</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Tracks how much data is flowing and what type of traffic it is (web browsing, video streaming, file transfers).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Device Monitoring</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Continuously checks whether all network devices are online and performing correctly.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Performance Analysis</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Analyses collected data over time to identify trends and problem areas.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Alerting</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">When something abnormal happens, the utility automatically sends an alert via email, SMS, or dashboard notification.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Reporting</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Generates detailed reports showing network performance over days, weeks, or months for management presentations and capacity planning.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">3 Types of Monitoring Utilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Open-Source (Free)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Nagios, Icinga. Great for smaller organisations with limited budgets. Require more technical knowledge to set up.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Commercial (Paid)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">PRTG Network Monitor, Datadog. Come with more features, better user interfaces, professional support, and easier setup.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Cloud-Based</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Run entirely on the internet. No need to install software on your own servers — log in from any browser anywhere.</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Know at least ONE open-source tool (Nagios) and ONE commercial tool (PRTG). Be ready to explain what each does!</p>
              </div>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which function of network monitoring utilities generates reports for management and capacity planning?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 4)} /> a) Traffic Monitoring
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 4)} /> b) Alerting
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 4)} /> c) Device Monitoring
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 3, 4)} /> d) Reporting
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 3 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 3 ? '✅ Correct! Reporting generates detailed network performance reports.' : '❌ Incorrect. The correct answer is d.'}
                  </div>
                )}
              </div>
            </div>

            {/* 5. Network Monitoring with Logs */}
            <div
              ref={(el) => {
                sectionRefs.current['logs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Monitoring with Logs
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Logs are automatically generated records that capture everything that happens on a network device or system. Every time a device does something — starts up, receives a packet, detects an error, connects to another device — it writes an entry in its log file. Logs are like a diary that the network writes about itself, 24 hours a day.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">3 Types of Logs</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">System Logs</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Record general system events — device restarts, service starts/stops, user logins, configuration changes. Give a broad picture of what's been happening on a device.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">History Logs</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Track specific activities or metrics over time — for example, bandwidth usage of a specific router every hour for 30 days. Extremely useful for identifying trends.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Event Logs</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Capture significant, noteworthy occurrences — security alerts, hardware failures, connection drops, authentication failures. Particularly important for security monitoring.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">How to Use Logs – 3 Steps</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Access the Logs</strong> — via CLI or web-based management consoles.</li>
                  <li><strong>Analyse the Logs</strong> — filter, search, and correlate. Search for errors, correlate login failures with unusual traffic.</li>
                  <li><strong>Take Action</strong> — troubleshoot, respond to threats, adjust configurations, or escalate issues.</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Know all 3 log types and what each one records. "System logs = general events, History logs = trends over time, Event logs = significant occurrences" is a great exam answer formula!</p>
              </div>
            </div>

            {/* 6. Network Security - Introduction */}
            <div
              ref={(el) => {
                sectionRefs.current['security-intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Security – Hardware vs Software Devices
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Hardware Security Devices</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Dedicated physical machines whose SOLE PURPOSE is monitoring and filtering network traffic. Examples: dedicated firewall appliances (Cisco ASA, Fortinet), hardware VPN concentrators, intrusion prevention appliances. Generally faster and more reliable than software alternatives.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Software Security Devices</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Programs installed on existing computers or servers that monitor activity on that specific device or network traffic passing through it. Examples: Windows Firewall, antivirus software, software-based IDS tools. Cheaper but share resources with other software on the same machine.</p>
                </div>
              </div>
            </div>

            {/* 7. Firewall Types */}
            <div
              ref={(el) => {
                sectionRefs.current['firewall-types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Firewalls – Types Explained
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A firewall is a security system that monitors and controls ALL incoming and outgoing network traffic based on predefined security rules. Think of it as the security guard at the main gate of a company — every visitor (data packet) must be checked before being allowed in or turned away. There are 5 types of firewalls – know all of them!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Packet-Filtering Firewall</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Most basic type. Examines each individual packet and checks it against rules based on source/destination IP, port, and protocol. Fast but not intelligent — treats each packet in isolation.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Stateful Inspection Firewall</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">More advanced. Not only examines individual packets but TRACKS the state of network connections. Maintains a 'state table' of active connections — knows whether a packet is part of an existing, legitimate connection.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Application Layer Firewall</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Monitors connections at the SESSION LAYER (Layer 5). Verifies that a TCP handshake has been completed properly before allowing data flow. Doesn't inspect actual data content — just the connection itself.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Proxy Firewall</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Acts as a MIDDLEMAN between your internal network and the internet. Makes requests on your behalf and passes responses back — hides your real network from the outside world.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Next-Generation Firewall (NGFW)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Most advanced and expensive. Combines ALL features of the above types AND adds: Deep Packet Inspection (DPI), application-layer control, integrated IDS/IPS, antivirus scanning, and more.</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Know all 5 firewall types. The most commonly tested comparison is Stateful vs Stateless and Application Layer vs Network Layer!</p>
              </div>
            </div>

            {/* 8. Application Layer vs Network Layer Firewalls */}
            <div
              ref={(el) => {
                sectionRefs.current['app-vs-network'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Application Layer vs Network Layer Firewalls
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Application Layer (Layer 7)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Operates at the top of the OSI model. Can examine the ACTUAL CONTENT within packets — what application is being used, what data is being sent. Can block specific applications like BitTorrent even if they use standard ports. Very detailed but slower.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Network Layer (Layer 3)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Operates at the network layer. Only looks at packet HEADERS — source/destination IPs, port numbers, protocols. Cannot examine actual content. Very fast but limited — cannot distinguish between different applications using the same port.</p>
                </div>
              </div>

              <Table
                headers={["Feature", "Application Layer (L7)", "Network Layer (L3)"]}
                rows={[
                  ["What it inspects", "Actual content", "Packet headers only"],
                  ["Control level", "Very detailed (per app)", "Basic (per IP/port)"],
                  ["Speed", "Slower", "Faster"],
                  ["Example", "Can block WhatsApp", "Can block port 443"],
                ]}
                title="Comparison"
              />
            </div>

            {/* 9. Stateful vs Stateless Firewalls */}
            <div
              ref={(el) => {
                sectionRefs.current['stateful-vs-stateless'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Stateful vs Stateless Firewalls
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Stateful Firewall</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Tracks the state of ALL active network connections in a "state table." Makes intelligent decisions by considering whether a packet belongs to an existing connection. More secure and intelligent but uses more memory and processing.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Stateless Firewall</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Does NOT track connections. Examines each packet independently with no memory of previous packets. Simpler and faster, but less secure — may accidentally block legitimate return traffic.</p>
                </div>
              </div>

              <Table
                headers={["Feature", "Stateful", "Stateless"]}
                rows={[
                  ["Tracks connections?", "YES", "NO"],
                  ["Security level", "Higher", "Lower"],
                  ["Performance", "Slower", "Faster"],
                  ["Scalability", "Harder at high traffic", "Easier"],
                  ["Best for", "Security-focused networks", "High-speed, simple filtering"],
                ]}
                title="Comparison"
              />

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Stateful = remembers connections = smarter = more secure. Stateless = no memory = faster = less secure. This comparison is almost GUARANTEED in exams!</p>
              </div>

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which type of firewall tracks the state of active connections?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 0)} /> a) Stateful
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 0)} /> b) Stateless
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 0 ? '✅ Correct! Stateful firewalls track active connections.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
              </div>
            </div>

            {/* 10. IDS vs IPS */}
            <div
              ref={(el) => {
                sectionRefs.current['ids-vs-ips'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                IDS vs IPS – Intrusion Detection & Prevention Systems
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">These are security systems that monitor network traffic for suspicious activity. The key difference is what they DO when they find something suspicious.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">IDS – Intrusion Detection System</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">DETECTS suspicious activity and raises an ALERT — but does NOT automatically stop it. Passive system. Watches traffic, compares to known attack signatures or normal behaviour, and notifies the IT team. Human decides what action to take.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><strong>Signature-Based:</strong> Compares against known attack patterns.</li>
                    <li><strong>Anomaly-Based:</strong> Flags deviations from normal network behaviour.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">IPS – Intrusion Prevention System</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">DETECTS suspicious activity AND automatically ACTS to STOP it — blocks malicious traffic, terminates connections, updates firewall rules in real time. Active system. No human intervention needed.</p>
                </div>
              </div>

              <Table
                headers={["Feature", "IDS", "IPS"]}
                rows={[
                  ["Detection", "YES", "YES"],
                  ["Action", "Alert only", "Alert + Block"],
                  ["Response", "Manual (human decides)", "Automatic"],
                  ["Type", "Passive", "Active"],
                ]}
                title="Comparison"
              />

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">IDS = detects and ALERTS. IPS = detects and PREVENTS. This difference is one of the most tested concepts in network security!</p>
              </div>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which system detects suspicious activity AND automatically blocks it?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 1)} /> a) IDS
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 1)} /> b) IPS
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 1 ? '✅ Correct! IPS detects and actively blocks threats.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 11. VPN Concentrator */}
            <div
              ref={(el) => {
                sectionRefs.current['vpn-concentrator'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                VPN Concentrator
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A VPN concentrator is a dedicated device that manages a large number of VPN connections simultaneously. Acts as the central server that all remote users connect to for secure access to the company network. Handles user authentication, encryption, and tunnel management.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">3 Benefits</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><strong>Secure Remote Access</strong> — Employees working from home can securely access files and systems as if they were in the office.</li>
                <li><strong>Improved Scalability</strong> — Can manage hundreds or thousands of simultaneous VPN connections.</li>
                <li><strong>Centralised Management</strong> — All VPN connections, user authentication, and security policies are managed from one central device.</li>
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">3 Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Hardware</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Dedicated physical appliance. Highest performance and reliability. Best for large organisations. More expensive.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Software</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Application installed on an existing server. More affordable. Performance depends on the server it runs on.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Cloud-Based</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Hosted in the cloud — no physical hardware needed. Highly flexible and scalable. Relies on an external provider.</p>
                </div>
              </div>
            </div>

            {/* 12. Firewall Features */}
            <div
              ref={(el) => {
                sectionRefs.current['firewall-features'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Firewall Features – Detailed
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Packet Filtering</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">The core function. Examines packets against rules based on source/destination IPs, ports, and protocols. Basic but fast.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Stateful Inspection</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Tracks the state of active connections for context-aware decisions, not just isolated packet inspection.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Application Control</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Allows blocking or allowing specific applications regardless of what port they use. Can block social media apps even on port 443.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Deep Packet Inspection (DPI)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Goes inside the packet and examines actual content — not just the header. Can detect malware hidden in legitimate-looking traffic.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">VPN Support</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Allows the firewall to work alongside VPN systems to manage secure remote access for authorised users.</p>
                </div>
              </div>
            </div>

            {/* 13. Scanning Services & Content Filtering */}
            <div
              ref={(el) => {
                sectionRefs.current['scanning-filtering'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Scanning Services & Content Filtering
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">Scanning Services</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Proactively examine traffic, devices, and systems looking for threats BEFORE they cause damage. Like a high-tech metal detector at the entrance to your network.</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Vulnerability Scanning:</strong> Regularly scans for known security weaknesses (unpatched software, misconfigurations).</li>
                  <li><strong>Malware Scanning:</strong> Scans network traffic and device storage for viruses, worms, ransomware, spyware.</li>
                  <li><strong>IDS/IPS:</strong> Continuously monitors for suspicious behaviour patterns.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Content Filtering</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Controls what types of content and websites users on your network are allowed to access. Like a school librarian who decides which books students are allowed to read.</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Rule-Based Filtering:</strong> Blocks specific websites, categories (gambling, social media), or file types.</li>
                  <li><strong>Application Control:</strong> Blocks specific applications entirely, even if they bypass URL filtering.</li>
                  <li><strong>User-Based Filtering:</strong> Different rules for different users or groups (IT vs general staff, teachers vs students).</li>
                </ul>
              </div>
            </div>

            {/* 14. Signature Identification & Network Zones */}
            <div
              ref={(el) => {
                sectionRefs.current['signature-zones'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Signature Identification & Network Zones
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">Signature Identification</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">A signature is a unique pattern that identifies a specific known threat. Signature identification detects malicious content by comparing it against a database of known threat patterns.</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Benefits:</strong> Very effective at detecting KNOWN threats, fewer false positives, constantly updated databases.</li>
                  <li><strong>Limitation:</strong> CANNOT detect zero-day attacks – brand new, unknown threats with no existing signature.</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Zero-day = completely new unknown attack = signature detection CANNOT catch it. This is a very common exam question!</p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Network Zones</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">A logical segment of your network that has its own security level and access rules. Instead of one flat network, you divide it into zones — like different security-clearance areas in a government building.</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Benefits:</strong> Improved security (containment), reduced attack surface, enhanced compliance.</li>
                  <li><strong>How it works:</strong> Firewalls and ACLs are placed between zones to control traffic flow.</li>
                </ul>
              </div>
            </div>

            {/* 15. Physical Security */}
            <div
              ref={(el) => {
                sectionRefs.current['physical-security'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Physical Security
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Physical security means protecting the actual hardware devices from being physically accessed, stolen, or tampered with. No matter how good your software security is, if someone can walk up to your server and physically unplug the hard drive, all that software security means nothing. Physical security is the <strong>FIRST LINE OF DEFENCE</strong>.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">3 Key Practices</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Secure Location</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Keep servers, routers, switches in locked rooms or locked cabinets with restricted physical access. Only authorised IT staff should have keys or access codes.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">BIOS/UEFI Password Protection</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Set a password in the BIOS or UEFI so that if someone tries to boot from a USB drive (a common attack method), they cannot proceed without the password.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Data Encryption</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Encrypt the data on hard drives using strong encryption. If a thief steals the physical hard drive, they cannot read the data without the encryption key.</p>
                </div>
              </div>
            </div>

            {/* 16. Restricting Local and Remote Access */}
            <div
              ref={(el) => {
                sectionRefs.current['access-restriction'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Restricting Local and Remote Access
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Local User Accounts</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Create individual accounts for every person. Give each account only the permissions needed for their specific job — the "Least Privilege Principle."</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Strong Passwords & MFA</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Enforce strong, complex passwords changed regularly. Implement MFA – a second form of verification (like a code sent to your phone) in addition to the password.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Remote Access Controls</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Use secure methods only: SSH for command-line access, VPNs for general remote access. Limit which users can connect remotely. Disable unnecessary remote access methods.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Multi-Layered Security</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">No single measure is enough. Combine physical security + access controls + firewalls + encryption + monitoring + user training. This is "defence in depth."</p>
                </div>
              </div>
            </div>

            {/* 17. Secure vs Unsecure Protocols */}
            <div
              ref={(el) => {
                sectionRefs.current['protocols'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Secure vs Unsecure Protocols
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">This is one of the most important and most tested topics! You need to know which protocols are SECURE (encrypt data) and which are UNSECURE (send data in plain text).</p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">✅ Secure Protocols</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">SSH</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Remote access – encrypts ALL communication. Replaced insecure Telnet.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">HTTPS</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Web browsing – encrypts communication using SSL/TLS. Look for the padlock icon.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">SNMPv3</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Network management – uses encryption AND authentication. Replaced insecure SNMPv1/v2.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">SFTP</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">File transfer – built on SSH, everything is encrypted. Replaced insecure FTP.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">❌ Unsecure Protocols</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Telnet</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Remote access – sends EVERYTHING in plain text. Replaced by SSH. Should NEVER be used today.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">HTTP</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Web browsing – no encryption. Usernames, passwords, personal information all visible. Only acceptable for public, non-sensitive content.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">FTP</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">File transfer – sends usernames, passwords, and file contents in plain text. Replaced by SFTP.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">RSH / RCP</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Remote shell/copy – very old protocols with no encryption. Replaced by SSH and SFTP.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">SNMPv1/v2</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Network management – no encryption, no authentication. Replaced by SNMPv3.</p>
                </div>
              </div>

              <Table
                headers={["Purpose", "❌ UNSECURE", "✅ SECURE"]}
                rows={[
                  ["Remote device access", "Telnet, RSH", "SSH"],
                  ["Web browsing", "HTTP", "HTTPS"],
                  ["File transfer", "FTP, RCP", "SFTP"],
                  ["Network management", "SNMPv1, SNMPv2", "SNMPv3"],
                ]}
                title="Protocol Comparison"
              />

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">This table is GOLD for exams! Memorise the secure replacement for each unsecure protocol. Common question: "Why should Telnet not be used? What should replace it?" Answer: "Telnet sends data in plain text. SSH should be used instead because it encrypts all communication."</p>
              </div>

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which protocol should replace Telnet for secure remote access?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 1)} /> a) HTTP
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 1)} /> b) SSH
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 2, 1)} /> c) FTP
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 1 ? '✅ Correct! SSH is the secure replacement for Telnet.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 18. Network Troubleshooting */}
            <div
              ref={(el) => {
                sectionRefs.current['troubleshooting'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Troubleshooting
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  The systematic process of identifying and resolving problems preventing a network from functioning correctly. Good troubleshooting requires a methodical, logical approach — not just randomly trying things and hoping something works.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">3 Categories of Problems</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Physical Issues</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Loose/disconnected cables</li>
                    <li>Damaged cables</li>
                    <li>Faulty router/modem</li>
                    <li>Wrong port being used</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Logical Issues</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Incorrect IP/subnet mask</li>
                    <li>Outdated firmware</li>
                    <li>Wrong firewall rules</li>
                    <li>Software conflicts</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Wireless Issues</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Weak signal</li>
                    <li>Channel interference</li>
                    <li>Wrong SSID/password</li>
                    <li>RF interference</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Troubleshooting Action Plan – 5 Steps</h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Create an Action Plan</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Define the GOAL, outline possible solutions, prioritise the most likely solutions, assign roles.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Identify Potential Effects</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Before implementing ANY change, think about what could go wrong. Estimate potential downtime. Ensure changes can be reversed.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Implement and Test the Solution</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Execute one step at a time. Document every action. Test after each step.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Identify Results and Effects</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Evaluate whether the solution worked. Monitor for recurrence. Check for new problems.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Document the Solution</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Write a comprehensive report: problem, cause, steps taken, solution, prevention recommendations.</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Know all 5 steps of the troubleshooting action plan IN ORDER. Examiners often ask "Describe the steps of a network troubleshooting action plan."</p>
              </div>
            </div>

            {/* 19. Prepping for Network Upgrades */}
            <div
              ref={(el) => {
                sectionRefs.current['upgrades'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Prepping for Network Upgrades
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Before upgrading any part of the network, you must first thoroughly review your CURRENT network environment. Jumping into upgrades without understanding what you already have is a recipe for disaster — like renovating a house without knowing where the water pipes and electrical wires are!
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">5 Benefits of Reviewing Before Upgrading</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><strong>Understanding Current State</strong> – Clear picture of exactly what equipment and configurations you have.</li>
                <li><strong>Identifying Bottlenecks and Gaps</strong> – Reveals which parts are underperforming or outdated.</li>
                <li><strong>Planning for Compatibility</strong> – Ensures new equipment will work with what you're keeping.</li>
                <li><strong>Documentation Accuracy</strong> – Forces you to update network documentation BEFORE the upgrade.</li>
                <li><strong>Compliance Considerations</strong> – Confirms upgraded network will meet regulatory standards.</li>
              </ul>
            </div>

            {/* 20. Updating Documentation After Upgrades */}
            <div
              ref={(el) => {
                sectionRefs.current['documentation-updates'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Updating Documentation After Upgrades
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  After completing a network upgrade, documentation MUST be updated immediately. Outdated documentation is almost as dangerous as no documentation — it gives you false confidence that you understand the network when actually your information is wrong.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">4 Things to Update</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><strong>Wiring Schematics and Physical Diagrams</strong> – Update cable connections, device locations, rack layouts.</li>
                <li><strong>Logical Network Diagrams</strong> – Update IP addresses, subnet masks, routing protocols, VLAN configurations.</li>
                <li><strong>Network Configurations</strong> – Review and update documented configurations for all affected devices.</li>
                <li><strong>Job Logs</strong> – Document the upgrade process, challenges, and resolutions.</li>
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">4 Benefits of Updated Documentation</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>Improved accuracy – everyone works from correct information.</li>
                <li>Enhanced troubleshooting – accurate diagrams speed up resolution.</li>
                <li>Efficient maintenance – technicians find what they need quickly.</li>
                <li>Simplified future upgrades – accurate documentation is the starting point.</li>
              </ul>
            </div>

            {/* 21. Network Hardware Servicing */}
            <div
              ref={(el) => {
                sectionRefs.current['servicing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Hardware Servicing
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Just like a car needs regular oil changes and servicing to keep running well, network hardware needs regular maintenance. Ignoring hardware maintenance leads to failures, downtime, security vulnerabilities, and expensive emergency replacements.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">5 Benefits</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><strong>Enhanced Performance</strong> – Cleaning dust, checking fans, ensuring proper airflow.</li>
                <li><strong>Reduced Downtime</strong> – Regular checkups identify potential failures before they happen.</li>
                <li><strong>Extended Hardware Lifespan</strong> – Well-maintained equipment lasts longer.</li>
                <li><strong>Improved Security</strong> – Regular servicing includes firmware updates, closing security gaps.</li>
                <li><strong>Peace of Mind</strong> – IT staff can focus on other tasks rather than firefighting.</li>
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Signs Hardware Needs Servicing</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><strong>Performance degradation</strong> – Slow speeds, frequent disconnections.</li>
                <li><strong>Overheating</strong> – Devices hot to the touch or thermal warnings in logs.</li>
                <li><strong>Unusual noises</strong> – Grinding, clicking, loud fans.</li>
                <li><strong>Frequent error messages</strong> – Persistent errors in logs.</li>
                <li><strong>Approaching End-of-Life (EOL)</strong> – Manufacturer no longer supports the device.</li>
              </ul>
            </div>

            {/* 22. Three Types of Maintenance */}
            <div
              ref={(el) => {
                sectionRefs.current['maintenance-types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Three Types of Network Hardware Maintenance
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Preventive Maintenance (PROACTIVE)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Scheduled, routine maintenance done BEFORE any failure occurs. Goal: keep hardware healthy and prevent problems.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Regular cleaning (compressed air)</li>
                    <li>Thermal management (check fans, airflow)</li>
                    <li>Firmware updates</li>
                    <li>Hardware checkups and diagnostics</li>
                    <li>Cable inspections</li>
                    <li>Backup and recovery verification</li>
                    <li>Inventory management</li>
                  </ul>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">Benefits: Reduced downtime, extended lifespan, better performance, lower overall costs.</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Corrective Maintenance (REACTIVE)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Maintenance done IN RESPONSE to hardware that has ALREADY failed. Goal: fix it as quickly as possible to minimise downtime.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Troubleshooting – diagnose root cause</li>
                    <li>Hardware repair – attempt to fix the faulty component</li>
                    <li>Hardware replacement – replace failed component or device</li>
                    <li>System recovery – restore data from backups</li>
                    <li>Documentation – record what failed and how it was fixed</li>
                  </ul>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">Drawbacks: Downtime, data loss risk, unexpected costs.</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Adaptive Maintenance (PROACTIVE)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Modifying or updating network components to ensure they continue working effectively as requirements or environment changes.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Monitoring performance to identify capacity needs</li>
                    <li>Evaluating new technologies</li>
                    <li>Security assessments and updates</li>
                    <li>Compliance updates</li>
                    <li>Software and firmware updates</li>
                    <li>Hardware upgrades</li>
                    <li>Capacity planning</li>
                  </ul>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">Benefits: Improved performance, enhanced security, increased scalability, reduced costs.</p>
                </div>
              </div>

              <Table
                headers={["Feature", "Preventive", "Corrective", "Adaptive"]}
                rows={[
                  ["When done", "On schedule", "After failure", "When requirements change"],
                  ["Goal", "Prevent failure", "Fix failure", "Evolve with change"],
                  ["Approach", "Proactive", "Reactive", "Proactive"],
                  ["Example", "Monthly cleaning", "Replacing broken switch", "Upgrading bandwidth"],
                  ["Cost impact", "Low ongoing", "High unexpected", "Medium planned"],
                ]}
                title="Maintenance Types Comparison"
              />

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Know ALL THREE maintenance types, be able to compare them, and give examples of activities for each. This is a very popular exam question!</p>
              </div>

              {/* Quiz 5 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which type of maintenance is done on a regular schedule BEFORE any failure occurs?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 0, 0)} /> a) Preventive
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 1, 0)} /> b) Corrective
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 2, 0)} /> c) Adaptive
                  </label>
                </div>
                {showQuiz5Result && (
                  <div className={`mt-2 p-2 rounded ${quiz5Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz5Answer === 0 ? '✅ Correct! Preventive maintenance is proactive and scheduled.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
              </div>
            </div>

            {/* 23. Practice Q&A */}
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
                question="Q1. What is network monitoring and why is it important? Give THREE reasons."
                answer="Network monitoring is the continuous practice of observing and analysing the performance, availability, and health of a computer network. It is important because: firstly, it allows IT teams to prevent problems by identifying potential bottlenecks BEFORE they cause disruptions; secondly, it boosts security by detecting suspicious activity or breaches early; and thirdly, it helps diagnose issues faster by providing detailed data about what is happening on the network."
              />

              <QuestionReveal
                question="Q2. Differentiate between Stateful and Stateless firewalls."
                answer="A stateful firewall tracks the state of ALL active network connections in a state table. It remembers previous packets and makes filtering decisions based on the context of an ongoing connection — automatically allowing return traffic for connections established from inside the network. A stateless firewall does NOT track connections — it examines each packet independently without any memory of previous packets. It is faster but provides less security because it cannot distinguish between legitimate return traffic and suspicious packets."
              />

              <QuestionReveal
                question="Q3. Compare IDS and IPS."
                answer="An IDS (Intrusion Detection System) is a PASSIVE security system that monitors network traffic and raises ALERTS when suspicious activity is detected — but it does NOT automatically block the traffic. An IPS (Intrusion Prevention System) is an ACTIVE security system that not only detects suspicious activity but also automatically BLOCKS the malicious traffic in real time without requiring human intervention. In summary: IDS detects and alerts; IPS detects and prevents."
              />

              <QuestionReveal
                question="Q4. What is signature identification and what is its main limitation?"
                answer="Signature identification is a security technique that detects known threats by comparing network traffic or files against a database of predefined threat signatures — unique patterns that identify specific viruses, malware, or attack methods. It is very effective at detecting known threats. Its main limitation is that it CANNOT detect zero-day attacks — entirely new, previously unknown threats that have not yet been identified and added to the signature database."
              />

              <QuestionReveal
                question="Q5. List and explain the 5 steps of a network troubleshooting action plan."
                answer="1. Create an Action Plan – Define the goal, outline possible solutions, prioritise them, and assign responsibilities.\n\n2. Identify Potential Effects – Before making any changes, consider what impact they might have, estimate potential downtime, and ensure changes can be reversed.\n\n3. Implement and Test the Solution – Execute planned steps one at a time, documenting each action. Test after each step.\n\n4. Identify Results and Effects – Evaluate whether the solution worked, monitor for recurrence, and verify no new problems were created.\n\n5. Document the Solution – Write a comprehensive report of the problem, its cause, all steps taken, the solution, and recommendations to prevent future recurrence."
              />

              <QuestionReveal
                question="Q6. Differentiate between the three types of network hardware maintenance."
                answer="Preventive maintenance is a proactive approach done on a regular schedule BEFORE any failure occurs — activities include cleaning, firmware updates, and hardware checkups. The goal is to prevent failures. Corrective maintenance is a reactive approach performed AFTER hardware has already failed — activities include troubleshooting, repair, and replacement. The goal is to restore functionality as quickly as possible. Adaptive maintenance is a proactive approach that involves modifying the network in response to CHANGING requirements — activities include capacity planning, hardware upgrades, and security assessments. The goal is to ensure the network continues to meet evolving business needs."
              />

              <QuestionReveal
                question="Q7. Create a table comparing secure and unsecure network protocols."
                answer="Purpose | Unsecure | Secure\nRemote device access | Telnet, RSH | SSH\nWeb browsing | HTTP | HTTPS\nFile transfer | FTP, RCP | SFTP\nNetwork management | SNMPv1, SNMPv2 | SNMPv3\n\nUnsecure protocols transmit data in plain text, meaning anyone who intercepts the network traffic can read usernames, passwords, and data content. Secure protocols use encryption to scramble data so that intercepted traffic is unreadable without the decryption key."
              />

              <QuestionReveal
                question="Q8. What are the benefits of network zoning?"
                answer="Network zoning — dividing a network into logical segments with different security levels — provides three main benefits. First, improved security: if an attacker breaches one zone, firewalls and ACLs between zones prevent them from spreading to other zones, containing the damage. Second, reduced attack surface: devices in one zone cannot directly see or access devices in other zones, limiting what an attacker can target. Third, enhanced compliance: many industry regulations specifically require network segmentation."
              />

              {/* Quiz 6 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which type of maintenance involves modifying the network to meet changing requirements?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz6" onChange={() => checkAnswer(6, 0, 2)} /> a) Preventive
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz6" onChange={() => checkAnswer(6, 1, 2)} /> b) Corrective
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz6" onChange={() => checkAnswer(6, 2, 2)} /> c) Adaptive
                  </label>
                </div>
                {showQuiz6Result && (
                  <div className={`mt-2 p-2 rounded ${quiz6Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz6Answer === 2 ? '✅ Correct! Adaptive maintenance responds to changing requirements.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
              </div>
            </div>

            {/* 24. Exam Tips */}
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 5 Reasons for Monitoring</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Prevent problems, maintain efficiency, boost security, diagnose issues quickly, optimise resources – know each one.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 3 Log Types</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">System logs (general events), History logs (trends), Event logs (significant occurrences).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 5 Firewall Types</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Packet-Filtering, Stateful, Application Layer, Proxy, Next-Generation Firewall.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 IDS vs IPS</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">IDS = detects and alerts (passive). IPS = detects and prevents (active).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Secure vs Unsecure Protocols</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Telnet → SSH, HTTP → HTTPS, FTP → SFTP, SNMPv1/v2 → SNMPv3.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 5 Troubleshooting Steps</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Action Plan → Identify Effects → Implement & Test → Identify Results → Document.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 3 Maintenance Types</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Preventive (proactive), Corrective (reactive), Adaptive (change-driven).</p>
                </div>
              </div>

              {/* Cheat Sheet */}
              <div className="mt-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
                <h3 className="font-bold text-lg text-amber-800 dark:text-amber-300 mb-4">📋 Quick Cheat Sheet</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Reasons for monitoring</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">5</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Types of logs</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">3</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Firewall types</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">5</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Maintenance types</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">3</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Troubleshooting steps</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">5</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Secure protocols to know</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">4</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Monitor. Secure. Troubleshoot. Maintain. 🔐</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Monitoring Insight
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
                  <span>Firewall Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Maintenance Types</span>
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
                Monitoring, security, troubleshooting, and maintenance are the daily responsibilities of a real network administrator. Whether you end up working at NetOne, TelOne, a bank, a hospital, or a school in Zimbabwe — these skills will be your toolkit. Study them well, understand the concepts deeply, and you will not just pass the exam but be genuinely prepared for the real world!
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
                <strong className="text-white">Network monitoring</strong> continuously watches devices, traffic flow, and performance to prevent problems, boost security, and diagnose issues quickly.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Firewalls</strong> come in 5 types – Packet-Filtering, Stateful, Application Layer, Proxy, and Next-Generation – each with different capabilities.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">IDS vs IPS</strong> – IDS detects and alerts (passive); IPS detects and actively blocks (active). This is a key security difference.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Secure protocols</strong> like SSH, HTTPS, SFTP, and SNMPv3 encrypt data; unsecure protocols like Telnet, HTTP, FTP, and SNMPv1/v2 send data in plain text.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Troubleshooting</strong> follows a 5-step plan: Action Plan → Identify Effects → Implement & Test → Identify Results → Document.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">3 maintenance types</strong> – Preventive (proactive), Corrective (reactive), Adaptive (change-driven) – each has specific activities and benefits.
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
            Sidemann Academic Registry • Network Monitoring & Security 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;
