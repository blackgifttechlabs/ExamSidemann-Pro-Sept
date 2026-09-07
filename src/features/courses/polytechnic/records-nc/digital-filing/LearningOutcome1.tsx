import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Shield,
  TrendingUp,
  HardDriveIcon,
  UsersIcon,
  SearchIcon,
  ClipboardList,
  FileTextIcon,
  Database,
  Mail,
  Banknote,
  Scale,
  Film,
  FileEditIcon,
  LockIcon,
  TrashIcon,
  SettingsIcon,
  ListChecks,
  CalendarIcon,
  LayersIcon,
  AlertCircle,
  Minus,
  BookOpen,
  LinkIcon,
  Target,
  CheckCircleIcon,
  GraduationCap,
  Cloud,
  TagIcon,
  GridIcon,
  Megaphone,
  CpuIcon,
  ImageIcon,
  Printer,
  MonitorIcon,
  RefreshCwIcon,
  ClockIcon,
  Send,
  ServerIcon,
  KeyIcon,
  ShieldAlert,
  FileText,
  Archive,
  Trash2,
  ClipboardList as ClipboardListIcon,
  BookOpen as BookOpenIcon,
  Calendar,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  Clock,
  Hash,
  CheckCircle,
  RefreshCw as RefreshCwIcon2,
  Sun,
  Thermometer,
  Sofa as Chair,
  Volume2,
  Plug,
  AlertCircle as AlertCircleIcon,
  CheckCircle as CheckCircleIcon2,
  FolderPlus,
  FolderMinus,
  Tag,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'formats', label: 'Records Formats' },
  { id: 'duties', label: 'Filing Room Duties' },
  { id: 'file-name', label: 'File Naming' },
  { id: 'indexing', label: 'Indexing' },
  { id: 'series', label: 'File Series' },
  { id: 'electronic', label: 'Electronic Records' },
  { id: 'procedures', label: 'Organisational Procedures' },
  { id: 'retrieval', label: 'Retrieval Factors' },
  { id: 'references', label: 'File References' },
  { id: 'types', label: 'File Types' },
  { id: 'labelling', label: 'Labelling' },
  { id: 'registration', label: 'Registration' },
  { id: 'vital', label: 'Vital Records' },
  { id: 'vital-procedures', label: 'Vital Procedures' },
  { id: 'classified', label: 'Classified Docs' },
  { id: 'security', label: 'Information Security' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome1: React.FC = () => {
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
        text: 'The ISO 15489 standard provides international best practices for records management, including file organisation and retention.',
      },
      {
        title: 'Pro Tip',
        text: 'Use consistent file naming conventions – include date, version, and descriptive keywords to make files easily searchable.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three pillars of information security with "C-I-A": Confidentiality, Integrity, Availability.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations neglect to back up vital records regularly. Implement automated backups and offsite storage to ensure business continuity.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The ISO 15489 standard provides international best practices for records management, including file organisation and retention.',
      },
      {
        title: 'Pro Tip',
        text: 'Use consistent file naming conventions – include date, version, and descriptive keywords to make files easily searchable.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three pillars of information security with "C-I-A": Confidentiality, Integrity, Availability.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations neglect to back up vital records regularly. Implement automated backups and offsite storage to ensure business continuity.',
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
        <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
          {icon} {title}
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          {typeof content === 'string' ? <p>{content}</p> : content}
        </div>
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            File Management —{' '}
            <span className="text-emerald-300 font-bold italic">
              Organization, Security &amp; Retrieval
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to file management benefits, record formats, filing duties, file naming, indexing, vital records, security, and information protection.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FolderTree size={14} className="inline mr-1" /> File
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Security
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <SearchIcon size={14} className="inline mr-1" /> Retrieval
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
                placeholder="Search for a concept, format, procedure..."
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
          {/* List of sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* SECTION 1: File Management Overview */}
            <div
              ref={(el) => {
                sectionRefs.current['overview'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                File Management
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    File management is the organized and efficient handling of digital files, encompassing tasks like naming, storing, organizing, and backing up data. It is a fundamental practice for individuals and organizations alike, ensuring that information is accessible, secure, and easily managed.
                  </p>
</div>
            </div>

            {/* SECTION 2: Benefits of File Management */}
            <div
              ref={(el) => {
                sectionRefs.current['benefits'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Benefits of File Management
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Enhanced Productivity and Efficiency: Streamlining Workflows',
                    icon: <TrendingUp size={16} />,
                    content: 'Effective file management significantly boosts productivity by reducing the time spent searching for and retrieving files. When files are organized logically and consistently, users can quickly locate the information they need, minimizing delays and frustration. This efficiency translates to faster project completion, improved workflow, and increased overall productivity. For instance, a well-structured folder hierarchy, using descriptive file names, allows for rapid navigation and retrieval of documents. By eliminating the time wasted searching for misplaced files, individuals and teams can focus on more critical tasks, leading to greater output and efficiency. Furthermore, consistent file naming conventions and folder structures enable seamless collaboration among team members, as everyone can easily understand and navigate the shared file system.',
                  },
                  {
                    title: '2. Improved Data Security and Integrity: Safeguarding Critical Information',
                    icon: <Shield size={16} />,
                    content: 'Proper file management plays a crucial role in safeguarding data security and integrity. By implementing access controls and permissions, sensitive files can be protected from unauthorised access or modification. Regular backups and version control ensure that data is not lost or corrupted due to hardware failures, software errors, or human mistakes. Organised file structures can facilitate the implementation of encryption and other security measures, adding layers of protection to sensitive data. For example, storing confidential financial documents in a separate, encrypted folder with restricted access significantly reduces the risk of data breaches. Consistent file naming and metadata tagging help maintain data integrity by ensuring that files are accurately labelled and described. This reduces the risk of errors and inconsistencies, which can lead to data loss or misinterpretation.',
                  },
                  {
                    title: '3. Reduced Storage Costs: Optimizing Resource Utilization',
                    icon: <HardDriveIcon size={16} />,
                    content: 'Effective file management can help reduce storage costs by optimising resource utilisation. By eliminating duplicate files and compressing large files, organisations can minimise the amount of storage space required. Regularly deleting unnecessary files and archiving old data can also free up valuable storage space. This is particularly important for organisations with large volumes of data, as storage costs can quickly escalate. Furthermore, organised file structures make it easier to identify and manage data that needs to be migrated to less expensive storage tiers. For instance, infrequently accessed archival data can be moved to lower-cost storage solutions, while frequently used data remains on high-performance drives. This strategic approach to storage management can significantly reduce overall storage costs and improve resource efficiency.',
                  },
                  {
                    title: '4. Facilitated Collaboration and Sharing: Enabling Seamless Teamwork',
                    icon: <UsersIcon size={16} />,
                    content: 'Well-organised file systems facilitate collaboration and sharing among team members. Consistent file naming conventions, shared folder structures, and metadata tagging ensure that everyone can easily access and understand the information they need. Version control features prevent conflicts and ensure that everyone is working on the latest version of a document. Cloud-based file sharing platforms enable real-time collaboration and remote access, making it easy for teams to work together from different locations. For instance, a shared project folder with clearly labelled subfolders and consistent file names allows team members to easily find and access relevant documents. This seamless collaboration improves communication, reduces errors, and enhances overall team productivity.',
                  },
                  {
                    title: '5. Enhanced Data Retrieval and Accessibility: Quick and Easy Access',
                    icon: <SearchIcon size={16} />,
                    content: 'Effective file management makes it easy to retrieve and access data quickly and efficiently. Logical folder structures, descriptive file names, and metadata tagging enable users to locate files with minimal effort. This is particularly important for organisations with large volumes of data, as it can save significant time and resources. Search functionality can be used to quickly find specific files or information within files. Consistent file naming conventions and metadata tagging ensure that search results are accurate and relevant. Furthermore, organised file systems make it easier to browse and navigate data, even for users who are unfamiliar with the system. This enhanced data retrieval and accessibility improves user satisfaction and reduces the time spent searching for information.',
                  },
                  {
                    title: '6. Improved Compliance and Regulatory Adherence: Meeting Legal Requirements',
                    icon: <ClipboardListIcon size={16} />,
                    content: 'Proper file management is essential for ensuring compliance with legal and regulatory requirements. Many industries have specific regulations regarding data retention, security, and accessibility. Organised file systems make it easier to track and manage data, ensuring that it is stored and accessed in accordance with these regulations. Version control features and audit trails provide a record of changes made to files, which can be crucial for legal or regulatory purposes. Furthermore, consistent file naming and metadata tagging help ensure that data is accurately labelled and described, which can be important for demonstrating compliance. This proactive approach to file management helps organisations avoid legal penalties and maintain their reputation.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: Records Formats */}
            <div
              ref={(el) => {
                sectionRefs.current['formats'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Records Formats
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When discussing record formats within an organisation, it is crucial to understand that "records" encompass a broad spectrum of information. These records can be in various formats, both traditional and digital, and each plays a distinct role.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Paper Records',
                    icon: <FileTextIcon size={16} />,
                    content: 'This traditional format involves physical documents such as letters, reports, contracts, and printed forms. While increasingly replaced by digital formats, paper records still hold significance in many organisations. They offer tangible evidence of transactions and decisions. However, they also present challenges related to storage, retrieval, and security. Managing paper records effectively requires organised filing systems and secure storage to prevent loss or damage.',
                  },
                  {
                    title: '2. Digital Records',
                    icon: <Database size={16} />,
                    content: (
                      <>
                        <p>In today's technology-driven world, digital records have become predominant. This category includes electronic documents, spreadsheets, databases, emails, and multimedia files. Digital records offer numerous advantages, such as easy storage, quick retrieval, and efficient sharing. However, they also necessitate robust cybersecurity measures to protect against unauthorised access and data breaches. Digital records management systems are vital for organising, storing, and preserving these records.</p>
                        <p><strong>Examples of digital record formats include:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Word documents (.doc, .docx)</li>
                          <li>Spreadsheets (.xls, .xlsx)</li>
                          <li>PDF files (.pdf)</li>
                          <li>Image files (.jpg, .png, .tiff)</li>
                          <li>Email messages</li>
                          <li>Databases</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '3. Electronic Communication Records',
                    icon: <Mail size={16} />,
                    content: 'This specific category of digital records pertains to communications conducted electronically, such as emails, instant messages, and social media interactions. These records are essential for documenting communication trails, agreements, and discussions. Organisations must establish clear policies for managing and retaining electronic communication records to ensure compliance with legal and regulatory requirements.',
                  },
                  {
                    title: '4. Financial Records',
                    icon: <Banknote size={16} />,
                    content: 'Financial records are crucial for tracking an organisation\'s financial transactions. These records include invoices, receipts, financial statements, and audit trails. They can exist in both paper and digital formats. Accurate and well-maintained financial records are essential for financial reporting, tax compliance, and auditing purposes.',
                  },
                  {
                    title: '5. Legal Records',
                    icon: <Scale size={16} />,
                    content: 'Legal records document an organisation\'s legal obligations and rights. These records may include contracts, legal agreements, court documents, and regulatory compliance records. They are vital for protecting the organisation\'s interests and ensuring adherence to legal requirements.',
                  },
                  {
                    title: '6. Multimedia Records',
                    icon: <Film size={16} />,
                    content: 'This category encompasses records in audio and video formats. Examples include recordings of meetings, presentations, and training sessions. With the rise of digital media, organisations increasingly generate and store multimedia records. Proper management of these records is essential for preserving valuable information and ensuring accessibility.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: Duties in an Active Filing Room */}
            <div
              ref={(el) => {
                sectionRefs.current['duties'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Duties in an Active Filing Room
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Filing and Indexing',
                    icon: <FolderTree size={16} />,
                    content: 'This is the core function of the filing room. It involves the systematic organisation of records, whether paper or digital, according to established filing systems. This includes creating and maintaining indexes, which are essential for locating specific documents quickly. For paper records, it means physically placing documents in designated folders and cabinets, ensuring they are labelled correctly and filed in the proper sequence. For digital records, this involves assigning metadata, creating searchable tags, and organising files within a logical folder structure. The accuracy and consistency of filing and indexing are paramount to prevent lost or misplaced records and ensure efficient retrieval. This duty requires attention to detail and a thorough understanding of the organisation\'s filing system.',
                  },
                  {
                    title: '2. Record Retrieval and Circulation',
                    icon: <SearchIcon size={16} />,
                    content: 'This duty focuses on providing authorised personnel with access to requested records. When a request comes in, the filing room staff must efficiently locate the required document, whether it is a physical file or a digital record. For paper files, this may involve physically retrieving the folder from the cabinet and logging it out to the requester. For digital records, it involves providing access to the file through the organisation\'s network or document management system. Tracking the circulation of records is crucial to ensure they are returned promptly and to maintain an audit trail. This may involve using checkout systems, logs, or digital tracking tools. Timely and accurate retrieval is essential for supporting business operations and decision-making.',
                  },
                  {
                    title: '3. Record Maintenance and Updating',
                    icon: <FileEditIcon size={16} />,
                    content: 'Records are not static; they require ongoing maintenance to ensure accuracy and relevance. This duty involves updating records with new information, correcting errors, and removing outdated or obsolete documents. For paper records, this may involve physically adding or removing pages, updating labels, or transferring documents to new folders. For digital records, it involves editing documents, updating metadata, and managing version control. Regular maintenance is crucial for ensuring that records are accurate, up-to-date, and compliant with relevant regulations. This duty requires careful attention to detail and a thorough understanding of the organisation\'s record retention policies.',
                  },
                  {
                    title: '4. Record Security and Confidentiality',
                    icon: <LockIcon size={16} />,
                    content: 'Protecting the security and confidentiality of records is a critical responsibility. This duty involves implementing measures to prevent unauthorised access, loss, or damage to records. For paper records, this may involve storing files in locked cabinets or secure rooms and controlling access to the filing area. For digital records, this involves implementing access controls, encryption, and other security measures. Staff must be trained on the organisation\'s security policies and procedures, and they must adhere to strict confidentiality guidelines. Maintaining the integrity and security of records is essential for protecting sensitive information and ensuring compliance with legal and ethical requirements.',
                  },
                  {
                    title: '5. Record Retention and Disposal',
                    icon: <TrashIcon size={16} />,
                    content: 'Organisations must adhere to record retention schedules, which dictate how long records must be kept. This duty involves managing the lifecycle of records, from creation to disposal. For paper records, this may involve transferring inactive files to offsite storage or shredding documents according to retention schedules. For digital records, this involves archiving or deleting files according to established policies. Proper disposal of records is essential for complying with legal and regulatory requirements and for managing storage space. This duty requires a thorough understanding of the organisation\'s record retention policies and procedures.',
                  },
                  {
                    title: '6. Inventory Management and Auditing',
                    icon: <ClipboardListIcon size={16} />,
                    content: 'Regular inventory checks and audits are essential for ensuring the accuracy and completeness of records. This duty involves conducting periodic reviews of the filing system to identify missing or misplaced records and to verify the accuracy of indexing and labelling. For paper records, this may involve physically counting files and comparing them to inventory lists. For digital records, this may involve using automated tools to generate reports and verify file integrity. Auditing helps to identify and correct errors, improve the efficiency of the filing system, and maintain compliance with regulatory requirements.',
                  },
                  {
                    title: '7. System Improvement and Training',
                    icon: <SettingsIcon size={16} />,
                    content: 'The filing room staff is responsible for continually evaluating and improving the filing system to ensure efficiency and effectiveness. This may involve researching and implementing new technologies, streamlining processes, and developing training materials for staff. They must stay up to date on best practices in records management and be able to adapt to changing needs. Providing ongoing training to staff is essential for ensuring that they have the skills and knowledge to perform their duties effectively.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5: Coming Up With a File Name */}
            <div
              ref={(el) => {
                sectionRefs.current['file-name'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Coming Up With a File Name
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Clarity and Conciseness',
                    icon: <FileTextIcon size={16} />,
                    content: 'The file name should clearly and concisely describe the content of the file. Avoid overly long or ambiguous names. Aim for a balance between providing sufficient information and keeping the name manageable. For example, instead of "Document1," use "ProjectProposal_ClientName_Date."',
                  },
                  {
                    title: '2. Descriptive Keywords',
                    icon: <SearchIcon size={16} />,
                    content: 'Use relevant keywords that accurately reflect the file\'s content. This will make it easier to search for and retrieve the file later. Consider what words you would use to search for the file and incorporate those into the file name.',
                  },
                  {
                    title: '3. Consistent Format',
                    icon: <ListChecks size={16} />,
                    content: 'Establish a consistent naming convention and stick to it. This will ensure that all files are named in a uniform manner, making them easier to organise and locate. For instance, you could use a format like "DocumentType_Subject_Date_Version." Consistency across all files is key.',
                  },
                  {
                    title: '4. Date Format',
                    icon: <CalendarIcon size={16} />,
                    content: 'When including dates in file names, use a consistent date format, such as YYYY-MM-DD. This format ensures that files are sorted chronologically, regardless of regional date preferences. For example, use "2023-10-27" instead of "10/27/2023" or "27-10-2023."',
                  },
                  {
                    title: '5. Version Control',
                    icon: <LayersIcon size={16} />,
                    content: 'If you have multiple versions of a file, include a version number or date in the file name to distinguish between them. This will help you track changes and ensure you are working with the most recent version. For example, "ProjectReport_v1," "ProjectReport_v2," or "ProjectReport_20231027."',
                  },
                  {
                    title: '6. Avoid Special Characters',
                    icon: <AlertCircleIcon size={16} />,
                    content: 'Avoid using special characters, such as / \ : * ? &quot; &lt; &gt; |, in file names. These characters can cause problems with file systems and software applications. Stick to alphanumeric characters, underscores, and hyphens.',
                  },
                  {
                    title: '7. Use Underscores or Hyphens',
                    icon: <Minus size={16} />,
                    content: 'Use underscores or hyphens to separate words in file names. This improves readability and avoids issues with spaces in file names, which can sometimes cause problems with certain systems. For example, "Project_Proposal" or "Client-Report."',
                  },
                  {
                    title: '8. Consider File Type',
                    icon: <FileTextIcon size={16} />,
                    content: 'If it is important, you can add an abbreviated file type to the end of your file name before the file extension. For example, "ProjectReport_Final_Draft_DOC.docx" or "Image_Logo_PNG.png."',
                  },
                  {
                    title: '9. Organisation-Specific Conventions',
                    icon: <UsersIcon size={16} />,
                    content: 'If you are working within an organisation, adhere to any established file naming conventions. This will ensure consistency across all files and facilitate collaboration.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 6: Indexing and Controlled Vocabularies */}
            <div
              ref={(el) => {
                sectionRefs.current['indexing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Indexing and Controlled Vocabularies
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Indexing',
                    icon: <SearchIcon size={16} />,
                    content: 'Indexing is the process of assigning descriptive terms or codes to documents or data to facilitate retrieval. It is essentially creating a roadmap that allows users to find specific information quickly and efficiently. In a traditional library setting, this might involve assigning subject headings to books. In digital environments, it entails tagging files with keywords or creating searchable databases. The goal of indexing is to make information discoverable, regardless of how a user might phrase their search.',
                  },
                  {
                    title: 'Controlled Vocabularies',
                    icon: <BookOpen size={16} />,
                    content: 'A controlled vocabulary is an organised list of preferred terms used to index content. It aims to standardise the language used to describe information, eliminating ambiguity, and ensuring consistency. Instead of allowing users to use any term they choose, a controlled vocabulary dictates which terms should be used for indexing and retrieval. This addresses issues like synonyms, homonyms, and variations in spelling. Controlled vocabularies provide a structured approach to information organisation, leading to more accurate and reliable search results.',
                  },
                  {
                    title: 'The Relationship',
                    icon: <LinkIcon size={16} />,
                    content: 'Controlled vocabularies enhance the effectiveness of indexing. By using standardised terms, indexers ensure that information is consistently labelled, regardless of who is doing the indexing. This consistency improves search accuracy, as users can rely on a predictable set of terms to find the information they need. In essence, controlled vocabularies provide the "rules" for indexing, ensuring that the indexing process is systematic and effective.',
                  },
                  {
                    title: 'Why They Matter',
                    icon: <Target size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Improved Search Accuracy:</strong> Controlled vocabularies reduce ambiguity and increase the precision of search results.</li>
                        <li><strong>Enhanced Information Retrieval:</strong> Consistent indexing makes it easier for users to find relevant information.</li>
                        <li><strong>Increased Efficiency:</strong> Standardised terminology streamlines the indexing process and reduces the time spent searching for information.</li>
                        <li><strong>Data Integrity:</strong> Controlled vocabularies help maintain the integrity and consistency of data.</li>
                        <li><strong>Facilitating Interoperability:</strong> Controlled vocabularies help different systems to understand each other.</li>
                      </ul>
                    ),
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 7: File Series */}
            <div
              ref={(el) => {
                sectionRefs.current['series'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                File Series
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Definition and Purpose',
                    icon: <FolderTree size={16} />,
                    content: 'A file series is a collection of files that are related in some way and are kept together as a single organisational unit. This grouping allows for consistent management, retrieval, and preservation of related records. The primary purpose of a file series is to maintain the context and relationships between individual files, making it easier to understand and use the information they contain. By organising records into series, organisations can ensure that related information is not scattered across different storage locations, which would hinder efficient retrieval and analysis. This approach also helps to maintain the integrity of the records by preserving their original context and relationships.',
                  },
                  {
                    title: '2. Basis for Grouping',
                    icon: <LayersIcon size={16} />,
                    content: (
                      <>
                        <p>Files can be grouped into series based on various criteria, including:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Subject:</strong> Files related to a specific topic or theme (e.g., "Human Resources - Employee Benefits").</li>
                          <li><strong>Function:</strong> Files related to a particular organisational function or activity (e.g., "Accounting - Accounts Payable").</li>
                          <li><strong>Originating Office:</strong> Files created or maintained by a specific department or unit (e.g., "Marketing Department - Campaign Files").</li>
                          <li><strong>Chronological Order:</strong> Files organised by date or time period (e.g., "Financial Reports - 2023").</li>
                          <li><strong>Project:</strong> Files related to a specific project (e.g., "Project X development documents").</li>
                        </ul>
                        <p>The chosen grouping criteria should reflect the organisation's structure and the way information is used. This ensures that the file series are logical and meaningful.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Benefits of File Series',
                    icon: <CheckCircleIcon2 size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Improved Retrieval:</strong> Related files are kept together, making it easier to locate specific information.</li>
                        <li><strong>Enhanced Context:</strong> The relationships between files are preserved, providing a more complete understanding of the information.</li>
                        <li><strong>Efficient Management:</strong> Consistent management practices can be applied to all files within a series.</li>
                        <li><strong>Simplified Retention and Disposal:</strong> Retention schedules can be applied to entire series, streamlining the disposal process.</li>
                        <li><strong>Preservation of Organisational Memory:</strong> File series help to preserve the historical context of an organisation\'s activities.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '4. Implementation and Management',
                    icon: <SettingsIcon size={16} />,
                    content: (
                      <>
                        <p>Implementing and managing file series requires careful planning and consistent application of established procedures. This involves:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Identifying and Defining Series:</strong> Determining the appropriate grouping criteria and defining the scope of each series.</li>
                          <li><strong>Developing a Filing System:</strong> Establishing a logical and consistent filing system for each series.</li>
                          <li><strong>Creating File Indexes or Finding Aids:</strong> Developing tools to help users locate specific files within a series.</li>
                          <li><strong>Applying Retention Schedules:</strong> Establishing and implementing retention schedules for each series.</li>
                          <li><strong>Maintaining File Integrity:</strong> Ensuring that files are properly stored and protected from damage or loss.</li>
                          <li><strong>Documentation:</strong> Documenting the file series, including the series title, description, and applicable retention schedule. This documentation helps to maintain consistency and ensure that future staff can understand the organisation of the records.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '5. Digital File Series',
                    icon: <Database size={16} />,
                    content: 'In digital environments, file series can be implemented using electronic document management systems (EDMS) or record management systems (RMS). These systems allow for the creation of virtual file series, where related files are grouped and managed electronically. Digital file series offer the same benefits as physical file series, with the added advantages of electronic searchability, version control, and secure storage. The metadata capabilities of digital systems are very useful for creating and managing file series.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 8: Handling Records That Are in Electronic Form */}
            <div
              ref={(el) => {
                sectionRefs.current['electronic'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Handling Records That Are in Electronic Form
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Digital Record Integrity and Authenticity',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p><strong>Ensuring Reliability:</strong> Electronic records are susceptible to alteration or corruption. Therefore, maintaining their integrity is crucial. This involves implementing measures to prevent unauthorised modifications and to ensure that records accurately reflect the information they represent. Techniques like digital signatures and audit trails can help verify the authenticity and integrity of electronic records.</p>
                        <p><strong>Metadata Management:</strong> Metadata (data about data) is essential for providing context and ensuring the reliability of electronic records. This includes information about the record\'s creation, modification, and storage. Proper metadata management helps to preserve the record\'s history and ensure its usability over time.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Electronic Record Security',
                    icon: <LockIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Access Control:</strong> Restricting access to electronic records is vital to protect sensitive information. This involves implementing robust access control measures, such as user authentication and authorisation.</p>
                        <p><strong>Data Encryption:</strong> Encrypting electronic records can help protect them from unauthorised access, especially during transmission or storage.</p>
                        <p><strong>Cybersecurity Measures:</strong> Organisations must implement comprehensive cybersecurity measures to protect electronic records from cyber threats, such as hacking, malware, and data breaches.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Electronic Record Storage and Preservation',
                    icon: <HardDriveIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Storage Media and Formats:</strong> Electronic records can be stored on various media, such as hard drives, cloud storage, and optical discs. Organisations must choose storage media and formats that are durable and reliable. Consideration must also be given to file format obsolescence. File formats change and ensuring that records can be opened in the future is very important.</p>
                        <p><strong>Long-Term Preservation:</strong> Preserving electronic records for long-term use requires careful planning and ongoing maintenance. This may involve migrating records to new storage media or formats as technology evolves.</p>
                        <p><strong>Cloud Storage:</strong> Cloud storage has become very popular. When using cloud storage, it is very important to ensure that the cloud storage provider has robust security, and redundancy in their systems.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Electronic Record Retrieval and Accessibility',
                    icon: <SearchIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Search and Retrieval Systems:</strong> Efficient search and retrieval systems are essential for accessing electronic records quickly and easily. This involves implementing indexing, metadata tagging, and other search functionalities.</p>
                        <p><strong>Accessibility Standards:</strong> Organisations must ensure that electronic records are accessible to authorised personnel, regardless of their location or device. This may involve implementing web-based access or mobile applications.</p>
                        <p><strong>E-Discovery:</strong> E-discovery is the process of identifying, preserving, collecting, and producing electronically stored information (ESI) for use as evidence in legal cases. So, organisations must have systems that can easily handle this process.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Electronic Record Retention and Disposal',
                    icon: <TrashIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Retention Schedules:</strong> Organisations must establish and implement retention schedules for electronic records, which dictate how long records must be kept and when they can be disposed of.</p>
                        <p><strong>Secure Disposal:</strong> Proper disposal of electronic records is essential to prevent unauthorised access to sensitive information. This may involve securely wiping hard drives or shredding optical discs.</p>
                        <p><strong>Legal Compliance:</strong> Electronic record retention and disposal must comply with all applicable legal and regulatory requirements.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Key Technologies and Practices',
                    icon: <SettingsIcon size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Electronic Document Management Systems (EDMS):</strong> EDMS can help organisations manage electronic records throughout their lifecycle.</li>
                        <li><strong>Record Management Systems (RMS):</strong> RMS provide more advanced features for managing electronic records, including retention schedules and audit trails.</li>
                        <li><strong>Metadata Standards:</strong> Adhering to metadata standards can help ensure the consistency and interoperability of electronic records.</li>
                        <li><strong>Digital Preservation Strategies:</strong> Developing digital preservation strategies is very important for ensuring that records are accessible far into the future.</li>
                      </ul>
                    ),
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 9: Organisational Procedures to Filing Records */}
            <div
              ref={(el) => {
                sectionRefs.current['procedures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Organisational Procedures to Filing Records
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Standardised Filing Systems',
                    icon: <FolderTree size={16} />,
                    content: 'Organisations establish standardised filing systems to create a uniform approach to organising and storing records. This involves defining the structure of the filing system, whether it is alphabetical, numerical, chronological, or subject-based. Standardised systems ensure that all employees follow the same protocols, preventing inconsistencies and confusion. For instance, a company might use a numerical system for client files, with each client assigned a unique number. This system would be documented in a procedure manual, detailing the number allocation process, folder labelling, and storage locations. Implementing a standardised system simplifies file retrieval, reduces the risk of lost or misplaced records, and promotes efficiency across departments.',
                  },
                  {
                    title: '2. Consistent Naming Conventions',
                    icon: <FileTextIcon size={16} />,
                    content: 'Consistent naming conventions are crucial for both physical and digital records. Organisations develop guidelines for naming files and folders to ensure clarity and uniformity. These conventions typically include using descriptive keywords, dates, version numbers, and standardised abbreviations. For example, a company might require all project documents to be named using the format "ProjectName_DocumentType_Date_Version." This ensures that files are easily searchable and identifiable. The naming convention is usually documented in a company policy, and employees are trained on how to apply it. Consistent naming helps to avoid duplicates, simplifies searching, and ensures that files are organised logically.',
                  },
                  {
                    title: '3. Controlled Access and Security',
                    icon: <LockIcon size={16} />,
                    content: 'Organisations implement procedures to control access to records and ensure their security. This involves establishing access levels based on job roles and responsibilities. Sensitive records, such as employee files or financial documents, are typically restricted to authorised personnel. For physical records, this might involve storing files in locked cabinets or secure rooms. For digital records, it involves implementing password protection, access controls, and encryption. Procedures for handling confidential information are documented in security policies, and employees are trained on how to protect sensitive data. Controlled access safeguards sensitive information from unauthorised access, prevents data breaches, and ensures compliance with privacy regulations.',
                  },
                  {
                    title: '4. Retention and Disposal Schedules',
                    icon: <CalendarIcon size={16} />,
                    content: 'Organisations develop and implement retention and disposal schedules to manage the lifecycle of records. These schedules outline how long records must be kept and when they can be disposed of. Retention schedules are based on legal requirements, regulatory guidelines, and business needs. For example, tax records might need to be retained for seven years, while employee records might need to be kept for a specific period after employment ends. Disposal procedures ensure that records are destroyed securely and confidentially. This might involve shredding paper documents or securely wiping digital files. Retention schedules and disposal procedures are documented in record management policies, and employees are trained on how to implement them. Proper retention and disposal practices help to manage storage space, reduce legal risks, and ensure compliance with regulations.',
                  },
                  {
                    title: '5. Regular Audits and Reviews',
                    icon: <ClipboardListIcon size={16} />,
                    content: 'Organisations conduct regular audits and reviews of their filing systems to ensure compliance with procedures and identify areas for improvement. Audits involve checking the accuracy of file indexing, verifying the security of records, and assessing the effectiveness of retention schedules. Reviews provide an opportunity to update procedures and incorporate best practices. Audit findings and recommendations are documented and used to improve record management practices. Regular audits and reviews help to maintain the integrity of records, ensure compliance, and improve the efficiency of the filing system.',
                  },
                  {
                    title: '6. Training and Education',
                    icon: <GraduationCap size={16} />,
                    content: 'Organisations provide training and education to employees on proper filing procedures. This ensures that all employees understand and follow the established guidelines. Training covers topics such as file organisation, naming conventions, access control, and retention schedules. Training materials, such as manuals and online resources, are provided to support employee learning. Regular training sessions are conducted to reinforce best practices and address any questions or concerns. Employee training helps to ensure consistency, improve compliance, and promote efficient record management practices across the organisation.',
                  },
                  {
                    title: '7. Digitalisation and Electronic Records Management',
                    icon: <Cloud size={16} />,
                    content: 'Organisations are increasingly adopting digitalisation and electronic records management systems (ERMS) to streamline their filing processes. ERMS provide tools for organising, storing, and retrieving electronic records. Procedures are developed to manage digital records, including file formats, metadata tagging, and version control. Organisations must also have procedures for backing up and recovering digital records. Digitalisation and ERMS improve efficiency, reduce storage costs, and enhance accessibility.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 10: Factors and Tools That Contribute to Records Retrieval */}
            <div
              ref={(el) => {
                sectionRefs.current['retrieval'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors and Tools That Contribute to Records Retrieval
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Well-Defined Indexing Systems',
                    icon: <SearchIcon size={16} />,
                    content: 'A robust indexing system is the cornerstone of efficient records retrieval. Indexing involves assigning descriptive terms or codes to records, enabling users to locate them quickly. These systems can be based on various criteria, such as subject, author, date, or unique identifiers. The key is to create a logical and consistent structure that allows for easy searching. For physical records, this might involve creating index cards or using a detailed filing system. For digital records, it involves assigning metadata, creating searchable tags, and organising files within a logical folder structure. A well-defined indexing system simplifies the search process, reduces the time spent locating records, and ensures that relevant information is readily available.',
                  },
                  {
                    title: '2. Controlled Vocabularies and Thesauri',
                    icon: <BookOpen size={16} />,
                    content: 'Controlled vocabularies and thesauri are essential for ensuring consistency and accuracy in records retrieval. These tools provide a standardised set of terms for indexing and searching, eliminating ambiguity, and ensuring that users are using the same language to describe information. Controlled vocabularies help to address issues like synonyms, homonyms, and variations in spelling, which can hinder search results. For example, a thesaurus might specify that "automobile" should be used instead of "car" to ensure consistency. By using controlled vocabularies and thesauri, organisations can improve the precision of search results, reduce the number of irrelevant hits, and ensure that users are finding the information they need.',
                  },
                  {
                    title: '3. Digital Record Management Systems (RMS) and Electronic Document Management Systems (EDMS)',
                    icon: <Database size={16} />,
                    content: 'RMS and EDMS are powerful tools for managing and retrieving electronic records. These systems provide a centralised repository for storing and organising digital documents, enabling users to search and retrieve records quickly and easily. RMS and EDMS offer a range of features, such as full-text search, metadata tagging, version control, and access control. Full-text search allows users to search for specific words or phrases within documents, while metadata tagging enables users to search based on specific attributes, such as author, date, or subject. Version control ensures that users are working with the most up-to-date version of a document, while access control restricts access to sensitive information. These systems streamline the retrieval process, improve efficiency, and enhance the overall management of electronic records.',
                  },
                  {
                    title: '4. Metadata Management',
                    icon: <TagIcon size={16} />,
                    content: 'Metadata, or data about data, plays a crucial role in records retrieval. Metadata provides context and descriptive information about records, making them easier to search and locate. This includes information such as author, date, subject, file type, and keywords. Proper metadata management involves assigning relevant metadata to records and ensuring that it is accurate and consistent. Metadata can be embedded within digital files or stored in a separate database. By using metadata, users can refine their searches and retrieve more relevant results. For example, a user might search for all documents authored by a specific individual or created within a specific date range.',
                  },
                  {
                    title: '5. Search and Retrieval Software',
                    icon: <SearchIcon size={16} />,
                    content: 'Search and retrieval software provides advanced search capabilities, enabling users to find records quickly and efficiently. These tools offer a range of search options, such as keyword search, Boolean search, and fuzzy search. Keyword search allows users to search for specific words or phrases, while Boolean search allows users to combine search terms using operators like AND, OR, and NOT. Fuzzy search allows users to find records that are similar to their search terms, even if they contain spelling errors or variations. Search and retrieval software often includes features like indexing, ranking, and filtering, which help to improve the accuracy and relevance of search results.',
                  },
                  {
                    title: '6. Physical Filing Systems and Tools',
                    icon: <FolderTree size={16} />,
                    content: 'For organisations that still maintain physical records, well-organised filing systems and tools are essential for efficient retrieval. This includes using colour-coded folders, labels, and filing cabinets to organise and locate records. Tools like index cards, file locators, and barcode scanners can also help to streamline the retrieval process. A well-designed physical filing system ensures that records are easily accessible and that users can quickly locate the information they need.',
                  },
                  {
                    title: '7. Clear and Consistent File Naming Conventions',
                    icon: <FileTextIcon size={16} />,
                    content: 'Consistent file naming conventions are vital for both physical and digital records. Clear and descriptive file names make it easier to identify and locate records quickly. This involves using relevant keywords, dates, version numbers, and standardised abbreviations. For example, a company might require all project documents to be named using the format "ProjectName_DocumentType_Date_Version." Consistent file naming conventions reduce the risk of lost or misplaced records and ensure that users can easily find the information they need.',
                  },
                  {
                    title: '8. Training and User Education',
                    icon: <GraduationCap size={16} />,
                    content: 'Providing training and education to users on proper records retrieval techniques is essential for maximising efficiency. This includes training on how to use indexing systems, search software, and other retrieval tools. Users should also be educated on the importance of metadata management and consistent file naming conventions. Regular training sessions and user guides can help to ensure that users are proficient in records retrieval and that they are using the tools and systems effectively.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 11: Assigning File References */}
            <div
              ref={(el) => {
                sectionRefs.current['references'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Assigning File References
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Purpose and Importance',
                    icon: <FileTextIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Unique Identification:</strong> A file reference acts as a unique identifier for each document or file. This prevents confusion and duplication, especially in large organisations with numerous records.</p>
                        <p><strong>Efficient Retrieval:</strong> A well-structured file reference system allows for quick and accurate retrieval of files. When a reference number is known, the file can be located easily, saving time and effort.</p>
                        <p><strong>Organisation and Tracking:</strong> File references facilitate organised storage and tracking of records. They provide a logical framework for managing documents, making it easier to maintain an audit trail and monitor file movement.</p>
                        <p><strong>Legal and Compliance:</strong> In many industries, assigning file references is crucial for legal and compliance purposes. It ensures that records are properly documented and auditable, which is essential for regulatory compliance and legal proceedings.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Key Components of a File Reference',
                    icon: <LayersIcon size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Unique Identifier:</strong> This is the core of the file reference, typically a combination of letters, numbers, or symbols that uniquely identifies the file.</li>
                        <li><strong>Department/Division Codes:</strong> Including department or division codes can help to categorise files based on their origin or function. For example, "HR" for Human Resources or "FIN" for Finance.</li>
                        <li><strong>Subject/Project Codes:</strong> Subject or project codes can indicate the content or context of the file. For example, "PRJ-2023-001" for a specific project.</li>
                        <li><strong>Date Codes:</strong> Including date codes can help to organise files chronologically. For example, "2023-10-27" for a file created on October 27, 2023.</li>
                        <li><strong>Sequential Numbers:</strong> Sequential numbers are often used to assign unique identifiers to files within a specific category. For example, "001," "002," "003," and so on.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '3. Types of File Reference Systems',
                    icon: <GridIcon size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Numerical Systems:</strong> These systems use numbers to assign file references. They are simple and efficient, especially for large volumes of records.</li>
                        <li><strong>Alphabetical Systems:</strong> These systems use letters or a combination of letters and numbers to assign file references. They are useful for organising files based on names or subjects.</li>
                        <li><strong>Alphanumeric Systems:</strong> These systems combine letters and numbers to create file references. They offer greater flexibility and can accommodate more complex organisational structures.</li>
                        <li><strong>Hybrid Systems:</strong> These systems combine aspects of all the other systems and are very useful in large organisations.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '4. Best Practices for Assigning File References',
                    icon: <CheckCircleIcon2 size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Consistency:</strong> Establish and maintain a consistent file reference system throughout the organisation. This ensures that all files are assigned references in the same manner.</li>
                        <li><strong>Uniqueness:</strong> Ensure that each file reference is unique. This prevents confusion and duplication.</li>
                        <li><strong>Clarity:</strong> Use clear and concise file references that are easy to understand and remember.</li>
                        <li><strong>Documentation:</strong> Document the file reference system, including the codes used and their meanings. This ensures that everyone in the organisation understands the system.</li>
                        <li><strong>Automation:</strong> Use automated systems, such as record management software, to assign and track file references. This can improve efficiency and reduce errors.</li>
                        <li><strong>Regular Reviews:</strong> Conduct regular reviews of the system to ensure it is still working as intended, and to make any needed changes.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '5. Digital File References',
                    icon: <Database size={16} />,
                    content: 'In digital environments, file references are often integrated into electronic document management systems (EDMS) or record management systems (RMS). These systems can automatically generate and assign file references, track file movement, and manage metadata. Metadata is very important when dealing with digital files, and can be used as part of, or in conjunction with, the file reference.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 12: Types of Files That Can Be Handled in an Organisation */}
            <div
              ref={(el) => {
                sectionRefs.current['types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Types of Files That Can Be Handled in an Organisation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Administrative Files',
                    icon: <FileTextIcon size={16} />,
                    content: 'These files encompass the day-to-day operational documentation of an organisation. They include items like meeting minutes, internal memos, policy documents, procedural manuals, and correspondence. Administrative files are essential for maintaining internal communication, documenting decisions, and ensuring smooth workflow. They provide a record of organisational activities and serve as references for future actions. Proper management of these files is vital for accountability and transparency within the organisation. These files are typically kept for varying lengths of time, depending on their importance and legal requirements.',
                  },
                  {
                    title: '2. Financial Files',
                    icon: <Banknote size={16} />,
                    content: 'Financial files are critical for tracking an organisation\'s financial transactions and performance. They include records such as invoices, receipts, purchase orders, financial statements, audit reports, and tax documents. Accurate and well-maintained financial files are essential for financial reporting, budgeting, and auditing purposes. They also play a crucial role in ensuring compliance with financial regulations and tax laws. These files are subject to strict retention requirements and must be stored securely to protect sensitive financial information.',
                  },
                  {
                    title: '3. Human Resources (HR) Files',
                    icon: <UsersIcon size={16} />,
                    content: 'HR files contain records related to employees, including applications, resumes, employment contracts, performance evaluations, disciplinary actions, and payroll information. These files are essential for managing employee relations, tracking performance, and ensuring compliance with labour laws. HR files often contain sensitive personal information and must be handled with utmost confidentiality. Organisations must adhere to strict privacy regulations and implement robust security measures to protect these files from unauthorised access.',
                  },
                  {
                    title: '4. Legal Files',
                    icon: <Scale size={16} />,
                    content: 'Legal files document an organisation\'s legal obligations and rights. They include contracts, legal agreements, court documents, regulatory compliance records, and intellectual property documents. These files are vital for protecting the organisation\'s interests and ensuring adherence to legal requirements. They are crucial for legal proceedings, audits, and regulatory compliance. Legal files often require specialised handling and must be stored securely to maintain their integrity and confidentiality.',
                  },
                  {
                    title: '5. Operational Files',
                    icon: <SettingsIcon size={16} />,
                    content: 'Operational files document the core business processes and activities of an organisation. They include production records, inventory management records, customer service records, and project management documents. These files are essential for monitoring performance, improving efficiency, and ensuring quality control. Operational files provide valuable insights into the organisation\'s operations and help to identify areas for improvement.',
                  },
                  {
                    title: '6. Marketing and Sales Files',
                    icon: <Megaphone size={16} />,
                    content: 'Marketing and sales files document the organisation\'s marketing and sales activities. They include marketing plans, advertising materials, customer databases, sales reports, and market research data. These files are essential for tracking marketing campaigns, analysing sales performance, and identifying customer trends. They also help to inform strategic decision-making and improve marketing and sales effectiveness.',
                  },
                  {
                    title: '7. Technical Files',
                    icon: <CpuIcon size={16} />,
                    content: 'Technical files contain information related to the organisation\'s technology and infrastructure. They include system documentation, software licences, hardware specifications, and network diagrams. These files are essential for maintaining and troubleshooting technical systems. They also play a crucial role in ensuring data security and system reliability. Proper management of technical files is vital for minimising downtime and ensuring smooth operations.',
                  },
                  {
                    title: '8. Project Files',
                    icon: <Target size={16} />,
                    content: 'Project files document the planning, execution, and completion of specific projects. They include project proposals, project plans, meeting minutes, progress reports, and deliverables. These files are essential for tracking project progress, managing resources, and ensuring project success. Project files provide a comprehensive record of project activities and serve as valuable references for future projects.',
                  },
                  {
                    title: '9. Correspondence Files',
                    icon: <Mail size={16} />,
                    content: 'Correspondence files include all written communications, whether internal or external. This can include letters, emails, faxes, and memos. They document important conversations, agreements, and exchanges of information. These files are important for documenting interactions and maintaining a record of communication.',
                  },
                  {
                    title: '10. Digital Media Files',
                    icon: <ImageIcon size={16} />,
                    content: 'With increased digital presence, organisations handle various digital media files, including images, audio, video, and multimedia presentations. These files can be used for marketing, training, and internal communication. They require specific storage solutions and management to ensure accessibility and preservation.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 13: Labelling of Files */}
            <div
              ref={(el) => {
                sectionRefs.current['labelling'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Labelling of Files
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Clarity and Conciseness',
                    icon: <FileTextIcon size={16} />,
                    content: 'The primary goal of file labelling is to convey the file\'s content accurately and efficiently. Labels should be clear and concise, using language that is easily understood by anyone who needs to access the file. Avoid jargon, abbreviations, or overly technical terms that might cause confusion. Instead, opt for straightforward and descriptive language that immediately indicates the file\'s subject or purpose. For example, instead of "Doc 1," use "Client Contracts - 2023" or "Financial Reports - Q3." This clarity ensures that users can quickly identify and retrieve the correct file without needing to open it or decipher cryptic codes.',
                  },
                  {
                    title: '2. Consistency and Standardisation',
                    icon: <ListChecks size={16} />,
                    content: 'Consistency is crucial for effective file labelling. Establishing and adhering to a standardised labelling system ensures that all files are labelled in a uniform manner, regardless of who creates or handles them. This consistency eliminates ambiguity and promotes efficiency. Standardisation involves defining specific rules for labelling, such as using a consistent format for dates, abbreviations, and keywords. For instance, always use the format YYYY-MM-DD for dates or use a predefined list of abbreviations for common terms. By following a standardised labelling system, organisations can maintain order and prevent confusion, especially in large repositories of files.',
                  },
                  {
                    title: '3. Descriptive Keywords and Subject Headings',
                    icon: <SearchIcon size={16} />,
                    content: 'Labels should incorporate descriptive keywords and subject headings that accurately reflect the file\'s content. This makes it easier to search for and retrieve files based on specific topics or themes. Consider what words or phrases users would likely use to search for the file and include those in the label. For example, a file containing meeting minutes might be labelled "Meeting Minutes - Project X - 2023-10-27." This label includes keywords such as "Meeting Minutes," "Project X," and the date, making it highly searchable. Using relevant keywords and subject headings enhances the discoverability of files and ensures that users can quickly find the information they need.',
                  },
                  {
                    title: '4. Date and Version Control',
                    icon: <CalendarIcon size={16} />,
                    content: 'Including dates and version numbers in file labels is essential for tracking changes and ensuring that users are accessing the most up-to-date information. Dates should be formatted consistently, preferably using the YYYY-MM-DD format, to ensure chronological sorting. Version numbers, such as "v1," "v2," or "Final Draft," should be used to differentiate between different versions of the same file. For example, a file might be labelled "Project Proposal - v3 - 2023-10-27." This label indicates that it is the third version of the project proposal and was created on October 27, 2023. Date and version control help to prevent confusion and ensure that users are working with the correct version of a file.',
                  },
                  {
                    title: '5. Physical Labelling Considerations',
                    icon: <Printer size={16} />,
                    content: 'When labelling physical files, such as folders or binders, ensure that labels are clearly visible and legible. Use clear, bold fonts, and avoid overcrowding the label with too much information. Position labels consistently on the file, such as on the spine or top edge, to facilitate easy identification. Consider using colour-coded labels to categorise files or highlight important information. For example, red labels might indicate urgent files, while blue labels might indicate financial documents. Physical labels should be durable and resistant to wear and tear, ensuring that they remain legible over time.',
                  },
                  {
                    title: '6. Digital Labelling Considerations',
                    icon: <MonitorIcon size={16} />,
                    content: 'When labelling digital files, use file names that are clear, concise, and descriptive. Avoid using special characters or spaces in file names, as these can cause problems with certain systems. Use underscores or hyphens to separate words in file names. Incorporate metadata, such as tags and keywords, to enhance searchability. For example, a digital file might be named "Client_Report_2023-10-27.pdf" and tagged with keywords like "client," "report," and "financial." Digital labelling should also include proper organisation within the file system, utilising folder structures that mirror the organisational logic.',
                  },
                  {
                    title: '7. Regular Review and Updates',
                    icon: <RefreshCwIcon2 size={16} />,
                    content: 'File labels should be reviewed and updated periodically to ensure that they remain accurate and relevant. As files are updated or new information is added, labels should be revised to reflect these changes. Regular reviews help to maintain the integrity of the labelling system and ensure that files are consistently organised and labelled. This is especially important for long-term records, where the terminology or organisational structure may have changed.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 14: Registration of Files */}
            <div
              ref={(el) => {
                sectionRefs.current['registration'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Registration of Files
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Formal Creation and Documentation',
                    icon: <FileTextIcon size={16} />,
                    content: 'Registration marks the formal creation of a file within an organisation\'s records system. It involves documenting essential details about the file, such as its title, date of creation, creator, subject, and any relevant keywords. This documentation creates a permanent record of the file\'s existence and its key attributes. For physical files, this might involve completing a registration form or entering data into a logbook. For digital files, it might involve entering metadata into a records management system. This formal documentation ensures that the file is officially recognised and can be easily located and tracked throughout its lifecycle.',
                  },
                  {
                    title: '2. Unique Identification and Tracking',
                    icon: <TagIcon size={16} />,
                    content: 'During registration, each file is assigned a unique identifier, such as a registration number or code. This identifier serves as a distinct marker for the file, preventing confusion and duplication. The unique identifier is used to track the file\'s location, movement, and any changes made to it. For physical files, this might involve labelling the file with the registration number and recording its location in a tracking system. For digital files, this might involve embedding the identifier in the file\'s metadata and using a records management system to track its movement. Unique identification ensures that each file can be easily located and tracked, minimising the risk of lost or misplaced records.',
                  },
                  {
                    title: '3. Establishing an Audit Trail',
                    icon: <ClockIcon size={16} />,
                    content: 'Registration creates an audit trail for each file, documenting its history and any actions taken on it. This includes recording the file\'s creation, modification, distribution, and disposal. The audit trail provides a comprehensive record of the file\'s lifecycle, ensuring accountability and transparency. For physical files, this might involve maintaining a log of file movements and actions. For digital files, this might involve using a records management system to automatically track changes and actions. Establishing an audit trail is crucial for legal and compliance purposes, as it provides evidence of the file\'s integrity and authenticity.',
                  },
                  {
                    title: '4. Metadata Capture and Management',
                    icon: <Database size={16} />,
                    content: 'Registration involves capturing and managing metadata, which is data about data. Metadata provides context and descriptive information about the file, such as its author, date, subject, and keywords. This metadata is essential for searching and retrieving files efficiently. For physical files, metadata might be recorded in a logbook or index. For digital files, metadata is typically embedded in the file itself or stored in a database. Proper metadata management ensures that files can be easily located and understood, even years after their creation.',
                  },
                  {
                    title: '5. Centralised Control and Access',
                    icon: <LockIcon size={16} />,
                    content: 'Registration facilitates centralised control and access to files. By registering files in a central system, organisations can ensure that all files are managed consistently, and that access is controlled according to established policies. This central control helps to prevent unauthorised access, loss, or damage to files. For physical files, this might involve storing files in a secure records centre. For digital files, this might involve using a records management system with access control features. Centralised control and access ensure that files are protected and that only authorised personnel can access them.',
                  },
                  {
                    title: '6. Compliance and Legal Requirements',
                    icon: <ClipboardListIcon size={16} />,
                    content: 'Registration helps organisations comply with legal and regulatory requirements. Many industries have specific regulations regarding the creation, storage, and retention of records. Registration ensures that files are properly documented and auditable, which is essential for compliance. For example, financial records might need to be registered and retained for a specific period to comply with tax laws. Legal files might need to be registered and stored securely to ensure their admissibility in court.',
                  },
                  {
                    title: '7. Integration with Records Management Systems',
                    icon: <Database size={16} />,
                    content: 'In digital environments, file registration is often integrated with records management systems (RMS). These systems automate the registration process, capturing metadata, assigning unique identifiers, and tracking file movement. Integration with RMS streamlines the registration process, improves efficiency, and reduces errors. RMS also provides features for managing file retention, disposal, and security.',
                  },
                  {
                    title: '8. Regular Reviews and Updates',
                    icon: <RefreshCwIcon2 size={16} />,
                    content: 'File registration records should be reviewed and updated periodically to ensure their accuracy and completeness. As files are updated or new information is added, registration records should be revised to reflect these changes. Regular reviews help to maintain the integrity of the registration system and ensure that files are consistently tracked and managed.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 15: Vital Records Management */}
            <div
              ref={(el) => {
                sectionRefs.current['vital'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Vital Records Management
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Definition and Importance',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p><strong>Essential Records:</strong> Vital records are those documents and information systems that are indispensable for an organisation to resume or continue its operations, protect its rights, and fulfil its obligations after a disaster.</p>
                        <p><strong>Business Continuity:</strong> The primary goal of vital records management is to ensure business continuity. Without access to these records, an organisation may be unable to function, resulting in significant financial losses, legal liabilities, or even business failure.</p>
                        <p><strong>Legal and Financial Protection:</strong> Vital records often include legal documents, financial records, and ownership records, which are crucial for protecting an organisation\'s rights and assets.</p>
                        <p><strong>Operational Recovery:</strong> These records enable an organisation to quickly recover its operational capabilities, restore essential services, and resume normal business activities.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Identification of Vital Records',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>Business Impact Analysis:</strong> The first step in vital records management is to conduct a business impact analysis (BIA). This involves identifying the organisation\'s critical functions and processes and determining the impact of their disruption.</p>
                        <p><strong>Record Inventory:</strong> A comprehensive record inventory is conducted to identify all records held by the organisation. This inventory helps to determine which records are vital and which are not.</p>
                        <p><strong>Criteria for Vital Records:</strong> Records are typically classified as vital if they meet one or more of the following criteria:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Essential for resuming or continuing operations.</li>
                          <li>Necessary for protecting legal and financial rights.</li>
                          <li>Required to fulfil regulatory obligations.</li>
                          <li>Irreplaceable or difficult to reproduce.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '3. Protection and Preservation',
                    icon: <LockIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Duplication and Backup:</strong> Vital records should be duplicated or backed up regularly. This ensures that multiple copies of the records are available in case of loss or damage.</p>
                        <p><strong>Offsite Storage:</strong> Copies of vital records should be stored in secure offsite locations, away from the organisation\'s primary facilities. This protects the records from disasters that may affect the primary facilities.</p>
                        <p><strong>Environmental Controls:</strong> Physical vital records should be stored in environments with appropriate temperature and humidity controls to prevent deterioration.</p>
                        <p><strong>Digital Preservation:</strong> Digital vital records should be stored in secure digital repositories with robust backup and recovery systems. This includes consideration for long-term file format preservation.</p>
                        <p><strong>Security Measures:</strong> Access to vital records should be restricted to authorised personnel. This involves implementing security measures such as access controls, encryption, and physical security.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Recovery and Restoration',
                    icon: <RefreshCwIcon2 size={16} />,
                    content: (
                      <>
                        <p><strong>Disaster Recovery Plan:</strong> A disaster recovery plan should be developed to outline the procedures for recovering and restoring vital records after a disaster.</p>
                        <p><strong>Recovery Procedures:</strong> The plan should include detailed procedures for retrieving and restoring records from offsite storage or backup systems.</p>
                        <p><strong>Testing and Maintenance:</strong> The disaster recovery plan should be tested regularly to ensure its effectiveness. Vital records management procedures should be reviewed and updated periodically to reflect changes in the organisation\'s operations and technology.</p>
                        <p><strong>Prioritisation:</strong> Recovery of vital records should be prioritised based on the importance of the records to the continuation of the organisations core functions.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Legal and Regulatory Compliance',
                    icon: <ClipboardListIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Compliance Requirements:</strong> Organisations must comply with legal and regulatory requirements related to the preservation and protection of vital records.</p>
                        <p><strong>Auditing and Reporting:</strong> Regular audits should be conducted to ensure compliance with vital records management policies and procedures.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Technological Considerations',
                    icon: <Cloud size={16} />,
                    content: (
                      <>
                        <p><strong>Cloud Computing:</strong> Cloud computing offers secure and scalable storage solutions for vital records.</p>
                        <p><strong>Data Encryption:</strong> Data encryption protects vital records from unauthorised access.</p>
                        <p><strong>Automated Backup and Recovery:</strong> Automated backup and recovery systems ensure that vital records are regularly backed up and can be quickly restored.</p>
                      </>
                    ),
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 16: Procedures and Policies for Handling Vital Records */}
            <div
              ref={(el) => {
                sectionRefs.current['vital-procedures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procedures and Policies for Handling Vital Records
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Identification and Classification of Vital Records',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>Business Impact Analysis (BIA) Procedure:</strong> A formal procedure should be established for conducting a Business Impact Analysis (BIA). This involves a systematic evaluation of all organisational functions and processes to determine their criticality. The BIA should identify essential functions that, if disrupted, would significantly impact the organisation\'s operations, legal obligations, or financial stability. This procedure should outline the steps for conducting the BIA, including data collection, analysis, and documentation. It should also define the criteria for classifying records as vital, such as their legal, financial, or operational importance.</p>
                        <p><strong>Vital Records Inventory Policy:</strong> A policy should be created to mandate a comprehensive inventory of all organisational records. This inventory should document the location, format, and content of each record, as well as its retention requirements. The policy should specify the frequency of inventory updates and the responsibilities of different departments or individuals in maintaining the inventory. This policy ensures that all records are accounted for and that vital records are clearly identified and documented.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Protection and Preservation Procedures',
                    icon: <LockIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Duplication and Backup Procedure:</strong> A detailed procedure should be developed for duplicating and backing up vital records. This procedure should specify the frequency of backups, the types of backup media to be used, and the storage locations for backup copies. For digital records, it should outline the use of automated backup systems and the testing of backup integrity. For physical records, it should detail the process for creating and storing duplicate copies. This procedure minimises the risk of data loss and ensures that vital records can be restored quickly in the event of a disaster.</p>
                        <p><strong>Offsite Storage Policy:</strong> A policy should be established for the secure offsite storage of vital records. This policy should specify the criteria for selecting offsite storage locations, such as their distance from the organisation\'s primary facilities, their environmental controls, and their security measures. It should also define the procedures for transporting records to and from offsite storage, as well as the access controls for these locations. This policy ensures that vital records are protected from disasters that may affect the organisation\'s primary facilities.</p>
                        <p><strong>Environmental Control Procedure:</strong> A procedure should be implemented for maintaining appropriate environmental controls for the storage of physical vital records. This procedure should specify the temperature, humidity, and lighting requirements for different types of records, as well as the monitoring and maintenance of environmental control systems. This procedure helps to prevent the deterioration of physical records and ensures their long-term preservation.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Recovery and Restoration Procedures',
                    icon: <RefreshCwIcon2 size={16} />,
                    content: (
                      <>
                        <p><strong>Disaster Recovery Plan (DRP) Policy:</strong> A comprehensive Disaster Recovery Plan (DRP) policy should be established, outlining the procedures for recovering and restoring vital records after a disaster. This policy should define the roles and responsibilities of different personnel during a recovery, as well as the communication protocols and escalation procedures. It should also specify the steps for retrieving and restoring records from offsite storage or backup systems. This policy ensures a coordinated and efficient response to disasters.</p>
                        <p><strong>Recovery Prioritisation Procedure:</strong> A procedure should be developed for prioritising the recovery of vital records based on their importance to the organisation\'s operations. This procedure should define the criteria for prioritising recovery, such as the impact of record loss on critical functions and the time required for recovery. It should also specify the sequence in which records should be recovered and the resources required for each recovery step. This procedure ensures that the most critical records are recovered first, minimising disruption to operations.</p>
                        <p><strong>Testing and Maintenance Procedure:</strong> A procedure should be established for regularly testing and maintaining the disaster recovery plan and vital records management procedures. This procedure should specify the frequency of testing, the types of tests to be conducted, and the documentation of test results. It should also outline the process for reviewing and updating the plan and procedures to reflect changes in the organisation\'s operations and technology. This procedure ensures that the plan and procedures remain effective and up to date.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Legal and Compliance Policies',
                    icon: <ClipboardListIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Regulatory Compliance Policy:</strong> A policy should be established to ensure compliance with all applicable legal and regulatory requirements related to the preservation and protection of vital records. This policy should specify the relevant laws and regulations, as well as the organisation\'s responsibilities for compliance. It should also outline the procedures for auditing and reporting compliance. This policy ensures that the organisation meets its legal obligations and avoids penalties.</p>
                        <p><strong>Access Control Policy:</strong> A policy should be implemented to restrict access to vital records to authorised personnel. This policy should specify the access levels for different roles and responsibilities, as well as the procedures for granting and revoking access. It should also outline the security measures for protecting vital records from unauthorised access, such as password protection, encryption, and physical security. This policy protects sensitive information and ensures compliance with privacy regulations.</p>
                      </>
                    ),
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 17: Handling Classified Documents and Files */}
            <div
              ref={(el) => {
                sectionRefs.current['classified'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Handling Classified Documents and Files
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Security Clearance and Access Control',
                    icon: <Shield size={16} />,
                    content: 'Access to classified information is strictly limited to individuals with the appropriate security clearance and a "need-to-know." This means that even if someone has a clearance, they can only access information relevant to their specific job duties. Security clearances are granted after thorough background checks and investigations, verifying an individual\'s trustworthiness and reliability. Access control measures include physical security, such as locked rooms and safes, as well as digital security, such as user authentication, access control lists, and encryption. These measures ensure that only authorised personnel can access classified materials, preventing unauthorised disclosure and protecting sensitive information.',
                  },
                  {
                    title: '2. Marking and Labelling',
                    icon: <TagIcon size={16} />,
                    content: 'Classified documents must be clearly and consistently marked to indicate their classification level (e.g., Confidential, Secret, Top Secret). These markings are typically placed on the top and bottom of each page and on the front and back covers of the document. Standardised labelling ensures that everyone handling the document understands its classification and handles it accordingly. Additionally, specific handling instructions and distribution limitations may be included on the document. Proper marking and labelling are essential for maintaining awareness of the document\'s sensitivity and preventing inadvertent disclosure.',
                  },
                  {
                    title: '3. Secure Storage and Handling',
                    icon: <LockIcon size={16} />,
                    content: 'Classified documents must be stored in secure containers, such as locked safes or vaults, that meet specific security standards. These containers are often equipped with combination locks or electronic access controls to prevent unauthorised access. When handling classified documents, personnel must adhere to strict protocols, such as keeping the documents under constant supervision and preventing unauthorised copying or reproduction. Documents should never be left unattended, and they must be returned to secure storage when not in use. Secure storage and handling procedures are designed to minimise the risk of unauthorised access and ensure the physical security of classified materials.',
                  },
                  {
                    title: '4. Transmission and Transportation',
                    icon: <Send size={16} />,
                    content: 'Classified documents must be transmitted and transported using secure methods that prevent unauthorised interception or disclosure. This may involve using secure couriers, encrypted electronic transmission, or other specialised methods. When transporting classified documents, personnel must adhere to strict security protocols, such as using sealed containers and maintaining constant surveillance. Digital documents when transmitted need to use encryption and other security measures to prevent access. Secure transmission and transportation procedures are essential for maintaining the confidentiality of classified information during transit.',
                  },
                  {
                    title: '5. Destruction and Disposal',
                    icon: <TrashIcon size={16} />,
                    content: 'Classified documents must be destroyed or disposed of using approved methods that ensure the complete destruction of the information. This may involve shredding, burning, or pulverising physical documents, or securely wiping or degaussing digital storage media. Approved destruction methods are designed to prevent the reconstruction or retrieval of classified information. Proper destruction and disposal procedures are essential for preventing unauthorised access to classified information after it is no longer needed.',
                  },
                  {
                    title: '6. Digital Security Measures',
                    icon: <CpuIcon size={16} />,
                    content: 'Classified digital files require robust security measures to protect them from unauthorised access, modification, or disclosure. This includes using strong passwords, encryption, access control lists, and intrusion detection systems. Digital security measures also include regular backups and disaster recovery plans to ensure the availability of classified information in the event of a system failure or disaster. Organisations need to stay up to date on cyber security threats and implement appropriate countermeasures.',
                  },
                  {
                    title: '7. Training and Awareness',
                    icon: <GraduationCap size={16} />,
                    content: 'Personnel who handle classified documents must receive thorough training on security protocols and procedures. This training should cover topics such as security clearances, access control, marking and labelling, secure storage and handling, transmission and transportation, and destruction and disposal. Regular training and awareness programs help to reinforce security protocols and ensure that personnel understand their responsibilities in protecting classified information.',
                  },
                  {
                    title: '8. Audits and Inspections',
                    icon: <ClipboardListIcon size={16} />,
                    content: 'Regular audits and inspections are conducted to ensure compliance with security protocols and procedures. These audits may involve reviewing security logs, inspecting secure storage facilities, and conducting interviews with personnel. Audits and inspections help to identify and address any security vulnerabilities or non-compliance issues.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 18: Information Security */}
            <div
              ref={(el) => {
                sectionRefs.current['security'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Information Security
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Confidentiality',
                    icon: <Shield size={16} />,
                    content: 'Confidentiality ensures that sensitive information is accessible only to authorised individuals. This involves implementing measures to prevent unauthorised disclosure of data, whether it is personal information, financial records, or intellectual property. Techniques like encryption, access control lists, and user authentication are used to restrict access to sensitive data. For example, encrypting a database containing customer credit card information ensures that even if unauthorised individuals gain access, the data remains unreadable. Confidentiality is crucial for maintaining trust with customers, partners, and stakeholders, and it helps organisations comply with privacy regulations.',
                  },
                  {
                    title: '2. Integrity',
                    icon: <CheckCircleIcon2 size={16} />,
                    content: 'Integrity ensures that information is accurate and complete, and that it has not been altered or tampered with by unauthorised individuals. This involves implementing measures to prevent unauthorised modification or deletion of data, ensuring that information remains reliable and trustworthy. Techniques like digital signatures, checksums, and version control are used to maintain data integrity. For example, using digital signatures on electronic documents ensures that any changes made to the document can be detected. Integrity is essential for maintaining the accuracy of financial records, legal documents, and other critical information.',
                  },
                  {
                    title: '3. Availability',
                    icon: <ServerIcon size={16} />,
                    content: 'Availability ensures that information and information systems are accessible to authorised users when needed. This involves implementing measures to prevent disruptions to information systems, such as power outages, hardware failures, and cyberattacks. Techniques like redundant systems, backup and recovery procedures, and disaster recovery plans are used to ensure that information remains accessible even in the event of a disruption. For example, having redundant servers and offsite backups ensures that critical systems can be restored quickly after a power outage. Availability is crucial for maintaining business continuity and ensuring that essential services remain operational.',
                  },
                  {
                    title: '4. Authentication',
                    icon: <KeyIcon size={16} />,
                    content: 'Authentication is the process of verifying the identity of a user or device attempting to access information systems. This involves using techniques like passwords, biometrics, and multi-factor authentication to ensure that only authorised users can access sensitive data. Strong authentication is a critical first line of defence against unauthorised access, preventing attackers from impersonating legitimate users.',
                  },
                  {
                    title: '5. Authorisation',
                    icon: <LockIcon size={16} />,
                    content: 'Authorisation determines what actions a user or device is allowed to perform after they have been authenticated. This involves implementing access control lists and role-based access control to restrict users to only the resources and functions they need to perform their job duties. Proper authorisation prevents users from accessing or modifying data that they are not authorised to view or change.',
                  },
                  {
                    title: '6. Non-Repudiation',
                    icon: <FileTextIcon size={16} />,
                    content: 'Non-repudiation ensures that a user cannot deny having performed a particular action. This involves using techniques like digital signatures and audit trails to provide irrefutable evidence of user actions. Non-repudiation is essential for legal and compliance purposes, as it provides a record of who performed what actions on a particular system.',
                  },
                  {
                    title: '7. Risk Management',
                    icon: <Target size={16} />,
                    content: 'Risk management is the process of identifying, assessing, and mitigating security risks. This involves conducting risk assessments, developing security policies and procedures, and implementing security controls. Risk management is an ongoing process that requires continuous monitoring and evaluation to ensure that security measures remain effective.',
                  },
                  {
                    title: '8. Security Policies and Procedures',
                    icon: <FileTextIcon size={16} />,
                    content: 'Security policies and procedures provide a framework for managing information security within an organisation. These documents outline the organisation\'s security goals, responsibilities, and procedures. They also provide guidance on how to handle security incidents and comply with relevant regulations.',
                  },
                  {
                    title: '9. Security Awareness Training',
                    icon: <GraduationCap size={16} />,
                    content: 'Security awareness training educates employees about security threats and best practices. This training helps to prevent security incidents caused by human error, such as phishing attacks and social engineering. Regular training sessions and awareness campaigns are essential for maintaining a strong security culture within an organisation.',
                  },
                  {
                    title: '10. Incident Response',
                    icon: <ShieldAlert size={16} />,
                    content: 'Incident response involves the procedures and actions taken when a security incident occurs. This includes detecting, containing, eradicating, and recovering from security breaches. A well-defined incident response plan minimises the impact of security incidents and ensures that they are handled efficiently and effectively.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 File Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <RefreshIcon size={16} className="text-indigo-500 dark:text-indigo-400" />
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
                  <span>File Formats</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>File Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Security Pillars</span>
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
                Effective file management boosts productivity, security, and compliance. Use consistent naming, indexing, and filing systems. Protect vital records with backups and offsite storage. Classified documents require strict access controls and secure handling. Information security rests on confidentiality, integrity, and availability – the CIA triad.
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
                <strong className="text-white">File Management Benefits</strong> – Enhances productivity, security, storage efficiency, collaboration, retrieval, and compliance. Organised files save time and reduce risks.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Records Formats &amp; Filing</strong> – Paper, digital, electronic, financial, legal, and multimedia records. Active filing room duties include filing, retrieval, maintenance, security, retention, and auditing.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Naming, Indexing &amp; Organisation</strong> – Use clear, consistent names with dates and versions. Indexing with controlled vocabularies improves search. File series group related records for better management.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Vital &amp; Classified Records</strong> – Vital records are essential for business continuity; protect with backups and offsite storage. Classified documents require clearances, secure handling, and proper destruction.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Information Security</strong> – CIA triad: Confidentiality (access control), Integrity (accuracy), Availability (uptime). Authentication, authorisation, risk management, and incident response are key.
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
            Sidemann Academic Registry • Records &amp; Information Management – Learning Outcome 1 (File Management)
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;