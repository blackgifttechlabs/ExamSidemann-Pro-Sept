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
  ThumbsUp,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'schemas', label: 'Schemas' },
  { id: 'architecture', label: '3-Tier Architecture' },
  { id: 'file-org', label: 'File Organisation' },
  { id: 'storage', label: 'Storage & Retrieval' },
  { id: 'abstraction', label: 'Data Abstraction' },
  { id: 'levels', label: 'Abstraction Levels' },
  { id: 'advantages', label: 'Advantages' },
  { id: 'adts', label: 'ADTs' },
  { id: 'dblc', label: 'Database Lifecycle' },
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

  // Random tip on mount (database‑related)
  useEffect(() => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The three-schema architecture (external, conceptual, internal) was proposed by the ANSI/SPARC committee in the 1970s and remains a foundational concept in database design.',
      },
      {
        title: 'Pro Tip',
        text: 'Always design your conceptual schema independently of physical storage to achieve data independence and simplify future migrations.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three levels of data abstraction as "Views" (external), "Tables" (conceptual), and "Files" (internal) – each hides the details of the level below.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people confuse data abstraction with data hiding. Abstraction focuses on what, hiding on how; both are important but distinct concepts.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The three-schema architecture (external, conceptual, internal) was proposed by the ANSI/SPARC committee in the 1970s and remains a foundational concept in database design.',
      },
      {
        title: 'Pro Tip',
        text: 'Always design your conceptual schema independently of physical storage to achieve data independence and simplify future migrations.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three levels of data abstraction as "Views" (external), "Tables" (conceptual), and "Files" (internal) – each hides the details of the level below.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people confuse data abstraction with data hiding. Abstraction focuses on what, hiding on how; both are important but distinct concepts.',
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FileText size={14} className="inline mr-1" /> DATABASES &amp; DBMS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Database Schemas, Architecture &amp;{' '}
            <span className="text-purple-300 font-bold italic">
              Data Abstraction
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to external, conceptual, internal schemas, 3-tier architecture, file organization, data abstraction, ADTs, and the database lifecycle.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">📚 {SECTION_TABS.length} sections</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Layout size={14} className="inline mr-1" /> Schemas
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Layers size={14} className="inline mr-1" /> Architecture
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Eye size={14} className="inline mr-1" /> Abstraction
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
                SECTION 1: SCHEMAS
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['schemas'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="1">Schemas in Database Systems: External Schema, Conceptual Schema, and Internal Schema</SectionTitle>

              {renderCard(
                '1. External Schema (View)',
                <Eye size={16} />,
                <>
                  <p><strong>Definition:</strong> An external schema, also known as a view, is a virtual representation of a database tailored for a specific user group or application. Imagine it as a customized window into the database, showcasing only the data relevant to that particular user or application.</p>
                  <p><strong>Benefits:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Data Security:</strong> External schemas restrict user access to sensitive data by only exposing relevant portions of the database.</li>
                    <li><strong>Data Privacy:</strong> Users only see the data they need, protecting confidential information from unauthorized viewing.</li>
                    <li><strong>Simplicity:</strong> External schemas present a simplified view, hiding the complexities of the underlying database structure from users who don't need that level of detail.</li>
                  </ul>
                  <p><strong>Drawbacks:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Limited Functionality:</strong> Users are restricted to the data and operations permitted within their view.</li>
                    <li><strong>Maintenance Overhead:</strong> Creating and maintaining multiple external schemas can add complexity to database administration.</li>
                  </ul>
                </>
              )}

              {renderCard(
                '2. Conceptual Schema',
                <Layout size={16} />,
                <>
                  <p><strong>Definition:</strong> The conceptual schema acts as a blueprint for the entire database, defining the overall logical structure and relationships between data elements. It represents the data as it's understood by the business, independent of any specific physical storage mechanisms. Think of it as a high-level map of the database, outlining the entities (e.g., customers, products), their attributes (e.g., customer name, product price), and the relationships between them.</p>
                  <p><strong>Benefits:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Data Standardization:</strong> The conceptual schema ensures consistency in how data is defined and understood across the organization.</li>
                    <li><strong>Improved Communication:</strong> Provides a common reference point for database designers, developers, and business stakeholders to discuss data requirements.</li>
                    <li><strong>Flexibility:</strong> The conceptual schema is independent of physical storage, allowing for changes to the underlying database system without impacting the overall data model.</li>
                  </ul>
                  <p><strong>Drawbacks:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Abstraction:</strong> The conceptual schema may not reflect the specific details of physical storage, requiring additional steps to translate it into a physical database design.</li>
                  </ul>
                </>
              )}

              {renderCard(
                '3. Internal Schema (Physical Schema)',
                <HardDrive size={16} />,
                <>
                  <p><strong>Definition:</strong> The internal schema, also known as the physical schema, describes how data is physically stored and organized on the storage devices (disks, etc.). It details the specific storage structures, data types, access methods, and indexing mechanisms used to optimize data retrieval. Imagine it as the detailed blueprint of the database's physical layout on the hardware.</p>
                  <p><strong>Benefits:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Performance Optimization:</strong> The internal schema allows for physical data organization to optimize query performance and data access efficiency.</li>
                    <li><strong>Hardware Specificity:</strong> It takes into account the capabilities and limitations of the underlying storage hardware.</li>
                  </ul>
                  <p><strong>Drawbacks:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Complexity:</strong> Managing the internal schema requires a deep understanding of storage technologies and database management systems.</li>
                    <li><strong>Limited Portability:</strong> Changes to the internal schema may necessitate modifications to applications that interact with the database.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Evaluation',
                <ListChecks size={16} />,
                <>
                  <p>These three schemas work together to provide a layered approach to database management:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>External Schema:</strong> Provides user-specific views.</li>
                    <li><strong>Conceptual Schema:</strong> Defines the overall data model.</li>
                    <li><strong>Internal Schema:</strong> Dictates the physical storage structure.</li>
                  </ul>
                  <p>This layered approach offers benefits in terms of data security, user experience, data integrity, and performance optimization. Choosing the right level of detail for each schema is crucial for a well-designed and efficient database system.</p>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 2: 3-TIER ARCHITECTURE
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['architecture'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="2">3-Tier Architecture</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The 3-tier architecture is a software design pattern commonly used in database applications. It separates the application into three distinct logical tiers:
                  </p>
</div>

              {renderCard(
                '1. Presentation Tier',
                <MonitorIcon size={16} />,
                <>
                  <p>Also known as the UI (User Interface) tier, this layer interacts directly with the user. It presents information, gathers user input, and displays the results of user actions. This tier typically consists of user interfaces like web pages, mobile apps, or desktop applications.</p>
                </>
              )}

              {renderCard(
                '2. Application Tier (Business Logic)',
                <Settings size={16} />,
                <>
                  <p>This layer acts as the intermediary between the presentation tier and the data tier. It handles the core application logic, business rules, and processing of user requests. The application tier receives user input from the presentation tier, performs necessary operations on the data using the data tier, and prepares the results to be displayed back to the user. This layer may also involve validation of user input, security checks, and managing application flow.</p>
                </>
              )}

              {renderCard(
                '3. Data Tier',
                <Database size={16} />,
                <>
                  <p>This layer interacts with the database and manages the storage, retrieval, and manipulation of data. It houses the actual database management system (DBMS) and the database itself. The data tier receives requests from the application tier, executes queries on the database, and returns the requested information or performs data modifications as instructed.</p>
                </>
              )}

              {renderCard(
                'Benefits of 3-Tier Architecture',
                <ThumbsUp size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Improved Maintainability:</strong> Separating the concerns of presentation, business logic, and data storage makes the application easier to maintain and modify. Changes to one tier can be made without affecting the others.</li>
                    <li><strong>Scalability:</strong> Each tier can be scaled independently based on its specific needs. For instance, you can scale up the presentation tier to handle more users or the data tier to accommodate a growing data volume.</li>
                    <li><strong>Security:</strong> The data tier can be secured and access-controlled, restricting unauthorized users from directly interacting with the database.</li>
                    <li><strong>Reusability:</strong> Business logic components in the application tier can potentially be reused across different applications that access the same data.</li>
                  </ul>
                  <p className="mt-2">Here's an analogy to understand the 3-tier architecture: Imagine a restaurant. The menu (presentation tier) displays the available dishes to the customer (user). The waiter (application tier) receives the customer's order, relays it to the kitchen (data tier), and brings back the prepared food (processed data) to the customer. The kitchen handles the actual food preparation (data manipulation), while the waiter manages the interaction and flow of information.</p>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 3: FILE ORGANISATION AND ACCESS METHODS
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['file-org'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="3">File Organisation and Access Methods</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Traditional database systems don't directly use file organization methods as they typically store data in a structured format within the database itself. However, the underlying storage mechanisms might employ file organization techniques to optimize data access and storage efficiency. Here's a breakdown of relevant file organization methods and access methods in the context of databases:
                  </p>
</div>

              {renderCard(
                'File Organization Methods',
                <Folder size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Sequential File Organization:</strong> Data records are stored in a linear sequence, one after another, on the storage device. This method is simple to implement but accessing specific records requires scanning through the entire file sequentially until the desired record is found. Imagine a phone book organized alphabetically - finding a specific name requires flipping through pages sequentially. This method is suitable for situations where data is typically processed or accessed in the order it's stored.</li>
                    <li><strong>Indexed Sequential File Organization (ISAM):</strong> Similar to sequential files, data records are stored sequentially, but an index is created to facilitate faster retrieval of specific records. The index acts like a table of contents, mapping record keys (unique identifiers) to their physical locations within the file. This allows for faster access to specific records by using the index to locate their position in the file and then performing a targeted seek operation.</li>
                    <li><strong>Direct File Organization:</strong> Also known as hashed files, data records are stored based on a hash function that calculates a unique address (hash value) for each record. This hash value is then used to directly access the record's location on the storage device. Imagine a large library with books categorized using a Dewey Decimal System. Each book has a unique code that directly points to its location on the shelf. This method offers fast retrieval of specific records using their key values, but inserting or deleting records can be complex and may require file reorganization.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Access Methods',
                <SearchIcon size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Sequential Access:</strong> Data is accessed one record at a time, starting from the beginning of the file and proceeding sequentially until the desired record is found or the end of the file is reached. This method is suitable for processing entire datasets or when the order of data access is important.</li>
                    <li><strong>Random Access (Direct Access):</strong> Any record can be accessed directly by its physical location or key value without needing to scan through preceding records. This method is efficient for retrieving specific records by their unique identifiers. Database systems typically use indexing techniques like B-Trees to enable efficient random access.</li>
                    <li><strong>Indexed Access:</strong> An index structure is used to map record keys to their physical locations. This allows for faster retrieval of specific records by searching the index for the key value and then locating the corresponding record's address within the file.</li>
                  </ul>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 4: DATA STORAGE AND RETRIEVAL
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['storage'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="4">Data Storage and Retrieval</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Data storage and retrieval come in two main flavors: local and cloud-based. Each offers distinct advantages and disadvantages depending on your specific needs. Here's a breakdown to help you decide which solution is best for you:
                  </p>
</div>

              {renderCard(
                'Local Storage',
                <Home size={16} />,
                <>
                  <p><strong>Data Location:</strong> Data is physically stored on your own hardware (hard drives, SSDs) or on a local server within your organization's network.</p>
                  <p><strong>Advantages:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Direct Control:</strong> You have complete control over the hardware and software used for data storage and have full responsibility for security and maintenance.</li>
                    <li><strong>Performance:</strong> Local storage can offer faster data access times, especially for frequently used data, as there's no network latency involved.</li>
                    <li><strong>Security:</strong> Data physically resides on-site, potentially offering a higher degree of perceived security for sensitive information.</li>
                  </ul>
                  <p><strong>Disadvantages:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Scalability:</strong> Scaling storage capacity can be cumbersome and expensive, requiring purchasing additional hardware as data volume grows.</li>
                    <li><strong>Maintenance:</strong> You are responsible for hardware maintenance, software updates, and ensuring data backups for disaster recovery.</li>
                    <li><strong>Accessibility:</strong> Data is typically only accessible from within your local network, limiting remote access capabilities.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Cloud-Based Storage',
                <Cloud size={16} />,
                <>
                  <p><strong>Data Location:</strong> Data is stored on remote servers managed by a cloud service provider (CSP) like Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP).</p>
                  <p><strong>Advantages:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Scalability:</strong> Cloud storage offers virtually unlimited scalability. You can easily increase or decrease storage capacity on-demand, paying only for the resources you use.</li>
                    <li><strong>Cost-Effectiveness:</strong> Cloud storage can be more cost-effective in the long run, eliminating upfront hardware costs and reducing maintenance expenses.</li>
                    <li><strong>Accessibility:</strong> Data is accessible from anywhere with an internet connection, facilitating remote work and collaboration.</li>
                    <li><strong>Disaster Recovery:</strong> Cloud providers typically offer robust backup and disaster recovery solutions to ensure data availability even in case of hardware failures.</li>
                  </ul>
                  <p><strong>Disadvantages:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Security:</strong> Data resides on a third-party server, raising security concerns for sensitive information. Choosing a reputable cloud provider with robust security measures is crucial.</li>
                    <li><strong>Performance:</strong> Data access times can be influenced by internet speed and network latency, potentially impacting performance compared to local storage for some applications.</li>
                    <li><strong>Vendor Lock-In:</strong> Migrating away from a specific cloud provider's platform can be complex, potentially leading to vendor lock-in.</li>
                  </ul>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 5: DATA ABSTRACTION
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['abstraction'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="5">Data Abstraction</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Data abstraction is a fundamental concept in database systems that focuses on hiding the internal complexities of data storage and manipulation from users and applications. It acts like a veil, shielding users from the nitty-gritty details of how data is physically organized and managed within the database.
                  </p>
</div>

              {renderCard(
                'Core Idea',
                <Lightbulb size={16} />,
                <>
                  <p>Imagine a library. The library stores a vast amount of information (books) in a specific way (organized by Dewey Decimal System or alphabetically by author). Librarians understand this internal organization system, but patrons typically don't need to know those details. They simply search the library catalog (an abstraction layer) to find the books they're interested in and retrieve them. Data abstraction in databases works similarly.</p>
                </>
              )}

              {renderCard(
                'Benefits',
                <ThumbsUp size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Simplified User Interaction:</strong> Users don't need to be familiar with the underlying storage structures or query languages. They can interact with the data through a user-friendly interface or a higher-level query language, focusing on what information they need rather than how it's stored.</li>
                    <li><strong>Improved Data Independence:</strong> Changes to the internal storage structure of the database can be made without affecting applications or users who interact with the data through the abstraction layer. As long as the external interface remains consistent, users and applications won't be impacted.</li>
                    <li><strong>Enhanced Security:</strong> Data abstraction can help protect sensitive data by restricting access to the raw data itself. Users can only access and manipulate data through authorized channels, potentially improving data security.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Examples of Data Abstraction',
                <Code size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Database Management Systems (DBMS):</strong> A DBMS acts as a layer of abstraction between users and the actual data storage. Users interact with the database through a query language (like SQL) without needing to know how the data is physically stored on the disk. The DBMS translates the user's queries into instructions that the storage system can understand and retrieves the requested data.</li>
                    <li><strong>Views:</strong> Views are virtual representations of database tables. They provide a customized view of the data, potentially hiding or combining data from multiple tables, and simplifying data access for specific users or applications. Users can interact with the view as if it were a real table, unaware of the underlying structure.</li>
                    <li><strong>Object-Relational Mapping (ORM):</strong> ORMs are programming tools that act as an abstraction layer between programming languages and relational databases. They map objects in a program to tables and columns in the database, allowing developers to work with data using familiar object-oriented concepts without needing to write complex SQL queries directly.</li>
                  </ul>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 6: THE 3 LEVELS OF DATA ABSTRACTION
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['levels'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="6">The 3 Levels of Data Abstraction</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Data abstraction in database systems is a crucial concept that separates the logical view of data from its physical storage details. It provides a layered approach, offering different levels of detail for users and applications depending on their needs. Here's an in-depth exploration of the three key levels of data abstraction:
                  </p>
</div>

              {renderCard(
                '1. External Level (View Level)',
                <Eye size={16} />,
                <>
                  <p><strong>Description:</strong> The external level, also known as the view level, offers the most user-friendly and customized perspective of the data. It caters to the specific needs of individual users, groups, or applications. Imagine it as a tailored window into the database, showcasing only the relevant data elements and relationships for a particular user or application.</p>
                  <p><strong>Implementation:</strong> External views are virtual representations created from underlying database tables or other views. They can involve filtering, aggregation (e.g., sum, average), or joining data from multiple tables to present a specific subset or transformed version of the data. Database systems or specialized view management tools can create and manage these views.</p>
                  <p><strong>Benefits:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Simplified Data Access:</strong> Users only see the data they need, presented in a way that aligns with their tasks or roles. This reduces complexity and improves usability.</li>
                    <li><strong>Data Security:</strong> Views can restrict access to sensitive data by excluding confidential information from the user's view.</li>
                    <li><strong>Data Privacy:</strong> Users only see the data relevant to their work, protecting privacy by hiding unnecessary data elements.</li>
                  </ul>
                  <p><strong>Drawbacks:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Limited Functionality:</strong> Users are restricted to the data and operations permitted within their view, potentially hindering flexibility for complex queries.</li>
                    <li><strong>Maintenance Overhead:</strong> Creating and maintaining multiple views can add complexity to database administration.</li>
                  </ul>
                </>
              )}

              {renderCard(
                '2. Conceptual Level (Logical Level)',
                <Layout size={16} />,
                <>
                  <p><strong>Description:</strong> The conceptual level, also known as the logical level, provides a high-level, business-oriented view of the entire database structure. It defines the overall data model, outlining the entities (e.g., customers, products), their attributes (e.g., customer name, product price), and the relationships between them. Think of it as a blueprint that captures the data as it's understood by the business, independent of any specific storage mechanisms.</p>
                  <p><strong>Implementation:</strong> The conceptual level is typically documented using Entity-Relationship Diagrams (ERDs) that visually represent the entities, attributes, and relationships. Data dictionaries can also be used to provide detailed definitions of data elements and their constraints.</p>
                  <p><strong>Benefits:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Data Standardization:</strong> The conceptual schema ensures consistency in how data is defined and understood across the organization. Everyone speaks the same "data language."</li>
                    <li><strong>Improved Communication:</strong> Provides a common reference point for database designers, developers, and business stakeholders to discuss data requirements.</li>
                    <li><strong>Flexibility:</strong> The conceptual schema is independent of physical storage, allowing for changes to the underlying database system without impacting the overall data model.</li>
                  </ul>
                  <p><strong>Drawbacks:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Abstraction:</strong> The conceptual schema may not reflect the specific details of physical storage, requiring additional steps to translate it into a physical database design.</li>
                  </ul>
                </>
              )}

              {renderCard(
                '3. Internal Level (Physical Level)',
                <HardDrive size={16} />,
                <>
                  <p><strong>Description:</strong> The internal level, also known as the physical level, delves into the nitty-gritty details of how data is physically stored and organized on the storage devices (disks, etc.). It focuses on the specific storage structures, data types, access methods, and indexing mechanisms used to optimize data retrieval. Imagine it as the detailed blueprint of the database's physical layout on the hardware.</p>
                  <p><strong>Implementation:</strong> The internal level is heavily influenced by the chosen Database Management System (DBMS) and the underlying storage hardware. Storage structures like file organization methods (e.g., sequential, indexed), data types (e.g., integer, string, date), and indexing techniques (e.g., B-Trees) are all part of the internal schema.</p>
                  <p><strong>Benefits:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Performance Optimization:</strong> The internal schema allows for physical data organization to optimize query performance and data access efficiency. Data structures and indexing techniques are chosen to facilitate fast retrieval of specific data based on query patterns.</li>
                    <li><strong>Hardware Specificity:</strong> It takes into account the capabilities and limitations of the underlying storage hardware, ensuring efficient data storage and retrieval based on the hardware's strengths and weaknesses.</li>
                  </ul>
                  <p><strong>Drawbacks:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Complexity:</strong> Managing the internal schema requires a deep understanding of storage technologies and database management systems. Changes to the internal schema can be complex and may necessitate adjustments to applications that interact with the database.</li>
                    <li><strong>Limited Portability:</strong> Changes to the internal schema may necessitate modifications to applications that interact with the database, potentially reducing portability if the database is migrated to a different system.</li>
                  </ul>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 7: ADVANTAGES OF DATA ABSTRACTION
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['advantages'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="7">Advantages of Data Abstraction</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Data abstraction offers several significant advantages within a Database Management System (DBMS). Here's a breakdown of the key benefits:
                  </p>
</div>

              {renderCard(
                'Key Advantages',
                <ThumbsUp size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>1. Simplified User Interaction:</strong> Users with varying levels of technical expertise can interact with the database effectively. Data abstraction shields users from the complexities of the underlying storage structures and query languages. They can focus on what information they need (e.g., retrieve customer details, calculate total sales) rather than how the data is physically stored and accessed. <br/><em>Example:</em> A marketing team member can use a user-friendly interface or a reporting tool to access customer data for a campaign, unaware of the complex table structures and SQL queries happening behind the scenes.</li>
                    <li><strong>2. Improved Data Independence:</strong> Changes to the internal structure of the database (storage mechanisms, data types) can be made without impacting applications or users who interact with the data through the abstraction layer. As long as the external interfaces (views, query languages) remain consistent, users and applications won't be affected. <br/><em>Example:</em> The database administrator can migrate the database from one storage technology to another (e.g., from hard drives to solid-state drives) without needing to modify applications that access the data through views or a higher-level query language.</li>
                    <li><strong>3. Enhanced Security:</strong> Data abstraction helps protect sensitive data by restricting access to the raw data itself. Users can only access and manipulate data through authorized channels defined within the abstraction layer. This can involve views that exclude confidential information or permission-based access control mechanisms. <br/><em>Example:</em> Customer service representatives may only be granted access to view a customer's name, contact information, and order history through a specific view, while financial data like credit card details might be restricted to authorized personnel with a higher level of access.</li>
                    <li><strong>4. Increased Maintainability:</strong> By separating the logical view of data from its physical storage, data abstraction simplifies database maintenance. Changes to the underlying storage mechanisms can be implemented without needing to modify application code or user interfaces that interact with the data through the abstraction layer. <br/><em>Example:</em> Adding a new data field to a database table can be done at the logical level (conceptual schema) without affecting existing queries or applications that utilize views or a higher-level query language to access the data.</li>
                    <li><strong>5. Flexibility and Reusability:</strong> Data abstraction allows for the creation of customized views tailored to specific user needs or applications. These views can be easily modified or deleted without impacting the underlying data structure. Additionally, business logic encapsulated within the abstraction layer (e.g., data validation rules) can potentially be reused across different applications that access the same data. <br/><em>Example:</em> A sales department view might focus on customer contact information and order history, while a finance department view might prioritize financial data and transaction details. Both views can be built upon the same underlying data structure but cater to specific departmental needs.</li>
                  </ul>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 8: ABSTRACT DATA TYPES
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['adts'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="8">Abstract Data Types</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In computer science, an abstract data type (ADT) is a fundamental concept that focuses on the what rather than the how of data. It acts as a blueprint or a contract that defines the data type's behavior and the operations that can be performed on it, without revealing the specific implementation details of how the data is actually stored or manipulated in memory.
                  </p>
</div>

              {renderCard(
                'Core Idea',
                <Lightbulb size={16} />,
                <>
                  <p>Imagine a toolbox. The toolbox doesn't tell you how the tools are physically made (metal, plastic, etc.), but it tells you what tools are there (hammer, screwdriver, etc.) and what their functionalities are (hammering nails, tightening screws). Similarly, an ADT specifies the data type (like a hammer) and the operations that can be performed on that data (like hammering), without going into the details of how the hammer itself is built.</p>
                </>
              )}

              {renderCard(
                'Benefits of ADTs',
                <ThumbsUp size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Improved Code Reusability:</strong> ADTs promote code reusability by encapsulating data and operations within a single unit. Programmers can develop code that works with different implementations of the same ADT, as long as they adhere to the defined behavior and operations.</li>
                    <li><strong>Enhanced Code Maintainability:</strong> Changes to the underlying implementation of an ADT can be made without affecting code that interacts with the ADT through its defined interface. This improves code maintainability and reduces the risk of errors.</li>
                    <li><strong>Increased Program Clarity:</strong> By focusing on the behavior of the data type, ADTs make code easier to understand and reason about. Programmers can concentrate on the logic of their program without getting bogged down in the implementation details of data structures.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Components of an ADT',
                <ListChecks size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Data Values:</strong> The set of possible values that the data type can hold. For example, an integer ADT can hold whole numbers, while a string ADT can hold sequences of characters.</li>
                    <li><strong>Operations:</strong> A set of operations that can be performed on the data type. These operations define how the data can be manipulated and accessed. Examples include adding two integers, searching for a specific character in a string, or inserting an element into a list.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Examples of ADTs',
                <Layers size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>List:</strong> An ADT that represents a linear sequence of elements, where elements can be added, removed, or accessed by their position (index).</li>
                    <li><strong>Stack:</strong> An ADT that follows a Last-In-First-Out (LIFO) principle. Elements are added (pushed) to the top of the stack and removed (popped) from the top.</li>
                    <li><strong>Queue:</strong> An ADT that follows a First-In-First-Out (FIFO) principle. Elements are added (enqueued) to the back of the queue and removed (dequeued) from the front.</li>
                    <li><strong>Set:</strong> An ADT that represents a collection of unique elements. Elements can be added (inserted) or checked for membership (contains).</li>
                    <li><strong>Map (or Dictionary):</strong> An ADT that represents a collection of key-value pairs. Values can be associated with unique keys, allowing for efficient retrieval based on the key.</li>
                  </ul>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 9: THE DATABASE LIFECYCLE (DBLC)
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['dblc'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="9">The Database Lifecycle (DBLC)</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    It outlines the different stages a database goes through, from its initial conception to its eventual retirement. Here's a breakdown of the typical stages involved:
                  </p>
</div>

              {renderCard(
                '1. Database Planning and Analysis (Requirement Gathering)',
                <Target size={16} />,
                <>
                  <p>This initial stage focuses on understanding the business needs and requirements for the database. It involves:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Identifying the data that needs to be stored and managed.</li>
                    <li>Defining the users who will access the data and their access needs.</li>
                    <li>Determining the functionalities and performance requirements of the database system.</li>
                    <li>Analyzing existing systems and data sources (if applicable) for integration.</li>
                  </ul>
                </>
              )}

              {renderCard(
                '2. Database Design',
                <Layout size={16} />,
                <>
                  <p>Based on the gathered requirements, this stage involves designing the logical and physical structure of the database. Key activities include:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Conceptual Design:</strong> Developing an Entity-Relationship Diagram (ERD) that represents the entities (data objects), their attributes (data elements), and the relationships between them.</li>
                    <li><strong>Logical Design:</strong> Translating the ERD into a detailed logical schema using a specific data model (e.g., relational model). This defines tables, columns, data types, constraints (primary keys, foreign keys), and relationships between tables.</li>
                    <li><strong>Physical Design:</strong> Choosing the physical storage structures and access methods to optimize data storage and retrieval based on the underlying hardware and anticipated access patterns.</li>
                  </ul>
                </>
              )}

              {renderCard(
                '3. Database Implementation',
                <Server size={16} />,
                <>
                  <p>This stage involves creating the database based on the chosen design. It includes:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Creating the database objects (tables, columns, indexes) within a chosen Database Management System (DBMS).</li>
                    <li>Populating the database with initial data (seeding or importing data).</li>
                    <li>Implementing security measures (user accounts, access control) to protect the data.</li>
                    <li>Testing the database to ensure it functions as designed, meets performance requirements, and data integrity is maintained.</li>
                  </ul>
                </>
              )}

              {renderCard(
                '4. Database Operation and Maintenance',
                <RefreshCw size={16} />,
                <>
                  <p>This ongoing stage focuses on the day-to-day use and upkeep of the database. It involves:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Managing user access and permissions.</li>
                    <li>Performing backups and disaster recovery planning to ensure data availability in case of failures.</li>
                    <li>Monitoring database performance and resource utilization.</li>
                    <li>Applying security patches and updates to the DBMS software.</li>
                    <li>Tuning the database for optimal performance as data volume and access patterns evolve.</li>
                  </ul>
                </>
              )}

              {renderCard(
                '5. Database Evolution and Retirement',
                <Clock size={16} />,
                <>
                  <p>Over time, the database may need to adapt to changing business needs. This stage involves:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Modifying the database schema to accommodate new data requirements or changes in existing data.</li>
                    <li>Migrating the database to a different DBMS platform if necessary.</li>
                    <li>Archiving or purging historical data that is no longer actively used.</li>
                    <li>Eventually, when the database is no longer required, securely decommissioning and deleting the data in accordance with data governance policies.</li>
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
                <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">💡 Database Insight</h3>
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
                  <span>Schema Levels</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Abstraction Levels</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>DBLC Stages</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2 text-sm">📝 Remember</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Database schemas (external, conceptual, internal) define data views, logical structure, and physical storage. The 3-tier architecture separates presentation, business logic, and data. File organization methods (sequential, indexed, direct) and access methods (sequential, random, indexed) optimize data retrieval. Data abstraction simplifies user interaction, enhances security, and provides data independence. Abstract Data Types (ADTs) encapsulate data and operations. The Database Lifecycle (DBLC) guides planning, design, implementation, operation, and evolution of databases.
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
                <strong className="text-white">Database Schemas</strong> – External (user views), Conceptual (logical structure), Internal (physical storage) provide layered data management, enhancing security, flexibility, and performance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">3-Tier Architecture</strong> – Presentation (UI), Application (business logic), Data (DBMS) tiers separate concerns, improving maintainability, scalability, security, and reusability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">File Organisation &amp; Access</strong> – Sequential, indexed sequential, and direct file organization, along with sequential, random, and indexed access methods, optimize storage and retrieval efficiency.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Data Abstraction &amp; ADTs</strong> – Hides implementation details, provides data independence, and simplifies interaction. ADTs encapsulate data and operations, promoting reusability and maintainability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Database Lifecycle (DBLC)</strong> – Stages include Planning, Design, Implementation, Operation/Maintenance, and Evolution/Retirement, guiding the database from conception to decommissioning.
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
            Sidemann Academic Registry • Database Schemas, Architecture &amp; Data Abstraction Mastery 3.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;