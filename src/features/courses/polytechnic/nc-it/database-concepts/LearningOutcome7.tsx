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
  Lightbulb,
  Cloud,
  Clock,
  ChevronUp,
  RefreshCw,
  Trophy,
  Target,
  X,
  Hash,
  Gauge,
  GitBranch,
  Shield,
  DollarSign,
  Table,
  PieChart,
} from 'lucide-react';
import { MultiQuestionQuiz } from '../../../../activities/MiniGames';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'nosql', label: 'NoSQL' },
  { id: 'bigdata', label: 'Big Data' },
  { id: 'cloud', label: 'Cloud DB' },
  { id: 'warehouse', label: 'Data Warehouse' },
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
export const LearningOutcome7: React.FC = () => {
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
        text: 'The term "NoSQL" was first used in 1998 by Carlo Strozzi for a lightweight relational database, but it gained popularity in the 2000s with the rise of web-scale applications.',
      },
      {
        title: 'Pro Tip',
        text: 'When choosing a NoSQL database, consider your data model: document stores for flexible schemas, key-value for caching, graph for relationships, and wide-column for time-series data.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 5 Vs of Big Data: Volume, Velocity, Variety, Veracity, Value – they spell "VVVVV" (or think of "5 V\'s").',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations treat Data Warehouses and Data Lakes as interchangeable. A warehouse stores structured, processed data for BI; a data lake stores raw data in its native format.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The term "NoSQL" was first used in 1998 by Carlo Strozzi for a lightweight relational database, but it gained popularity in the 2000s with the rise of web-scale applications.',
      },
      {
        title: 'Pro Tip',
        text: 'When choosing a NoSQL database, consider your data model: document stores for flexible schemas, key-value for caching, graph for relationships, and wide-column for time-series data.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 5 Vs of Big Data: Volume, Velocity, Variety, Veracity, Value – they spell "VVVVV" (or think of "5 V\'s").',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations treat Data Warehouses and Data Lakes as interchangeable. A warehouse stores structured, processed data for BI; a data lake stores raw data in its native format.',
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
      <header className="bg-[#312e81] dark:bg-[#1e1b4b] border-b border-indigo-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <DatabaseIcon size={14} className="inline mr-1" /> EMERGING DATABASE TRENDS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 7{' '}
            <span className="text-indigo-300 font-bold italic">
              NoSQL &amp; Big Data
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Explore modern database paradigms: NoSQL databases, Big Data
            characteristics, Cloud Database-as-a-Service, and Data Warehousing
            for business intelligence.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">📚 6 sections</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <GitBranch size={14} className="inline mr-1" /> NoSQL
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <BarChart3 size={14} className="inline mr-1" /> Big Data
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
                placeholder="Search for a concept, database type, or V..."
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
                  The database landscape is evolving rapidly to handle the requirements of modern applications, including massive scale, high speed, and unstructured data. This learning outcome covers the key emerging trends.
                </p>
              </div>
            </div>

            {/* ─── 1. NoSQL Databases ────────────────────────────────────── */}
            <div ref={setSectionRef('nosql')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                NoSQL Databases
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                <strong>NoSQL</strong> (Not Only SQL) databases are designed for distributed data stores where very large scale of data storage needs exist. They do not use the tabular relations used in relational databases.
              </p>

              <img
                src={dbImage('nosql-types')}
                alt="NoSQL database types"
                className="w-full h-48 object-contain rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-4"
              />

              <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6 mb-4">
                Types of NoSQL Databases
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase">Document Stores</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    Store data in JSON-like documents (e.g., MongoDB). Flexible schema, nested structures, and rich querying.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase">Key-Value Stores</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    Simplest NoSQL database, storing data as a hash table (e.g., Redis). Extremely fast for lookups by key.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase">Wide-Column Stores</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    Store data in tables, rows, and dynamic columns (e.g., Cassandra). Optimised for large-scale, high‑throughput writes.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase">Graph Databases</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    Store data in nodes and edges, ideal for social networks and recommendation engines (e.g., Neo4j).
                  </p>
                </div>
              </div>

              <div className="mt-6 p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <Info size={16} /> When to Use NoSQL
                </h4>
                <ul className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-5 mt-2 space-y-1">
                  <li>Need to store large volumes of unstructured or semi‑structured data.</li>
                  <li>Require horizontal scaling and high availability.</li>
                  <li>Flexible schema evolution is important.</li>
                  <li>Complex relationships (graph) or fast key‑value access.</li>
                </ul>
              </div>
            </div>

            {/* ─── 2. Big Data ────────────────────────────────────────────── */}
            <div ref={setSectionRef('bigdata')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Big Data
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Big Data refers to datasets that are too large or complex to be dealt with by traditional data‑processing application software. It is characterised by the <strong>5 Vs</strong>.
              </p>

              <img
                src={dbImage('big-data-5vs')}
                alt="5 Vs of Big Data"
                className="w-full h-48 object-contain rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-4"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 text-center">
                  <Hash size={28} className="mx-auto text-blue-500 mb-2" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase">Volume</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Amount of data generated</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 text-center">
                  <Gauge size={28} className="mx-auto text-purple-500 mb-2" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase">Velocity</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Speed of data generation</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 text-center">
                  <GitBranch size={28} className="mx-auto text-amber-500 mb-2" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase">Variety</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Different data types</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 text-center">
                  <Shield size={28} className="mx-auto text-emerald-500 mb-2" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase">Veracity</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Trustworthiness of data</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 text-center">
                  <DollarSign size={28} className="mx-auto text-orange-500 mb-2" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase">Value</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Business worth of data</p>
                </div>
              </div>

              <div className="mt-6 p-5 bg-yellow-50 dark:bg-yellow-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle size={16} /> Real‑World Impact
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                  Organisations use Big Data analytics to improve customer experiences, optimise operations, and drive innovation. The 5 Vs provide a framework for understanding the challenges and opportunities.
                </p>
              </div>
            </div>

            {/* ─── 3. Cloud Databases (DBaaS) ────────────────────────────── */}
            <div ref={setSectionRef('cloud')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Cloud Databases (DBaaS)
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Database‑as‑a‑Service (DBaaS) is a cloud computing service model that provides users with access to a database without the need for setting up physical hardware, installing software, or configuring for performance.
              </p>

              <img
                src={dbImage('cloud-dbaas')}
                alt="Cloud database as a service"
                className="w-full h-48 object-contain rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 text-center">
                  <Rocket size={24} className="mx-auto text-blue-500 mb-2" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Scalability</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Elastic scaling on demand</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 text-center">
                  <ShieldCheck size={24} className="mx-auto text-purple-500 mb-2" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">High Availability</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">99.99% uptime SLAs</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 text-center">
                  <DollarSign size={24} className="mx-auto text-emerald-500 mb-2" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Reduced Cost</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Pay‑as‑you‑go pricing</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 text-center">
                  <Clock size={24} className="mx-auto text-orange-500 mb-2" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Automated Backups</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Managed backup &amp; recovery</p>
                </div>
              </div>

              <div className="mt-6 p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <Globe size={16} /> Popular DBaaS Providers
                </h4>
                <ul className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-5 mt-2">
                  <li><strong>AWS RDS</strong> – Relational Database Service</li>
                  <li><strong>Azure SQL Database</strong> – Managed SQL Server</li>
                  <li><strong>Google Cloud SQL</strong> – Fully managed MySQL, PostgreSQL</li>
                  <li><strong>MongoDB Atlas</strong> – Managed MongoDB in the cloud</li>
                </ul>
              </div>
            </div>

            {/* ─── 4. Data Warehousing ─────────────────────────────────────── */}
            <div ref={setSectionRef('warehouse')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Data Warehousing
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                A Data Warehouse is a centralised repository that consolidates data from many different sources. It supports business intelligence (BI) activities such as analytics and reporting.
              </p>

              <img
                src={dbImage('data-warehouse')}
                alt="Data warehouse architecture"
                className="w-full h-48 object-contain rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase">OLTP vs. OLAP</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    Operational databases (OLTP) are optimised for transactional workloads (inserts, updates). Data warehouses (OLAP) are optimised for complex queries and aggregating large amounts of historical data.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase">Key Characteristics</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-4 mt-2 space-y-1">
                    <li><strong>Subject-oriented</strong> – organised around key business subjects.</li>
                    <li><strong>Integrated</strong> – consolidates data from multiple sources.</li>
                    <li><strong>Non-volatile</strong> – read‑only, historical data.</li>
                    <li><strong>Time-variant</strong> – maintains historical context.</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <PieChart size={16} /> Business Intelligence Use Cases
                </h4>
                <ul className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-5 mt-2">
                  <li>Sales performance analysis and forecasting.</li>
                  <li>Customer behaviour and segmentation.</li>
                  <li>Financial reporting and compliance.</li>
                  <li>Supply chain optimisation.</li>
                </ul>
              </div>
            </div>

            {/* ─── 5. Quiz ────────────────────────────────────────────────── */}
            <div ref={setSectionRef('quiz')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Knowledge Check
              </h2>
              <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
                <MultiQuestionQuiz
                  id="db-lo7-quiz"
                  points={100}
                  questions={[
                    { question: "NoSQL stands for...", options: ["Not Only SQL", "No SQL", "New SQL", "Network SQL"], correctAnswer: "Not Only SQL" },
                    { question: "Which database type is best for unstructured data?", options: ["NoSQL", "Relational", "Hierarchical", "Network"], correctAnswer: "NoSQL" },
                    { question: "MongoDB is an example of which type of NoSQL store?", options: ["Document", "Key-Value", "Graph", "Column"], correctAnswer: "Document" },
                    { question: "Which V refers to the trustworthiness of data?", options: ["Veracity", "Volume", "Velocity", "Variety"], correctAnswer: "Veracity" },
                    { question: "A centralised repository for historical data analysis is a...", options: ["Data Warehouse", "Operational Database", "Data Mart", "Data Lake"], correctAnswer: "Data Warehouse" }
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
                  💡 Modern DB Tip
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
                  <span>NoSQL Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Vs of Big Data</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>DBaaS Benefits</span>
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
                The database world is diverse. Choose the right tool for the job: NoSQL for scale and flexibility, Data Warehouses for analytics, and Cloud DBaaS for managed infrastructure.
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
                <strong className="text-white">NoSQL Databases:</strong> Four main types – Document, Key‑Value, Wide‑Column, Graph – each suited for different use cases.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">2.</span>
              <span>
                <strong className="text-white">5 Vs of Big Data:</strong> Volume, Velocity, Variety, Veracity, Value – frame the challenges and opportunities of large‑scale data.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">3.</span>
              <span>
                <strong className="text-white">Cloud DBaaS:</strong> Offers scalability, high availability, reduced cost, and automated backups – ideal for agile development.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">4.</span>
              <span>
                <strong className="text-white">Data Warehousing:</strong> Centralised, subject‑oriented, integrated, non‑volatile, time‑variant – optimised for BI and analytics.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">5.</span>
              <span>
                <strong className="text-white">Choose Wisely:</strong> Relational, NoSQL, Cloud, or Warehouse – the right choice depends on your data volume, structure, and access patterns.
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

export default LearningOutcome7;
