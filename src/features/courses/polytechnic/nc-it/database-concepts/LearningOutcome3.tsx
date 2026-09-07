import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
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
  Database as DatabaseIcon,
  Code,
  Clock,
  ChevronUp,
  RefreshCw,
  Trophy,
  Target,
  X,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'config', label: 'Server Config' },
  { id: 'install', label: 'DBMS Install' },
  { id: 'testing', label: 'Testing' },
  { id: 'test-types', label: 'Test Types' },
  { id: 'test-data', label: 'Test Data' },
  { id: 'conversion', label: 'Conversion' },
  { id: 'training', label: 'Training' },
];

// ──────────────────────────────────────────────────────────────────────────────
// LOCAL LESSON IMAGE HELPER
// ──────────────────────────────────────────────────────────────────────────────
const dbImage = (seed: string) =>
  `/images/database-concepts/db-${seed}.png`;

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome3: React.FC = () => {
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
        text: 'The first relational database management system (RDBMS) was developed by IBM in the 1970s. It was called System R and used the SEQUEL language (now known as SQL).',
      },
      {
        title: 'Pro Tip',
        text: 'Always back up your database configuration files before making changes. A simple misconfiguration can take down an entire production database.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the system conversion methods: "Direct, Parallel, Phased, Pilot" – think of them as "DPPP".',
      },
      {
        title: 'Common Mistake',
        text: 'Many organizations skip user acceptance testing (UAT) due to time constraints. This often leads to expensive fixes after deployment.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first relational database management system (RDBMS) was developed by IBM in the 1970s. It was called System R and used the SEQUEL language (now known as SQL).',
      },
      {
        title: 'Pro Tip',
        text: 'Always back up your database configuration files before making changes. A simple misconfiguration can take down an entire production database.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the system conversion methods: "Direct, Parallel, Phased, Pilot" – think of them as "DPPP".',
      },
      {
        title: 'Common Mistake',
        text: 'Many organizations skip user acceptance testing (UAT) due to time constraints. This often leads to expensive fixes after deployment.',
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <DatabaseIcon size={14} className="inline mr-1" /> DATABASE IMPLEMENTATION
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 3{' '}
            <span className="text-purple-300 font-bold italic">
              Server Config &amp; Implementation
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master database server configuration, DBMS installation, testing
            methodologies, test data selection, system conversion methods, and
            user training justification.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">📚 8 sections</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Server size={14} className="inline mr-1" /> Server Config
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <GraduationCap size={14} className="inline mr-1" /> Training
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
                placeholder="Search for a concept, method, or test type..."
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
                  Configuring a database server, installing a DBMS, testing the
                  system, selecting test data, choosing conversion methods, and
                  training users are essential steps in successful database
                  implementation.
                </p>
              </div>
            </div>

            {/* ─── 1. Configuring a Database Server ────────────────────── */}
            <div ref={setSectionRef('config')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Configuring a Database Server
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Configuring a database server involves setting up hardware,
                software, and network settings to ensure optimal performance
                and security for the database.
              </p>

              <img
                src={dbImage('server-config')}
                alt="Database server configuration"
                className="w-full h-48 object-contain rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">Hardware</h3>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 font-medium space-y-1.5 list-disc pl-4 mt-2">
                    <li><strong>Processor:</strong> Powerful CPU for database demands</li>
                    <li><strong>Memory:</strong> Ample RAM for data caching</li>
                    <li><strong>Storage:</strong> Fast I/O for database files</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">Software</h3>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 font-medium space-y-1.5 list-disc pl-4 mt-2">
                    <li><strong>DBMS:</strong> Database management system</li>
                    <li><strong>OS:</strong> Operating system services</li>
                    <li><strong>Network:</strong> Connectivity software</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">Network</h3>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 font-medium space-y-1.5 list-disc pl-4 mt-2">
                    <li><strong>Static IP:</strong> Fixed address for server</li>
                    <li><strong>Firewall:</strong> Configured for authorized access</li>
                    <li><strong>Security:</strong> Access control rules</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  Key Considerations
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
                  {[
                    { t: "Scalability", icon: Layers },
                    { t: "Performance", icon: Zap },
                    { t: "Security", icon: ShieldCheck },
                    { t: "Availability", icon: CheckCircle },
                    { t: "Cost", icon: Activity },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <item.icon size={24} className="mx-auto text-indigo-500" />
                      <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mt-1">
                        {item.t}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ─── 2. Installing a DBMS ────────────────────────────────── */}
            <div ref={setSectionRef('install')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Installing a Database Management System (DBMS)
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Installing a DBMS involves evaluating software, determining
                requirements, downloading and installing the software,
                configuring the DBMS, and testing the installation.
              </p>

              <img
                src={dbImage('dbms-install')}
                alt="DBMS installation process"
                className="w-full h-48 object-contain rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-4"
              />

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6 mb-4">
                Evaluation Criteria
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  { t: "Features", d: "Required data types, queries, security" },
                  { t: "Scalability", d: "Handle growing users and data" },
                  { t: "Performance", d: "Process queries quickly" },
                  { t: "Security", d: "Authentication, encryption" },
                  { t: "Cost", d: "Cost-effective within budget" },
                ].map((f, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 text-center">
                    <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase">
                      {f.t}
                    </h4>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium leading-tight mt-1">
                      {f.d}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase">Requirements</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    Determine requirements based on database size, users, and
                    expected workloads. Requirements vary by specific DBMS.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase">Installation Steps</h4>
                  <ol className="text-xs text-slate-600 dark:text-slate-400 font-medium space-y-1 list-decimal pl-4 mt-2">
                    <li>Download from vendor website</li>
                    <li>Run installation program</li>
                    <li>Follow on-screen instructions</li>
                    <li>Configure the DBMS</li>
                    <li>Test the installation</li>
                  </ol>
                </div>
              </div>

              <div className="mt-6 p-5 bg-yellow-50 dark:bg-yellow-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest flex items-center gap-2">
                  <Info size={16} /> Additional Considerations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div>
                    <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase">Backups</p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Establish a backup schedule to protect data.</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase">Monitoring</p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Monitor CPU, memory, and disk I/O.</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase">Security</p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Keep DBMS updated with security patches.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── 3. Testing a DBMS ────────────────────────────────────── */}
            <div ref={setSectionRef('testing')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Testing a Database Management System (DBMS)
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Testing a DBMS ensures quality, reliability, and security by
                evaluating its ability to meet requirements and identify defects.
              </p>

              <img
                src={dbImage('dbms-testing')}
                alt="Database testing"
                className="w-full h-48 object-contain rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-4"
              />

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6 mb-4">
                Importance of Testing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { t: "Data Integrity", d: "Ensure data is accurate, consistent, and error-free." },
                  { t: "Functional Requirements", d: "Verify the DBMS functions as intended." },
                  { t: "Performance & Scalability", d: "Evaluate under workloads and user concurrency." },
                  { t: "Security & Access Control", d: "Assess authentication, encryption, and policies." },
                  { t: "Integration", d: "Verify integration with other systems." },
                  { t: "Usability", d: "Evaluate quality of user manuals and training." },
                ].map((imp, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                      {imp.t}
                    </h4>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium leading-tight mt-1">
                      {imp.d}
                    </p>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6 mb-4">
                Levels of Testing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase">Unit Testing</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    Tests individual modules or components. Performed by
                    developers to verify correctness and identify defects early.
                  </p>
                  <ul className="text-[10px] text-slate-600 dark:text-slate-400 font-medium space-y-1 list-disc pl-4 mt-2">
                    <li>Verify correctness of modules</li>
                    <li>Ensure design specifications</li>
                    <li>Improve code quality</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase">Integration Testing</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    Verifies interaction between modules. Ensures seamless
                    communication and overall system functionality.
                  </p>
                  <ul className="text-[10px] text-slate-600 dark:text-slate-400 font-medium space-y-1 list-disc pl-4 mt-2">
                    <li>Identify integration issues</li>
                    <li>Validate data flow</li>
                    <li>Detect compatibility problems</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase">System Testing</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    Tests the entire system as a whole. Performed by independent
                    testers before release.
                  </p>
                  <ul className="text-[10px] text-slate-600 dark:text-slate-400 font-medium space-y-1 list-disc pl-4 mt-2">
                    <li>Verify all requirements</li>
                    <li>Evaluate performance and scalability</li>
                    <li>Ensure user expectations</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase">UAT</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    User Acceptance Testing by intended users to ensure the
                    system meets their needs and expectations.
                  </p>
                  <ul className="text-[10px] text-slate-600 dark:text-slate-400 font-medium space-y-1 list-disc pl-4 mt-2">
                    <li>Validate real-world needs</li>
                    <li>Identify usability issues</li>
                    <li>Gain user feedback</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ─── 4. Types of Testing ──────────────────────────────────── */}
            <div ref={setSectionRef('test-types')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Types of Testing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase">Alpha Testing</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    Conducted by a limited group within the development team.
                    Focuses on identifying major bugs in a controlled environment.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase">Beta Testing</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    Conducted by a wider group of users outside the development
                    team. Gathers real user feedback on bugs and usability.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase">Stress Testing</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    Tests the system's ability to handle large amounts of data
                    or traffic. Identifies bottlenecks and performance issues.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase">Black Box</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    Tests from the user's perspective without knowledge of
                    internal structure. Uses equivalence partitioning and
                    boundary analysis.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase">Glass Box</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    Tests with knowledge of internal structure. Uses code
                    coverage analysis and path testing to verify internal logic.
                  </p>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="mt-6 overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212]">
                <table className="w-full text-left border-collapse min-w-[700px] text-xs">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Feature</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Alpha</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Beta</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Stress</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Black Box</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Glass Box</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Purpose</td>
                      <td className="p-3">Identify major bugs</td>
                      <td className="p-3">User feedback</td>
                      <td className="p-3">Identify bottlenecks</td>
                      <td className="p-3">User perspective</td>
                      <td className="p-3">Internal logic</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Testers</td>
                      <td className="p-3">Internal team</td>
                      <td className="p-3">External users</td>
                      <td className="p-3">Load testers</td>
                      <td className="p-3">No internal knowledge</td>
                      <td className="p-3">Has internal knowledge</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Environment</td>
                      <td className="p-3">Controlled</td>
                      <td className="p-3">Less controlled</td>
                      <td className="p-3">Controlled</td>
                      <td className="p-3">Uncontrolled</td>
                      <td className="p-3">Controlled</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ─── 5. Selecting Test Data ────────────────────────────────── */}
            <div ref={setSectionRef('test-data')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Selecting Test Data and Test Cases
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                    Test Data Selection
                  </h3>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 font-medium space-y-1.5 list-disc pl-4 mt-3">
                    <li>Identify data types and formats</li>
                    <li>Cover valid and invalid data</li>
                    <li>Consider boundary and extreme values</li>
                    <li>Use representative data</li>
                    <li>Account for data dependencies</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">
                    Test Case Selection
                  </h3>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 font-medium space-y-1.5 list-disc pl-4 mt-3">
                    <li>Requirements-based testing</li>
                    <li>Risk-based testing</li>
                    <li>User-centric testing</li>
                    <li>Negative testing</li>
                    <li>Performance testing</li>
                    <li>Security testing</li>
                    <li>Usability testing</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ─── 6. System Conversion Methods ─────────────────────────── */}
            <div ref={setSectionRef('conversion')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                System Conversion Methods
              </h2>

              <img
                src={dbImage('conversion')}
                alt="System conversion methods"
                className="w-full h-48 object-contain rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {[
                  {
                    t: "Parallel Conversion",
                    d: "Runs old and new systems simultaneously. Provides fallback if new system fails, allows comparison, and minimal disruption.",
                    adv: ["Fallback option", "Thorough comparison", "Minimal disruption"],
                    dis: ["More expensive", "More planning", "More difficult to manage"],
                  },
                  {
                    t: "Direct Conversion",
                    d: "Switches from old to new system in a single event. Quick implementation but risky if not fully tested or users are untrained.",
                    adv: ["Quick implementation", "Less planning", "Less expensive"],
                    dis: ["No fallback", "More disruptive", "High confidence required"],
                  },
                  {
                    t: "Phased Conversion",
                    d: "Converts different parts of the organization at different times. Allows gradual transition and testing in a smaller environment.",
                    adv: ["Gradual transition", "Less disruptive", "Production testing"],
                    dis: ["More time-consuming", "More planning", "More expensive"],
                  },
                  {
                    t: "Pilot Conversion",
                    d: "Converts a small group of users first. Allows controlled implementation and user training before full rollout.",
                    adv: ["Controlled implementation", "Identify problems early", "User training opportunity"],
                    dis: ["More time-consuming", "More planning", "More expensive"],
                  },
                ].map((conv, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                  >
                    <div className="bg-indigo-600 text-white p-2 text-center rounded-t-lg -mt-5 -mx-5 mb-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">
                        {conv.t}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      {conv.d}
                    </p>
                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div>
                        <span className="text-[9px] font-bold text-green-600 dark:text-green-400 uppercase">✓ Advantages</span>
                        <ul className="text-[10px] text-slate-600 dark:text-slate-400 font-medium space-y-0.5 list-disc pl-3">
                          {conv.adv.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-orange-500 uppercase">✗ Disadvantages</span>
                        <ul className="text-[10px] text-slate-600 dark:text-slate-400 font-medium space-y-0.5 list-disc pl-3">
                          {conv.dis.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── 7. User Training ───────────────────────────────────────── */}
            <div ref={setSectionRef('training')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Justification for User Training
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                User training is an essential investment that organizations
                should make to maximize the benefits of their IT systems.
              </p>

              <img
                src={dbImage('training')}
                alt="User training"
                className="w-full h-48 object-contain rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { t: "Increased Productivity", d: "Properly trained users become more efficient and productive, saving time and money." },
                  { t: "Improved Decision-Making", d: "Training helps users understand data better, leading to improved decisions." },
                  { t: "Reduced Costs", d: "Fewer errors and rework reduce costs and avoid downtime and data loss." },
                  { t: "Increased Satisfaction", d: "Trained users are more satisfied, leading to higher morale and positive work environment." },
                ].map((benefit, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-tight">
                      {benefit.t}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                      {benefit.d}
                    </p>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6 mb-4">
                Training Methods
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { t: "ILT", icon: GraduationCap, d: "Instructor-led, hands-on" },
                  { t: "CBT", icon: Laptop, d: "Computer-based, self-paced" },
                  { t: "WBT", icon: Globe, d: "Web-based, anywhere" },
                  { t: "OJT", icon: Briefcase, d: "On-the-job, by doing" },
                  { t: "Blended", icon: Repeat, d: "Combination of methods" },
                ].map((method, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 text-center hover:shadow-md transition-all"
                  >
                    <method.icon size={28} className="mx-auto text-orange-500 mb-2" />
                    <h5 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                      {method.t}
                    </h5>
                    <p className="text-[9px] text-slate-600 dark:text-slate-400 font-medium leading-tight mt-1">
                      {method.d}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                  <strong>Role of User Training:</strong> User training plays a
                  critical role in the success of any IT system implementation.
                  It equips users with the knowledge and skills to use the
                  system effectively. Training should be an ongoing process,
                  not a one-time event.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Database Tip
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
                  <span>Conversion Methods</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Testing Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Successful database implementation requires careful server
                configuration, thorough testing, appropriate conversion methods,
                and comprehensive user training. Skip any step and the project
                risks failure.
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
                <strong className="text-white">Server Configuration:</strong> Set
                up hardware, software, and network settings for optimal
                performance and security.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">2.</span>
              <span>
                <strong className="text-white">DBMS Installation:</strong> Evaluate
                software, determine requirements, install, configure, and test.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">3.</span>
              <span>
                <strong className="text-white">Testing:</strong> Unit, Integration,
                System, UAT – each level ensures quality and reliability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">4.</span>
              <span>
                <strong className="text-white">Conversion Methods:</strong> Parallel,
                Direct, Phased, Pilot – choose based on risk tolerance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">5.</span>
              <span>
                <strong className="text-white">User Training:</strong> Essential
                for productivity, decision-making, cost reduction, and user
                satisfaction. Use ILT, CBT, WBT, OJT, or blended methods.
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

export default LearningOutcome3;
