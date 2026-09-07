import React, { useState, useEffect, useRef } from 'react';
import {
  Code,
  GraduationCap,
  Rocket,
  Brain,
  ChevronRight,
  Terminal,
  Database,
  Layout,
  CheckCircle,
  Clock,
  BookOpen,
  ChevronUp,
  X,
  Sparkles,
  BookMarked,
  Target,
  Users,
  Scale,
  AlertTriangle,
  Globe,
  Swords,
  HeartHandshake,
  Flag,
  RefreshCw,
  Search,
  Cpu,
  HardDrive,
  Server,
  Network,
  Shield,
  Lock,
  Key,
  UserCheck,
  UserX,
  Lightbulb,
} from 'lucide-react';
import { SQLConsole } from './XAMPPSQLCode';
import { AdSense } from '../../../../analytics/AdSense';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'hardware-software', label: 'Hardware & Software' },
  { id: 'tablespaces', label: 'Tablespaces' },
  { id: 'create-table', label: 'CREATE TABLE' },
  { id: 'alter-drop', label: 'ALTER & DROP' },
  { id: 'insert', label: 'INSERT' },
  { id: 'update-delete', label: 'UPDATE & DELETE' },
  { id: 'select', label: 'SELECT' },
  { id: 'testing', label: 'Testing' },
  { id: 'test-types', label: 'Test Types & Levels' },
  { id: 'security', label: 'Security' },
  { id: 'grant-revoke', label: 'GRANT & REVOKE' },
  { id: 'cia-triad', label: 'CIA Triad' },
  { id: 'practice', label: 'Practice' },
  { id: 'cheat-sheet', label: 'Cheat Sheet' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome2: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(
    null
  );

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
        text: 'The CIA Triad (Confidentiality, Integrity, Availability) is the foundation of all information security.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use a WHERE clause with UPDATE and DELETE statements – forgetting it will modify or delete ALL rows!',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the SQL order: SELECT → FROM → WHERE → ORDER BY. Writing them in the wrong order causes syntax errors.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse DROP, DELETE, and TRUNCATE. DROP removes the table; DELETE removes specific rows; TRUNCATE removes all rows but keeps the table structure.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The CIA Triad (Confidentiality, Integrity, Availability) is the foundation of all information security.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use a WHERE clause with UPDATE and DELETE statements – forgetting it will modify or delete ALL rows!',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the SQL order: SELECT → FROM → WHERE → ORDER BY. Writing them in the wrong order causes syntax errors.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse DROP, DELETE, and TRUNCATE. DROP removes the table; DELETE removes specific rows; TRUNCATE removes all rows but keeps the table structure.',
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

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Database size={14} className="inline mr-1" /> DATABASE ADMINISTRATION
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 2{' '}
            <span className="text-sky-300 font-bold italic">
              Develop Database
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master SQL for database development: hardware requirements, CREATE
            TABLE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, database testing,
            security, GRANT/REVOKE, and the CIA Triad.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Database size={14} className="inline mr-1" /> SQL
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Security
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
                placeholder="Search for a concept, SQL command, or term..."
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
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Introduction to Database Development
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Welcome to Learning Outcome 2 – Database Development! In
                    this module, you'll learn how to build, modify, query, and
                    secure a database using SQL. From hardware requirements to
                    the CIA Triad, this guide covers everything you need to
                    develop a fully functional database.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Developing a database is like building a house. You need the
                  right tools (hardware), a blueprint (ERD from LO1), and then
                  you construct the rooms (tables), connect them (relationships),
                  furnish them (insert data), and secure them (locks and alarms).
                </p>
              </div>
            </div>

            {/* Hardware & Software Requirements */}
            <div
              ref={(el) => {
                sectionRefs.current['hardware-software'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Hardware &amp; Software Requirements
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Before you install and run a database, your computer hardware and
                software must be properly set up. Just like a salon needs chairs,
                scissors, and mirrors, a database needs the right components.
              </p>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                1 Hardware Components
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Cpu size={14} /> CPU
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The brain – handles complex thinking and queries. More cores = better performance.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <HardDrive size={14} /> RAM
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Short-term memory – buffers data for fast access. More RAM = faster query processing.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <HardDrive size={14} /> Storage (SSD)
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Permanent storage – where all data lives. SSDs are faster than HDDs.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Network size={14} /> NIC (Network Interface Card)
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The road data travels on – high-speed NICs ensure efficient multi-user access.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                2 Software Components
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-4">
                <li><span className="font-bold">DBMS</span> – the engine (MySQL, PostgreSQL, Oracle, SQL Server)</li>
                <li><span className="font-bold">Operating System</span> – Windows Server, Linux</li>
                <li><span className="font-bold">Backup Software</span> – insurance policy for data recovery</li>
                <li><span className="font-bold">Admin Tools</span> – dashboard for managing the database</li>
              </ul>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">💡 Real Life Example</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Think of Econet's billing system. It has millions of subscribers. If their server RAM is too low, the system crashes when everyone tries to check their balance at the same time. They need powerful CPUs, massive RAM, fast SSDs, and a high-speed network card to keep things smooth 24/7.</p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">If asked "What hardware is needed for a database system?" — name all FOUR components (CPU, RAM, Storage, NIC) and explain WHY each matters. "RAM is needed to buffer data and speed up query processing" scores more than just "RAM."</p>
              </div>
            </div>

            {/* Tablespaces */}
            <div
              ref={(el) => {
                sectionRefs.current['tablespaces'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Tablespaces – Organizing Your Storage
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold">Tablespaces</span> are dedicated
                storage areas inside your database. Instead of throwing all files
                into one room, you can say "customer data goes in Cabinet A,
                financial records go in Cabinet B." This makes it easier to
                manage and organize where data is physically stored.
              </p>

              <div className="space-y-4 mt-4">
                <SQLConsole
                  code={`CREATE TABLESPACE my_data_space\n  DATAFILE '/data/mydb/datafile.dat' SIZE 10G;`}
                  isDarkMode={isDarkMode}
                />
                <SQLConsole
                  code={`-- Adding more space later\nALTER TABLESPACE my_data_space\n  ADD DATAFILE '/data/mydb/datafile2.dat' SIZE 5G;`}
                  isDarkMode={isDarkMode}
                />
                <SQLConsole
                  code={`-- Removing a tablespace (must be empty first!)\nDROP TABLESPACE my_data_space;`}
                  isDarkMode={isDarkMode}
                />
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">You will rarely need to write tablespace SQL from memory. BUT you must understand the CONCEPT – what a tablespace is, why it's used, and the key rule: <span className="font-bold">a tablespace must be empty before it can be dropped.</span></p>
              </div>
            </div>

            {/* CREATE TABLE */}
            <div
              ref={(el) => {
                sectionRefs.current['create-table'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Creating Tables with SQL
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                After designing your ERD (from Learning Outcome 1), you now bring
                it to life using the <span className="font-bold">CREATE TABLE</span>
                SQL command. Each entity becomes a table, each attribute becomes
                a column, and each column gets a data type and constraints.
              </p>

              <div className="mt-4">
                <SQLConsole
                  code={`CREATE TABLE Customers (\n    customer_id   INT PRIMARY KEY AUTO_INCREMENT,\n    full_name     VARCHAR(255) NOT NULL,\n    email         VARCHAR(255) UNIQUE,\n    phone_number  VARCHAR(20),\n    city          VARCHAR(100)\n);`}
                  isDarkMode={isDarkMode}
                  databaseName="sales_db"
                  tableName="Customers"
                />
              </div>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212] mt-4">
                <table className="w-full text-left border-collapse min-w-[400px] text-xs">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Part</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold">INT</td><td className="p-3">Stores whole numbers (e.g., 1, 2, 500)</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">VARCHAR(255)</td><td className="p-3">Stores text up to 255 characters</td></tr>
                    <tr><td className="p-3 font-bold">PRIMARY KEY</td><td className="p-3">This column is the unique identifier</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">AUTO_INCREMENT</td><td className="p-3">Database automatically gives the next number</td></tr>
                    <tr><td className="p-3 font-bold">NOT NULL</td><td className="p-3">This field CANNOT be left empty</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">UNIQUE</td><td className="p-3">No two rows can have the same value here</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">💡 Real Life Example</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Creating a Students table for a Zimbabwean school database:</p>
                <SQLConsole
                  code={`CREATE TABLE Students (\n    student_id   INT PRIMARY KEY AUTO_INCREMENT,\n    first_name   VARCHAR(100) NOT NULL,\n    last_name    VARCHAR(100) NOT NULL,\n    dob          DATE NOT NULL,\n    form_level   VARCHAR(10),\n    gender       CHAR(1)\n);`}
                  isDarkMode={isDarkMode}
                  databaseName="school_db"
                  tableName="Students"
                />
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Know your common constraints cold: <span className="font-bold">NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, DEFAULT, and CHECK</span>. If asked to write a CREATE TABLE statement, always include a primary key, at least one NOT NULL constraint, and appropriate data types.</p>
              </div>
            </div>

            {/* ALTER & DROP */}
            <div
              ref={(el) => {
                sectionRefs.current['alter-drop'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Modifying Tables (ALTER &amp; DROP)
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Business requirements change, and you need to update your database
                structure using <span className="font-bold">ALTER TABLE</span>.
                Think of it like renovating a house – you can add a new room,
                knock down a wall, or change the size of a window.
              </p>

              <div className="space-y-4 mt-4">
                <SQLConsole
                  code={`-- Adding a new column\nALTER TABLE Customers\n  ADD COLUMN date_registered DATE;`}
                  isDarkMode={isDarkMode}
                />
                <SQLConsole
                  code={`-- Modifying an existing column's data type\nALTER TABLE Customers\n  MODIFY COLUMN phone_number VARCHAR(30);`}
                  isDarkMode={isDarkMode}
                />
                <p className="text-sm text-slate-700 dark:text-slate-300">To completely remove a table and all its data, use <span className="font-bold">DROP TABLE</span>:</p>
                <SQLConsole
                  code={`DROP TABLE Customers;`}
                  isDarkMode={isDarkMode}
                />
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 mt-4">
                <h4 className="text-xs font-bold text-red-600 dark:text-red-400">⚠️ Warning</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-bold">DROP TABLE</span> is permanent and instant. There is no "undo" button. Always make sure you have a <span className="font-bold">backup</span> before dropping anything.
                </p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Know the difference between <span className="font-bold">DELETE, DROP, and TRUNCATE</span>. <code>DELETE</code> removes specific rows (data) but keeps the table. <code>DROP</code> removes the entire table structure AND data. <code>TRUNCATE</code> removes all rows but keeps the table structure.</p>
              </div>
            </div>

            {/* INSERT */}
            <div
              ref={(el) => {
                sectionRefs.current['insert'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Inserting Data (INSERT INTO)
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Now your tables exist – but they're empty! Fill them with data
                using <span className="font-bold">INSERT INTO</span>. Think of it
                like filling in a register – the form exists, now you're adding
                one person's information.
              </p>

              <div className="mt-4">
                <SQLConsole
                  code={`INSERT INTO Customers (full_name, email, phone_number, city)\nVALUES ('Tatenda Moyo', 'tatenda@gmail.com', '0772123456', 'Harare');`}
                  isDarkMode={isDarkMode}
                />
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 mt-4">You can also insert multiple rows at once:</p>
              <div className="mt-2">
                <SQLConsole
                  code={`INSERT INTO Students (first_name, last_name, dob, form_level, gender)\nVALUES\n  ('Chiedza', 'Mufara', '2005-03-15', 'Form 4', 'F'),\n  ('Tinashe', 'Dube', '2006-07-22', 'Form 3', 'M'),\n  ('Rutendo', 'Ncube', '2004-11-01', 'Form 5', 'F');`}
                  isDarkMode={isDarkMode}
                />
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">The number of columns listed must EXACTLY match the number of values provided. If you list 4 columns but provide 3 values, the query will fail. Always double-check your column count vs value count.</p>
              </div>
            </div>

            {/* UPDATE & DELETE */}
            <div
              ref={(el) => {
                sectionRefs.current['update-delete'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Updating &amp; Deleting Data (UPDATE &amp; DELETE)
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Data changes over time. Customers move houses. Students change
                classes. The <span className="font-bold">UPDATE</span> statement
                allows you to change existing records:
              </p>

              <div className="mt-2">
                <SQLConsole
                  code={`UPDATE Customers\nSET email = 'newemail@gmail.com', city = 'Bulawayo'\nWHERE customer_id = 1;`}
                  isDarkMode={isDarkMode}
                />
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 mt-4">
                The <span className="font-bold">WHERE clause is critical</span>
                in UPDATE. Without it, you update EVERY row – like accidentally
                changing every customer's email to the same address.
              </p>

              <p className="text-sm text-slate-700 dark:text-slate-300 mt-4">
                The <span className="font-bold">DELETE</span> statement removes
                specific records:
              </p>
              <div className="mt-2">
                <SQLConsole
                  code={`DELETE FROM Customers\nWHERE customer_id = 5;`}
                  isDarkMode={isDarkMode}
                />
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 mt-4">
                <h4 className="text-xs font-bold text-red-600 dark:text-red-400">⚠️ Warning</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Always use <span className="font-bold">WHERE</span> with DELETE. Without it, you wipe out every single row in the table. The table structure remains, but all data is gone.</p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">ALWAYS include the WHERE clause in UPDATE and DELETE. Examiners often specifically test whether you know to include it. Also, you cannot DELETE a parent record if a child record references it as a FOREIGN KEY.</p>
              </div>
            </div>

            {/* SELECT */}
            <div
              ref={(el) => {
                sectionRefs.current['select'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Retrieving Data (SELECT)
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                The most used SQL command in the world is <span className="font-bold">SELECT</span>.
                This is how you ask the database questions and get answers back.
              </p>

              <div className="space-y-4 mt-4">
                <p className="text-sm text-slate-700 dark:text-slate-300">Basic structure:</p>
                <SQLConsole
                  code={`SELECT column1, column2\nFROM table_name\nWHERE condition\nORDER BY column_name ASC;`}
                  isDarkMode={isDarkMode}
                />
                <p className="text-sm text-slate-700 dark:text-slate-300">To get everything from a table:</p>
                <SQLConsole
                  code={`SELECT * FROM Customers;`}
                  isDarkMode={isDarkMode}
                />
                <p className="text-sm text-slate-700 dark:text-slate-300">To get specific columns with a filter:</p>
                <SQLConsole
                  code={`SELECT full_name, email\nFROM Customers\nWHERE city = 'Harare'\nORDER BY full_name ASC;`}
                  isDarkMode={isDarkMode}
                />
                <p className="text-sm text-slate-700 dark:text-slate-300">The <code>LIKE</code> operator is used for pattern matching:</p>
                <SQLConsole
                  code={`-- Find all customers with a Gmail address\nSELECT * FROM Customers\nWHERE email LIKE '%@gmail.com';`}
                  isDarkMode={isDarkMode}
                />
                <p className="text-sm text-slate-700 dark:text-slate-300">The <code>%</code> symbol is a wildcard – "anything can go here."</p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Know the ORDER of SELECT clauses: <span className="font-bold">SELECT → FROM → WHERE → ORDER BY</span>. Writing them in the wrong order causes a syntax error. Also know the difference between <code>ASC</code> (A to Z) and <code>DESC</code> (Z to A).</p>
              </div>
            </div>

            {/* Database Testing */}
            <div
              ref={(el) => {
                sectionRefs.current['testing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Database Testing
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold">Database testing</span> ensures your
                database actually works correctly. Just like testing water from a
                borehole before drinking, you test your database before putting it
                into production.
              </p>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Why Testing Matters
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-4">
                <li><span className="font-bold">Data Accuracy</span> – the right data goes in and comes out</li>
                <li><span className="font-bold">Functional Correctness</span> – every query returns what it should</li>
                <li><span className="font-bold">Performance</span> – the system doesn't crash under heavy use</li>
                <li><span className="font-bold">Security</span> – unauthorized users cannot access what they shouldn't</li>
                <li><span className="font-bold">Disaster Recovery</span> – backups actually work when needed</li>
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Testing Process
              </h3>
              <ol className="list-decimal pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-4">
                <li>Plan what to test</li>
                <li>Design test cases</li>
                <li>Prepare test data</li>
                <li>Execute the tests</li>
                <li>Log any defects found</li>
                <li>Write a report and review with stakeholders</li>
              </ol>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">If asked "Why is database testing important?" – give at least FOUR reasons from this list: data accuracy, functional validation, performance optimization, security verification, data integrity, and disaster recovery.</p>
              </div>
            </div>

            {/* Test Types & Levels */}
            <div
              ref={(el) => {
                sectionRefs.current['test-types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Types &amp; Levels of Database Testing
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-2">
                TYPES of Database Testing
              </h3>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212] mt-2">
                <table className="w-full text-left border-collapse min-w-[400px] text-xs">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Type</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">What It Tests</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold">Functional Testing</td><td className="p-3">Does the database DO what it was designed to do?</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Non-Functional Testing</td><td className="p-3">Performance, speed, security, scalability</td></tr>
                    <tr><td className="p-3 font-bold">Structural Testing</td><td className="p-3">Is the database STRUCTURE correct? (constraints, data types)</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                LEVELS of Database Testing
              </h3>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212] mt-2">
                <table className="w-full text-left border-collapse min-w-[400px] text-xs">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Level</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">What It Means</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold">Unit Testing</td><td className="p-3">Testing ONE small component in isolation</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Integration Testing</td><td className="p-3">Testing how MULTIPLE components work together</td></tr>
                    <tr><td className="p-3 font-bold">System Testing</td><td className="p-3">Testing the WHOLE system end-to-end</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Know the difference between <span className="font-bold">TYPES (Functional, Non-Functional, Structural)</span> and <span className="font-bold">LEVELS (Unit, Integration, System)</span>. A common mistake is mixing them together.</p>
              </div>
            </div>

            {/* Database Security */}
            <div
              ref={(el) => {
                sectionRefs.current['security'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Database Security
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold">Database security</span> protects your
                data from theft, corruption, and unauthorized access. Think of it
                like protecting your home – you have a gate (physical), a door
                lock (logical), and you teach your family not to open the door to
                strangers (behavioral).
              </p>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Threats to Database Security
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-4">
                <li><span className="font-bold">Unauthorized Access</span> – hackers or dishonest employees snooping</li>
                <li><span className="font-bold">SQL Injection</span> – malicious code typed into login forms</li>
                <li><span className="font-bold">Ransomware</span> – criminals encrypt the database and demand payment</li>
                <li><span className="font-bold">Misconfigurations</span> – poorly set access controls</li>
                <li><span className="font-bold">Human Error</span> – staff accidentally deleting data or using weak passwords</li>
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Three Layers of Security
              </h3>
              <div className="space-y-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Physical Security</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Lock the server room, control who enters, CCTV, temperature and fire suppression.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Logical Security</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">User access controls (GRANT/REVOKE), data encryption, firewalls, regular patching, and backups.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Behavioral Security</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Staff training, strong password policies, principle of least privilege, and monitoring suspicious activity.</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Know all <span className="font-bold">four categories of threats</span> AND the <span className="font-bold">three layers of security (physical, logical, behavioral)</span>. If asked "describe how you would secure a database," give measures from ALL THREE layers.</p>
              </div>
            </div>

            {/* GRANT & REVOKE */}
            <div
              ref={(el) => {
                sectionRefs.current['grant-revoke'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Controlling Access with GRANT &amp; REVOKE
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Control WHO can do WHAT using <span className="font-bold">GRANT</span>
                and <span className="font-bold">REVOKE</span>. Think of GRANT as
                giving someone a key to specific rooms. REVOKE is taking that key
                back.
              </p>

              <div className="space-y-4 mt-4">
                <SQLConsole
                  code={`-- Give John read-only access to the Customers table\nGRANT SELECT ON Customers TO john;`}
                  isDarkMode={isDarkMode}
                />
                <SQLConsole
                  code={`-- Give a cashier the ability to insert and read sales records\nGRANT SELECT, INSERT ON Sales TO cashier_user;`}
                  isDarkMode={isDarkMode}
                />
                <SQLConsole
                  code={`-- Give full access to the database admin\nGRANT ALL PRIVILEGES ON *.* TO admin_user;`}
                  isDarkMode={isDarkMode}
                />
                <SQLConsole
                  code={`-- Take away update permission from Jane on the Employees table\nREVOKE UPDATE ON Employees FROM jane;`}
                  isDarkMode={isDarkMode}
                />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Principle of Least Privilege</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Give each user ONLY the access they need to do their job – nothing more. A cashier does not need DELETE access to the payroll table.</p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">If asked to write SQL for access control, always specify: (1) the permission type, (2) the table name, and (3) the user. All three parts must be present.</p>
              </div>
            </div>

            {/* CIA Triad */}
            <div
              ref={(el) => {
                sectionRefs.current['cia-triad'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The CIA Triad
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                The <span className="font-bold">CIA Triad</span> is the foundation
                of all information security – not just for databases, but for ALL
                data systems. It stands for three principles that every secure
                system must uphold.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">C – CONFIDENTIALITY</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Only authorized people can see sensitive data. Enforced through access controls (<code>GRANT</code>/<code>REVOKE</code>), encryption, and password protection.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">I – INTEGRITY</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Data must be accurate, consistent, and trustworthy. Protected through constraints (<code>NOT NULL</code>, <code>UNIQUE</code>, <code>CHECK</code>), foreign keys, and transaction controls.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">A – AVAILABILITY</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Authorized users must be able to access the database whenever they need it. Protected through reliable hardware, backups, disaster recovery, and high uptime configurations.</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">💡 Real Life Example</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Think of your CBZ mobile banking app. CONFIDENTIALITY means only YOU can see your account balance. INTEGRITY means nobody can change your balance without a real, authorized transaction. AVAILABILITY means the app must work at 2am when you need to send money urgently.</p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">CIA Triad questions are almost always in exams. For EACH letter, know: (1) the full word, (2) a one-sentence definition, and (3) a real-life database example. This three-part answer structure guarantees full marks.</p>
              </div>
            </div>

            {/* Practice Questions */}
            <div
              ref={(el) => {
                sectionRefs.current['practice'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Practice Exercise Questions &amp; Answers
              </h2>

              <div className="space-y-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Q1: Write an SQL statement to create a table called EMPLOYEES with the following fields: employee_id (primary key, auto-increment), first_name (text, required), last_name (text, required), department (text), salary (decimal), hire_date (date).</p>
                  <div className="mt-2">
                    <SQLConsole
                      code={`CREATE TABLE Employees (\n    employee_id  INT PRIMARY KEY AUTO_INCREMENT,\n    first_name   VARCHAR(100) NOT NULL,\n    last_name    VARCHAR(100) NOT NULL,\n    department   VARCHAR(100),\n    salary       DECIMAL(10,2),\n    hire_date    DATE\n);`}
                      isDarkMode={isDarkMode}
                      databaseName="practice_db"
                      tableName="Employees"
                    />
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Q2: A student named Rudo Mupande (student_id = 45) has changed her form level from Form 3 to Form 4. Write the SQL statement to update this.</p>
                  <div className="mt-2">
                    <SQLConsole
                      code={`UPDATE Students\nSET form_level = 'Form 4'\nWHERE student_id = 45;`}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Q3: Write an SQL query to find all employees in the 'Sales' department, sorted by last name in alphabetical order.</p>
                  <div className="mt-2">
                    <SQLConsole
                      code={`SELECT first_name, last_name, salary\nFROM Employees\nWHERE department = 'Sales'\nORDER BY last_name ASC;`}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Q4: What is the CIA Triad? Explain each component with one database example.</p>
                  <div className="mt-2 p-3 bg-slate-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400"><span className="font-bold">Confidentiality</span> – only authorized users access data (e.g., only HR staff can view salary records). <span className="font-bold">Integrity</span> – data is accurate and cannot be tampered with (e.g., NOT NULL constraints). <span className="font-bold">Availability</span> – the database is accessible when needed (e.g., daily backups and redundant servers).</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Q5: Explain the difference between Unit Testing, Integration Testing, and System Testing in the context of a school database.</p>
                  <div className="mt-2 p-3 bg-slate-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400"><span className="font-bold">Unit Testing</span> – testing one stored procedure that calculates a student's average mark. <span className="font-bold">Integration Testing</span> – testing whether STUDENTS, MARKS, and SUBJECTS tables link correctly. <span className="font-bold">System Testing</span> – simulating a teacher logging in, entering marks, generating a report, and verifying the entire process.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Q6: A user called 'receptionist' should be able to view the Customers table but NOT be able to change or delete any records. Write the SQL to set this up.</p>
                  <div className="mt-2">
                    <SQLConsole
                      code={`GRANT SELECT ON Customers TO receptionist;`}
                      isDarkMode={isDarkMode}
                    />
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">This gives the receptionist READ-ONLY access. INSERT, UPDATE, and DELETE are NOT granted.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cheat Sheet */}
            <div
              ref={(el) => {
                sectionRefs.current['cheat-sheet'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Quick Revision Cheat Sheet
              </h2>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212]">
                <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Concept</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">What to Remember</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold">CPU</td><td className="p-3">Handles queries and processing. More cores = better performance.</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">RAM</td><td className="p-3">Buffers data for fast access. More RAM = faster queries.</td></tr>
                    <tr><td className="p-3 font-bold">SSD Storage</td><td className="p-3">Faster data access than traditional hard drives.</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">CREATE TABLE</td><td className="p-3">Defines table structure with column names, data types, constraints.</td></tr>
                    <tr><td className="p-3 font-bold">ALTER TABLE</td><td className="p-3">Modifies existing table structure (add/change columns).</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">DROP TABLE</td><td className="p-3">Permanently deletes table AND all its data. Cannot be undone!</td></tr>
                    <tr><td className="p-3 font-bold">INSERT INTO</td><td className="p-3">Adds new rows of data into a table.</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">UPDATE...SET...WHERE</td><td className="p-3">Changes existing data. ALWAYS use WHERE clause.</td></tr>
                    <tr><td className="p-3 font-bold">DELETE FROM...WHERE</td><td className="p-3">Removes specific rows. ALWAYS use WHERE clause.</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">SELECT...FROM...WHERE</td><td className="p-3">Retrieves data. Most used SQL command.</td></tr>
                    <tr><td className="p-3 font-bold">GRANT</td><td className="p-3">Gives a user permission to perform actions on a table.</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">REVOKE</td><td className="p-3">Takes away a user's permissions.</td></tr>
                    <tr><td className="p-3 font-bold">Functional Testing</td><td className="p-3">Does the database work as designed?</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Non-Functional Testing</td><td className="p-3">Performance, security, scalability.</td></tr>
                    <tr><td className="p-3 font-bold">Unit Testing</td><td className="p-3">One small component tested in isolation.</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Integration Testing</td><td className="p-3">Multiple components tested together.</td></tr>
                    <tr><td className="p-3 font-bold">System Testing</td><td className="p-3">The whole system tested end-to-end.</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">CIA - Confidentiality</td><td className="p-3">Only authorized users can VIEW data.</td></tr>
                    <tr><td className="p-3 font-bold">CIA - Integrity</td><td className="p-3">Data is accurate and cannot be tampered with.</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">CIA - Availability</td><td className="p-3">Authorized users can always ACCESS data.</td></tr>
                    <tr><td className="p-3 font-bold">Least Privilege</td><td className="p-3">Give users ONLY the access they need.</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">SQL Injection</td><td className="p-3">Hacker inputs malicious SQL to bypass security.</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">You now have everything you need for Learning Outcome 2. Practice the SQL, remember the exam tips – they are your cheat codes to full marks! 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 SQL Insight
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
                  <span>SQL Commands</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>CIA Principles</span>
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
                SQL is the language of databases. Master CREATE, READ, UPDATE,
                DELETE (CRUD) operations, understand security principles like
                the CIA Triad, and always test your database thoroughly.
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
                <strong className="text-white">Hardware requirements</strong> – CPU, RAM, Storage (SSD), and NIC are essential for database performance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">SQL commands</strong> – CREATE TABLE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT – are the building blocks of database development.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Database testing</strong> has types (Functional, Non-Functional, Structural) and levels (Unit, Integration, System) – both are important.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Security</strong> – use GRANT/REVOKE for access control, follow the principle of least privilege, and protect against SQL injection.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">CIA Triad</strong> – Confidentiality (who can view), Integrity (data accuracy), Availability (access when needed) – the foundation of information security.
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
            Sidemann Academic Registry • Database Development 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;
