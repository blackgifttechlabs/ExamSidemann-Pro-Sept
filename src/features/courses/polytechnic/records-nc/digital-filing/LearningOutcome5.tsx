import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Hash,
  Paperclip,
  Search as SearchIcon,
  Clock as ClockIcon,
  Layout,
  HardDrive as HardDriveIcon,
  Edit,
  Target,
  Globe as GlobeIcon,
  Shield,
  ListChecks,
  Settings as SettingsIcon,
  Type,
  BookOpen,
  Layers as LayersIcon,
  FileText,
  Scissors,
  Circle as CircleIcon,
  Archive,
  Database,
  User,
  Calendar,
  CheckCircle,
  Send,
  ShieldCheck,
  Bell,
  RefreshCw,
  File,
  Folder,
  Clipboard,
  Mail,
  Lock,
  Eye,
  AlertCircle,
  Trash2,
  Cloud,
  Server,
  Disc,
  Box,
  Home,
  Warehouse,
  Zap,
  MapPin,
  DollarSign,
  Sun,
  FireExtinguisher,
  Bug,
  Users,
  BarChart,
  FilePlus,
  FileText as FileTextIcon2,
  BookOpen as BookOpenIcon,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  CheckCircle as CheckCircleIcon,
  RefreshCw as RefreshCwIcon2,
  AlertCircle as AlertCircleIcon,
  ClipboardList,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'elements', label: 'Inventory Elements' },
  { id: 'importance', label: 'Inventory Importance' },
  { id: 'procedures', label: 'Carrying Out Inventory' },
  { id: 'updating', label: 'Updating Inventory' },
  { id: 'principles', label: 'Records Control' },
  { id: 'monitoring', label: 'Movement Control' },
  { id: 'tracking', label: 'Tracking Systems' },
  { id: 'compliance', label: 'Compliance Audit' },
  { id: 'legal', label: 'Legal & Ethical' },
  { id: 'census', label: 'File Census' },
  { id: 'missing', label: 'Tracing Missing Files' },
  { id: 'audit-trails', label: 'Audit Trails' },
  { id: 'updating-cards', label: 'Updating Cards' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome5: React.FC = () => {
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
        text: 'Regular inventory audits can reduce the risk of lost records by up to 80% and significantly improve retrieval efficiency.',
      },
      {
        title: 'Pro Tip',
        text: 'When conducting a file census, always start with high-risk areas where sensitive or critical records are stored to quickly identify potential issues.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key inventory elements with "U-D-F-L-C-R-R-A-M": Unique ID, Description, Format, Location, Creation Date, Retention, Restrictions, Status, Metadata.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations forget to update their inventory after disposing of records, leading to inaccurate counts and compliance risks.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Regular inventory audits can reduce the risk of lost records by up to 80% and significantly improve retrieval efficiency.',
      },
      {
        title: 'Pro Tip',
        text: 'When conducting a file census, always start with high-risk areas where sensitive or critical records are stored to quickly identify potential issues.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key inventory elements with "U-D-F-L-C-R-R-A-M": Unique ID, Description, Format, Location, Creation Date, Retention, Restrictions, Status, Metadata.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations forget to update their inventory after disposing of records, leading to inaccurate counts and compliance risks.',
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
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Inventory, Control &{' '}
            <span className="text-rose-300 font-bold italic">
              Audit Procedures
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to records inventory, tracking systems, compliance audits, and file movement control.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ListChecks size={14} className="inline mr-1" /> Inventory
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Audit
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Control
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
                placeholder="Search for a concept, procedure, system..."
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
            {/* SECTION 1: Elements of an Inventory */}
            <div
              ref={(el) => {
                sectionRefs.current['elements'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Elements of an Inventory
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    An inventory, in the context of records management, refers to a comprehensive list of all records held by an organization. It is a foundational tool for effective records management, providing a clear picture of what records exist, where they are located, and their key characteristics. Here is a breakdown of the essential elements of an inventory:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Unique Identifier',
                    icon: <Hash size={16} />,
                    content: 'Every record listed in an inventory must have a unique identifier. This identifier acts as a distinct marker, ensuring that each record can be precisely located and tracked. It prevents confusion and duplication, especially in large organizations with numerous records. The unique identifier can be a file number, a barcode, a digital object identifier (DOI), or any other system that assigns a unique value to each record. This identifier is crucial for linking the inventory entry to the physical or digital record itself, facilitating efficient retrieval and management.',
                  },
                  {
                    title: '2. Record Title or Description',
                    icon: <FileText size={16} />,
                    content: 'A clear and concise title or description of the record is essential for understanding its content and purpose. This element provides context and allows users to quickly identify the record they need. The title or description should be specific enough to differentiate the record from others but concise enough to be easily readable. For example, instead of "Document," use "Project Proposal - Client A - 2023-10-27." This element helps users to understand the record\'s subject matter, date, and other relevant details, making it easier to search and retrieve.',
                  },
                  {
                    title: '3. Record Format',
                    icon: <File size={16} />,
                    content: 'The format of the record indicates the medium in which it is stored. This can include paper documents, digital files (e.g., PDF, Word, Excel), audio recordings, video recordings, or microfilm. Understanding the record format is crucial for determining the appropriate storage and handling requirements. For example, paper documents may require filing cabinets or archival boxes, while digital files may need secure servers or cloud storage. This element ensures that records are stored in a manner that preserves their integrity and accessibility.',
                  },
                  {
                    title: '4. Record Location',
                    icon: <MapPin size={16} />,
                    content: 'The location of the record indicates where it is physically or digitally stored. For physical records, this might include the file cabinet, shelf, or storage room. For digital records, this might include the server, folder, or cloud storage location. Accurate location information is essential for retrieving records quickly and efficiently. This element helps to minimize search time and ensures that records can be located when needed.',
                  },
                  {
                    title: '5. Record Creation Date or Date Range',
                    icon: <Calendar size={16} />,
                    content: 'The creation date or date range of the record provides a chronological context for the information it contains. This element is crucial for understanding the record\'s relevance and for applying retention schedules. For example, financial records may need to be retained for a specific period after the end of the fiscal year. The creation date or date range helps to determine when records can be disposed of or transferred to archival storage.',
                  },
                  {
                    title: '6. Record Creator or Author',
                    icon: <User size={16} />,
                    content: 'The creator or author of the record provides information about its origin and context. This element can be helpful for understanding the record\'s purpose and for identifying the individuals or departments responsible for its content. For example, knowing the author of a report can provide insights into their perspective and expertise. This element can also be helpful for tracking accountability and ensuring that records are properly attributed.',
                  },
                  {
                    title: '7. Record Retention Schedule',
                    icon: <ClockIcon size={16} />,
                    content: 'The retention schedule specifies how long a record must be kept, based on legal, regulatory, and business requirements. This element is crucial for ensuring compliance and for managing storage space efficiently. The retention schedule may indicate when a record can be disposed of or transferred to archival storage. This element helps to prevent the unnecessary accumulation of records and ensures that they are retained for the appropriate duration.',
                  },
                  {
                    title: '8. Record Access Restrictions',
                    icon: <Lock size={16} />,
                    content: 'Access restrictions indicate who is authorized to view or modify the record. This element is essential for protecting sensitive information and ensuring compliance with privacy regulations. Access restrictions may be based on job roles, security clearances, or other criteria. This element helps to prevent unauthorized access and ensures that records are only accessible to authorized personnel.',
                  },
                  {
                    title: '9. Record Status',
                    icon: <CircleIcon size={16} />,
                    content: 'The status of the record indicates its current state, such as active, inactive, or archived. This element helps to manage the lifecycle of records and ensures that they are handled appropriately. For example, active records may be stored in easily accessible locations, while archived records may be stored in long-term storage facilities. This element helps to streamline records management and ensures that records are handled according to their current stage.',
                  },
                  {
                    title: '10. Record Metadata',
                    icon: <Database size={16} />,
                    content: 'Metadata is data about data, providing additional information about the record. This can include keywords, subject headings, file size, and other relevant details. Metadata enhances searchability and retrieval, making it easier to locate specific records. Metadata can be embedded within digital files or stored in a separate database. This element helps to improve the efficiency and effectiveness of records management.',
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

            {/* SECTION 2: Importance of an Inventory */}
            <div
              ref={(el) => {
                sectionRefs.current['importance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Importance of an Inventory
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    An inventory, in the context of records management, is a crucial tool that provides a comprehensive overview of an organization's records. Its importance stems from its ability to facilitate efficient management, ensure compliance, and mitigate risks. Here is a breakdown of the key reasons why an inventory is essential:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Enhanced Records Organization and Retrieval',
                    icon: <Layout size={16} />,
                    content: 'An inventory acts as a roadmap to an organization\'s records, providing a structured and organized view of all information assets. By cataloguing records with unique identifiers, clear descriptions, and location details, an inventory enables quick and efficient retrieval. This is particularly vital in large organizations where records are dispersed across various departments and locations. A well-maintained inventory minimizes the time spent searching for files, reducing operational inefficiencies, and improving productivity. Employees can quickly locate the required information, supporting timely decision-making and efficient workflows.',
                  },
                  {
                    title: '2. Improved Compliance with Legal and Regulatory Requirements',
                    icon: <Shield size={16} />,
                    content: 'Many industries and jurisdictions have strict regulations regarding the retention and management of records. An inventory helps organizations ensure compliance with these requirements by providing a clear overview of all records and their associated retention schedules. By tracking record creation dates and retention periods, organizations can avoid legal penalties and fines associated with non-compliance. An inventory also facilitates audits and inspections, demonstrating that the organization has a robust records management system in place. This is especially important for sectors dealing with sensitive data, such as healthcare, finance, and law.',
                  },
                  {
                    title: '3. Efficient Records Retention and Disposal',
                    icon: <Trash2 size={16} />,
                    content: 'An inventory supports efficient records retention and disposal by providing a systematic approach to managing the lifecycle of records. By documenting retention schedules, organizations can ensure that records are retained for the appropriate duration and disposed of when no longer needed. This prevents the unnecessary accumulation of records, freeing up valuable storage space and reducing storage costs. An inventory also helps to identify obsolete or redundant records that can be safely disposed of, improving the overall efficiency of records management.',
                  },
                  {
                    title: '4. Risk Mitigation and Business Continuity',
                    icon: <Target size={16} />,
                    content: 'An inventory plays a crucial role in mitigating risks associated with lost or damaged records. By documenting the location and format of records, organizations can ensure that backups and duplicates are created and stored securely. In the event of a disaster, such as a fire, flood, or cyberattack, an inventory can help to identify critical records that need to be recovered quickly. This supports business continuity by minimizing disruptions and ensuring that essential information remains accessible. An inventory also facilitates risk assessments by identifying sensitive or confidential records that require additional security measures.',
                  },
                  {
                    title: '5. Enhanced Data Security and Access Control',
                    icon: <Lock size={16} />,
                    content: 'An inventory helps to improve data security and access control by documenting access restrictions for each record. By specifying who is authorized to view or modify records, organizations can prevent unauthorized access and protect sensitive information. This is particularly important for records containing personal data, financial information, or trade secrets. An inventory also helps to track user access and identify potential security breaches, ensuring that data is protected from unauthorized use.',
                  },
                  {
                    title: '6. Facilitation of Audits and Inspections',
                    icon: <Clipboard size={16} />,
                    content: 'An inventory simplifies the process of audits and inspections by providing a comprehensive overview of all records. Auditors and inspectors can quickly assess the organization\'s records management practices and verify compliance with applicable regulations. An inventory also helps to demonstrate that the organization has a robust records management system in place, improving its credibility and reputation.',
                  },
                  {
                    title: '7. Improved Information Governance',
                    icon: <SettingsIcon size={16} />,
                    content: 'An inventory supports effective information governance by providing a foundation for developing and implementing records management policies and procedures. By understanding what records exist and how they are managed, organizations can establish clear guidelines for record creation, storage, retrieval, and disposal. An inventory also helps to ensure that records management practices are consistent across the organization, improving overall information governance.',
                  },
                  {
                    title: '8. Cost Reduction and Resource Optimization',
                    icon: <DollarSign size={16} />,
                    content: 'By streamlining records management processes and reducing the time spent searching for files, an inventory can help to reduce costs and optimize resource allocation. Efficient records management minimizes the need for excessive storage space, reduces labour costs associated with manual file retrieval, and improves overall operational efficiency. An inventory also helps to identify opportunities for process improvement and automation, further reducing costs and improving resource utilization.',
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

            {/* SECTION 3: Procedures of Carrying Out an Inventory */}
            <div
              ref={(el) => {
                sectionRefs.current['procedures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procedures of Carrying Out an Inventory
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Carrying out a records inventory requires a systematic and thorough approach to ensure accuracy and completeness. Here is a breakdown of the procedures involved:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Planning and Preparation',
                    icon: <ListChecks size={16} />,
                    content: 'Before starting the inventory, it is essential to develop a comprehensive plan. This includes defining the scope of the inventory, determining the types of records to be included, and establishing a timeline for completion. Identify the individuals or teams responsible for conducting the inventory and assign specific tasks. Develop a standardized inventory form or template to ensure consistency in data collection. This form should include fields for all essential elements, such as unique identifiers, record titles, formats, locations, creation dates, retention schedules, and access restrictions. Schedule meetings with relevant departments and stakeholders to explain the inventory process and gather input. This planning phase is crucial for ensuring that the inventory is conducted efficiently and effectively.',
                  },
                  {
                    title: '2. Data Collection',
                    icon: <Database size={16} />,
                    content: 'The core of the inventory process involves collecting data about each record. This can be done through various methods, such as physical inspection of filing cabinets and storage areas, interviews with departmental staff, and reviews of existing records management systems. Ensure all data collectors are trained on the standardized inventory form and the procedures for accurately recording information. For physical records, meticulously examine each file, folder, and box, noting down the required information. For electronic records, review file directories, databases, and document management systems. Use consistent terminology and formatting to ensure data accuracy. This step requires patience and attention to detail to capture all relevant information.',
                  },
                  {
                    title: '3. Data Entry and Organization',
                    icon: <Edit size={16} />,
                    content: 'Once data is collected, it must be entered into a centralized database or spreadsheet. This step involves transcribing the information from the inventory forms or notes into the designated system. Ensure data is entered accurately and consistently, following the established formatting guidelines. Organize the data logically, using categories and filters to facilitate easy searching and retrieval. This step is critical for transforming raw data into a usable inventory. Consider using records management software that offers features like automated data entry and reporting.',
                  },
                  {
                    title: '4. Data Validation and Verification',
                    icon: <CheckCircle size={16} />,
                    content: 'After data entry, it is essential to validate and verify the accuracy of the information. This involves cross-referencing the inventory data with existing records and conducting spot checks to identify any discrepancies or errors. Verify that all unique identifiers are accurate and that record locations are correctly noted. Conduct follow-up interviews with departmental staff to clarify any ambiguous or incomplete information. This step is crucial for ensuring the reliability of the inventory and preventing errors that could lead to lost or misplaced records.',
                  },
                  {
                    title: '5. Data Analysis and Reporting',
                    icon: <BarChart size={16} />,
                    content: 'Once the data is validated, analyse it to identify trends, patterns, and areas for improvement. Generate reports that summarize the inventory findings, highlighting key information such as the volume of records, their formats, locations, and retention schedules. This analysis can help to identify opportunities for streamlining records management processes, reducing storage costs, and improving compliance. Use the inventory data to develop recommendations for improving records management practices, such as implementing standardized filing systems, digitizing paper records, or updating retention schedules. Present the inventory findings and recommendations to management and relevant stakeholders.',
                  },
                  {
                    title: '6. Development of a Records Retention Schedule',
                    icon: <ClockIcon size={16} />,
                    content: 'Using the data gathered, develop, or update the organization\'s records retention schedule. This schedule should outline how long each type of record must be retained, based on legal, regulatory, and business requirements. Ensure all departments are aware of and comply with the retention schedule. This step helps to prevent the unnecessary accumulation of records and ensures that they are disposed of appropriately.',
                  },
                  {
                    title: '7. Implementation of Records Management Policies and Procedures',
                    icon: <SettingsIcon size={16} />,
                    content: 'Based on the inventory findings and recommendations, implement new or updated records management policies and procedures. This may involve developing guidelines for record creation, storage, retrieval, and disposal. Provide training to employees on the new policies and procedures to ensure consistent implementation. This step helps to establish a robust records management framework and ensures that records are handled consistently across the organization.',
                  },
                  {
                    title: '8. Ongoing Maintenance and Updates',
                    icon: <RefreshCw size={16} />,
                    content: 'A records inventory is not a one-time activity. It requires ongoing maintenance and updates to ensure that it remains accurate and relevant. Establish procedures for regularly updating the inventory as new records are created or existing records are modified. Schedule periodic reviews of the inventory to identify any changes or discrepancies. This step ensures that the inventory remains a valuable tool for records management and that it continues to support the organization\'s information needs.',
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

            {/* SECTION 4: Updating an Inventory */}
            <div
              ref={(el) => {
                sectionRefs.current['updating'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Updating an Inventory
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Updating a records inventory is a continuous process that ensures the inventory remains accurate and relevant over time. It is not a one-time task but an ongoing activity that reflects changes in an organization's records and information landscape. Here is a breakdown of the procedures for updating an inventory:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Regular Review and Audits',
                    icon: <SearchIcon size={16} />,
                    content: 'Conduct periodic reviews and audits of the inventory to identify any discrepancies or outdated information. This involves comparing the inventory data with the physical and electronic records to ensure accuracy. Schedule these reviews at regular intervals, such as quarterly or annually, depending on the volume and rate of change in your records. Audits should also involve spot-checking randomly selected records to verify their information. This process is crucial for catching errors or omissions that may have occurred since the last update. Regular reviews and audits ensure that the inventory remains a reliable source of information for records management.',
                  },
                  {
                    title: '2. Incorporating New Records',
                    icon: <FilePlus size={16} />,
                    content: 'As new records are created or acquired, they must be added to the inventory promptly. Establish a process for regularly updating the inventory with new additions. This may involve assigning responsibility to specific individuals or departments to ensure that new records are properly catalogued. Ensure that all required fields, such as unique identifiers, record titles, formats, locations, and retention schedules, are accurately recorded for each new record. This step is essential for maintaining a comprehensive and up-to-date inventory that reflects the organization\'s current records holdings.',
                  },
                  {
                    title: '3. Updating Existing Records',
                    icon: <Edit size={16} />,
                    content: 'Existing records may undergo changes, such as updates to their locations, formats, or retention schedules. These changes must be reflected in the inventory to maintain accuracy. Establish a process for tracking and updating these changes. This may involve regular communication with departments that manage records or automated updates through records management software. Ensure that any changes are documented and that the inventory is updated in a timely manner. This step is crucial for ensuring that the inventory accurately reflects the current state of records.',
                  },
                  {
                    title: '4. Removing Disposed Records',
                    icon: <Trash2 size={16} />,
                    content: 'When records are disposed of according to the organization\'s retention schedule, they must be removed from the inventory. Establish a process for documenting and tracking record disposal. This may involve recording the disposal date, method of disposal, and authorization for disposal. Ensure that the inventory is updated promptly to reflect the removal of these records. This step is essential for maintaining an accurate inventory and preventing the unnecessary storage of obsolete information.',
                  },
                  {
                    title: '5. Updating Metadata and Access Controls',
                    icon: <Database size={16} />,
                    content: 'Metadata, such as keywords, subject headings, and file sizes, can change over time. Regularly review and update metadata to ensure that it remains accurate and relevant. Access controls may also need to be updated as personnel changes or security requirements evolve. Ensure that access restrictions are reviewed and updated accordingly. Regularly reviewing and updating metadata and access controls ensures that records are easily searchable, and that sensitive information is protected.',
                  },
                  {
                    title: '6. Integrating with Records Management Systems',
                    icon: <Server size={16} />,
                    content: 'If the organization uses a records management system (RMS), integrate the inventory with the RMS to automate updates and streamline processes. This may involve setting up automated data synchronization or using API integrations to ensure that the inventory is updated in real-time. Integrating the inventory with an RMS can improve efficiency and reduce the risk of errors.',
                  },
                  {
                    title: '7. Training and Communication',
                    icon: <Users size={16} />,
                    content: 'Provide regular training to employees on the procedures for updating the inventory. This training should cover the importance of accuracy, the steps involved in updating the inventory, and the consequences of non-compliance. Communicate any changes to the inventory or update procedures to all relevant personnel. This step is crucial for ensuring that everyone understands their responsibilities and that the inventory is updated consistently and accurately.',
                  },
                  {
                    title: '8. Documenting Updates',
                    icon: <Clipboard size={16} />,
                    content: 'Maintain a log or audit trail of all inventory updates. This documentation should include the date of the update, the changes made, and the person responsible for the update. Documenting updates provides a record of changes and can be helpful for auditing purposes or resolving disputes. This step ensures accountability and transparency in the inventory update process.',
                  },
                  {
                    title: '9. Continuous Improvement',
                    icon: <Zap size={16} />,
                    content: 'Regularly evaluate the inventory update process and identify areas for improvement. This may involve soliciting feedback from employees, reviewing industry best practices, and exploring new technologies. Continuously improve the inventory update process to ensure that it remains efficient and effective. This step helps to ensure that the inventory remains a valuable tool for records management and that it continues to support the organization\'s information needs.',
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

            {/* SECTION 5: Principles of Records Control */}
            <div
              ref={(el) => {
                sectionRefs.current['principles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Principles of Records Control
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Understanding the principles of records control is crucial for any organization aiming for efficiency, compliance, and accountability. Here is a breakdown of key principles, explained in detail:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Accountability',
                    icon: <Users size={16} />,
                    content: 'This principle emphasizes the importance of assigning clear responsibility for the management of records. In essence, someone within the organization must be held accountable for ensuring that records are properly created, maintained, and disposed of. This involves establishing clear lines of authority and responsibility, so that everyone understands their role in the records management process. When accountability is in place, it becomes easier to track the origin of records, monitor their use, and ensure their integrity. This principle is fundamental because without it, records can become disorganized, lost, or mishandled, leading to potential legal and operational problems. Clear accountability allows for audits, and for the ability to trace any changes made to records.',
                  },
                  {
                    title: '2. Protection',
                    icon: <Shield size={16} />,
                    content: 'Records often contain sensitive information that needs to be protected from unauthorized access, alteration, or destruction. This principle involves implementing security measures to safeguard records, whether they are in physical or digital format. For physical records, this might include secure storage facilities, access controls, and fire protection. For digital records, it could involve encryption, firewalls, and access permissions. The level of protection should be commensurate with the sensitivity of the information. Protection also covers the protection of records from degradation. Physical records can degrade over time, and digital records can be corrupted. Therefore, proper environmental controls and regular digital backups are also a part of this principle.',
                  },
                  {
                    title: '3. Integrity',
                    icon: <CheckCircle size={16} />,
                    content: 'Integrity refers to the accuracy and reliability of records. It is essential to ensure that records are authentic and have not been tampered with. This principle involves implementing procedures to maintain the consistency and completeness of records throughout their lifecycle. For digital records, this may involve using audit trails to track changes and verify authenticity. For physical records, it might involve using tamper-evident seals and maintaining accurate documentation. Maintaining integrity builds trust in the records, which is crucial for legal, financial, and operational purposes.',
                  },
                  {
                    title: '4. Compliance',
                    icon: <Clipboard size={16} />,
                    content: 'Organizations must adhere to an intricate web of legal, regulatory, and industry-specific mandates concerning records management. This principle necessitates a comprehensive understanding of these requirements, which can vary significantly depending on the organization\'s sector, geographical location, and operational scope. Compliance ensures that the organization fulfils its legal obligations, mitigates potential risks, and avoids costly penalties. For example, financial institutions are often subject to stringent record-keeping regulations related to anti-money laundering and know-your-customer (KYC) requirements, while healthcare providers must comply with data privacy laws such as HIPAA, which govern the handling of patient medical records. Similarly, environmental agencies may be required to maintain detailed records of emissions and waste disposal practices to comply with environmental regulations. Furthermore, compliance extends beyond simply adhering to existing laws and regulations. It also involves staying abreast of evolving legal landscapes, as laws and regulations can change over time. Organizations must proactively monitor and adapt to these changes to ensure ongoing compliance. This may involve conducting regular legal audits, seeking expert legal advice, and implementing robust compliance management systems. Moreover, compliance is not solely about avoiding penalties; it also fosters a culture of ethical and responsible data handling. By prioritizing compliance, organizations demonstrate their commitment to transparency, accountability, and good governance, which can enhance their reputation and build trust with stakeholders. This involves establishing clear policies and procedures for records management, providing regular training to employees on compliance requirements, and implementing robust internal controls to ensure adherence to these requirements. In addition, compliance often requires organizations to maintain detailed documentation of their records management practices, including retention schedules, destruction policies, and access controls. This documentation serves as evidence of compliance and can be used to demonstrate due diligence in the event of an audit or legal inquiry. Organizations must also consider the international dimensions of compliance, particularly if they operate in multiple jurisdictions. This may involve navigating complex and sometimes conflicting legal frameworks, requiring careful consideration of cross-border data transfers, international privacy laws, and other international regulations. In essence, compliance is an ongoing process that requires continuous monitoring, adaptation, and improvement. It is a fundamental principle of records control that ensures organizations operate within the bounds of the law, protect sensitive information, and maintain the integrity of their records.',
                  },
                  {
                    title: '5. Availability',
                    icon: <SearchIcon size={16} />,
                    content: 'Records must be readily accessible when needed, ensuring that information is available to those who require it, at the moment they need it. This principle involves implementing systems and procedures to ensure that authorized personnel can quickly and easily retrieve records, supporting business operations, responding to legal requests, and providing evidence in audits. Modern record management systems, with proper metadata, are essential to achieve good availability. This requires careful consideration of the organization\'s information needs, the types of records it creates and maintains, and the various ways in which those records might be used. A well-designed availability strategy ensures that authorized personnel can access records regardless of their location, time zone, or device. This might involve implementing cloud-based storage solutions, mobile access capabilities, and remote retrieval tools. Additionally, it is crucial to establish clear access controls and permissions, ensuring that only authorized personnel can access sensitive or confidential information. This involves implementing robust authentication and authorization mechanisms, such as passwords, multi-factor authentication, and role-based access controls. Moreover, the availability of records should be considered in the context of disaster recovery and business continuity planning. This involves implementing backup and recovery procedures to ensure that critical records can be restored in the event of a system failure, natural disaster, or other disruptive event. Regular backups, offsite storage, and disaster recovery testing are essential components of a comprehensive availability strategy. Furthermore, the availability of records should be monitored and measured to ensure that it meets the organization\'s needs and performance standards. This involves tracking metrics such as retrieval time, system uptime, and user satisfaction. Regular reporting and analysis can help identify areas for improvement and ensure that the availability of records remains optimal. The design of metadata is also very important here. Metadata is data about data. By using proper metadata, users can quickly and precisely locate records. For example, a document about a specific project can have metadata tags such as project name, author, date, and keywords. This allows users to search for the document using any of these tags, significantly reducing the retrieval time. Availability is not just about making records accessible; it is about making them accessible in a way that is efficient, secure, and aligned with the organization\'s operational needs.',
                  },
                  {
                    title: '6. Retention',
                    icon: <ClockIcon size={16} />,
                    content: 'Records should be retained for the appropriate period, as determined by legal, regulatory, and business requirements. This principle involves establishing retention schedules that specify how long different types of records must be kept. It is crucial to develop and implement a comprehensive retention schedule that aligns with applicable laws and regulations, industry standards, and the organization\'s specific operational needs. This schedule should outline the required retention periods for various types of records, considering factors such as legal obligations, financial reporting requirements, and historical value. The retention schedule should be regularly reviewed and updated to reflect any changes in laws, regulations, or business practices. Furthermore, it is essential to communicate the retention schedule to all relevant personnel and provide training on its implementation. This ensures that employees understand their responsibilities in managing records and adhere to the established retention periods. The retention schedule should also include procedures for the secure destruction of records that have reached the end of their retention period. This prevents the unnecessary accumulation of records, reduces storage costs, and minimizes the risk of unauthorized access to sensitive information. Proper destruction methods, such as shredding or secure deletion, should be employed to ensure the confidentiality and security of the records. Additionally, the retention schedule should consider the format of the records, whether they are physical or digital. Different formats may require different retention periods and preservation methods. For example, electronic records may need to be migrated to newer formats to ensure their long-term accessibility. The retention schedule should also address the issue of backup and disaster recovery, ensuring that essential records are protected from loss or damage. This involves implementing regular backup procedures and storing backup copies in secure locations. By adhering to a well-defined retention schedule, organizations can ensure that important information is preserved for as long as needed, while also minimizing the risks associated with retaining records beyond their required lifespan. This promotes efficiency, reduces costs, and enhances compliance with legal and regulatory requirements.',
                  },
                  {
                    title: '7. Transparency',
                    icon: <Eye size={16} />,
                    content: 'The records management process should be transparent and understandable to relevant stakeholders, fostering a culture of openness and trust. This principle extends beyond mere documentation, requiring proactive communication and education. It involves creating clear and accessible policies and procedures, ensuring that all employees are aware of their responsibilities in managing records. Furthermore, transparency necessitates the implementation of systems that allow for easy tracking and auditing of records, enabling stakeholders to understand how records are created, modified, and used. This includes providing access to relevant information and data, while respecting privacy and security considerations. Open communication channels, such as regular training sessions, workshops, and online resources, should be established to facilitate knowledge sharing and address any questions or concerns. Transparency also involves being open to feedback and suggestions from stakeholders, and continuously improving the records management process based on their input. Regular audits and reviews should be conducted to ensure that the process remains transparent and effective. This fosters a sense of accountability and builds confidence in the organization\'s records management practices, which is crucial for maintaining compliance and avoiding potential legal and reputational risks. Beyond internal stakeholders, transparency can also extend to external parties, such as regulatory bodies, auditors, and the public, depending on the nature of the organization and its records. Providing clear and accurate information about records management practices can enhance the organization\'s credibility and reputation, demonstrating its commitment to ethical and responsible data handling. This principle is not a onetime activity, but rather an ongoing commitment to open communication and accountability.',
                  },
                  {
                    title: '8. Retrieval',
                    icon: <SearchIcon size={16} />,
                    content: 'This principle focuses on the ability to efficiently locate and retrieve records when required. Effective retrieval systems are essential for supporting business operations, responding to inquiries, and complying with legal requests. The retrieval process should be well-organized and user-friendly. This includes utilizing indexing systems, metadata tagging, and search functionalities that allow for quick and accurate access to information. Furthermore, retrieval systems should be designed to accommodate various search criteria, such as keywords, dates, and document types. For physical records, this might involve maintaining accurate filing systems and using location tracking tools. For digital records, it could include implementing robust search engines and utilizing cloud storage solutions for easy access from multiple locations. The retrieval system should also be regularly tested and updated to ensure its effectiveness and efficiency. Moreover, it is important to consider the user experience when designing retrieval systems, ensuring that they are intuitive and easy to navigate. This facilitates quicker access to information and reduces the time spent searching for records. The retrieval process should also be documented, including procedures for requesting and accessing records, to ensure consistency and accountability.',
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

            {/* SECTION 6: Monitoring and Controlling the Movement of Files */}
            <div
              ref={(el) => {
                sectionRefs.current['monitoring'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Monitoring and Controlling the Movement of Files
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Monitoring and controlling the movement of files is essential for maintaining data security, ensuring compliance, and optimizing workflow. Whether dealing with physical or digital files, establishing clear procedures, and implementing appropriate safeguards are crucial. Here is a breakdown of key aspects:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Access Control and Authorization',
                    icon: <Lock size={16} />,
                    content: 'This principle dictates that only authorized personnel should have access to specific files. This involves a meticulous process of assigning permissions based on job roles and responsibilities. For digital files, this means implementing user accounts, passwords, and access control lists (ACLs). These ACLs define who can view, edit, or delete files within a network or system. In the physical realm, it translates to secure storage areas, controlled entry points, and sign-out/sign-in logs for sensitive documents. The idea is to create a tiered system where access is granted on a "need-to-know" basis. This reduces the risk of unauthorized access, data breaches, and internal misuse. It is not enough to simply grant access once; regular reviews of access permissions are vital. Employee roles change, projects end, and security threats evolve. Therefore, periodic audits ensure that access remains appropriate and that any unnecessary permissions are revoked promptly. This also helps to track who accessed which files, and when, for audit purposes. This level of control is fundamental in preventing data leaks, ensuring compliance with privacy regulations, and maintaining the integrity of sensitive information.',
                  },
                  {
                    title: '2. Audit Trails and Logging',
                    icon: <ListChecks size={16} />,
                    content: 'Implementing comprehensive audit trails and logging mechanisms is critical for tracking file movements and changes. This involves recording every action performed on a file, including who accessed it, when it was accessed, what changes were made, and where it was moved. For digital files, this is often achieved through system logs, file versioning, and activity monitoring software. Physical files can be tracked using sign-out/sign-in logs, barcode scanning, or RFID tags. These audit trails provide a detailed history of file activity, enabling organizations to identify potential security breaches, investigate incidents, and ensure accountability. In the event of a data breach or legal dispute, these logs serve as crucial evidence, demonstrating compliance and providing valuable insights into the sequence of events. Furthermore, audit trails can help identify inefficiencies in workflows and pinpoint areas for improvement. By analysing file access patterns, organizations can optimize file storage, streamline processes, and enhance overall productivity. These logs also act as a deterrent, letting employees know that their actions are being recorded, which encourages responsible file handling. Implementing robust logging systems is not a one-time setup; it requires continuous monitoring and analysis to ensure its effectiveness.',
                  },
                  {
                    title: '3. Data Encryption and Protection',
                    icon: <Lock size={16} />,
                    content: 'Encrypting files, both in transit and at rest, is a fundamental security measure. This involves converting data into an unreadable format, making it inaccessible to unauthorized individuals. Digital files can be encrypted using various encryption algorithms and software tools. Physical files can be protected by storing them in locked cabinets or vaults. Encryption ensures that even if files are intercepted or stolen, the information remains confidential. When files are transmitted over networks or stored in cloud environments, encryption is particularly important. This prevents eavesdropping and protects data from being compromised during transmission or storage. Additionally, implementing data loss prevention (DLP) tools can help prevent sensitive files from being accidentally or intentionally transferred outside the organization\'s control. DLP solutions monitor file transfers and block unauthorized attempts to copy, move, or email sensitive data. Physical files also require protection from environmental damage, like fire or water. Secure off-site storage can protect against these risks. Backups of digital files, stored in encrypted format, are also important in case of data loss. Regular backups, and testing of restoration procedures, ensures that data can be recovered quickly.',
                  },
                  {
                    title: '4. File Transfer Protocols and Security',
                    icon: <Send size={16} />,
                    content: 'When transferring files, especially over networks or the internet, it is crucial to use secure file transfer protocols. This involves employing protocols such as SFTP (Secure File Transfer Protocol), FTPS (FTP Secure), or HTTPS (Hypertext Transfer Protocol Secure), which encrypt data during transmission. These protocols protect files from being intercepted or tampered with during transit. Additionally, organizations should establish clear guidelines for file transfers, specifying which protocols to use, how to authenticate users, and where to store files. Implementing secure file-sharing platforms and cloud storage solutions can also enhance file transfer security. These platforms often provide encryption, access controls, and audit trails, ensuring that files are transferred and stored securely. Employees should be trained on secure file transfer practices, including the importance of using strong passwords, avoiding public Wi-Fi networks, and verifying the authenticity of file recipients. This training should also cover the risks associated with unauthorized file transfers and the potential consequences of data breaches. Regular security assessments and penetration testing can help identify vulnerabilities in file transfer systems and ensure that they meet security standards.',
                  },
                  {
                    title: '5. Physical File Tracking and Management',
                    icon: <Folder size={16} />,
                    content: 'For organizations that handle physical files, implementing a robust tracking and management system is essential. This involves using barcode scanning, RFID tags, or other tracking technologies to monitor the movement of files. Sign-out/sign-in logs should be maintained, recording who borrowed a file, when it was borrowed, and when it was returned. Physical files should be stored in secure locations, such as locked cabinets or vaults, with access limited to authorized personnel. Environmental controls, such as temperature and humidity monitoring, should be implemented to protect files from damage. Regular inventories should be conducted to ensure that all files are accounted for and that none are missing or misplaced. Implementing a well-organized filing system, with clear labelling and indexing, can facilitate efficient retrieval and reduce the risk of lost files. Furthermore, organizations should establish clear procedures for the destruction of physical files that are no longer needed, ensuring that sensitive information is securely disposed of. This might involve shredding documents or using other secure destruction methods.',
                  },
                  {
                    title: '6. Automated File Movement and Workflow Control',
                    icon: <Zap size={16} />,
                    content: 'Automating file movement and workflow processes can streamline operations and enhance security. This involves using workflow management systems and file transfer automation tools to automate routine file transfers and processing tasks. Automated workflows can help ensure that files are moved to the correct locations, processed according to predefined rules, and that notifications are sent to relevant personnel. This reduces the risk of human error, improves efficiency, and enhances compliance. Implementing workflow control systems can also help enforce security policies and prevent unauthorized file transfers. These systems can be configured to block unauthorized file movements, enforce encryption, and generate audit trails. Automated workflows can also help streamline document approval processes, ensuring that files are reviewed and approved by the appropriate personnel before being released. This reduces the risk of errors and ensures that documents are handled consistently. Regular reviews of automated workflows and file transfer processes are essential to ensure that they remain effective and aligned with the organization\'s needs.',
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

            {/* SECTION 7: Tracking Systems */}
            <div
              ref={(el) => {
                sectionRefs.current['tracking'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Tracking Systems
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Tracking systems are technologies used to monitor and record the location or movement of people, objects, or information. They play a significant role in various aspects of modern life, from logistics and transportation to personal safety and data management. Here is a breakdown of what tracking systems entail:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Key Aspects of Tracking Systems',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>Purpose</strong> The primary function of a tracking system is to provide real-time or historical data about the location or movement of a target. This data can be used for various purposes, including: Monitoring assets, Optimizing logistics, Enhancing security, Improving efficiency, Personal safety.</p>
                        <p><strong>Technologies</strong> Tracking systems utilize a range of technologies, including: GPS (Global Positioning System): A satellite-based navigation system that provides precise location data. RFID (Radio-Frequency Identification): Uses radio waves to identify and track tags attached to objects. Cellular Networks: Utilizes mobile phone networks to track the location of devices. Wi-Fi: Can be used for indoor tracking by identifying the location of devices connected to Wi-Fi networks. Bluetooth: Used for short-range tracking, often for locating personal items. Sensor-based systems: These systems utilize sensors like accelerometers, and gyroscopes to track movement.</p>
                        <p><strong>Applications</strong> Tracking systems are used in a wide range of applications, including: Transportation and Logistics: Tracking vehicles, shipments, and deliveries. Fleet Management: Monitoring the location and performance of vehicles in a fleet. Asset Tracking: Tracking valuable assets to prevent theft or loss. Personal Safety: Tracking the location of individuals, such as children or elderly people. Inventory Management: Tracking the movement of inventory in warehouses and retail stores. Data tracking: Tracking the movement of digital files, and the logging of user activity on digital systems.</p>
                        <p><strong>Types of Tracking</strong> Active Tracking: Provides real-time location data. Passive Tracking: Records location data for later retrieval.</p>
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

            {/* SECTION 8: Records Management Compliance Audit */}
            <div
              ref={(el) => {
                sectionRefs.current['compliance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Records Management Compliance Audit
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A comprehensive records management compliance audit goes beyond a simple checklist; it is a deep dive into the organizational ecosystem of information. Here is a more detailed look at the key components:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Policy and Procedures Review',
                    icon: <Clipboard size={16} />,
                    content: 'This is not just about having policies; it is about ensuring they are living documents. Auditors assess if policies reflect current legal and regulatory landscapes, if they are disseminated effectively, and if they are consistently applied. This includes analysing how policies address emerging technologies and data formats. Furthermore, auditors scrutinize the procedures that translate policy into action, verifying that they are detailed, practical, and regularly updated. They also check if the procedures are correctly followed by the staff.',
                  },
                  {
                    title: 'Records Inventory and Classification',
                    icon: <ListChecks size={16} />,
                    content: 'This involves a meticulous examination of how records are identified, categorized, and documented. Auditors verify the accuracy and completeness of the records inventory, ensuring that all record types, formats, and locations are accounted for. They assess the classification system, confirming that it is logical, consistent, and aligned with business needs and legal requirements. This also includes the review of metadata usage, and if it is applied correctly, and in a consistent way.',
                  },
                  {
                    title: 'Retention and Disposal Schedules',
                    icon: <ClockIcon size={16} />,
                    content: 'Auditors scrutinize the organization\'s retention and disposal schedules, ensuring they are legally sound and aligned with business requirements. This includes verifying that schedules cover all record types, that retention periods are clearly defined, and that disposal procedures are secure and documented. They will also verify that the destruction of records is done in a way that is compliant with all applicable laws.',
                  },
                  {
                    title: 'Security and Access Controls',
                    icon: <Lock size={16} />,
                    content: 'This involves a thorough evaluation of physical and digital security measures. Auditors assess access control policies, authentication procedures, encryption practices, and physical security measures to ensure that records are protected from unauthorized access, alteration, or destruction. This component also includes the review of disaster recovery plans, and business continuity plans.',
                  },
                  {
                    title: 'Data Privacy and Protection',
                    icon: <Shield size={16} />,
                    content: 'In today\'s data-driven world, this component is crucial. Auditors assess the organization\'s compliance with data privacy regulations, such as GDPR, HIPAA, or other relevant legislation. This includes evaluating data collection practices, data storage and transfer procedures, and data breach response plans. They also review the organization\'s data subject rights procedures.',
                  },
                  {
                    title: 'Audit Trails and Documentation',
                    icon: <FileText size={16} />,
                    content: 'Auditors examine audit trails and documentation to ensure that all records management activities are properly recorded and tracked. This includes reviewing logs of access, modifications, and deletions, as well as documentation of retention and disposal activities. This component ensures that there is a clear and verifiable history of all records management actions.',
                  },
                  {
                    title: 'Staff Training and Awareness',
                    icon: <Users size={16} />,
                    content: 'Effective records management requires a well-informed workforce. Auditors assess the organization\'s training programs, ensuring that employees are adequately trained on records management policies, procedures, and legal requirements. They also evaluate the organization\'s efforts to raise awareness of records management best practices. This includes the review of training materials, and training records.',
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

            {/* SECTION 9: Legal and Ethical Issues */}
            <div
              ref={(el) => {
                sectionRefs.current['legal'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Legal and Ethical Issues
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When considering legal and ethical issues related to information management in Zimbabwe, it is crucial to understand the specific context of the country's legal framework and societal norms. Here is a breakdown of key points:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Data Privacy and Protection (with Zimbabwean Context)',
                    icon: <Shield size={16} />,
                    content: 'In Zimbabwe, the legal landscape concerning data privacy is evolving, though there are key aspects to consider. While a comprehensive data protection law similar to GDPR is still developing, the Constitution of Zimbabwe provides some foundational protection for the right to privacy. This constitutional right means that individuals have a right to the privacy of their person, home, or other property and from the violation of their correspondence. The Interception of Communications Act also presents a complex issue, as it grants authorities broad powers to intercept communications, raising concerns about potential privacy infringements. Organizations handling personal data in Zimbabwe, therefore, face a balancing act. They must respect constitutional rights while navigating existing legislation. Ethical considerations also come into play. Even in the absence of stringent data protection laws, organizations have a moral obligation to handle personal information responsibly. This includes obtaining informed consent, implementing robust security measures, and being transparent about data collection and usage practices. The rise of digital technologies and the increasing collection of personal data further emphasize the need for ethical data management practices in Zimbabwe. Organizations must proactively adopt best practices to protect individual privacy and build trust with their customers and stakeholders. It is important to note that the Postal and Telecommunications Regulatory Authority of Zimbabwe (POTRAZ) plays a large role in regulating the telecommunications sector, and therefore, also plays a role in the handling of digital data.',
                  },
                  {
                    title: '2. Intellectual Property Rights (Zimbabwean Context)',
                    icon: <BookOpen size={16} />,
                    content: 'Protecting intellectual property (IP) is crucial for fostering innovation and creativity. In Zimbabwe, IP rights are governed by various laws, including the Copyright and Neighbouring Rights Act, the Patents Act, and the Trademarks Act. These laws provide legal frameworks for protecting copyrights, patents, and trademarks, ensuring that creators and innovators are rewarded for their work. However, enforcement of IP rights can be challenging, particularly in the digital realm. Piracy and counterfeiting remain significant concerns, hindering the growth of creative industries and undermining the value of IP. Organizations operating in Zimbabwe must be aware of their IP rights and take proactive steps to protect them. This includes registering patents and trademarks, implementing copyright protection measures, and educating employees about IP laws. Ethically, organizations should respect the IP rights of others and avoid engaging in activities that infringe on those rights. This includes using licensed software, respecting copyright restrictions, and avoiding the distribution of counterfeit goods. Fostering a culture of respect for IP rights is essential for promoting innovation and creativity in Zimbabwe. The Zimbabwe Intellectual Property Office (ZIPO) is the government department responsible for the administration of Intellectual property rights.',
                  },
                  {
                    title: '3. Cybersecurity and Data Security (Zimbabwean Context)',
                    icon: <Lock size={16} />,
                    content: 'The increasing reliance on digital technologies has made cybersecurity a critical concern in Zimbabwe. Organizations face a growing number of cyber threats, including malware attacks, data breaches, and ransomware. The lack of robust cybersecurity infrastructure and awareness can exacerbate these risks. While the government is taking steps to address cybersecurity challenges, organizations must also take proactive measures to protect their data and systems. This includes implementing strong security measures, such as firewalls, intrusion detection system, and data encryption. Regular security audits and employee training are also essential for preventing cyberattacks. Ethically, organizations have a responsibility to protect the data of their customers and stakeholders. This includes implementing robust security measures, being transparent about data security practices, and taking prompt action in the event of a data breach. Failure to address cybersecurity risks can lead to significant financial losses, reputational damage, and legal consequences. The Cyber Security and Data Protection Act is a relatively new piece of legislation, and its implementation is still being developed.',
                  },
                  {
                    title: '4. Freedom of Information and Access to Information (Zimbabwean Context)',
                    icon: <GlobeIcon size={16} />,
                    content: 'The right to access information is crucial for promoting transparency and accountability. In Zimbabwe, the Freedom of Information Act (Access to Information and Protection of Privacy Act) aims to provide citizens with access to government information. However, the implementation of this act has been subject to criticism, with concerns raised about restrictions on access and the lack of transparency in government processes. Organizations operating in Zimbabwe must be aware of their obligations under the Freedom of Information Act and ensure that they comply with requests for information. Ethically, organizations should strive to be transparent and accountable in their operations. This includes providing access to information that is in the public interest, respecting the right to freedom of expression, and avoiding the suppression of information. Promoting a culture of openness and transparency is essential for building trust with stakeholders and fostering a democratic society. It is important to note that the media landscape in Zimbabwe has often been a point of contention internationally.',
                  },
                  {
                    title: '5. Ethical Use of Technology (Zimbabwean Context)',
                    icon: <Zap size={16} />,
                    content: 'The rapid advancement of technology raises ethical concerns about its use. In Zimbabwe, organizations must consider the ethical implications of emerging technologies, such as artificial intelligence, big data analytics, and facial recognition. This includes ensuring that these technologies are used responsibly, ethically, and in a way that respects human rights. Ethically, organizations should avoid using technology in ways that discriminate against individuals or groups, infringe on privacy, or promote harmful content. This includes ensuring that algorithms are fair and unbiased, that data is used responsibly, and that online platforms are used to promote positive social values. Promoting ethical technology use is essential for building a sustainable and inclusive digital society in Zimbabwe. The digital divide is also a consideration. Many people do not have reliable internet access. This creates ethical concerns about access to information.',
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

            {/* SECTION 10: Conducting a File Census */}
            <div
              ref={(el) => {
                sectionRefs.current['census'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Conducting a File Census
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Conducting a file census is a fundamental step in establishing effective records management. It is essentially a comprehensive inventory of all the files an organization possesses, regardless of format or location. This process helps to understand the scope of information assets, identify potential risks, and lay the groundwork for better organization. Here is a breakdown of the key points:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Defining the Scope and Objectives',
                    icon: <Target size={16} />,
                    content: 'Before embarking on a file census, it is crucial to establish a clear understanding of what you aim to achieve. This involves defining the boundaries of the census: which departments, locations, and file types will be included? Are you focusing on physical files, digital files, or both? What are the specific objectives? Are you primarily looking to identify sensitive information, assess storage needs, or prepare for a migration to a new system? Clearly defining these parameters will ensure that the census is focused and efficient. For example, a company might decide to only census the HR department\'s physical files, and the finance department\'s digital files, as a first step. This scoping allows organizations to prioritize their efforts and allocate resources effectively. Without a clear scope, the census can become overwhelming and yield incomplete or inaccurate results. This initial step is critical in ensuring the file census is a productive and worthwhile endeavour.',
                  },
                  {
                    title: '2. Identifying File Locations and Formats',
                    icon: <MapPin size={16} />,
                    content: 'This phase requires a meticulous examination of all potential file storage locations, both physical and digital. For physical files, this includes offices, storage rooms, filing cabinets, and off-site storage facilities. For digital files, it involves servers, shared drives, cloud storage, personal computers, and removable media. It is also important to identify the various file formats, such as paper documents, PDFs, spreadsheets, databases, and emails. This comprehensive identification ensures that no files are overlooked, providing a complete picture of the organization\'s information assets. It is very easy to forget locations, such as local computer hard drives, or removable media. This phase requires a high degree of detail, and attention. This step is crucial for later steps, such as classification and retention.',
                  },
                  {
                    title: '3. Developing a File Inventory Template',
                    icon: <FileText size={16} />,
                    content: 'A standardized template is essential for ensuring consistency and accuracy in data collection. This template should include key information about each file, such as file name, description, location, format, date created, responsible department, and any relevant metadata. The template should be user-friendly and adaptable to various file types and formats. For digital files, this might involve including fields for file size, version history, and access permissions. Using a consistent template allows for efficient data entry and analysis, facilitating the creation of a comprehensive and organized file inventory. Without a template, the collected data can be disorganized and difficult to analyse, hindering the effectiveness of the census. The template should be distributed to all personnel involved in the census and accompanied by clear instructions.',
                  },
                  {
                    title: '4. Conducting the File Inventory',
                    icon: <Database size={16} />,
                    content: 'This phase involves the actual process of collecting data about each file. This can be done manually, by physically examining files and entering information into the template, or automatically, by using software tools to scan and index digital files. It is crucial to ensure that all files within the defined scope are included in the inventory. For physical files, this might involve physically going through filing cabinets and documenting each file. For digital files, this might involve using file explorer or specialized software to scan folders and collect metadata. This phase requires meticulous attention to detail and a systematic approach to ensure that no files are missed. It is important that the people doing the inventory are trained, and that they understand the importance of the work.',
                  },
                  {
                    title: '5. Analysing the Inventory and Identifying Issues',
                    icon: <SearchIcon size={16} />,
                    content: 'Once the inventory is complete, the collected data needs to be analysed to identify patterns, trends, and potential issues. This might involve assessing the volume of files, identifying duplicate or redundant files, and evaluating the organization\'s storage needs. It is also crucial to identify any sensitive or confidential information that requires special protection. This analysis will provide valuable insights into the organization\'s information management practices and highlight areas for improvement. For example, the analysis might reveal that a significant portion of files are duplicates, leading to unnecessary storage costs. Or it might identify sensitive information that is stored in unsecured locations, posing a security risk. This analysis is crucial for developing effective records management strategies and policies.',
                  },
                  {
                    title: '6. Developing an Action Plan',
                    icon: <ListChecks size={16} />,
                    content: 'Based on the findings of the analysis, an action plan should be developed to address any identified issues and improve the organization\'s records management practices. This plan might include recommendations for file classification, retention, storage, and security. It should also outline specific steps, timelines, and responsibilities for implementing these recommendations. The action plan should be prioritized based on the severity of the identified issues and the organization\'s resources. Regular reviews and updates of the action plan are essential to ensure its effectiveness. This step ensures that the file census translates into tangible improvements in records management.',
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

            {/* SECTION 11: Tracing Missing Files */}
            <div
              ref={(el) => {
                sectionRefs.current['missing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Tracing Missing Files
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Tracing missing files can be a stressful and time-consuming process, but a systematic approach can significantly increase the chances of recovery. Whether dealing with physical or digital files, a methodical investigation is essential. Here is a breakdown of the key steps involved:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Define the Scope and Gather Information',
                    icon: <SearchIcon size={16} />,
                    content: 'Before diving into the search, it is crucial to clearly define the scope of the missing file(s). This involves gathering as much information as possible about the file(s), including the file name, type, creation date, last accessed date, location (if known), and any relevant keywords or metadata. The more information you can gather, the narrower your search will be. If it is a physical file, who last had it? Was it signed out? Was it copied? If it is a digital file, what program was used to create it? What was the file extension? Was it emailed? Was it on a shared drive? Understanding the context of the missing file(s) can provide valuable clues about their potential location. It is also important to determine the urgency of the search and prioritize files based on their importance. This initial step sets the stage for a focused and efficient search.',
                  },
                  {
                    title: '2. Check Common Locations and Recent Activity',
                    icon: <Folder size={16} />,
                    content: 'Begin your search by checking the most likely locations where the file(s) might be found. For physical files, this includes the usual filing cabinets, storage rooms, and desks. For digital files, this involves checking recent folders, downloads, recycle bins, and temporary files. Review any recent activity logs or access records to see if there are any clues about the file\'s movement. If the files were recently accessed or modified, they might be located in a temporary or recently used folder. If there are other people who may have accessed the file, asking them is also a prudent step. In the digital world, checking recent email attachments, and cloud storage locations is also important. This initial sweep can often lead to quick recovery of the missing file(s).',
                  },
                  {
                    title: '3. Utilize Search Tools and Software',
                    icon: <HardDriveIcon size={16} />,
                    content: 'For digital files, leverage the power of search tools and specialized software. Operating systems typically have built-in search functionalities that allow you to search for files based on keywords, file names, or file types. Consider using advanced search operators to refine your search and narrow down the results. If the operating system\'s search function is not enough, there are specialized search programs that index drives, and can find files based on partial names, or even content. For physical files, carefully look through all related files, and look for any misfiled documents. If you have any sort of inventory system, check that. This step can significantly accelerate the search process and help you locate files that might be hidden or misplaced.',
                  },
                  {
                    title: '4. Check Backup and Recovery Systems',
                    icon: <Archive size={16} />,
                    content: 'If the missing files are critical, check your backup and recovery systems. This involves reviewing recent backups to see if the files are included. If you have a version control system, you might be able to find previous versions of the missing file. If the files were stored in a cloud environment, check the cloud storage provider\'s backup and recovery options. This step is particularly important for digital files, as it can often lead to the recovery of lost or deleted data. This step can also lead to the finding of older versions of the file, which may also be useful.',
                  },
                  {
                    title: '5. Follow the File\'s Trail (If Possible)',
                    icon: <ListChecks size={16} />,
                    content: 'If the file was moved or transferred, try to follow its trail. This might involve reviewing email correspondence, file transfer logs, or sign-out/sign-in logs. If the file was shared with others, contact them to see if they have a copy. For physical files, this means looking at who signed out the file, or if it was moved to another department. If the file was sent via email, look at the sent items folder. This step requires careful investigation and attention to detail, but it can lead to the discovery of the file\'s current location.',
                  },
                  {
                    title: '6. Implement Preventative Measures',
                    icon: <Shield size={16} />,
                    content: 'Once the missing file(s) have been recovered, take steps to prevent future occurrences. This might involve implementing better file management practices, such as consistent file naming conventions, regular backups, and access control policies. It is also important to educate employees about the importance of proper file handling and storage. For physical files, this might mean better filing systems, or better tracking of file movements. For digital files, this might mean better access controls, and better training on where to store files. This step ensures that the time and effort spent tracing the missing file(s) are not wasted and that the organization\'s information assets are better protected.',
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

            {/* SECTION 12: Audit Trails */}
            <div
              ref={(el) => {
                sectionRefs.current['audit-trails'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Audit Trails
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Audit trails are a fundamental component of robust records management and security practices. They provide a chronological record of events, documenting who performed what actions, when, and often, why. This comprehensive record is invaluable for accountability, security, and compliance. Here is a breakdown of the key aspects of audit trails:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Definition and Purpose',
                    icon: <FileText size={16} />,
                    content: 'An audit trail is essentially a detailed log that tracks the lifecycle of a record or system activity. It meticulously records actions such as creation, modification, deletion, and access. The primary purpose is to provide a verifiable history of events, enabling organizations to trace the origin and evolution of information. This is crucial for identifying irregularities, investigating incidents, and ensuring accountability. In digital systems, audit trails are often automatically generated by software and hardware, capturing user actions, system changes, and data modifications. For physical records, audit trails might involve sign-out/sign-in logs, modification records, or chain-of-custody documentation. The purpose is not only to find errors, but to also deter malicious activity. Knowing that their actions are recorded can cause people to act more responsibly.',
                  },
                  {
                    title: '2. Scope and Granularity',
                    icon: <Eye size={16} />,
                    content: 'The scope of an audit trail determines which events are recorded. It can range from broad system-level activities to granular, file-specific actions. The level of detail, or granularity, is also crucial. Depending on the organization\'s needs and regulatory requirements, audit trails might capture basic information such as timestamps and user IDs, or detailed information such as specific data changes and system configurations. It is important to find the right balance between collecting too much data, and not enough. Too much data makes it difficult to find required information, while too little data will not give enough context. The scope and granularity should be carefully defined to ensure that the audit trail provides sufficient information for its intended purpose. For example, a financial institution might require detailed audit trails of all transactions, while a small business might only need basic logs of system access.',
                  },
                  {
                    title: '3. Implementation and Technology',
                    icon: <SettingsIcon size={16} />,
                    content: 'Implementing effective audit trails requires appropriate technology and procedures. For digital systems, this might involve using logging software, database audit features, and security information and event management (SIEM) systems. These tools can automatically capture and store audit trail data in a secure and tamper-proof manner. For physical records, it might involve establishing clear procedures for documenting file movement, modifications, and disposal. The choice of technology and procedures should be based on the organization\'s needs, resources, and regulatory requirements. It is also important to ensure that audit trail data is securely stored and protected from unauthorized access or modification. If the logs can be modified, then they are of very little use.',
                  },
                  {
                    title: '4. Analysis and Reporting',
                    icon: <BarChart size={16} />,
                    content: 'Audit trails are not just about collecting data; they are also about analysing and reporting on that data. Regular analysis of audit trails can help identify patterns, trends, and anomalies that might indicate security breaches, compliance violations, or operational inefficiencies. Reporting tools can be used to generate reports and alerts based on audit trail data, enabling organizations to proactively address potential issues. The reports should be easy to understand and provide actionable insights. Regular reviews of audit trails can also help identify areas for improvement in security and records management practices. Analysing the audit trails can also help to identify areas of improvement in workflows, or system design.',
                  },
                  {
                    title: '5. Compliance and Legal Requirements',
                    icon: <Clipboard size={16} />,
                    content: 'Many industries and jurisdictions have specific compliance and legal requirements related to audit trails. Organizations must ensure that their audit trail practices meet these requirements. This might involve adhering to specific retention periods, data security standards, and reporting obligations. Failure to comply with audit trail requirements can result in significant penalties and legal consequences. Audit trails are often used as evidence in legal proceedings, demonstrating that an organization has taken appropriate measures to protect its data and ensure compliance. This makes it important to have a plan for how audit trail data is stored, and how it can be accessed in the event of a legal proceeding.',
                  },
                  {
                    title: '6. Security and Integrity',
                    icon: <Shield size={16} />,
                    content: 'The security and integrity of audit trails is paramount. Audit trail data must be protected from unauthorized access, modification, or deletion. This might involve implementing access controls, encryption, and data integrity checks. It is also important to ensure that audit trails are stored separately from the data they are tracking, to prevent tampering. Regular security assessments and audits can help ensure that audit trails are secure and reliable. If someone can change the audit trail, it becomes useless.',
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

            {/* SECTION 13: Procedure for Updating Books/Mark-Out Cards */}
            <div
              ref={(el) => {
                sectionRefs.current['updating-cards'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procedure for Updating Books/Mark-Out Cards
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Updating books or mark-out cards, whether for physical inventory, library resources, or any system where items are tracked manually, requires a structured procedure to maintain accuracy and prevent errors. Here is a detailed breakdown of the process:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Establish Clear Responsibility and Authority',
                    icon: <User size={16} />,
                    content: 'Before any updates are made, it is essential to define who is authorized to modify books or mark-out cards. This prevents unauthorized changes and ensures accountability. Assign specific individuals or roles with the responsibility for updating these records. This assignment should be documented and communicated to all relevant personnel. For example, in a library setting, designated library staff would be responsible for updating borrowing records. In a manufacturing setting, inventory control personnel would handle mark-out cards. The designated personnel should receive proper training on the procedures and understand the importance of accuracy. Clear lines of authority also ensure that there is someone to address discrepancies or answer questions regarding the updates. If there is a dispute as to who made an entry, or when, the line of responsibility is clear.',
                  },
                  {
                    title: '2. Develop a Standardized Update Format',
                    icon: <Layout size={16} />,
                    content: 'To ensure consistency and clarity, create a standardized format for all updates. This format should specify the information to be recorded, such as the date, time, action taken (e.g., item borrowed, returned, updated, moved), and the initials or signature of the person making the update. This standardized format reduces ambiguity and makes it easier to track changes. For example, a mark-out card might have columns for "Date," "Action," "Quantity," and "Initials." Using a consistent format across all books or cards facilitates efficient data entry and retrieval. This also helps with auditing since all entries will be in the same format.',
                  },
                  {
                    title: '3. Implement a Timely Update Schedule',
                    icon: <ClockIcon size={16} />,
                    content: 'Updates should be made promptly to ensure that records accurately reflect the current status of items. Establish a schedule for regular updates, such as daily or weekly, depending on the volume of transactions. For example, in a retail environment, mark-out cards might be updated after each sale or stock movement. In a library, borrowing records should be updated immediately upon check-out and check-in. Timely updates prevent the accumulation of backlogs and reduce the risk of errors. If there are long delays in updating the records, there is an increased chance of missing, or inaccurate information.',
                  },
                  {
                    title: '4. Verify and Cross-Reference Information',
                    icon: <CheckCircle size={16} />,
                    content: 'To minimize errors, implement a verification process. This might involve cross-referencing information from multiple sources, such as physical counts, electronic records, or transaction receipts. For example, in an inventory system, the quantity recorded on a mark-out card should be verified against the physical count of items. In a library, the borrowing record should be verified against the item\'s barcode and the borrower\'s identification. This process ensures that the updates are accurate and consistent. Verifying the information helps to catch any mistakes made during the update process.',
                  },
                  {
                    title: '5. Maintain a Clear and Legible Record',
                    icon: <Eye size={16} />,
                    content: 'All updates should be made in a clear and legible manner. This ensures that the information is easily readable and understandable by others. Use a pen with permanent ink to prevent fading or smudging. If corrections are necessary, draw a single line through the incorrect entry and write the correct information beside it, along with your initials and the date. Avoid using correction fluid or erasing, as this can obscure the original entry and make it difficult to trace changes. Legible records are essential for audit trails and historical analysis.',
                  },
                  {
                    title: '6. Secure Storage and Access Control',
                    icon: <Lock size={16} />,
                    content: 'Books and mark-out cards often contain sensitive information, so they should be stored in a secure location with limited access. This prevents unauthorized modifications and protects the integrity of the records. Implement access control measures, such as locked cabinets or restricted access areas, to ensure that only authorized personnel can access and update these records. This is especially important for financial or inventory records. Secure storage also protects the records from damage or loss.',
                  },
                  {
                    title: '7. Regularly Audit and Reconcile Records',
                    icon: <RefreshCw size={16} />,
                    content: 'Conduct regular audits to ensure that the records are accurate and up to date. This might involve comparing the records against physical counts, electronic data, or transaction logs. Reconcile any discrepancies and investigate the causes of errors. Regular audits help to identify and correct errors early, preventing them from escalating. They also ensure that the records remain reliable and trustworthy. Auditing also helps to ensure that the procedures are being followed, and that they are effective.',
                  },
                  {
                    title: '8. Document and Communicate Changes to Procedures',
                    icon: <Send size={16} />,
                    content: 'If any changes are made to the update procedure, document these changes, and communicate them to all relevant personnel. This ensures that everyone is aware of the new procedures and can follow them correctly. Changes might be necessary due to evolving business needs, regulatory requirements, or technological advancements. Clear communication prevents confusion and ensures that the records remain accurate and consistent.',
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
                  💡 Inventory Insight
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
                  <span>Inventory Elements</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Inventory Importance</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Control Principles</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                An inventory is the foundation of records management – it lists every record with key details. Regular updates and audits ensure accuracy. Control principles (accountability, protection, integrity, compliance, availability, retention, transparency, retrieval) guide effective management. Tracking systems, file censuses, and audit trails are essential tools. Always follow structured procedures for updating records and tracing missing files.
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
                <strong className="text-white">Inventory Essentials</strong> – Record unique IDs, titles, formats, locations, dates, creators, retention, access, status, and metadata. A complete inventory is the backbone of efficient records management.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Inventory Procedures</strong> – Plan, collect, enter, validate, analyse, develop retention schedules, implement policies, and maintain continuously. Regular updates and audits keep the inventory accurate.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Records Control</strong> – Eight principles: Accountability, Protection, Integrity, Compliance, Availability, Retention, Transparency, Retrieval. These guide secure and efficient record handling.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Monitoring &amp; Auditing</strong> – Use access controls, audit trails, encryption, secure protocols, physical tracking, automation, and compliance audits to monitor file movement and ensure legal/ethical compliance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Tracing &amp; Updating</strong> – For missing files: define scope, check common locations, use search tools, check backups, follow the trail, and implement prevention. Update mark-out cards with clear responsibility, standardised formats, timely action, verification, and regular audits.
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
            Sidemann Academic Registry • Records &amp; Information Management – Learning Outcome 5 (Inventory, Control &amp; Audit)
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;