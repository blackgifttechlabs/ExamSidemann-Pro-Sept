import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  // Core icons for header, nav, sidebar
  FileText,
  Archive,
  Trash2,
  Target,
  ClipboardList,
  Shield,
  BookOpen,
  Monitor,
  Calendar,
  Search as SearchIcon,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen as BookOpenIcon,
  Clock,
  Hash,
  CheckCircle,
  RefreshCw,
  // Additional icons used in content
  FolderTree,
  Layout,
  Edit,
  ListChecks,
  Database,
  User,
  Cloud,
  Server,
  HardDrive,
  Users,
  Link,
  Table,
  PlusCircle,
  MoreHorizontal,
  Layers,
  Box,
  TreePalm as Tree,
  Zap,
  TrendingUp,
  Inbox,
  DollarSign,
  MessageSquare,
  Plus,
  Minus,
  Eye,
  Lock,
  AlertCircle,
  Globe,
  Settings,
  Circle,
  File,
  Folder,
  BookMarked,
  Library,
  Tag,
  Code,
  Lightbulb,
  Home,
  Monitor as MonitorIcon,
  BarChart,
  PieChart,
  AlertTriangle,
  KeyRound,
  Fingerprint,
  Siren,
  Flame,
  Waves,
  ShieldCheck,
  Bell,
  Send,
  Headphones,
  Award,
  Briefcase,
  Coffee,
  ThumbsUp,
  HelpCircle,
  FileCheck,
  FileSearch,
  FileWarning,
  FileX,
  UserCheck,
  UserPlus,
  UserMinus,
  UserX,
  Handshake,
  Heart,
  Star,
  Gem,
  Crown,
  Building,
  DoorOpen,
  Sofa,
  Paintbrush,
  Utensils,
  CupSoda,
  Cookie,
  Apple,
  Wine,
  PhoneForwarded,
  PhoneOff,
  Voicemail,
  Headset,
  BadgeCheck,
  Trophy,
  Medal,
  Microscope,
  FlaskRound,
  Beaker,
  TestTube,
  Thermometer,
  Droplet,
  Fan,
  Wrench,
  Hammer,
  Drill,
  Recycle,
  Leaf,
  Flower,
  BookMarked as BookMarkedIcon,
  Library as LibraryIcon,
  PanelTop,
  Scan,
  Link as LinkIcon,
  Table as TableIcon,
  PlusCircle as PlusCircleIcon,
  MoreHorizontal as MoreHorizontalIcon,
  Fingerprint as FingerprintIcon,
  KeyRound as KeyRoundIcon,
  Siren as SirenIcon,
  Flame as FlameIcon,
  Waves as WavesIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'integrity', label: 'Data Integrity' },
  { id: 'tools', label: 'Security Tools' },
  { id: 'implementation', label: 'Integrity & Aggregation' },
  { id: 'models', label: 'Security Models' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'techniques', label: 'Security Techniques' },
  { id: 'newgen', label: 'New-Gen Protection' },
  { id: 'disaster', label: 'Disaster Recovery' },
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

  // Random tip on mount (security‑related)
  useEffect(() => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The Bell-LaPadula model, one of the earliest security models, was developed in 1973 to enforce mandatory access control and focuses on data confidentiality.',
      },
      {
        title: 'Pro Tip',
        text: 'Always implement the principle of least privilege: give users only the permissions they absolutely need to perform their job functions.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the CIA triad: Confidentiality, Integrity, Availability – the three pillars of information security.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organizations focus on perimeter security but neglect internal database activity monitoring, leaving them vulnerable to insider threats.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The Bell-LaPadula model, one of the earliest security models, was developed in 1973 to enforce mandatory access control and focuses on data confidentiality.',
      },
      {
        title: 'Pro Tip',
        text: 'Always implement the principle of least privilege: give users only the permissions they absolutely need to perform their job functions.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the CIA triad: Confidentiality, Integrity, Availability – the three pillars of information security.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organizations focus on perimeter security but neglect internal database activity monitoring, leaving them vulnerable to insider threats.',
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

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

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

  // ─── Helper to render a clean card ──────────────────────────────────────
  const renderCard = (title: string, icon: React.ReactNode, content: React.ReactNode) => {
    return (
      <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-4">
        <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
          {icon} {title}
        </h4>
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
          {typeof content === 'string' ? <p>{content}</p> : content}
        </div>
      </div>
    );
  };

  // ─── Helper for numbered section title ──────────────────────────────────
  const SectionTitle = ({ number, children }: { number: string; children: React.ReactNode }) => (
    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
      {number}. {children}
    </h2>
  );

  // ─── Helper for subsection title ────────────────────────────────────────
  const SubTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6 mb-3">{children}</h3>
  );

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FileText size={14} className="inline mr-1" /> DATABASE SECURITY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Database Security, Integrity &amp;{' '}
            <span className="text-amber-300 font-bold italic">
              Disaster Recovery
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to data integrity, security analysis tools, security models, challenges, techniques, and disaster recovery for modern databases.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">📚 {SECTION_TABS.length} sections</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Security
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <CheckCircle size={14} className="inline mr-1" /> Integrity
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <RefreshCw size={14} className="inline mr-1" /> Recovery
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <SearchIcon className="ml-4 text-indigo-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, term, example..."
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
                  <XIcon size={18} className="text-indigo-200" />
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
          {/* ─── Left Column: All Sections ────────────────────────────────── */}
          <div ref={listContainerRef} className="space-y-12">
            {/* ==============================================================
                SECTION 1: DATABASE FUNCTIONS FOR DATA INTEGRITY
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['integrity'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="1">Database Functions for Data Integrity</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Data integrity refers to the accuracy, consistency, and trustworthiness of data within a database.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-1">
                    Here are some key database functions that support data integrity:
                  </p>
</div>

              {renderCard(
                '1. Constraints',
                <ListChecks size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Primary Key:</strong> A unique identifier for each row in a table, ensuring no duplicate records exist.</li>
                    <li><strong>Foreign Key:</strong> Creates a relationship between two tables, referencing the primary key of another table to maintain data consistency.</li>
                    <li><strong>Check Constraints:</strong> Restrict the values that can be entered into a column, enforcing specific data formats or ranges.</li>
                    <li><strong>NOT NULL Constraints:</strong> Prevent null values from being inserted into a column, ensuring data completeness.</li>
                  </ul>
                </>
              )}

              {renderCard(
                '2. Data Validation',
                <CheckCircle size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Data Types:</strong> Define the expected data format for each column (e.g., integer, string, date) to prevent invalid data entry.</li>
                    <li><strong>Triggers:</strong> Database procedures that automatically execute specific actions (e.g., data validation checks) before or after data manipulation operations (e.g., INSERT, UPDATE).</li>
                    <li><strong>Stored Procedures:</strong> Reusable code modules that encapsulate complex data manipulation logic, potentially including data validation steps.</li>
                  </ul>
                </>
              )}

              {renderCard(
                '3. Data Auditing',
                <ClipboardList size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Audit Trails:</strong> Track changes made to the database, recording who made the changes, what data was modified, and when the changes occurred. This helps identify potential data integrity violations.</li>
                    <li><strong>Views:</strong> Virtual representations of the database that can be used to restrict access to sensitive data or present pre-validated data to users, reducing the risk of accidental modifications.</li>
                  </ul>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 2: DATABASE SECURITY ANALYSIS TOOLS
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['tools'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="2">Database Security Analysis Tools</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Maintaining database security is crucial for protecting sensitive information. Here are some common database security analysis tools:
                  </p>
</div>

              {renderCard(
                'Security Analysis Tools',
                <SearchIcon size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>1. Vulnerability Scanners:</strong> These tools automatically scan databases for known security vulnerabilities in the database software, configuration settings, or schema design. They identify potential weaknesses that attackers might exploit to gain unauthorized access or manipulate data.</li>
                    <li><strong>2. Database Activity Monitoring (DAM) Tools:</strong> Continuously monitor user activity within the database, logging queries, accesses, and modifications. DAM tools can detect suspicious activity patterns that might indicate unauthorized access attempts or data breaches.</li>
                    <li><strong>3. Data Loss Prevention (DLP) Tools:</strong> Help prevent sensitive data from being leaked or exfiltrated from the database. DLP tools can monitor data movement, identify sensitive data types, and enforce rules to restrict unauthorized data transmission or copying.</li>
                    <li><strong>4. Security Information and Event Management (SIEM) Systems:</strong> Collect security-related events from various sources, including databases, firewalls, and intrusion detection systems. SIEM systems correlate these events to identify potential security threats and provide a holistic view of database security posture.</li>
                    <li><strong>5. Penetration Testing Tools:</strong> Simulate real-world attacker behavior to identify weaknesses in database security controls. Penetration testers attempt to exploit vulnerabilities and gain unauthorized access to the database, helping organizations identify and address security gaps before malicious actors can do so.</li>
                  </ul>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 3: IMPLEMENTING DATA INTEGRITY, AGGREGATION, AND INTERFERENCE
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['implementation'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="3">Implementing Data Integrity, Aggregation, and Interference in a Database</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Here's how you can implement the concepts of data integrity, data aggregation, and data interference in a database:
                  </p>
</div>

              {renderCard(
                '1. Data Integrity',
                <CheckCircle size={16} />,
                <>
                  <p><strong>Definition:</strong> Data integrity refers to the accuracy, consistency, and trustworthiness of data within a database. It ensures that the data is reliable and reflects reality accurately.</p>
                  <p><strong>Implementation:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Constraints:</strong>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Primary Key:</strong> Define a unique identifier (e.g., ID number) for each record in a table to prevent duplicate entries.</li>
                        <li><strong>Foreign Key:</strong> Establish relationships between tables by referencing the primary key of another table. This ensures consistency across linked data.</li>
                        <li><strong>Check Constraints:</strong> Specify valid data formats or ranges for columns (e.g., date format, value range for a price). This prevents invalid data entry.</li>
                        <li><strong>NOT NULL Constraints:</strong> Enforce data completeness by ensuring specific columns always have a value.</li>
                      </ul>
                    </li>
                    <li><strong>Data Validation:</strong>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Data Types:</strong> Set data types for each column (e.g., integer, string, date) to restrict invalid data entry.</li>
                        <li><strong>Triggers:</strong> Create database procedures that automatically validate data before insertion or update operations. Triggers can reject invalid data or perform corrective actions.</li>
                        <li><strong>Stored Procedures:</strong> Encapsulate complex data manipulation logic with built-in validation checks to ensure data integrity during operations.</li>
                      </ul>
                    </li>
                    <li><strong>Data Auditing:</strong>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Audit Trails:</strong> Track changes made to the database, including who, what, and when data was modified. This helps identify potential integrity violations.</li>
                        <li><strong>Views:</strong> Create virtual representations of the database that restrict access to sensitive data or present pre-validated data to users, reducing the risk of accidental modifications.</li>
                      </ul>
                    </li>
                  </ul>
                </>
              )}

              {renderCard(
                '2. Data Aggregation',
                <BarChart size={16} />,
                <>
                  <p><strong>Definition:</strong> Data aggregation involves combining data from various sources or tables within a database to create summaries or higher-level insights.</p>
                  <p><strong>Implementation:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Aggregate Functions:</strong> Utilize built-in database functions like SUM, COUNT, AVERAGE, MIN, and MAX to calculate summary statistics for groups of data.</li>
                    <li><strong>Group BY Clause:</strong> Combine aggregation functions with the GROUP BY clause to group data based on specific criteria and calculate aggregate values for each group.</li>
                    <li><strong>Data Warehouses and Cubes:</strong> Implement data warehouses or data cubes to store pre-aggregated data for efficient retrieval and analysis of large datasets.</li>
                  </ul>
                  <p><strong>Example:</strong></p>
                  <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto text-sm text-slate-800 dark:text-slate-200">
                    <code>
{`SELECT Country, SUM(SalesAmount) AS TotalSales 
FROM Orders 
GROUP BY Country 
ORDER BY TotalSales DESC;`}
                    </code>
                  </pre>
                  <p>This query aggregates sales data by country, calculating the total sales amount for each country and ordering them by total sales in descending order.</p>
                </>
              )}

              {renderCard(
                '3. Data Interference',
                <AlertTriangle size={16} />,
                <>
                  <p><strong>Definition:</strong> Data interference refers to the intentional or unintentional modification or manipulation of data, potentially compromising its integrity and trustworthiness.</p>
                  <p><strong>Implementation (for Defensive Purposes):</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>User Permissions:</strong> Implement user access controls to restrict unauthorized data modification. Grant users only the minimum permissions required for their tasks.</li>
                    <li><strong>Data Encryption:</strong> Encrypt sensitive data at rest and in transit to protect it from unauthorized access or modification.</li>
                    <li><strong>Data Backups:</strong> Maintain regular database backups to restore data to a known good state in case of accidental or malicious data manipulation.</li>
                    <li><strong>Intrusion Detection Systems (IDS):</strong> Deploy IDS systems to monitor database activity for suspicious patterns that might indicate data interference attempts.</li>
                  </ul>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 4: SECURITY MODELS
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['models'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="4">Security Models</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Security models are frameworks that define strategies for protecting information systems and data. They establish guidelines for access control, data confidentiality, integrity, and availability. Here's an examination of various security models, highlighting their advantages and disadvantages:
                  </p>
</div>

              {renderCard(
                '1. Mandatory Access Control (MAC) Models (Bell-LaPadula Model)',
                <Shield size={16} />,
                <>
                  <p><strong>Concept:</strong> Enforces a strict hierarchical classification of data (Top Secret, Secret, Confidential) and user clearances (Top Secret, Secret, Confidential). Users can only access data at their clearance level or below (need-to-know principle). Writing to a higher classification level is strictly prohibited.</p>
                  <p><strong>Advantages:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Strong data confidentiality: Protects sensitive information from unauthorized access.</li>
                    <li>Rigorous control: Reduces risk of accidental or intentional data breaches.</li>
                  </ul>
                  <p><strong>Disadvantages:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Inflexibility: Can be too rigid for dynamic environments where users might require temporary access to higher-level data.</li>
                    <li>Administrative overhead: Managing data classifications and user clearances can be complex.</li>
                  </ul>
                </>
              )}

              {renderCard(
                '2. Discretionary Access Control (DAC) Models',
                <User size={16} />,
                <>
                  <p><strong>Concept:</strong> Grants individual users or groups specific permissions to access, modify, or delete data objects (files, directories). Users are assigned permissions based on their roles and responsibilities.</p>
                  <p><strong>Advantages:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Flexibility: Allows for granular control over access permissions.</li>
                    <li>Simpler administration: Easier to manage compared to complex hierarchical structures.</li>
                  </ul>
                  <p><strong>Disadvantages:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Potential for human error: Misconfiguration of access permissions can lead to security vulnerabilities.</li>
                    <li>Weak against insider threats: Authorized users can misuse their privileges or accidentally expose data.</li>
                  </ul>
                </>
              )}

              {renderCard(
                '3. Role-Based Access Control (RBAC) Models',
                <Users size={16} />,
                <>
                  <p><strong>Concept:</strong> Defines user roles (e.g., administrator, editor, viewer) and assigns specific permissions to each role. Users are then assigned roles based on their job functions.</p>
                  <p><strong>Advantages:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Improves manageability: simplifies administration by managing permissions at the role level.</li>
                    <li>Enhances security: Reduces risk associated with individual user permission assignments.</li>
                  </ul>
                  <p><strong>Disadvantages:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Overhead for complex role definitions: Defining granular roles for various access needs can be time-consuming.</li>
                    <li>Limited flexibility for dynamic access requirements: Granting temporary access outside of predefined roles might be cumbersome.</li>
                  </ul>
                </>
              )}

              {renderCard(
                '4. Attribute-Based Access Control (ABAC) Models',
                <Target size={16} />,
                <>
                  <p><strong>Concept:</strong> Grants access based on dynamic attributes of users, resources (data), environment (time, location), and the operation being performed. Access decisions are made based on a combination of these attributes.</p>
                  <p><strong>Advantages:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Granular control: Provides the most fine-grained access control based on various attributes.</li>
                    <li>Adaptability: Can accommodate complex access requirements and dynamic environments.</li>
                  </ul>
                  <p><strong>Disadvantages:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Increased complexity: Defining and managing attribute-based access rules can be challenging.</li>
                    <li>Performance overhead: Evaluating multiple attributes for access decisions might impact system performance.</li>
                  </ul>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 5: CHALLENGES IN DATABASE SECURITY CONTROLS
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['challenges'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="5">Challenges in Database Security Controls</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Here are some of the key challenges in implementing and maintaining effective database security controls:
                  </p>
</div>

              {renderCard(
                'Key Challenges',
                <AlertTriangle size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Balancing Security with Usability:</strong> Enforcing strict security measures can sometimes hinder user productivity and slow down access to data. Striking a balance between robust security and user-friendly access is crucial.</li>
                    <li><strong>Complexity of Modern Databases:</strong> Modern databases often have intricate features and functionalities that can introduce new attack vectors. Keeping up with security best practices for these evolving technologies can be demanding.</li>
                    <li><strong>Insider Threats:</strong> Malicious insiders with authorized access can pose a significant threat. Traditional security controls might not be sufficient to detect and prevent intentional data breaches by authorized users.</li>
                    <li><strong>Evolving Cyber Threats:</strong> Cybercriminals are constantly developing new attack methods. Security controls need to be regularly reviewed and updated to stay ahead of these evolving threats.</li>
                    <li><strong>Data Sprawl and Cloud Adoption:</strong> With the rise of cloud computing and data distribution across various platforms, securing data across all its locations becomes more complex.</li>
                  </ul>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 6: DATA SECURITY TECHNIQUES
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['techniques'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="6">Data Security Techniques to Secure a Database</SectionTitle>

              {renderCard(
                'Security Techniques',
                <Lock size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Access Control:</strong> Implement a strong access control model (DAC, RBAC, ABAC) based on your needs. This ensures only authorized users can access specific data objects (tables, columns) with appropriate permissions (read, write, delete). Enforce the principle of least privilege. Grant users only the minimum level of access required for their job functions. Utilize multi-factor authentication (MFA) to add an extra layer of security for user logins. This requires additional verification beyond just a username and password.</li>
                    <li><strong>Data Encryption:</strong> Encrypt data at rest and in transit. This scrambles the data using encryption algorithms, making it unreadable without the decryption key. Consider using column-level encryption to protect specific sensitive data fields within a database table.</li>
                    <li><strong>Data Masking and Anonymization:</strong> Mask sensitive data (e.g., Social Security numbers) in production environments to minimize exposure if a breach occurs. Only authorized users should have access to the full data. For data analysis purposes, consider anonymizing data by removing personally identifiable information (PII). This allows for data analysis while protecting individual privacy.</li>
                    <li><strong>Database Activity Monitoring (DAM):</strong> Continuously monitor database activity to detect suspicious patterns that might indicate unauthorized access attempts or data breaches. Tools can analyze user queries, login attempts, and data modifications.</li>
                    <li><strong>Regular Security Audits and Patch Management:</strong> Conduct regular security audits to identify vulnerabilities in the database software, configuration settings, and access controls. Promptly apply security patches to the database software and underlying operating system to address known vulnerabilities.</li>
                    <li><strong>Data Backups and Disaster Recovery:</strong> Maintain regular backups of your database to a secure location. This allows you to restore data in case of accidental deletion, hardware failures, or ransomware attacks. Develop a comprehensive disaster recovery plan that outlines procedures for restoring your database in case of a major outage.</li>
                    <li><strong>User Education and Awareness:</strong> Educate users about database security best practices. This includes password hygiene, avoiding phishing attacks, and reporting suspicious activity. Train authorized personnel on proper data handling procedures and access control protocols.</li>
                  </ul>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 7: MODELS FOR PROTECTING NEW-GENERATION DATABASES
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['newgen'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="7">Models for Protecting New-Generation Database Systems</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Traditional security models like DAC (Discretionary Access Control) and RBAC (Role-Based Access Control) are still relevant, but new-generation databases introduce unique challenges. Here are some emerging models for protecting these systems:
                  </p>
</div>

              {renderCard(
                'Emerging Models',
                <Layers size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Attribute-Based Access Control (ABAC):</strong> ABAC offers fine-grained access control based on dynamic attributes of users, resources, environment, and the operation being performed. This granular approach becomes crucial for NoSQL databases and cloud-based deployments where traditional models might fall short.</li>
                    <li><strong>Multi-Factor Authentication (MFA) with Context Awareness:</strong> MFA adds an extra layer of security beyond passwords. New models consider contextual factors like location, device type, and time of day for authentication decisions. This can help detect suspicious login attempts even if valid credentials are used.</li>
                    <li><strong>Encryption in Transit and at Rest:</strong> Encryption remains paramount. New approaches explore homomorphic encryption, allowing computations on encrypted data without decryption. This enables secure data analysis while maintaining confidentiality.</li>
                    <li><strong>Continuous Data Activity Monitoring (CDAM):</strong> Traditional DAM focuses on user activity. CDAM goes beyond that, monitoring data itself for anomalies. This can detect unauthorized data modification attempts, even those originating from seemingly authorized users.</li>
                    <li><strong>Blockchain for Secure Data Provenance:</strong> Blockchain technology offers tamper-proof records of data changes. This can be particularly valuable for distributed databases and ensuring data integrity across multiple locations.</li>
                  </ul>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 8: DISASTER RECOVERY TECHNIQUES
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['disaster'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="8">Disaster Recovery Techniques for New-Generation Databases</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Disaster recovery (DR) plans are essential for ensuring data availability and minimizing downtime in case of failures. Here are some key considerations for DR in new-generation databases:
                  </p>
</div>

              {renderCard(
                'Disaster Recovery Techniques',
                <RefreshCw size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Backups and Replication:</strong> Implement automated, scheduled backups of your database to a secure, off-site location. Consider both full and incremental backups for optimal efficiency. Utilize data replication techniques to maintain copies of your database in a geographically separate location. This allows for quick failover in case of a disaster at the primary site.</li>
                    <li><strong>Cloud-based DR Solutions:</strong> Many cloud providers offer built-in DR functionalities for databases hosted on their platforms. These can simplify DR planning and management, offering automated failover and recovery processes.</li>
                    <li><strong>Automation and Orchestration:</strong> DR processes should be automated to the greatest extent possible. Orchestration tools can automate failover procedures, data restore, and application redirection in case of a disaster, minimizing downtime and human intervention.</li>
                    <li><strong>Testing and Validation:</strong> Regularly test your DR plan to ensure it functions as expected. Conduct failover simulations to identify and address any potential issues before a real disaster strikes.</li>
                    <li><strong>Security Considerations during DR:</strong> DR processes themselves can introduce security vulnerabilities. Ensure secure communication channels between the primary and secondary sites. Additionally, maintain robust access controls for any personnel involved in DR procedures.</li>
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">💡 Security Insight</h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <RefreshIcon size={16} className="text-indigo-500 dark:text-indigo-400" />
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
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">📊 Quick Stats</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex justify-between">
                  <span>Sections</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{SECTION_TABS.length}</span>
                </li>
                <li className="flex justify-between">
                  <span>Security Models</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Security Techniques</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>DR Techniques</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2 text-sm">📝 Remember</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Data integrity ensures accuracy and consistency through constraints, validation, and auditing. Security models (MAC, DAC, RBAC, ABAC) define access control. Modern challenges include balancing security with usability, insider threats, and evolving cyber threats. Effective techniques include encryption, monitoring, and regular patching. New-generation protection uses ABAC, contextual MFA, homomorphic encryption, and blockchain. Disaster recovery relies on backups, replication, automation, and testing.
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
                <strong className="text-white">Data Integrity Functions</strong> – Constraints (primary, foreign, check, NOT NULL), validation (data types, triggers, stored procedures), and auditing (audit trails, views) ensure accuracy and consistency.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Security Analysis Tools</strong> – Vulnerability scanners, DAM, DLP, SIEM, and penetration testing help identify and mitigate security risks.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Security Models</strong> – MAC (Bell-LaPadula), DAC, RBAC, and ABAC provide varying levels of access control, each with trade-offs between flexibility, complexity, and security.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Security Techniques &amp; New-Gen Protection</strong> – Access control, encryption, masking, monitoring, patching, and backups are essential. Emerging models include ABAC, contextual MFA, homomorphic encryption, CDAM, and blockchain for provenance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Disaster Recovery</strong> – Backups, replication, cloud-based DR, automation, testing, and security considerations ensure business continuity and data availability after failures.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Footer Branding ────────────────────────────────────────────── */}
      <footer className="mx-auto px-[5px] sm:px-6 md:px-8 pb-8 text-center opacity-30">
        <div className="inline-flex items-center gap-2">
          <BookOpenIcon size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">
            Sidemann Academic Registry • Database Security, Integrity &amp; Disaster Recovery Mastery 4.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;