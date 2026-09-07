import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Home,
  Key,
  Fingerprint,
  Wifi,
  Database,
  HardDrive,
  Cloud,
  Zap,
  Thermometer,
  Fan,
  Droplet,
  Users,
  FileText,
  Clock,
  GraduationCap,
  Lightbulb,
  Award,
  Brain,
  ChevronRight,
  Search,
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
  ChartBar,
  AlertTriangle,
  RefreshCw as RefreshIcon,
  Trash2,
  Cog,
  CheckCircle,
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
  HardDrive as HardDriveIcon,
  Cloud as CloudIcon,
  Zap as ZapIcon,
  Droplet as DropletIcon,
  Thermometer as ThermometerIcon,
  Wrench,
} from 'lucide-react';
import { AdSense } from '../../../../analytics/AdSense';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'physical', label: 'Physical Threats' },
  { id: 'logical', label: 'Logical Threats' },
  { id: 'environmental', label: 'Environmental Threats' },
  { id: 'access-controls', label: 'Access Controls' },
  { id: 'drp', label: 'Disaster Recovery' },
  { id: 'backups', label: 'Backups' },
  { id: 'best-practices', label: 'Best Practices' },
  { id: 'practice', label: 'Practice' },
  { id: 'exam-tips', label: 'Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome7: React.FC = () => {
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
        text: 'Hardware security threats fall into exactly three categories: Physical, Logical, and Environmental. Always classify threats correctly!',
      },
      {
        title: 'Pro Tip',
        text: 'In a Disaster Recovery Plan, RTO is about time, RPO is about data loss. Know the difference!',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 7 components of a DRP with the acronym "BRDRTTT" – BIA, Risk, Backup, Response, Continuity, Testing, Training.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a power surge (voltage spike) with a power outage (total loss). Surges are more damaging to hardware.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Hardware security threats fall into exactly three categories: Physical, Logical, and Environmental. Always classify threats correctly!',
      },
      {
        title: 'Pro Tip',
        text: 'In a Disaster Recovery Plan, RTO is about time, RPO is about data loss. Know the difference!',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 7 components of a DRP with the acronym "BRDRTTT" – BIA, Risk, Backup, Response, Continuity, Testing, Training.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a power surge (voltage spike) with a power outage (total loss). Surges are more damaging to hardware.',
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
            className="text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
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
      <header className="bg-[#312e81] dark:bg-[#1e1b4b] border-b border-indigo-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Shield size={14} className="inline mr-1" /> HARDWARE SECURITY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 7{' '}
            <span className="text-indigo-300 font-bold italic">
              Threats to Hardware Security
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the full spectrum of threats that can compromise hardware –
            from physical theft and logical attacks to environmental dangers –
            and learn how to protect, recover, and plan for disasters.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Security
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Database size={14} className="inline mr-1" /> DRP
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
                placeholder="Search for a threat, DRP component, or backup type..."
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
                What Are Hardware Security Threats?
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Think of your computer like your house. You protect your house from thieves (physical threats), from people hacking your gate remote control (logical threats), and from floods or fire (environmental threats). Hardware security threats are ANYTHING that can damage, steal, or compromise your computer equipment and the data inside it.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Exam Highlight</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  <strong>There are exactly 3 categories of hardware security threats — Physical, Logical, and Environmental.</strong> Always state the category name first, then explain!
                </p>
              </div>
            </div>

            {/* 2. Physical Threats */}
            <div
              ref={(el) => {
                sectionRefs.current['physical'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Category 1: Physical Threats
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Physical threats are threats that involve someone physically touching, stealing, or interfering with your hardware. These are threats you can SEE with your eyes — a stolen laptop, a broken server room door, a hidden keylogger device plugged into a USB port.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><Home size={14} /> Theft</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Someone steals your hardware — laptops, hard drives, USB drives, servers. The data is often more valuable than the device itself. Encryption helps protect stolen data.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><Wrench size={14} /> Tampering</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Someone secretly interferes with your hardware — installing a keylogger, copying data from drives, or modifying components. Can go undetected for a long time.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><Users size={14} /> Unauthorised Access</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">People who should NOT have access to hardware are able to reach it — e.g., unlocked server rooms, lack of CCTV. Once someone has physical access, they can cause massive damage.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Solutions for Physical Threats:</h4>
                <Table
                  headers={["Solution", "What It Means"]}
                  rows={[
                    ["Physical Security", "Locked server rooms, security cameras (CCTV), access control systems (key cards)"],
                    ["Data Encryption", "Scramble data so that even if hardware is stolen, the data is unreadable without a key"],
                    ["Hardware Security Modules (HSMs)", "Dedicated devices that protect encryption keys and handle sensitive security operations"],
                    ["Tamper Detection", "Tamper-evident seals on equipment — if someone opens it, you can see it was opened"],
                  ]}
                />
              </div>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which physical threat involves secretly interfering with hardware to steal information?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 1)} /> a) Theft
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 1)} /> b) Tampering
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 1)} /> c) Unauthorised Access
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 1 ? '✅ Correct! Tampering involves secret interference with hardware.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Logical Threats */}
            <div
              ref={(el) => {
                sectionRefs.current['logical'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Category 2: Logical Threats
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Logical threats don't require anyone to physically touch your hardware — they attack through SOFTWARE. They exploit weaknesses in the software that controls your hardware — particularly firmware. They are sneaky because they leave no physical evidence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><Microchip size={14} /> Firmware Vulnerabilities</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Firmware is the permanent software built into hardware (BIOS/UEFI, router firmware). Hackers can exploit vulnerabilities to take control at a very deep level, below the OS. Regular firmware updates fix these.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><Shield size={14} /> Rootkits</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Malicious software that hides deep inside the system, often invisible to antivirus. Can take control of hardware resources, spy, and steal data. Extremely difficult to detect and remove.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><Key size={14} /> Hardware Backdoors</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Hidden, secret ways into a system that bypass normal security. Rare but serious — manufacturers may include backdoors intentionally (e.g., for government surveillance).</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Solutions for Logical Threats:</h4>
                <Table
                  headers={["Solution", "What It Means"]}
                  rows={[
                    ["Firmware Updates", "Regularly update firmware to patch known security holes"],
                    ["Secure Boot", "A BIOS/UEFI feature that prevents unauthorised or tampered software from loading at startup"],
                    ["Anti-Malware Software", "Software that detects and removes rootkits, viruses, and other malware"],
                    ["Strong Passwords", "Set strong passwords for BIOS/UEFI access so attackers can't change boot settings"],
                  ]}
                />
              </div>

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which logical threat is a piece of malicious software that hides deep in the system and is difficult to detect?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 1)} /> a) Firmware vulnerability
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 1)} /> b) Rootkit
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 2, 1)} /> c) Hardware backdoor
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 1 ? '✅ Correct! Rootkits are stealthy and hard to remove.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Environmental Threats */}
            <div
              ref={(el) => {
                sectionRefs.current['environmental'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Category 3: Environmental Threats
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Environmental threats come from the PHYSICAL ENVIRONMENT around the hardware — not from people, but from nature and physical conditions. In many regions, power surges, heat, dust, and flooding are very common and often underestimated.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><ZapIcon size={14} /> Power Surges</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Sudden spikes in voltage that can instantly destroy components like motherboards, PSUs, and hard drives. Common when power is restored after a blackout.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><ThermometerIcon size={14} /> Extreme Temperatures</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Overheating (common in hot environments) can permanently damage components. Cold can cause condensation. Maintain proper operating temperature ranges.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><Fan size={14} /> Dust and Moisture</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Dust blocks airflow and causes overheating. Moisture (humidity, spills) causes short circuits and corrosion. Regular cleaning and humidity control are essential.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Solutions for Environmental Threats:</h4>
                <Table
                  headers={["Solution", "What It Means"]}
                  rows={[
                    ["Surge Protectors", "Devices plugged between the wall socket and your computer that absorb power surges"],
                    ["Temperature Control", "Air conditioning, proper ventilation, and fan management to keep temps in range"],
                    ["Regular Cleaning", "Compressed air cleaning to remove dust from fans and vents regularly"],
                    ["Humidity Control", "Air conditioning and dehumidifiers to keep moisture levels safe"],
                  ]}
                />
              </div>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which environmental threat is most likely to occur immediately after a blackout when power is restored?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 2)} /> a) Extreme heat
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 2)} /> b) Dust accumulation
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 2, 2)} /> c) Power surge
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 2 ? '✅ Correct! Power surges often happen when power is restored.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
              </div>
            </div>

            {/* 5. Hardware Access Controls */}
            <div
              ref={(el) => {
                sectionRefs.current['access-controls'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Hardware Access Controls
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Access controls are methods used to make sure that ONLY authorised people can physically access hardware. There are 4 types.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><Key size={14} /> 1. Physical Locking Mechanisms</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Key locks, padlocks, combination locks. Most basic, but least secure — keys can be lost, copied, or stolen.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><Fingerprint size={14} /> 2. Biometric Access Controls</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Use unique physical characteristics — fingerprints, facial recognition, iris scans. Much more secure than keys or passwords.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><Wifi size={14} /> 3. Proximity Access Controls</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Use wireless technology — RFID cards, NFC (smartphones). Convenient and can be instantly deactivated if lost.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1"><Lock size={14} /> 4. Security Tokens</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Physical objects that prove identity — smart cards (chip + PIN), USB security keys (YubiKey) for two-factor authentication.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Access Control Best Practices:</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><span className="font-bold">Multi-Layered Approach</span> — Use more than one method (e.g., key card AND PIN).</li>
                  <li><span className="font-bold">Least Privilege Principle</span> — Give people ONLY the access they actually need.</li>
                  <li><span className="font-bold">Regular Access Reviews</span> — Check and update who has access periodically.</li>
                  <li><span className="font-bold">Strong Password Management</span> — Enforce strong passwords for all password-based controls.</li>
                </ul>
              </div>

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which type of access control uses unique physical characteristics like fingerprints or facial recognition?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 1)} /> a) Physical Locking
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 1)} /> b) Biometric
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 2, 1)} /> c) Proximity
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 1 ? '✅ Correct! Biometric controls use unique physical traits.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 6. Disaster Recovery Plan */}
            <div
              ref={(el) => {
                sectionRefs.current['drp'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Disaster Recovery Plan (DRP)
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A Disaster Recovery Plan (DRP) is a document that tells an organisation EXACTLY what to do AFTER a disaster to get IT systems back up and running as quickly as possible. Without a DRP, a company can be completely paralysed for weeks.
                </p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Key Terms</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 text-sm">
                  <strong>RTO (Recovery Time Objective)</strong> = How FAST you need to recover.<br />
                  <strong>RPO (Recovery Point Objective)</strong> = How much DATA LOSS you can accept.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                7 Components of a Disaster Recovery Plan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><ChartBar size={14} /> 1. Business Impact Analysis (BIA)</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Identifies critical business functions, determines RTO and RPO. Prioritises what to restore first.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><AlertTriangle size={14} /> 2. Risk Assessment</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Evaluates threats (natural disasters, power outages, cyberattacks) and their likelihood and impact.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><HardDriveIcon size={14} /> 3. Data Backup and Recovery Strategy</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Defines backup frequency, storage location (on-site/off-site), and restoration procedures.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><Wrench size={14} /> 4. Disaster Response Procedures</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Step-by-step instructions for immediate actions during a disaster — who to call, what to do, communication protocols.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1"><Globe size={14} /> 5. Business Continuity Plan</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">How to keep the business running during the disaster — manual procedures, backup locations.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1"><RefreshIcon size={14} /> 6. Testing and Maintenance</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Regular testing (drills, simulations) and updating the plan as technology and threats evolve.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h5 className="font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1"><Users size={14} /> 7. Training</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Everyone in the organisation needs to know their role in the DRP. Regular training ensures effective response.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Roles in Disaster Recovery
              </h3>

              <Table
                headers={["Role", "Responsibility"]}
                rows={[
                  ["Disaster Recovery Coordinator", "Oversees the ENTIRE DR program — planning, testing, training"],
                  ["Incident Commander", "TAKES CHARGE during the actual disaster — makes decisions"],
                  ["Technical Team", "Restores IT systems and infrastructure"],
                  ["Assessment Team", "Evaluates damage and determines recovery scope"],
                  ["Communications Team", "Keeps everyone informed — staff, customers, media"],
                  ["Recovery Team", "Restores critical business functions and data"],
                  ["Legal Team", "Handles legal issues during and after the disaster"],
                ]}
              />

              {/* Quiz 5 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What does RTO stand for in a Disaster Recovery Plan?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 0, 1)} /> a) Recovery Time Objective
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 1, 1)} /> b) Recovery Point Objective
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 2, 1)} /> c) Risk Tolerance Objective
                  </label>
                </div>
                {showQuiz5Result && (
                  <div className={`mt-2 p-2 rounded ${quiz5Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz5Answer === 0 ? '✅ Correct! RTO is about time to recover.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
              </div>
            </div>

            {/* 7. Backups */}
            <div
              ref={(el) => {
                sectionRefs.current['backups'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Importance of Backups
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Backups are copies of your data stored separately from the original. Data is one of the most valuable assets — losing it can mean losing years of work, customer records, and financial information.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><HardDriveIcon size={14} /> Hardware Failure</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Hard drives die. When they do, all data on them is gone FOREVER unless you have a backup.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><Trash2 size={14} /> Accidental Deletion</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Someone accidentally deletes an important file. Backups save the day.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1"><Shield size={14} /> Cyberattacks</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Ransomware encrypts your data and demands payment. With a good backup, you restore your data and pay nothing!</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1"><CloudIcon size={14} /> Natural Disasters</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Fire, flood, lightning strike. If your backup is stored off-site, your data survives even if your building doesn't.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                The 4 Types of Backups
              </h3>

              <Table
                headers={["Type", "What Gets Backed Up", "Storage Needed", "Restore Speed", "Restore Needs"]}
                rows={[
                  ["Full", "Everything", "Most", "Fast", "Just the full backup"],
                  ["Differential", "Changes since last FULL", "Medium", "Medium", "Full + Latest differential"],
                  ["Incremental", "Changes since last ANY backup", "Least", "Slowest", "Full + ALL incrementals"],
                  ["Mirror", "Everything (real-time)", "Double", "Fastest", "Just the mirror"],
                ]}
                title="Backup Comparison"
              />

              {/* Quiz 6 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which backup type stores the LEAST amount of data and is the fastest to perform?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz6" onChange={() => checkAnswer(6, 0, 2)} /> a) Full Backup
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz6" onChange={() => checkAnswer(6, 1, 2)} /> b) Differential Backup
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz6" onChange={() => checkAnswer(6, 2, 2)} /> c) Incremental Backup
                  </label>
                </div>
                {showQuiz6Result && (
                  <div className={`mt-2 p-2 rounded ${quiz6Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz6Answer === 2 ? '✅ Correct! Incremental backups store only changed data and are fastest.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
              </div>
            </div>

            {/* 8. Best Practices */}
            <div
              ref={(el) => {
                sectionRefs.current['best-practices'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                IT Best Practices Across IT Management
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><Server size={14} /> Hardware Management</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Keep a hardware inventory, create a maintenance schedule, standardise configurations.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><Microchip size={14} /> Software Management</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Track licenses, apply patches, standardise applications.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1"><Shield size={14} /> Data Security</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Regular backups, access controls, encryption (at rest and in transit).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><Cog size={14} /> System Administration</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">User accounts with least privilege, documentation, monitoring.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1"><Users size={14} /> User Support</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Documented support procedures, knowledge base, user training.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><Wifi size={14} /> Network Security</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Firewalls, IDS/IPS, secure wireless (WPA2/WPA3).</p>
                </div>
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
                question="Q1. List and explain the THREE categories of hardware security threats, giving ONE example of each."
                answer="1. Physical Threats — Involve unauthorized physical access to hardware. Example: Theft of a laptop containing sensitive company data.\n\n2. Logical Threats — Exploit software/firmware vulnerabilities to compromise hardware. Example: A rootkit hiding deep in the system and controlling hardware resources.\n\n3. Environmental Threats — Physical environmental conditions that damage hardware. Example: A power surge from ZESA burning out a computer's motherboard."
              />

              <QuestionReveal
                question="Q2. What is a power surge and how can it be prevented?"
                answer="A power surge is a sudden, unexpected spike in electrical voltage in the power supply line. It can instantly damage or destroy computer components. Prevention: Use a surge protector or a UPS (Uninterruptible Power Supply) between the wall socket and the computer."
              />

              <QuestionReveal
                question="Q3. Differentiate between an RTO and an RPO in the context of a Disaster Recovery Plan."
                answer="RTO (Recovery Time Objective) is the maximum acceptable amount of TIME that a system can be down after a disaster before it must be restored.\n\nRPO (Recovery Point Objective) is the maximum acceptable amount of DATA LOSS measured in time — it defines how far back in time a recovery can go."
              />

              <QuestionReveal
                question="Q4. List and explain FOUR types of hardware access controls."
                answer="1. Physical Locking Mechanisms — Key locks, padlocks, combination locks.\n\n2. Biometric Access Controls — Fingerprints, facial recognition, iris scans.\n\n3. Proximity Access Controls — RFID cards, NFC-enabled devices.\n\n4. Security Tokens — Smart cards and USB security keys used as additional authentication factors."
              />

              <QuestionReveal
                question="Q5. Compare Full, Differential, and Incremental backups."
                answer="A Full Backup copies ALL data — most comprehensive, slowest, requires most storage, simplest to restore.\n\nA Differential Backup copies only data changed since the last FULL backup — medium speed, grows bigger over time, restore requires full backup + latest differential.\n\nAn Incremental Backup copies only data changed since the LAST BACKUP of any type — fastest and smallest backup, but restore is most complex as it requires the full backup PLUS every incremental backup in the chain."
              />

              <QuestionReveal
                question="Q6. What are the 7 components of a Disaster Recovery Plan?"
                answer="1. Business Impact Analysis (BIA)\n2. Risk Assessment\n3. Data Backup and Recovery Strategy\n4. Disaster Response Procedures\n5. Business Continuity Plan\n6. Testing and Maintenance\n7. Training"
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Know the 3 Threat Categories</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Physical, Logical, Environmental – be able to list and give examples of each.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Differentiate Access Controls</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Physical locking, biometric, proximity, tokens – know strengths and weaknesses.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 DRP Components</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Memorise the 7 components: BIA, Risk Assessment, Backup Strategy, Response Procedures, Continuity Plan, Testing, Training.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Backup Types</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Full, Differential, Incremental, Mirror – compare storage and restore speed.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Real-World Context</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Relate concepts to local situations – power cuts, dust, theft – to make them stick.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Identify threats. Plan recovery. Backup data. Stay secure. 🛡️</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Security Insight
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
                  <span>Threat Categories</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>DRP Components</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Hardware security and disaster recovery might sound scary, but break it down into categories. Know the 3 threat types, the 4 access controls, the 7 DRP components, and the 4 backup types. Relate concepts to real-life situations in your environment — power cuts, dust, office break-ins — to make them stick.
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
                <strong className="text-white">Hardware security threats</strong> fall into three categories: Physical (theft, tampering), Logical (rootkits, firmware), and Environmental (power surges, heat).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Access controls</strong> – physical locks, biometrics, proximity, and tokens – help restrict physical access to hardware.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">A Disaster Recovery Plan (DRP)</strong> has 7 components: BIA, Risk Assessment, Backup Strategy, Response, Continuity, Testing, Training.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Backup types</strong> – Full, Differential, Incremental, Mirror – each has trade-offs between storage, speed, and restore complexity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Regular testing, training, and documentation</strong> are essential to ensure that security and recovery measures actually work when needed.
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
            Sidemann Academic Registry • Threats to Hardware Security 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome7;
