import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Cpu,
  Layers,
  HardDrive,
  CheckCircle,
  Info,
  Zap,
  ShieldCheck,
  ArrowRight,
  Database,
  BookOpen,
  FileText,
  Monitor,
  Disc,
  Tablet,
  ChevronRight,
  Terminal,
  Search,
  X,
  ChevronUp,
  RefreshCw,
  Trophy,
  Target,
  GraduationCap,
  Network,
  Server,
  Wifi,
  Router,
  Globe,
  ListChecks,
  Activity,
  ClipboardList,
  PenTool,
  Settings,
  Map,
  Flag,
  Shield,
  Binary,
  Layout,
  Lock,
  Eye,
  AlertTriangle,
  User,
  Brain,
  Plus,
  UserCheck,
  Key,
  Fingerprint,
  Radio,
  Cloud,
  FileCheck,
  Users,
  BarChart3,
  Code,
  Clock,
  Save,
  Edit3,
  Trash2,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// NAVIGATION TABS (unchanged)
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Overview' },
  { id: 'organizing', label: 'Organizing Data' },
  { id: 'dml', label: 'Modifying Data' },
  { id: 'operations', label: 'Database Ops' },
  { id: 'security-need', label: 'Security Need' },
  { id: 'threats', label: 'Threats' },
  { id: 'protecting', label: 'Protecting' },
  { id: 'measures', label: 'Security Measures' },
  { id: 'logging', label: 'Logging & Reporting' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome4: React.FC = () => {
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
      { title: 'Database Fact', text: 'The first commercial relational database, Oracle, was released in 1979.' },
      { title: 'DML Tip', text: 'INSERT, UPDATE, and DELETE are the core DML commands – always use transactions to ensure data integrity.' },
      { title: 'Security', text: 'SQL injection is one of the most common database attacks – always use parameterised queries.' },
      { title: 'Performance', text: 'Regularly monitoring query execution time and resource utilisation helps prevent performance bottlenecks.' },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      { title: 'Database Fact', text: 'The first commercial relational database, Oracle, was released in 1979.' },
      { title: 'DML Tip', text: 'INSERT, UPDATE, and DELETE are the core DML commands – always use transactions to ensure data integrity.' },
      { title: 'Security', text: 'SQL injection is one of the most common database attacks – always use parameterised queries.' },
      { title: 'Performance', text: 'Regularly monitoring query execution time and resource utilisation helps prevent performance bottlenecks.' },
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
                ? 'bg-orange-600 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30'
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

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Database size={14} className="inline mr-1" /> DATABASE CONCEPTS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 4{' '}
            <span className="text-amber-300 font-bold italic">
              Data Ops &amp; Security
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master data preparation, DML operations, database security, threat
            mitigation, and performance monitoring. Learn to manage and protect
            data effectively.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">📚 {SECTION_TABS.length} sections</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">⚙️ DML &amp; security</span>
            <span className="bg-white/10 px-3 py-1 rounded-full"><Zap size={14} className="inline mr-1" /> Practical</span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-orange-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a database concept..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-orange-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-orange-200" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Sticky Navigation ────────────────────────────────────────────── */}
      <NavTabs />

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* List of sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* Introduction */}
            <div
              ref={(el) => { sectionRefs.current['intro'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="p-4 sm:p-5">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  This outcome covers the full lifecycle of database data:
                  preparation, manipulation (INSERT, UPDATE, DELETE), security,
                  threat mitigation, and performance monitoring. All content is
                  presented in clear, structured notes.
                </p>
</div>
            </div>

            {/* 1. Organizing and Preparing Data */}
            <div
              ref={(el) => { sectionRefs.current['organizing'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Organizing &amp; Preparing Data
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Preparing data for inclusion in a database involves several crucial steps to ensure data integrity, consistency, and usability.
              </p>

              {/* Use numbered lists instead of nested containers */}
              <ol className="space-y-6 list-decimal list-inside text-sm text-slate-700 dark:text-slate-300">
                <li className="font-bold text-slate-900 dark:text-white">
                  Methods of Data Collection
                  <ul className="list-disc list-inside ml-6 font-normal text-slate-600 dark:text-slate-400 mt-1 space-y-1">
                    <li><strong>Manual Data Entry</strong> – entering data from existing documents or records.</li>
                    <li><strong>Electronic Data Capture</strong> – using electronic forms or scanners to capture data directly.</li>
                    <li><strong>Data Import</strong> – importing from existing files or external databases.</li>
                    <li><strong>Data Integration</strong> – combining data from multiple sources into a single database.</li>
                  </ul>
                </li>
                <li className="font-bold text-slate-900 dark:text-white">
                  Prepare Data for Input
                  <ul className="list-disc list-inside ml-6 font-normal text-slate-600 dark:text-slate-400 mt-1 space-y-1">
                    <li><strong>Data Cleaning</strong> – identifying and correcting errors, inconsistencies, and missing values.</li>
                    <li><strong>Data Standardization</strong> – standardising formats, units, and representations.</li>
                    <li><strong>Data Transformation</strong> – transforming data to fit the database structure.</li>
                    <li><strong>Data Deduplication</strong> – removing duplicate records to ensure integrity.</li>
                  </ul>
                </li>
                <li className="font-bold text-slate-900 dark:text-white">
                  Verification &amp; Validation
                  <ul className="list-disc list-inside ml-6 font-normal text-slate-600 dark:text-slate-400 mt-1 space-y-1">
                    <li><strong>Data Verification</strong> – checking against source documents for accuracy.</li>
                    <li><strong>Data Validation</strong> – applying validation rules and constraints.</li>
                    <li><strong>Data Profiling</strong> – analysing for patterns, distributions, and outliers.</li>
                    <li><strong>Data Quality Checks</strong> – ongoing checks to maintain integrity over time.</li>
                  </ul>
                </li>
                <li className="font-bold text-slate-900 dark:text-white">
                  Classify Data by User Needs
                  <ul className="list-disc list-inside ml-6 font-normal text-slate-600 dark:text-slate-400 mt-1 space-y-1">
                    <li><strong>Data Modeling</strong> – creating conceptual model (entities, relationships, attributes).</li>
                    <li><strong>Data Normalization</strong> – reducing redundancy and improving integrity.</li>
                    <li><strong>Data Indexing</strong> – creating indexes for query performance.</li>
                    <li><strong>Data Security</strong> – implementing security measures for sensitive data.</li>
                  </ul>
                </li>
              </ol>
            </div>

            {/* 2. Modifying or Retrieving Data (DML) */}
            <div
              ref={(el) => { sectionRefs.current['dml'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Modifying or Retrieving Data (DML)
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Data Manipulation Language (DML) commands are used to modify or retrieve data stored in a database. The three primary DML commands are:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
                  <Save className="text-indigo-500 mx-auto mb-2" size={28} />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">INSERT</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Inserts new records into a table.</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
                  <Trash2 className="text-red-500 mx-auto mb-2" size={28} />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">DELETE</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Deletes existing records from a table.</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
                  <Edit3 className="text-blue-500 mx-auto mb-2" size={28} />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">UPDATE</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Modifies values of existing records.</p>
                </div>
              </div>

              <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl mt-4">
                <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">Examples</h4>
                <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                  <li><strong>INSERT:</strong> Add a new customer record with name, address, contact.</li>
                  <li><strong>DELETE:</strong> Remove outdated or inactive customer records.</li>
                  <li><strong>UPDATE:</strong> Change customer address or phone number.</li>
                </ul>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-3">DML commands are essential for maintaining accurate, up‑to‑date data.</p>
              </div>
            </div>

            {/* 3. Implement Database Operations */}
            <div
              ref={(el) => { sectionRefs.current['operations'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Implement Database Operations
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">Procedures for Reading Data</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Data Retrieval:</strong> SELECT statements with tables, columns, and filters.</li>
                    <li><strong>Querying:</strong> Construct SELECT statements with operators, functions, joins.</li>
                    <li><strong>Data Aggregation:</strong> SUM, AVG, MIN, MAX, COUNT for summaries.</li>
                    <li><strong>Data Reporting:</strong> Charts, graphs, dashboards for presentation.</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">Procedures for Writing Data</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Data Insertion:</strong> INSERT statements.</li>
                    <li><strong>Data Updating:</strong> UPDATE statements.</li>
                    <li><strong>Data Deletion:</strong> DELETE statements.</li>
                    <li><strong>Data Integrity:</strong> Validation, constraints, error handling.</li>
                    <li><strong>Transaction Management:</strong> Commit, rollback, isolation levels.</li>
                    <li><strong>Performance Optimization:</strong> Indexing, query optimisation, tuning.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. The Need for Database Security */}
            <div
              ref={(el) => { sectionRefs.current['security-need'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Need for Database Security
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Database security is essential for protecting sensitive information, ensuring availability, and maintaining business integrity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
                  <AlertTriangle className="text-red-500 mx-auto mb-2" size={24} />
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">Data Breaches</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Unauthorised access leads to financial loss, reputational damage, legal liability.</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
                  <AlertTriangle className="text-red-500 mx-auto mb-2" size={24} />
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">Data Corruption</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Malicious actors corrupt or destroy data, causing business disruption.</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
                  <AlertTriangle className="text-red-500 mx-auto mb-2" size={24} />
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">Service Outages</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Attacks disrupt critical systems, affecting operations and productivity.</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
                  <AlertTriangle className="text-red-500 mx-auto mb-2" size={24} />
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">Compliance Violations</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Failure to protect data leads to fines and penalties.</p>
                </div>
              </div>
            </div>

            {/* 5. Threats to Database Security */}
            <div
              ref={(el) => { sectionRefs.current['threats'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Threats to Database Security
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  'SQL Injection',
                  'Cross‑Site Scripting (XSS)',
                  'Denial‑of‑Service (DoS)',
                  'Man‑in‑the‑Middle (MITM)',
                  'Weak Passwords',
                  'Social Engineering',
                  'Malware Infections',
                  'Unintentional Errors',
                ].map((threat, i) => (
                  <div key={i} className="p-3 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-lg text-center text-sm font-bold text-slate-700 dark:text-slate-300 uppercase shadow-sm">
                    {threat}
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Protecting Database Security */}
            <div
              ref={(el) => { sectionRefs.current['protecting'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Protecting Database Security
              </h2>
              <ol className="space-y-3 list-decimal list-inside text-sm text-slate-700 dark:text-slate-300">
                <li>
                  <strong className="text-slate-900 dark:text-white">Data Classification &amp; Encryption</strong>
                  <span className="font-normal"> – Classify by sensitivity; encrypt at rest and in transit.</span>
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Access Control &amp; Authentication</strong>
                  <span className="font-normal"> – Strong controls, multi‑factor, review privileges regularly.</span>
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Vulnerability Scanning &amp; Patching</strong>
                  <span className="font-normal"> – Regular scans and prompt patching.</span>
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Database Activity Monitoring</strong>
                  <span className="font-normal"> – Monitor for suspicious behaviour and anomalies.</span>
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Data Loss Prevention (DLP)</strong>
                  <span className="font-normal"> – Prevent unauthorised transfers or exfiltration.</span>
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Security Awareness Training</strong>
                  <span className="font-normal"> – Educate employees on phishing and social engineering.</span>
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Incident Response Planning</strong>
                  <span className="font-normal"> – Robust plan to handle breaches and minimise impact.</span>
                </li>
              </ol>
            </div>

            {/* 7. Measures to Deal with Threats */}
            <div
              ref={(el) => { sectionRefs.current['measures'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Measures to Deal with Threats
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">Physical Security</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li>Access control – limit physical access.</li>
                    <li>Environmental controls – temperature, humidity, power.</li>
                    <li>Security surveillance – cameras and monitoring.</li>
                    <li>Backup and disaster recovery.</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">Logical Security</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li>User authentication and authorisation.</li>
                    <li>Data encryption.</li>
                    <li>Data integrity controls (checksums, signatures).</li>
                    <li>Vulnerability management and patching.</li>
                    <li>Activity monitoring and logging.</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">Behavioural Security</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li>Security awareness training.</li>
                    <li>Clear security policies and procedures.</li>
                    <li>Regular security audits.</li>
                    <li>Continuous monitoring and improvement.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 8. Logging and Reporting Performance Issues */}
            <div
              ref={(el) => { sectionRefs.current['logging'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Logging &amp; Reporting Performance Issues
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Monitoring and reporting performance issues are crucial for maintaining a healthy, responsive database system.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">Database Performance Monitoring</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Query Execution Time:</strong> Measure and optimise slow queries.</li>
                    <li><strong>Resource Utilisation:</strong> CPU, memory, disk I/O.</li>
                    <li><strong>Locks and Waits:</strong> Identify blocking and concurrency issues.</li>
                    <li><strong>Errors and Warnings:</strong> Monitor logs for problems.</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">Database Tuning</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Indexing:</strong> Create/maintain appropriate indexes.</li>
                    <li><strong>Query Optimisation:</strong> Rewrite for efficiency.</li>
                    <li><strong>Denormalisation:</strong> Reduce joins carefully.</li>
                    <li><strong>Parameter Optimisation:</strong> Buffer pool, cache, concurrency.</li>
                  </ul>
                </div>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl mt-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Tools for Logging &amp; Reporting</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {['Collect Metrics', 'Analyse Data', 'Visualise Data', 'Generate Reports'].map((tool, i) => (
                    <div key={i} className="p-3 bg-white dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700 text-center text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                      {tool}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-slate-900 dark:bg-slate-950 text-white rounded-xl shadow-xl mt-4">
                <h4 className="text-xs font-bold text-orange-300 uppercase tracking-widest">Benefits</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300 font-medium list-disc pl-5 mt-2">
                  <li>Proactive problem identification.</li>
                  <li>Root cause analysis.</li>
                  <li>Capacity planning.</li>
                  <li>Optimisation and efficiency improvements.</li>
                  <li>Cost savings.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">💡 Database Tip</h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-orange-500 dark:text-orange-400" />
                </button>
              </div>
              {randomTip && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{randomTip.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{randomTip.text}</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">📊 Quick Stats</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex justify-between"><span>Sections</span><span className="font-bold text-orange-600 dark:text-orange-400">{SECTION_TABS.length}</span></li>
                <li className="flex justify-between"><span>DML commands</span><span className="font-bold text-orange-600 dark:text-orange-400">3</span></li>
                <li className="flex justify-between"><span>Security measures</span><span className="font-bold text-orange-600 dark:text-orange-400">3</span></li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">📝 Remember</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Data preparation, DML operations, and security are the pillars of database management. Always validate input, use transactions for writes, and monitor performance to maintain a healthy system.
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
          className="w-12 h-12 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-orange-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span><strong className="text-white">Data Preparation:</strong> Clean, standardise, transform, and validate data before loading into the database.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span><strong className="text-white">DML Operations:</strong> INSERT, UPDATE, DELETE – always use transactions to maintain data integrity.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span><strong className="text-white">Security:</strong> Threats include SQL injection, XSS, DoS, and insider threats. Use a layered approach – physical, logical, and behavioural controls.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span><strong className="text-white">Performance Monitoring:</strong> Track query execution time, resource usage, and locks. Use indexing, query optimisation, and tuning to maintain performance.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span><strong className="text-white">Logging &amp; Reporting:</strong> Essential for proactive problem identification, root cause analysis, and capacity planning.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Footer Branding ────────────────────────────────────────────── */}
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

export default LearningOutcome4;