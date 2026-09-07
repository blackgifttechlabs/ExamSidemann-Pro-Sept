import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Database,
  Info,
  ShieldCheck,
  Zap,
  Layers,
  Globe,
  Briefcase,
  Users,
  ClipboardList,
  Scale,
  Lock,
  Terminal,
  BarChart3,
  Settings,
  Cpu,
  HardDrive,
  BookOpen,
  Eye,
  CheckCircle,
  Smartphone,
  Tablet,
  ChevronRight,
  ArrowRight,
  Shield,
  Award,
  Rocket,
  Brain,
  Server,
  FileCode,
  Database as DatabaseIcon,
  Search,
  X,
  ChevronUp,
  RefreshCw,
  Trophy,
  Target,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'database', label: 'Database' },
  { id: 'bis', label: 'BIS Overview' },
  { id: 'bis-features', label: 'BIS Features' },
  { id: 'bis-roles', label: 'BIS Roles' },
  { id: 'bis-types', label: 'BIS Types' },
  { id: 'bis-components', label: 'Components' },
  { id: 'ethics', label: 'Ethics & Law' },
  { id: 'ip', label: 'Intellectual Property' },
];



// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome1: React.FC = () => {
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
        text: 'The first database management system, IDS (Integrated Data Store), was developed in the 1960s by Charles Bachman at General Electric.',
      },
      {
        title: 'Pro Tip',
        text: 'When designing a database, always consider the data that will be needed in the future. A well-designed schema can save years of refactoring.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five BIS components as "HSPDP" – Hardware, Software, People, Data, Procedures.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organizations focus on the technology (hardware/software) and forget about the people and procedures. A BIS is only as good as the people using it.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first database management system, IDS (Integrated Data Store), was developed in the 1960s by Charles Bachman at General Electric.',
      },
      {
        title: 'Pro Tip',
        text: 'When designing a database, always consider the data that will be needed in the future. A well-designed schema can save years of refactoring.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five BIS components as "HSPDP" – Hardware, Software, People, Data, Procedures.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organizations focus on the technology (hardware/software) and forget about the people and procedures. A BIS is only as good as the people using it.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  // Safe ref setter
  const setSectionRef = (id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  };

  // Scroll to section when tab changes
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

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <DatabaseIcon size={14} className="inline mr-1" /> DATABASE CONCEPTS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 1{' '}
            <span className="text-emerald-300 font-bold italic">
              Database Fundamentals &amp; BIS
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master database fundamentals, Business Information Systems (BIS),
            their features, types, components, and the ethical and legal
            implications of information systems.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 9 sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Database size={14} className="inline mr-1" /> Database
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Ethics &amp; Law
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
                placeholder="Search for a concept, feature, or term..."
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
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* List of sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* Introduction */}
            <div
              ref={setSectionRef('intro')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Definition: What Are Databases &amp; BIS?
              </h2>

              <div className="flex items-center gap-3 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                  A database is a collection of interrelated data organized in a
                  way that allows users to access, manage, and update it.
                  Business Information Systems (BIS) leverage databases to
                  support business operations and decision-making.
                </p>
              </div>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                In simple terms: think of a database as a digital filing cabinet
                where information is stored in tables, rows, and columns. A BIS
                is the whole system that uses that data to run a business — from
                tracking sales to managing employees.
              </p>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight mt-6">
                A Short History — How Databases Evolved
              </h3>

              <img
                src="/images/database-concepts/database-history.png"
                alt="Historical database systems, early computers"
                className="w-full h-48 object-contain rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mt-2"
              />

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mt-3">
                Before digital databases, data was stored in paper files,
                ledgers, and punch cards. Finding information was slow and error‑prone.
                In the 1960s, the first database management systems (DBMS) were
                created — like IDS and IMS — which allowed data to be stored and
                retrieved electronically.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                The relational model, introduced by E.F. Codd in 1970, revolutionised
                databases by organising data into tables with relationships. This
                became the foundation of modern SQL databases (Oracle, MySQL,
                PostgreSQL). Today, databases power everything from e‑commerce
                websites to social media platforms.
              </p>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight mt-6">
                Why Are Databases &amp; BIS Important?
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Databases solve three core problems: (1) they provide a{' '}
                <strong className="text-slate-900 dark:text-white">centralised</strong>{' '}
                place to store data, eliminating duplication; (2) they enable{' '}
                <strong className="text-slate-900 dark:text-white">fast retrieval</strong>{' '}
                and complex queries; and (3) they ensure{' '}
                <strong className="text-slate-900 dark:text-white">data integrity</strong>{' '}
                and security. BIS then uses that data to drive business decisions,
                improve efficiency, and gain competitive advantage.
              </p>
            </div>

            {/* Database */}
            <div
              ref={setSectionRef('database')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Database
              </h2>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                A collection of interrelated data that is organized in a way
                that allows users to access, manage, and update it.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "It is a collection of data.",
                  "The data is organized in a structured way.",
                  "The data is stored electronically.",
                  "The data can be accessed and manipulated by a computer.",
                ].map((char, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
                  >
                    <CheckCircle size={18} className="text-green-500 shrink-0" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {char}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  <strong className="text-indigo-600 dark:text-indigo-400">Example:</strong>{' '}
                  A university student database stores student names, ID numbers,
                  courses, and grades in structured tables. The database allows
                  the registrar to quickly retrieve a student's transcript or
                  generate class lists.
                </p>
              </div>
            </div>

            {/* Business Information System (BIS) */}
            <div
              ref={setSectionRef('bis')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Business Information System (BIS)
              </h2>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                A computer-based system that collects, processes, stores, and
                disseminates information to support business operations and
                decision-making.
              </p>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mt-3">
                In simple words: a BIS is what a business uses to turn raw
                data (like a sale, a login, a delivery) into useful
                information a person can act on. A cashier scanning a barcode
                is putting data <em>into</em> the system; a manager checking
                which product sold the most this month is pulling information
                <em>out</em> of the system. The BIS is everything in between
                — the computers, the software, and the people who run it.
              </p>

              <img
                src="/images/database-concepts/bis-overview.png"
                alt="Business information system in use in an office"
                className="w-full h-48 object-contain rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm my-4"
              />

              <div className="mt-4 p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">
                  Key Components of a BIS
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-3">
                  {[
                    { label: 'Hardware', icon: Cpu },
                    { label: 'Software', icon: Terminal },
                    { label: 'Data', icon: HardDrive },
                    { label: 'People', icon: Users },
                    { label: 'Procedures', icon: ClipboardList },
                  ].map((comp, i) => (
                    <div key={i} className="p-3 bg-slate-50 dark:bg-black/20 rounded-lg text-center">
                      <comp.icon size={20} className="mx-auto text-indigo-500" />
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mt-1">
                        {comp.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BIS Features */}
            <div
              ref={setSectionRef('bis-features')}
              className="scroll-mt-24 space-y-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Features of a BIS
              </h2>

              {/* Integration */}
              <div className="p-6 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                <h4 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight underline underline-offset-4">
                  Integration
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                  BIS are typically integrated with other business systems such
                  as accounting, human resources, and CRM systems. This
                  integration allows businesses to streamline operations and
                  improve efficiency.
                </p>
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
                    Example
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium italic">
                    When a customer places an order online, the information is
                    automatically integrated with the ERP system, updating
                    inventory, generating sales orders, and sending order
                    confirmations.
                  </p>
                </div>
              </div>

              {/* Automation */}
              <div className="p-6 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                <h4 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight underline underline-offset-4">
                  Automation
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                  BIS can automate many repetitive tasks such as data entry and
                  report generation, freeing employees for more strategic,
                  value-added tasks.
                </p>
                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-1">
                    Example
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium italic">
                    A BIS automatically generates daily sales reports showing
                    sales numbers, revenue, and best-selling products for the
                    sales manager to track performance.
                  </p>
                </div>
              </div>

              {/* Scalability */}
              <div className="p-6 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                <h4 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight underline underline-offset-4">
                  Scalability
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                  BIS are designed to be scalable, easily adapting to the needs
                  of growing businesses by adding more users, data, or
                  functionality without replacing the entire system.
                </p>
              </div>

              {/* Security */}
              <div className="p-6 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                <h4 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight underline underline-offset-4">
                  Security
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                  BIS have robust security features to protect sensitive
                  business data, especially in regulated industries like
                  healthcare and finance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  <div className="p-3 bg-slate-50 dark:bg-black/20 rounded">
                    <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase">
                      User Authentication
                    </span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                      Users must authenticate before accessing the system.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-black/20 rounded">
                    <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase">
                      Data Encryption
                    </span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                      Sensitive data is encrypted at rest and in transit.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-black/20 rounded">
                    <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase">
                      Audit Logging
                    </span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                      All system activity is logged for tracking and compliance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Accessibility */}
              <div className="p-6 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                <h4 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight underline underline-offset-4">
                  Accessibility
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                  BIS are accessible from various devices including computers,
                  tablets, and smartphones, allowing employees to access
                  information anytime, anywhere.
                </p>
                <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium italic">
                    A salesperson can access customer data on their tablet during
                    a client meeting, while a manager reviews financial reports
                    on their smartphone while on the go.
                  </p>
                </div>
              </div>
            </div>

            {/* BIS Roles */}
            <div
              ref={setSectionRef('bis-roles')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Roles of BIS in Business and Society
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                    In Business
                  </h3>
                  <ul className="space-y-3 mt-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                    <li className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                      <span><strong>Operations:</strong> Track inventory, manage production, process orders.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                      <span><strong>Accounting &amp; Finance:</strong> Track transactions, generate reports, manage payroll.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                      <span><strong>Human Resources:</strong> Manage employee data, recruit, track performance.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                      <span><strong>Sales &amp; Marketing:</strong> Track customer data, manage leads, execute campaigns.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                      <span><strong>Customer Service:</strong> Track interactions, resolve issues, provide support.</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">
                    In Society
                  </h3>
                  <ul className="space-y-3 mt-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                    <li className="flex items-start gap-3">
                      <Globe size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                      <span><strong>Education:</strong> Deliver online content, manage student records, track performance.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Globe size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                      <span><strong>Healthcare:</strong> Manage patient records, schedule appointments, process claims.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Globe size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                      <span><strong>Government:</strong> Track tax revenue, deliver services, manage infrastructure.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Globe size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                      <span><strong>Finance:</strong> Process transactions, manage risk, provide financial services.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Globe size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                      <span><strong>Media &amp; Entertainment:</strong> Deliver content, manage subscriptions, track engagement.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  Specific Examples
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm text-slate-700 dark:text-slate-300 font-medium italic">
                  <p>A retail company uses a BIS to track inventory, manage sales orders, and generate financial reports.</p>
                  <p>A manufacturing company uses a BIS to track production schedules, manage quality control, and track inventory.</p>
                  <p>A healthcare provider uses a BIS to manage patient records, schedule appointments, and bill patients.</p>
                  <p>A financial services company uses a BIS to process transactions, manage risk, and provide financial services.</p>
                </div>
              </div>
            </div>

            {/* Types of BIS */}
            <div
              ref={setSectionRef('bis-types')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Types of Business Information Systems
              </h2>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                BIS can be categorised into several types based on their purpose
                and the level of management they support.
              </p>

              {/* TPS (special card with image) */}
              <div className="p-6 bg-white dark:bg-[#121212] rounded-xl shadow-sm mb-6">
                <img
                  src="/images/database-concepts/bis-type-tps.png"
                  alt="Transaction Processing System"
                  className="w-full h-40 object-contain rounded-lg border border-slate-200 dark:border-slate-700 mb-4"
                />
                <h4 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                  Transaction Processing Systems (TPS)
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                  Used to collect, process, store, and retrieve data about
                  routine business transactions in industries like retail,
                  manufacturing, healthcare, and finance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Examples</span>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-4 mt-1">
                      <li>AIS – Accounting Information Systems</li>
                      <li>HRIS – Human Resource Information Systems</li>
                      <li>MPS – Manufacturing &amp; Production Systems</li>
                      <li>SMS – Sales &amp; Marketing Systems</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                      <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase">Advantages</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Improved efficiency, reduced costs, improved accuracy, better decision-making.</p>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                      <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase">Disadvantages</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Implementation costs, security risks, integration challenges.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other BIS Types (cards with images) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    t: "Office Automation Systems (OAS)",
                    d: "Automates office tasks like word processing, data entry, and communication.",
                    color: "border-purple-500",
                    seed: "oas",
                  },
                  {
                    t: "Decision Support Systems (DSS)",
                    d: "Supports decision-making on complex problems like pricing and marketing.",
                    color: "border-amber-500",
                    seed: "dss",
                  },
                  {
                    t: "Management Information Systems (MIS)",
                    d: "Provides managers with performance information from TPS data.",
                    color: "border-blue-500",
                    seed: "mis",
                  },
                  {
                    t: "Executive Information Systems (EIS)",
                    d: "Provides executives with high-level overview dashboards and reports.",
                    color: "border-green-500",
                    seed: "eis",
                  },
                  {
                    t: "Expert Systems (ES)",
                    d: "Uses AI to solve complex problems in healthcare, finance, and other industries.",
                    color: "border-red-500",
                    seed: "es",
                  },
                  {
                    t: "Enterprise Resource Planning (ERP)",
                    d: "Integrates all core business processes using a single unified database.",
                    color: "border-indigo-500",
                    seed: "erp",
                  },
                ].map((sys, i) => (
                  <div
                    key={i}
                    className={`p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all`}
                  >
                    <img
                      src={`/images/database-concepts/bis-type-${sys.seed}.png`}
                      alt={sys.t}
                      className="w-full h-32 object-contain rounded-lg border border-slate-100 dark:border-slate-800 mb-3"
                    />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight leading-tight">
                      {sys.t}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                      {sys.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Components of a BIS */}
            <div
              ref={setSectionRef('bis-components')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Components of a BIS
              </h2>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Business Information Systems are composed of five major
                components, each playing a critical role.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  {
                    t: "1. Hardware",
                    icon: Cpu,
                    d: "Physical components: computers, servers, storage devices.",
                    color: "border-blue-500",
                    seed: "hardware",
                  },
                  {
                    t: "2. Software",
                    icon: Terminal,
                    d: "Programs that run on hardware: DBMS, ERP, CRM systems.",
                    color: "border-purple-500",
                    seed: "software",
                  },
                  {
                    t: "3. Data",
                    icon: HardDrive,
                    d: "Information collected, processed, and stored.",
                    color: "border-orange-500",
                    seed: "data",
                  },
                  {
                    t: "4. People/Users",
                    icon: Users,
                    d: "Internal employees and external customers who interact with the system.",
                    color: "border-green-500",
                    seed: "people",
                  },
                  {
                    t: "5. Procedures",
                    icon: ClipboardList,
                    d: "Instructions for using the system: user manuals and training materials.",
                    color: "border-indigo-500",
                    seed: "procedures",
                  },
                ].map((comp, i) => (
                  <div
                    key={i}
                    className={`p-4 bg-white dark:bg-[#121212] rounded-xl shadow-sm text-center hover:shadow-md transition-all`}
                  >
                    <img
                      src={`/images/database-concepts/bis-component-${comp.seed}.png`}
                      alt={comp.t}
                      className="w-full h-24 object-contain rounded-lg border border-slate-100 dark:border-slate-800 mb-2"
                    />
                    <comp.icon size={28} className="mx-auto text-slate-700 dark:text-slate-300 mb-2" />
                    <h5 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                      {comp.t}
                    </h5>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-1">
                      {comp.d}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  Example: CRM System
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium italic mt-1">
                  A Customer Relationship Management (CRM) system includes:
                  hardware (servers), software (the app), data (customer
                  history), people (sales reps), and procedures (manuals for
                  adding leads).
                </p>
              </div>
            </div>

            {/* Ethical and Legal Implications */}
            <div
              ref={setSectionRef('ethics')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Ethical and Legal Implications of Information Systems
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                    Information Systems Ethics
                  </h3>
                  <ul className="space-y-3 mt-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                    <li className="p-3 bg-slate-50 dark:bg-black/20 rounded-lg">
                      <strong className="text-blue-600 dark:text-blue-400">Privacy:</strong> Concerns about collecting and storing personal data.
                    </li>
                    <li className="p-3 bg-slate-50 dark:bg-black/20 rounded-lg">
                      <strong className="text-blue-600 dark:text-blue-400">Security:</strong> Vulnerability to hacking and data breaches.
                    </li>
                    <li className="p-3 bg-slate-50 dark:bg-black/20 rounded-lg">
                      <strong className="text-blue-600 dark:text-blue-400">Accuracy:</strong> Risk of spreading misinformation and disinformation.
                    </li>
                    <li className="p-3 bg-slate-50 dark:bg-black/20 rounded-lg">
                      <strong className="text-blue-600 dark:text-blue-400">Bias:</strong> Systems can be biased, leading to discrimination.
                    </li>
                    <li className="p-3 bg-slate-50 dark:bg-black/20 rounded-lg">
                      <strong className="text-blue-600 dark:text-blue-400">Autonomy:</strong> Concerns about autonomous decision-making.
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">
                    Legal Implications
                  </h3>
                  <div className="space-y-3 mt-4">
                    <div className="p-4 bg-slate-50 dark:bg-black/20 rounded">
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">GDPR</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Protects personal data of individuals in the EU.</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-black/20 rounded">
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">CCPA</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Protects personal data of California residents.</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-black/20 rounded">
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">HIPAA</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Protects privacy of patients' health information.</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-black/20 rounded">
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">GLBA</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Protects privacy of consumers' financial information.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div
              ref={setSectionRef('ip')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Intellectual Property Protections
              </h2>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                <strong className="text-slate-900 dark:text-white">Intellectual property (IP)</strong>{' '}
                simply means an idea, invention, brand, or piece of creative
                work that belongs to the person or company that made it — the
                same way a house belongs to whoever built or bought it. Because
                information systems create and store so much original work
                (software code, logos, databases, designs), it's important to
                know the different legal ways that work can be protected from
                being copied or stolen.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    t: "Trademark",
                    d: "A word, phrase, symbol, or design identifying source of goods. e.g., 'Coca-Cola' protects against brand confusion.",
                    color: "border-blue-500",
                    seed: "trademark",
                  },
                  {
                    t: "Copyright",
                    d: "Protection for authors of original works (literary, artistic). Lasts life plus 70 years.",
                    color: "border-orange-500",
                    seed: "copyright",
                  },
                  {
                    t: "Patent",
                    d: "Exclusive rights to an invention for 20 years. Must be new, useful, and non-obvious.",
                    color: "border-green-500",
                    seed: "patent",
                  },
                  {
                    t: "Trade Secrets",
                    d: "Any information giving a business a competitive advantage, kept confidential.",
                    color: "border-purple-500",
                    seed: "tradesecret",
                  },
                  {
                    t: "Industrial Design Rights",
                    d: "Protects ornamental or aesthetic design of a product for 15 years.",
                    color: "border-red-500",
                    seed: "industrialdesign",
                  },
                ].map((ip, i) => (
                  <div
                    key={i}
                    className={`p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all`}
                  >
                    <img
                      src={`/images/database-concepts/ip-${ip.seed}.png`}
                      alt={ip.t}
                      className="w-full h-32 object-contain rounded-lg border border-slate-100 dark:border-slate-800 mb-3"
                    />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                      {ip.t}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                      {ip.d}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl">
                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  <strong className="text-indigo-700 dark:text-indigo-400">Final Summary:</strong> Understanding the fundamentals of databases, BIS, their components, roles, and legal/ethical implications is essential for anyone working with information systems. These concepts form the foundation for all further database study and practice.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
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
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>BIS Features</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>BIS Types</span>
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
                A database is the foundation of any Business Information System.
                Understanding the components, types, and ethical implications is
                essential for effective database design and management.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Database:</strong> A structured
                collection of interrelated data stored electronically for easy
                access and manipulation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">BIS Features:</strong> Integration,
                Automation, Scalability, Security, Accessibility – these make
                BIS powerful business tools.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">BIS Roles:</strong> Support
                operations, accounting, HR, sales, marketing, customer service
                in business; and education, healthcare, government, finance in
                society.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">BIS Components:</strong> Hardware,
                Software, Data, People, Procedures – all five are essential for
                a functioning system.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Ethics &amp; IP:</strong> Privacy,
                security, accuracy, bias, autonomy, and intellectual property
                protections are critical considerations.
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
            Sidemann Academic Registry • NC IT Database Registry 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;