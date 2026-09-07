import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  // Standard Icons
  FolderTree, Hash, Paperclip, Edit, Target, Shield, ListChecks, Type, BookOpen,
  FileText, Scissors, Archive, Database, User, Calendar, CheckCircle, Send,
  ShieldCheck, Bell, RefreshCw, File, Folder, Clipboard, Mail, Lock, Eye,
  AlertCircle, Trash2, Cloud, Server, Disc, Box, Home, Warehouse, Zap,
  MapPin, DollarSign, Sun, FireExtinguisher, Bug, Users, Phone, MessageSquare,
  Headphones, Award, Briefcase, Coffee, ThumbsUp, HelpCircle, AlertTriangle,
  Mic, Video, Camera, Share2, Smile, Frown, Meh, TrendingUp, BarChart, PieChart,
  Inbox, SendToBack, Package, Stamp, Truck, Bookmark, FileCheck, FileSearch,
  FileWarning, FileX, UserCheck, UserPlus, UserMinus, UserX, Handshake, Heart,
  Star, Gem, Crown,
  Search as SearchIcon,
  Clock as ClockIcon,
  HardDrive as HardDriveIcon,
  Globe as GlobeIcon,
  Settings as SettingsIcon,
  Layers as LayersIcon,
  Circle as CircleIcon,
  Globe as Twitter,
  Camera as Instagram,
  Briefcase as Linkedin,
  Share2 as Facebook,
  Video as Youtube,
  Clock,
  BookOpen as BookOpenIcon,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  AlertCircle as AlertCircleIcon,
  ClipboardList,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'mail-procedures', label: 'Mail Processing' },
  { id: 'correspondence', label: 'Correspondence Registration' },
  { id: 'document-control', label: 'Document Control' },
  { id: 'first-impression', label: 'First Impression' },
  { id: 'customer-handling', label: 'Customer Handling' },
  { id: 'interpersonal', label: 'Interpersonal Communication' },
  { id: 'customer-service', label: 'Customer Service' },
  { id: 'office-tech', label: 'Office Management & Tech' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome2: React.FC = () => {
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
        text: 'The first impression is formed within 7 seconds of meeting someone. A warm greeting and professional appearance can make all the difference.',
      },
      {
        title: 'Pro Tip',
        text: 'Always verify addresses before sending mail – using address verification software can reduce return rates by up to 30%.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key steps of incoming mail with "R-S-O-D-F": Receive, Sort, Open, Distribute, File.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations neglect document version control, leading to confusion and errors. Always use clear version numbers and dates.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first impression is formed within 7 seconds of meeting someone. A warm greeting and professional appearance can make all the difference.',
      },
      {
        title: 'Pro Tip',
        text: 'Always verify addresses before sending mail – using address verification software can reduce return rates by up to 30%.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key steps of incoming mail with "R-S-O-D-F": Receive, Sort, Open, Distribute, File.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations neglect document version control, leading to confusion and errors. Always use clear version numbers and dates.',
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
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Mail Processing, Document Control &{' '}
            <span className="text-sky-300 font-bold italic">
              Customer Service
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to incoming/outgoing mail, correspondence registration, document control, first impressions, customer handling, interpersonal communication, customer service, and office management in the tech era.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Inbox size={14} className="inline mr-1" /> Mail
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileText size={14} className="inline mr-1" /> Documents
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Customers
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
                placeholder="Search for a concept, procedure, technique..."
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
            {/* SECTION 1: Procedures in Processing Incoming and Outgoing Mail */}
            <div
              ref={(el) => {
                sectionRefs.current['mail-procedures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procedures in Processing Incoming and Outgoing Mail
              </h2>

              {/* Incoming Mail */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Inbox size={16} /> Incoming Mail
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2"><Folder size={14} /> Receiving and Sorting</h4>
                    <p>The initial stage of managing incoming mail is crucial for efficient distribution and processing. This process begins with the physical receipt of mail, which might arrive through postal service delivery, courier services, or internal mail collection points. Upon arrival, the mail is immediately sorted based on its nature and priority. This sorting process involves distinguishing between general correspondence, which typically includes routine letters and documents, and specialized mail such as packages, registered mail, and confidential documents. Packages often require separate handling due to their size and potential content, while registered mail necessitates tracking and signature confirmation. Confidential documents, containing sensitive information, demand secure handling and immediate delivery to the intended recipient. A critical aspect of this stage is the separation of personal or confidential mail from general business correspondence. These items are never opened by mailroom personnel and are delivered directly to the addressee, ensuring privacy, and maintaining professional ethics. This meticulous sorting process sets the foundation for a streamlined mail management system, preventing delays and ensuring that each piece of mail is handled appropriately.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2"><Edit size={14} /> Opening and Recording</h4>
                    <p>Once the mail has been sorted, the next step involves opening and recording the contents of general correspondence. This process demands care and precision to avoid damaging any enclosed documents. Mailroom staff must use proper tools and techniques to open envelopes and packages without tearing or losing any important contents. After opening the mail, detailed records are created. These records typically include the sender's name or organization, the date the mail was received, and a brief description of the subject matter. These details are entered into a mail log, which can be a physical ledger or an electronic database. This recording system ensures that all incoming mail is accounted for and traceable. Furthermore, any enclosures, such as documents, forms, or samples, are carefully verified against any accompanying letters or notes. This verification process ensures that nothing is missing and that all items are correctly identified. This detailed recording and verification process is essential for maintaining accurate records and ensuring that all incoming information is properly managed.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2"><Send size={14} /> Distribution</h4>
                    <p>Following the opening and recording of incoming mail, the next critical step is its efficient and timely distribution to the appropriate departments or individuals within the organization. This process requires a clear understanding of the organization's structure and the responsibilities of each department and employee. Urgent or time-sensitive mail, such as legal documents or time-sensitive proposals, is prioritized to ensure that it reaches the intended recipients without delay. A well-organized internal mail delivery system is essential for this process. This system may involve designated mail delivery routes, internal mailboxes, or electronic notification systems. In larger organizations, a mail tracking system may be implemented to monitor the delivery of important documents and ensure accountability. This system can provide real-time updates on the location of mail items and confirm their delivery. Efficient distribution of incoming mail is vital for maintaining smooth operations and ensuring that all employees receive the information they need in a timely manner.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2"><Archive size={14} /> Filing and Storage</h4>
                    <p>After the mail has been processed and distributed, the final step in the incoming mail procedure is the filing and storage of the documents. This process is crucial for maintaining organized records and ensuring that information can be easily retrieved when needed. Organizations typically have established record-keeping policies that dictate how long documents must be retained and how they should be filed. These policies may vary depending on the type of document and any legal or regulatory requirements. Filing can involve physical storage in filing cabinets or electronic storage in document management systems. Physical filing requires a logical and consistent system, such as alphabetical or chronological order, to ensure that documents can be easily located. Electronic document management systems offer several advantages, including searchability, accessibility, and security. Regardless of the method used, proper filing and storage are essential for maintaining accurate records and ensuring that information is readily available when required.</p>
                  </div>
                </div>
              </div>

              {/* Outgoing Mail */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <SendToBack size={16} /> Outgoing Mail
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2"><Package size={14} /> Collection and Preparation</h4>
                    <p>The process of handling outgoing mail begins with the collection of items from various departments or individuals within the organization. This initial collection phase is critical for ensuring that all outgoing mail is gathered efficiently and accurately. Once collected, the mail must be prepared for mailing. This preparation process involves several steps, including folding documents, inserting them into envelopes, and securely sealing the envelopes. The proper preparation of outgoing mail is essential for ensuring that documents arrive at their destination in good condition and without delay. This may also entail the correct placement of return addresses, and any company logos. For larger mailings, automated equipment may be used to streamline this process. Careful preparation of outgoing mail is essential for maintaining a professional image and ensuring that all items are handled with care.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2"><Folder size={14} /> Sorting and Classification</h4>
                    <p>After the outgoing mail has been prepared, it must be sorted and classified based on its destination and required service. This sorting process ensures that each piece of mail is handled according to its specific needs. Sorting may involve separating domestic mail from international mail and distinguishing between different service levels, such as first-class mail, priority mail, and express mail. Each service level has its own delivery timeframe and cost, so it is essential to select the appropriate service for each item. Accurate classification is vital for ensuring that mail is delivered in a timely and cost-effective manner. International mail requires additional considerations, such as customs regulations and international postal rates. Proper sorting and classification of outgoing mail are essential for maintaining efficient and reliable mail delivery.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2"><Stamp size={14} /> Postage and Addressing</h4>
                    <p>Once the outgoing mail has been sorted and classified, the next step is to apply the correct postage and verify the addresses. Accurate postage is essential for ensuring that mail is delivered without delay. Postage can be applied using postage stamps or a postage meter. Postage meters offer several advantages, including automated postage calculation and printing. Addresses must be verified to ensure accuracy and prevent delivery errors. This may involve checking addresses against a database or using address verification software. Accurate addressing is essential for ensuring that mail reaches the intended recipient without delay or misdirection.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2"><Truck size={14} /> Dispatching</h4>
                    <p>The final step in the outgoing mail procedure is dispatching the mail to the post office or a courier service. This process involves physically transporting the mail from the organization's premises to the appropriate mailing facility. Registered or certified mail may require additional steps, such as obtaining a receipt or tracking number. These steps ensure that the mail can be tracked, and that proof of delivery is available. Efficient dispatching is essential for ensuring that mail is delivered in a timely manner. Organizations may have designated mail pickup times or schedules to streamline this process. For urgent or time-sensitive mail, courier services may be used to ensure expedited delivery. Proper dispatching of outgoing mail is crucial for maintaining efficient communication and ensuring that all items are delivered reliably.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2"><Clipboard size={14} /> Record Keeping</h4>
                    <p>Maintaining records of sent mail is vital, especially for important documents. This process ensures accountability and provides a trail for tracking mail. Records may include details such as the recipient's name and address, the date the mail was sent, and the contents of the mail. For registered or certified mail, tracking numbers and proof of delivery are also recorded. These records can be stored physically or electronically, depending on the organization's record-keeping policies. Accurate and thorough record-keeping is essential for maintaining organized and traceable mail operations.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Registration of Correspondence */}
            <div
              ref={(el) => {
                sectionRefs.current['correspondence'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Registration of Correspondence
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    This is a critical step in maintaining organized and traceable records within an organization. It essentially means logging and documenting all incoming and outgoing mail and communications.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Purpose of Registration',
                    icon: <Target size={16} />,
                    content: 'The primary purpose of registering correspondence is to create a formal record of all communications. This record serves as proof of receipt or dispatch, ensures accountability, and facilitates easy retrieval of information. It is crucial for tracking documents, managing deadlines, and resolving disputes. Without a formal registration process, documents can be lost, and important communications can be overlooked, leading to operational inefficiencies and potential legal issues. Registration provides a systematic way to manage the flow of information.',
                  },
                  {
                    title: 'Creating a Log or Register',
                    icon: <BookOpen size={16} />,
                    content: 'The core of registration is the creation of a log or register, which can be a physical ledger or an electronic database. This register systematically records key details of each piece of correspondence. For a physical ledger, you may have a book with columns, and for a digital system you may have a spreadsheet like format.',
                  },
                  {
                    title: 'Key Information Recorded',
                    icon: <ListChecks size={16} />,
                    content: (
                      <>
                        <p>Several essential pieces of information are recorded for each item of correspondence. This typically includes:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                          <li><strong>Date of Receipt/Dispatch:</strong> This is crucial for tracking timelines and deadlines.</li>
                          <li><strong>Sender/Recipient Details:</strong> Names, addresses, and contact information are recorded for identification.</li>
                          <li><strong>Subject/Description:</strong> A brief summary of the correspondence's content.</li>
                          <li><strong>Reference Number/Tracking Number:</strong> A unique identifier for each item.</li>
                          <li><strong>Method of Delivery:</strong> How the correspondence was sent (e.g., postal service, courier, email).</li>
                          <li><strong>Action Required/Status:</strong> Notes on any required actions or the current status of the correspondence.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Maintaining Accuracy and Consistency',
                    icon: <CheckCircle size={16} />,
                    content: 'Accuracy is paramount in the registration process. Errors in recording information can lead to confusion and miscommunication. Consistency in formatting and terminology is also essential for easy retrieval and analysis. This involves using standardized abbreviations, date formats, and naming conventions. Regular audits and reviews of the register can help ensure accuracy and identify any inconsistencies.',
                  },
                  {
                    title: 'Electronic vs. Physical Registration',
                    icon: <LayersIcon size={16} />,
                    content: 'While physical registers were traditionally used, electronic systems are becoming increasingly common. Electronic registration offers several advantages, including searchability, accessibility, and automation. Electronic systems allow for quick searches, easy sharing of information, and automated reporting. They also reduce the risk of lost or damaged records. However, physical registers may still be preferred in some situations, such as when dealing with sensitive or confidential documents.',
                  },
                  {
                    title: 'Integration with Other Systems',
                    icon: <Database size={16} />,
                    content: 'Registration of correspondence can be integrated with other organizational systems, such as document management systems or customer relationship management (CRM) systems. This integration streamlines workflows and improves efficiency. For example, registering an incoming customer complaint could automatically create a ticket in the CRM system. Integrating these systems reduces the need for manual data entry and ensures that information is readily available across the organization.',
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

            {/* SECTION 3: Document Controlling */}
            <div
              ref={(el) => {
                sectionRefs.current['document-control'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Document Controlling
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Document control is a systematic process that organizations use to manage and regulate their documents throughout their lifecycle. It ensures that documents are created, reviewed, approved, distributed, and disposed of in a controlled and organized manner. This is crucial for maintaining accuracy, consistency, and compliance with regulations and standards.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Key Components of Document Control',
                    icon: <FileText size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Document Creation and Identification:</strong> This involves establishing standardized templates and naming conventions for documents. Clear identification ensures that documents can be easily located and tracked. This stage is very important for maintaining consistent formatting, and for easy document retrieval.</li>
                        <li><strong>Version Control:</strong> This is a critical aspect of document control, as it tracks revisions and ensures that everyone is working with the most current version of a document. This prevents confusion and errors that can arise from using outdated information.</li>
                        <li><strong>Review and Approval:</strong> Document control involves establishing workflows for reviewing and approving documents. This ensures that documents are accurate and meet the necessary standards before they are distributed. This is very important for documents that contain information that must be correct, such as legal or medical documents.</li>
                        <li><strong>Distribution and Access Control:</strong> This involves controlling who has access to documents and how they are distributed. This is particularly important for sensitive or confidential information. This is often done through digital systems that allow for permission settings.</li>
                        <li><strong>Storage and Retrieval:</strong> Document control includes establishing procedures for storing and retrieving documents. This ensures that documents can be easily located when needed. This can be done with physical or digital storage systems.</li>
                        <li><strong>Document Retention and Disposal:</strong> Organizations must establish policies for how long documents are retained and how they are disposed of. This ensures compliance with legal and regulatory requirements. Many industries have very strict rules regarding how long certain documents must be saved.</li>
                        <li><strong>Audit Trails:</strong> Having a system that creates audit trails, allows for the tracking of all actions taken on a document. This is very important for compliance, and for finding where and when changes were made.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Why Document Control Is Important',
                    icon: <Award size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Compliance:</strong> Document control helps organizations comply with legal and regulatory requirements.</li>
                        <li><strong>Accuracy:</strong> It ensures that documents are accurate and up to date.</li>
                        <li><strong>Efficiency:</strong> It streamlines document management processes and improves efficiency.</li>
                        <li><strong>Risk Management:</strong> It helps organizations mitigate risks associated with inaccurate or outdated information.</li>
                        <li><strong>Quality Management:</strong> It is vital for maintaining quality standards, especially in industries like manufacturing and healthcare.</li>
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

            {/* SECTION 4: Principles to Creating a Powerful First Impression */}
            <div
              ref={(el) => {
                sectionRefs.current['first-impression'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Principles to Creating a Powerful First Impression
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Creating a powerful first impression is a crucial skill in both personal and professional settings. It sets the tone for future interactions and can significantly influence how others perceive you. Here are the key principles:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Positive Body Language',
                    icon: <User size={16} />,
                    content: 'Non-verbal communication speaks volumes. Maintaining open and confident body language is essential. This includes standing or sitting upright, making eye contact (without staring), and using relaxed and natural gestures. A genuine smile can immediately create a warm and welcoming atmosphere. Avoid fidgeting, crossing your arms, or slouching, as these can convey nervousness, disinterest, or defensiveness. Your posture and movements should project confidence and approachability. When meeting someone for the first time, a firm handshake (when culturally appropriate) can also convey confidence and professionalism.',
                  },
                  {
                    title: 'Professional Appearance',
                    icon: <Award size={16} />,
                    content: 'Your appearance plays a significant role in forming a first impression. Dress appropriately for the occasion and the environment. This does not necessarily mean wearing expensive clothing, but it does mean being clean, well-groomed, and presentable. Pay attention to details such as clean shoes, neat hair, and appropriate attire. Your appearance should reflect respect for yourself and the person or people you are meeting. Being well dressed gives the impression that you care about the situation and take it seriously.',
                  },
                  {
                    title: 'Effective Communication',
                    icon: <MessageSquare size={16} />,
                    content: 'The way you communicate verbally is just as important as your non-verbal communication. Speak clearly and confidently, using a pleasant and respectful tone. Avoid using slang, jargon, or overly complex language, especially when meeting someone for the first time. Listen attentively to what the other person is saying and show genuine interest in their responses. Ask thoughtful questions and engage in meaningful conversation. Your communication should be clear, concise, and professional, leaving a positive and lasting impression.',
                  },
                  {
                    title: 'Enthusiasm and Positive Attitude',
                    icon: <Sun size={16} />,
                    content: 'A positive attitude is contagious. When you approach a situation with enthusiasm and optimism, it can create a more positive and engaging interaction. Express genuine interest in the other person and the conversation. Avoid negativity, complaining, or gossiping, as these can quickly turn people off. Your enthusiasm should be sincere and authentic, reflecting your genuine interest in the interaction.',
                  },
                  {
                    title: 'Preparedness and Punctuality',
                    icon: <Clock size={16} />,
                    content: 'Being prepared and punctual shows respect for the other person\'s time. Arrive on time for appointments or meetings and have any necessary materials or information readily available. This demonstrates that you are organized, reliable, and professional. If you are meeting someone for a job interview, have your resume, and any needed information ready. Being prepared, will lower your own stress, and make the other person feel that you value their time.',
                  },
                  {
                    title: 'Genuine Interest and Empathy',
                    icon: <Heart size={16} />,
                    content: 'Show genuine interest in the other person and their perspective. Ask open-ended questions to encourage them to share more about themselves. Listen attentively and respond thoughtfully, demonstrating empathy and understanding. Try to find common ground and build rapport by identifying shared interests or experiences. This creates a connection and makes the other person feel valued and respected.',
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

            {/* SECTION 5: Management and Customer Handling Techniques */}
            <div
              ref={(el) => {
                sectionRefs.current['customer-handling'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Management and Customer Handling Techniques
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Active Listening and Empathetic Communication',
                    icon: <MessageSquare size={16} />,
                    content: 'Effective customer handling begins with active listening. This goes beyond simply hearing the customer\'s words; it involves fully understanding their concerns, needs, and emotions. In a management context, this translates to creating a culture where employees are trained to listen attentively, ask clarifying questions, and paraphrase to confirm understanding. Empathetic communication is equally vital. Managers should emphasize the importance of acknowledging the customer\'s feelings and responding with sensitivity and understanding. For example, if a customer expresses frustration over a delayed delivery, the employee should not only apologize but also demonstrate empathy by acknowledging the inconvenience caused. This could involve saying something like, "I understand how frustrating this must be, especially when you were expecting it sooner." This approach fosters trust and builds rapport, demonstrating that the organization values the customer\'s experience. Managers must model this behaviour, actively listening to their team and customers, and promoting a culture of empathy throughout the organization. By prioritizing active listening and empathetic communication, businesses can create a positive customer experience and build long-lasting relationships.',
                  },
                  {
                    title: '2. Personalized Service and Tailored Solutions',
                    icon: <UserPlus size={16} />,
                    content: 'Customers increasingly expect personalized service and solutions that cater to their specific needs. This means moving away from a one-size-fits-all approach and focusing on understanding individual customer preferences and requirements. Management should invest in systems and processes that enable employees to gather and utilize customer data effectively. This could involve using customer relationship management (CRM) systems to track customer interactions, preferences, and purchase history. Employees should be empowered to tailor their service based on this information, offering personalized recommendations, addressing specific concerns, and providing customized solutions. For example, a customer who frequently orders a particular product might appreciate proactive recommendations for complementary items or related services. Managers should encourage employees to go the extra mile to personalize the customer experience, such as remembering their names, anticipating their needs, and offering personalized follow-up. By providing personalized service and tailored solutions, businesses can enhance customer satisfaction, loyalty, and advocacy.',
                  },
                  {
                    title: '3. Proactive Problem Solving and Conflict Resolution',
                    icon: <Target size={16} />,
                    content: 'Inevitably, problems and conflicts will arise in customer interactions. Effective customer handling requires a proactive approach to problem-solving and conflict resolution. This involves anticipating potential issues, addressing them promptly, and finding mutually agreeable solutions. Management should empower employees to take ownership of customer problems and provide them with the necessary training and resources to resolve issues effectively. This includes teaching them conflict resolution techniques, such as active listening, negotiation, and compromise. When a customer raises a complaint, employees should listen attentively, acknowledge their concerns, and work collaboratively to find a solution. Managers should also establish clear escalation procedures for complex or unresolved issues, ensuring that customers receive timely and satisfactory resolutions. By adopting a proactive approach to problem-solving and conflict resolution, businesses can turn potentially negative experiences into positive ones, building customer trust and loyalty.',
                  },
                  {
                    title: '4. Building Strong Customer Relationships and Loyalty',
                    icon: <Heart size={16} />,
                    content: 'Customer loyalty is a valuable asset for any business. Management should prioritize building strong customer relationships and fostering loyalty through consistent and exceptional service. This involves creating a positive customer experience at every touchpoint, from initial contact to post-purchase support. Employees should be trained to build rapport with customers, establish trust, and create a sense of connection. Managers should also implement loyalty programs, offer exclusive benefits, and provide personalized rewards to recognize and reward loyal customers. Regular communication and engagement are also essential for maintaining customer relationships. This could involve sending personalized emails, newsletters, or social media updates. By building strong customer relationships and fostering loyalty, businesses can increase customer retention, reduce churn, and generate repeat business.',
                  },
                  {
                    title: '5. Continuous Improvement and Feedback Mechanisms',
                    icon: <RefreshCw size={16} />,
                    content: 'Customer expectations and needs are constantly evolving. Management should establish mechanisms for gathering customer feedback and using it to drive continuous improvement. This could involve conducting customer surveys, monitoring social media sentiment, and analysing customer complaints. Employees should be encouraged to solicit feedback from customers and share it with management. Managers should also regularly review customer feedback and identify areas for improvement in products, services, and processes. By fostering a culture of continuous improvement and actively seeking customer feedback, businesses can stay ahead of the competition and ensure that they are meeting the evolving needs of their customers.',
                  },
                  {
                    title: '6. Empowering Employees and Fostering a Customer-Centric Culture',
                    icon: <Users size={16} />,
                    content: 'Ultimately, effective customer handling relies on empowered employees who are passionate about providing exceptional service. Management should create a customer-centric culture where employees are valued, supported, and motivated to go the extra mile for customers. This involves providing employees with the necessary training, resources, and autonomy to make decisions that benefit customers. Managers should also recognize and reward employees who excel in customer service, reinforcing positive behaviours and fostering a sense of ownership. By empowering employees and fostering a customer-centric culture, businesses can create a workforce that is dedicated to providing exceptional customer experiences.',
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

            {/* SECTION 6: The Art of Effective Interpersonal Communication */}
            <div
              ref={(el) => {
                sectionRefs.current['interpersonal'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Art of Effective Interpersonal Communication
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The art of effective interpersonal communication involves more than just exchanging words. It is about building meaningful connections, fostering understanding, and navigating social interactions with grace and clarity. Here is a breakdown of the key elements that contribute to this art:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Active Listening and Attentive Presence',
                    icon: <MessageSquare size={16} />,
                    content: 'Effective interpersonal communication begins with active listening. This means giving your full attention to the speaker, both verbally and non-verbally. It involves setting aside distractions, maintaining eye contact (where culturally appropriate), and showing genuine interest in what the other person is saying. Active listening also entails asking clarifying questions to ensure you understand the message correctly and paraphrasing to confirm your comprehension. Beyond just hearing the words, it is about being present in the moment and demonstrating that you value the speaker\'s perspective. It involves recognizing and acknowledging their emotions and responding with empathy and understanding. When someone feels heard and understood, they are more likely to engage in open and honest communication, fostering a deeper connection.',
                  },
                  {
                    title: '2. Clear and Concise Verbal Communication',
                    icon: <Type size={16} />,
                    content: 'The way you express yourself verbally plays a crucial role in effective communication. Clarity and conciseness are key. This means speaking in a straightforward manner, using language that is easily understood by the other person. Avoid using jargon, slang, or overly complex language, especially when communicating with someone unfamiliar with the subject matter. Pay attention to your tone of voice, as it can convey emotions and attitudes that may not be intended. Speak with a calm and respectful tone, even when discussing sensitive or challenging topics. Articulating your thoughts clearly and concisely minimizes the risk of misunderstandings and ensures that your message is received as intended.',
                  },
                  {
                    title: '3. Non-Verbal Communication and Body Language',
                    icon: <User size={16} />,
                    content: 'Non-verbal cues, such as body language, facial expressions, and tone of voice, can convey more information than words alone. Being aware of your own non-verbal communication and interpreting the non-verbal cues of others is essential for effective interpersonal communication. Maintain open and approachable body language, such as uncrossed arms and legs, and a relaxed posture. Use appropriate facial expressions to convey emotions and engagement. Pay attention to the other person\'s non-verbal cues, as they can provide valuable insights into their feelings and thoughts. For example, a furrowed brow might indicate confusion or concern, while a smile might indicate agreement or approval. Aligning your verbal and non-verbal communication ensures that your message is consistent and authentic.',
                  },
                  {
                    title: '4. Empathy and Emotional Intelligence',
                    icon: <Heart size={16} />,
                    content: 'Empathy is the ability to understand and share the feelings of another person. Emotional intelligence, or EQ, is the ability to recognize, understand, and manage your own emotions and the emotions of others. These qualities are essential for building strong interpersonal relationships. When you demonstrate empathy, you show that you care about the other person\'s feelings and perspective. This can create a sense of trust and connection, fostering open and honest communication. Developing your emotional intelligence allows you to navigate social interactions with greater sensitivity and understanding. It involves recognizing and managing your own emotional triggers, as well as understanding the emotional needs of others.',
                  },
                  {
                    title: '5. Active Questioning and Inquiry',
                    icon: <HelpCircle size={16} />,
                    content: 'Asking thoughtful and relevant questions is a powerful tool for effective interpersonal communication. It demonstrates your interest in the other person\'s perspective and encourages them to share more information. Open-ended questions, which require more than a simple "yes" or "no" answer, can elicit deeper and more meaningful responses. Active questioning involves listening attentively to the other person\'s answers and asking follow-up questions to clarify or expand on their points. This process not only deepens your understanding but also shows that you are genuinely engaged in the conversation.',
                  },
                  {
                    title: '6. Respect and Cultural Sensitivity',
                    icon: <GlobeIcon size={16} />,
                    content: 'Effective interpersonal communication requires respect for the other person\'s opinions, values, and cultural background. This means being mindful of cultural differences in communication styles and avoiding any language or behaviour that could be offensive or disrespectful. It involves recognizing and valuing diversity and adapting your communication style to suit different individuals and situations. Showing respect and cultural sensitivity creates a safe and inclusive environment for communication, fostering trust and understanding.',
                  },
                  {
                    title: '7. Feedback and Constructive Criticism',
                    icon: <RefreshCw size={16} />,
                    content: 'Giving and receiving feedback is an essential part of effective interpersonal communication. When giving feedback, focus on specific behaviours or actions, rather than making personal attacks. Frame your feedback in a constructive and supportive manner, offering suggestions for improvement. When receiving feedback, listen attentively and try to understand the other person\'s perspective. Avoid defensiveness or interrupting and ask clarifying questions to ensure you understand the feedback correctly. Using feedback effectively promotes personal and professional growth and strengthens relationships.',
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

            {/* SECTION 7: Customer Service */}
            <div
              ref={(el) => {
                sectionRefs.current['customer-service'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Customer Service
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Customer service is the act of providing support to customers—both before, during, and after a purchase or use of a service—and ensuring a positive, satisfying experience. It is much more than just answering questions; it is about building relationships, solving problems, and creating loyal customers. Here is a comprehensive breakdown:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Understanding Customer Needs and Expectations',
                    icon: <Target size={16} />,
                    content: 'At the heart of excellent customer service lies a deep understanding of customer needs and expectations. This involves actively listening to customers, asking clarifying questions, and demonstrating empathy. Businesses need to gather customer feedback through surveys, social media monitoring, and direct interactions to identify patterns and trends. Understanding customer expectations also means anticipating their needs before they arise. This involves proactive communication, personalized service, and a willingness to go the extra mile. By understanding customer needs and expectations, businesses can tailor their services and interactions to create a more satisfying and personalized experience.',
                  },
                  {
                    title: '2. Providing Prompt and Efficient Support',
                    icon: <Clock size={16} />,
                    content: 'Customers value their time, and they expect prompt and efficient support when they encounter problems or have questions. This means responding to inquiries quickly, resolving issues efficiently, and providing clear and concise information. Businesses should strive to minimize wait times, streamline support processes, and empower employees to make decisions that benefit customers. Utilizing technology, such as live chat, email ticketing systems, and knowledge bases, can help businesses provide faster and more efficient support. Prompt and efficient support demonstrates that the business values the customer\'s time and is committed to resolving their issues quickly.',
                  },
                  {
                    title: '3. Delivering Personalized and Empathetic Interactions',
                    icon: <User size={16} />,
                    content: 'Customers want to feel valued and understood. This means providing personalized and empathetic interactions that cater to their specific needs and preferences. Employees should be trained to listen attentively, acknowledge customer emotions, and respond with empathy and understanding. Using the customer\'s name, remembering their past interactions, and offering personalized recommendations can help create a more meaningful and engaging experience. Empathetic communication involves understanding the customer\'s perspective and responding with sensitivity and compassion. By delivering personalized and empathetic interactions, businesses can build stronger relationships and create loyal customers.',
                  },
                  {
                    title: '4. Resolving Issues and Complaints Effectively',
                    icon: <AlertCircle size={16} />,
                    content: 'Inevitably, customers will encounter problems or have complaints. How a business handles these situations can significantly impact customer loyalty. Employees should be trained to resolve issues and complaints effectively, taking ownership of the problem and working collaboratively to find a solution. This involves listening attentively to the customer\'s concerns, acknowledging their frustration, and providing clear and concise information about the resolution process. Businesses should strive to resolve issues quickly and fairly, and they should follow up with customers to ensure their satisfaction. Effective issue resolution can turn a potentially negative experience into a positive one, building customer trust and loyalty.',
                  },
                  {
                    title: '5. Building Strong Customer Relationships',
                    icon: <Heart size={16} />,
                    content: 'Customer service is not just about resolving problems; it is also about building strong customer relationships. This involves creating a positive and engaging customer experience at every touchpoint, from initial contact to post-purchase support. Businesses should strive to create a sense of community, foster customer loyalty, and encourage repeat business. This can involve implementing loyalty programs, offering exclusive benefits, and providing personalized rewards. Regular communication and engagement, such as sending personalized emails and social media updates, can help maintain customer relationships. By building strong customer relationships, businesses can increase customer retention, reduce churn, and generate positive word-of-mouth referrals.',
                  },
                  {
                    title: '6. Fostering a Customer-Centric Culture',
                    icon: <Users size={16} />,
                    content: 'Excellent customer service requires a customer-centric culture that permeates the entire organization. This means prioritizing customer needs in all aspects of the business, from product development to marketing and sales. Employees should be empowered to make decisions that benefit customers, and they should be recognized and rewarded for providing exceptional service. Management should lead by example, demonstrating a commitment to customer satisfaction and fostering a culture of empathy and respect. By fostering a customer-centric culture, businesses can create a workforce that is dedicated to providing exceptional customer experiences.',
                  },
                  {
                    title: '7. Continuous Improvement and Feedback',
                    icon: <RefreshCw size={16} />,
                    content: 'Customer expectations and needs are constantly evolving. Businesses should establish mechanisms for gathering customer feedback and using it to drive continuous improvement. This can involve conducting customer surveys, monitoring social media sentiment, and analysing customer complaints. Employees should be encouraged to solicit feedback from customers and share it with management. Managers should regularly review customer feedback and identify areas for improvement in products, services, and processes. By fostering a culture of continuous improvement and actively seeking customer feedback, businesses can stay ahead of the competition and ensure that they are meeting the evolving needs of their customers.',
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

            {/* SECTION 8: Office Management in the Era of Technology */}
            <div
              ref={(el) => {
                sectionRefs.current['office-tech'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Office Management in the Era of Technology
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Office management in the era of technology has undergone a dramatic transformation. The traditional office, with its paper-based systems and rigid structures, is rapidly evolving into a dynamic, tech-driven environment. This shift has brought about significant changes in how offices operate, communicate, and manage their resources. Here's a comprehensive look at office management in the age of technology:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Embracing Digital Transformation and Automation',
                    icon: <Cloud size={16} />,
                    content: 'The core of modern office management is the embrace of digital transformation and automation. This involves replacing manual processes with digital solutions to enhance efficiency and productivity. Cloud-based platforms, project management software, and automated workflows are becoming standard tools. Automation streamlines tasks like data entry, scheduling, and reporting, freeing up employees to focus on more strategic initiatives. Digital transformation also enables remote work and flexible work arrangements, allowing businesses to tap into a wider talent pool and reduce overhead costs. This shift requires managers to be tech-savvy, adaptable, and willing to invest in new technologies that improve operational efficiency.',
                  },
                  {
                    title: '2. Leveraging Communication and Collaboration Tools',
                    icon: <MessageSquare size={16} />,
                    content: 'Technology has revolutionized how offices communicate and collaborate. Email, instant messaging, video conferencing, and collaborative platforms have become essential tools for facilitating communication and teamwork. These tools enable real-time communication, seamless file sharing, and efficient project management, regardless of location. Managers must be proficient in using these tools and ensure that employees are trained to utilize them effectively. This also involves establishing clear communication protocols and guidelines to prevent information overload and ensure that communication is clear and concise. The use of collaborative platforms also promotes transparency and accountability, as all team members have access to the same information and can track progress in real-time.',
                  },
                  {
                    title: '3. Implementing Data Management and Security Measures',
                    icon: <Database size={16} />,
                    content: 'In the era of technology, data is a valuable asset. Office management now involves implementing robust data management and security measures to protect sensitive information. Cloud storage, data encryption, and access control systems are crucial for safeguarding data from cyber threats. Managers must ensure that employees are trained on data security best practices and that the organization complies with relevant data privacy regulations. This also involves establishing clear data backup and recovery procedures to prevent data loss in the event of a system failure or cyberattack. Proper data management and security are essential for maintaining customer trust, protecting the organization\'s reputation, and ensuring business continuity.',
                  },
                  {
                    title: '4. Utilizing Project Management and Productivity Software',
                    icon: <LayersIcon size={16} />,
                    content: 'Project management and productivity software have become indispensable tools for modern office management. These tools help managers plan, execute, and monitor projects efficiently. They provide features such as task assignment, deadline tracking, progress reporting, and resource allocation. By using project management software, managers can ensure that projects are completed on time and within budget. Productivity software, such as time tracking tools and task management apps, helps employees stay organized and focused. Managers should evaluate different software options and select tools that align with the organization\'s needs and workflows. This also involves providing employees with training and support to ensure that they can utilize the software effectively.',
                  },
                  {
                    title: '5. Fostering a Flexible and Adaptable Work Environment',
                    icon: <Home size={16} />,
                    content: 'Technology has enabled the creation of flexible and adaptable work environments. Remote work, hybrid work models, and flexible hours are becoming increasingly common. Managers must adapt to these changes and create a work environment that supports employee flexibility and autonomy. This involves establishing clear performance expectations, providing employees with the necessary tools and resources, and fostering a culture of trust and accountability. Managers should also focus on creating a positive and inclusive work environment that promotes employee well-being and engagement. This involves offering opportunities for professional development, recognizing employee achievements, and encouraging open communication.',
                  },
                  {
                    title: '6. Integrating Artificial Intelligence and Machine Learning',
                    icon: <Zap size={16} />,
                    content: 'Artificial intelligence (AI) and machine learning (ML) are transforming various aspects of office management. AI-powered chatbots can handle customer inquiries, automate routine tasks, and provide personalized support. ML algorithms can analyse data to identify patterns and trends, enabling managers to make data-driven decisions. AI and ML can also improve efficiency by automating tasks such as scheduling, document management, and data analysis. Managers should explore opportunities to integrate AI and ML into their operations and evaluate the potential benefits. This also involves addressing ethical considerations and ensuring that AI is used responsibly and transparently.',
                  },
                  {
                    title: '7. Emphasizing Continuous Learning and Development',
                    icon: <BookOpen size={16} />,
                    content: 'The rapid pace of technological change requires a commitment to continuous learning and development. Managers must ensure that employees have the skills and knowledge necessary to thrive in the digital workplace. This involves providing training on new technologies, encouraging employees to pursue professional development opportunities, and fostering a culture of lifelong learning. Managers should also stay up to date on the latest technological trends and advancements. This involves attending industry conferences, reading relevant publications, and networking with other professionals. Office management in the era of technology is about embracing change, leveraging technology to improve efficiency, and creating a work environment that supports employee success.',
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
                  💡 Office Insight
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
                  <span>Mail Processing Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">9</span>
                </li>
                <li className="flex justify-between">
                  <span>First Impression Principles</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Customer Service Aspects</span>
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
                Efficient mail processing involves receiving, sorting, opening, distributing, and filing. Register correspondence to maintain traceability. Document control ensures version control, access, and compliance. First impressions are built on body language, appearance, communication, and empathy. Customer handling requires active listening, personalization, problem-solving, and continuous improvement. Interpersonal communication is key, and technology is reshaping office management with automation, collaboration tools, and AI.
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
                <strong className="text-white">Mail Processing</strong> – Incoming: receive, sort, open, record, distribute, file. Outgoing: collect, prepare, sort, apply postage, dispatch, record. Accuracy and efficiency are key.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Correspondence &amp; Document Control</strong> – Register all mail with key details. Document control ensures version management, access, retention, and audit trails – essential for compliance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">First Impressions &amp; Customer Handling</strong> – Positive body language, professional appearance, clear communication, enthusiasm, preparedness, empathy. Handle customers with active listening, personalised service, proactive problem-solving, and continuous feedback.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Interpersonal Communication</strong> – Active listening, clear verbal expression, non-verbal cues, empathy, questioning, respect, and constructive feedback build strong relationships.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Technology in Office Management</strong> – Embrace digital transformation, collaboration tools, data security, project management software, flexible work, AI, and continuous learning to stay ahead.
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
            Sidemann Academic Registry • Records &amp; Information Management – Learning Outcome 2 (Mail, Document Control &amp; Customer Service)
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;