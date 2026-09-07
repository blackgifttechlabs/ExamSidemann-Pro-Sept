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
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Acquisition' },
  { id: 'importance', label: 'Importance' },
  { id: 'methods', label: 'Methods' },
  { id: 'factors', label: 'Factors' },
  { id: 'process', label: 'Process' },
  { id: 'principles', label: 'Provenance & Order' },
  { id: 'sources', label: 'Sources' },
  { id: 'policy', label: 'Acquisition Policy' },
  { id: 'components', label: 'Policy Components' },
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
        text: 'The principle of provenance, also known as "respect des fonds", requires that records from different creators are never mixed, preserving their original context.',
      },
      {
        title: 'Pro Tip',
        text: 'Always establish a clear acquisition policy before accepting donations; it prevents collection drift and ensures resources are used effectively.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three pillars of acquisition: "A‑S‑P" – Appraisal, Selection, and Preservation. Each step is critical to building a meaningful archives.',
      },
      {
        title: 'Common Mistake',
        text: 'Many archives neglect to verify the legal ownership of donated materials, leading to future disputes. Always obtain a signed deed of gift.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The principle of provenance, also known as "respect des fonds", requires that records from different creators are never mixed, preserving their original context.',
      },
      {
        title: 'Pro Tip',
        text: 'Always establish a clear acquisition policy before accepting donations; it prevents collection drift and ensures resources are used effectively.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three pillars of acquisition: "A‑S‑P" – Appraisal, Selection, and Preservation. Each step is critical to building a meaningful archives.',
      },
      {
        title: 'Common Mistake',
        text: 'Many archives neglect to verify the legal ownership of donated materials, leading to future disputes. Always obtain a signed deed of gift.',
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
            <FolderTree size={14} className="inline mr-1" /> ARCHIVES ADMINISTRATION
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Archives Acquisition —{' '}
            <span className="text-emerald-300 font-bold italic">
              &amp; Collection Development
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to acquisition, importance, methods, factors, processes, principles,
            sources, and acquisition policies.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Archive size={14} className="inline mr-1" /> Acquisition
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Appraisal
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Preservation
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
                placeholder="Search for a concept, method, policy component..."
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
            {/* SECTION 1: Acquisition in Archives Administration */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Acquisition in Archives Administration
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In archives administration, acquisition refers to the process of obtaining archival
                    materials from various sources. It encompasses the activities involved in identifying,
                    selecting, and transferring records of enduring value to the archives for preservation
                    and future use. Essentially, it's how an archive builds its collection, ensuring that
                    historically significant materials are preserved and made accessible. Acquisition is
                    not just about physically receiving documents; it involves careful evaluation and
                    decision-making to determine what materials are worthy of permanent preservation.
                  </p>
</div>
            </div>

            {/* SECTION 2: Importance of Acquisition */}
            <div
              ref={(el) => {
                sectionRefs.current['importance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Importance of Acquisition
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Acquisition is a fundamental and indispensable function in archives administration,
                    playing a critical role in the following ways:
                  </p>
</div>

              {renderCard(
                'Key Roles of Acquisition',
                <Target size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Preserving Historical Memory:</strong> Acquisition ensures the preservation
                    of records that document the history, culture, and activities of individuals,
                    organizations, and communities. These records serve as primary sources for research,
                    providing valuable insights into the past. Without acquisition, these records could be
                    lost, damaged, or destroyed, resulting in gaps in our historical understanding.
                  </li>
                  <li>
                    <strong>Building Comprehensive Collections:</strong> Acquisition allows archives to
                    develop comprehensive collections that reflect the scope of their collecting mandate.
                    By actively seeking out and acquiring relevant materials, archives can build collections
                    that provide a rich and diverse representation of the past. This ensures that researchers
                    have access to a wide range of sources for their studies.
                  </li>
                  <li>
                    <strong>Ensuring Accountability and Transparency:</strong> Acquisition contributes to
                    accountability and transparency by preserving records that document the actions and
                    decisions of individuals and organizations. These records can be used to hold individuals
                    and institutions accountable for their actions and to ensure that decisions are made in a
                    transparent manner. This is particularly important for government archives, which play a
                    crucial role in maintaining public trust.
                  </li>
                  <li>
                    <strong>Supporting Research and Scholarship:</strong> Acquisition provides researchers
                    and scholars with access to primary source materials that are essential for their work.
                    By acquiring and preserving these materials, archives support research in a wide range of
                    fields, including history, genealogy, and social sciences.
                  </li>
                  <li>
                    <strong>Documenting Cultural Heritage:</strong> Acquisition plays a vital role in
                    documenting and preserving cultural heritage. Archives acquire and preserve records that
                    reflect the traditions, customs, and values of different communities. This helps to ensure
                    that cultural heritage is passed on to future generations.
                  </li>
                  <li>
                    <strong>Meeting Legal and Administrative Needs:</strong> Acquisition helps organizations
                    meet their legal and administrative needs by ensuring that records are preserved for
                    compliance purposes. This is particularly important for organizations that are subject to
                    regulations or that need to maintain records for legal or financial reasons.
                  </li>
                  <li>
                    <strong>Building Community Trust:</strong> By actively acquiring, and preserving the
                    records of a community, an archive builds trust with that community. This can lead to
                    further donations of valuable materials.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 3: Methods of Acquisition */}
            <div
              ref={(el) => {
                sectionRefs.current['methods'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Methods of Acquisition in Archives Administration
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Archives acquire materials through various methods, each with its own specific
                    procedures and legal implications. These methods ensure a diverse and comprehensive
                    collection.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Statutory or Legal Deposits',
                    icon: <BookOpen size={16} />,
                    content: (
                      <>
                        <p>
                          Statutory or legal deposits are mandated by law, requiring certain organizations or
                          individuals to deposit copies of their publications or records with designated
                          archives. This method is particularly common for government publications, official
                          documents, and published works. It ensures that a comprehensive record of a nation's
                          or region's intellectual output is preserved. Legal deposits provide a systematic and
                          reliable way for archives to acquire materials, ensuring that essential records are
                          not lost or destroyed. This method ensures that archives have a copy of all official
                          documents, and publications.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Donations or Deeds of Gift',
                    icon: <Handshake size={16} />,
                    content: (
                      <>
                        <p>
                          Donations or deeds of gift involve the voluntary transfer of ownership of archival
                          materials from individuals, families, or organizations to an archive. This method
                          relies on the generosity of donors who recognize the historical or cultural value of
                          their records. A deed of gift is a legal document that formally transfers ownership
                          and specifies any conditions or restrictions on the use of the materials. Donations
                          are a vital source of archival materials, as they often include personal papers,
                          photographs, and other unique items that would not otherwise be available to the
                          public. It also builds relationships with the community.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Purchase',
                    icon: <DollarSign size={16} />,
                    content: (
                      <>
                        <p>
                          Purchase involves acquiring archival materials through financial transactions.
                          Archives may purchase records from private collectors, dealers, or auctions. This
                          method is often used to acquire rare or historically significant items that are not
                          available through other means. Purchase allows archives to fill gaps in their
                          collections and acquire materials that are essential for research or exhibition
                          purposes. However, it requires careful appraisal and budget management to ensure
                          that acquisitions are cost‑effective and aligned with the archive's collecting policy.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Loans or Deposits',
                    icon: <Package size={16} />,
                    content: (
                      <>
                        <p>
                          Loans or deposits involve the temporary transfer of archival materials to an archive
                          for a specified period. This method allows archives to make materials available to
                          researchers without acquiring permanent ownership. Loans or deposits are often used
                          for exhibitions, research projects, or digitisation initiatives. They can also be used
                          to evaluate the suitability of materials for permanent acquisition. Loan agreements
                          specify the terms and conditions of the loan, including the duration, security
                          measures, and access restrictions.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Bequests',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p>
                          Bequests are gifts of archival materials made through a will or testamentary document.
                          This method allows individuals to donate their records to an archive after their death.
                          Bequests often include personal papers, photographs, and other valuable items that
                          reflect the donor's life and work. Archives must have clear procedures for accepting
                          and processing bequests, ensuring that the donor's wishes are respected.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Photocopying or Micro‑copying',
                    icon: <Copy size={16} />,
                    content: (
                      <>
                        <p>
                          Photocopying or micro‑copying involves creating copies of archival materials for
                          preservation or access purposes. This method is often used when the original documents
                          are fragile, rare, or located in another institution. Creating copies allows archives
                          to provide access to information without risking damage to the originals. Micro‑copying,
                          especially, allows for space saving storage of large documents.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Restitution or Replevin',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>
                          Restitution or replevin involves the return of archival materials that were wrongfully
                          taken or illegally held. Restitution is often used to recover cultural property that
                          was looted during wartime or colonial periods. Replevin is a legal action to recover
                          personal property that is wrongfully detained. These methods are essential for ensuring
                          the ethical and legal acquisition of archival materials, and to return culturally
                          significant items to their rightful owners. This can involve lengthy legal battles.
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

            {/* SECTION 4: Factors to Consider */}
            <div
              ref={(el) => {
                sectionRefs.current['factors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors to Consider Before Acquiring Archival Materials
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Before acquiring archival materials, archives must carefully consider a range of
                    factors to ensure that the acquisition aligns with their mission, resources, and
                    ethical obligations. These considerations are vital for building a relevant and
                    sustainable collection.
                  </p>
</div>

              {renderCard(
                'Key Factors',
                <ClipboardList size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Relevance to the Archive's Collecting Policy:</strong> The most crucial factor
                    is the relevance of the materials to the archive's collecting policy. This policy
                    outlines the scope of the archive's collection, specifying the types of records, time
                    periods, and subject areas that it seeks to acquire. Materials should fall within the
                    parameters of this policy to ensure that they contribute to the archive's overall mission
                    and research goals. This prevents the archive from acquiring items that are outside of
                    their scope, and helps to keep the collection focused.
                  </li>
                  <li>
                    <strong>Appraisal and Significance:</strong> A thorough appraisal of the materials is
                    essential to determine their historical, cultural, or evidential significance. This
                    involves evaluating the records for their authenticity, uniqueness, and potential
                    research value. Factors such as the creator of the records, the context in which they
                    were created, and their informational content are considered. The appraisal process
                    helps to ensure that the archive acquires materials that are worthy of long‑term
                    preservation.
                  </li>
                  <li>
                    <strong>Physical Condition and Preservation Needs:</strong> The physical condition of
                    the materials is a critical consideration. Fragile, damaged, or deteriorating records
                    may require extensive conservation treatment, which can be costly and time‑consuming.
                    The archive must assess the preservation needs of the materials and determine whether
                    it has the resources to provide adequate care. This includes considering factors such
                    as storage conditions, environmental controls, and conservation expertise.
                  </li>
                  <li>
                    <strong>Legal and Ethical Considerations:</strong> Archives must carefully consider
                    legal and ethical implications before acquiring materials. This includes verifying the
                    ownership and provenance of the records, ensuring that they were obtained legally and
                    ethically. Copyright and intellectual property rights must also be addressed, as these
                    can affect the use and access of the materials. Ethical considerations, such as
                    respecting privacy and confidentiality, are also paramount.
                  </li>
                  <li>
                    <strong>Resource Implications:</strong> Acquiring archival materials has significant
                    resource implications. This includes the costs associated with appraisal, processing,
                    storage, and preservation. The archive must carefully assess its available resources
                    and determine whether it can adequately manage the acquired materials. This includes
                    considering staffing, storage space, and budget constraints.
                  </li>
                  <li>
                    <strong>Accessibility and Use:</strong> The potential accessibility and use of the
                    materials are important factors to consider. Archives acquire materials to make them
                    available to researchers and the public. The materials should be organized, described,
                    and indexed in a way that facilitates access and retrieval. Considerations include the
                    ease of digitisation, and if the documents contain sensitive information that will
                    require redaction.
                  </li>
                  <li>
                    <strong>Donor Relations and Conditions:</strong> When acquiring materials through
                    donations or bequests, archives must establish clear and transparent donor relations.
                    This includes discussing any conditions or restrictions on the use of the materials and
                    ensuring that the donor's wishes are respected. Archives must also be prepared to provide
                    appropriate acknowledgment and recognition to donors.
                  </li>
                  <li>
                    <strong>Duplication and Overlap:</strong> Before acquisition, it is important to check
                    if the materials are already held by the archive or other institutions. Duplication of
                    resources can lead to unnecessary storage and processing costs. A thorough search of
                    existing collections can help to avoid duplication and ensure that resources are used
                    effectively.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 5: Acquisition is Carried Out */}
            <div
              ref={(el) => {
                sectionRefs.current['process'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Acquisition of Archival Materials is Carried Out
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The acquisition of archival materials is carried out through a systematic process
                    that involves several key steps.
                  </p>
</div>

              {renderCard(
                'Key Steps in the Acquisition Process',
                <RefreshCw size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Identification and Appraisal:</strong> The process begins with identifying
                    potential sources of archival materials. This can involve outreach to individuals,
                    organizations, and communities, as well as monitoring relevant publications and events.
                    Once potential materials are identified, they are appraised to determine their
                    significance and suitability for acquisition.
                  </li>
                  <li>
                    <strong>Negotiation and Agreement:</strong> If the appraisal determines that the
                    materials are worthy of acquisition, the archive negotiates with the owner or custodian
                    of the records. This involves discussing the terms and conditions of the transfer,
                    including ownership, access restrictions, and preservation responsibilities. A formal
                    agreement, such as a deed of gift or purchase agreement, is then drafted and signed by
                    both parties.
                  </li>
                  <li>
                    <strong>Transfer and Accessioning:</strong> Once the agreement is finalized, the
                    materials are transferred to the archive. This involves physically transporting the
                    records to the archive's storage facility. Upon arrival, the materials are accessioned,
                    which involves assigning a unique accession number and creating a basic inventory of
                    the records.
                  </li>
                  <li>
                    <strong>Processing and Arrangement:</strong> After accessioning, the materials are
                    processed and arranged. This involves organizing the records into logical series and
                    subseries, creating a finding aid, and preparing the materials for storage. This step
                    ensures that the records are easily accessible and usable for researchers.
                  </li>
                  <li>
                    <strong>Preservation and Storage:</strong> The final step involves preserving and
                    storing the materials in a controlled environment. This includes providing appropriate
                    storage containers, maintaining stable temperature and humidity levels, and implementing
                    conservation treatments as needed. Proper preservation and storage are essential for
                    ensuring the long‑term accessibility of the archival materials.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 6: Principles of Provenance and Original Order */}
            <div
              ref={(el) => {
                sectionRefs.current['principles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Principles of Provenance and Original Order in Archives Administration
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Two fundamental principles underpin the organization and management of archival
                    materials: the principle of provenance and the principle of original order. These
                    principles ensure the preservation of the context and integrity of archival records,
                    making them reliable sources for research and accountability.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'The Principle of Provenance (Respect des Fonds)',
                    icon: <User size={16} />,
                    content: (
                      <>
                        <p>
                          The principle of provenance dictates that archival records should be organized and
                          maintained according to their creator or source. This means that records created by
                          a particular individual, organization, or government agency should be kept together,
                          regardless of their subject matter. This principle recognizes that the context in
                          which records are created is essential for understanding their meaning and significance.
                        </p>
                        <p className="mt-2">
                          By adhering to the principle of provenance, archivists preserve the relationships
                          between records and their creators, enabling researchers to trace the origins and
                          development of ideas, policies, and actions. This principle helps to maintain the
                          authenticity and reliability of archival records, ensuring that they are not
                          manipulated or misrepresented. It is vital to keep the records of one person or
                          organization entirely separate from the records of another. Mixing records from
                          different sources would destroy the contextual information that makes them valuable.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'The Principle of Original Order (Respect des Fonds)',
                    icon: <Layers size={16} />,
                    content: (
                      <>
                        <p>
                          The principle of original order states that archival records should be maintained in
                          the order in which they were created or received by their creator. This means that
                          records should be preserved in their original filing systems, organizational structures,
                          or sequences. This principle recognizes that the arrangement of records can provide
                          valuable insights into the creator's activities, thought processes, and decision‑making.
                        </p>
                        <p className="mt-2">
                          By respecting the original order, archivists preserve the context and relationships
                          between records, enabling researchers to understand how they were used and managed by
                          their creator. This principle helps to maintain the integrity and authenticity of
                          archival records, ensuring that they are not arbitrarily rearranged or reinterpreted.
                          The order in which records were kept often reflects how they were used, and that
                          information would be lost if the order was changed. This allows researchers to
                          understand the records as they were used in the past.
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

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Both of these principles work in tandem to maintain the integrity of archival collections.
                  Provenance identifies who created the records, and original order identifies how they were used.
                </p>
              </div>
            </div>

            {/* SECTION 7: Sources of Acquiring Archival Materials */}
            <div
              ref={(el) => {
                sectionRefs.current['sources'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Sources of Acquiring Archival Materials
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Internal Sources',
                    icon: <Building size={16} />,
                    content: (
                      <>
                        <p>
                          Internal sources refer to records generated within the organization or institution
                          that the archive serves. For government archives, this includes records created by
                          various government departments, agencies, and offices. For corporate archives, this
                          includes records created by different departments, divisions, and employees of the
                          company. Internal sources are crucial for documenting the history, activities, and
                          functions of the parent organization.
                        </p>
                        <p className="mt-2">
                          Internal records often include official documents, reports, correspondence, minutes
                          of meetings, and other administrative records. These records provide valuable insights
                          into the organization's policies, decisions, and operations. By acquiring records from
                          internal sources, archives ensure that the organization's institutional memory is
                          preserved and that its activities are documented for accountability and transparency.
                          Also, internal sources provide a complete record of the organisations activities,
                          from the top down.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'External Sources',
                    icon: <Globe size={16} />,
                    content: (
                      <>
                        <p>
                          External sources encompass records acquired from individuals, families, organizations,
                          and other institutions outside the archive's parent organization. These sources provide
                          a broader perspective on the history and culture of the community or region served by
                          the archive. External sources are vital for documenting diverse viewpoints and
                          experiences.
                        </p>
                        <p className="mt-2">
                          External records can include personal papers, photographs, diaries, letters, business
                          records, and organizational archives. These materials often provide unique and valuable
                          information that complements the records acquired from internal sources. For example,
                          a local history archive might acquire personal papers from residents, business records
                          from local companies, and organizational archives from community groups. By acquiring
                          records from external sources, archives enrich their collections and provide a more
                          comprehensive understanding of the past. These sources also provide context to the
                          internal records that are held.
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

            {/* SECTION 8: Acquisition Policy */}
            <div
              ref={(el) => {
                sectionRefs.current['policy'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                An acquisition policy is a cornerstone document for any archival institution
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Its significance can be illustrated through several key aspects:
                  </p>
</div>

              {renderCard(
                'Significance of an Acquisition Policy',
                <Target size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Defining the Scope of the Collection:</strong> An acquisition policy clearly
                    defines the parameters of the archive's collection, specifying the types of materials it
                    seeks to acquire, the time periods it covers, and the subject areas it focuses on. This
                    provides a framework for decision‑making, ensuring that acquisitions align with the
                    archive's mission and avoid haphazard growth. Without a defined scope, an archive risks
                    accumulating irrelevant or unmanageable materials.
                  </li>
                  <li>
                    <strong>Ensuring Consistent and Focused Collecting:</strong> By establishing clear
                    criteria for acquisition, the policy promotes consistency in the archive's collecting
                    practices. This prevents ad‑hoc acquisitions based on personal preferences or fleeting
                    opportunities, ensuring that the collection develops in a coherent and purposeful manner.
                    It allows for the archive to target specific collections that will enhance the archives
                    holdings.
                  </li>
                  <li>
                    <strong>Guiding Appraisal and Selection:</strong> The acquisition policy provides a
                    basis for appraising and selecting archival materials. It outlines the factors to be
                    considered when evaluating potential acquisitions, such as historical significance,
                    evidential value, and research potential. This ensures that the archive acquires materials
                    that are worthy of long‑term preservation and that contribute to its research goals.
                  </li>
                  <li>
                    <strong>Promoting Transparency and Accountability:</strong> A publicly available
                    acquisition policy promotes transparency in the archive's collecting practices. It
                    informs donors, researchers, and the community about the archive's priorities and
                    procedures. This fosters trust and accountability, demonstrating that the archive is
                    responsible and ethical in its acquisition activities.
                  </li>
                  <li>
                    <strong>Managing Resources Effectively:</strong> Acquiring and processing archival
                    materials requires significant resources, including staff time, storage space, and
                    funding. An acquisition policy helps to manage these resources effectively by prioritizing
                    acquisitions and avoiding the accumulation of unnecessary or redundant materials. This
                    ensures that the archive's resources are used efficiently to build a high‑quality collection.
                  </li>
                  <li>
                    <strong>Facilitating Donor Relations:</strong> The policy provides clear guidelines for
                    accepting donations and bequests, ensuring that donor expectations are met and that legal
                    and ethical considerations are addressed. This fosters positive donor relations, encouraging
                    individuals and organizations to entrust their valuable records to the archive.
                  </li>
                  <li>
                    <strong>Supporting Long‑Term Preservation:</strong> By focusing on materials that align
                    with the archive's mission and resources, the acquisition policy supports long‑term
                    preservation efforts. It ensures that the archive acquires materials that it can adequately
                    care for, reducing the risk of deterioration and loss.
                  </li>
                  <li>
                    <strong>Providing Legal Protection:</strong> Having a well defined policy helps protect
                    the archive legally. It can help prove that the archive acted correctly in acquisition of
                    materials, and that all legal requirements were met.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 9: Components of an Archives Acquisition Policy */}
            <div
              ref={(el) => {
                sectionRefs.current['components'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Components of an Archives Acquisition Policy
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    An archives acquisition policy is a foundational document that guides the institution's
                    collecting activities. It provides a clear framework for decision‑making, ensuring that
                    acquisitions align with the archive's mission, resources, and ethical obligations. A
                    comprehensive acquisition policy typically includes several essential components.
                  </p>
</div>

              {renderCard(
                'Essential Components',
                <ClipboardList size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Introduction and Mission Statement:</strong> The policy should begin with a clear
                    introduction that outlines the purpose and scope of the document. It should also include
                    the archive's mission statement, which articulates its overall goals and objectives. This
                    section sets the context for the policy and demonstrates how it supports the archive's
                    broader mission. The mission statement explains to the public, and staff, what the archive
                    is trying to achieve. It also grounds the policy in the archives core values.
                  </li>
                  <li>
                    <strong>Scope of Collecting:</strong> This section defines the specific types of materials
                    the archive seeks to acquire. It should detail the subject areas, time periods, geographic
                    regions, and formats of records that are within the archive's collecting mandate. For
                    example, a local history archive might focus on acquiring records related to the history
                    of its specific town or county, while a corporate archive might focus on records related
                    to the company's operations and products. This section provides clarity and focus,
                    preventing the archive from acquiring materials that are outside its scope. This section
                    is the core of the policy, and is used to make decisions on what to acquire.
                  </li>
                  <li>
                    <strong>Selection Criteria:</strong> The policy should outline the criteria used to
                    evaluate potential acquisitions. These criteria should address factors such as historical
                    significance, evidential value, research potential, physical condition, and legal and
                    ethical considerations. For example, the policy might state that the archive prioritises
                    records that document significant events, individuals, or organizations, or that it avoids
                    acquiring materials that are heavily damaged or that infringe on copyright. This section
                    provides a framework for appraising and selecting archival materials, ensuring that
                    acquisitions are consistent and well‑reasoned.
                  </li>
                  <li>
                    <strong>Acquisition Methods:</strong> This section describes the various methods the
                    archive uses to acquire materials, such as donations, bequests, purchases, and legal
                    deposits. It should outline the procedures for each method, including the necessary
                    documentation and legal requirements. For example, the policy might specify the terms
                    and conditions for accepting donations, or the procedures for conducting due diligence
                    before purchasing materials. This section ensures that acquisitions are conducted in a
                    transparent and legally compliant manner.
                  </li>
                  <li>
                    <strong>Donor Relations and Conditions:</strong> The policy should address the archive's
                    approach to donor relations, including the procedures for acknowledging donations,
                    discussing donor conditions, and ensuring that donor wishes are respected. It should
                    also outline the archive's policy on access restrictions, copyright, and other legal and
                    ethical considerations related to donated materials. This section fosters positive donor
                    relations and ensures that donations are handled in a responsible and ethical manner.
                  </li>
                  <li>
                    <strong>Deaccessioning Policy:</strong> While focused on acquisition, a good policy will
                    also contain information on deaccessioning. This is the process of removing materials
                    from the collection. The policy should outline the criteria and procedures for
                    deaccessioning materials, ensuring that it is done in a responsible and transparent
                    manner. This section ensures that the archive maintains a focused and relevant collection,
                    and that resources are not wasted on materials that are no longer appropriate.
                  </li>
                  <li>
                    <strong>Legal and Ethical Considerations:</strong> This section addresses the legal and
                    ethical obligations of the archive, including copyright, privacy, and cultural property
                    rights. It should outline the archive's policies on handling sensitive information,
                    obtaining permissions for use, and complying with relevant laws and regulations. This
                    section ensures that acquisitions are conducted in a legal and ethical manner, protecting
                    the rights of individuals and organizations.
                  </li>
                  <li>
                    <strong>Review and Revision:</strong> The policy should include a statement on how often
                    it will be reviewed and revised. This ensures that the policy remains current and relevant,
                    reflecting changes in the archive's mission, resources, and best practices. Regular review
                    and revision ensures that the policy remains a useful tool for guiding the archive's
                    collecting activities.
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Archives Insight
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
                  <span>Acquisition Methods</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Key Principles</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">2</span>
                </li>
                <li className="flex justify-between">
                  <span>Policy Components</span>
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
                Acquisition is the process of identifying, selecting, and transferring records of value
                to the archives. Its importance includes preserving history, building collections, and
                ensuring accountability. Methods include legal deposits, donations, purchases, and loans.
                Key considerations before acquiring include relevance, appraisal, condition, legality,
                resources, and accessibility. The acquisition process involves identification, negotiation,
                transfer, processing, and preservation. Principles of provenance and original order
                maintain context and integrity. Sources are internal and external. An acquisition policy
                defines scope, selection criteria, methods, donor relations, deaccessioning, and legal
                compliance, and should be reviewed regularly.
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
                <strong className="text-white">Acquisition Defined</strong> – The process of obtaining
                archival materials of enduring value, involving identification, appraisal, and transfer.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Importance</strong> – Preserves historical memory, builds
                comprehensive collections, ensures accountability, supports research, and documents
                cultural heritage.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Acquisition Methods</strong> – Legal deposits, donations,
                purchases, loans, bequests, photocopying/micro‑copying, and restitution/replevin.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Key Factors</strong> – Relevance to collecting policy,
                appraisal, condition, legal/ethical issues, resources, accessibility, donor relations,
                and avoiding duplication.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Acquisition Process</strong> – Identification, negotiation,
                transfer/accessioning, processing/arrangement, and preservation/storage.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Provenance &amp; Original Order</strong> – Provenance keeps
                records by creator; original order maintains the creator's arrangement; both preserve context.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Acquisition Policy</strong> – A cornerstone document that
                defines scope, selection criteria, methods, donor relations, deaccessioning, legal compliance,
                and review procedures.
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
            Sidemann Academic Registry • Archives Acquisition &amp; Collection Development 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;