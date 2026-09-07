import React, { useState, useEffect, useRef } from 'react';
import {
  Database,
  Cpu,
  Terminal,
  Users,
  FileText,
  ClipboardList,
  Layers,
  ShieldCheck,
  Zap,
  HardDrive,
  Globe,
  Server,
  Monitor,
  Settings,
  Activity,
  ListChecks,
  ArrowRight,
  Info,
  CheckCircle,
  AlertTriangle,
  GraduationCap,
  Laptop,
  Briefcase,
  Repeat,
  BookOpen,
  Search,
  BarChart3,
  Layout,
  Smartphone,
  CheckSquare,
  List,
  Rocket,
  Brain,
  FileCode,
  Code,
  Database as DatabaseIcon,
  Lock,
  Clock,
  ChevronUp,
  RefreshCw,
  Trophy,
  Target,
  X,
  Key,
  Shield,
  Eye,
  FileText as FileTextIcon,
} from 'lucide-react';
import { MultiQuestionQuiz } from '../../../../activities/MiniGames';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'security', label: 'Security' },
  { id: 'sqli', label: 'SQL Injection' },
  { id: 'backup', label: 'Backup' },
  { id: 'quiz', label: 'Quiz' },
];

// ──────────────────────────────────────────────────────────────────────────────
// LOCAL LESSON IMAGE HELPER
// ──────────────────────────────────────────────────────────────────────────────
const dbImage = (seed: string) =>
  `/images/database-concepts/db-${seed}.png`;

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome6: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(
    null
  );

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
        text: 'The CIA Triad (Confidentiality, Integrity, Availability) is the foundation of database security. Every security measure ultimately serves one of these three goals.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use parameterized queries (prepared statements) to prevent SQL Injection – it’s the single most effective defense.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four core security mechanisms: "Authentication, Authorization, Encryption, Auditing" – think of them as "AAEA".',
      },
      {
        title: 'Common Mistake',
        text: 'Many organizations neglect to encrypt data at rest. Even if the server is compromised, encrypted data remains unreadable without the keys.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The CIA Triad (Confidentiality, Integrity, Availability) is the foundation of database security. Every security measure ultimately serves one of these three goals.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use parameterized queries (prepared statements) to prevent SQL Injection – it’s the single most effective defense.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four core security mechanisms: "Authentication, Authorization, Encryption, Auditing" – think of them as "AAEA".',
      },
      {
        title: 'Common Mistake',
        text: 'Many organizations neglect to encrypt data at rest. Even if the server is compromised, encrypted data remains unreadable without the keys.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  const setSectionRef = (id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  };

  const scrollToSection = (index: number) => {
    setActiveSectionIndex(index);
    const tab = SECTION_TABS[index];
    const element = sectionRefs.current[tab.id];
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
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

  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#134e4a] dark:bg-[#042f2e] border-b border-teal-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <DatabaseIcon size={14} className="inline mr-1" /> DATABASE SECURITY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 6{' '}
            <span className="text-cyan-300 font-bold italic">
              Security &amp; Integrity
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master database security fundamentals: authentication, authorisation,
            encryption, auditing, SQL injection prevention, and backup &amp; recovery
            strategies.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">📚 5 sections</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ShieldCheck size={14} className="inline mr-1" /> Security Core
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Lock size={14} className="inline mr-1" /> SQL Injection
            </span>
          </div>

          {/* Search Bar */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-indigo-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, mechanism, or attack..."
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

      {/* ─── Navigation ──────────────────────────────────────────────────── */}
      <NavTabs />

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* ─── Content ────────────────────────────────────────────────── */}
          <div ref={listContainerRef} className="space-y-12">

            {/* ─── 0. Intro ────────────────────────────────────────────── */}
            <div ref={setSectionRef('intro')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-3 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                  Database security refers to the collective measures used to protect and secure a database or database management software from illegitimate use and malicious cyber threats and attacks. Security is critical to maintaining the confidentiality, integrity, and availability (CIA Triad) of data.
                </p>
              </div>
            </div>

            {/* ─── 1. Core Security Mechanisms ─────────────────────────── */}
            <div ref={setSectionRef('security')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Core Security Mechanisms
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                The four pillars of database security: authentication, authorisation, encryption, and auditing. Each plays a vital role in protecting data.
              </p>

              <img
                src={dbImage('security-mechanisms')}
                alt="Database security mechanisms"
                className="w-full h-48 object-contain rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Key size={20} className="text-blue-600 dark:text-blue-400" />
                    <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase">Authentication</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    The process of verifying the identity of a user, device, or system. Common methods include passwords, biometrics, and multi-factor authentication (MFA).
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={20} className="text-purple-600 dark:text-purple-400" />
                    <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase">Authorisation</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    The process of determining what an authenticated user is permitted to do. Managed via privileges (GRANT/REVOKE commands in SQL).
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye size={20} className="text-amber-600 dark:text-amber-400" />
                    <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase">Encryption</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Encoding data so that it remains hidden from or inaccessible to unauthorized users. Data should be encrypted <em>at rest</em> (on disk) and <em>in transit</em> (over the network).
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <FileTextIcon size={20} className="text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase">Auditing</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Tracking database activities. Audit logs record who accessed what data and when, providing a trail for forensic analysis and compliance.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <Info size={16} /> Additional Considerations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div>
                    <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase">Principle of Least Privilege</p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Users should have only the permissions they need to do their job.</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase">Defence in Depth</p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Layer multiple security controls (network, host, application, database).</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase">Regular Reviews</p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Periodically review user permissions and audit logs to detect anomalies.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── 2. SQL Injection ────────────────────────────────────── */}
            <div ref={setSectionRef('sqli')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                SQL Injection (SQLi)
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                SQL Injection is a code injection technique where an attacker executes malicious SQL statements that control a web application's database server.
              </p>

              <img
                src={dbImage('sql-injection')}
                alt="SQL Injection attack"
                className="w-full h-48 object-contain rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-tight">How it works</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    Attackers inject malicious SQL code into input fields (e.g., login forms, search boxes) that are concatenated directly into SQL queries. This can allow them to bypass authentication, extract data, or even drop tables.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-tight">Prevention</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium space-y-1.5 list-disc pl-4 mt-2">
                    <li><strong>Prepared Statements</strong> (Parameterized Queries)</li>
                    <li><strong>Stored Procedures</strong></li>
                    <li><strong>Validate</strong> and sanitize all user input</li>
                    <li><strong>Principle of Least Privilege</strong> – limit database account permissions</li>
                    <li><strong>Web Application Firewall</strong> (WAF)</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-5 bg-yellow-50 dark:bg-yellow-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle size={16} /> Real-World Example
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                  In 2011, the Sony PlayStation Network breach exploited SQL Injection, exposing personal data of 77 million users. This highlights the critical need for input validation and parameterized queries.
                </p>
              </div>
            </div>

            {/* ─── 3. Backup and Recovery ───────────────────────────────── */}
            <div ref={setSectionRef('backup')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Backup and Recovery
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Security also involves protecting data from loss due to hardware failure, natural disasters, or malicious attacks. A robust backup and recovery strategy ensures business continuity.
              </p>

              <img
                src={dbImage('backup-recovery')}
                alt="Database backup and recovery"
                className="w-full h-48 object-contain rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase">Full Backup</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    A complete copy of the entire database. Provides the most comprehensive recovery but takes the most time and storage.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase">Differential Backup</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    Copies only the data that has changed since the last full backup. Faster and smaller than a full backup.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase">Transaction Logs</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    Records all transactions, allowing point-in-time recovery (e.g., restore to just before a corruption event).
                  </p>
                </div>
              </div>

              <div className="mt-6 p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={16} /> Recovery Point Objective (RPO) &amp; Recovery Time Objective (RTO)
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                  <strong>RPO:</strong> Maximum acceptable amount of data loss (measured in time). <strong>RTO:</strong> Maximum acceptable downtime. These drive backup frequency and recovery strategies.
                </p>
              </div>
            </div>

            {/* ─── 4. Quiz ────────────────────────────────────────────────── */}
            <div ref={setSectionRef('quiz')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Knowledge Check
              </h2>
              <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
                <MultiQuestionQuiz
                  id="db-lo6-quiz"
                  points={100}
                  questions={[
                    { question: "Verifying user identity is called...", options: ["Authentication", "Authorization", "Encryption", "Auditing"], correctAnswer: "Authentication" },
                    { question: "Determining user permissions is called...", options: ["Authorization", "Authentication", "Validation", "Verification"], correctAnswer: "Authorization" },
                    { question: "Which SQL command grants permissions?", options: ["GRANT", "ALLOW", "PERMIT", "GIVE"], correctAnswer: "GRANT" },
                    { question: "SQL Injection exploits vulnerabilities in...", options: ["Input validation", "Hardware", "Network speed", "Power supply"], correctAnswer: "Input validation" },
                    { question: "What is the primary defense against SQL Injection?", options: ["Prepared Statements", "Firewalls", "Antivirus", "Strong Passwords"], correctAnswer: "Prepared Statements" }
                  ]}
                />
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Security Tip
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
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{SECTION_TABS.length}</span>
                </li>
                <li className="flex justify-between">
                  <span>Security Mechanisms</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
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
                Security is not a one-time task – it's an ongoing process. Regularly review permissions, update software, test backups, and educate users. The weakest link is often human error.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Scroll-to-Top ────────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways ────────────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">1.</span>
              <span>
                <strong className="text-white">CIA Triad:</strong> Security protects Confidentiality, Integrity, and Availability – the three core goals.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">2.</span>
              <span>
                <strong className="text-white">Four Mechanisms:</strong> Authentication (who you are), Authorisation (what you can do), Encryption (scramble data), Auditing (track activity).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">3.</span>
              <span>
                <strong className="text-white">SQL Injection:</strong> Prevent with prepared statements, stored procedures, and input validation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">4.</span>
              <span>
                <strong className="text-white">Backup Strategy:</strong> Combine full, differential, and transaction log backups to meet RPO/RTO goals.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">5.</span>
              <span>
                <strong className="text-white">Ongoing Process:</strong> Regularly review permissions, test backups, apply patches, and train users.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer className="mx-auto px-[5px] sm:px-6 md:px-8 pb-8 text-center opacity-30">
        <div className="inline-flex items-center gap-2">
          <BookOpen size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">
            Sidemann Academic Registry • NC IT Database Registry 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome6;
