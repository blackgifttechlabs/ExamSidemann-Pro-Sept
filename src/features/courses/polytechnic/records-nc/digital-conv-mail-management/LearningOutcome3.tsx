import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Mail,
  FolderTree,
  Truck,
  ClockIcon,
  Shield,
  UsersIcon,
  UserIcon,
  PackageIcon,
  FileTextIcon,
  FolderPlus,
  FolderMinus,
  Send,
  Hand,
  Building,
  GlobeIcon,
  ClipboardList,
  RefreshCwIcon,
  LockIcon,
  Database,
  KeyIcon,
  ShieldAlert,
  Archive,
  Paperclip,
  TrashIcon,
  SettingsIcon,
  Target,
  FileEditIcon,
  ShareIcon,
  BarChart,
  SearchIcon,
  FileText,
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
  Volume2,
  Plug,
  AlertCircle,
  CheckCircle as CheckCircleIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'classification', label: 'Classification' },
  { id: 'apply-class', label: 'Apply Classification' },
  { id: 'linked-folders', label: 'Linked Folders' },
  { id: 'dispatch-prep', label: 'Dispatch Preparation' },
  { id: 'outgoing-register', label: 'Outgoing Register' },
  { id: 'delivery-service', label: 'Delivery Service' },
  { id: 'courier-policies', label: 'Courier Policies' },
  { id: 'courier-records', label: 'Courier Records' },
  { id: 'hand-delivery-records', label: 'Hand Delivery Records' },
  { id: 'postal-zimbabwe', label: 'Postal Services' },
  { id: 'ordinary-dispatch', label: 'Ordinary Dispatch' },
  { id: 'dispatch-register', label: 'Dispatch Register' },
  { id: 'security-access', label: 'Security & Access' },
  { id: 'free-space', label: 'Free Server Space' },
  { id: 'content-manager', label: 'Content Manager' },
  { id: 'legal-compliance', label: 'Legal Compliance' },
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
        text: 'The Zimbabwean postal service, Zimpost, was established in 1989 and operates over 200 post offices across the country.',
      },
      {
        title: 'Pro Tip',
        text: 'Always verify addresses before dispatching mail to reduce return rates and improve delivery efficiency.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the seven classification criteria with "U-C-M-R-S-L-T": Urgency, Confidentiality, Mail Class, Recipient, Sender, Mail Type, Legal.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations forget to regularly audit their mail dispatch registers, leading to lost records and accountability gaps.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The Zimbabwean postal service, Zimpost, was established in 1989 and operates over 200 post offices across the country.',
      },
      {
        title: 'Pro Tip',
        text: 'Always verify addresses before dispatching mail to reduce return rates and improve delivery efficiency.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the seven classification criteria with "U-C-M-R-S-L-T": Urgency, Confidentiality, Mail Class, Recipient, Sender, Mail Type, Legal.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations forget to regularly audit their mail dispatch registers, leading to lost records and accountability gaps.',
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
            <Mail size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Mail Management —{' '}
            <span className="text-purple-300 font-bold italic">
              Classification, Dispatch &amp; Security
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to mail classification, linked folders, dispatch procedures, courier services, postal services in Zimbabwe, mail security, and content management.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FolderTree size={14} className="inline mr-1" /> Classification
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Truck size={14} className="inline mr-1" /> Dispatch
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
                placeholder="Search for a concept, procedure, service..."
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
            {/* SECTION 1: Classification in Mail Management */}
            <div
              ref={(el) => {
                sectionRefs.current['classification'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Classification in Mail Management
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Classification in mail management involves categorising mail items based on various criteria to ensure efficient handling and distribution. This process helps organisations prioritise, track, and secure mail according to its nature and importance. Common classification categories include:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Urgency',
                    icon: <Clock size={16} />,
                    content: 'This classifies mail based on the time-sensitivity of its content. Urgent mail, such as legal documents or time-sensitive contracts, receives priority handling.',
                  },
                  {
                    title: 'Confidentiality',
                    icon: <Shield size={16} />,
                    content: 'This categorises mail containing sensitive information, such as personal data, financial records, or proprietary business information, requiring secure handling and restricted access.',
                  },
                  {
                    title: 'Mail Class',
                    icon: <Mail size={16} />,
                    content: 'This separates mail based on the postal service\'s classification, such as first-class, standard, certified, or registered mail, each with its own handling and delivery requirements.',
                  },
                  {
                    title: 'Recipient/Department',
                    icon: <UsersIcon size={16} />,
                    content: 'This sorts mail based on the intended recipient or department within the organisation, facilitating efficient internal distribution.',
                  },
                  {
                    title: 'Sender',
                    icon: <UserIcon size={16} />,
                    content: 'This categorises mail based on the sender, allowing for efficient tracking and management of correspondence from specific clients, vendors, or partners.',
                  },
                  {
                    title: 'Mail Type',
                    icon: <PackageIcon size={16} />,
                    content: 'This separates mail based on the physical type of mail, for example, packages, letters, postcards, and large envelopes.',
                  },
                  {
                    title: 'Legal or Regulatory',
                    icon: <FileText size={16} />,
                    content: 'This classification is for items that have legal or regulatory requirements, such as court documents, compliance paperwork, and items that need to be kept for a certain amount of time.',
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

            {/* SECTION 2: Applying Mail Classification Procedures */}
            <div
              ref={(el) => {
                sectionRefs.current['apply-class'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Applying Mail Classification Procedures
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Applying mail classification procedures involves implementing a systematic approach to categorise mail items based on the established classification criteria. This process begins upon receipt of the mail, where a trained mail handler or automated system assesses each item and assigns it to the appropriate category. For instance, an envelope marked "Confidential" would be immediately separated and handled according to the organisation's security protocols, while a standard letter might be sorted based on the recipient's department. The classification process also involves utilising tools and technologies, such as mail tracking software or barcode scanners, to streamline categorisation and ensure accuracy. Detailed records are maintained for each classified item, including the classification category, date of receipt, and recipient details. Regular audits and reviews of the classification procedures are conducted to ensure consistency and compliance with organisational policies and regulatory requirements. This includes making sure all mail handlers are properly trained on the classification procedures. The goal is to create a seamless and efficient mail handling process that minimises errors and ensures that all mail is handled appropriately.
                </p>
              </div>
            </div>

            {/* SECTION 3: Creating and Removing Linked Folders */}
            <div
              ref={(el) => {
                sectionRefs.current['linked-folders'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Creating and Removing Linked Folders
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Creating Linked Folders',
                    icon: <FolderPlus size={16} />,
                    content: 'Creating linked folders in email clients or file management systems allows users to access and manage data from multiple sources within a single interface. Creating a linked folder typically involves adding an external account or directory to the existing system. For example, in an email client, users can link their personal email account to their work account, allowing them to view and manage both inboxes from one location. This process often requires entering server settings, login credentials, and specifying the desired folders to be linked. Similarly, file management systems can link folders from network drives or cloud storage services, providing a centralised access point for various data sources.',
                  },
                  {
                    title: 'Removing Linked Folders',
                    icon: <FolderMinus size={16} />,
                    content: 'Removing a linked folder is usually a simple process, involving right-clicking on the linked folder and selecting the "Remove" or "Delete" option. It is crucial to understand that removing a linked folder does not delete the original data; it merely removes the link from the current interface. This feature is particularly useful for streamlining workflows and enhancing productivity by providing a unified view of data from diverse locations.',
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

            {/* SECTION 4: Procedures Followed in Preparing Mail for Dispatch */}
            <div
              ref={(el) => {
                sectionRefs.current['dispatch-prep'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procedures Followed in Preparing Mail for Dispatch
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Preparing mail for dispatch involves a series of steps to ensure that mail is sent accurately and efficiently. The process begins with verifying the recipient's address and ensuring that it is complete and correct. This may involve using address verification software or checking against a database of valid addresses. Next, the mail item is packaged appropriately, using suitable envelopes or boxes to protect the contents during transit. The correct postage is then applied, either through a franking machine or by affixing stamps, based on the mail class and destination. For certified or registered mail, the necessary documentation is completed to ensure proof of delivery and tracking. The mail item is then logged into the outgoing mail register, recording details such as the recipient's name, address, mail class, and tracking number (if applicable). Finally, the mail is dispatched through the designated postal service or courier, and a record of the dispatch is maintained. This process ensures that outgoing mail is sent efficiently, securely, and with proper documentation.
                </p>
              </div>
            </div>

            {/* SECTION 5: Filling the Mail Outgoing Register */}
            <div
              ref={(el) => {
                sectionRefs.current['outgoing-register'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Filling the Mail Outgoing Register
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Filling the mail outgoing register is a critical step in maintaining accurate records of dispatched mail. This register serves as an audit trail, documenting all outgoing mail items and their associated details. The process begins by recording the date and time of dispatch, followed by the recipient's name and address. The mail class, such as first-class, certified, or registered, is also noted, along with any tracking numbers or reference IDs. A brief description of the mail item's contents may also be included, especially for important or valuable items. The register should be filled out legibly and accurately, with no omissions or errors. Regular checks and audits of the outgoing mail register are conducted to ensure accuracy and completeness. This register helps to maintain accountability and provides a reliable record of all outgoing mail, which can be crucial for tracking, auditing, and resolving any disputes or discrepancies. Digital outgoing mail registers are increasingly common, and offer the ability to search past mail, and create reports.
                </p>
              </div>
            </div>

            {/* SECTION 6: Mail and Delivery Service */}
            <div
              ref={(el) => {
                sectionRefs.current['delivery-service'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Mail and Delivery Service
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Urgent Mail',
                    icon: <Clock size={16} />,
                    content: 'Urgent mail encompasses any form of correspondence or package that necessitates immediate or highly expedited delivery due to its critical or time-sensitive nature. This category extends beyond mere speed; it implies that delays in delivery could result in significant repercussions, such as legal complications, financial losses, or compromised operational integrity. Examples include legal documents with strict deadlines, medical samples requiring rapid analysis, or time-critical business contracts. The handling of urgent mail demands a heightened level of attention and prioritisation, often involving specialised delivery services or internal protocols to ensure swift and secure transit. This category of mail often bypasses standard mail processing, and is often given special handling, and tracking. The urgency of this mail is often dictated by the contents of the mail itself, and not necessarily the sender.',
                  },
                  {
                    title: 'Overnight Courier Services',
                    icon: <Send size={16} />,
                    content: 'Overnight courier services are specialised delivery solutions designed to guarantee the arrival of packages and documents by the next business day. These services leverage a sophisticated network of transportation, including air and ground logistics, to achieve rapid delivery times. They are typically employed for items that require immediate attention or are time-sensitive, such as legal documents, critical business materials, or medical supplies. A hallmark of these services is their emphasis on reliability and tracking, often providing real-time updates and proof of delivery. Furthermore, overnight courier services frequently offer insurance options for valuable items, providing an added layer of security and peace of mind. These services are often used by businesses that need to send important documents or packages, and need to know that they will arrive on time.',
                  },
                  {
                    title: 'Hand Delivery Services',
                    icon: <Hand size={16} />,
                    content: 'Hand delivery services involve the direct, person-to-person transfer of mail or packages, where a designated individual physically delivers the item to the intended recipient. This method is often reserved for highly confidential or sensitive materials that necessitate maximum security and personal assurance. Hand delivery minimises the risk of unauthorised access or loss by eliminating intermediaries and ensuring a direct chain of custody. This service is often used for delivery of legal paperwork, or very high value items. It is often used when a signature from a specific person is needed. The delivery person is often required to show identification, and the recipient is also required to show identification.',
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

            {/* SECTION 7: Policies and Procedures for Courier and Hand Delivery */}
            <div
              ref={(el) => {
                sectionRefs.current['courier-policies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Policies and Procedures for Courier and Hand Delivery
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Policies and procedures for courier and hand delivery services are essential for ensuring security, efficiency, and accountability. These policies should outline clear guidelines for selecting reputable courier services, handling sensitive materials, and documenting delivery processes. For courier services, organisations should establish criteria for evaluating providers, including their tracking capabilities, insurance options, and delivery timelines. Procedures should detail the process for preparing packages, completing necessary paperwork, and monitoring delivery progress. For hand delivery, policies should emphasise security protocols, such as verifying recipient identity, obtaining signatures, and maintaining a chain of custody. This may involve using sealed envelopes or tamper-evident packaging to protect sensitive materials. Training programs should be implemented to educate employees on these procedures, emphasising the importance of accuracy and confidentiality. Regular audits and reviews of these policies are crucial to ensure compliance and identify areas for improvement. This includes regular review of the selected courier services, to ensure that they are still meeting the needs of the organisation.
                </p>
              </div>
            </div>

            {/* SECTION 8: Maintaining Record of Urgent Mail and Courier Services */}
            <div
              ref={(el) => {
                sectionRefs.current['courier-records'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Maintaining Record of Urgent Mail and Courier Services
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Maintaining meticulous records of urgent mail and courier services is vital for tracking, accountability, and auditing purposes. Each urgent mail item or courier delivery should be assigned a unique tracking number or reference ID, which is then recorded in a dedicated log or tracking system. This system should capture essential details, including the date and time of dispatch, the courier service used, the recipient's name and address, and a comprehensive description of the delivered item. Real-time tracking updates should be diligently monitored and recorded, ensuring that the delivery progresses as expected. Obtaining and securely storing proof of delivery, such as recipient signatures or electronic confirmations, is paramount for verifying successful delivery. Cost and billing information related to courier services should be meticulously recorded for financial management and auditing purposes. Any incidents or issues arising during delivery, such as delays or damages, should be thoroughly documented and reported. Digital tracking systems are very useful for these records and offer the ability to search past deliveries.
                </p>
              </div>
            </div>

            {/* SECTION 9: Maintaining Record of Urgent Mail and Hand Delivery */}
            <div
              ref={(el) => {
                sectionRefs.current['hand-delivery-records'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Maintaining Record of Urgent Mail and Hand Delivery
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Maintaining a comprehensive record of urgent mail and hand delivery is paramount for ensuring security, accountability, and legal compliance. Given the sensitive nature of hand-delivered items, meticulous documentation is crucial. A dedicated log or tracking system should be implemented to record essential details, including the date and time of delivery, the names and identification details of the delivery person and recipient, and a detailed description of the delivered item. Proof of delivery, such as the recipient's signature and a copy of their identification, should be securely stored. Any incidents or issues arising during delivery, such as delays or discrepancies, should be thoroughly documented and reported. Maintaining a clear chain of custody is essential, especially for legal documents or high-value items. Digital tracking systems can be used to capture and store this information securely, providing an audit trail for future reference. This level of record-keeping helps to ensure that all hand-delivered items are accounted for, and that there is a clear record of the delivery.
                </p>
              </div>
            </div>

            {/* SECTION 10: Postal Services in Zimbabwe */}
            <div
              ref={(el) => {
                sectionRefs.current['postal-zimbabwe'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Postal Services in Zimbabwe
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Zimpost (Zimbabwe Posts (Private) Limited)',
                    icon: <Building size={16} />,
                    content: 'Zimpost is the primary postal service provider in Zimbabwe, offering a wide range of services including standard mail delivery, parcel services, financial services, and agency services. It operates a network of post offices across the country, aiming to connect even remote areas. Zimpost handles both domestic and international mail, facilitating communication and commerce within Zimbabwe and beyond. While facing challenges related to infrastructure and technological advancements, Zimpost continues to be a vital service provider, particularly for individuals and businesses that rely on traditional mail services. Zimpost also acts as an agent for many government services, allowing people in remote areas to access these services. They have been working to modernise their services and integrate more digital solutions.',
                  },
                  {
                    title: 'Private Courier Services',
                    icon: <Truck size={16} />,
                    content: 'In addition to Zimpost, several private courier companies operate in Zimbabwe, providing faster and more specialised delivery services. These companies often cater to businesses and individuals requiring expedited delivery of documents and packages, offering services like overnight delivery, international courier services, and specialised handling for sensitive items. These private couriers often have better tracking systems and offer a more reliable service for time sensitive items. They tend to operate mostly in the major cities and may not have a large reach into the rural areas. These companies compete with Zimpost, and often offer more modern services.',
                  },
                  {
                    title: 'International Courier Services',
                    icon: <GlobeIcon size={16} />,
                    content: 'Global courier companies like DHL, FedEx, and UPS also have a presence in Zimbabwe, facilitating international shipping and delivery. These services provide reliable and efficient international delivery solutions, catering to businesses and individuals engaged in international trade and communication. They offer a wide array of services, including express delivery, customs clearance, and tracking, enabling seamless international transactions. These services are vital for the import and export industry in Zimbabwe. These international services often partner with local companies, to help with the "last mile" delivery.',
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

            {/* SECTION 11: Dispatch Processes and Procedures of Ordinary Mail */}
            <div
              ref={(el) => {
                sectionRefs.current['ordinary-dispatch'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Dispatch Processes and Procedures of Ordinary Mail
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Mail Preparation and Verification',
                    icon: <FileText size={16} />,
                    content: 'Before dispatch, all mail items must be thoroughly prepared and verified. This includes ensuring that addresses are complete and accurate, that the correct postage is applied, and that the items are properly packaged. Any discrepancies or errors should be corrected before proceeding. For larger mailings, address verification software can be used, to ensure that the addresses are valid. This stage is vital, to prevent mail from being returned.',
                  },
                  {
                    title: '2. Mail Sorting and Classification',
                    icon: <FolderTree size={16} />,
                    content: 'Mail items are sorted and classified based on their destination and mail class. This allows for efficient routing and processing by the postal service. Items destined for the same location are grouped together, and different mail classes (e.g., standard, first-class) are separated. This process streamlines the handling of mail and ensures that it is delivered as quickly as possible.',
                  },
                  {
                    title: '3. Mail Logging and Recording',
                    icon: <ClipboardListIcon size={16} />,
                    content: 'All outgoing mail items are logged and recorded in a mail dispatch register. This register documents essential details, such as the recipient\'s name and address, the mail class, and any tracking numbers. This record-keeping provides an audit trail and allows for tracking and accountability. This is especially important for legal documents, or items that are of high value.',
                  },
                  {
                    title: '4. Mail Dispatch and Delivery',
                    icon: <Send size={16} />,
                    content: 'The prepared and logged mail items are then dispatched to the designated postal service or courier. This may involve dropping off the mail at a post office or scheduling a pickup. Once dispatched, the mail items are tracked and monitored to ensure timely delivery. This step includes ensuring that the mail is handed over to the correct postal worker, or courier.',
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

            {/* SECTION 12: Maintaining the Mail Dispatch Register */}
            <div
              ref={(el) => {
                sectionRefs.current['dispatch-register'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Maintaining the Mail Dispatch Register
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Accurate and Complete Records',
                    icon: <ClipboardListIcon size={16} />,
                    content: 'The mail dispatch register should contain accurate and complete records of all outgoing mail items. This includes the date and time of dispatch, the recipient\'s name and address, the mail class, and any tracking numbers. All entries should be legible and free from errors. This allows for easy tracking of mail and allows for the quick retrieval of information.',
                  },
                  {
                    title: 'Regular Updates and Audits',
                    icon: <RefreshCwIcon2 size={16} />,
                    content: 'The mail dispatch register should be updated regularly, with each outgoing mail item recorded promptly. Regular audits should be conducted to ensure accuracy and completeness. This helps to identify and correct any errors or discrepancies. Digital mail registers are often used, and allow for easy searching, and reporting.',
                  },
                  {
                    title: 'Secure Storage and Retention',
                    icon: <LockIcon size={16} />,
                    content: 'The mail dispatch register should be stored securely to protect sensitive information. The register should be retained for a specified period, in accordance with organisational policies and legal requirements. This helps to ensure that there is a record of all outgoing mail, for as long as it is required.',
                  },
                  {
                    title: 'Digital Integration',
                    icon: <Database size={16} />,
                    content: 'Where possible, the mail dispatch register should be integrated with digital systems, such as mail tracking software or electronic document management systems. This allows for streamlined record-keeping, automated reporting, and enhanced efficiency. Digital systems can also help prevent data loss and allow for remote access of the data.',
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

            {/* SECTION 13: Security and Access of Mail Including Mail in Electronic Form */}
            <div
              ref={(el) => {
                sectionRefs.current['security-access'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Security and Access of Mail Including Mail in Electronic Form
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Physical Mail Security',
                    icon: <LockIcon size={16} />,
                    content: 'Physical mail security involves implementing measures to protect mail items from unauthorised access, tampering, or theft. This includes securing mailrooms and storage areas with access controls, such as key card entry or security cameras. Sensitive mail, such as legal documents or financial records, should be handled by authorised personnel only and stored in locked cabinets or safes. Regular audits of physical mail handling procedures are essential to identify and mitigate potential security risks. This also involves training employees on the proper handling of sensitive mail and ensuring that they understand the importance of mail security.',
                  },
                  {
                    title: 'Electronic Mail Security',
                    icon: <Shield size={16} />,
                    content: 'Electronic mail security focuses on protecting email communications and data from cyber threats, such as phishing, malware, and data breaches. This involves implementing robust security measures, including strong passwords, multi-factor authentication, and encryption. Email filtering and anti-virus software are essential for detecting and blocking malicious emails. Regular security updates and employee training on email security best practices are crucial for preventing security incidents. Access controls should be implemented to restrict access to sensitive emails and data based on user roles and permissions. Digital signatures and email encryption are also important to ensure that emails are not tampered with.',
                  },
                  {
                    title: 'Access Control and Authorisation',
                    icon: <KeyIcon size={16} />,
                    content: 'Access control involves restricting access to mail, both physical and electronic, based on user roles and permissions. This ensures that only authorised individuals can access sensitive information. Role-based access control (RBAC) is a common approach, where permissions are assigned based on job roles. Regular reviews of access permissions are essential to ensure that users only have access to the information they need. This also includes implementing procedures for granting and revoking access permissions and ensuring that access logs are maintained and reviewed.',
                  },
                  {
                    title: 'Data Loss Prevention (DLP)',
                    icon: <ShieldAlert size={16} />,
                    content: 'Data loss prevention (DLP) involves implementing technologies and policies to prevent sensitive data from leaving the organisation\'s control. This includes monitoring and controlling the transmission of sensitive information via email, file transfers, and other communication channels. DLP tools can detect and block unauthorised data transfers, preventing data breaches and ensuring compliance with data protection regulations. This is especially important for organisations that handle sensitive customer data, or financial information.',
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

            {/* SECTION 14: Freeing Up Valuable Server Space */}
            <div
              ref={(el) => {
                sectionRefs.current['free-space'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Freeing Up Valuable Server Space
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Email Archiving and Retention',
                    icon: <Archive size={16} />,
                    content: 'Implementing email archiving and retention policies helps to manage email storage and prevent server overload. This involves moving older emails to a separate archive, which can be stored on less expensive storage media. Retention policies define how long emails should be stored, based on legal and regulatory requirements. Email archiving tools can automate this process, ensuring that emails are archived and retained according to policy. This helps to reduce the amount of data stored on the mail server and improves system performance.',
                  },
                  {
                    title: 'Attachment Management',
                    icon: <Paperclip size={16} />,
                    content: 'Email attachments can consume significant server space. Implementing attachment management policies helps to reduce storage requirements. This includes compressing large attachments, storing attachments in a separate document management system, or using cloud storage for attachments. Educating employees on attachment management best practices is also essential. This helps to prevent large files from being stored on the mail server.',
                  },
                  {
                    title: 'Email Deletion and Clean-up',
                    icon: <TrashIcon size={16} />,
                    content: 'Regularly deleting or cleaning up unnecessary emails helps to free up server space. This includes deleting spam, junk mail, and old emails that are no longer needed. Email clients and servers often provide tools for automating email deletion based on age or content. Educating employees on email clean-up best practices is also essential. This helps to prevent the mail server from becoming overloaded with unnecessary data.',
                  },
                  {
                    title: 'Storage Optimization',
                    icon: <SettingsIcon size={16} />,
                    content: 'Optimising email storage involves using efficient storage technologies and configurations. This includes using data compression, deduplication, and tiered storage to reduce storage requirements. Regularly reviewing and optimising storage configurations is essential to ensure that storage resources are used efficiently. Virtualisation and cloud storage solutions can also help to optimise email storage.',
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

            {/* SECTION 15: Roles and Responsibilities of a Content Manager */}
            <div
              ref={(el) => {
                sectionRefs.current['content-manager'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Roles and Responsibilities of a Content Manager
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Content Strategy Development',
                    icon: <Target size={16} />,
                    content: 'A content manager is responsible for developing and implementing a comprehensive content strategy that aligns with the organisation\'s goals and objectives. This involves conducting research, analysing audience needs, and defining content themes and formats. The content strategy should outline the types of content to be created, the platforms for distribution, and the metrics for measuring success. This also includes creating a content calendar and ensuring that content is created and distributed on a regular basis.',
                  },
                  {
                    title: 'Content Creation and Editing',
                    icon: <FileEditIcon size={16} />,
                    content: 'A content manager is responsible for creating and editing high-quality content that engages the target audience. This includes writing blog posts, articles, social media updates, and other forms of content. The content manager ensures that all content is accurate, consistent, and aligned with the organisation\'s brand and voice. This also includes ensuring that all content is free of errors, and that it is properly formatted.',
                  },
                  {
                    title: 'Content Distribution and Promotion',
                    icon: <ShareIcon size={16} />,
                    content: 'A content manager is responsible for distributing and promoting content across various platforms, including websites, social media, and email. This involves optimising content for search engines, using social media marketing techniques, and building relationships with influencers. The content manager tracks content performance and uses analytics to optimise distribution strategies. This also includes tracking the reach of the content and ensuring that it is reaching the target audience.',
                  },
                  {
                    title: 'Content Management System (CMS) Administration',
                    icon: <SettingsIcon size={16} />,
                    content: 'A content manager is responsible for managing and maintaining the organisation\'s CMS. This includes creating and updating content, managing user access, and ensuring that the CMS is functioning properly. The content manager also troubleshoots CMS issues and works with IT to resolve any technical problems. This also includes ensuring that the CMS is secure, and that all content is backed up.',
                  },
                  {
                    title: 'Content Analytics and Reporting',
                    icon: <BarChart size={16} />,
                    content: 'A content manager is responsible for tracking and analysing content performance using analytics tools. This involves monitoring website traffic, social media engagement, and other metrics. The content manager uses this data to generate reports and provide insights to stakeholders. This also includes using analytics to improve the content strategy, and to identify areas for improvement.',
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

            {/* SECTION 16: Legal and Regulatory Compliance in Managing Mail */}
            <div
              ref={(el) => {
                sectionRefs.current['legal-compliance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Legal and Regulatory Compliance in Managing Mail
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Data Privacy and Protection',
                    icon: <Shield size={16} />,
                    content: 'Organisations must comply with data privacy and protection laws, such as GDPR, HIPAA, and CCPA, when handling mail containing personal information. This includes implementing security measures to protect sensitive data, obtaining consent for data collection, and providing individuals with the right to access and delete their data. This also includes ensuring that all mail handling procedures follow these laws.',
                  },
                  {
                    title: 'Record Retention and Disposal',
                    icon: <Archive size={16} />,
                    content: 'Organisations must comply with record retention and disposal policies, which define how long mail items should be stored and when they should be destroyed. This includes adhering to legal requirements for retaining certain types of records, such as financial documents or legal correspondence. This also includes ensuring that all mail is disposed of in a secure manner, such as shredding confidential documents.',
                  },
                  {
                    title: 'Email Communication Regulations',
                    icon: <Mail size={16} />,
                    content: 'Organisations must comply with email communication regulations, such as CAN-SPAM and CASL, when sending commercial emails. This includes providing recipients with the option to unsubscribe, including accurate sender information, and avoiding deceptive subject lines. This also includes ensuring that all email communication is following these regulations.',
                  },
                  {
                    title: 'Legal Discovery and E-Discovery',
                    icon: <SearchIcon size={16} />,
                    content: 'Organisations must be prepared to comply with legal discovery and e-discovery requests, which may require them to produce email records and other electronic documents. This includes implementing email archiving and retention policies that ensure that relevant records are preserved and accessible. This also includes ensuring that all email records are properly indexed and searchable.',
                  },
                  {
                    title: 'Industry-Specific Regulations',
                    icon: <Building size={16} />,
                    content: 'Organisations in certain industries, such as healthcare or finance, must comply with industry-specific regulations that govern the handling of mail. This may include regulations related to the transmission of sensitive information, the storage of medical records, or the disclosure of financial data. This also includes ensuring that all mail handling procedures are following these industry-specific regulations.',
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
                  💡 Dispatch Insight
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
                  <span>Classification Criteria</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Postal Services</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Content Manager Roles</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Mail classification ensures efficient handling – categorise by urgency, confidentiality, class, recipient, sender, type, and legal status. Proper dispatch preparation, logging, and security are critical. Courier and hand delivery services require clear policies and meticulous records. Zimpost and private couriers serve Zimbabwe. Content managers oversee strategy, creation, distribution, and CMS administration. Compliance with data privacy, retention, and email laws is mandatory.
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
                <strong className="text-white">Mail Classification</strong> – Seven criteria: Urgency, Confidentiality, Mail Class, Recipient, Sender, Mail Type, Legal/Regulatory. Proper classification ensures efficient, secure, and compliant handling.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Dispatch Procedures</strong> – Verify addresses, package correctly, apply postage, log in outgoing register, and dispatch. Maintain accurate, secure, and auditable dispatch registers.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Delivery Services</strong> – Urgent mail, overnight courier, and hand delivery services offer varying speed and security. Policies and records for courier and hand delivery ensure accountability and chain of custody.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Postal Services in Zimbabwe</strong> – Zimpost (national), private couriers (faster, urban), and international couriers (global reach). Each serves different needs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Security, Content &amp; Compliance</strong> – Physical and electronic mail security, access control, and DLP. Content managers oversee strategy, creation, and CMS. Comply with data privacy, retention, email regulations, and industry‑specific laws.
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
            Sidemann Academic Registry • Records &amp; Information Management – Learning Outcome 3
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;
