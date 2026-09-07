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
  FileText as FileTextIcon2,
  BookOpen as BookOpenIcon,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  Clock,
  CheckCircle as CheckCircleIcon,
  RefreshCw as RefreshCwIcon2,
  AlertCircle as AlertCircleIcon,
  ClipboardList,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'file-name', label: 'File Naming' },
  { id: 'applications', label: 'Filing Applications' },
  { id: 'colour-coding', label: 'Colour Coding' },
  { id: 'closure-retirement', label: 'File Closure' },
  { id: 'closure-factors', label: 'Closure Factors' },
  { id: 'closure-procedures', label: 'Closure Procedures' },
  { id: 'storage-factors', label: 'Storage Factors' },
  { id: 'storage-types', label: 'Storage Types' },
  { id: 'centralised-decentralised', label: 'Centralised vs Decentralised' },
  { id: 'electronic-manual', label: 'Electronic vs Manual' },
  { id: 'storage-requirements', label: 'Storage Requirements' },
  { id: 'onsite-offsite', label: 'Onsite vs Offsite' },
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

  // Random tip on mount
  useEffect(() => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The ISO 15489 standard for records management recommends using consistent file naming conventions to ensure long-term accessibility and retrieval.',
      },
      {
        title: 'Pro Tip',
        text: 'When colour coding files, use a maximum of 5-7 colours to avoid confusion. Each colour should represent a distinct category that is easy to remember.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key file naming elements with "D‑D‑V‑D": Date, Description, Version, Department.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations forget to include version control in file names, leading to confusion about which document is the most current version.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The ISO 15489 standard for records management recommends using consistent file naming conventions to ensure long-term accessibility and retrieval.',
      },
      {
        title: 'Pro Tip',
        text: 'When colour coding files, use a maximum of 5-7 colours to avoid confusion. Each colour should represent a distinct category that is easy to remember.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key file naming elements with "D‑D‑V‑D": Date, Description, Version, Department.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations forget to include version control in file names, leading to confusion about which document is the most current version.',
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            File Naming, Applications &{' '}
            <span className="text-purple-300 font-bold italic">
              Storage Systems
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to effective file naming, filing applications, colour coding, file closure, storage equipment, and system comparisons.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <File size={14} className="inline mr-1" /> Naming
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <LayersIcon size={14} className="inline mr-1" /> Storage
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Archive size={14} className="inline mr-1" /> Closure
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
                placeholder="Search for a concept, method, storage type..."
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
            {/* SECTION 1: Coming Up with a File Name */}
            <div
              ref={(el) => {
                sectionRefs.current['file-name'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Coming Up with a File Name
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Creating effective file names is crucial for efficient information management, whether dealing with personal files or organizational documents. A well-structured file name allows for quick identification, easy retrieval, and organized storage. Here is a breakdown of how to come up with effective file names:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Clarity and Conciseness',
                    icon: <Eye size={16} />,
                    content: 'The file name should clearly and concisely describe the content of the file. Avoid overly long or ambiguous names. Aim for a balance between providing sufficient information and keeping the name manageable. For example, instead of "Document1," use "ProjectProposal_ClientName_Date."',
                  },
                  {
                    title: 'Descriptive Keywords',
                    icon: <SearchIcon size={16} />,
                    content: 'Use relevant keywords that accurately reflect the file\'s content. This will make it easier to search for and retrieve the file later. Consider what words you would use to search for the file and incorporate those into the file name.',
                  },
                  {
                    title: 'Consistent Format',
                    icon: <Layout size={16} />,
                    content: 'Establish a consistent naming convention and stick to it. This will ensure that all files are named in a uniform manner, making them easier to organize and locate. For instance, you could use a format like "DocumentType_Subject_Date_Version." Consistency across all files is key.',
                  },
                  {
                    title: 'Date Format',
                    icon: <Calendar size={16} />,
                    content: 'When including dates in file names, use a consistent date format, such as YYYY-MM-DD. This format ensures that files are sorted chronologically, regardless of regional date preferences.',
                  },
                  {
                    title: 'Version Control',
                    icon: <Hash size={16} />,
                    content: 'If you have multiple versions of a file, include a version number or date in the file name to distinguish between them. This will help you track changes and ensure you are working with the most recent version.',
                  },
                  {
                    title: 'Avoid Special Characters',
                    icon: <AlertCircleIcon size={16} />,
                    content: 'Avoid using special characters, such as / \\ : * ? &quot; &lt; &gt; |, in file names. These characters can cause problems with file systems and software applications. Stick to alphanumeric characters, underscores, and hyphens.',
                  },
                  {
                    title: 'Use Underscores or Hyphens',
                    icon: <Type size={16} />,
                    content: 'Use underscores or hyphens to separate words in file names. This improves readability and avoids issues with spaces in file names, which can sometimes cause problems with certain systems.',
                  },
                  {
                    title: 'Consider File Type',
                    icon: <FileText size={16} />,
                    content: 'If needed, include an abbreviated file type within the filename before the file extension.',
                  },
                  {
                    title: 'Organization-Specific Conventions',
                    icon: <Users size={16} />,
                    content: 'If you are working within an organization, adhere to any established file naming conventions. This will ensure consistency across all files and facilitate collaboration.',
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

            {/* SECTION 2: Applications of Filing */}
            <div
              ref={(el) => {
                sectionRefs.current['applications'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Applications of Filing
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Filing, whether physical or digital, serves various critical applications within organizations. Here are seven key applications:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Efficient Information Retrieval',
                    icon: <SearchIcon size={16} />,
                    content: 'Filing systems enable quick and easy retrieval of documents and information. By organizing records in a logical and consistent manner, organizations can locate specific files or data points without wasting time searching through disorganized piles or digital folders. This application is crucial for supporting decision-making, responding to inquiries, and conducting research.',
                  },
                  {
                    title: '2. Legal and Regulatory Compliance',
                    icon: <Shield size={16} />,
                    content: 'Many industries and jurisdictions have strict regulations regarding record keeping. Filing systems help organizations maintain accurate and complete records, ensuring compliance with legal and regulatory requirements. This application is essential for avoiding penalties, fines, and legal liabilities.',
                  },
                  {
                    title: '3. Historical Record Keeping',
                    icon: <Archive size={16} />,
                    content: 'Filing systems preserve the historical record of an organization\'s activities, decisions, and transactions. This application is crucial for maintaining institutional memory, documenting organizational evolution, and providing evidence for future reference.',
                  },
                  {
                    title: '4. Operational Efficiency',
                    icon: <Zap size={16} />,
                    content: 'Well-organized filing systems streamline business processes and improve operational efficiency. By providing easy access to necessary information, filing systems reduce the time spent searching for documents, minimizing delays, and improving productivity.',
                  },
                  {
                    title: '5. Security and Confidentiality',
                    icon: <Lock size={16} />,
                    content: 'Filing systems help organizations protect sensitive information and maintain confidentiality. By implementing access controls and security measures, organizations can restrict access to confidential documents and prevent unauthorized disclosure.',
                  },
                  {
                    title: '6. Space Management',
                    icon: <Box size={16} />,
                    content: 'Filing systems optimize the use of storage space, whether physical or digital. By organizing records efficiently, organizations can reduce the amount of space required for storage, minimizing costs, and maximizing efficiency. Digital filing especially reduces physical space required.',
                  },
                  {
                    title: '7. Data Analysis and Reporting',
                    icon: <Database size={16} />,
                    content: 'Filing systems facilitate data analysis and reporting by providing a structured and organized repository of information. By organizing data in a consistent manner, organizations can easily extract and analyse relevant information, generating reports and insights to support business decisions.',
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

            {/* SECTION 3: Colour Coding of Files */}
            <div
              ref={(el) => {
                sectionRefs.current['colour-coding'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Colour Coding of Files
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Colour coding of files is a visual system used in records management to enhance organization and improve retrieval speed. It assigns specific colours to different categories or attributes of files, making them easily identifiable at a glance. Here is a breakdown of the essence of colour coding:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Visual Differentiation and Quick Identification',
                    icon: <Eye size={16} />,
                    content: 'The core purpose of colour coding is to create visual distinctions between different sets of files. When files are stored together, colour coding allows users to instantly identify specific categories without needing to read individual labels. For example, client files might be color-coded by industry, project files by status, or personnel files by department. This visual differentiation significantly reduces the time spent searching for files, as users can quickly scan the filing system and locate the desired colour. This is especially beneficial in high-volume filing environments where speed and efficiency are crucial.',
                  },
                  {
                    title: '2. Categorization and Organization',
                    icon: <Layout size={16} />,
                    content: 'Colour coding facilitates the categorization and organization of files based on predefined attributes. Each colour represents a specific category, such as client type, project status, department, or date range. By assigning colours consistently, organizations create a structured and logical filing system. This structured approach helps maintain order and prevents misfiling, as users can easily spot misplaced files based on their colour. This method is especially helpful in large organizations where multiple individuals handle files.',
                  },
                  {
                    title: '3. Enhanced Retrieval Speed and Efficiency',
                    icon: <ClockIcon size={16} />,
                    content: 'One of the primary benefits of colour coding is the significant improvement in retrieval speed. When files are color-coded, users can quickly scan the filing system and locate the desired files based on their assigned colours. This eliminates the need to read individual labels, saving time and reducing the risk of errors. This enhanced retrieval speed is particularly valuable in time-sensitive situations or when dealing with urgent requests.',
                  },
                  {
                    title: '4. Reduced Misfiling and Errors',
                    icon: <AlertCircleIcon size={16} />,
                    content: 'Colour coding helps to minimize misfiling and errors by making it easy to identify misplaced files. If a file is out of place, its colour will immediately stand out, alerting users to the error. This visual cue helps to maintain the integrity of the filing system and ensures that files are always in their correct locations. This reduction in errors is especially important for legal, financial, or medical records, where accuracy is paramount.',
                  },
                  {
                    title: '5. Improved Accessibility and User-Friendliness',
                    icon: <Users size={16} />,
                    content: 'Colour coding makes filing systems more accessible and user-friendly, especially for individuals who may have difficulty reading or processing text-based labels. The visual nature of colour coding provides an intuitive way to navigate and retrieve files, making the filing system more inclusive. This improved accessibility enhances productivity and reduces frustration, especially in busy work environments.',
                  },
                  {
                    title: '6. Standardization and Consistency',
                    icon: <SettingsIcon size={16} />,
                    content: 'Effective colour coding requires standardization and consistency across the organization. This involves defining a clear color-coding scheme and ensuring that all employees adhere to it. A standardized system prevents confusion and ensures that files are consistently organized and retrieved. This consistency is essential for maintaining the effectiveness of the color-coding system and ensuring that all users can easily understand and utilize it.',
                  },
                  {
                    title: '7. Adaptability and Customization',
                    icon: <Edit size={16} />,
                    content: 'Colour coding systems can be adapted and customized to meet the specific needs of different organizations and departments. This flexibility allows organizations to tailor the system to their unique requirements and preferences. For example, a law firm might color-code files based on case type, while a marketing agency might color-code files based on campaign status. This adaptability ensures that the color-coding system remains relevant and effective over time.',
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

            {/* SECTION 4: The Process of File Closure and Retirement */}
            <div
              ref={(el) => {
                sectionRefs.current['closure-retirement'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Process of File Closure and Retirement
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The process of file closure and retirement is a critical aspect of records management, ensuring that files are properly handled at the end of their active lifecycle. It involves a series of steps to determine when a file is no longer needed for current operations, prepare it for long-term storage or disposal, and ultimately remove it from active use. Here is a breakdown of the process:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Determination of File Inactivity',
                    icon: <ClockIcon size={16} />,
                    content: 'The first step in file closure is determining when a file is no longer actively used. This is often triggered by specific events, such as the completion of a project, the end of a fiscal year, or the passage of a defined retention period. Organizations establish policies and procedures to define these triggers, ensuring consistency in identifying inactive files. Regular reviews of active files are conducted to identify those that meet the criteria for closure. This process is crucial for preventing the accumulation of unnecessary files in active storage, which can clutter the system and hinder retrieval.',
                  },
                  {
                    title: '2. Review and Verification of File Content',
                    icon: <SearchIcon size={16} />,
                    content: 'Before closing a file, a thorough review of its contents is conducted to verify its completeness and accuracy. This step ensures that all necessary documents are present and that any errors or omissions are addressed. The review may involve comparing the file\'s contents against a checklist or verifying them against other related records. This verification process is essential for maintaining the integrity of the records and ensuring that all relevant information is preserved. It also provides an opportunity to identify any documents that may need to be retained for legal or historical purposes.',
                  },
                  {
                    title: '3. Application of Retention Schedules',
                    icon: <ListChecks size={16} />,
                    content: 'Once a file is deemed inactive and its contents are verified, the organization\'s retention schedule is applied. Retention schedules specify how long different types of records must be kept, based on legal, regulatory, and business requirements. These schedules dictate whether a file should be retained for long-term storage or disposed of. Applying retention schedules ensures compliance with applicable laws and regulations and prevents the unnecessary storage of records beyond their required retention period. This step is critical for managing storage space and minimizing legal risks.',
                  },
                  {
                    title: '4. Preparation for Retirement or Disposal',
                    icon: <Box size={16} />,
                    content: 'If a file is to be retained for long-term storage, it must be prepared for retirement. This involves transferring the file to inactive storage, which may be an offsite facility or a separate section of the organization\'s records centre. The file is typically labelled with its closure date and retention period to facilitate future retrieval and disposal. If a file is to be disposed of, it must be prepared for secure destruction. This may involve shredding paper documents or securely wiping digital files to prevent unauthorized access to sensitive information. Proper preparation for retirement or disposal is essential for maintaining the confidentiality and integrity of records.',
                  },
                  {
                    title: '5. Secure Destruction or Transfer to Archival Storage',
                    icon: <Trash2 size={16} />,
                    content: 'For files designated for disposal, secure destruction methods are employed. This ensures that the information contained in the files is completely and irreversibly destroyed. Paper documents are typically shredded using industrial-grade shredders, while digital files are securely wiped or degaussed. The destruction process is documented to provide an audit trail and demonstrate compliance with data protection regulations. For files designated for archival storage, they are transferred to secure archival facilities that provide appropriate environmental conditions for long-term preservation. This transfer is carefully documented to maintain a chain of custody and ensure the records\' integrity.',
                  },
                  {
                    title: '6. Documentation of File Closure and Retirement',
                    icon: <FileText size={16} />,
                    content: 'The entire file closure and retirement process is documented to create an audit trail and ensure accountability. This documentation includes the closure date, the reason for closure, the retention period, the disposal method, and the transfer details. This documentation is essential for demonstrating compliance with legal and regulatory requirements and for providing evidence of proper records management practices. It also facilitates future retrieval and tracking of retired records.',
                  },
                  {
                    title: '7. Periodic Review of Retired Files',
                    icon: <RefreshCwIcon2 size={16} />,
                    content: 'Retired files that are retained for long-term storage are periodically reviewed to determine if they still meet the retention requirements. This review ensures that records are not retained beyond their required retention period and that storage space is used efficiently. Any files that are no longer needed are disposed of according to the organization\'s disposal procedures. This periodic review helps to maintain the integrity of the records management system and prevent the accumulation of unnecessary files.',
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

            {/* SECTION 5: Factors That Determine File Closure */}
            <div
              ref={(el) => {
                sectionRefs.current['closure-factors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors That Determine File Closure
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    File closure, the process of marking a file as inactive and transitioning it to long-term storage or disposal, is a critical step in records management. Several factors determine when a file should be closed, ensuring that records are retained for the appropriate duration and disposed of when no longer needed. Here is a breakdown of these factors:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Completion of Action or Transaction',
                    icon: <CheckCircleIcon size={16} />,
                    content: 'One of the primary factors determining file closure is the completion of the action or transaction documented within the file. For example, a project file may be closed upon the project\'s completion, a contract file upon the contract\'s termination, or a purchase order file upon the fulfilment of the order. Once the documented action or transaction is finalized, the file no longer serves an active operational purpose and can be considered for closure. This factor ensures that files are retained only for as long as they are needed for ongoing business activities and that they are not unnecessarily kept in active storage.',
                  },
                  {
                    title: '2. Legal and Regulatory Requirements',
                    icon: <Shield size={16} />,
                    content: 'Legal and regulatory requirements play a significant role in determining file closure. Many industries and jurisdictions have specific regulations regarding the retention of certain types of records. For instance, financial records may need to be retained for a specified period for tax or audit purposes, while legal documents may need to be kept for a longer duration to comply with statutes of limitations. Organizations must adhere to these requirements to avoid legal penalties and ensure compliance. These requirements often dictate the minimum retention period for records, after which they can be considered for closure.',
                  },
                  {
                    title: '3. Retention Schedules',
                    icon: <ListChecks size={16} />,
                    content: 'Retention schedules are essential tools for determining file closure. These schedules outline how long different types of records should be retained, based on legal, regulatory, and business needs. They provide a systematic approach to managing records and ensuring that they are kept for the appropriate duration. Retention schedules are typically developed in consultation with legal, compliance, and departmental stakeholders. They consider factors such as legal requirements, audit needs, and operational requirements. By adhering to retention schedules, organizations can ensure that records are not retained indefinitely and that they are disposed of when no longer needed.',
                  },
                  {
                    title: '4. Business Needs and Operational Requirements',
                    icon: <Target size={16} />,
                    content: 'Business needs and operational requirements also influence file closure. Some records may be needed for ongoing business operations, such as customer service, product development, or research. These records may need to be retained for a longer period than records that are no longer relevant to current activities. Organizations must assess their operational needs and determine the appropriate retention period for different types of records. This factor ensures that records are retained for as long as they are necessary to support business operations and that they are not disposed of prematurely.',
                  },
                  {
                    title: '5. Audit and Compliance Requirements',
                    icon: <Clipboard size={16} />,
                    content: 'Audit and compliance requirements play a crucial role in determining file closure. Some records may need to be retained for audit purposes or to demonstrate compliance with industry standards or regulatory requirements. For example, financial records may need to be retained for several years to facilitate audits by external auditors or regulatory agencies. Organizations must consider these requirements when determining the retention period for records and ensure that they are retained for as long as necessary to meet audit and compliance obligations.',
                  },
                  {
                    title: '6. Storage Space and Cost Considerations',
                    icon: <Box size={16} />,
                    content: 'Storage space and cost considerations can also influence file closure. Organizations must balance the need to retain records with the cost of storing them. As storage space becomes limited or storage costs increase, organizations may need to prioritize the retention of essential records and dispose of non-essential records. This factor encourages organizations to manage their records efficiently and avoid the unnecessary accumulation of files.',
                  },
                  {
                    title: '7. Technological Obsolescence',
                    icon: <Zap size={16} />,
                    content: 'Technological obsolescence can impact file closure, particularly for digital records. As technology evolves, file formats and storage media may become obsolete, making it difficult to access and retrieve records. Organizations must consider the long-term accessibility of digital records and develop strategies for migrating or converting them to more current formats. This factor ensures that digital records remain accessible and usable over time and that they are not lost due to technological obsolescence.',
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

            {/* SECTION 6: Procedures and Policies for Closing Files */}
            <div
              ref={(el) => {
                sectionRefs.current['closure-procedures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procedures and Policies for Closing Files
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Applying established procedures and policies for closing files is essential for maintaining an organized and compliant records management system. This process ensures that files are handled consistently, efficiently, and in accordance with legal and organizational requirements. Here is a breakdown of how to apply these procedures and policies:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Verification of File Completion and Inactivity',
                    icon: <SearchIcon size={16} />,
                    content: 'The initial step in applying file closure procedures involves verifying that the file has reached its completion point or has become inactive. This requires a thorough review of the file\'s contents to confirm that all actions, transactions, or projects documented within it are finalized. For instance, if the file pertains to a specific project, confirmation of the project\'s completion is necessary. If it is a transactional file, confirmation that the transaction is fully processed is required. Inactivity is often determined by a predefined period during which no new entries or updates have been made. This verification ensures that files are not prematurely closed while still in active use, preventing potential disruptions to ongoing operations. This step often involves cross-referencing with other relevant systems or departments to ensure accuracy.',
                  },
                  {
                    title: '2. Application of Retention Schedules',
                    icon: <ListChecks size={16} />,
                    content: 'Once file completion or inactivity is confirmed, the relevant retention schedule must be applied. Retention schedules are pre-determined guidelines that specify how long various types of records must be retained based on legal, regulatory, and business requirements. These schedules dictate whether a file should be retained for long-term storage or disposed of immediately. Applying these schedules involves identifying the file\'s category and referencing the corresponding retention period. For example, financial records may have a seven-year retention period, while personnel files might require a longer retention period. This step ensures compliance with applicable laws and prevents the unnecessary storage of records beyond their required retention period, optimizing storage space and minimizing legal risks.',
                  },
                  {
                    title: '3. Documentation and Authorization of File Closure',
                    icon: <FileText size={16} />,
                    content: 'Proper documentation and authorization are crucial for maintaining an audit trail and ensuring accountability. This involves recording the file\'s closure date, the reason for closure, the applicable retention schedule, and the authorized personnel responsible for the closure. For digital files, this might involve updating metadata or logging the closure in a records management system. For physical files, it might entail completing a closure form or updating a file tracking system. Authorization should be obtained from designated personnel, such as records managers or departmental heads, to ensure that the closure is carried out in accordance with organizational policies. This documentation serves as evidence of proper file handling and supports compliance with legal and regulatory requirements.',
                  },
                  {
                    title: '4. Preparation for Long-Term Storage or Disposal',
                    icon: <Box size={16} />,
                    content: 'Depending on the retention schedule, the file must be prepared for either long-term storage or disposal. For files designated for long-term storage, this involves transferring them to inactive storage, which may be an offsite facility or a dedicated archive. The files should be appropriately labelled and packaged to ensure their preservation and facilitate future retrieval. For files designated for disposal, secure destruction methods must be employed. This might include shredding paper documents using industrial-grade shredders or securely wiping digital files using specialized software. This step ensures that sensitive information is protected, and that disposal is carried out in compliance with data protection regulations.',
                  },
                  {
                    title: '5. Secure Destruction or Transfer to Archival Storage',
                    icon: <Trash2 size={16} />,
                    content: 'The actual destruction or transfer of the file must be carried out in a secure and documented manner. For physical files slated for destruction, shredding or incineration should be conducted under secure conditions, with appropriate documentation of the destruction process. For digital files, secure wiping or degaussing should be performed by authorized personnel, with logs maintained to record the process. For files transferred to archival storage, a chain of custody should be established, documenting the transfer, and ensuring the files\' integrity. This step ensures that files are handled in a manner that protects sensitive information and complies with organizational policies and legal requirements.',
                  },
                  {
                    title: '6. Updating Records Management Systems',
                    icon: <RefreshCwIcon2 size={16} />,
                    content: 'Following the closure and disposal or transfer of files, records management systems must be updated to reflect the changes. This includes updating file tracking systems, metadata databases, and any other relevant records management tools. This step ensures that the records management system remains accurate and up to date, facilitating efficient retrieval and preventing confusion. Updating these systems also ensures that all personnel are aware of the file\'s current status and location, preventing unnecessary searches or inquiries.',
                  },
                  {
                    title: '7. Periodic Review and Audit of Closed Files',
                    icon: <Clipboard size={16} />,
                    content: 'To ensure ongoing compliance and effectiveness, closed files should be periodically reviewed and audited. This involves verifying that files have been closed and disposed of or transferred according to established procedures and policies. Audits should also assess the effectiveness of the closure process and identify any areas for improvement. This step helps to maintain the integrity of the records management system and ensures that files are handled consistently and efficiently over time. It also provides an opportunity to update procedures and policies as needed to reflect changes in legal, regulatory, or organizational requirements.',
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

            {/* SECTION 7: Factors That Determine the Choice of Storage Equipment */}
            <div
              ref={(el) => {
                sectionRefs.current['storage-factors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors That Determine the Choice of Storage Equipment
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Choosing the right storage equipment is crucial for efficient records management. Several factors influence this decision, ensuring that records are stored securely, accessible, and in compliance with organizational and legal requirements. Here is an assessment of these factors:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Type and Format of Records',
                    icon: <FileText size={16} />,
                    content: 'The type and format of records significantly impact the choice of storage equipment. Paper documents, digital files, multimedia, and archival materials each have unique storage requirements. Paper documents may need filing cabinets, shelving, or archival boxes, while digital files require servers, hard drives, cloud storage, or tape backups. Multimedia files might necessitate specialized storage solutions like optical discs or high-capacity drives. Archival materials often demand climate-controlled environments and acid-free storage. Understanding the specific characteristics of your records is essential for selecting equipment that ensures their preservation and accessibility.',
                  },
                  {
                    title: '2. Volume of Records',
                    icon: <Database size={16} />,
                    content: 'The volume of records to be stored is a critical factor in determining storage equipment. A small organization with limited records might opt for simple filing cabinets or external hard drives. However, a large organization with vast amounts of data may require high-density storage solutions, such as automated storage and retrieval systems (AS/RS), large server farms, or cloud storage. The volume of records also influences the scalability of the chosen equipment. Selecting equipment that can accommodate future growth is essential to avoid frequent and costly upgrades.',
                  },
                  {
                    title: '3. Accessibility and Retrieval Needs',
                    icon: <SearchIcon size={16} />,
                    content: 'The frequency and speed with which records need to be accessed are crucial considerations. If records are frequently accessed, equipment that allows for quick retrieval is necessary. For paper documents, this might mean well-organized filing cabinets or open shelving. For digital records, it could involve fast servers, indexed databases, or cloud storage with rapid retrieval capabilities. Conversely, archival records that are rarely accessed might be stored in less accessible but more cost-effective solutions. Assessing the organization\'s retrieval needs ensures that records are readily available when required, supporting operational efficiency.',
                  },
                  {
                    title: '4. Security and Confidentiality Requirements',
                    icon: <Lock size={16} />,
                    content: 'Security and confidentiality requirements are paramount, especially for sensitive records. Legal, financial, and personnel records often require stringent security measures. For physical records, this might include locked cabinets, secure rooms, or offsite storage facilities with controlled access. For digital records, it involves encryption, access controls, firewalls, and intrusion detection systems. The chosen storage equipment must comply with relevant data protection regulations and organizational security policies. Implementing robust security measures protects sensitive information from unauthorized access and data breaches.',
                  },
                  {
                    title: '5. Environmental Conditions',
                    icon: <Sun size={16} />,
                    content: 'Environmental conditions, such as temperature, humidity, and light exposure, can significantly impact the preservation of records, particularly physical documents, and archival materials. Paper documents can degrade in high humidity or extreme temperatures, while digital media can be damaged by electromagnetic fields or temperature fluctuations. Therefore, climate-controlled storage environments, fire suppression systems, and protection from electromagnetic interference may be necessary. Selecting storage equipment that maintains optimal environmental conditions ensures the longevity and integrity of records.',
                  },
                  {
                    title: '6. Cost and Budget Considerations',
                    icon: <DollarSign size={16} />,
                    content: 'Cost and budget considerations play a significant role in the selection of storage equipment. Organizations must balance the need for effective storage solutions with budgetary constraints. Factors such as initial purchase costs, maintenance expenses, and ongoing operational costs should be considered. Cloud storage, for example, may offer cost-effective solutions for digital records, while specialized archival storage can be expensive. Conducting a cost-benefit analysis helps organizations make informed decisions that align with their financial resources.',
                  },
                  {
                    title: '7. Legal and Regulatory Compliance',
                    icon: <Clipboard size={16} />,
                    content: 'Legal and regulatory compliance is a critical factor in determining storage equipment. Many industries have specific regulations regarding the retention and storage of records. For example, financial records may need to be stored in compliance with audit requirements, while medical records must adhere to privacy regulations. The chosen storage equipment must meet these compliance standards to avoid legal penalties and ensure adherence to industry best practices.',
                  },
                  {
                    title: '8. Disaster Recovery and Business Continuity',
                    icon: <Shield size={16} />,
                    content: 'Disaster recovery and business continuity planning influence the choice of storage equipment. Organizations must consider the potential impact of disasters such as fires, floods, or cyberattacks on their records. Offsite backups, redundant storage systems, and cloud-based disaster recovery solutions are essential for ensuring data recovery and business continuity. The storage equipment should facilitate efficient data backup and recovery processes, minimizing downtime and data loss.',
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

            {/* SECTION 8: Types of Storage Equipment Used in Information Repositories */}
            <div
              ref={(el) => {
                sectionRefs.current['storage-types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Types of Storage Equipment Used in Information Repositories
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Information repositories, whether physical or digital, require appropriate storage equipment to ensure the safe, efficient, and accessible preservation of data. The types of storage equipment used vary depending on the nature of the information, its volume, and the organization\'s needs. Here is a discussion of various types of storage equipment:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Traditional Filing Cabinets and Shelving',
                    icon: <Folder size={16} />,
                    content: 'For physical documents, traditional filing cabinets and shelving remain essential. Filing cabinets, especially vertical and lateral types, offer organized storage for paper files, folders, and documents. They provide secure storage, protecting documents from dust, light, and unauthorized access. Shelving units, on the other hand, are suitable for larger volumes of documents, boxes, and binders. They offer open access, making it easier to browse and retrieve files. These traditional methods are still widely used for legal documents, personnel records, and other paper-based information that requires physical preservation and easy access.',
                  },
                  {
                    title: '2. Archival Boxes and Storage',
                    icon: <Archive size={16} />,
                    content: 'Archival boxes and specialized storage are crucial for preserving historical documents, artifacts, and other valuable materials. These boxes are made from acid-free materials to prevent deterioration and ensure the longevity of the documents. Archival storage facilities often provide controlled environments with stable temperature and humidity levels to protect sensitive materials from damage. These solutions are used by libraries, museums, and historical societies to preserve irreplaceable documents and artifacts for future generations.',
                  },
                  {
                    title: '3. Hard Disk Drives (HDDs) and Solid-State Drives (SSDs)',
                    icon: <HardDriveIcon size={16} />,
                    content: 'For digital information, hard disk drives (HDDs) and solid-state drives (SSDs) are fundamental storage devices. HDDs use magnetic platters to store data, offering large storage capacities at relatively low costs. They are suitable for storing large volumes of data, such as documents, multimedia files, and databases. SSDs, on the other hand, use flash memory to store data, providing faster read and write speeds. They are ideal for applications that require rapid data access, such as operating systems, applications, and frequently accessed files. Both HDDs and SSDs are used in personal computers, servers, and data centres to store and manage digital information.',
                  },
                  {
                    title: '4. Network Attached Storage (NAS)',
                    icon: <Server size={16} />,
                    content: 'Network Attached Storage (NAS) devices provide centralized storage for multiple users on a network. They are typically connected to a local network and offer file sharing and data backup capabilities. NAS devices are suitable for small to medium-sized businesses that require shared storage for documents, multimedia files, and other data. They provide easy access to files from multiple devices and offer data redundancy to protect against data loss. NAS devices are often used for file sharing, data backup, and media streaming.',
                  },
                  {
                    title: '5. Storage Area Networks (SANs)',
                    icon: <LayersIcon size={16} />,
                    content: 'Storage Area Networks (SANs) are high-speed networks that provide block-level access to storage devices. They are used in large enterprises and data centres to store and manage critical data. SANs offer high performance, scalability, and reliability, making them suitable for applications that require rapid data access, such as databases, virtual machines, and transaction processing. SANs use fibre channel or iSCSI protocols to connect servers and storage devices, providing high-speed data transfer and low latency.',
                  },
                  {
                    title: '6. Tape Drives and Libraries',
                    icon: <Database size={16} />,
                    content: 'Tape drives and libraries are used for long-term data archiving and backup. Tape drives use magnetic tape to store data, providing high storage capacities at low costs. They are suitable for storing large volumes of data that are rarely accessed, such as archival records and backup copies. Tape libraries automate the loading and unloading of tape cartridges, improving efficiency and reducing manual intervention. Tape drives and libraries are used for disaster recovery, long-term data retention, and compliance purposes.',
                  },
                  {
                    title: '7. Optical Discs (CDs, DVDs, Blu-ray)',
                    icon: <Disc size={16} />,
                    content: 'Optical discs, such as CDs, DVDs, and Blu-ray discs, are used for storing digital data. They provide portable and durable storage for documents, multimedia files, and software. Optical discs are suitable for distributing software, storing multimedia content, and archiving data. While less popular than they once were, they still have niche applications.',
                  },
                  {
                    title: '8. Cloud Storage',
                    icon: <Cloud size={16} />,
                    content: 'Cloud storage services offer scalable and flexible storage solutions for digital data. They provide on-demand access to storage resources over the internet, eliminating the need for organizations to maintain their own storage infrastructure. Cloud storage is suitable for storing backups, archives, and frequently accessed data. It offers features such as data redundancy, disaster recovery, and global accessibility. Cloud storage services are provided by companies like Amazon Web Services (AWS), Google Cloud, and Microsoft Azure.',
                  },
                  {
                    title: '9. Automated Storage and Retrieval Systems (AS/RS)',
                    icon: <Zap size={16} />,
                    content: 'Automated Storage and Retrieval Systems (AS/RS) are used in large warehouses and distribution centres to store and retrieve items automatically. They use robotic systems to move and store items in high-density storage racks. AS/RS systems improve efficiency, reduce labour costs, and optimize storage space. They are used for inventory management, order fulfilment, and document storage.',
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

            {/* SECTION 9: Difference Between Centralised and Decentralised Records Storage Systems */}
            <div
              ref={(el) => {
                sectionRefs.current['centralised-decentralised'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Difference Between Centralised and Decentralised Records Storage Systems
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Centralized and decentralized records storage systems represent two distinct approaches to managing an organization's records, each with its own set of advantages and disadvantages. Understanding the differences between these systems is crucial for organizations to select the most appropriate method for their specific needs. Here is a detailed comparison:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Location of Records',
                    icon: <MapPin size={16} />,
                    content: (
                      <>
                        <p><strong>Centralized Records Storage:</strong> In a centralized system, all records are stored in a single, central location. This location can be a dedicated records centre, a central server, or a cloud-based repository. All departments and employees access records from this central point. This approach ensures uniformity and control over record keeping.</p>
                        <p><strong>Decentralized Records Storage:</strong> In a decentralized system, records are stored in various locations throughout the organization, often within individual departments or offices. Each department manages its own records, resulting in distributed storage. This approach allows for greater autonomy and localized control over records.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Control and Standardization',
                    icon: <SettingsIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Centralized Records Storage:</strong> Centralized systems offer greater control over records management. Standardized procedures, policies, and retention schedules are consistently applied across the organization. This ensures uniformity in record keeping practices, facilitating compliance, and minimizing inconsistencies.</p>
                        <p><strong>Decentralized Records Storage:</strong> Decentralized systems often lack uniformity and standardization. Each department may implement its own record keeping practices, leading to inconsistencies and potential compliance issues. Control over records is distributed, making it more challenging to enforce organization-wide policies.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Accessibility and Retrieval',
                    icon: <SearchIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Centralized Records Storage:</strong> Centralized systems can improve accessibility and retrieval for authorized personnel. A single point of access simplifies searching and locating records. However, physical distance or network limitations can sometimes create delays in retrieval.</p>
                        <p><strong>Decentralized Records Storage:</strong> Decentralized systems can offer faster retrieval for department-specific records. However, locating records across different departments can be challenging and time-consuming. Lack of a central index or catalogue can hinder efficient retrieval.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Security and Confidentiality',
                    icon: <Lock size={16} />,
                    content: (
                      <>
                        <p><strong>Centralized Records Storage:</strong> Centralized systems can enhance security and confidentiality. Centralized control allows for the implementation of robust security measures, such as access controls, encryption, and secure storage facilities. This minimizes the risk of unauthorized access and data breaches.</p>
                        <p><strong>Decentralized Records Storage:</strong> Decentralized systems can pose greater security risks. Distributed storage makes it more difficult to implement and enforce security measures. Increased access points and potential variations in security protocols can increase vulnerability to breaches.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Cost and Efficiency',
                    icon: <DollarSign size={16} />,
                    content: (
                      <>
                        <p><strong>Centralized Records Storage:</strong> Centralized systems can be more cost-effective in the long run. Consolidating storage and management resources reduces duplication and eliminates redundant infrastructure. Centralized systems can also improve efficiency through standardized procedures and centralized expertise.</p>
                        <p><strong>Decentralized Records Storage:</strong> Decentralized systems can lead to increased costs due to duplication of resources and infrastructure. Maintaining separate storage facilities and record management systems in each department can be expensive. Inefficiencies can also arise from inconsistent practices and decentralized control.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Responsiveness and Flexibility',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>Centralized Records Storage:</strong> Centralized systems can sometimes be less responsive to the specific needs of individual departments. Changes to record management policies or procedures may require organization-wide implementation, potentially delaying responses to urgent departmental needs.</p>
                        <p><strong>Decentralized Records Storage:</strong> Decentralized systems can offer greater responsiveness to the specific needs of individual departments. Departments have greater flexibility to tailor their record management practices to their unique requirements.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Disaster Recovery and Business Continuity',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p><strong>Centralized Records Storage:</strong> Centralized systems can facilitate more effective disaster recovery and business continuity planning. A centralized backup and recovery system can ensure that all records are protected and can be restored quickly in the event of a disaster.</p>
                        <p><strong>Decentralized Records Storage:</strong> Decentralized systems can complicate disaster recovery and business continuity planning. Ensuring consistent backups and recovery procedures across multiple departments can be challenging, increasing the risk of data loss.</p>
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

            {/* SECTION 10: Difference Between Electronic and Manual Records Storage Systems */}
            <div
              ref={(el) => {
                sectionRefs.current['electronic-manual'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Difference Between Electronic and Manual Records Storage Systems
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Electronic and manual records storage systems represent two distinct approaches to organizing and managing information, each with its own set of advantages and disadvantages. Here is a comparison and contrast of these systems:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Storage Medium',
                    icon: <HardDriveIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Electronic Records Storage:</strong> Electronic systems utilize digital storage media, such as hard drives, solid-state drives, cloud storage, and databases. Information is stored as digital files, which can include documents, images, audio, and video. This method allows for high-density storage and efficient retrieval of large volumes of data.</p>
                        <p><strong>Manual Records Storage:</strong> Manual systems rely on physical storage media, such as paper documents, folders, filing cabinets, and archival boxes. Information is stored in tangible form, requiring physical space for storage and organization. This method is often used for legal documents, historical records, and other materials that require physical preservation.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Retrieval Speed and Efficiency',
                    icon: <ClockIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Electronic Records Storage:</strong> Electronic systems offer significantly faster retrieval speeds. Search and retrieval can be performed using keywords, metadata, and indexing, allowing users to quickly locate specific information. Automated search functions and database queries enable rapid access to data, improving efficiency and productivity.</p>
                        <p><strong>Manual Records Storage:</strong> Manual systems are generally slower for retrieval. Locating a specific document requires physically searching through filing cabinets or boxes, which can be time-consuming and labour-intensive. This method is prone to human error, such as misfiling or lost documents, further slowing down retrieval.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Storage Capacity and Space Requirements',
                    icon: <Box size={16} />,
                    content: (
                      <>
                        <p><strong>Electronic Records Storage:</strong> Electronic systems offer virtually unlimited storage capacity. Digital storage media can hold vast amounts of data in a relatively small physical space. Cloud storage provides scalable storage solutions, allowing organizations to expand their storage capacity as needed.</p>
                        <p><strong>Manual Records Storage:</strong> Manual systems require significant physical space for storage. Filing cabinets, boxes, and shelves occupy valuable office space, and storage costs can increase with the volume of records. This method is less efficient for storing large volumes of data.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Security and Confidentiality',
                    icon: <Lock size={16} />,
                    content: (
                      <>
                        <p><strong>Electronic Records Storage:</strong> Electronic systems offer robust security measures, such as encryption, access controls, and audit trails. These measures can protect sensitive information from unauthorized access and data breaches. However, electronic systems are also vulnerable to cyberattacks and data loss due to hardware failures or software errors.</p>
                        <p><strong>Manual Records Storage:</strong> Manual systems can be secured through physical access controls, such as locked cabinets and secure rooms. However, they are vulnerable to physical damage, such as fire, flood, or theft. Maintaining confidentiality can be challenging, as paper documents can be easily copied or misplaced.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Data Integrity and Accuracy',
                    icon: <CheckCircleIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Electronic Records Storage:</strong> Electronic systems can ensure data integrity through automated data validation, version control, and backup procedures. These measures minimize the risk of data corruption and ensure that information remains accurate and up to date.</p>
                        <p><strong>Manual Records Storage:</strong> Manual systems are prone to human error, such as incorrect data entry, misplaced documents, and damaged records. Maintaining data integrity and accuracy can be challenging, especially with large volumes of records.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Cost and Maintenance',
                    icon: <DollarSign size={16} />,
                    content: (
                      <>
                        <p><strong>Electronic Records Storage:</strong> Electronic systems require significant upfront investments in hardware, software, and infrastructure. However, they can offer long-term cost savings through reduced storage space, improved efficiency, and automated processes. Maintenance costs include software updates, hardware repairs, and data backups.</p>
                        <p><strong>Manual Records Storage:</strong> Manual systems have lower upfront costs but higher long-term costs due to storage space requirements, labour costs for filing and retrieval, and the potential for lost or damaged documents. Maintenance costs include purchasing filing cabinets, folders, and other supplies.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Accessibility and Sharing',
                    icon: <GlobeIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Electronic Records Storage:</strong> Electronic systems facilitate easy access and sharing of information. Digital files can be accessed from multiple locations and shared electronically, improving collaboration and communication. Cloud storage enables remote access and real-time collaboration.</p>
                        <p><strong>Manual Records Storage:</strong> Manual systems are less flexible for sharing information. Physical documents must be physically transported or copied, which can be time-consuming and inefficient. Access is limited to the physical location of the records.</p>
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

            {/* SECTION 11: Requirements for Records Storage Facilities */}
            <div
              ref={(el) => {
                sectionRefs.current['storage-requirements'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Requirements for Records Storage Facilities
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Records storage facilities, whether for physical or digital records, require specific conditions to ensure the preservation, security, and accessibility of information. These requirements are crucial for maintaining the integrity of records and complying with legal and organizational standards. Here is a breakdown of the key requirements:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Environmental Controls',
                    icon: <Sun size={16} />,
                    content: 'Maintaining stable environmental conditions is essential for the long-term preservation of records, especially physical documents, and archival materials. Fluctuations in temperature and humidity can cause paper to deteriorate, ink to fade, and digital media to degrade. Therefore, storage facilities must have climate control systems that regulate temperature and humidity within specified ranges. For paper records, this typically involves maintaining a temperature between 60-70°F (15-21°C) and a relative humidity between 35-50%. For digital media, stable temperatures and low humidity are also critical. Additionally, protection from excessive light, particularly ultraviolet (UV) light, is necessary to prevent fading and damage. Environmental monitoring systems should be in place to ensure that conditions remain within acceptable parameters.',
                  },
                  {
                    title: '2. Fire Protection and Prevention',
                    icon: <FireExtinguisher size={16} />,
                    content: 'Fire poses a significant threat to records, both physical and digital. Storage facilities must have robust fire protection and prevention systems to minimize the risk of fire and mitigate its impact. This includes installing fire detection systems, such as smoke detectors and heat sensors, and fire suppression systems, such as sprinklers or gaseous fire suppression systems. Fire-resistant construction materials and compartmentalization are also essential to prevent the spread of fire. For digital records, fire-resistant server rooms and data centres with redundant power supplies and cooling systems are necessary. Regular inspections and maintenance of fire protection systems are crucial to ensure their effectiveness.',
                  },
                  {
                    title: '3. Security and Access Control',
                    icon: <Lock size={16} />,
                    content: 'Security and access control measures are vital for protecting records from unauthorized access, theft, and tampering. Storage facilities must have physical security measures, such as locked doors, security cameras, and alarm systems, to prevent unauthorized entry. Access should be restricted to authorized personnel only, and access logs should be maintained to track entry and exit. For digital records, security measures include access controls, user authentication, encryption, and intrusion detection systems. Regular security audits and vulnerability assessments should be conducted to identify and address potential security risks.',
                  },
                  {
                    title: '4. Space Optimization and Organization',
                    icon: <Layout size={16} />,
                    content: 'Storage facilities must be designed to optimize space utilization and ensure efficient organization of records. This involves using appropriate storage equipment, such as filing cabinets, shelving, and archival boxes, that maximize storage capacity and facilitate easy retrieval. Records should be organized according to a logical classification system, such as alphabetical, numerical, or chronological order. Clear labelling and indexing are essential for quick and accurate retrieval. For digital records, efficient file management systems and metadata tagging are necessary to organize and retrieve data effectively.',
                  },
                  {
                    title: '5. Disaster Recovery and Business Continuity',
                    icon: <Shield size={16} />,
                    content: 'Storage facilities must have disaster recovery and business continuity plans in place to ensure the preservation and recovery of records in the event of a disaster, such as a fire, flood, or earthquake. This includes offsite backups for digital records and duplicate copies for physical records. Disaster recovery plans should outline the procedures for retrieving and restoring records, as well as the communication protocols and responsibilities of personnel. Regular testing and maintenance of disaster recovery systems are essential to ensure their effectiveness.',
                  },
                  {
                    title: '6. Compliance with Legal and Regulatory Requirements',
                    icon: <Clipboard size={16} />,
                    content: 'Storage facilities must comply with all applicable legal and regulatory requirements related to the storage and preservation of records. This includes adhering to retention schedules, data protection laws, and industry-specific regulations. For example, financial records may need to be stored in compliance with audit requirements, while medical records must adhere to privacy regulations. Regular audits and compliance checks should be conducted to ensure adherence to these requirements.',
                  },
                  {
                    title: '7. Pest Control and Prevention',
                    icon: <Bug size={16} />,
                    content: 'Pest control and prevention are essential for protecting physical records from damage caused by insects, rodents, and other pests. Storage facilities should implement pest control measures, such as regular inspections, traps, and chemical treatments, to prevent infestations. Proper housekeeping and sanitation practices are also necessary to minimize the risk of pest activity.',
                  },
                  {
                    title: '8. Monitoring and Maintenance',
                    icon: <RefreshCwIcon2 size={16} />,
                    content: 'Storage facilities require ongoing monitoring and maintenance to ensure that all systems and equipment are functioning properly. This includes regular inspections of environmental control systems, fire protection systems, security systems, and storage equipment. Maintenance schedules should be established and followed to prevent equipment failures and ensure the longevity of records.',
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

            {/* SECTION 12: Onsite Offsite Storage Facilities for Records and Information */}
            <div
              ref={(el) => {
                sectionRefs.current['onsite-offsite'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Onsite Offsite Storage Facilities for Records and Information
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Onsite and offsite storage facilities serve distinct purposes in records and information management, each offering unique advantages and disadvantages. Understanding these differences is crucial for organizations to develop a comprehensive storage strategy. Here is a discussion of both types of facilities:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Onsite Storage Facilities',
                    icon: <Home size={16} />,
                    content: (
                      <>
                        <p><strong>Definition and Characteristics:</strong> Onsite storage refers to the storage of records and information within the organization\'s own premises. This can include filing cabinets, storage rooms, server rooms, or data centres located within the organization\'s buildings. Onsite storage provides direct and immediate access to records, which is essential for day-to-day operations. It offers a sense of control and security, as the organization directly manages the storage environment.</p>
                        <p><strong>Advantages:</strong> Immediate Access: Onsite storage allows for quick retrieval of records, which is crucial for time-sensitive operations. Direct Control: Organizations have complete control over the storage environment, including security, access, and maintenance. Reduced Transportation Costs: There are no transportation costs associated with accessing records stored onsite. Enhanced Security (Potential): With proper security implementation, very high levels of local security can be maintained.</p>
                        <p><strong>Disadvantages:</strong> Limited Space: Onsite storage can be limited by available space within the organization\'s premises. Vulnerability to Local Disasters: Records are vulnerable to local disasters, such as fires, floods, or earthquakes, that may affect the organization\'s buildings. Higher Maintenance Costs: Organizations are responsible for the maintenance and upkeep of the storage facilities, which can be costly. Potential security risk: If proper protocol is not followed then internal security breaches are possible.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Offsite Storage Facilities',
                    icon: <Warehouse size={16} />,
                    content: (
                      <>
                        <p><strong>Definition and Characteristics:</strong> Offsite storage involves storing records and information in a location away from the organization\'s primary premises. This can include dedicated storage facilities operated by third-party providers, such as commercial records centres or cloud storage services. Offsite storage is often used for long-term retention of inactive records, disaster recovery, and business continuity purposes.</p>
                        <p><strong>Advantages:</strong> Increased Security: Offsite storage facilities, especially those provided by reputable providers, often have robust security measures in place. Disaster Recovery: Offsite storage provides a secure location for backups and duplicate records, ensuring data recovery in the event of a disaster. Space Optimization: Offsite storage frees up valuable space within the organization\'s premises. Environmental Controls: Professional offsite storage often maintains perfect environmental conditions for long term storage.</p>
                        <p><strong>Disadvantages:</strong> Accessibility Delays: Retrieving records from offsite storage can take time, especially for physical documents. Transportation Costs: There are transportation costs associated with moving records to and from offsite storage. Dependence on Third-Party Providers: Organizations rely on third-party providers for the security and maintenance of offsite storage facilities. Increased cost: Ongoing offsite storage facility fees.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Key Considerations',
                    icon: <Clipboard size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Legal and Regulatory Requirements: Organizations must consider legal and regulatory requirements regarding the storage and retention of records.</li>
                        <li>Business Continuity Planning: Both onsite and offsite storage play a role in business continuity planning, but offsite storage is particularly important for disaster recovery.</li>
                        <li>Cost-Benefit Analysis: Organizations should conduct a cost-benefit analysis to determine the most cost-effective storage solution.</li>
                        <li>Data Sensitivity: highly sensitive data should often be retained on sight, in highly controlled environments.</li>
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
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Storage Insight
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
                  <span>File Naming Tips</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">9</span>
                </li>
                <li className="flex justify-between">
                  <span>Filing Applications</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Storage Equipment Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">9</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Effective file naming uses clarity, keywords, consistency, dates, and version control. Colour coding enhances visual retrieval and reduces misfiling. File closure follows a structured process: verify inactivity, apply retention schedules, document, and securely dispose or archive. Storage equipment choice depends on record type, volume, accessibility, security, environment, and cost. Compare centralised vs decentralised and electronic vs manual systems to select the right approach.
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
                <strong className="text-white">File Naming &amp; Colour Coding</strong> – Use clear, descriptive names with dates and versions. Colour coding visually categorises files, speeds retrieval, and reduces misfiling.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">File Closure &amp; Retirement</strong> – Close files when inactive; apply retention schedules; document closure; secure dispose or transfer to archival storage. Seven factors determine closure: completion, legal, retention, business, audit, storage, and technology.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Storage Equipment</strong> – Choose based on record type, volume, accessibility, security, environment, cost, compliance, and disaster recovery. Options range from filing cabinets and HDDs to NAS, SANs, tape, cloud, and AS/RS.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Storage System Comparisons</strong> – Centralised offers control and standardisation; decentralised offers flexibility. Electronic provides speed and scalability; manual offers physical preservation. Onsite gives immediate access; offsite ensures disaster recovery.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Storage Facility Requirements</strong> – Environmental controls, fire protection, security, space optimisation, disaster recovery, legal compliance, pest control, and ongoing monitoring are essential for preserving records.
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
            Sidemann Academic Registry • Records &amp; Information Management – Learning Outcome 3 (Naming, Applications &amp; Storage)
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;