import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  ListChecks,
  ReceiptText,
  Trash2,
  Shield,
  Target,
  CheckCircle,
  AlertCircle,
  ClipboardList,
  Layers,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
  Archive,
  Clock,
  FileText,
  Monitor,
  Recycle,
  RefreshCw,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'transmittal', label: 'Transmittal Lists' },
  { id: 'transfer-centre', label: 'Transfer to Centre' },
  { id: 'records-officer', label: 'Records Officer Process' },
  { id: 'packaging', label: 'Packaging Process' },
  { id: 'packaging-facilities', label: 'Packaging Facilities' },
  { id: 'ephemeral', label: 'Ephemeral Records' },
  { id: 'shredding', label: 'Shredding Process' },
  { id: 'destroy-methods', label: 'Destruction Methods' },
  { id: 'destroy-reasons', label: 'Reasons for Destruction' },
  { id: 'destroy-environment', label: 'Destruction Environment' },
  { id: 'transfer-archives', label: 'Transfer to Archives' },
  { id: 'retrieval', label: 'Retrieval for Destruction' },
  { id: 'destruction-types', label: 'Destruction Types' },
  { id: 'equipment', label: 'Equipment & Consumables' },
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
        text: 'Transmittal lists provide a critical audit trail for records transfer, ensuring accountability and preventing loss of valuable information.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use archival-quality boxes and materials when preparing records for transfer. This ensures long-term preservation and prevents damage.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the six steps in records transfer: Identification, Preparation, Transfer, Receipt, Storage, and Documentation.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations confuse disposal with destruction. Disposal includes transfer to archives or recycling, while destruction means irreversible elimination.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Transmittal lists provide a critical audit trail for records transfer, ensuring accountability and preventing loss of valuable information.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use archival-quality boxes and materials when preparing records for transfer. This ensures long-term preservation and prevents damage.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the six steps in records transfer: Identification, Preparation, Transfer, Receipt, Storage, and Documentation.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations confuse disposal with destruction. Disposal includes transfer to archives or recycling, while destruction means irreversible elimination.',
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
            <ListChecks size={14} className="inline mr-1" /> RECORDS MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Transmittal Lists, Transfer &amp;{' '}
            <span className="text-sky-300 font-bold italic">
              Records Destruction
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to transmittal lists, records transfer procedures, ephemeral records, shredding processes, destruction methods, equipment, and retrieval procedures.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ReceiptText size={14} className="inline mr-1" /> Transmittal
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Archive size={14} className="inline mr-1" /> Transfer
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Trash2 size={14} className="inline mr-1" /> Destruction
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
                placeholder="Search for a method, procedure, concept..."
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
            {/* SECTION 1: Introduction */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Introduction to Transmittal Lists, Transfer &amp; Destruction
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    This learning outcome covers the essential processes of records transfer and destruction. It includes transmittal lists for tracking records movement, procedures for transferring records to centres and archives, packaging requirements, ephemeral records management, shredding processes, destruction methods, and retrieval procedures. These processes ensure accountability, compliance, and efficient records management.
                  </p>
</div>
            </div>

            {/* SECTION 2: Transmittal Lists */}
            <div
              ref={(el) => {
                sectionRefs.current['transmittal'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Transmittal Lists
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Transmittal lists are documents that accompany the transfer of records or documents from one location or individual to another. They serve as a formal record of what is being transferred, ensuring accountability, and tracking throughout the process. They typically include details such as the sender, recipient, date of transfer, and a list of the items being transferred.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Ensuring Accountability and Chain of Custody',
                    icon: <Shield size={16} />,
                    content: 'Transmittal lists establish a clear chain of custody, documenting who sent what to whom and when. This is crucial for maintaining accountability and preventing disputes or discrepancies. Particularly important for sensitive or confidential records, where a clear audit trail is essential for demonstrating compliance with legal and regulatory requirements.',
                  },
                  {
                    title: 'Facilitating Accurate Tracking and Retrieval',
                    icon: <Target size={16} />,
                    content: 'Transmittal lists provide a detailed inventory of the records being transferred, making it easier to track and retrieve them. This is especially important for large or complex transfers, where multiple items are involved. By listing each item with its title, date range, or other identifying information, transmittal lists ensure that records can be accurately located and retrieved when needed.',
                  },
                  {
                    title: 'Providing Proof of Transfer and Receipt',
                    icon: <CheckCircle size={16} />,
                    content: 'Transmittal lists serve as proof of transfer and receipt, providing a documented record that records were sent and received. This is crucial for ensuring that all parties involved have a clear understanding of the transfer process and that there are no misunderstandings or disputes. By requiring the recipient to acknowledge receipt of the records, transmittal lists provide a formal confirmation that the transfer was completed successfully.',
                  },
                  {
                    title: 'Minimizing Errors and Discrepancies',
                    icon: <AlertCircle size={16} />,
                    content: 'Transmittal lists help minimize errors and discrepancies by providing a clear and detailed record of the records being transferred. This reduces the risk of lost or misplaced items, as well as errors in recording or documenting the transfer. By ensuring that all parties involved have a clear understanding of the records being transferred, transmittal lists help prevent misunderstandings and disputes.',
                  },
                  {
                    title: 'Supporting Auditing and Compliance',
                    icon: <ClipboardList size={16} />,
                    content: 'Transmittal lists are essential for supporting auditing and compliance activities. By providing a clear and detailed record of records transfers, transmittal lists facilitate accurate and efficient audits. This is crucial for demonstrating compliance with legal and regulatory requirements, as well as internal policies and procedures.',
                  },
                  {
                    title: 'Streamlining Records Management Processes',
                    icon: <Layers size={16} />,
                    content: 'Transmittal lists streamline records management processes by providing a standardized and efficient method for tracking and documenting records transfers. This reduces the time and resources spent on managing records, improving overall efficiency and productivity. By providing a clear and consistent format for recording transfer information, transmittal lists simplify records management.',
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

            {/* SECTION 3: Transfer of Records from Records to Records Centres */}
            <div
              ref={(el) => {
                sectionRefs.current['transfer-centre'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Transfer of Records from Records to Records Centres
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Identification and Scheduling',
                    icon: <Clock size={16} />,
                    content: 'Identifying records eligible for transfer and establishing a schedule. This involves assessing records inventories, applying retention schedules, and developing a transfer schedule considering storage capacity, volume, and deadlines.',
                  },
                  {
                    title: '2. Preparation of Records',
                    icon: <ClipboardList size={16} />,
                    content: 'Physical records are inspected, non-essential items removed, and boxed in archival-quality boxes with clear labels. Digital records are organised into logical folders with consistent naming conventions and metadata, and migrated to standardised formats.',
                  },
                  {
                    title: '3. Transfer and Transportation',
                    icon: <Archive size={16} />,
                    content: 'Physical records transported using trained personnel or reputable services with controlled environmental conditions. Digital records transferred using secure methods like encrypted file transfers. Chain of custody maintained throughout.',
                  },
                  {
                    title: '4. Receipt and Verification at the Records Centre',
                    icon: <CheckCircle size={16} />,
                    content: 'Records checked against transmittal list, condition inspected, and discrepancies documented. Receipt issued to the records office, and records entered into the records management system.',
                  },
                  {
                    title: '5. Storage and Access',
                    icon: <Archive size={16} />,
                    content: 'Records stored in a controlled environment with appropriate temperature and humidity. Access controlled with clear procedures for requesting and retrieving records. Retention periods monitored for disposal.',
                  },
                  {
                    title: '6. Documentation and Auditing',
                    icon: <FileText size={16} />,
                    content: 'Meticulous documentation maintained including transmittal list, receipt acknowledgment, and issues encountered. Audit trail maintained for all activities. Regular audits ensure compliance with procedures and legal requirements.',
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

            {/* SECTION 4: Process Carried Out by Records Officers After Receiving Filled Transmittal Lists */}
            <div
              ref={(el) => {
                sectionRefs.current['records-officer'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Process Carried Out by Records Officers After Receiving Filled Transmittal Lists
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Verification of Received Records',
                    icon: <CheckCircle size={16} />,
                    content: 'Meticulously comparing filled transmittal list from the records centre with the original copy. Checking that all listed records have been returned or transferred as indicated. Any discrepancies identified and documented.',
                  },
                  {
                    title: '2. Documentation of Receipt and Reconciliation',
                    icon: <FileText size={16} />,
                    content: 'Recording the date of receipt, condition of records, and observations. Filing the filled transmittal list as a permanent record. Reconciling inventory by updating records management system to reflect current location and status.',
                  },
                  {
                    title: '3. Notification and System Updates',
                    icon: <Monitor size={16} />,
                    content: 'Notifying relevant departments of records\' return or transfer. Updating records management system with changes in access permissions or retention schedules to ensure accuracy and accessibility.',
                  },
                  {
                    title: '4. Addressing Discrepancies',
                    icon: <AlertCircle size={16} />,
                    content: 'Taking immediate action to resolve discrepancies by contacting the records centre, investigating losses or damages, and reporting significant issues to supervisors. Detailed report prepared outlining discrepancies and actions taken.',
                  },
                  {
                    title: '5. Filing and Archiving Documentation',
                    icon: <Archive size={16} />,
                    content: 'Filing the filled transmittal list and supporting documentation according to established procedures. This serves as a permanent record of the transfer, providing an audit trail for future reference and compliance.',
                  },
                  {
                    title: '6. Reviewing and Improving Procedures',
                    icon: <RefreshCw size={16} />,
                    content: 'Reviewing transfer procedures to identify areas for improvement. Analysing efficiency, identifying bottlenecks, and recommending changes to streamline future transfers.',
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

            {/* SECTION 5: Process of Packaging Records in Records Office */}
            <div
              ref={(el) => {
                sectionRefs.current['packaging'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Process of Packaging Records in Records Office in Preparation for Transfer
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Sorting and Organizing Records',
                    icon: <ClipboardList size={16} />,
                    content: 'Reviewing records to ensure they are complete, accurate, and arranged according to their established filing system. Correcting or flagging out-of-order, misfiled, or incomplete records to maintain logical flow.',
                  },
                  {
                    title: '2. Removing Non-Archival Materials',
                    icon: <Trash2 size={16} />,
                    content: 'Removing paper clips, staples, rubber bands, and sticky notes that can cause damage over time. Metal fasteners corrode and damage paper; plastic materials can adhere under certain conditions.',
                  },
                  {
                    title: '3. Selecting Appropriate Boxes and Containers',
                    icon: <Archive size={16} />,
                    content: 'Using archival-quality, acid-free and lignin-free boxes to prevent deterioration. Sturdy boxes appropriately sized for the volume of records, avoiding overfilling or underfilling for efficient storage.',
                  },
                  {
                    title: '4. Packing Records Securely',
                    icon: <Layers size={16} />,
                    content: 'Filling boxes evenly, placing records flat and aligned. Using acid-free packing materials to fill gaps. Placing heavy records at the bottom. Using protective sleeves for sensitive records.',
                  },
                  {
                    title: '5. Labelling Boxes Clearly',
                    icon: <Target size={16} />,
                    content: 'Attaching clear labels with essential information: record series title, date range, box number, and access restrictions. Using a standardized labelling format matching the transmittal list.',
                  },
                  {
                    title: '6. Creating a Transmittal List',
                    icon: <ReceiptText size={16} />,
                    content: 'Preparing a detailed inventory of records being transferred, including box numbers, record series titles, date ranges, and special instructions. Copies retained by both records office and records centre.',
                  },
                  {
                    title: '7. Sealing and Securing Boxes',
                    icon: <CheckCircle size={16} />,
                    content: 'Securely sealing boxes with strong packing tape, preferably archival-quality. Sealing in a way that allows easy opening without damaging records.',
                  },
                  {
                    title: '8. Preparing for Transportation',
                    icon: <Clock size={16} />,
                    content: 'Placing boxes on pallets, wrapping in protective plastic, and arranging for secure transportation. Considering environmental conditions like temperature and humidity for sensitive records.',
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

            {/* SECTION 6: Required Packaging Facilities */}
            <div
              ref={(el) => {
                sectionRefs.current['packaging-facilities'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Required Packaging Facilities for Records
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Clean and Controlled Environment',
                    icon: <Shield size={16} />,
                    content: 'Packaging area should be clean, dry, free from dust, pests, and contaminants. Temperature controlled at 65-70°F (18-21°C) and relative humidity of 35-50% to prevent mold growth and paper embrittlement.',
                  },
                  {
                    title: '2. Acid-Free and Lignin-Free Materials',
                    icon: <Archive size={16} />,
                    content: 'All packaging materials in direct contact with records must be acid-free and lignin-free to prevent deterioration. Archival-quality boxes, folders, and interleaving paper meeting these standards.',
                  },
                  {
                    title: '3. Sturdy and Durable Boxes',
                    icon: <Layers size={16} />,
                    content: 'Sturdy and durable boxes constructed from high-quality materials that can support records without collapsing. Corrugated cardboard boxes that are acid-free and lignin-free, appropriately sized.',
                  },
                  {
                    title: '4. Appropriate Packing Materials and Inserts',
                    icon: <ClipboardList size={16} />,
                    content: 'Acid-free packing materials like crumpled paper, foam inserts, and archival-quality bubble wrap to fill empty spaces and support fragile records.',
                  },
                  {
                    title: '5. Labelling and Identification System',
                    icon: <Target size={16} />,
                    content: 'Acid-free labels with essential information matching transmittal list. Standardized labelling format with barcodes or RFID tags for automated tracking.',
                  },
                  {
                    title: '6. Sealing and Securing Equipment',
                    icon: <CheckCircle size={16} />,
                    content: 'Strong packing tape (archival-quality) for sealing boxes. Tools for cutting and applying tape readily available. Anti-static bags and hard drive cases for digital records.',
                  },
                  {
                    title: '7. Storage Space for Packaging Supplies',
                    icon: <Archive size={16} />,
                    content: 'Adequate, clean, dry, and organised storage space for packaging supplies. Dedicated storage area maintains an efficient packaging process and ensures materials are accessible.',
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

            {/* SECTION 7: Ephemeral Records */}
            <div
              ref={(el) => {
                sectionRefs.current['ephemeral'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Ephemeral Records
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Defining Ephemeral Records',
                    icon: <Clock size={16} />,
                    content: 'Ephemeral records are characterised by their short lifespan and temporary value. Created for immediate use, they are not intended to be permanent and lose relevance after a brief period. Examples include instant messages, temporary files, whiteboard notes, and social media stories.',
                  },
                  {
                    title: 'Role in Modern Communication',
                    icon: <Monitor size={16} />,
                    content: 'Facilitate quick and informal communication, enabling rapid exchange of information and ideas. Support real-time collaboration and spontaneous sharing, improving productivity and creativity while presenting challenges for information governance.',
                  },
                  {
                    title: 'Challenges in Managing',
                    icon: <AlertCircle size={16} />,
                    content: 'Traditional records management practices are not well-suited for ephemeral records. Spontaneous and informal nature makes them difficult to capture and control, leading to information gaps, compliance issues, and security risks.',
                  },
                  {
                    title: 'Legal and Compliance Considerations',
                    icon: <Shield size={16} />,
                    content: 'Despite their temporary nature, ephemeral records can be subject to discovery in legal proceedings or required for regulatory compliance. Organisations must be aware of retention requirements for different types of ephemeral records.',
                  },
                  {
                    title: 'Security and Privacy Risks',
                    icon: <Trash2 size={16} />,
                    content: 'Ephemeral records can pose significant security and privacy risks, especially when containing sensitive information. Temporary nature makes them difficult to track and control, increasing risk of unauthorised access or disclosure.',
                  },
                  {
                    title: 'Best Practices for Managing',
                    icon: <ListChecks size={16} />,
                    content: 'Establish clear policies and guidelines for ephemeral communication tools. Implement secure communication platforms and automated tools to manage temporary records. Provide training on proper handling and compliance with legal requirements.',
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

            {/* SECTION 8: Shredding Process */}
            <div
              ref={(el) => {
                sectionRefs.current['shredding'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Shredding Process
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Collection and Preparation',
                    icon: <ClipboardList size={16} />,
                    content: 'Documents designated for destruction are collected and segregated from general waste. Placed in designated shredding bins or containers. Non-paper items like binder clips, staples, and plastic sleeves are removed to prevent equipment damage.',
                  },
                  {
                    title: '2. Feeding Documents into the Shredder',
                    icon: <Layers size={16} />,
                    content: 'Prepared documents are fed into the shredding machine, either manually by an operator or automatically via conveyor belt. Proper feeding techniques prevent jams and ensure complete destruction.',
                  },
                  {
                    title: '3. Shredding Mechanism and Cut Types',
                    icon: <Trash2 size={16} />,
                    content: 'Rotating blades or cutting cylinders slice paper into small pieces. Strip-cut produces long narrow strips; cross-cut produces small rectangular pieces; micro-cut produces tiny confetti-like particles for highest security.',
                  },
                  {
                    title: '4. Collection and Disposal of Shredded Material',
                    icon: <Archive size={16} />,
                    content: 'Shredded material collected in bins or bags and transported to recycling facility or secure disposal site. Recycling common for non-confidential material, incineration for highly sensitive material.',
                  },
                  {
                    title: '5. Maintenance and Cleaning',
                    icon: <RefreshCw size={16} />,
                    content: 'Regular cleaning of blades to remove paper dust and debris, lubrication of moving parts, and inspection for wear or damage. Prevents jams, reduces breakdown risk, and extends shredder lifespan.',
                  },
                  {
                    title: '6. Security and Compliance Considerations',
                    icon: <Shield size={16} />,
                    content: 'Compliance with privacy regulations like GDPR and HIPAA requiring secure disposal. Implementing secure shredding procedures, training employees, maintaining records, and using certified shredding services with certificates of destruction.',
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

            {/* SECTION 9: Methods of Destroying Ephemeral Records */}
            <div
              ref={(el) => {
                sectionRefs.current['destroy-methods'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Methods of Destroying Ephemeral Records
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Secure Deletion and Overwriting',
                    icon: <Monitor size={16} />,
                    content: 'Simple deletion leaves recoverable data remnants. Secure deletion involves overwriting data multiple times with random characters using specialised software. Suitable for hard drives, SSDs, and other storage devices.',
                  },
                  {
                    title: '2. Data Wiping for Storage Devices',
                    icon: <Trash2 size={16} />,
                    content: 'Comprehensive method erasing all data from a storage device, including OS files and applications. Overwrites all sectors with random data. Suitable for hard drives, SSDs, USB drives, and other media being repurposed or disposed of.',
                  },
                  {
                    title: '3. Degaussing for Magnetic Media',
                    icon: <Monitor size={16} />,
                    content: 'Exposing magnetic storage media (hard drives, magnetic tapes) to a powerful magnetic field that disrupts magnetic domains storing data. Renders media unusable and data unrecoverable. Not suitable for SSDs or non-magnetic devices.',
                  },
                  {
                    title: '4. Physical Destruction of Storage Devices',
                    icon: <Trash2 size={16} />,
                    content: 'Complete destruction of storage devices through shredding, crushing, drilling, or other physical means. Most secure method for hard drives, SSDs, USB drives, and mobile devices. Ensures data completely and irreversibly destroyed.',
                  },
                  {
                    title: '5. Secure Deletion of Cloud-Based Records',
                    icon: <Monitor size={16} />,
                    content: 'Configuring built-in features for deleting or expiring ephemeral data in cloud services. Ensuring data completely removed from servers, reviewing data retention policies, and implementing encryption or secure deletion protocols.',
                  },
                  {
                    title: '6. Automated Deletion and Expiration Policies',
                    icon: <Clock size={16} />,
                    content: 'Automatically destroying ephemeral records after a specified period using application or cloud service features. Configuring settings according to data retention policies and legal requirements to maintain compliance and reduce manual burden.',
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

            {/* SECTION 10: Reasons for Records Destruction */}
            <div
              ref={(el) => {
                sectionRefs.current['destroy-reasons'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Reasons for Records Destruction
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Legal and Regulatory Compliance',
                    icon: <Shield size={16} />,
                    content: 'Laws mandate specific retention periods. Once expired, organisations are legally obligated to destroy records to avoid penalties and liabilities. Financial records, tax records, and medical records have specific retention requirements.',
                  },
                  {
                    title: '2. Risk Mitigation and Data Security',
                    icon: <Trash2 size={16} />,
                    content: 'Sensitive records pose security risks if compromised. Destroying unnecessary records minimises risk of data breaches, identity theft, and reputational damage. Secure destruction methods ensure permanent destruction.',
                  },
                  {
                    title: '3. Cost Reduction and Storage Optimization',
                    icon: <Archive size={16} />,
                    content: 'Storing records incurs significant costs. Destroying unnecessary records frees up storage space and reduces costs, allowing allocation of resources more efficiently to core business activities.',
                  },
                  {
                    title: '4. Enhanced Operational Efficiency',
                    icon: <ListChecks size={16} />,
                    content: 'Excessive records hinder efficiency. Destroying outdated or irrelevant records streamlines access to essential information, improving productivity, reducing errors, and enhancing decision-making.',
                  },
                  {
                    title: '5. Environmental Responsibility',
                    icon: <Recycle size={16} />,
                    content: 'Responsible destruction contributes to sustainability. Recycling paper records after shredding and disposing of electronic waste in environmentally friendly manner demonstrates corporate social responsibility.',
                  },
                  {
                    title: '6. Preventing Information Overload',
                    icon: <AlertCircle size={16} />,
                    content: 'Destroying unnecessary records prevents accumulation of excessive information, making it easier to manage and process data. Allows employees to focus on essential information and avoid being overwhelmed.',
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

            {/* SECTION 11: Environment Recommended for Destruction */}
            <div
              ref={(el) => {
                sectionRefs.current['destroy-environment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Environment Recommended for the Destruction of Ephemeral Records
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Secure and Controlled Physical Space',
                    icon: <Shield size={16} />,
                    content: 'Physical space should be secure and controlled, limiting access to authorised personnel. Separate from general office areas with access control systems, surveillance cameras, and locked doors.',
                  },
                  {
                    title: '2. Controlled Digital Environment',
                    icon: <Monitor size={16} />,
                    content: 'Secure networks, encrypted data storage, and access controls. Data wiping and degaussing performed on dedicated systems isolated from general network. Access strictly controlled and logged.',
                  },
                  {
                    title: '3. Compliance with Legal Requirements',
                    icon: <FileText size={16} />,
                    content: 'Destruction process must comply with data privacy laws like GDPR, CCPA, and HIPAA. Clear policies and procedures with documented steps. Regular audits and legal counsel consultation to ensure compliance.',
                  },
                  {
                    title: '4. Certified and Audited Destruction Methods',
                    icon: <CheckCircle size={16} />,
                    content: 'Equipment and software certified by independent organisations to meet security standards. Regular audits of destruction process to ensure it is being conducted correctly and completely.',
                  },
                  {
                    title: '5. Trained and Authorized Personnel',
                    icon: <ClipboardList size={16} />,
                    content: 'Only trained and authorised personnel should handle destruction. Training on proper handling, use of equipment, and policies. Background checks and security clearances for highly sensitive records.',
                  },
                  {
                    title: '6. Environmental Considerations',
                    icon: <Recycle size={16} />,
                    content: 'Destruction should be environmentally responsible. Recycling paper records after shredding and disposing of electronic waste according to environmental regulations. Using environmentally friendly destruction methods.',
                  },
                  {
                    title: '7. Documentation and Audit Trail',
                    icon: <FileText size={16} />,
                    content: 'All destruction activities thoroughly documented with detailed audit trail. Recording types destroyed, methods used, dates, and personnel involved. Essential for demonstrating compliance and accountability.',
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

            {/* SECTION 12: Procedures in Transferring Records to the Archives */}
            <div
              ref={(el) => {
                sectionRefs.current['transfer-archives'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procedures in Transferring Records to the Archives
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Appraisal and Selection',
                    icon: <Target size={16} />,
                    content: 'Evaluating records to determine archival value. Assessing uniqueness, significance, authenticity, and research potential. Prioritising records documenting key decisions, significant events, or long-term policy changes.',
                  },
                  {
                    title: '2. Creating a Transfer Agreement and Schedule',
                    icon: <FileText size={16} />,
                    content: 'Formal agreement outlining responsibilities of records centre and archives. Specifying scope, required documentation, and handling instructions. Schedule coordinating timing and frequency of transfers.',
                  },
                  {
                    title: '3. Preparation of Records',
                    icon: <ClipboardList size={16} />,
                    content: 'Review and organisation, removing non-archival materials. Cleaning, deacidification, and rehousing for paper records. Migrating digital records to stable formats with metadata. Ensuring optimal condition for long-term preservation.',
                  },
                  {
                    title: '4. Creating a Transfer List and Documentation',
                    icon: <ReceiptText size={16} />,
                    content: 'Detailed list itemising records with titles, date ranges, and box numbers. Including provenance, access restrictions, and preservation notes. Ensuring archives have comprehensive understanding of records\' context.',
                  },
                  {
                    title: '5. Packaging and Transportation',
                    icon: <Archive size={16} />,
                    content: 'Archival-quality boxes and containers, appropriately sized and labelled. Secure digital transfer methods. Handling by trained personnel with controlled environmental conditions to protect records.',
                  },
                  {
                    title: '6. Receiving and Verification',
                    icon: <CheckCircle size={16} />,
                    content: 'Checking records against transfer list, assessing condition, and documenting discrepancies. Issuing receipt to transferring office. Establishing clear chain of custody.',
                  },
                  {
                    title: '7. Updating Archival Management Systems',
                    icon: <Monitor size={16} />,
                    content: 'Updating records inventory, access permissions, and preservation notes. Creating or updating finding aids and descriptive tools for efficient retrieval and management.',
                  },
                  {
                    title: '8. Implementing Access and Preservation Procedures',
                    icon: <Shield size={16} />,
                    content: 'Clear procedures for requesting and retrieving records. Handling access restrictions and confidentiality. Preservation measures including environmental controls, pest management, and disaster preparedness.',
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

            {/* SECTION 13: Steps in Retrieving Records for Destruction */}
            <div
              ref={(el) => {
                sectionRefs.current['retrieval'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Steps in Retrieving Records for Destruction
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Identification of Records Due for Destruction',
                    icon: <Target size={16} />,
                    content: 'Identifying records that have reached the end of their retention period using records retention schedules. Generating reports from records management systems to list records due for destruction.',
                  },
                  {
                    title: '2. Authorization for Destruction',
                    icon: <Shield size={16} />,
                    content: 'Obtaining proper authorisation from designated personnel or departments like legal, compliance, or records management. Ensuring destruction complies with policies and legal requirements. Documenting authorisation for audit trail.',
                  },
                  {
                    title: '3. Preparation of a Retrieval List',
                    icon: <ReceiptText size={16} />,
                    content: 'Creating a detailed retrieval list with identification numbers, descriptions, locations, and other relevant information. Serving as a guide for retrieval and ensuring all designated items are accounted for.',
                  },
                  {
                    title: '4. Retrieval of Records',
                    icon: <Archive size={16} />,
                    content: 'Physically locating and gathering records listed on the retrieval list. Accessing storage areas, retrieving boxes, or pulling files from shelves for physical records. Accessing servers, databases, or cloud storage for digital records.',
                  },
                  {
                    title: '5. Verification and Confirmation',
                    icon: <CheckCircle size={16} />,
                    content: 'Verifying retrieved records against the retrieval list to ensure all items are retrieved. Checking identification numbers, descriptions, and quantities. Documenting and investigating any discrepancies.',
                  },
                  {
                    title: '6. Secure Transportation (if applicable)',
                    icon: <Clock size={16} />,
                    content: 'Using secure transportation methods like locked vehicles or secure data transfer protocols. Protecting records from unauthorised access or damage during transit. Maintaining chain-of-custody documentation.',
                  },
                  {
                    title: '7. Destruction Process',
                    icon: <Trash2 size={16} />,
                    content: 'Carrying out destruction using appropriate methods. Shredding, burning, or pulping for physical records. Secure deletion, data wiping, or physical destruction for digital records. Conducting in accordance with policies and legal requirements.',
                  },
                  {
                    title: '8. Documentation and Audit Trail',
                    icon: <FileText size={16} />,
                    content: 'Maintaining detailed documentation including retrieval list, authorisation records, destruction certificates, and other information. Serving as audit trail demonstrating compliance with procedures and legal requirements.',
                  },
                  {
                    title: '9. Post-Destruction Verification',
                    icon: <CheckCircle size={16} />,
                    content: 'Conducting final verification to ensure all records destroyed and no remaining items. Inspecting destruction equipment or reviewing destruction logs. Documenting and reporting any discrepancies.',
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

            {/* SECTION 14: Destruction Methods */}
            <div
              ref={(el) => {
                sectionRefs.current['destruction-types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Destruction Methods
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Shredding (Physical Paper)',
                    icon: <Trash2 size={16} />,
                    content: 'Mechanically cutting paper into unreadable pieces. Strip-cut produces long narrow strips; cross-cut produces small confetti-like pieces; micro-cut produces tiny particles for highest security.',
                  },
                  {
                    title: '2. Burning/Incineration',
                    icon: <Trash2 size={16} />,
                    content: 'Complete destruction through combustion. Used for highly sensitive documents requiring utmost security. Must comply with environmental regulations to minimise pollution.',
                  },
                  {
                    title: '3. Pulping (Physical Paper)',
                    icon: <Archive size={16} />,
                    content: 'Breaking down paper into fibrous pulp by mixing with water and chemicals. Highly effective for large volumes, environmentally friendly as pulp can be recycled into new paper products.',
                  },
                  {
                    title: '4. Secure Deletion and Overwriting (Digital)',
                    icon: <Monitor size={16} />,
                    content: 'Overwriting data multiple times with random characters using specialised software. Suitable for hard drives, SSDs, and other storage devices. Ensures data completely erased and irrecoverable.',
                  },
                  {
                    title: '5. Data Wiping (Digital Storage)',
                    icon: <Monitor size={16} />,
                    content: 'Comprehensive erasure of all data from storage device including OS files. Overwriting all sectors with random data. Suitable for hard drives, SSDs, USB drives, and other media.',
                  },
                  {
                    title: '6. Degaussing (Magnetic Media)',
                    icon: <Monitor size={16} />,
                    content: 'Using powerful magnetic field to disrupt magnetic domains on hard drives and magnetic tapes. Renders media unusable and data unrecoverable. Not suitable for SSDs or non-magnetic devices.',
                  },
                  {
                    title: '7. Physical Destruction (Digital Storage)',
                    icon: <Trash2 size={16} />,
                    content: 'Complete destruction of storage devices through shredding, crushing, drilling, or other physical means. Most secure method for hard drives, SSDs, USB drives, and mobile devices.',
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

            {/* SECTION 15: Equipment and Consumables Required */}
            <div
              ref={(el) => {
                sectionRefs.current['equipment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Equipment and Consumables Required
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Archival-Quality Boxes and Containers',
                    icon: <Archive size={16} />,
                    content: 'Acid-free and lignin-free containers preventing deterioration. Sturdy and durable, capable of withstanding weight and transportation. Standardised sizes for efficient stacking and storage.',
                  },
                  {
                    title: '2. Acid-Free Folders and Interleaving Paper',
                    icon: <ClipboardList size={16} />,
                    content: 'Protecting individual records within boxes. Preventing transfer of acids and harmful substances. Appropriately sized folders and interleaving paper for sensitive or fragile records.',
                  },
                  {
                    title: '3. Labelling and Identification Supplies',
                    icon: <Target size={16} />,
                    content: 'Acid-free labels, markers, and barcode scanners. Durable and resistant to fading. Standardised labelling format for consistency and accurate tracking.',
                  },
                  {
                    title: '4. Packing and Sealing Materials',
                    icon: <Layers size={16} />,
                    content: 'Acid-free packing paper, foam inserts, and bubble wrap. Strong packing tape for sealing boxes. Tools for cutting and applying tape.',
                  },
                  {
                    title: '5. Shredding Equipment',
                    icon: <Trash2 size={16} />,
                    content: 'Strip-cut, cross-cut, or micro-cut shredders depending on security needs. Micro-cut recommended for highly sensitive documents. Choice depends on volume and required security level.',
                  },
                  {
                    title: '6. Data Wiping and Degaussing Equipment',
                    icon: <Monitor size={16} />,
                    content: 'Data wiping software overwriting data multiple times. Degaussing equipment for magnetic media. Certified and compliant software and hardware for effectiveness.',
                  },
                  {
                    title: '7. Physical Destruction Tools',
                    icon: <Trash2 size={16} />,
                    content: 'Shredders, crushers, and drilling equipment for digital storage devices. Ensures complete and irreversible destruction of hard drives, SSDs, and USB drives.',
                  },
                  {
                    title: '8. Environmental Control Equipment',
                    icon: <Monitor size={16} />,
                    content: 'Temperature and humidity monitors, dehumidifiers, and air purifiers. Maintaining optimal storage conditions to prevent deterioration and mold growth.',
                  },
                  {
                    title: '9. Personal Protective Equipment (PPE)',
                    icon: <Shield size={16} />,
                    content: 'Gloves, masks, and eye protection for personnel handling records. Protecting against cuts, contaminants, dust, and debris during handling and destruction processes.',
                  },
                  {
                    title: '10. Documentation and Tracking Systems',
                    icon: <FileText size={16} />,
                    content: 'Inventory management software, barcode scanners, and document management systems. Tracking location and status of records, documenting all records management activities.',
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
                  <span>Transfer Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Destruction Methods</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Equipment Categories</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Transmittal lists ensure accountability, tracking, and proof of transfer. Transfer procedures include identification, preparation, transportation, receipt, storage, and documentation. Records officers verify, document, update systems, and address discrepancies after receiving transmittal lists. Packaging requires sorting, removing non-archival materials, appropriate boxes, secure packing, labelling, transmittal lists, sealing, and transportation preparation. Facilities must be clean with acid-free materials, sturdy boxes, packing supplies, labelling systems, sealing equipment, and storage space. Ephemeral records are temporary but require careful management. Shredding involves collection, feeding, cutting, disposal, and maintenance. Destruction methods include shredding, burning, pulping, secure deletion, data wiping, degaussing, and physical destruction. Destruction reasons: legal compliance, risk mitigation, cost reduction, efficiency, environmental responsibility, and preventing information overload. Proper environment and equipment are essential for secure records management.
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
                <strong className="text-white">Transmittal Lists</strong> – Essential for accountability, chain of custody, tracking, proof of transfer, error minimisation, auditing, and streamlining records management processes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Transfer Procedures</strong> – Six key steps: Identification and Scheduling, Preparation, Transfer/Transportation, Receipt/Verification, Storage/Access, and Documentation/Auditing.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Records Officer Process</strong> – Verification, documentation, notification, discrepancy resolution, filing, and procedure review after receiving filled transmittal lists.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Packaging &amp; Facilities</strong> – Sorting, removing non-archival materials, selecting appropriate boxes, secure packing, labelling, transmittal lists, sealing, and transportation preparation. Facilities require clean environments, acid-free materials, sturdy boxes, and proper equipment.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Destruction Methods &amp; Reasons</strong> – Methods include shredding, burning, pulping, secure deletion, data wiping, degaussing, and physical destruction. Reasons include legal compliance, risk mitigation, cost reduction, efficiency, environmental responsibility, and preventing information overload.
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
            Sidemann Academic Registry • Records Transfer &amp; Destruction Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;