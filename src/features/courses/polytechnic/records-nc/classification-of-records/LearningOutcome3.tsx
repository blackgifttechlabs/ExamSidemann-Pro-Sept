// ============================================
// LEARNING OUTCOME 3 - Records Creation, Capture & Filing Systems
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FilePlus,
  FolderTree,
  Database,
  Inbox,
  FileText,
  Tag,
  CheckCircle,
  Lock,
  Link,
  Search,
  Layout,
  Shield,
  Users,
  ShieldAlert,
  Box,
  Building,
  Clipboard,
  Key,
  BarChart,
  GraduationCap,
  FileSearch,
  ClipboardList,
  Calendar,
  MessageSquare,
  TrendingUp,
  FileUp,
  MapPin,
  Clock,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
  Hash,
  PenTool,
  RefreshCw,
  Target,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'creation', label: 'Creation & Capture' },
  { id: 'methods', label: 'Creation Methods' },
  { id: 'filetitles', label: 'File Titles' },
  { id: 'database', label: 'Database Design' },
  { id: 'reference', label: 'Reference Numbers' },
  { id: 'filingsystems', label: 'Filing Systems' },
  { id: 'equipment', label: 'Filing Equipment' },
  { id: 'benefits', label: 'Benefits of Filing' },
  { id: 'index', label: 'Index' },
  { id: 'fileindex', label: 'File Index Development' },
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
        text: 'The earliest filing systems date back to ancient civilisations where records were stored in clay tablets and papyrus scrolls, organised by subject or date.',
      },
      {
        title: 'Pro Tip',
        text: 'When designing file titles, always prioritise keywords that users would naturally search for. This significantly improves retrieval success rates.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the six steps of file title development: Identify keywords, Establish naming convention, Incorporate context, Use clear language, Prioritise key information, Avoid special characters.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations neglect to regularly review and update their file indexing systems, leading to outdated and ineffective retrieval methods.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The earliest filing systems date back to ancient civilisations where records were stored in clay tablets and papyrus scrolls, organised by subject or date.',
      },
      {
        title: 'Pro Tip',
        text: 'When designing file titles, always prioritise keywords that users would naturally search for. This significantly improves retrieval success rates.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the six steps of file title development: Identify keywords, Establish naming convention, Incorporate context, Use clear language, Prioritise key information, Avoid special characters.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations neglect to regularly review and update their file indexing systems, leading to outdated and ineffective retrieval methods.',
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
            <FilePlus size={14} className="inline mr-1" /> RECORDS MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Records Creation, Capture &amp;{' '}
            <span className="text-purple-300 font-bold italic">
              Filing Systems
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to records creation, capture, receipt, file titles, databases, filing systems, equipment, indexing, and information retrieval.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FilePlus size={14} className="inline mr-1" /> Creation
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FolderTree size={14} className="inline mr-1" /> Filing Systems
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Database size={14} className="inline mr-1" /> Database Design
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
                placeholder="Search for a concept, method, filing system..."
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
            {/* SECTION 1: Process of Records Creation, Capture and Receipt */}
            <div
              ref={(el) => {
                sectionRefs.current['creation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Process of Records Creation, Capture and Receipt
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The process of records creation, capture, and receipt is the foundational stage of the records lifecycle, setting the stage for how information is managed throughout its existence. It is crucial to understand this process to ensure records are accurate, reliable, and legally sound.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Records Creation',
                    icon: <FilePlus size={16} />,
                    content: (
                      <>
                        <p><strong>Originating Information</strong></p>
                        <p>Records creation involves the generation of new information that documents business activities, transactions, or decisions. This can occur in various forms, from drafting a formal letter or report to recording meeting minutes or inputting data into a database. The key aspect here is the act of producing original content that will serve as a record. The methods of creation can be manual or automated, and the format can vary widely (paper, electronic, audio, video). It is essential to establish clear guidelines and standards for records creation, including document templates, metadata requirements, and file naming conventions.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Records Capture',
                    icon: <Inbox size={16} />,
                    content: (
                      <>
                        <p><strong>Converting Information into a Record</strong></p>
                        <p>Records capture involves the process of converting information into a formal record within the organization's records management system. This step goes beyond simply generating content; it entails formalizing it as an official record. For physical documents, this might involve scanning, photocopying, or filing. For electronic documents, it might involve saving, importing, or uploading files into a document management system. Capture also involves assigning metadata, such as creation date, author, and subject, to facilitate retrieval.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Records Receipt',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p><strong>Receiving Information from External Sources</strong></p>
                        <p>Records receipt involves the process of acquiring information from external sources and incorporating it into the organization's records management system. This includes receiving incoming mail, emails, faxes, and electronic documents from clients, vendors, government agencies, and other external parties. It is essential to establish procedures for receiving and registering incoming records, including documenting the date and time of receipt, the sender's identity, and the record's content.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Metadata and Indexing',
                    icon: <Tag size={16} />,
                    content: (
                      <>
                        <p><strong>Assignment at Creation/Receipt</strong></p>
                        <p>During creation, capture, and receipt, it is critical to assign appropriate metadata and indexing terms. Metadata provides descriptive information about the record, such as author, creation date, subject, and keywords. Indexing involves assigning specific terms or codes to facilitate retrieval. This step is crucial for ensuring that records can be easily located and managed. Standardized metadata schemas and indexing vocabularies should be used to ensure consistency across the organization.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Verification and Validation',
                    icon: <CheckCircle size={16} />,
                    content: (
                      <>
                        <p><strong>Ensuring Accuracy and Authenticity</strong></p>
                        <p>Verification and validation are essential components of the creation, capture, and receipt process. This involves checking the accuracy, completeness, and authenticity of records. Verification might include comparing data against source documents or validating digital signatures. Validation might involve ensuring that records comply with legal or regulatory requirements. Implementing quality control measures at this stage can prevent errors and ensure the reliability of records.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Security and Access Control',
                    icon: <Lock size={16} />,
                    content: (
                      <>
                        <p><strong>Protecting Records</strong></p>
                        <p>Security and access control measures should be implemented during the creation, capture, and receipt process to protect records from unauthorized access, alteration, or destruction. This involves assigning appropriate security classifications, implementing access permissions, and using encryption or other security technologies. This is especially important for sensitive or confidential records. Security measures should be documented and regularly reviewed to ensure their effectiveness.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Audit Trails and Documentation',
                    icon: <Link size={16} />,
                    content: (
                      <>
                        <p><strong>Maintaining Accountability</strong></p>
                        <p>Maintaining audit trails and documenting the creation, capture, and receipt process is essential for accountability and transparency. This involves recording who created, captured, or received the record, when it was created or received, and any modifications or actions taken. This information can be used to track the history of the record and ensure its integrity. Documentation should include policies, procedures, and training materials related to records creation, capture, and receipt.</p>
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

            {/* SECTION 2: Methods of Creating Records */}
            <div
              ref={(el) => {
                sectionRefs.current['methods'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Methods of Creating Records
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Manual Creation',
                    icon: <FileText size={16} />,
                    content: 'This method involves creating records using traditional tools like pens, pencils, typewriters, or manual forms. Handwritten records might include meeting minutes, notes, or handwritten correspondence. Typed records, while less common today, might involve filling out pre-printed forms or typing documents on a typewriter. This method is often used for creating simple records or when digital tools are unavailable. However, manual creation can be time-consuming, prone to errors, and difficult to manage and retrieve.',
                  },
                  {
                    title: '2. Electronic Creation',
                    icon: <Database size={16} />,
                    content: 'This method involves creating records using digital tools like word processing software (e.g., Microsoft Word, Google Docs), spreadsheets (e.g., Microsoft Excel, Google Sheets), and databases (e.g., Microsoft Access, SQL). Electronic creation offers several advantages, including ease of editing, formatting, and sharing. Digital records can be easily searched, indexed, and managed using metadata. However, it is crucial to establish standards for file formats, naming conventions, and metadata to ensure consistency and compatibility.',
                  },
                  {
                    title: '3. Digital Capture',
                    icon: <Inbox size={16} />,
                    content: 'This method involves converting physical records into digital formats using scanning, digitizing, or photographing. Scanning converts paper documents into digital images, while digitizing converts analog media like audio tapes or microfilm into digital files. Photographing captures images of physical records using digital cameras or smartphones. Digital capture facilitates the preservation and accessibility of physical records, making them easier to store, search, and share.',
                  },
                  {
                    title: '4. Automated Generation',
                    icon: <BarChart size={16} />,
                    content: 'This method involves creating records automatically by computer systems or applications. System-generated reports, logs, and data feeds are examples of automated records creation. These records are often created without direct human intervention and can include transaction logs, audit trails, and system performance data. Automated generation ensures accuracy and consistency, as the records are created according to predefined rules and parameters.',
                  },
                  {
                    title: '5. Audio and Video Recording',
                    icon: <MessageSquare size={16} />,
                    content: 'This method involves creating records using audio and video recording devices. Audio recordings might include interviews, meetings, or phone conversations. Video recordings might include presentations, training sessions, or surveillance footage. Audio and video recordings can capture valuable information that might be difficult to document in other formats. However, they can also be challenging to manage and retrieve due to their large file sizes and complex metadata.',
                  },
                  {
                    title: '6. Email and Electronic Communication',
                    icon: <FileUp size={16} />,
                    content: 'This method involves creating records through email and other electronic communication platforms. Emails, instant messages, and social media posts can serve as official records, documenting communication, decisions, and transactions. It is crucial to establish policies and procedures for managing electronic communications, including email retention, archiving, and retrieval.',
                  },
                  {
                    title: '7. Web-Based Forms and Data Entry',
                    icon: <Clipboard size={16} />,
                    content: 'This method involves creating records through web-based forms and data entry interfaces. Online surveys, customer feedback forms, and e-commerce transactions are examples of web-based record creation. Web-based forms and data entry facilitate the collection of structured data and automate the creation of records. However, it is crucial to ensure the security and integrity of the data collected through these methods.',
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

            {/* SECTION 3: Developing New File Titles Using Key Words */}
            <div
              ref={(el) => {
                sectionRefs.current['filetitles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Developing New File Titles Using Key Words
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Identifying Core Keywords',
                    icon: <Tag size={16} />,
                    content: 'The first step involves identifying the core keywords that accurately reflect the content of the file. These keywords should be specific, relevant, and representative of the file\'s subject matter. Start by analysing the document\'s content and identifying the main topic, purpose, and key elements. Consider the perspective of someone who might be searching for the file in the future. For example, if the document is a project proposal for a new marketing campaign, relevant keywords might include "Project Proposal," "Marketing Campaign," and the project\'s specific name.',
                  },
                  {
                    title: '2. Consistent Naming Convention',
                    icon: <FolderTree size={16} />,
                    content: 'Developing a consistent naming convention is crucial for maintaining uniformity and organization. This involves establishing rules for the structure and format of file titles. The convention should specify the order of keywords, the use of abbreviations, and the inclusion of dates or other relevant information. For example, a convention might specify that file titles should follow the format "ProjectName_DocumentType_Date_Version." Consistency in naming conventions ensures that all files are titled in a standardized manner.',
                  },
                  {
                    title: '3. Incorporating Contextual Information',
                    icon: <Link size={16} />,
                    content: 'In addition to core keywords, file titles should include contextual information that provides additional clarity and detail. This might include the date of creation, the author\'s name, the department or project name, or the version number. Contextual information helps to distinguish between similar files and provides valuable context for understanding the document\'s purpose and relevance. For example, a file title might be "MarketingCampaign_Report_20230515_v2_Draft."',
                  },
                  {
                    title: '4. Using Clear and Concise Language',
                    icon: <FileText size={16} />,
                    content: 'File titles should use clear and concise language that is easily understood by all users. Avoid using jargon, acronyms, or abbreviations that might be unfamiliar to others. The language should be straightforward and unambiguous, ensuring that the file\'s content is immediately clear from the title. For example, instead of using "MktgCamp_Prop," use "Marketing Campaign Proposal."',
                  },
                  {
                    title: '5. Prioritizing Key Information',
                    icon: <Layout size={16} />,
                    content: 'When developing file titles, prioritise the most important information and place it at the beginning of the title. This ensures that the key keywords are readily visible and easily searchable. For example, if the file is a project report, the project name should be placed at the beginning of the title. Prioritizing key information enhances the efficiency of search and retrieval, as users can quickly scan file titles to identify the relevant documents.',
                  },
                  {
                    title: '6. Avoiding Special Characters',
                    icon: <Shield size={16} />,
                    content: 'Special characters and spaces can cause compatibility issues and complicate file naming conventions. It is best to avoid using special characters like "&", "#", or "%" in file titles. Instead, use underscores or hyphens to separate keywords and contextual information. For example, use "Marketing_Campaign_Report" instead of "Marketing&Campaign Report." Avoiding spaces and special characters ensures that file titles are compatible with various operating systems and applications.',
                  },
                  {
                    title: '7. Testing and Refining',
                    icon: <RefreshCw size={16} />,
                    content: 'Once a file naming convention is established, it is essential to test and refine it to ensure its effectiveness. This involves conducting user testing and gathering feedback from employees to identify any issues or areas for improvement. The naming convention should be regularly reviewed and updated to reflect changes in organisational needs and technology. Testing and refining ensure that the file naming convention remains relevant and effective over time.',
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

            {/* SECTION 4: Designing a Database for Electronic Files */}
            <div
              ref={(el) => {
                sectionRefs.current['database'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Designing a Database for Electronic Files
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Defining Data Requirements',
                    icon: <Database size={16} />,
                    content: 'The first step involves identifying the specific data elements that need to be stored and managed within the database. This includes determining the types of electronic files, their attributes, and the relationships between them. For example, if the database is for managing project documents, data elements might include file name, project name, author, creation date, file type, version number, and keywords. It is essential to involve stakeholders from various departments to ensure that all relevant data requirements are captured.',
                  },
                  {
                    title: '2. Selecting a DBMS',
                    icon: <FolderTree size={16} />,
                    content: 'Choosing the right DBMS is crucial for the performance, scalability, and security of the database. Common DBMS options include relational databases (e.g., MySQL, PostgreSQL, Microsoft SQL Server) and NoSQL databases (e.g., MongoDB, Cassandra). The selection should be based on factors such as the volume of data, the complexity of relationships, the required performance, and the organisation\'s budget.',
                  },
                  {
                    title: '3. Designing the Database Schema',
                    icon: <Layout size={16} />,
                    content: 'The database schema defines the structure of the database, including tables, columns, relationships, and constraints. This involves creating a logical model that represents the data elements and their relationships. For example, a table for project documents might include columns for file name, project name, author, and creation date. Relationships between tables are established using primary and foreign keys. Normalisation techniques should be used to minimise data redundancy and ensure data integrity.',
                  },
                  {
                    title: '4. Implementing Metadata Fields',
                    icon: <Tag size={16} />,
                    content: 'Metadata is essential for describing and organizing electronic files. Implementing appropriate metadata fields ensures that files can be easily searched, retrieved, and managed. Common metadata fields include file name, author, creation date, subject, keywords, and version number. Metadata standards, such as Dublin Core or ISO 15836, should be used to ensure consistency and interoperability.',
                  },
                  {
                    title: '5. File Naming Conventions',
                    icon: <FileText size={16} />,
                    content: 'Consistent file naming conventions are crucial for organising and managing electronic files. The naming convention should be clear, concise, and descriptive, using keywords and contextual information. For example, a file name might be "ProjectName_DocumentType_Date_Version.pdf." The naming convention should avoid special characters and spaces, which can cause compatibility issues.',
                  },
                  {
                    title: '6. Access Controls and Security',
                    icon: <Lock size={16} />,
                    content: 'Access controls and security measures are essential for protecting sensitive electronic files. User permissions should be granularly defined to restrict access to authorised personnel. Encryption should be used to protect data at rest and in transit. Audit trails should be implemented to track user activity and detect unauthorised access. Regular backups and disaster recovery plans should be established to prevent data loss.',
                  },
                  {
                    title: '7. Integrating with Other Systems',
                    icon: <Link size={16} />,
                    content: 'The database should be integrated with other relevant systems, such as document management systems (DMS), enterprise content management (ECM) systems, and workflow automation tools. This integration ensures seamless data exchange and streamlines business processes. APIs and web services can be used to facilitate integration.',
                  },
                  {
                    title: '8. Testing and Optimization',
                    icon: <CheckCircle size={16} />,
                    content: 'Before deploying the database, thorough testing should be conducted to ensure its performance, reliability, and security. This includes testing data entry, retrieval, and reporting functions. Performance testing should be conducted to identify and address any bottlenecks. The database should be optimised for performance, including indexing, query optimisation, and hardware tuning. User feedback should be gathered and incorporated into the design and implementation process.',
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

            {/* SECTION 5: Developing Effective File Titles and Reference Numbers */}
            <div
              ref={(el) => {
                sectionRefs.current['reference'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Developing Effective File Titles and Reference Numbers
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. File Title Clarity',
                    icon: <FileText size={16} />,
                    content: 'File titles should be clear, concise, and descriptive, providing enough information to understand the file\'s content without needing to open it. The goal is to make it easy for users to quickly identify and retrieve the relevant files. Begin by identifying the core keywords that accurately represent the file\'s subject matter. Incorporate contextual information, such as the date of creation, author, department, or project name, to provide additional clarity. Prioritise the most important information and place it at the beginning of the title.',
                  },
                  {
                    title: '2. Consistent Naming Conventions',
                    icon: <FolderTree size={16} />,
                    content: 'Establishing and adhering to a consistent naming convention is essential for maintaining uniformity and organisation. This involves defining rules for the structure and format of file titles, including the order of keywords, the use of abbreviations, and the inclusion of dates or version numbers. For example, a convention might specify the format "Department_Project_DocumentType_Date_Version." Consistency ensures that all files are titled in a standardised manner, facilitating efficient retrieval, and reducing ambiguity.',
                  },
                  {
                    title: '3. Reference Number Generation',
                    icon: <Hash size={16} />,
                    content: 'Reference numbers are unique identifiers assigned to records, providing a systematic way to track and manage information. They are especially useful in large organisations with complex record-keeping systems. Reference numbers should be unique to avoid confusion and errors. They can be sequential, hierarchical, or faceted, depending on the complexity of the classification scheme. For example, a reference number might be "FIN-2023-Q3-001," representing a financial record from the third quarter of 2023.',
                  },
                  {
                    title: '4. Incorporation of Metadata',
                    icon: <Tag size={16} />,
                    content: 'Metadata, or data about data, plays a crucial role in file titling and reference numbering. Metadata elements, such as author, creation date, subject, and keywords, can be incorporated into file titles and reference numbers to provide additional context and facilitate retrieval. Standardised metadata schemas, such as Dublin Core, should be used to ensure consistency and interoperability.',
                  },
                  {
                    title: '5. Scalability and Flexibility',
                    icon: <Layout size={16} />,
                    content: 'The file titling and reference numbering system should be scalable and flexible enough to accommodate future growth and changes in the organisation. This involves designing a system that can be easily expanded or modified as the volume of records increases, or the organisation\'s structure evolves. The system should also be adaptable to changes in technology and business processes.',
                  },
                  {
                    title: '6. Automation and Integration',
                    icon: <Link size={16} />,
                    content: 'Automation and integration can significantly enhance the efficiency of file titling and reference numbering. Automated tools can generate file titles and reference numbers based on predefined rules and metadata. Integration with document management systems (DMS) and other applications can streamline the process of assigning identifiers and metadata. Automation reduces the risk of human error and ensures consistency.',
                  },
                  {
                    title: '7. Testing and Refinement',
                    icon: <RefreshCw size={16} />,
                    content: 'Once a file titling and reference numbering system is established, it is essential to test and refine it to ensure its effectiveness. This involves conducting user testing and gathering feedback from employees to identify any issues or areas for improvement. The system should be regularly reviewed and updated to reflect changes in organisational needs and technology.',
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

            {/* SECTION 6: Filing Systems */}
            <div
              ref={(el) => {
                sectionRefs.current['filingsystems'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Filing Systems
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Purpose and Importance',
                    icon: <Target size={16} />,
                    content: 'The primary purpose of a filing system is to create order from chaos. Without a structured system, records become scattered and difficult to find, leading to wasted time and resources. Effective filing systems are essential for maintaining operational efficiency, ensuring compliance with legal and regulatory requirements, and protecting sensitive information. In today\'s fast-paced business environment, quick access to information is crucial for decision-making and customer service.',
                  },
                  {
                    title: '2. Types of Filing Systems',
                    icon: <FolderTree size={16} />,
                    content: 'Filing systems can be broadly categorised into physical and electronic systems, each with its own advantages and disadvantages. Physical filing systems, such as alphabetical, chronological, numerical, geographical, and subject filing, involve storing paper documents in filing cabinets, folders, and boxes. Electronic filing systems, on the other hand, utilise digital technologies to store and manage records. Hierarchical folder structures, database systems, document management systems (DMS), cloud-based storage, and metadata tagging are examples of electronic filing systems.',
                  },
                  {
                    title: '3. Key Components',
                    icon: <Layout size={16} />,
                    content: 'A well-designed filing system consists of several key components, including a classification scheme, indexing system, filing rules and procedures, retention schedules, and security measures. The classification scheme provides a systematic method for categorising records based on their content, function, or subject. The indexing system facilitates the retrieval of records by assigning keywords or codes. Filing rules and procedures provide guidelines for creating, storing, retrieving, and disposing of records.',
                  },
                  {
                    title: '4. Best Practices',
                    icon: <Shield size={16} />,
                    content: 'To ensure the effectiveness of a filing system, organisations should adhere to best practices, such as consistency, clarity, accessibility, security, regular maintenance, documentation, and training. Consistency in naming conventions, classification schemes, and filing procedures is essential for maintaining uniformity and reducing ambiguity. Clear and concise language in file titles and labels enhances readability and usability. Accessibility ensures that authorised users can easily retrieve records when needed.',
                  },
                  {
                    title: '5. Transitioning from Physical to Electronic',
                    icon: <RefreshCw size={16} />,
                    content: 'The transition from physical to electronic filing systems is a significant undertaking that requires careful planning and implementation. Digitization, data migration, system selection, and training and change management are key considerations. Digitization involves scanning paper documents and converting them into digital formats. Data migration involves transferring data from legacy systems to new electronic systems. System selection involves choosing a suitable electronic filing system that meets the organisation\'s needs and budget.',
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

            {/* SECTION 7: Filing Equipment */}
            <div
              ref={(el) => {
                sectionRefs.current['equipment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Filing Equipment
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Filing Cabinets',
                    icon: <Building size={16} />,
                    content: 'Filing cabinets are traditional storage solutions for paper documents. Vertical filing cabinets have drawers that extend from front to back, while lateral filing cabinets have drawers that extend from side to side. Vertical cabinets are space-efficient for storing large volumes of documents, while lateral cabinets are better for accessing files from the side and can be used as room dividers. Both types are typically made of metal or wood and come in various sizes and configurations.',
                  },
                  {
                    title: '2. Shelving Units',
                    icon: <Layout size={16} />,
                    content: 'Shelving units provide open or closed storage for files, boxes, and other records. Open shelving allows for easy access and visibility, while closed shelving (often with doors) provides added protection and security. Shelving units can be made of metal, wood, or plastic and come in various sizes and configurations. They are often used in offices, warehouses, and storage facilities.',
                  },
                  {
                    title: '3. File Folders and Dividers',
                    icon: <FolderTree size={16} />,
                    content: 'File folders and dividers are essential for organising documents within filing cabinets and shelving units. File folders hold individual documents or groups of related documents, while dividers separate different categories or sections. They are typically made of paper, cardboard, or plastic and come in various sizes and colours. Color-coded folders and dividers can enhance organisation and facilitate quick retrieval.',
                  },
                  {
                    title: '4. Storage Boxes and Binders',
                    icon: <Box size={16} />,
                    content: 'Storage boxes and binders are used for storing large volumes of documents or records that are not frequently accessed. Storage boxes are typically made of cardboard or plastic and come in various sizes and shapes. Binders are used for organising and binding documents together, such as reports, manuals, and presentations. These items are useful for long-term storage or archiving documents that are not frequently needed.',
                  },
                  {
                    title: '5. Microfilm Equipment',
                    icon: <FileText size={16} />,
                    content: 'Microfilm and microfiche are used for storing and preserving archival records in a compact format. Microfilm consists of rolls of film containing miniaturised images of documents, while microfiche consists of sheets of film with similar images. Specialised equipment, such as microfilm readers and scanners, is needed to view and digitise these records. Microfilm and microfiche are often used for long-term storage of historical documents.',
                  },
                  {
                    title: '6. Electronic Document Management Systems (EDMS)',
                    icon: <Database size={16} />,
                    content: 'EDMS are software applications that manage electronic documents, including scanning, indexing, storing, retrieving, and sharing. They provide features such as version control, access control, workflow automation, and metadata management. EDMS can be cloud-based or installed on local servers. They are essential for managing large volumes of digital documents and ensuring compliance with legal and regulatory requirements.',
                  },
                  {
                    title: '7. Cloud Storage',
                    icon: <Box size={16} />,
                    content: 'Cloud storage and online file sharing services, such as Google Drive, Dropbox, and Microsoft OneDrive, provide remote storage and access to electronic files. They offer scalability, accessibility, and collaboration features. Cloud storage eliminates the need for physical storage devices and allows for easy sharing of files with authorised users. However, it is crucial to ensure the security and privacy of data stored in the cloud.',
                  },
                  {
                    title: '8. Specialised Storage Solutions',
                    icon: <Layout size={16} />,
                    content: 'Specialised storage solutions are designed for specific types of records, such as audio-visual materials, maps, and blueprints. These solutions might include specialised cabinets, racks, and storage boxes. They are often used in archives, museums, and libraries. The type of specialised storage solution depends on the unique characteristics of the records being stored.',
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

            {/* SECTION 8: Benefits of Placing Documents in Appropriate Files */}
            <div
              ref={(el) => {
                sectionRefs.current['benefits'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Benefits of Placing Documents in Appropriate Files
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Enhanced Information Retrieval',
                    icon: <Search size={16} />,
                    content: 'When documents are placed in appropriate files, they can be located quickly and efficiently. This is especially crucial in fast-paced environments where time is of the essence. A well-organised filing system, with documents categorised logically, eliminates the need for time-consuming searches. For example, if all invoices are filed within a designated "Invoices" folder, and then further organised by date or vendor, staff can retrieve them instantly.',
                  },
                  {
                    title: 'Improved Organisation and Clarity',
                    icon: <Layout size={16} />,
                    content: 'Placing documents in appropriate files creates a structured and organised environment. It eliminates the clutter of scattered documents and ensures that information is stored systematically. This organisation enhances clarity and understanding, as related documents are grouped together. For example, all project-related documents, such as proposals, contracts, and reports, are filed within a specific project folder.',
                  },
                  {
                    title: 'Reduced Risk of Lost Documents',
                    icon: <Shield size={16} />,
                    content: 'A well-organised filing system significantly reduces the risk of lost or misplaced documents. When documents are consistently filed in their appropriate locations, they are less likely to be misplaced or forgotten. This is especially important for critical documents, such as contracts, legal agreements, and financial records.',
                  },
                  {
                    title: 'Streamlined Workflow and Collaboration',
                    icon: <Users size={16} />,
                    content: 'Placing documents in appropriate files streamlines workflow and facilitates collaboration. When documents are organised logically, employees can easily access and share information, improving teamwork and productivity. For example, if all project-related documents are stored in a shared project folder, team members can easily collaborate on tasks and access the information they need.',
                  },
                  {
                    title: 'Enhanced Compliance and Legal Protection',
                    icon: <ShieldAlert size={16} />,
                    content: 'Placing documents in appropriate files helps organisations comply with legal and regulatory requirements. Many industries have specific regulations regarding the storage and retention of documents. A well-organised filing system ensures that documents are properly stored and easily accessible for audits and legal proceedings.',
                  },
                  {
                    title: 'Efficient Space Management',
                    icon: <Box size={16} />,
                    content: 'Placing documents in appropriate files optimises space utilisation, whether physical or digital. A well-organised filing system minimises the need for excessive storage space and reduces clutter. For physical documents, this might involve using compact filing cabinets or off-site storage. For digital documents, this might involve using cloud storage or efficient folder structures.',
                  },
                  {
                    title: 'Improved Data Security',
                    icon: <Lock size={16} />,
                    content: 'Placing documents in appropriate files enhances data security by allowing organisations to implement appropriate access controls and security measures. Sensitive or confidential documents can be filed in secure locations with restricted access. For example, employee records or financial data can be stored in password-protected folders or locked filing cabinets.',
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

            {/* SECTION 9: Index */}
            <div
              ref={(el) => {
                sectionRefs.current['index'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Index
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    An index is a systematic arrangement of entries designed to enable users to locate information within a document, set of documents, or database. It acts as a guide, providing pointers or references to specific locations where information can be found. Indexes can be alphabetical, numerical, or organised by subject, and they typically include keywords, names, or other relevant terms along with corresponding page numbers, file locations, or database records.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Facilitating Information Retrieval',
                    icon: <Search size={16} />,
                    content: 'The primary function of an index is to expedite the process of locating specific information. By providing a structured list of keywords and their corresponding locations, an index eliminates the need for users to manually search through entire documents or databases. For instance, in a lengthy textbook, an index allows readers to quickly find all pages that discuss a particular topic.',
                  },
                  {
                    title: '2. Enhancing Content Organisation',
                    icon: <Layout size={16} />,
                    content: 'An index contributes to the overall organisation and accessibility of information. By grouping related terms and providing cross-references, an index creates a logical structure that helps users navigate the content. This is particularly useful for complex documents or databases with numerous entries. For example, a legal database might use an index to categorise case law by subject, jurisdiction, and date.',
                  },
                  {
                    title: '3. Supporting Research and Analysis',
                    icon: <BarChart size={16} />,
                    content: 'Indexes are invaluable tools for researchers and analysts who need to identify and analyse patterns or trends within a large body of information. By providing a comprehensive list of keywords and their occurrences, an index enables researchers to quickly identify relevant data points and draw meaningful conclusions.',
                  },
                  {
                    title: '4. Ensuring Data Integrity',
                    icon: <Shield size={16} />,
                    content: 'In database systems, indexes play a crucial role in maintaining data integrity and consistency. By establishing a structured framework for data retrieval, indexes help to prevent errors and ensure that information is accurately linked and referenced. For example, an index can be used to enforce unique constraints on database fields, preventing the entry of duplicate records.',
                  },
                  {
                    title: '5. Facilitating Legal Compliance',
                    icon: <ShieldAlert size={16} />,
                    content: 'Indexes are essential for ensuring compliance with legal and regulatory requirements, particularly in industries that require meticulous record-keeping. For example, a pharmaceutical company might use an index to track all documents related to a specific drug, ensuring that they can be easily retrieved during audits or legal proceedings.',
                  },
                  {
                    title: '6. Improving User Experience',
                    icon: <Users size={16} />,
                    content: 'A well-designed index enhances the user experience by making it easier to find information and navigate complex content. This is especially important in digital environments, where users expect quick and efficient access to information. By providing a user-friendly interface and intuitive search capabilities, indexes can improve user satisfaction and engagement.',
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

            {/* SECTION 10: Developing a File Index */}
            <div
              ref={(el) => {
                sectionRefs.current['fileindex'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Developing a File Index
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Define Scope and Purpose',
                    icon: <Target size={16} />,
                    content: 'Before developing a file index, it is essential to define its scope and purpose. This involves determining which files will be included in the index and what the index will be used for. For example, will it cover all files in a department, project, or organisation? Will it be used for general information retrieval, legal compliance, or archival purposes? Defining the scope and purpose helps to establish the boundaries of the index and ensures that it meets the organisation\'s specific needs.',
                  },
                  {
                    title: '2. Identify Key Indexing Terms',
                    icon: <Tag size={16} />,
                    content: 'The next step involves identifying the key indexing terms that will be used to categorise and retrieve files. These terms should be relevant to the content of the files and reflect the language used by users when searching for information. Common indexing terms include keywords, subjects, names, dates, and locations. It is crucial to consult with users and subject matter experts to identify the most relevant and effective indexing terms.',
                  },
                  {
                    title: '3. Establish Indexing Structure',
                    icon: <Layout size={16} />,
                    content: 'Once the indexing terms are identified, it is necessary to establish an indexing structure that organises the terms in a logical and consistent manner. This might involve creating a hierarchical structure with main categories and subcategories or using an alphabetical or numerical arrangement. The indexing structure should be designed to facilitate easy navigation and retrieval.',
                  },
                  {
                    title: '4. Assign Indexing Terms',
                    icon: <Clipboard size={16} />,
                    content: 'This step involves assigning the identified indexing terms to each file in the index. This can be done manually or automatically, depending on the volume of files and the available resources. Manual indexing involves reviewing each file and assigning relevant indexing terms. Automated indexing uses software to extract keywords and metadata from files. It is important to ensure that the indexing terms are applied consistently and accurately.',
                  },
                  {
                    title: '5. Create Cross-References',
                    icon: <Link size={16} />,
                    content: 'To enhance the usability of the index, it is essential to create cross-references and synonyms. Cross-references link related indexing terms, allowing users to navigate between different categories. Synonyms provide alternative terms that users might employ in their searches. For example, a cross-reference might link "Contracts" to "Agreements." A synonym might include "Customer" and "Client."',
                  },
                  {
                    title: '6. Develop Indexing System',
                    icon: <Database size={16} />,
                    content: 'The index can be developed using a manual or electronic system, depending on the organisation\'s needs and resources. A manual index might involve creating a physical card catalog or a printed list of files and indexing terms. An electronic index might involve using a database or a document management system (DMS). Electronic systems offer greater flexibility, search capabilities, and automation.',
                  },
                  {
                    title: '7. Test and Refine',
                    icon: <RefreshCw size={16} />,
                    content: 'Once the index is developed, it is essential to test and refine it to ensure its effectiveness. This involves conducting user testing and gathering feedback from employees to identify any issues or areas for improvement. The index should be regularly reviewed and updated to reflect changes in the organisation\'s files and indexing terms.',
                  },
                  {
                    title: '8. Document and Communicate',
                    icon: <ClipboardList size={16} />,
                    content: 'The final step involves documenting and communicating the index to all relevant personnel. This includes creating user guides, training materials, and other documentation that explains how to use the index. The index should be easily accessible and integrated into the organisation\'s information management systems. Communication and training ensure that all employees understand and adhere to the indexing system.',
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
                  💡 Records Insight
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
                  <span>Creation Methods</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Filing Equipment Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Index Benefits</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Records creation, capture, and receipt are foundational processes. Effective file titles use clear keywords and consistent naming conventions. Databases require careful design with appropriate metadata and security. Filing systems (physical and electronic) organise records for efficient retrieval. Appropriate filing equipment enhances organisation. Proper indexing and file indices ensure quick access to information. Regular testing and refinement of systems maintain their effectiveness.
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
                <strong className="text-white">Records Creation &amp; Capture</strong> – The lifecycle begins with creation, capture, and receipt of records. Key steps include metadata assignment, verification, security controls, and audit trails. Methods range from manual to electronic, automated, and multimedia.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">File Titles &amp; Reference Numbers</strong> – Effective file titles use clear keywords, consistent naming conventions, and contextual information. Reference numbers provide unique identifiers for systematic tracking.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Filing Systems &amp; Equipment</strong> – Physical and electronic filing systems organise records for efficient retrieval. Equipment includes cabinets, shelving, folders, boxes, EDMS, and cloud storage. Benefits include enhanced retrieval, compliance, security, and collaboration.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Indexing</strong> – Indexes facilitate information retrieval, support research, ensure data integrity, and improve user experience. Developing a file index involves defining scope, identifying terms, establishing structure, assigning terms, creating cross-references, and testing.
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
            Sidemann Academic Registry • Records Creation &amp; Filing Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

// ============================================
// LEARNING OUTCOME 4 - Organisational Structure & Control Documentation
// ============================================

import {
  
  Users as UsersIcon,
  Shield as ShieldIcon,
  Clipboard as ClipboardIcon,
  Key as KeyIcon,
  BarChart as BarChartIcon,
  GraduationCap as GraduationCapIcon,
  Link as LinkIcon,
  FileSearch as FileSearchIcon,
  FileUp as FileUpIcon,
  MapPin as MapPinIcon,
  Clock as ClockIcon,
  Database as DatabaseIcon,
  MessageSquare as MessageSquareIcon,
  TrendingUp as TrendingUpIcon,
  Calendar as CalendarIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION (LO4)
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS_LO4 = [
  { id: 'organogram', label: 'Organogram' },
  { id: 'chargeout', label: 'Charge-Out Diagram' },
  { id: 'charge-significance', label: 'Charge-Out Significance' },
  { id: 'markout', label: 'Mark-Out Card' },
  { id: 'markout-components', label: 'Mark-Out Components' },
  { id: 'controldocs', label: 'Control Documentation' },
  { id: 'accessdocs', label: 'Access Documents' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT - LO4
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
        text: 'The organogram concept originated in the late 19th century and has become a fundamental tool for visualising organisational hierarchies and reporting structures.',
      },
      {
        title: 'Pro Tip',
        text: 'Always keep charge-out diagrams updated. An outdated tracking system is as ineffective as having no system at all.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the eight components of a charge-out diagram with the acronym "R-B-C-D-R-A-C-T": Record ID, Borrower Info, Charge-Out Date, Due Date, Return Date, Authorisation, Comments, Tracking Number.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations overlook the importance of mark-out cards in physical filing systems, leading to misplaced files and wasted time searching for records.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The organogram concept originated in the late 19th century and has become a fundamental tool for visualising organisational hierarchies and reporting structures.',
      },
      {
        title: 'Pro Tip',
        text: 'Always keep charge-out diagrams updated. An outdated tracking system is as ineffective as having no system at all.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the eight components of a charge-out diagram with the acronym "R-B-C-D-R-A-C-T": Record ID, Borrower Info, Charge-Out Date, Due Date, Return Date, Authorisation, Comments, Tracking Number.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations overlook the importance of mark-out cards in physical filing systems, leading to misplaced files and wasted time searching for records.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  // Scroll to section when tab changes
  const scrollToSection = (index: number) => {
    setActiveSectionIndex(index);
    const tab = SECTION_TABS_LO4[index];
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
        {SECTION_TABS_LO4.map((tab, idx) => (
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
            <Building size={14} className="inline mr-1" /> RECORDS MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Organisational Structure &amp;{' '}
            <span className="text-purple-300 font-bold italic">
              Control Documentation
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to organisational organograms, charge-out diagrams, mark-out cards, control documentation, and records access tools.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS_LO4.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Building size={14} className="inline mr-1" /> Organogram
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Clipboard size={14} className="inline mr-1" /> Charge-Out
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Control Docs
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
                placeholder="Search for a structure, component, control document..."
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
            {/* SECTION 1: Organisational Organogram/Structure */}
            <div
              ref={(el) => {
                sectionRefs.current['organogram'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Organisational Organogram/Structure
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    An organisational organogram, or structure, is a visual representation of a company's internal hierarchy and relationships. It outlines the roles, responsibilities, and reporting lines within an organisation, providing a clear picture of how different departments and individuals connect.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Hierarchical Representation',
                    icon: <Users size={16} />,
                    content: 'An organogram visually depicts the hierarchy of roles within an organisation, showing who reports to whom and the levels of authority. This hierarchical representation helps employees understand their place within the company and their reporting lines. It clarifies who is responsible for what tasks and decisions, reducing ambiguity and confusion. For instance, a typical organogram might show that team members report to a team leader, who reports to a department manager, who in turn reports to a director or vice president.',
                  },
                  {
                    title: '2. Departmental Structure',
                    icon: <Building size={16} />,
                    content: 'An organogram illustrates the departmental structure of an organisation, showing how different departments are organised and how they relate to each other. This helps employees understand the overall structure of the company and how their department fits into the larger picture. For example, an organogram might show that the marketing, sales, and customer service departments all report to a vice president of sales and marketing.',
                  },
                  {
                    title: '3. Reporting Lines and Communication',
                    icon: <Link size={16} />,
                    content: 'An organogram clearly defines the reporting lines and communication channels within an organisation. It shows who reports to whom and how information flows through the company. This clarity helps to prevent miscommunication and ensures that information is disseminated efficiently. For example, an organogram might show that all communication from the sales department to the marketing department should go through the respective department managers.',
                  },
                  {
                    title: '4. Authority and Decision-Making',
                    icon: <Key size={16} />,
                    content: 'An organogram provides a visual representation of authority and decision-making within an organisation. It shows who has the authority to make decisions at different levels of the hierarchy. This clarity helps to streamline decision-making processes and ensures that decisions are made by the appropriate individuals. For example, an organogram might show that only the CEO has the authority to approve major strategic decisions.',
                  },
                  {
                    title: '5. Organisational Planning',
                    icon: <BarChart size={16} />,
                    content: 'An organogram is a valuable tool for organisational planning and restructuring. It provides a visual representation of the current organisational structure, which can be used to identify areas for improvement. It also helps to visualise proposed changes to the organisational structure. For example, an organogram can be used to identify redundancies, inefficiencies, or areas where additional resources are needed.',
                  },
                  {
                    title: '6. Onboarding and Training',
                    icon: <GraduationCap size={16} />,
                    content: 'An organogram is a helpful tool for onboarding and training new employees. It provides a clear overview of the organisation\'s structure and helps new employees understand their roles and responsibilities. It also helps them understand how their department fits into the larger picture. For example, an organogram can be used to introduce new employees to their team members and managers.',
                  },
                  {
                    title: '7. Transparency and Accountability',
                    icon: <Shield size={16} />,
                    content: 'An organogram promotes transparency and accountability within an organisation. By clearly defining roles, responsibilities, and reporting lines, it ensures that everyone knows who is responsible for what. This transparency helps to prevent blame-shifting and ensures that everyone is held accountable for their actions. For example, an organogram can be used to track the progress of projects and identify who is responsible for any delays or failures.',
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

            {/* SECTION 2: Components of a Charge-Out Diagram */}
            <div
              ref={(el) => {
                sectionRefs.current['chargeout'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Components of a Charge-Out Diagram
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Record/Item Identification',
                    icon: <FileText size={16} />,
                    content: 'This component is the foundation of the charge-out diagram, as it uniquely identifies the record or item being borrowed. It typically includes a record number, file name, document title, or other specific identifier. This identifier must be consistent and accurate to avoid confusion and ensure that the correct record is tracked. For physical records, this might be a barcode or a handwritten record number. For digital records, this could be a unique file name or database ID.',
                  },
                  {
                    title: '2. Borrower Information',
                    icon: <Users size={16} />,
                    content: 'This section records the details of the individual or department borrowing the record. It includes the borrower\'s name, employee ID, department, or contact information. This information is crucial for accountability and ensuring that the record can be traced back to the responsible party. It also facilitates communication regarding overdue items or recalls. Accurate borrower information is essential for maintaining control over the records and preventing loss.',
                  },
                  {
                    title: '3. Charge-Out Date and Time',
                    icon: <Clock size={16} />,
                    content: 'This component documents the precise date and time when the record was borrowed. It establishes a clear timeline for the loan period and helps to determine when the record is due for return. This information is essential for calculating overdue items and enforcing loan policies. For digital records, this might be automatically recorded by the system. For physical records, it might be manually entered.',
                  },
                  {
                    title: '4. Due Date and Time',
                    icon: <Calendar size={16} />,
                    content: 'This section specifies the date and time when the record is expected to be returned. It is based on the organisation\'s loan policies and retention schedules. The due date provides a clear deadline for the borrower and helps to prevent records from being kept indefinitely. It also facilitates scheduling and resource planning. This is a critical element, as it sets the expectation for when the item should be back in its proper place.',
                  },
                  {
                    title: '5. Return Date and Time',
                    icon: <Clock size={16} />,
                    content: 'This component records the actual date and time when the record was returned. It serves as a confirmation that the record has been returned and helps to track the loan period. This information is essential for maintaining accurate records and identifying overdue items. For digital records, this might be automatically recorded by the system. For physical records, it might be manually entered.',
                  },
                  {
                    title: '6. Authorised Signature/Confirmation',
                    icon: <CheckCircle size={16} />,
                    content: 'This section requires the borrower\'s signature or confirmation, either physical or digital, to acknowledge receipt of the record. It serves as proof that the borrower has taken responsibility for the item and agrees to return it by the due date. This component adds a layer of accountability and helps to prevent disputes. For physical records, this is usually a hand-written signature or initials. In digital systems, this might be a digital confirmation.',
                  },
                  {
                    title: '7. Comments/Notes Section',
                    icon: <MessageSquare size={16} />,
                    content: 'This section provides space for any additional comments or notes related to the loan transaction. It might include information about the condition of the record, special instructions, or reasons for extending the loan period. This section allows for flexibility and ensures that any relevant information is captured. It also serves as a communication tool between the records manager and the borrower.',
                  },
                  {
                    title: '8. Tracking/Control Number',
                    icon: <Clipboard size={16} />,
                    content: 'Sometimes a tracking or control number is added to the charge out diagram. This is a unique number that helps to track the transaction itself and can be used to link the diagram to other systems or make searching for a specific loan event easier.',
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

            {/* SECTION 3: Significance of a Charge-Out Diagram */}
            <div
              ref={(el) => {
                sectionRefs.current['charge-significance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Significance of a Charge-Out Diagram
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Ensuring Accountability and Traceability',
                    icon: <Shield size={16} />,
                    content: 'The charge-out diagram establishes a clear trail of responsibility for borrowed records. By documenting who has borrowed a record, when it was borrowed, and when it is due, it creates a system of accountability. This traceability is crucial for preventing loss or misplacement of valuable documents. In situations where records are needed for audits, legal proceedings, or internal investigations, the diagram provides concrete evidence of where the records were and who had access to them.',
                  },
                  {
                    title: 'Preventing Loss and Misplacement',
                    icon: <FileSearch size={16} />,
                    content: 'By implementing a charge-out system, organisations can significantly reduce the risk of lost or misplaced records. The diagram acts as a reminder for both the borrower and the records manager, ensuring that records are returned on time. This is especially important for physical records, which can easily be misplaced or lost if not properly tracked. The diagram also helps to identify overdue records, allowing for timely follow-up and retrieval.',
                  },
                  {
                    title: 'Streamlining Record Retrieval',
                    icon: <Search size={16} />,
                    content: 'When records are borrowed, the charge-out diagram provides a quick and easy way to locate them. This is particularly useful in organisations with large volumes of records. By knowing who has borrowed a record and when it is due back, employees can avoid time-consuming searches. This streamlines workflow and improves efficiency. In situations where multiple people need access to the same record, the diagram helps to manage the circulation.',
                  },
                  {
                    title: 'Facilitating Record Audits',
                    icon: <ClipboardList size={16} />,
                    content: 'The charge-out diagram is an invaluable tool for conducting record audits. It provides a clear and accurate record of all borrowed items, making it easy to track the movement of records and identify any discrepancies. This is essential for ensuring compliance with legal and regulatory requirements. In situations where records are needed for legal proceedings or internal investigations, the diagram provides concrete evidence.',
                  },
                  {
                    title: 'Supporting Retention Policies',
                    icon: <Calendar size={16} />,
                    content: 'By tracking the movement of records, the charge-out diagram helps to support the organisation\'s record retention and disposition policies. It provides valuable information about the usage and circulation of records, which can be used to determine their retention periods. For example, records that are frequently borrowed might need to be retained for a longer period than those that are rarely used.',
                  },
                  {
                    title: 'Enhancing Communication and Collaboration',
                    icon: <MessageSquare size={16} />,
                    content: 'The charge-out diagram serves as a communication tool between the records manager and the borrower. It provides a clear record of the loan transaction, including any special instructions or comments. This helps to prevent misunderstandings and ensures that both parties are aware of their responsibilities. In collaborative environments, the diagram helps to track the movement of records between team members.',
                  },
                  {
                    title: 'Improving Records Management Efficiency',
                    icon: <TrendingUp size={16} />,
                    content: 'By implementing a charge-out system, organisations can improve the overall efficiency of their records management practices. The diagram helps to streamline the loan process, reduce the risk of errors, and ensure that records are properly tracked and managed. This frees up time and resources for other important tasks. It also helps to create a more organised and efficient work environment.',
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

            {/* SECTION 4: Functions of a Mark-Out Card */}
            <div
              ref={(el) => {
                sectionRefs.current['markout'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Functions of a Mark-Out Card
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Recording Removal Information',
                    icon: <Clipboard size={16} />,
                    content: 'The primary function of a mark-out card is to document the details of a borrowed record. This includes information such as the record\'s title or file number, the borrower\'s name, the date of removal, and the due date for return. By recording this information, the card creates a clear audit trail of the record\'s movement. This is crucial for maintaining accountability and ensuring that records can be easily located when needed.',
                  },
                  {
                    title: '2. Acting as a Placeholder',
                    icon: <FileText size={16} />,
                    content: 'When a record is removed from its designated storage location, the mark-out card takes its place. This serves as a visual cue that the record is currently out on loan. This placeholder function prevents other users from mistakenly assuming that the record is missing or has been permanently removed. It also ensures that the filing system remains organised, even when records are temporarily absent.',
                  },
                  {
                    title: '3. Facilitating Record Tracking',
                    icon: <Search size={16} />,
                    content: 'The mark-out card aids in tracking the whereabouts of borrowed records. By recording the borrower\'s information and the due date, it provides a means to monitor the circulation of records. This is particularly useful in organisations with a high volume of record loans. It allows for timely follow-up on overdue items and helps to prevent records from being lost or misplaced.',
                  },
                  {
                    title: '4. Ensuring Accountability',
                    icon: <Shield size={16} />,
                    content: 'By requiring borrowers to provide their information and acknowledge receipt of the record, the mark-out card establishes a clear line of accountability. This helps to deter unauthorised borrowing and ensures that borrowers are responsible for the safe return of the record. In situations where records are lost or damaged, the card provides evidence of who had possession of the record at the time.',
                  },
                  {
                    title: '5. Supporting Record Audits',
                    icon: <ClipboardList size={16} />,
                    content: 'The mark-out card is a valuable tool for conducting record audits. It provides a record of all borrowed items, making it easy to track the movement of records and identify any discrepancies. This is essential for ensuring compliance with legal and regulatory requirements. In situations where records are needed for legal proceedings or internal investigations, the card provides concrete evidence.',
                  },
                  {
                    title: '6. Streamlining Record Retrieval',
                    icon: <MapPin size={16} />,
                    content: 'When a record is needed but is currently out on loan, the mark-out card provides information about who has borrowed it and when it is due back. This allows users to quickly determine the record\'s availability and plan accordingly. It also helps to prevent unnecessary searches and delays. This is especially important in time-sensitive situations.',
                  },
                  {
                    title: '7. Promoting Efficient Records Management',
                    icon: <TrendingUp size={16} />,
                    content: 'By implementing a mark-out card system, organisations can improve the overall efficiency of their records management practices. The card helps to streamline the loan process, reduce the risk of errors, and ensure that records are properly tracked and managed. This frees up time and resources for other important tasks. It also helps to create a more organised and efficient work environment.',
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

            {/* SECTION 5: Components of a Mark-Out Card */}
            <div
              ref={(el) => {
                sectionRefs.current['markout-components'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Components of a Mark-Out Card
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Record/File Identification',
                    icon: <FileText size={16} />,
                    content: 'This component is the core of the mark-out card, as it clearly identifies the specific record or file that has been removed. It typically includes the file\'s title, file number, document name, or any other unique identifier. This information must be accurate and consistent to prevent confusion and ensure that the correct record is tracked. For physical records, this might match the label on the file folder. In digital systems, this data may be a file name or a database entry.',
                  },
                  {
                    title: '2. Borrower Information',
                    icon: <Users size={16} />,
                    content: 'This section details the individual or department that has borrowed the record. It includes the borrower\'s name, employee ID, department, contact information, or any other relevant details. This information is crucial for accountability and for retrieving the record if it is not returned on time. It also helps to prevent unauthorised borrowing and ensures that the record can be traced back to the responsible party.',
                  },
                  {
                    title: '3. Charge-Out Date',
                    icon: <Calendar size={16} />,
                    content: 'This component records the date when the record was borrowed or removed from its designated storage location. This date establishes a timeline for the loan period and helps to determine when the record is due for return. It is essential for tracking the movement of records and ensuring timely retrieval. For physical records, this is typically a hand-written date.',
                  },
                  {
                    title: '4. Due Date',
                    icon: <Clock size={16} />,
                    content: 'This section specifies the date when the record is expected to be returned. It is based on the organisation\'s loan policies and retention schedules. The due date provides a clear deadline for the borrower and helps to prevent records from being kept indefinitely. It also facilitates scheduling and resource planning. This is a critical component for ensuring that records are returned promptly.',
                  },
                  {
                    title: '5. Return Date (If Applicable)',
                    icon: <CheckCircle size={16} />,
                    content: 'This component records the actual date when the record was returned. It serves as confirmation that the record has been returned and helps to track the loan period. This information is essential for maintaining accurate records and identifying overdue items. For physical records, this might be a hand-written date. In digital systems, this date might be automatically recorded.',
                  },
                  {
                    title: '6. Borrower\'s Signature/Initials',
                    icon: <PenTool size={16} />,
                    content: 'This section requires the borrower\'s signature or initials to acknowledge receipt of the record. It serves as proof that the borrower has taken responsibility for the item and agrees to return it by the due date. This component adds a layer of accountability and helps to prevent disputes. For physical records, this is usually a hand-written signature or initials.',
                  },
                  {
                    title: '7. Comments/Notes',
                    icon: <MessageSquare size={16} />,
                    content: 'This section provides space for any additional comments or notes related to the loan transaction. It might include information about the condition of the record, special instructions, or reasons for extending the loan period. This section allows for flexibility and ensures that any relevant information is captured. It also serves as a communication tool between the records manager and the borrower.',
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

            {/* SECTION 6: Control Documentation Used in Classification */}
            <div
              ref={(el) => {
                sectionRefs.current['controldocs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Control Documentation Used in Classification
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Classification Scheme Documentation',
                    icon: <FolderTree size={16} />,
                    content: 'This document is the cornerstone of any classification system. It outlines the structure of the categories, the definitions of each category, and the rules for assigning records to those categories. It should be comprehensive and clearly explain the logic behind the classification system. For example, it might detail how records are grouped by function, subject, or date, and provide examples of what types of records fall under each category.',
                  },
                  {
                    title: '2. Indexing Guidelines',
                    icon: <Tag size={16} />,
                    content: 'Indexing guidelines provide instructions on how to assign keywords, metadata, and other descriptors to records. They define the vocabulary to be used, the level of detail required, and the formatting conventions. For example, they might specify which controlled vocabulary or thesaurus to use, how many keywords to assign to each record, and how to handle abbreviations and acronyms.',
                  },
                  {
                    title: '3. Retention Schedules',
                    icon: <Clock size={16} />,
                    content: 'Retention schedules specify how long different types of records must be kept, based on legal, regulatory, and business requirements. They are essential for ensuring compliance and preventing the unnecessary storage of outdated or irrelevant records. The schedules are often integrated into the classification system, allowing for the automatic application of retention periods to classified records.',
                  },
                  {
                    title: '4. Access Control Policies',
                    icon: <Lock size={16} />,
                    content: 'Access control policies define who is authorised to access, modify, or delete classified records. They specify the security classifications for different types of records and the procedures for granting and revoking access permissions. These policies are essential for protecting sensitive or confidential information and ensuring compliance with privacy regulations.',
                  },
                  {
                    title: '5. Audit Trails and Logs',
                    icon: <ClipboardList size={16} />,
                    content: 'Audit trails and logs record all actions taken on classified records, including creation, modification, deletion, and access. They provide a detailed history of each record, which can be used to track changes, identify errors, and investigate security incidents. Audit trails are essential for ensuring accountability and transparency in records management.',
                  },
                  {
                    title: '6. Training Materials and Procedures',
                    icon: <GraduationCap size={16} />,
                    content: 'Training materials and procedures are essential for ensuring that all personnel involved in classification understand and adhere to the established guidelines. They should cover all aspects of the classification system, including the classification scheme, indexing guidelines, retention schedules, and access control policies. Training should be provided to new employees and regularly updated for existing employees.',
                  },
                  {
                    title: '7. Quality Control Procedures',
                    icon: <CheckCircle size={16} />,
                    content: 'Quality control procedures outline the steps taken to ensure the accuracy and consistency of classified records. They include regular reviews and audits of the classification system, as well as procedures for correcting errors and resolving inconsistencies. Quality control procedures help to maintain the integrity of the classification system and ensure that it remains effective over time.',
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

            {/* SECTION 7: Documents Used to Access/Locate Records in Registries */}
            <div
              ref={(el) => {
                sectionRefs.current['accessdocs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Documents Used to Access/Locate Records in Registries
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Index Registers/Finding Aids',
                    icon: <FileSearch size={16} />,
                    content: 'Index registers, or finding aids, are fundamental tools for locating records within registries. They are essentially lists or databases that provide a systematic way to identify and retrieve records based on various criteria, such as names, dates, subject matter, or file numbers. These registers often contain metadata about the records, including their location, description, and any relevant identifiers. In physical registries, these might be large bound books or card catalogs.',
                  },
                  {
                    title: '2. Charge-Out Cards/Loan Records',
                    icon: <FileUp size={16} />,
                    content: 'Charge-out cards or loan records are used to track the movement of records that have been temporarily removed from the registry. They document who has borrowed a record, when it was borrowed, and when it is due to be returned. This is particularly important for physical registries where records are physically removed. The charge-out card acts as a placeholder, indicating that the record is currently out on loan.',
                  },
                  {
                    title: '3. Request Forms/Requisition Slips',
                    icon: <Clipboard size={16} />,
                    content: 'Request forms or requisition slips are used to formally request access to records within the registry. These documents typically include information about the requester, the records being requested, and the purpose of the request. They provide a documented record of all access requests, ensuring that records are accessed in a controlled and authorised manner.',
                  },
                  {
                    title: '4. File Location Guides/Shelf Lists',
                    icon: <MapPin size={16} />,
                    content: 'File location guides or shelf lists are documents that provide detailed information about the physical location of records within the registry. They might include maps, diagrams, or lists that indicate the arrangement of files on shelves, in cabinets, or in storage areas. These guides are essential for navigating physical registries and locating specific records.',
                  },
                  {
                    title: '5. Classification Schemes/Filing Manuals',
                    icon: <FolderTree size={16} />,
                    content: 'Classification schemes and filing manuals are documents that outline the organisation\'s classification system and filing procedures. They provide guidelines for categorising, labelling, and storing records, ensuring consistency and uniformity. These documents are essential for maintaining an organised and efficient registry.',
                  },
                  {
                    title: '6. Database Query Tools/Search Interfaces',
                    icon: <Database size={16} />,
                    content: 'In digital registries, database query tools and search interfaces are used to retrieve records. These tools allow users to search for records based on various criteria, such as keywords, metadata, or file properties. They provide a powerful and efficient way to locate records within large databases. Search interfaces often include advanced search features, such as Boolean operators and wildcards.',
                  },
                  {
                    title: '7. Access Logs/Audit Trails',
                    icon: <Clock size={16} />,
                    content: 'Access logs or audit trails are documents that record all access to records within the registry. They provide a detailed history of who accessed which records, when they were accessed, and what actions were taken. These logs are essential for maintaining security and accountability. They also help to demonstrate compliance with legal and regulatory requirements.',
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
                  💡 Structure Insight
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
                    {SECTION_TABS_LO4.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Charge-Out Components</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Mark-Out Functions</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Control Documentation</span>
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
                Organograms visualise hierarchy, department structures, reporting lines, and authority. Charge-out diagrams track borrowed records with components like record ID, borrower info, dates, and signatures. Charge-out systems ensure accountability, prevent loss, streamline retrieval, and support audits. Mark-out cards act as placeholders and track borrowed records. Control documentation includes classification schemes, indexing guidelines, retention schedules, access policies, audit trails, training materials, and quality control procedures. Access tools include index registers, charge-out cards, request forms, location guides, and database search interfaces.
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
                <strong className="text-white">Organisational Structure</strong> – Organograms visualise hierarchy, departmental relationships, reporting lines, authority, and support planning, onboarding, transparency, and accountability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Charge-Out Diagrams</strong> – Track borrowed records with components: Record ID, Borrower Info, Charge-Out Date, Due Date, Return Date, Authorisation, Comments, Tracking Number. Ensure accountability, prevent loss, and streamline retrieval.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Mark-Out Cards</strong> – Act as placeholders, record removal information, facilitate tracking, ensure accountability, support audits, and streamline retrieval in physical filing systems.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Control Documentation &amp; Access Tools</strong> – Classification schemes, indexing guidelines, retention schedules, access policies, audit trails, training materials, and quality control procedures. Access tools include index registers, charge-out cards, request forms, location guides, and search interfaces.
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
            Sidemann Academic Registry • Organisational Structure &amp; Control Docs Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};