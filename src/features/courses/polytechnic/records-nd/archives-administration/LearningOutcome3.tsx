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
  Users,
  Settings,
  Award,
  MessageSquare,
  Brain,
  Heart,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'access-policy', label: 'Access Policy' },
  { id: 'finding-aids', label: 'Finding Aids' },
  { id: 'intellectual-legal-physical', label: 'Intellectual/Legal/Physical' },
  { id: 'access-restrictions', label: 'Access Restrictions' },
  { id: 'privacy-confidentiality', label: 'Privacy & Confidentiality' },
  { id: 'reference-services', label: 'Reference Services' },
  { id: 'archivist-skills', label: 'Archivist Skills' },
  { id: 'reference-area', label: 'Reference Area' },
  { id: 'reference-archivist-duties', label: 'Reference Archivist Duties' },
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
        text: 'The principle of "respect des fonds" is fundamental to archival arrangement and description, ensuring that records from different creators are never mixed, preserving their original context.',
      },
      {
        title: 'Pro Tip',
        text: 'Always conduct a thorough reference interview to understand the researcher\'s needs; this helps you guide them to the most relevant materials and saves time for both parties.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three types of access: Intellectual (understanding), Legal (rights), Physical (handling). Each is essential for responsible archival service.',
      },
      {
        title: 'Common Mistake',
        text: 'Many archives overlook the importance of updating finding aids regularly; outdated finding aids frustrate researchers and can make collections seem inaccessible.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The principle of "respect des fonds" is fundamental to archival arrangement and description, ensuring that records from different creators are never mixed, preserving their original context.',
      },
      {
        title: 'Pro Tip',
        text: 'Always conduct a thorough reference interview to understand the researcher\'s needs; this helps you guide them to the most relevant materials and saves time for both parties.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three types of access: Intellectual (understanding), Legal (rights), Physical (handling). Each is essential for responsible archival service.',
      },
      {
        title: 'Common Mistake',
        text: 'Many archives overlook the importance of updating finding aids regularly; outdated finding aids frustrate researchers and can make collections seem inaccessible.',
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
            <FolderTree size={14} className="inline mr-1" /> ARCHIVES ADMINISTRATION
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Access Policy —{' '}
            <span className="text-purple-300 font-bold italic">
              &amp; Reference Services
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to access policies, finding aids, intellectual/legal/physical access,
            restrictions, privacy, and reference services.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <BookOpen size={14} className="inline mr-1" /> Access
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Reference
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Privacy
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
                placeholder="Search for a policy, finding aid, reference service..."
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
            {/* SECTION 1: Developing an Access Policy */}
            <div
              ref={(el) => {
                sectionRefs.current['access-policy'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Developing an Access Policy: Ensuring Responsible Access to Archival Materials
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    An access policy is a formal document that outlines the rules and procedures governing
                    how researchers and the public can access archival materials. It serves as a guide for
                    both the archive and its users, establishing clear expectations and ensuring that access
                    is provided in a fair, consistent, and responsible manner. It balances the need for public
                    access with the archive's responsibility to protect sensitive information and preserve
                    its collections.
                  </p>
</div>

              {renderCard(
                'Qualities of a Good Access Policy',
                <ListChecks size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Clarity and Simplicity:</strong> A good access policy is written in clear and
                    concise language, avoiding jargon and technical terms that may be unfamiliar to users.
                    It should be easily understood by a wide range of individuals, including researchers,
                    students, and members of the public. This ensures that users can readily understand their
                    rights and responsibilities.
                  </li>
                  <li>
                    <strong>Fairness and Equity:</strong> The policy should ensure that access is provided in
                    a fair and equitable manner, regardless of the user's background, affiliation, or research
                    interests. It should avoid discriminatory practices and ensure that all users have equal
                    opportunities to access archival materials. This means that rules apply equally to all users.
                  </li>
                  <li>
                    <strong>Transparency and Predictability:</strong> A good access policy is transparent,
                    clearly outlining the procedures for requesting and obtaining access to archival materials.
                    It should provide predictable timelines and responses, ensuring that users know what to
                    expect. This builds trust and confidence in the archive's services.
                  </li>
                  <li>
                    <strong>Balance Between Access and Protection:</strong> The policy should strike a balance
                    between providing access to archival materials and protecting sensitive information and
                    preserving the collections. It should outline clear guidelines for handling confidential or
                    restricted materials, as well as procedures for preventing damage or loss.
                  </li>
                  <li>
                    <strong>Flexibility and Adaptability:</strong> A good access policy is flexible and
                    adaptable, allowing for adjustments to accommodate changing needs and circumstances. It
                    should be regularly reviewed and updated to reflect new technologies, best practices, and
                    legal requirements.
                  </li>
                  <li>
                    <strong>Compliance with Legal and Ethical Standards:</strong> The policy should comply with
                    all relevant legal and ethical standards, including copyright laws, privacy regulations, and
                    cultural property rights. It should also adhere to professional archival ethics, such as
                    respecting donor restrictions and maintaining confidentiality.
                  </li>
                  <li>
                    <strong>Enforceability and Consistency:</strong> The policy should be enforceable, outlining
                    clear consequences for violations. It should also be consistently applied to all users,
                    ensuring that rules are not selectively enforced. This ensures that the policy is effective
                    and that the archive's resources are protected.
                  </li>
                </ul>
              )}

              {renderCard(
                'Importance of an Archive Access Policy',
                <Award size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Ensuring Consistent Access:</strong> An access policy provides a consistent
                    framework for granting access to archival materials, ensuring that all users are treated
                    fairly and equitably. This avoids arbitrary decisions and ensures that access is based on
                    established criteria.
                  </li>
                  <li>
                    <strong>Protecting Sensitive Information:</strong> The policy outlines procedures for
                    handling confidential or restricted materials, protecting sensitive information from
                    unauthorized disclosure. This is crucial for maintaining privacy and complying with legal
                    requirements.
                  </li>
                  <li>
                    <strong>Preserving Collections:</strong> The policy includes guidelines for handling and
                    using archival materials, minimizing the risk of damage or loss. This ensures that the
                    collections are preserved for future generations.
                  </li>
                  <li>
                    <strong>Facilitating Research:</strong> The policy provides clear procedures for requesting
                    and obtaining access to archival materials, facilitating research and scholarship. This
                    makes it easier for researchers to navigate the archive's holdings.
                  </li>
                  <li>
                    <strong>Promoting Transparency and Accountability:</strong> A publicly available access
                    policy promotes transparency in the archive's operations, building trust and accountability.
                    This demonstrates that the archive is responsible and ethical in its practices.
                  </li>
                  <li>
                    <strong>Managing User Expectations:</strong> The policy sets clear expectations for users,
                    outlining their rights and responsibilities. This helps to avoid misunderstandings and
                    conflicts.
                  </li>
                  <li>
                    <strong>Legal Protection:</strong> A well‑defined access policy helps to protect the archive
                    legally. It can help prove that the archive acted correctly in granting, or denying, access
                    to materials, and that all legal requirements were met.
                  </li>
                </ul>
              )}

              {renderCard(
                'Developing an Archives Access Policy',
                <Settings size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Consult Stakeholders:</strong> Involve archival staff, researchers, and other
                    stakeholders in the policy development process. This ensures that the policy reflects the
                    needs and perspectives of all parties.
                  </li>
                  <li>
                    <strong>Review Existing Policies:</strong> Examine existing access policies from other
                    archival institutions to identify best practices and potential models.
                  </li>
                  <li>
                    <strong>Identify Legal and Ethical Requirements:</strong> Research and identify all relevant
                    legal and ethical requirements, including copyright laws, privacy regulations, and cultural
                    property rights.
                  </li>
                  <li>
                    <strong>Define Access Criteria:</strong> Establish clear criteria for granting access to
                    archival materials, including restrictions on sensitive information and procedures for
                    handling fragile items.
                  </li>
                  <li>
                    <strong>Outline User Responsibilities:</strong> Clearly define the responsibilities of
                    users, including rules for handling materials, citing sources, and respecting copyright.
                  </li>
                  <li>
                    <strong>Establish Access Procedures:</strong> Develop clear and concise procedures for
                    requesting and obtaining access to archival materials, including application forms, timelines,
                    and contact information.
                  </li>
                  <li>
                    <strong>Address Digital Access:</strong> If the archive provides digital access to materials,
                    include guidelines for online access, digital preservation, and data security.
                  </li>
                  <li>
                    <strong>Review and Revise Regularly:</strong> Establish a schedule for regular review and
                    revision of the access policy to ensure that it remains current and relevant.
                  </li>
                  <li>
                    <strong>Publicize the Policy:</strong> Make the access policy readily available to users
                    through the archive's website, reading room, and other communication channels.
                  </li>
                  <li>
                    <strong>Train Staff:</strong> Train all staff members on the access policy and procedures,
                    so that they can correctly implement the policy.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 2: Advantages of Using Finding Aids */}
            <div
              ref={(el) => {
                sectionRefs.current['finding-aids'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Advantages of Using Finding Aids in Archives
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Finding aids are essential tools in archival management, serving as guides that enable
                    researchers to navigate and understand complex archival collections. They provide a
                    structured way to access information, making research more efficient and effective.
                  </p>
</div>

              {renderCard(
                'Advantages',
                <Target size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Facilitating Access and Discovery:</strong> Finding aids provide a roadmap to
                    archival collections, enabling researchers to quickly identify relevant materials. They
                    offer descriptions of the collection's contents, context, and arrangement, allowing
                    researchers to assess its potential value to their research.
                  </li>
                  <li>
                    <strong>Preserving Context and Meaning:</strong> Finding aids preserve the context in which
                    records were created, including information about the creator, the functions and activities
                    that generated the records, and the historical circumstances surrounding their creation.
                    This contextual information is essential for understanding the meaning and significance of
                    the records.
                  </li>
                  <li>
                    <strong>Improving Research Efficiency:</strong> Finding aids save researchers time and effort
                    by providing detailed information about the collection's contents and arrangement. This allows
                    researchers to focus their research efforts on relevant materials, avoiding unnecessary
                    searches.
                  </li>
                  <li>
                    <strong>Promoting Accountability and Transparency:</strong> Finding aids make archival
                    materials more accessible to the public, promoting accountability and transparency. This is
                    particularly important for government archives, which play a crucial role in ensuring that
                    government actions are documented and accessible.
                  </li>
                  <li>
                    <strong>Supporting Preservation Efforts:</strong> By providing detailed descriptions of the
                    collection's contents, finding aids can help to identify fragile or at‑risk materials. This
                    allows archivists to prioritize preservation efforts and ensure the long‑term survival of
                    valuable records.
                  </li>
                  <li>
                    <strong>Standardizing Description:</strong> Finding aids, especially those using standardized
                    metadata schemas, help to standardize archival description. This allows for inter‑institutional
                    searching, and helps researchers to have a consistent experience when using different archives.
                  </li>
                </ul>
              )}

              {renderCard(
                'Different Finding Aids Used in Archives',
                <ListChecks size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Shelf List:</strong> A shelf list is a basic inventory of the archive's holdings,
                    arranged by storage location. It provides a simple list of the collections stored on each
                    shelf, typically including the collection title, accession number, and physical extent. It is
                    primarily used for inventory control and space management.
                  </li>
                  <li>
                    <strong>Select List:</strong> A select list provides a curated selection of records related
                    to a specific topic or theme. It is often used for exhibitions, publications, or research
                    guides, highlighting key items or collections of interest.
                  </li>
                  <li>
                    <strong>Register:</strong> A register is a chronological list of accessions, documenting the
                    acquisition of archival materials. It provides information about the donor, date of
                    acquisition, and a brief description of the records. It is primarily used for administrative
                    and legal purposes.
                  </li>
                  <li>
                    <strong>Item List:</strong> An item list provides a detailed description of each individual
                    item within a collection. It is typically used for small collections or for records of
                    particular significance. This type of finding aid is very granular.
                  </li>
                  <li>
                    <strong>Inventory:</strong> An inventory provides a detailed description of the contents and
                    arrangement of a collection. It typically includes a collection‑level description, series
                    descriptions, and container lists. It is a more comprehensive finding aid than a shelf list
                    or register.
                  </li>
                  <li>
                    <strong>Index:</strong> An index provides an alphabetical list of names, subjects, or other
                    keywords that appear in the records. It allows researchers to quickly locate specific
                    information within a collection.
                  </li>
                  <li>
                    <strong>Folder List:</strong> A folder list provides a detailed list of the contents of each
                    folder within a collection. This is used when the folder is the most granular level of
                    description.
                  </li>
                  <li>
                    <strong>Database:</strong> A database is a computerized finding aid that allows researchers
                    to search and retrieve information using various search criteria. Databases can be used to
                    manage and provide access to large and complex collections.
                  </li>
                  <li>
                    <strong>Catalogue:</strong> A catalogue is a comprehensive listing of the holdings of an
                    archive, or part of an archive. It can be in book form, or a digital catalogue. It often
                    includes detailed descriptions, and indexing.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 3: Analyzing Intellectual, Legal, and Physical Access */}
            <div
              ref={(el) => {
                sectionRefs.current['intellectual-legal-physical'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Analyzing Intellectual, Legal, and Physical Access in Archives
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Access to archival materials is a multifaceted concept, encompassing intellectual, legal,
                    and physical dimensions. Each of these aspects must be carefully considered to ensure that
                    records are both accessible and protected.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Intellectual Access',
                    icon: <Brain size={16} />,
                    content: (
                      <>
                        <p>
                          Intellectual access refers to the ability of researchers to understand and interpret
                          the content of archival materials. It involves providing descriptive tools, such as
                          finding aids, indexes, and metadata, that enable users to locate and comprehend relevant
                          information. Intellectual access is facilitated by proper arrangement and description,
                          ensuring that records are organized and contextualized.
                        </p>
                        <p className="mt-2">
                          This form of access is crucial for enabling meaningful research and scholarship. Without
                          adequate intellectual access, researchers would struggle to navigate complex collections
                          and extract valuable insights. Effective intellectual access requires archivists to
                          create accurate and comprehensive finding aids that provide detailed information about
                          the provenance, content, and arrangement of records. This also includes the use of
                          controlled vocabularies, and indexes, to help researchers find materials, even if they
                          use slightly different search terms.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Legal Access',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>
                          Legal access concerns the rights and restrictions governing the use of archival
                          materials. It involves ensuring compliance with copyright laws, privacy regulations, and
                          any donor‑imposed restrictions. Legal access also addresses issues related to cultural
                          property rights and the repatriation of records.
                        </p>
                        <p className="mt-2">
                          Archives must carefully consider legal implications before providing access to records.
                          This includes obtaining necessary permissions, protecting sensitive information, and
                          complying with all applicable laws and regulations. Legal access is essential for
                          protecting the rights of individuals and organizations, as well as for ensuring the
                          ethical and responsible use of archival materials. This also means understanding, and
                          upholding, any legal agreements that the archive has made with donors.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Physical Access',
                    icon: <User size={16} />,
                    content: (
                      <>
                        <p>
                          Physical access refers to the ability of researchers to physically examine archival
                          materials. It involves providing appropriate facilities, such as reading rooms and
                          research areas, and implementing procedures for handling and retrieving records.
                          Physical access also includes ensuring the preservation of fragile or at‑risk materials.
                        </p>
                        <p className="mt-2">
                          Archives must balance the need to provide physical access with the need to protect their
                          collections from damage or deterioration. This involves implementing measures such as
                          environmental controls, security systems, and handling guidelines. Physical access is
                          essential for enabling researchers to conduct in‑depth research and examine original
                          documents. This also includes providing access to digital copies of materials, when
                          appropriate.
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

            {/* SECTION 4: Access Restrictions */}
            <div
              ref={(el) => {
                sectionRefs.current['access-restrictions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Access Restrictions
              </h2>

              {renderCard(
                'Importance of Access Restrictions',
                <Lock size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Protecting Privacy:</strong> Access restrictions are essential for protecting the
                    privacy of individuals whose information is contained in archival records. This includes
                    medical records, personnel files, and other sensitive documents.
                  </li>
                  <li>
                    <strong>Ensuring Confidentiality:</strong> Access restrictions protect confidential
                    information, such as business secrets, legal documents, and government intelligence. This is
                    crucial for maintaining trust and protecting the interests of organizations and individuals.
                  </li>
                  <li>
                    <strong>Complying with Legal Requirements:</strong> Access restrictions are necessary to
                    comply with legal requirements, such as copyright laws, data protection regulations, and
                    freedom of information acts.
                  </li>
                  <li>
                    <strong>Preserving Fragile Materials:</strong> Access restrictions can be used to limit
                    handling of fragile or at‑risk materials, preventing further damage or deterioration.
                  </li>
                  <li>
                    <strong>Honoring Donor Restrictions:</strong> Access restrictions are often imposed by
                    donors as a condition of their gift. Archives must honor these restrictions to maintain trust
                    and encourage future donations.
                  </li>
                  <li>
                    <strong>Protecting National Security:</strong> Access restrictions are necessary to protect
                    national security information, such as classified government documents and military records.
                  </li>
                  <li>
                    <strong>Maintaining Ethical Standards:</strong> Access restrictions help to maintain ethical
                    standards by preventing the release of information that could cause harm or distress to
                    individuals or communities. This includes protecting culturally sensitive information.
                  </li>
                </ul>
              )}

              {renderCard(
                'Applying Access Restrictions to Archival Materials',
                <Lock size={16} />,
                <div>
                  <p className="mb-2">
                    Access restrictions are applied to archival materials to balance the public's right to
                    information with the need to protect sensitive data, preserve collections, and uphold legal
                    and ethical obligations. Here's how these restrictions are applied in specific scenarios:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Protected Personally Identifiable Information (PII):</strong> PII, such as social
                      security numbers, medical records, and financial details, is subject to strict access
                      restrictions to protect individual privacy. These restrictions are often mandated by
                      privacy laws and regulations, such as GDPR or HIPAA. Access is typically limited to
                      authorized personnel or researchers who have obtained explicit permission from the data
                      subject or a legal representative. In some cases, redaction or anonymization techniques
                      may be used to remove PII before records are made accessible. The application of these
                      restrictions ensures that individuals' privacy rights are respected and that sensitive
                      information is not disclosed without proper authorization.
                    </li>
                    <li>
                      <strong>Classified or Closed Records:</strong> Classified or closed records, such as
                      government intelligence, national security documents, or confidential business records,
                      are subject to access restrictions to protect sensitive information that could harm
                      national security, economic interests, or organizational operations. These restrictions
                      are often imposed by legal statutes or internal policies, and access is typically limited
                      to individuals with appropriate security clearances or authorization. Time‑based
                      restrictions are also common, with records becoming accessible after a specified period
                      has elapsed. These restrictions are vital to maintain security and to prevent the
                      disclosure of information that could jeopardize public safety or organizational interests.
                    </li>
                    <li>
                      <strong>Donor Agreements:</strong> Donor agreements often include specific access
                      restrictions as a condition of the gift. These restrictions may limit access to certain
                      portions of the collection, impose time‑based restrictions, or require researchers to
                      obtain permission from the donor or their heirs before accessing the records. Archives
                      must honor these restrictions to maintain trust with donors and to ensure that the donor's
                      wishes are respected. Failure to comply with donor agreements can lead to legal challenges
                      and damage the archive's reputation. These agreements are legally binding, and vital to
                      good donor relations.
                    </li>
                    <li>
                      <strong>Cultural Protections:</strong> Cultural protections are applied to archival
                      materials that are considered sacred, culturally sensitive, or of particular significance
                      to specific communities or indigenous groups. These restrictions are often imposed to
                      protect cultural heritage, prevent exploitation, or ensure that records are used in a
                      culturally appropriate manner. Access may be limited to authorized community members,
                      researchers with specific cultural expertise, or individuals who have obtained permission
                      from community leaders. These restrictions are essential for respecting cultural diversity
                      and ensuring that archival materials are used in a responsible and ethical manner.
                    </li>
                    <li>
                      <strong>Preservation Risks:</strong> Access restrictions are applied to fragile or
                      at‑risk materials to prevent further damage or deterioration. This may involve limiting
                      physical access to the original records and providing researchers with digital copies or
                      microfilm instead. In some cases, access may be restricted to authorized personnel who
                      have received specialized training in handling fragile materials. These restrictions are
                      crucial for ensuring the long‑term preservation of valuable records and preventing
                      irreparable damage.
                    </li>
                    <li>
                      <strong>Unprocessed Collections:</strong> Unprocessed collections are often subject to
                      access restrictions because their contents and arrangement are not yet fully understood.
                      Providing access to unprocessed materials can be challenging for both researchers and
                      archives, as it may be difficult to locate specific items or understand their context.
                      Access may be limited to authorized personnel who are involved in processing the collection,
                      or researchers who have obtained special permission. Restrictions are lifted when the
                      collection has been properly arranged and described. This prevents damage to collections
                      while they are in a vulnerable state, and before a finding aid exists.
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* SECTION 5: Privacy and Confidentiality Concerns */}
            <div
              ref={(el) => {
                sectionRefs.current['privacy-confidentiality'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Privacy and Confidentiality Concerns in Archival Records
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Archival records often contain sensitive information about individuals, organizations, and
                    events, raising significant privacy and confidentiality concerns. These concerns are
                    multifaceted, involving legal limitations, ethical considerations, and the constant need to
                    balance public access with the protection of private data.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Limits of the Law',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p>
                          Legal frameworks governing privacy and confidentiality vary significantly across
                          jurisdictions, creating a complex landscape for archives. Laws such as GDPR (General
                          Data Protection Regulation), HIPAA (Health Insurance Portability and Accountability Act),
                          and national data protection acts impose strict requirements on the handling of
                          personally identifiable information (PII). Archives must navigate these legal
                          complexities to ensure compliance, which often involves implementing access restrictions,
                          redaction policies, and data anonymization techniques.
                        </p>
                        <p className="mt-2">
                          The limits of the law can also be ambiguous, particularly when dealing with historical
                          records that predate modern privacy legislation. In such cases, archives must rely on
                          professional judgment and ethical guidelines to determine appropriate access levels.
                          Furthermore, laws can change, requiring archives to stay updated and adapt their
                          practices. There may also be legal restrictions placed on certain records, such as court
                          records or national security documents, that limit the ability of the archive to provide
                          access.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Legal Concerns',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>
                          Legal concerns in archival records extend beyond general privacy laws. Archives must
                          also consider issues such as copyright, intellectual property rights, and freedom of
                          information acts. Copyright laws, for example, can restrict the reproduction and
                          distribution of copyrighted materials, while freedom of information acts may require
                          archives to release certain records to the public, even if they contain sensitive
                          information.
                        </p>
                        <p className="mt-2">
                          Legal disputes can arise from the release or withholding of archival records,
                          particularly when dealing with controversial or sensitive topics. Archives must maintain
                          meticulous documentation of their access decisions and be prepared to defend their
                          actions in court if necessary. This can require archives to seek legal counsel, and to
                          develop clear policies that address potential legal challenges.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Ethical Concerns',
                    icon: <Heart size={16} />,
                    content: (
                      <>
                        <p>
                          Ethical concerns in archival records go beyond legal requirements, encompassing issues
                          of fairness, respect, and social responsibility. Archives have a duty to protect the
                          privacy and confidentiality of individuals and organizations, even when not explicitly
                          required by law. This involves considering the potential impact of releasing sensitive
                          information on individuals, families, and communities.
                        </p>
                        <p className="mt-2">
                          Ethical dilemmas can arise when balancing the public's right to know with the need to
                          protect private information. For example, archives may need to decide whether to release
                          records that could reveal past injustices or harm the reputation of individuals or
                          organizations. In such cases, archivists must weigh the potential benefits of access
                          against the potential harms, making difficult decisions based on ethical principles and
                          professional judgment.
                        </p>
                        <p className="mt-2">
                          Furthermore, archives must consider the ethical implications of digitization and online
                          access. While digitization can enhance access, it also increases the risk of unauthorized
                          disclosure and misuse of sensitive information. Archives must implement robust security
                          measures and develop clear policies for online access to mitigate these risks. This
                          includes considering the cultural sensitivity of certain materials, and the need to
                          consult with communities before releasing records.
                        </p>
                        <p className="mt-2">
                          Finally, archives must also consider the ethical implications of donor restrictions, and
                          ensure that they are not used to suppress information that is in the public interest.
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

            {/* SECTION 6: Reference Services */}
            <div
              ref={(el) => {
                sectionRefs.current['reference-services'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Reference Services in Archives: Guiding Researchers to Information
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Reference services in archives are a vital component of making archival materials accessible
                    and usable. They encompass a range of activities designed to assist researchers in navigating
                    collections, understanding their context, and locating relevant information. Essentially,
                    reference services bridge the gap between researchers and the often complex and unique
                    materials held within an archive.
                  </p>
                  <p className="mt-2">
                    Reference services go beyond simply retrieving documents. They involve providing expert
                    guidance, interpreting archival descriptions, and helping researchers formulate effective
                    research strategies. Archivists working in reference services possess in‑depth knowledge of
                    the archive's holdings, as well as expertise in research methodologies and information
                    retrieval techniques. They act as intermediaries, helping researchers to understand the
                    provenance, context, and potential limitations of archival materials.
                  </p>
</div>

              {renderCard(
                'Types of Reference Interviews',
                <MessageSquare size={16} />,
                <div>
                  <p className="mb-2">
                    The reference interview is a crucial interaction between the archivist and the researcher,
                    aimed at clarifying the research question and identifying relevant resources. Different
                    types of interviews are employed depending on the researcher's needs and the complexity of
                    their inquiry.
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Ready Reference Interview:</strong> This type of interview involves answering
                      quick, factual questions that require minimal research. Examples include providing
                      information about the archive's hours of operation, location of specific collections, or
                      basic finding aid assistance. Ready reference interviews are typically brief and
                      straightforward, providing immediate answers to simple inquiries.
                    </li>
                    <li>
                      <strong>Research Consultation Interview:</strong> Research consultation interviews are
                      more in‑depth, involving a collaborative process between the archivist and the researcher.
                      These interviews are used to clarify research questions, identify relevant collections,
                      and develop research strategies. The archivist provides guidance on the scope and
                      limitations of the archive's holdings, as well as advice on effective research techniques.
                      This type of interview is essential for researchers undertaking complex or in‑depth
                      research projects. These interviews help to refine the research question, and to help the
                      researcher find the best materials.
                    </li>
                    <li>
                      <strong>Instructional Interview:</strong> Instructional interviews focus on teaching
                      researchers how to use archival resources and conduct archival research. This may involve
                      demonstrating how to use finding aids, explaining archival principles, or providing
                      guidance on citing archival materials. Instructional interviews are often conducted with
                      groups of students or researchers who are new to archival research. These interviews help
                      to build research skills and empower users to conduct independent research.
                    </li>
                    <li>
                      <strong>Subject‑Specific Interview:</strong> Subject‑specific interviews involve providing
                      expert guidance on research topics that require specialized knowledge. Archivists with
                      expertise in specific subject areas, such as history, genealogy, or law, can provide
                      in‑depth assistance to researchers working on related projects. These interviews help
                      researchers to identify relevant sources, interpret complex records, and understand the
                      historical context of their research.
                    </li>
                    <li>
                      <strong>Follow‑Up Interview:</strong> A follow up interview occurs after a researcher has
                      begun their research. This allows the archivist to determine if the researcher is finding
                      the information that they need, and if they require further assistance. It also allows the
                      archivist to gather feedback on their previous assistance.
                    </li>
                    <li>
                      <strong>Virtual Reference Interview:</strong> With the rise of digital archives, and
                      remote researchers, virtual reference interviews have become more common. This type of
                      interview occurs through email, chat, or video conferencing. Virtual reference interviews
                      allow researchers to access archival expertise from anywhere in the world.
                    </li>
                  </ul>
                  <p className="mt-2">
                    Reference interviews, regardless of type, are crucial for ensuring that researchers make
                    the most of their time in the archive. They provide a personalized approach to archival
                    research, enhancing the accessibility and usability of archival materials.
                  </p>
                </div>
              )}
            </div>

            {/* SECTION 7: Analyzing Archivist Skills for Reference Services */}
            <div
              ref={(el) => {
                sectionRefs.current['archivist-skills'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Analyzing Archivist Skills for Reference Services
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Effective reference services in archives rely on a diverse set of skills, encompassing
                    intellectual, administrative, and interpersonal abilities. These skills enable archivists
                    to guide researchers, interpret complex materials, and provide a positive research experience.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Intellectual Skills',
                    icon: <Brain size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Research Expertise:</strong> Archivists must possess strong research skills,
                          including the ability to formulate research questions, identify relevant sources, and
                          evaluate information critically. They need to understand research methodologies and be
                          familiar with various research tools and techniques. This expertise allows them to guide
                          researchers effectively and help them develop sound research strategies.
                        </li>
                        <li>
                          <strong>Subject Knowledge:</strong> Archivists often develop expertise in specific
                          subject areas related to their archive's holdings. This subject knowledge enables them
                          to provide in‑depth assistance to researchers working on related projects. They can
                          interpret complex records, understand historical context, and identify relevant sources
                          that might be overlooked by general researchers.
                        </li>
                        <li>
                          <strong>Analytical and Interpretive Skills:</strong> Archivists must be able to analyze
                          and interpret archival materials, understanding their provenance, context, and potential
                          limitations. They need to be able to synthesize information from various sources and
                          draw meaningful conclusions. These skills are crucial for providing accurate and
                          insightful guidance to researchers.
                        </li>
                        <li>
                          <strong>Knowledge of Archival Theory and Practice:</strong> A strong foundation in
                          archival theory and practice is essential. This includes understanding principles of
                          arrangement and description, preservation techniques, and access policies. This knowledge
                          enables archivists to manage collections effectively and provide informed guidance to
                          researchers.
                        </li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Administrative Skills',
                    icon: <Settings size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Organization and Time Management:</strong> Archivists must be highly organized
                          and able to manage their time effectively. Reference services often involve handling
                          multiple inquiries simultaneously, requiring the ability to prioritize tasks and meet
                          deadlines.
                        </li>
                        <li>
                          <strong>Record Keeping and Documentation:</strong> Accurate record keeping is essential
                          for tracking researcher requests, documenting reference interactions, and maintaining
                          statistics. This ensures accountability and helps to improve reference services over
                          time.
                        </li>
                        <li>
                          <strong>Policy and Procedure Implementation:</strong> Archivists must be familiar with
                          and able to implement archival policies and procedures related to access, handling, and
                          reproduction of materials. This ensures consistency and compliance with legal and ethical
                          standards.
                        </li>
                        <li>
                          <strong>Technology Proficiency:</strong> Archivists must be proficient in using various
                          technologies, including archival management systems, online databases, and digital
                          imaging software. This enables them to provide access to digital resources and assist
                          researchers with digital research tools.
                        </li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Interpersonal Skills',
                    icon: <Users size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Communication and Listening Skills:</strong> Effective communication is
                          paramount. Archivists must be able to listen attentively to researchers' inquiries,
                          ask clarifying questions, and communicate information clearly and concisely. They must
                          also be able to adapt their communication style to different audiences.
                        </li>
                        <li>
                          <strong>Patience and Empathy:</strong> Researchers may be unfamiliar with archival
                          research or may be frustrated by the complexities of their inquiry. Archivists must be
                          patient, empathetic, and able to provide support and encouragement.
                        </li>
                        <li>
                          <strong>Customer Service Orientation:</strong> Archivists must have a strong customer
                          service orientation, prioritizing the needs of researchers and providing a positive
                          research experience. This includes being approachable, helpful, and responsive to
                          inquiries.
                        </li>
                        <li>
                          <strong>Collaboration and Teamwork:</strong> Reference services often involve
                          collaboration with other archival staff, as well as with researchers from various
                          disciplines. Archivists must be able to work effectively in teams and build positive
                          relationships with colleagues and researchers.
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

            {/* SECTION 8: Features of a Reference Area */}
            <div
              ref={(el) => {
                sectionRefs.current['reference-area'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Features of a Reference Area in Archives
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A well‑designed reference area is essential for providing effective and efficient reference
                    services. It should be a welcoming and functional space that supports research and
                    facilitates interaction between archivists and researchers.
                  </p>
</div>

              {renderCard(
                'Key Features',
                <Layout size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Comfortable and Accessible Environment:</strong> The reference area should be
                    comfortable, well‑lit, and accessible to all users, including those with disabilities. This
                    includes providing adequate seating, workspace, and lighting.
                  </li>
                  <li>
                    <strong>Research Stations and Equipment:</strong> The reference area should provide research
                    stations equipped with computers, internet access, and other necessary equipment. This includes
                    access to microfilm readers, scanners, and other specialized research tools.
                  </li>
                  <li>
                    <strong>Finding Aids and Reference Materials:</strong> The reference area should house finding
                    aids, reference books, and other resources that are essential for archival research. This
                    includes printed finding aids, online databases, and subject‑specific reference materials.
                  </li>
                  <li>
                    <strong>Staff Assistance Area:</strong> A designated area should be provided for archivists
                    to assist researchers. This area should be equipped with computers, telephones, and other
                    tools that enable archivists to respond to inquiries and provide guidance.
                  </li>
                  <li>
                    <strong>Security and Monitoring:</strong> The reference area should be monitored to ensure
                    the security of archival materials and the safety of researchers. This may involve surveillance
                    cameras, access controls, and security personnel.
                  </li>
                  <li>
                    <strong>Reproduction Services:</strong> The reference area should provide reproduction
                    services, such as photocopying, scanning, and digital imaging. This allows researchers to
                    obtain copies of relevant materials for their research.
                  </li>
                  <li>
                    <strong>Reading Room Rules and Guidelines:</strong> Clear and concise reading room rules and
                    guidelines should be posted in the reference area. This ensures that researchers understand
                    their responsibilities and that the collections are handled properly.
                  </li>
                  <li>
                    <strong>Quiet Study Area:</strong> A designated quiet study area should be provided for
                    researchers who need to concentrate on their work. This area should be free from distractions
                    and noise.
                  </li>
                  <li>
                    <strong>Consultation Area:</strong> A private consultation area should be provided for
                    in‑depth research consultations between archivists and researchers.
                  </li>
                  <li>
                    <strong>Digital Access Points:</strong> If the archive provides digital access to materials,
                    the reference area should include access points for online databases and digital collections.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 9: Duties of a Reference Archivist */}
            <div
              ref={(el) => {
                sectionRefs.current['reference-archivist-duties'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Duties of a Reference Archivist
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Reference archivists play a crucial role in connecting researchers with archival materials.
                    Their duties are diverse, encompassing direct assistance to researchers, management of the
                    reference area, and contributions to the overall accessibility of archival collections.
                  </p>
</div>

              {renderCard(
                'Key Duties',
                <ClipboardList size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Providing Research Assistance:</strong> A primary duty of a reference archivist is
                    to assist researchers in navigating archival collections and locating relevant materials.
                    This involves conducting reference interviews to clarify research questions, providing
                    guidance on finding aids and other research tools, and offering expert advice on research
                    strategies. They must possess a deep understanding of the archive's holdings and be able to
                    translate complex archival descriptions into accessible information. This assistance can
                    range from answering quick factual questions to providing in‑depth research consultations.
                  </li>
                  <li>
                    <strong>Answering Reference Inquiries:</strong> Reference archivists respond to a wide range
                    of inquiries from researchers, both in person and remotely. This includes answering questions
                    about the archive's holdings, policies, and procedures, as well as providing information about
                    specific records or collections. They may use various communication channels, such as phone,
                    email, and online chat, to respond to inquiries promptly and effectively. This also entails
                    the ability to locate information quickly, and accurately.
                  </li>
                  <li>
                    <strong>Creating and Maintaining Finding Aids:</strong> Reference archivists contribute to
                    the creation and maintenance of finding aids, which are essential tools for accessing archival
                    materials. They may be involved in writing collection‑level descriptions, series descriptions,
                    and item‑level descriptions. They also ensure that finding aids are accurate, up‑to‑date, and
                    accessible to researchers. This helps to improve intellectual access to archival materials.
                  </li>
                  <li>
                    <strong>Providing Instruction and Outreach:</strong> Reference archivists often provide
                    instruction to researchers on how to use archival resources and conduct archival research.
                    This may involve conducting workshops, giving presentations, or creating online tutorials.
                    They also participate in outreach activities, such as exhibitions and public programs, to
                    promote the use of archival materials. This helps to educate the public on the importance of
                    archives.
                  </li>
                  <li>
                    <strong>Managing the Reference Area:</strong> Reference archivists are responsible for
                    managing the reference area, ensuring that it is a welcoming and functional space for
                    researchers. This includes maintaining a clean and organized environment, providing access
                    to necessary equipment and resources, and enforcing reading room rules and guidelines. They
                    also monitor the use of archival materials and ensure their proper handling.
                  </li>
                </ul>
              )}

              {renderCard(
                'Providing Reference Services and Managing the Reference Area',
                <Layout size={16} />,
                <div>
                  <p>
                    The provision of reference services and the management of the reference area are intrinsically
                    linked. A well‑managed reference area supports effective reference services, while effective
                    reference services contribute to a positive and productive research environment.
                  </p>
                  <p className="mt-2">
                    Reference archivists strive to create a welcoming and supportive environment for researchers.
                    They are patient, empathetic, and committed to providing high‑quality assistance. They also
                    ensure that the reference area is equipped with the necessary tools and resources, such as
                    computers, finding aids, and reference materials.
                  </p>
                  <p className="mt-2">
                    Managing the reference area also involves ensuring the security and preservation of archival
                    materials. Reference archivists monitor the use of records and enforce handling guidelines to
                    prevent damage or loss. They also ensure that the reference area is secure and that only
                    authorized individuals have access to restricted materials.
                  </p>
                  <p className="mt-2">
                    In essence, reference archivists are the public face of the archive, bridging the gap between
                    researchers and the collections. Their work is essential for making archival materials
                    accessible and usable, contributing to research, scholarship, and public understanding of
                    history.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Access Insight
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
                  <span>Access Policy Qualities</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Finding Aid Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">9</span>
                </li>
                <li className="flex justify-between">
                  <span>Reference Interview Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Archivist Skill Categories</span>
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
                An access policy balances public access with protection of sensitive information.
                Finding aids are essential guides that enable discovery and preserve context.
                Intellectual, legal, and physical access are interdependent. Access restrictions
                protect privacy, confidentiality, and national security. Privacy and confidentiality
                concerns involve legal limits, legal obligations, and ethical responsibilities.
                Reference services include various types of interviews and require intellectual,
                administrative, and interpersonal skills. A well‑designed reference area supports
                research, and reference archivists have diverse duties that make collections accessible.
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
                <strong className="text-white">Access Policy</strong> – A formal document balancing public
                access with protection of sensitive information; qualities include clarity, fairness,
                transparency, and legal compliance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Finding Aids</strong> – Essential tools (shelf lists, registers,
                inventories, indexes, databases) that facilitate discovery, preserve context, and improve
                research efficiency.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Intellectual, Legal, Physical Access</strong> – Intellectual
                (understanding content), Legal (rights and restrictions), Physical (handling and facilities)
                are interdependent.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Access Restrictions</strong> – Protect privacy, confidentiality,
                national security, and cultural heritage; imposed by law, donor agreements, or preservation needs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Privacy &amp; Confidentiality</strong> – Governed by legal
                frameworks and ethical principles; archives must balance access with protection of sensitive
                information.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Reference Services</strong> – Include various interview types
                (ready reference, research consultation, instructional) and require intellectual, administrative,
                and interpersonal skills.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Reference Archivist Duties</strong> – Provide research assistance,
                answer inquiries, create finding aids, offer instruction, manage the reference area, and ensure
                security and preservation.
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
            Sidemann Academic Registry • Access Policy &amp; Reference Services 3.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;