import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Hash,
  Paperclip,
  SearchIcon,
  ClockIcon,
  Layout,
  HardDriveIcon,
  Edit,
  Target,
  GlobeIcon,
  Shield,
  ListChecks,
  SettingsIcon,
  Type,
  BookOpen,
  LayersIcon,
  FileText,
  Scissors,
  CircleIcon,
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
  Users,
  MapPin,
  DollarSign,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'mark-out', label: 'Mark-Out Cards' },
  { id: 'circulation', label: 'Document Circulation' },
  { id: 'forms', label: 'Transit & Request Forms' },
  { id: 'distribution', label: 'Distribution Procedures' },
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
      {
        title: 'Did you know?',
        text: 'Mark-out cards have been used in libraries and archives for over a century to track the movement of physical materials.',
      },
      {
        title: 'Pro Tip',
        text: 'Always include an expected return date on mark-out cards to encourage timely return of files and prevent them from being lost.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the mark-out card fields with "I-B-D-E-P": Identification, Borrower, Date, Expected Return, Placeholder.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations forget to regularly audit mark-out cards, leading to missing files and accountability gaps.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Mark-out cards have been used in libraries and archives for over a century to track the movement of physical materials.',
      },
      {
        title: 'Pro Tip',
        text: 'Always include an expected return date on mark-out cards to encourage timely return of files and prevent them from being lost.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the mark-out card fields with "I-B-D-E-P": Identification, Borrower, Date, Expected Return, Placeholder.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations forget to regularly audit mark-out cards, leading to missing files and accountability gaps.',
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Mark-Out Cards, Document Circulation &{' '}
            <span className="text-amber-300 font-bold italic">
              Distribution Procedures
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to managing physical file movement, circulation workflows, and secure distribution of both electronic and physical documents.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Clipboard size={14} className="inline mr-1" /> Mark-Out
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Send size={14} className="inline mr-1" /> Circulation
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
                placeholder="Search for a concept, form, procedure..."
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
            {/* SECTION 1: Procedures for Completing Mark-Out Cards */}
            <div
              ref={(el) => {
                sectionRefs.current['mark-out'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procedures for Completing Mark-Out Cards
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Mark-out cards, also known as charge-out cards or out-cards, are essential tools in a manual records management system. They track the movement of physical files, ensuring accountability and preventing lost or misplaced documents. Completing these cards accurately is crucial for maintaining the integrity of the filing system. Here is a breakdown of the procedures:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Identification of the File',
                    icon: <File size={16} />,
                    content: 'The first step involves accurately identifying the file being removed. This requires noting down the file\'s unique identifier, which could be a file number, a subject heading, or a client name. This information must match the file\'s label precisely to avoid confusion. Additionally, the file\'s title or a brief description should be recorded to provide context. This step is critical because it establishes a clear link between the mark-out card and the specific file being borrowed.',
                  },
                  {
                    title: '2. Recording the Borrower\'s Information',
                    icon: <User size={16} />,
                    content: 'Next, the borrower\'s information is recorded on the mark-out card. This includes their name, department or office, and contact details. This information identifies who is responsible for the file and allows for easy follow-up if the file is not returned promptly. Recording the borrower\'s department or office helps to track file movement within the organization and identify potential bottlenecks. This step is essential for maintaining accountability and ensuring that the file can be traced back to the responsible individual.',
                  },
                  {
                    title: '3. Date and Time of Borrowing',
                    icon: <Calendar size={16} />,
                    content: 'The date and time when the file is borrowed are recorded on the mark-out card. This information establishes a timeline for the file\'s movement and helps to track how long it has been out of the filing system. This is particularly important for files with time-sensitive information or those subject to specific retention policies. Recording the time of borrowing can also help to identify patterns in file usage and inform decisions about file retention and storage.',
                  },
                  {
                    title: '4. Expected Return Date',
                    icon: <ClockIcon size={16} />,
                    content: 'The expected return date is crucial for ensuring that files are returned promptly. This date should be determined based on the borrower\'s needs and the organization\'s policies regarding file borrowing. Setting a clear return date helps to prevent files from being kept indefinitely and ensures that they are available for other users when needed. This step promotes efficient file management and minimizes the risk of lost or misplaced documents.',
                  },
                  {
                    title: '5. Placement of the Mark-Out Card',
                    icon: <Folder size={16} />,
                    content: 'Once completed, the mark-out card is placed in the location where the file was removed. This ensures that anyone looking for the file knows who has it and when it is expected to be returned. The mark-out card acts as a placeholder, maintaining the file\'s position within the filing system. This step is essential for preserving the integrity of the filing system and preventing confusion.',
                  },
                  {
                    title: '6. Retention of the Mark-Out Card',
                    icon: <Archive size={16} />,
                    content: 'Mark-out cards should be retained for a specific period, even after the file has been returned. This allows for auditing and tracking of file movement over time. The retention period should be determined based on the organization\'s policies and legal requirements. Retaining mark-out cards provides a record of file usage and can be helpful in identifying patterns or trends.',
                  },
                  {
                    title: '7. Regular Audits and Reconciliation',
                    icon: <RefreshCw size={16} />,
                    content: 'Regular audits and reconciliation of mark-out cards with the physical files are essential for ensuring accuracy and identifying any discrepancies. This involves comparing the information on the mark-out cards with the files that are currently checked out. Any discrepancies should be investigated and resolved promptly. Regular audits help to maintain the integrity of the filing system and ensure that all files are accounted for.',
                  },
                  {
                    title: '8. Training and Awareness',
                    icon: <Shield size={16} />,
                    content: 'Employees should be trained on the proper procedures for completing mark-out cards. This training should cover the importance of accuracy, the steps involved in completing the cards, and the consequences of non-compliance. Regular reminders and updates can help to reinforce these procedures and ensure that all employees understand their responsibilities. This step is essential for maintaining consistency and accuracy in the use of mark-out cards.',
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

            {/* SECTION 2: Document Circulation */}
            <div
              ref={(el) => {
                sectionRefs.current['circulation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Document Circulation
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Document circulation refers to the process of distributing documents within an organization, ensuring that relevant information reaches the appropriate individuals or departments. This process is crucial for maintaining efficient communication, facilitating decision-making, and ensuring that everyone is informed about important updates and changes. Here is a breakdown of the key aspects of document circulation:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Identification of Recipients',
                    icon: <Target size={16} />,
                    content: 'The initial step in document circulation involves identifying the individuals or departments that need to receive the document. This requires a clear understanding of the document\'s content and its relevance to different stakeholders. For instance, a policy change document might need to be circulated to all employees, while a project proposal might only be relevant to the project team and management. Accurate identification of recipients ensures that the document reaches the right people, preventing information overload and ensuring that everyone who needs the information receives it promptly.',
                  },
                  {
                    title: '2. Distribution Method Selection',
                    icon: <Send size={16} />,
                    content: 'Once the recipients are identified, the appropriate distribution method must be selected. This depends on factors such as the document\'s format, urgency, and confidentiality. Common distribution methods include email, physical copies, intranet postings, and document management systems. Email is often used for quick and efficient distribution of digital documents, while physical copies may be necessary for legal documents or those requiring signatures. Intranet postings can be used for disseminating information to a large audience, and document management systems provide a centralized platform for storing and sharing documents. The chosen method should be reliable, secure, and efficient, ensuring that the document reaches the recipients in a timely and secure manner.',
                  },
                  {
                    title: '3. Tracking and Logging',
                    icon: <ListChecks size={16} />,
                    content: 'Tracking and logging the distribution of documents is essential for maintaining accountability and ensuring that all recipients have received the information. This involves recording the date and time of distribution, the recipients\' names or departments, and the distribution method used. For physical documents, a distribution log or sign-off sheet may be used. For digital documents, email read receipts or document management system logs can be used. Tracking and logging provide an audit trail, which can be helpful in resolving disputes or verifying compliance.',
                  },
                  {
                    title: '4. Acknowledgment and Confirmation',
                    icon: <CheckCircle size={16} />,
                    content: 'Obtaining acknowledgment and confirmation of receipt is crucial for ensuring that recipients have received and understood the document. This can be done through email replies, sign-off sheets, or document management system confirmations. Acknowledgment ensures that recipients are aware of the document\'s content and can take any necessary actions. This is especially important for documents containing critical information or requiring specific actions.',
                  },
                  {
                    title: '5. Version Control',
                    icon: <Hash size={16} />,
                    content: 'When circulating documents, it is essential to maintain proper version control. This involves clearly labelling documents with version numbers or dates to ensure that recipients are working with the most current version. Version control prevents confusion and ensures that everyone is using the same information. Document management systems often provide automated version control features, which can simplify this process.',
                  },
                  {
                    title: '6. Security and Confidentiality',
                    icon: <Lock size={16} />,
                    content: 'Security and confidentiality are paramount when circulating sensitive documents. This involves implementing measures to protect documents from unauthorized access and disclosure. For physical documents, this may include using sealed envelopes or secure couriers. For digital documents, this may involve encryption, password protection, and access controls. Security measures should be tailored to the document\'s sensitivity and the organization\'s security policies.',
                  },
                  {
                    title: '7. Follow-Up and Action Tracking',
                    icon: <Bell size={16} />,
                    content: 'After circulating documents, it is essential to follow up with recipients to ensure that they have taken any necessary actions. This may involve sending reminders, scheduling meetings, or tracking action items. Follow-up ensures that documents are not simply received but also acted upon, contributing to the organization\'s overall efficiency and effectiveness.',
                  },
                  {
                    title: '8. Archiving and Retention',
                    icon: <Database size={16} />,
                    content: 'Once documents have been circulated and any necessary actions have been taken, they should be archived and retained according to the organization\'s retention policies. This involves storing documents in a secure and organized manner, ensuring that they are accessible for future reference. Archiving and retention procedures should comply with legal and regulatory requirements, as well as the organization\'s internal policies.',
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

            {/* SECTION 3: File Transit Sheet, File Request Form, In-Use Sheet/Card */}
            <div
              ref={(el) => {
                sectionRefs.current['forms'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                File Transit Sheet, File Request Form, In-Use Sheet/Card
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These three forms – file transit sheet, file request form, and in-use sheet/card – are essential tools in a manual records management system, each serving a distinct purpose in tracking and controlling the movement and usage of physical files. Here is a breakdown of each:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. File Transit Sheet',
                    icon: <Paperclip size={16} />,
                    content: 'A file transit sheet is used to track the movement of files between different locations or departments within an organization. It acts as a chain-of-custody document, recording each transfer of the file from one person or location to another. This sheet is particularly useful when files are being moved frequently or when multiple individuals need to access the same file. The transit sheet typically includes fields for the file\'s identification (file number, title, etc.), the sender\'s name and department, the recipient\'s name and department, the date and time of transfer, and any special instructions or comments. By documenting each step of the file\'s journey, the transit sheet ensures accountability and helps to prevent files from being lost or misplaced during transit. It provides a clear record of who had the file and when, which can be crucial for auditing purposes or resolving disputes.',
                  },
                  {
                    title: '2. File Request Form',
                    icon: <Clipboard size={16} />,
                    content: 'A file request form is used to formally request a file from the records department or filing system. This form provides a standardized method for requesting files, ensuring that all necessary information is captured and that requests are processed efficiently. The form typically includes fields for the requester\'s name and department, the file\'s identification (file number, title, etc.), the reason for the request, the date and time of the request, and any special instructions. By using a file request form, organizations can streamline the file retrieval process and minimize errors. It helps to ensure that requests are properly authorized and that files are delivered to the correct individuals. This form also creates a record of file requests, which can be helpful for tracking file usage and identifying frequently requested files.',
                  },
                  {
                    title: '3. In-Use Sheet/Card',
                    icon: <FileText size={16} />,
                    content: 'An in-use sheet or card, sometimes called a charge-out card or out-card, is used to track files that have been checked out or are currently in use by an individual. It serves as a placeholder in the filing system, indicating that the file is not available and who has it. The in-use sheet/card typically includes fields for the file\'s identification (file number, title, etc.), the borrower\'s name and department, the date and time the file was checked out, and the expected return date. By placing the in-use sheet/card in the file\'s location, organizations can maintain the integrity of the filing system and prevent files from being lost or misplaced. It provides a clear indication of who is responsible for the file and when it is expected to be returned. This tool is very important for audit trails, and also to help users know where a file is currently located.',
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

            {/* SECTION 4: Procedures for Distributing Files (Electronic and Physical) */}
            <div
              ref={(el) => {
                sectionRefs.current['distribution'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procedures for Distributing Files (Electronic and Physical)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Distributing files, whether electronic or physical, requires clear procedures to ensure that information reaches the intended recipients securely and efficiently. The methods used and the level of control needed vary depending on the sensitivity of the information and the organization's infrastructure. Here is a breakdown of the procedures:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Identification of Recipients and Access Levels',
                    icon: <User size={16} />,
                    content: 'The first step in distributing any file, whether physical or digital, is to accurately identify who needs to receive the information. This involves determining the appropriate recipients based on their roles, responsibilities, and the document\'s content. Crucially, it also requires determining the appropriate access levels for each recipient. For sensitive or confidential information, access should be restricted to only those with a "need-to-know." This step is essential for maintaining data security and preventing unauthorized access. For physical documents, this might involve creating a distribution list or routing slip. For electronic documents, access levels can be managed through user permissions and access control lists within the file management system.',
                  },
                  {
                    title: '2. Selection of Appropriate Distribution Method',
                    icon: <Send size={16} />,
                    content: 'The choice of distribution method depends on the file\'s format, sensitivity, and urgency. For physical documents, this might involve hand delivery, internal mail, or secure courier services. For electronic documents, this could include email, shared network drives, document management systems, or cloud-based file-sharing platforms. Email is suitable for general distribution, while secure file-sharing platforms are preferred for sensitive information. The chosen method should be reliable, efficient, and secure, ensuring that the file reaches the recipients without compromising its integrity or confidentiality. For highly sensitive material, encryption and secure channels are mandatory.',
                  },
                  {
                    title: '3. Physical File Distribution Procedures',
                    icon: <Folder size={16} />,
                    content: 'When distributing physical files, a clear chain of custody must be established. This involves documenting the file\'s movement from the sender to the recipient, including the date, time, and method of delivery. A routing slip or sign-off sheet can be used to track the file\'s progress and ensure that it reaches the correct recipient. For confidential documents, sealed envelopes or secure containers should be used. The recipient should acknowledge receipt of the file, and any discrepancies or issues should be reported immediately. Physical delivery methods are often used for legal documents, contracts, and other materials that require a tangible record.',
                  },
                  {
                    title: '4. Electronic File Distribution Procedures',
                    icon: <GlobeIcon size={16} />,
                    content: 'Distributing electronic files requires careful consideration of security and access controls. For email distribution, ensure that the file is attached to the correct email and sent to the appropriate recipients. Use password protection or encryption for sensitive files. Shared network drives or document management systems should have robust access controls in place, restricting access to authorized users. Cloud-based file-sharing platforms should be selected based on their security features and compliance certifications. Metadata tagging is essential for indexing and searching. Digital Rights Management (DRM) might be needed for certain files.',
                  },
                  {
                    title: '5. Documentation and Tracking',
                    icon: <ListChecks size={16} />,
                    content: 'Regardless of the distribution method, thorough documentation and tracking are essential. For physical files, this involves maintaining a distribution log or routing slip. For electronic files, this could include email read receipts, document management system logs, or audit trails. Tracking ensures accountability and provides a record of who received the file and when. This documentation can be crucial for compliance purposes and for resolving any disputes related to file distribution.',
                  },
                  {
                    title: '6. Acknowledgment and Confirmation',
                    icon: <CheckCircle size={16} />,
                    content: 'Obtaining acknowledgment and confirmation of receipt is crucial for ensuring that recipients have received and understood the file. For physical documents, this might involve a signed receipt or confirmation email. For electronic documents, this could include email replies, read receipts, or document management system confirmations. Acknowledgment ensures that recipients are aware of the file\'s content and can take any necessary actions. This is especially important for documents containing critical information or requiring specific actions.',
                  },
                  {
                    title: '7. Version Control and Updates',
                    icon: <Hash size={16} />,
                    content: 'When distributing files that are subject to updates or revisions, it is essential to maintain proper version control. This involves clearly labelling documents with version numbers or dates to ensure that recipients are working with the most current version. Version control prevents confusion and ensures that everyone is using the same information. Document management systems often provide automated version control features, which can simplify this process.',
                  },
                  {
                    title: '8. Security and Confidentiality Measures',
                    icon: <Lock size={16} />,
                    content: 'Security and confidentiality are paramount when distributing sensitive files. This involves implementing measures to protect files from unauthorized access and disclosure. For physical documents, this may include using sealed envelopes or secure couriers. For electronic documents, this may involve encryption, password protection, and access controls. Security measures should be tailored to the file\'s sensitivity and the organization\'s security policies.',
                  },
                  {
                    title: '9. Archiving and Retention',
                    icon: <Archive size={16} />,
                    content: 'Once files have been distributed and any necessary actions have been taken, they should be archived and retained according to the organization\'s retention policies. This involves storing files in a secure and organized manner, ensuring that they are accessible for future reference. Archiving and retention procedures should comply with legal and regulatory requirements, as well as the organization\'s internal policies.',
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
                  💡 Control Insight
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
                  <span>Mark-Out Card Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Circulation Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Distribution Steps</span>
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
                Mark-out cards track physical file movement: identify the file, record borrower, date, expected return, place the card, retain, audit, and train staff. Document circulation involves identifying recipients, selecting methods, tracking, confirming receipt, version control, security, follow-up, and archiving. Use transit sheets, request forms, and in-use cards for control. Electronic and physical distribution require clear procedures for security and accountability.
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
                <strong className="text-white">Mark-Out Cards</strong> – Track physical file movement with eight key steps: identification, borrower, date, expected return, placement, retention, audits, and training. Ensures accountability and prevents lost files.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Document Circulation</strong> – Eight steps: identify recipients, select method, track, confirm receipt, version control, security, follow-up, and archive. Ensures efficient and secure information flow.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Control Forms</strong> – Transit Sheet (chain of custody), Request Form (formal requests), In-Use Card (checkout tracking). Each serves a distinct purpose in file control.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Distribution Procedures</strong> – Nine steps for electronic and physical files: identify recipients, select method, document, confirm, version control, secure, archive. Tailor to file sensitivity and format.
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
            Sidemann Academic Registry • Records &amp; Information Management – Learning Outcome 4 (Mark-Out, Circulation &amp; Distribution)
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;