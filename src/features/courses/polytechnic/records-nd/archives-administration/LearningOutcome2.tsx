import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FileText,
  Archive,
  Trash2,
  Target,
  ClipboardList,
  Shield,
  BookOpen,
  Monitor,
  Calendar,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen as BookOpenIcon,
  Clock,
  Hash,
  CheckCircle,
  RefreshCw,
  FolderTree,
  Handshake,
  DollarSign,
  Package,
  Copy,
  User,
  Layers,
  Building,
  Globe,
  AlertCircle,
  ListChecks,
  Layout,
  Lock,
  Tag,
  Share2,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'accessioning-system', label: 'Accessioning System' },
  { id: 'goals', label: 'Goals' },
  { id: 'legal-physical-intellectual', label: 'Legal/Physical/Intellectual' },
  { id: 'pre-accessioning', label: 'Pre‑Accessioning' },
  { id: 'receipt-procedures', label: 'Upon Receipt' },
  { id: 'processing', label: 'Processing' },
  { id: 'storing-confidential', label: 'Storing Confidential' },
  { id: 'accession-form', label: 'Accession Form' },
  { id: 'register-example', label: 'Register Example' },
  { id: 'group-series-register', label: 'Group & Series Register' },
  { id: 'foundation-access', label: 'Foundation of Access' },
  { id: 'importance-arranging', label: 'Importance of Arranging' },
  { id: 'principles-arrangement', label: 'Principles' },
  { id: 'levels-arrangement', label: 'Levels' },
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
        text: 'The accession number is the permanent identifier for a collection. It typically combines the year of acquisition and a sequential number, e.g., 2023‑001.',
      },
      {
        title: 'Pro Tip',
        text: 'Always create a detailed accession record as soon as materials arrive; capturing donor information, condition, and initial inventory immediately prevents data loss.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three pillars of control: "L‑P‑I" – Legal, Physical, Intellectual. Each is essential for managing archives effectively.',
      },
      {
        title: 'Common Mistake',
        text: 'Many archives skip the preliminary appraisal and condition assessment, only to discover later that materials are too fragile or out of scope for their collecting policy.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The accession number is the permanent identifier for a collection. It typically combines the year of acquisition and a sequential number, e.g., 2023‑001.',
      },
      {
        title: 'Pro Tip',
        text: 'Always create a detailed accession record as soon as materials arrive; capturing donor information, condition, and initial inventory immediately prevents data loss.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three pillars of control: "L‑P‑I" – Legal, Physical, Intellectual. Each is essential for managing archives effectively.',
      },
      {
        title: 'Common Mistake',
        text: 'Many archives skip the preliminary appraisal and condition assessment, only to discover later that materials are too fragile or out of scope for their collecting policy.',
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
            <FolderTree size={14} className="inline mr-1" /> ARCHIVES ADMINISTRATION
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Accessioning Systems —{' '}
            <span className="text-sky-300 font-bold italic">
              &amp; Archival Control
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to accessioning, legal/physical/intellectual control,
            pre‑accessioning, processing, storage, and arrangement principles.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ClipboardList size={14} className="inline mr-1" /> Accessioning
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Control
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Layout size={14} className="inline mr-1" /> Arrangement
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
                placeholder="Search for a concept, process, control type..."
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
            {/* SECTION 1: The Accessioning System */}
            <div
              ref={(el) => {
                sectionRefs.current['accessioning-system'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Accessioning System in Archival Management
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Accessioning is the foundational process in archival management that establishes
                    physical and intellectual control over newly acquired materials. It's the first step
                    in making records accessible and ensuring their preservation. The accessioning system
                    provides a structured framework for documenting the transfer of records, assigning
                    unique identifiers, and creating a basic inventory.
                  </p>
</div>

              {renderCard(
                'Core Components of an Accessioning System',
                <ListChecks size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Accession Record:</strong> At the heart of the accessioning system is the
                    creation of an accession record. This record serves as the initial point of entry for
                    all information about the acquired materials. It typically includes details such as the
                    accession number, donor or source of the records, date of transfer, a brief description
                    of the materials, any legal or administrative restrictions, and the physical extent of
                    the collection. This documentation establishes a clear chain of custody and provides
                    essential information for future processing and retrieval.
                  </li>
                  <li>
                    <strong>Unique Accession Number:</strong> A critical element of accessioning is the
                    assignment of a unique accession number. This number acts as a permanent identifier for
                    the acquired materials, linking them to the accession record and facilitating their
                    tracking throughout the archival process. The accession number is typically a sequential
                    number assigned to each acquisition, often combined with the year of acquisition. This
                    ensures that each accession is uniquely identified and that its history can be easily
                    traced.
                  </li>
                  <li>
                    <strong>Preliminary Inventory:</strong> The creation of a preliminary inventory is another
                    key component of accessioning. This inventory provides a basic overview of the contents of
                    the acquired materials, including the types of records, their dates, and their physical
                    extent. This inventory serves as a finding aid for researchers and staff, providing a
                    general understanding of the collection's contents. It also aids in planning for further
                    processing and arrangement.
                  </li>
                  <li>
                    <strong>Physical Handling and Storage:</strong> Accessioning also involves the physical
                    handling and initial storage of the acquired materials. This includes checking the materials
                    for any obvious damage or deterioration, providing temporary storage in appropriate
                    containers, and ensuring that the materials are stored in a secure and controlled
                    environment. This initial handling is crucial for preventing further damage and ensuring
                    the preservation of the records.
                  </li>
                  <li>
                    <strong>Administrative Records:</strong> Finally, the accessioning system includes the
                    creation of necessary administrative records. These records document the transfer of
                    ownership, any legal agreements, and any restrictions on access or use. This ensures that
                    the archive has a complete record of the acquisition process and that all legal and ethical
                    obligations are met.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 2: Goals of Accessioning */}
            <div
              ref={(el) => {
                sectionRefs.current['goals'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Goals of Accessioning
              </h2>

              {renderCard(
                'Goals',
                <Target size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Establishing Physical and Intellectual Control:</strong> Accessioning establishes
                    physical control by ensuring that the archive has a clear record of all acquired materials
                    and their location. It establishes intellectual control by creating an initial inventory and
                    assigning unique identifiers, making the materials accessible to researchers and staff.
                  </li>
                  <li>
                    <strong>Documenting the Acquisition Process:</strong> Accessioning documents the transfer of
                    records from the donor or source to the archive, providing a clear audit trail. This ensures
                    accountability and transparency in the acquisition process.
                  </li>
                  <li>
                    <strong>Preserving the Integrity of Records:</strong> Accessioning ensures that the acquired
                    materials are handled and stored properly, preventing damage and deterioration. This helps to
                    preserve the integrity of the records and ensure their long‑term accessibility.
                  </li>
                  <li>
                    <strong>Facilitating Future Processing and Arrangement:</strong> Accessioning provides the
                    foundation for future processing and arrangement of the acquired materials. The information
                    gathered during accessioning informs decisions about how the records will be organized,
                    described, and made accessible to researchers.
                  </li>
                  <li>
                    <strong>Providing Initial Access:</strong> Even in its most basic form, the accessioning
                    record, and basic inventory provide researchers and staff with initial information about the
                    newly acquired collection. This allows for early research and the ability for staff to begin
                    planning the processing of the new materials.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 3: Legal, Physical, and Intellectual Control */}
            <div
              ref={(el) => {
                sectionRefs.current['legal-physical-intellectual'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Legal, Physical, and Intellectual Control in Archival Management
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In archival management, establishing control over acquired materials is paramount. This
                    control manifests in three distinct but interconnected forms: legal, physical, and
                    intellectual. Each plays a critical role in ensuring the preservation, accessibility, and
                    integrity of archival records.
                  </p>
</div>

              {renderCard(
                'Forms of Control',
                <Shield size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Legal Control:</strong> Legal control refers to the archive's established ownership
                    and authority over the acquired materials. This is typically achieved through formal
                    agreements such as deeds of gift, purchase agreements, or legal deposit arrangements. Legal
                    control ensures that the archive has the right to preserve, manage, and provide access to
                    the records. It also addresses issues of copyright, intellectual property rights, and any
                    restrictions imposed by the donor or legal mandate.
                  </li>
                  <li>
                    <strong>Physical Control:</strong> Physical control encompasses the archive's ability to
                    locate, handle, and protect the acquired materials. This involves implementing measures to
                    ensure the security and preservation of the records, including proper storage conditions,
                    environmental controls, and security systems. Physical control also includes the ability to
                    track the movement and location of records within the archive, ensuring that they are not
                    lost or misplaced.
                  </li>
                  <li>
                    <strong>Intellectual Control:</strong> Intellectual control refers to the archive's ability
                    to understand, describe, and provide access to the informational content of the acquired
                    materials. This involves creating finding aids, indexes, and other descriptive tools that
                    enable researchers to locate and retrieve relevant records. Intellectual control also
                    includes the ability to contextualize the records, providing information about their
                    creators, provenance, and historical significance.
                  </li>
                </ul>
              )}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  These three forms of control are interdependent. Legal control provides the foundation for
                  physical and intellectual control, while physical and intellectual control ensure that the
                  archive can fulfill its legal obligations and provide access to its collections. Together,
                  they form a comprehensive framework for managing and preserving archival materials.
                </p>
              </div>
            </div>

            {/* SECTION 4: Procedures Done Before Accessioning */}
            <div
              ref={(el) => {
                sectionRefs.current['pre-accessioning'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procedures Done Before Accessioning Archival Material
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Before formally accessioning archival material, a series of crucial procedures are
                    undertaken to ensure that the acquisition is appropriate, legal, and manageable. These
                    pre‑accessioning procedures lay the groundwork for a smooth and effective integration of
                    the new collection into the archive's holdings.
                  </p>
</div>

              {renderCard(
                'Pre‑Accessioning Steps',
                <ClipboardList size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Initial Contact and Appraisal:</strong> The process typically begins with an initial
                    contact from a potential donor, or the archive identifying potential materials. This might
                    be a phone call, email, or a site visit. Following this initial contact, a preliminary
                    appraisal is conducted. This involves a basic evaluation of the materials to determine their
                    potential value and suitability for the archive's collection. The appraiser assesses factors
                    such as the materials' historical significance, evidential value, and physical condition.
                    This stage helps to determine if the materials warrant further consideration.
                  </li>
                  <li>
                    <strong>Negotiation and Agreement:</strong> If the preliminary appraisal is positive,
                    negotiations with the donor or source begin. This involves discussing the terms of the
                    transfer, including ownership, access restrictions, copyright, and any other relevant
                    conditions. A formal agreement, such as a deed of gift or purchase agreement, is drafted and
                    reviewed by both parties. This legal document outlines the responsibilities of both the
                    donor and the archive, ensuring a clear understanding of the transfer. This step is vital to
                    establish legal control.
                  </li>
                  <li>
                    <strong>Preliminary Inventory and Description:</strong> Before physical transfer, a
                    preliminary inventory and description of the materials is created. This provides a general
                    overview of the collection's contents, including the types of records, their dates, and their
                    physical extent. This helps the archive to assess the scope of the acquisition and plan for
                    its processing and storage. This inventory will be less detailed than the final finding aid,
                    but it will give the archive a good understanding of the materials.
                  </li>
                  <li>
                    <strong>Condition Assessment and Preservation Needs:</strong> A thorough assessment of the
                    physical condition of the materials is conducted. This involves identifying any damage,
                    deterioration, or preservation needs. Factors such as mold, pest infestations, and fragile
                    materials are noted. This assessment helps the archive to determine the resources required
                    for conservation and preservation. It will also allow for the isolation of damaged materials,
                    to prevent damage to the existing collection.
                  </li>
                  <li>
                    <strong>Legal and Ethical Due Diligence:</strong> Before accessioning, the archive must
                    conduct due diligence to ensure that the acquisition is legal and ethical. This involves
                    verifying the ownership and provenance of the materials, ensuring that they were obtained
                    legally and ethically. Copyright and intellectual property rights are also addressed. This
                    step is crucial for avoiding legal challenges and maintaining the archive's reputation.
                  </li>
                  <li>
                    <strong>Resource Assessment and Planning:</strong> The archive assesses the resources
                    required to process, store, and preserve the acquired materials. This includes considering
                    staffing, storage space, and budget constraints. This step helps to ensure that the archive
                    can adequately manage the new collection and that it aligns with the archive's strategic
                    goals. The archive will need to ensure that they have the space, and staff, to deal with the
                    new materials.
                  </li>
                  <li>
                    <strong>Environmental Control Preparation:</strong> If the materials are particularly
                    sensitive to environmental factors, the archive will prepare the storage area to meet
                    specific requirements. This might involve adjusting temperature and humidity levels,
                    installing specialized storage containers, or implementing pest control measures. This
                    ensures that the materials are stored in optimal conditions for long‑term preservation.
                  </li>
                  <li>
                    <strong>Security Planning:</strong> The archive will plan for the security of the acquired
                    materials. This includes implementing access controls, surveillance systems, and other
                    security measures to prevent theft or unauthorized access. This step is crucial for
                    protecting the integrity and confidentiality of the records.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 5: Procedures Followed Upon Receipt */}
            <div
              ref={(el) => {
                sectionRefs.current['receipt-procedures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procedures Followed Upon Receipt of Archival Material
              </h2>

              {renderCard(
                'Receipt Procedures',
                <Package size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Initial Inspection and Verification:</strong> Upon receipt, the archival material
                    undergoes an initial inspection to verify that it matches the agreed‑upon description and
                    inventory. This involves checking the quantity, type, and general condition of the records.
                    Any discrepancies or damages are documented immediately. This step is vital for ensuring that
                    the archive receives what was agreed upon and for identifying any immediate preservation
                    concerns.
                  </li>
                  <li>
                    <strong>Temporary Storage and Isolation:</strong> The received material is placed in
                    temporary storage, typically in a designated receiving area. This area is often separate from
                    the main storage to prevent potential contamination of existing collections. If any signs of
                    pest infestation, mold, or other hazards are detected, the material is isolated until
                    appropriate treatment can be administered. This prevents the spread of damage to other
                    records.
                  </li>
                  <li>
                    <strong>Accessioning Process Initiation:</strong> The accessioning process begins upon
                    receipt. This involves creating an initial accession record, which includes details such as
                    the date of receipt, the source of the material (donor or transferor), a brief description
                    of the records, and any initial observations about their condition. A unique accession number
                    is assigned to the collection. This number will be used to track the materials throughout
                    their lifecycle in the archive.
                  </li>
                  <li>
                    <strong>Inventory and Basic Description:</strong> A more detailed, but still preliminary,
                    inventory is created. This involves examining the contents of the collection and creating a
                    basic description of the types of records, their dates, and their physical extent. This helps
                    to provide an initial understanding of the collection's contents and to plan for further
                    processing.
                  </li>
                  <li>
                    <strong>Condition Assessment and Documentation:</strong> A thorough condition assessment is
                    conducted, documenting any damage, deterioration, or preservation needs. This assessment
                    includes detailed notes on the physical condition of the records, such as tears, folds,
                    fading, and mold. Photographs may be taken to document the condition of particularly fragile
                    or damaged items. This documentation is crucial for planning conservation treatments and for
                    tracking the condition of the records over time.
                  </li>
                  <li>
                    <strong>Legal Documentation Verification:</strong> All legal documentation related to the
                    acquisition, such as deeds of gift, purchase agreements, or transfer agreements, is verified.
                    This ensures that the archive has legal control over the materials and that all terms and
                    conditions are met. Any discrepancies or missing documents are addressed immediately.
                  </li>
                  <li>
                    <strong>Security Measures:</strong> Appropriate security measures are implemented to protect
                    the received materials from unauthorized access or theft. This may include placing the
                    materials in a secure storage area, restricting access to authorized personnel, and
                    implementing security monitoring systems.
                  </li>
                  <li>
                    <strong>Notification and Acknowledgement:</strong> The donor or source of the material is
                    notified that the records have been received and acknowledged. This may involve sending a
                    formal letter of acknowledgement or providing a receipt. This step is important for
                    maintaining good donor relations.
                  </li>
                  <li>
                    <strong>Preliminary Preservation Actions:</strong> If any immediate preservation actions are
                    required, they are taken. This could include placing fragile documents in archival sleeves,
                    or placing materials in a freezer to kill any active pest infestations.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 6: Processing Accessions */}
            <div
              ref={(el) => {
                sectionRefs.current['processing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Processing Accessions
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Processing accessions is a crucial phase in archival management, transforming newly
                    acquired materials from a raw state into organized, accessible, and preserved collections.
                    It involves a systematic series of steps that ensure the materials are properly arranged,
                    described, and made available for research.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Arrangement',
                    icon: <Layout size={16} />,
                    content: (
                      <>
                        <p>
                          The first step in processing is arrangement, which involves organizing the records
                          according to archival principles, primarily provenance and original order. Provenance,
                          or respect des fonds, dictates that records from a single creator or source should be
                          kept together. Original order means maintaining the records in the order in which they
                          were created or received.
                        </p>
                        <p className="mt-2">
                          This step may involve sorting records into series and subseries based on their function,
                          subject, or format. It may also involve removing duplicates, extraneous materials, and
                          non‑archival items. The goal is to create a logical and coherent organization that
                          reflects the creator's activities and facilitates research.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Description',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p>
                          Description involves creating finding aids, which are descriptive tools that provide
                          information about the contents, context, and arrangement of the records. Finding aids
                          may include a collection‑level description, series descriptions, and item‑level
                          descriptions.
                        </p>
                        <p className="mt-2">
                          The description process involves creating metadata, which is data about data. This
                          includes information such as the creator of the records, the dates of creation, the
                          subject matter, and the physical extent of the collection. Standardized metadata
                          schemas, such as Dublin Core or EAD (Encoded Archival Description), are often used to
                          ensure consistency and interoperability.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Preservation',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>
                          Preservation involves taking steps to ensure the long‑term survival of the records.
                          This may include conservation treatments, such as cleaning, repairing, and encapsulating
                          fragile materials. It also involves providing appropriate storage conditions, such as
                          temperature and humidity control, and using archival‑quality storage containers.
                        </p>
                        <p className="mt-2">
                          Preservation may also involve digitization, which involves creating digital copies of
                          the records for preservation and access purposes. Digitization can help to reduce
                          handling of fragile originals and make the records more widely available.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Creating Finding Aids',
                    icon: <BookOpen size={16} />,
                    content: (
                      <>
                        <p>
                          Finding aids are essential tools for researchers, providing a roadmap to the collection.
                          They typically include an introduction, a scope and content note, an arrangement note,
                          and an inventory or container list.
                        </p>
                        <p className="mt-2">
                          The introduction provides background information about the creator of the records and
                          the context in which they were created. The scope and content note describes the types
                          of records and their subject matter. The arrangement note explains how the records are
                          organized. The inventory or container list provides a detailed list of the contents of
                          each box or folder.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Implementing Access Controls',
                    icon: <Lock size={16} />,
                    content: (
                      <>
                        <p>
                          Access controls are implemented to ensure that the records are used appropriately and
                          that sensitive information is protected. This may involve restricting access to certain
                          records based on legal or ethical considerations.
                        </p>
                        <p className="mt-2">
                          Access controls may also involve creating redacted copies of records to remove sensitive
                          information before making them available to researchers.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Storage and Labeling',
                    icon: <Tag size={16} />,
                    content: (
                      <>
                        <p>
                          The processed materials are placed in archival‑quality storage containers and labeled
                          with appropriate identifiers. This ensures that the records are stored safely and can
                          be easily retrieved.
                        </p>
                        <p className="mt-2">
                          Storage containers are typically made from acid‑free materials and are designed to
                          protect the records from dust, light, and other environmental hazards.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Updating Accession Records',
                    icon: <RefreshCw size={16} />,
                    content: (
                      <>
                        <p>
                          The initial accession record is updated with information gathered during the processing
                          stage. This ensures that the accession record provides a complete and accurate history
                          of the acquired materials.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Making the Collection Available',
                    icon: <Share2 size={16} />,
                    content: (
                      <>
                        <p>
                          Once processing is complete, the collection is made available to researchers. This may
                          involve updating online catalogs, creating web pages, or providing access to physical
                          finding aids in the reading room.
                        </p>
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

            {/* SECTION 7: Storing New Accessions, Including Confidential and Classified Archives */}
            <div
              ref={(el) => {
                sectionRefs.current['storing-confidential'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Storing New Accessions, Including Confidential and Classified Archives
              </h2>

              {renderCard(
                'Storage Considerations',
                <Lock size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Initial Segregation and Inventory:</strong> Upon receipt, new accessions are
                    immediately segregated based on their sensitivity level. Confidential and classified
                    materials are separated from open‑access records to prevent accidental disclosure. A detailed
                    inventory is created, noting the specific items designated as confidential or classified. This
                    inventory includes metadata such as the creation date, creator, classification level, and any
                    access restrictions. This initial segregation and inventory are crucial for establishing
                    control and preventing unauthorized handling.
                  </li>
                  <li>
                    <strong>Controlled Storage Environments:</strong> Confidential and classified archives are
                    stored in highly secure, controlled environments. These environments typically feature
                    restricted access, monitored temperature and humidity levels, and fire suppression systems.
                    Access is limited to authorized personnel with appropriate security clearances. These storage
                    areas may also include features like reinforced walls, intrusion detection systems, and
                    surveillance cameras. Environmental controls are essential for preserving the physical
                    integrity of the records, while security measures protect them from unauthorized access and
                    tampering.
                  </li>
                  <li>
                    <strong>Secure Storage Containers:</strong> Sensitive materials are stored in archival‑
                    quality containers that provide additional protection. These containers may be fireproof
                    safes, locked cabinets, or specialized storage boxes designed to prevent unauthorized access.
                    Each container is clearly labeled with the classification level and any access restrictions.
                    The use of secure containers adds a layer of physical security, making it more difficult for
                    unauthorized individuals to access the records.
                  </li>
                  <li>
                    <strong>Access Control and Clearance Procedures:</strong> Strict access control procedures are
                    implemented to regulate who can access confidential and classified archives. This involves
                    requiring security clearances, background checks, and authorization from designated officials.
                    A detailed log is maintained, recording every instance of access, including the date, time,
                    and purpose of the access. This ensures that a clear audit trail is maintained, allowing for
                    accountability and tracking.
                  </li>
                  <li>
                    <strong>Digital Security Measures:</strong> If confidential or classified archives are
                    digitized, robust digital security measures are implemented. This includes encryption, access
                    controls, and regular security audits. Digital copies are stored on secure servers with
                    restricted access, and backups are stored in separate, secure locations. Digital security
                    protocols must adhere to the highest industry standards, and government regulations.
                  </li>
                  <li>
                    <strong>Regular Security Audits and Reviews:</strong> Regular security audits and reviews are
                    conducted to ensure that all security measures are effective and up‑to‑date. This involves
                    testing access controls, reviewing security logs, and assessing the overall security posture
                    of the storage environment. Any vulnerabilities or weaknesses are addressed promptly. These
                    audits also ensure compliance with all legal and regulatory requirements.
                  </li>
                  <li>
                    <strong>Declassification and Review Procedures:</strong> Procedures are established for the
                    declassification and review of classified archives. This involves periodically reviewing the
                    classification status of records and determining whether they can be downgraded or released.
                    Declassification procedures are carefully documented and implemented to ensure that sensitive
                    information is not prematurely disclosed.
                  </li>
                  <li>
                    <strong>Emergency Preparedness and Disaster Recovery:</strong> Emergency preparedness and
                    disaster recovery plans are developed to protect confidential and classified archives in the
                    event of a fire, flood, or other disaster. These plans include procedures for evacuating
                    personnel, salvaging records, and restoring operations. Backup copies of digital records are
                    stored in secure off‑site locations.
                  </li>
                  <li>
                    <strong>Legal and Regulatory Compliance:</strong> All storage and access procedures comply
                    with relevant legal and regulatory requirements, including national security laws, data
                    protection regulations, and freedom of information acts. This ensures that the archive
                    operates within the bounds of the law and protects the rights of individuals and organizations.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 8: Archives Accession Form */}
            <div
              ref={(el) => {
                sectionRefs.current['accession-form'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Archives Accession Form
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Section</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">Accession Number</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">[To be assigned by Archives]</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">Date of Accession</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">[Date - YYYY-MM-DD]</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">Donor/Source Information</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        Name: [Full Name/Organization Name]<br />
                        Address: [Street Address, City, State/Province, Postal Code, Country]<br />
                        Contact Information:<br />
                        Phone: [Phone Number]<br />
                        Email: [Email Address]<br />
                        Relationship to Records: [e.g., Creator, Owner, Executor, etc.]
                      </td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">Records Description</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        Title/Description of Records: [Detailed description of the materials]<br />
                        Dates of Records: [Start Date - End Date (YYYY-MM-DD)]<br />
                        Creator(s) of Records: [Individuals or Organizations responsible]<br />
                        Physical Extent: [e.g., number of boxes, linear feet, digital files, etc.]<br />
                        Formats: [e.g., paper documents, photographs, digital files, etc.]<br />
                        Subject Matter/Content: [Summary of the records' content and subject]<br />
                        Language(s): [Language(s) of the records]<br />
                        Access Restrictions: [Specify any restrictions on access]<br />
                        Copyright Information: [Details regarding copyright ownership]<br />
                        Condition of Records: [Notes on the physical condition of the records]
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">Acquisition Information</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        Method of Acquisition: [e.g., Donation, Purchase, Bequest, Legal Deposit]<br />
                        Deed of Gift/Purchase Agreement: [Document details]<br />
                        Transfer Date: [Date of physical transfer - YYYY-MM-DD]<br />
                        Location Prior to Transfer: [Where were the records stored?]<br />
                        Appraisal Information:<br />
                        Appraiser: [Name of Appraiser]<br />
                        Date of Appraisal: [Date - YYYY-MM-DD]<br />
                        Appraisal Notes: [Summary of the appraisal]
                      </td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">Processing Information</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        Preliminary Inventory: [Indicate if attached]<br />
                        Preservation Needs: [Notes on preservation]<br />
                        Storage Location: [Temporary storage location]<br />
                        Processor: [Name of Archival Staff]<br />
                        Notes: [Any additional information]
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">Acknowledgement</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        Acknowledgement Sent: [Yes/No]<br />
                        Date Sent: [Date - YYYY-MM-DD]<br />
                        Acknowledgement Method: [e.g., Letter, Email]
                      </td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">Signatures</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        Archivist Signature: ____________________________ Date: ________________<br />
                        Donor/Source Signature (if applicable): ____________________________ Date: ________________
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 9: Archives Accession Register Example */}
            <div
              ref={(el) => {
                sectionRefs.current['register-example'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Archives Accession Register Example
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Accession Number</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Date of Accession (YYYY-MM-DD)</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Donor/Source Name</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Description of Records (Brief)</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Physical Extent</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Formats</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Access Restrictions</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Deed/Agreement Number</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Processor</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Location</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-001</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-01-10</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Smith Family</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Family Correspondence, 1900-1950</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">4 Boxes</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Papers, Photos</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Public Access</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">DG-2023-001</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">A. Jones</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Shelf A1</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"></td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-002</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-02-15</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">City Hall Records</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Council Meeting Minutes, 1980-2000</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">10 Linear Feet</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Papers</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Restricted Access</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">TA-2023-002</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">B. Lee</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Vault B2</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Minutes contain sensitive information</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-003</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-03-22</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Historical Society</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Local Business Ledgers, 1920-1970</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">6 Volumes</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Ledgers</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Public Access</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">DG-2023-003</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">C. Patel</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Shelf C3</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"></td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-004</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-04-05</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Dr. M. Brown</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Research Notes, 1995-2010</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2 Boxes</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Papers, Digital Files</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Researcher Permission</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">DG-2023-004</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">D. Kim</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Shelf D4</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Digital files require specific software</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-005</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-05-12</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Green Corporation</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Employee Records, 2005-2020</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">8 Boxes</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Papers, Digital Files</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Confidential</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">PA-2023-005</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">E. Garcia</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Vault E5</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Employee records require redaction</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-006</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-06-18</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Art Museum</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Exhibition Catalogs, 1985-2015</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">3 Boxes</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Catalogs</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Public Access</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">DG-2023-006</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">F. Ruiz</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Shelf F6</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"></td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-007</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-07-25</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">L. Thompson</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Personal Diaries, 1940-1980</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">5 Volumes</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Diaries</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Public Access</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">DG-2023-007</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">G. Chen</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Shelf G7</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"></td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-008</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-08-01</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">County Court</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Court Case Files, 1970-1990</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">12 Linear Feet</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Papers</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Restricted Access</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">TA-2023-008</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">H. Singh</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Vault H8</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Legal restriction on some files</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-009</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-09-08</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Local Newspaper</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Photo Negatives, 1960-2000</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">7 Boxes</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Negatives</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Public Access</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">DG-2023-009</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">I. Miller</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Shelf I9</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Fragile materials</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-010</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2023-10-15</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Community Theatre</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Play Scripts, 1990-2010</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2 Boxes</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Scripts</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Public Access</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">DG-2023-010</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">J. Davis</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Shelf J10</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 10: Group and Series Register */}
            <div
              ref={(el) => {
                sectionRefs.current['group-series-register'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Group and Series Register
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">ID</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Name</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Group Name</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Series Name</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Start Date</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">End Date</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Status</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">001</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">John Doe</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Alpha Group</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Series A</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">01-01-2025</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">01-06-2025</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Active</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">-</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">002</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Jane Smith</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Beta Group</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Series B</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">01-02-2025</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">01-07-2025</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Completed</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Excellent Performance</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">003</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Mark Lee</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Alpha Group</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Series A</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">01-01-2025</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">01-06-2025</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Active</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">-</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">004</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Lisa Wong</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Gamma Group</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Series C</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">01-03-2025</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">01-08-2025</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">In Progress</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Needs Improvement</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 11: The Foundation of Archival Access */}
            <div
              ref={(el) => {
                sectionRefs.current['foundation-access'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Foundation of Archival Access
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Arrangement and description are two fundamental processes in archival management that
                    transform raw, unprocessed materials into organized, accessible, and meaningful collections.
                    They are the cornerstones of archival practice, enabling researchers to navigate and
                    understand the vast and complex holdings of an archive.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Arrangement',
                    icon: <Layout size={16} />,
                    content: (
                      <>
                        <p>
                          Arrangement refers to the process of organizing archival materials according to
                          established principles, primarily the principle of provenance and the principle of
                          original order. Provenance, or "respect des fonds," dictates that records from a
                          particular creator or source should be kept together, reflecting the context in which
                          they were created. Original order means maintaining the records in the order in which
                          they were created or received by the creator, preserving the internal logic and
                          relationships within the collection.
                        </p>
                        <p className="mt-2">
                          This process involves sorting records into logical series and subseries based on their
                          function, subject, or format. It may also involve removing duplicates, extraneous
                          materials, and non‑archival items. The goal is to create a hierarchical structure that
                          reflects the creator's activities and facilitates research. By adhering to these
                          principles, archivists preserve the contextual relationships between records, ensuring
                          that they are not arbitrarily rearranged or reinterpreted.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Description',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p>
                          Description involves creating finding aids, which are descriptive tools that provide
                          information about the contents, context, and arrangement of the records. Finding aids
                          may include collection‑level descriptions, series descriptions, and item‑level
                          descriptions. The description process involves creating metadata, which is data about
                          data. This includes information such as the creator of the records, the dates of
                          creation, the subject matter, and the physical extent of the collection.
                        </p>
                        <p className="mt-2">
                          Standardized metadata schemas, such as Dublin Core or EAD (Encoded Archival Description),
                          are often used to ensure consistency and interoperability. The aim of description is to
                          provide sufficient information to enable researchers to understand the scope and content
                          of the records, assess their relevance to their research, and locate specific items
                          within the collection. Effective description transforms a collection from a group of
                          items to a researchable resource.
                        </p>
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

            {/* SECTION 12: Importance of Arranging and Describing Archives */}
            <div
              ref={(el) => {
                sectionRefs.current['importance-arranging'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Importance of Arranging and Describing Archives
              </h2>

              {renderCard(
                'Why Arrangement and Description Matter',
                <Target size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Enabling Access and Discovery:</strong> Arrangement and description are fundamental
                    for making archival materials accessible to researchers. Without proper arrangement, records
                    would be scattered and disorganized, making it difficult to locate relevant items. Finding
                    aids provide a roadmap to the collection, enabling researchers to navigate the materials
                    efficiently.
                  </li>
                  <li>
                    <strong>Preserving Context and Meaning:</strong> Arrangement and description preserve the
                    context in which records were created and used. By adhering to the principles of provenance
                    and original order, archivists maintain the relationships between records and their creators,
                    ensuring that the records are not misinterpreted or misused. This contextual information is
                    vital for understanding the historical significance and evidential value of archival materials.
                  </li>
                  <li>
                    <strong>Ensuring Authenticity and Reliability:</strong> Proper arrangement and description
                    contribute to the authenticity and reliability of archival records. By documenting the
                    provenance and original order of the materials, archivists provide evidence of their integrity
                    and trustworthiness. This is particularly important for legal and historical research, where
                    the accuracy and reliability of records are paramount.
                  </li>
                  <li>
                    <strong>Facilitating Research and Scholarship:</strong> Arrangement and description support
                    research and scholarship by providing researchers with the tools they need to locate and use
                    archival materials. Finding aids provide detailed information about the contents of collections,
                    enabling researchers to assess their relevance and plan their research strategies.
                  </li>
                  <li>
                    <strong>Promoting Accountability and Transparency:</strong> Arranging and describing records
                    promotes accountability and transparency by ensuring that records of public interest are
                    accessible to the public. This is particularly important for government archives, which play
                    a crucial role in maintaining public trust and ensuring that government actions are documented
                    and accessible.
                  </li>
                  <li>
                    <strong>Supporting Preservation Efforts:</strong> By going through each item in a collection,
                    during arrangement and description, the archivist can identify items that need preservation
                    work. This allows for proactive conservation.
                  </li>
                  <li>
                    <strong>Efficient Resource Management:</strong> Arrangement and description aid in efficient
                    resource management within the archive. Knowing the content and extent of collections allows
                    for better planning of storage, staffing, and digitization projects.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 13: Principles of Arrangement and Description */}
            <div
              ref={(el) => {
                sectionRefs.current['principles-arrangement'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Principles of Arrangement and Description in Archival Practice
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Arrangement and description, the twin pillars of archival processing, are guided by specific
                    principles that ensure the integrity, accessibility, and usability of archival materials.
                    These principles provide a framework for archivists to organize and describe collections in
                    a consistent and meaningful way.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Principles of Arrangement',
                    icon: <Layout size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Principle of Provenance (Respect des Fonds):</strong> This foundational
                          principle dictates that records originating from a single creator or source must be
                          kept together. This means that the records of an individual, organization, or government
                          agency should not be intermingled with those of another. The principle of provenance
                          preserves the context in which records were created, reflecting the functional and
                          administrative relationships that existed.
                        </li>
                        <li>
                          <strong>Principle of Original Order (Respect de l'Ordre Primitif):</strong> This
                          principle mandates that records should be maintained in the order in which they were
                          originally created or received by the creator. This means preserving the filing systems,
                          organizational structures, and sequences that were used by the creator. The original
                          order often reflects the creator's work processes, decision‑making, and administrative
                          functions.
                        </li>
                        <li>
                          <strong>Hierarchical Arrangement:</strong> Archival arrangement typically follows a
                          hierarchical structure, organizing records into series, subseries, and files. This
                          structure reflects the functional and organizational relationships within the records,
                          providing a logical framework for access and retrieval.
                        </li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Principles of Description',
                    icon: <FileText size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Principle of Progressive Levels of Detail:</strong> Archival description follows
                          a progressive approach, moving from general to specific information. This means that
                          finding aids typically begin with a collection‑level description, providing an overview
                          of the entire collection.
                        </li>
                        <li>
                          <strong>Principle of Context and Provenance:</strong> Archival description emphasizes
                          the context in which records were created, including information about the creator, the
                          functions and activities that generated the records, and the historical circumstances
                          surrounding their creation.
                        </li>
                        <li>
                          <strong>Principle of Accuracy and Objectivity:</strong> Archival description must be
                          accurate and objective, providing a faithful representation of the records. This means
                          avoiding subjective interpretations or biases and ensuring that the description is based
                          on factual information.
                        </li>
                        <li>
                          <strong>Principle of Standardization and Interoperability:</strong> Archival description
                          often adheres to standardized metadata schemas and description standards, such as
                          ISAD(G) (General International Standard Archival Description) and EAD (Encoded Archival
                          Description).
                        </li>
                        <li>
                          <strong>Principle of Accessibility and Usability:</strong> Archival description should be
                          designed to facilitate access and usability for researchers. This means using clear and
                          concise language, providing adequate indexing and cross‑referencing, and creating finding
                          aids that are easy to navigate.
                        </li>
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

            {/* SECTION 14: Levels of Arrangement and Description */}
            <div
              ref={(el) => {
                sectionRefs.current['levels-arrangement'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Levels of Arrangement and Description in Archival Practice
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Archival arrangement and description are conducted at multiple levels, reflecting the
                    hierarchical nature of archival collections and the need to provide progressively detailed
                    information.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Levels of Arrangement',
                    icon: <Layers size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Repository Level:</strong> At the repository level, the archive itself is
                          organized and managed. This involves establishing policies and procedures for
                          acquisition, processing, preservation, and access.
                        </li>
                        <li>
                          <strong>Fonds/Record Group Level:</strong> The fonds or record group level is the
                          highest level of arrangement within a collection. A fonds refers to the entire body of
                          records created by a single individual, family, or organization.
                        </li>
                        <li>
                          <strong>Series Level:</strong> A series is a group of records that are created or
                          maintained by the creator in the same function or activity. Series are typically
                          organized based on subject, function, format, or chronological order.
                        </li>
                        <li>
                          <strong>File/Item Level:</strong> The file or item level is the most detailed level of
                          arrangement. A file is a group of related documents that are typically stored together.
                          An item is an individual document or record.
                        </li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Levels of Description',
                    icon: <FileText size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Repository Guide/Website:</strong> The repository guide or website provides an
                          overview of the archive's holdings, including information about its collecting policy,
                          major collections, and access procedures.
                        </li>
                        <li>
                          <strong>Collection/Fonds/Record Group Level Description:</strong> This level of
                          description provides an overview of the entire collection, including information about
                          the creator, the scope and content of the records, and the arrangement of the collection.
                        </li>
                        <li>
                          <strong>Series Level Description:</strong> This level of description provides more
                          detailed information about the content and context of the records within each series.
                        </li>
                        <li>
                          <strong>File/Item Level Description:</strong> This level of description provides the
                          most detailed information about the contents of individual files or items.
                        </li>
                        <li>
                          <strong>Index/Controlled Vocabulary:</strong> Indexes and controlled vocabularies are
                          tools that facilitate access to archival materials by providing standardized terms and
                          subject headings.
                        </li>
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
                  💡 Accessioning Insight
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
                  <span>Accessioning Components</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Control Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Processing Steps</span>
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
                Accessioning is the first step in archival control, establishing physical and intellectual
                control over new acquisitions. Goals include documenting the transfer, preserving integrity,
                and facilitating future processing. Legal, physical, and intellectual controls are
                interdependent. Pre‑accessioning involves appraisal, negotiation, and due diligence. Upon
                receipt, inspection, temporary storage, and initial documentation occur. Processing involves
                arrangement, description, preservation, and creating finding aids. Confidential archives
                require special storage and security. Arrangement and description are guided by provenance,
                original order, and hierarchical levels, ensuring access and context for researchers.
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
                <strong className="text-white">Accessioning System</strong> – The foundational process that
                establishes physical and intellectual control over new materials, including an accession
                record, unique number, preliminary inventory, and proper handling.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Goals of Accessioning</strong> – Establishing control,
                documenting the acquisition, preserving integrity, facilitating processing, and providing
                initial access to researchers.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Forms of Control</strong> – Legal (ownership, rights),
                Physical (location, protection), and Intellectual (description, accessibility) are
                interdependent and essential.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Pre‑Accessioning</strong> – Appraisal, negotiation,
                preliminary inventory, condition assessment, legal due diligence, resource planning,
                environmental preparation, and security planning.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Processing Steps</strong> – Arrangement (provenance,
                original order), Description (finding aids), Preservation, Creating aids, Access controls,
                Storage, Updating records, and making the collection available.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Confidential Archives</strong> – Require segregation,
                controlled environments, secure containers, strict access controls, digital security,
                regular audits, declassification procedures, and disaster recovery plans.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Arrangement &amp; Description</strong> – Guided by
                provenance and original order; multi‑level (repository, fonds, series, file/item);
                description progressively details context and content, enabling discovery and research.
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
            Sidemann Academic Registry • Accessioning Systems &amp; Archival Control 2.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;