import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Tags,
  FolderTree,
  Search,
  Layout,
  Calendar,
  Shield,
  BarChart,
  ShieldAlert,
  Fingerprint,
  CheckCircle,
  PenTool,
  Scale,
  Link,
  Zap,
  Clock,
  Trash2,
  ClipboardList,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
  FileText,
  Database,
  RefreshCw,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'classification', label: 'Classification' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'verification', label: 'Verification' },
  { id: 'scheme', label: 'Classification Scheme' },
  { id: 'manual-electronic', label: 'Manual vs Electronic' },
  { id: 'methods', label: 'Methods' },
  { id: 'codes', label: 'Classification Codes' },
  { id: 'inventory', label: 'Record Inventory' },
  { id: 'types', label: 'Types of Records' },
  { id: 'inventory-benefits', label: 'Inventory Benefits' },
  { id: 'components', label: 'Inventory Components' },
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
        text: 'Classification is the foundation of effective records management. A well-designed classification scheme can reduce retrieval time by up to 80%.',
      },
      {
        title: 'Pro Tip',
        text: 'When designing a classification scheme, involve end-users early in the process. Their input ensures the scheme is practical and meets their needs.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the seven classification methods with the acronym "F-S-C-A-G-N-H": Functional, Subject-based, Chronological, Alphabetical, Geographical, Numerical, Hybrid.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations overlook the importance of regular inventory updates. An outdated inventory is as useless as no inventory at all.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Classification is the foundation of effective records management. A well-designed classification scheme can reduce retrieval time by up to 80%.',
      },
      {
        title: 'Pro Tip',
        text: 'When designing a classification scheme, involve end-users early in the process. Their input ensures the scheme is practical and meets their needs.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the seven classification methods with the acronym "F-S-C-A-G-N-H": Functional, Subject-based, Chronological, Alphabetical, Geographical, Numerical, Hybrid.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations overlook the importance of regular inventory updates. An outdated inventory is as useless as no inventory at all.',
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
            <Tags size={14} className="inline mr-1" /> RECORDS MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Classification &amp;{' '}
            <span className="text-sky-300 font-bold italic">
              Records Inventory
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to classification benefits, verification of documents, classification schemes, manual vs electronic systems, classification methods, classification codes, record inventory, types of records, and inventory components.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FolderTree size={14} className="inline mr-1" /> Classification
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Search size={14} className="inline mr-1" /> Inventory
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Verification
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
                placeholder="Search for a concept, method, inventory component..."
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
                Introduction to Classification &amp; Records Inventory
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Classification is the process of organizing items or information into categories or groups based on shared characteristics or criteria. In the context of records management, classification involves systematically arranging records according to their function, subject, or other relevant attributes. This allows for efficient retrieval, management, and disposition of information. A records inventory is a comprehensive listing of all records held by an organisation, documenting their location, format, and key attributes. Together, classification and inventory form the foundation of effective records management.
                  </p>
</div>
            </div>

            {/* SECTION 2: Classification */}
            <div
              ref={(el) => {
                sectionRefs.current['classification'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Classification
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Classification is the process of organizing items or information into categories or groups based on shared characteristics or criteria. In the context of records management, classification involves systematically arranging records according to their function, subject, or other relevant attributes. This allows for efficient retrieval, management, and disposition of information. It is essentially creating a structured system for organizing information, making it easier to find, understand, and use.
                  </p>
</div>
            </div>

            {/* SECTION 3: Benefits of Classification */}
            <div
              ref={(el) => {
                sectionRefs.current['benefits'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Benefits of Classification
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Enhanced Information Retrieval',
                    icon: <Search size={16} />,
                    content: 'Classification creates a structured system that allows for quick and efficient retrieval of information. By categorizing records based on their content, function, or subject, users can easily locate the documents they need. This is especially crucial in organisations with large volumes of records. For example, a well-classified database of customer records allows sales representatives to quickly access customer information, improving response times and customer service.',
                  },
                  {
                    title: 'Improved Organisation and Efficiency',
                    icon: <Layout size={16} />,
                    content: 'Classification promotes a well-organised and efficient record-keeping system. By grouping similar records together, organisations can streamline their workflows and reduce redundancy. This helps to prevent the creation of duplicate records and ensures that information is stored consistently. For instance, classifying financial documents by fiscal year and account type allows for easy tracking of expenses and revenue.',
                  },
                  {
                    title: 'Consistent Application of Retention Schedules',
                    icon: <Calendar size={16} />,
                    content: 'Classification is essential for applying consistent retention schedules to records. Retention schedules dictate how long different types of records should be kept, based on legal, regulatory, and business requirements. By classifying records according to their function or subject, organisations can easily apply the appropriate retention schedules to each category. This ensures compliance with legal and regulatory obligations and prevents the unnecessary storage of outdated or irrelevant records.',
                  },
                  {
                    title: 'Enhanced Compliance and Legal Protection',
                    icon: <Shield size={16} />,
                    content: 'Classification helps organisations comply with legal and regulatory requirements by ensuring that records are properly managed and retained. This is especially important for organisations in highly regulated industries, such as finance, healthcare, and law. By classifying records according to their legal or regulatory significance, organisations can easily identify and manage records that are subject to specific compliance requirements.',
                  },
                  {
                    title: 'Facilitated Data Analysis and Reporting',
                    icon: <BarChart size={16} />,
                    content: 'Classification enables organisations to analyse and report on their data more effectively. By grouping records into meaningful categories, organisations can easily extract and analyse relevant information. This facilitates the creation of reports, dashboards, and other data visualisations that provide valuable insights into business operations.',
                  },
                  {
                    title: 'Improved Information Security',
                    icon: <ShieldAlert size={16} />,
                    content: 'Classification plays a crucial role in enhancing information security by allowing organisations to apply appropriate security controls to different categories of records. Sensitive or confidential records can be classified and protected with stricter access controls, encryption, and other security measures. For example, classifying employee records as "confidential" allows for the implementation of access restrictions and encryption to protect sensitive personal information.',
                  },
                  {
                    title: 'Support for Business Continuity and Disaster Recovery',
                    icon: <Shield size={16} />,
                    content: 'Classification supports business continuity and disaster recovery by ensuring that critical records are properly backed up and stored in secure locations. In the event of a disaster, such as a fire, flood, or cyberattack, classified records can be quickly recovered, minimising downtime and disruption. For example, classifying financial records as "critical" ensures that they are backed up regularly and stored in off-site locations.',
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

            {/* SECTION 4: Verification of Documents */}
            <div
              ref={(el) => {
                sectionRefs.current['verification'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Verification of Documents
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Verification of documents is a critical process across various sectors, ensuring that information is accurate, authentic, and reliable. It is about establishing trust and validity, whether for legal, financial, or personal purposes.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Authentication of Origin',
                    icon: <Fingerprint size={16} />,
                    content: 'This point focuses on confirming that the document originated from the purported source. It is about verifying the creator or issuer of the document. For instance, verifying a university degree involves confirming that it was issued by the named institution. This can involve contacting the issuing organisation directly, checking official databases, or using specialised verification services.',
                  },
                  {
                    title: 'Validation of Content',
                    icon: <CheckCircle size={16} />,
                    content: 'This step involves confirming the accuracy and completeness of the information contained within the document. It is about ensuring that the data presented is correct and consistent. For example, validating a financial statement involves checking that the numbers and figures match supporting documentation and comply with accounting standards.',
                  },
                  {
                    title: 'Verification of Signatures and Seals',
                    icon: <PenTool size={16} />,
                    content: 'Signatures and seals are often used to authenticate documents and signify their official status. Verifying signatures and seals involves confirming their authenticity and validity. This can involve comparing signatures with official records, checking for official seals or stamps, or using forensic analysis techniques.',
                  },
                  {
                    title: 'Confirmation of Legal Validity',
                    icon: <Scale size={16} />,
                    content: 'This step involves verifying that the document complies with all applicable laws and regulations. It is about ensuring that the document is legally binding and enforceable. For example, verifying a contract involves checking that it meets all legal requirements for validity, such as offer, acceptance, and consideration.',
                  },
                  {
                    title: 'Cross-Referencing with External Sources',
                    icon: <Link size={16} />,
                    content: 'This involves comparing the information in the document with data from external sources to verify its accuracy and consistency. For example, verifying a person\'s identity might involve cross-referencing their information with government databases, credit bureaus, or public records.',
                  },
                  {
                    title: 'Ensuring Document Integrity',
                    icon: <Shield size={16} />,
                    content: 'This point focuses on ensuring that the document has not been altered or tampered with since its creation. It is about maintaining the document\'s original state and preventing unauthorised modifications. This can involve using tamper-evident seals, watermarks, or security features.',
                  },
                  {
                    title: 'Maintaining Chain of Custody',
                    icon: <Link size={16} />,
                    content: 'This involves documenting the history of a document\'s handling and possession. It is about tracking who has accessed, modified, or stored the document and when. This is especially important for legal documents and evidence. Maintaining a clear chain of custody ensures that the document\'s integrity is preserved and that it can be traced back to its original source.',
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

            {/* SECTION 5: Factors to Consider When Selecting a Classification Scheme */}
            <div
              ref={(el) => {
                sectionRefs.current['scheme'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors to Consider When Selecting a Classification Scheme
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Organisational Functions and Activities',
                    icon: <FolderTree size={16} />,
                    content: 'The classification scheme must align with the organisation\'s core functions and activities. This involves analysing the organisation\'s structure, departments, and business processes to identify the key areas where records are created and used. The scheme should reflect how the organisation operates, ensuring that records are grouped according to their relevance to specific functions.',
                  },
                  {
                    title: '2. Legal and Regulatory Requirements',
                    icon: <Shield size={16} />,
                    content: 'The classification scheme must comply with all applicable legal and regulatory requirements. This involves identifying the laws, regulations, and industry standards that govern the organisation\'s records. For example, financial institutions must comply with regulations regarding the retention and security of financial records.',
                  },
                  {
                    title: '3. User Needs and Retrieval Requirements',
                    icon: <Search size={16} />,
                    content: 'The classification scheme should be designed to meet the needs of the users who will be accessing and retrieving records. This involves understanding how users search for information and the types of queries they typically perform. The scheme should facilitate easy and efficient retrieval by using clear and consistent terminology, logical categories, and effective indexing.',
                  },
                  {
                    title: '4. Record Types and Formats',
                    icon: <FileText size={16} />,
                    content: 'The classification scheme must accommodate the diverse types and formats of records used by the organisation. This includes paper-based records, electronic records, databases, emails, multimedia files, and other formats. The scheme should be flexible enough to handle the unique characteristics of each format, such as metadata, file structures, and storage requirements.',
                  },
                  {
                    title: '5. Retention and Disposition Requirements',
                    icon: <Clock size={16} />,
                    content: 'The classification scheme should support the organisation\'s retention and disposition schedules. This involves grouping records according to their retention periods and disposition actions. The scheme should facilitate the application of consistent retention schedules to different categories of records.',
                  },
                  {
                    title: '6. Scalability and Flexibility',
                    icon: <Database size={16} />,
                    content: 'The classification scheme should be scalable and flexible enough to accommodate the organisation\'s future growth and changing needs. This involves designing a scheme that can be easily expanded or modified as the organisation evolves. The scheme should also be adaptable to changes in technology, regulations, and business processes.',
                  },
                  {
                    title: '7. Standardisation and Consistency',
                    icon: <ClipboardList size={16} />,
                    content: 'The classification scheme should be standardised and consistently applied across the organisation. This involves using clear and consistent terminology, logical categories, and uniform classification principles. Standardisation ensures that records are classified consistently, regardless of department or location. This facilitates efficient retrieval, collaboration, and knowledge sharing.',
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

            {/* SECTION 6: Difference Between Manual and Electronic Classification Systems */}
            <div
              ref={(el) => {
                sectionRefs.current['manual-electronic'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Difference Between Manual and Electronic Classification Systems
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Storage and Retrieval',
                    icon: <Database size={16} />,
                    content: (
                      <>
                        <p><strong>Manual Systems:</strong> Records stored in physical formats like filing cabinets, boxes, or shelves. Retrieval is time-consuming and involves physical searching. Indexing and labelling are critical, but human error can lead to misfiling.</p>
                        <p><strong>Electronic Systems:</strong> Records stored digitally in databases, servers, or cloud storage. Retrieval is significantly faster using search functions based on keywords, metadata, or file properties. Instant access from multiple locations.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Accessibility and Sharing',
                    icon: <Search size={16} />,
                    content: (
                      <>
                        <p><strong>Manual Systems:</strong> Accessibility limited to physical proximity. Sharing requires physical copies or transporting documents. Collaboration difficult as only one person can physically access a file at a time.</p>
                        <p><strong>Electronic Systems:</strong> Greater accessibility, allowing authorised users to access records from anywhere with internet. Seamless sharing with options for email, file sharing platforms, and collaborative editing tools. Multiple users can access simultaneously.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Security and Control',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p><strong>Manual Systems:</strong> Security relies on physical measures like locked cabinets, access logs, and controlled storage areas. Physical documents are vulnerable to damage, theft, and unauthorised access. Tracking changes is challenging.</p>
                        <p><strong>Electronic Systems:</strong> Robust security features like access controls, encryption, and audit trails. Granular user permissions restrict access to sensitive information. Digital backups and disaster recovery plans protect against data loss.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Maintenance and Updates',
                    icon: <ClipboardList size={16} />,
                    content: (
                      <>
                        <p><strong>Manual Systems:</strong> Requires physical labour for filing, organising, and updating records. Physical records deteriorate over time, requiring preservation efforts. Updating information involves manually editing documents or creating new copies.</p>
                        <p><strong>Electronic Systems:</strong> Automated maintenance tasks such as backups, version control, and data migration. Updates can be made quickly and easily, with changes tracked and recorded. Digital records can be preserved through format migration.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Cost and Efficiency',
                    icon: <BarChart size={16} />,
                    content: (
                      <>
                        <p><strong>Manual Systems:</strong> Lower upfront costs for hardware and software, but higher ongoing costs for storage space, labour, and supplies. Retrieval times can be slow, reducing efficiency.</p>
                        <p><strong>Electronic Systems:</strong> Higher upfront costs for hardware, software, and implementation, but lower ongoing costs for storage and labour. Automation and efficient retrieval enhance productivity and reduce overall costs in the long run.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Scalability and Flexibility',
                    icon: <Layout size={16} />,
                    content: (
                      <>
                        <p><strong>Manual Systems:</strong> Difficult to scale as the volume of records increases. Physical storage space becomes a limiting factor, and retrieval times increase. Changes to classification schemes or record types are labour-intensive.</p>
                        <p><strong>Electronic Systems:</strong> Highly scalable and flexible, accommodating growing volumes of records and evolving organisational needs. Changes to classification schemes or metadata can be made quickly and easily.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Environmental Impact',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p><strong>Manual Systems:</strong> Consume significant amounts of paper, contributing to deforestation and waste. Physical storage also requires energy for climate control.</p>
                        <p><strong>Electronic Systems:</strong> Can reduce paper consumption and storage space, but also consume energy for servers and data centres. Environmental impact depends on energy efficiency and the source of energy used.</p>
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

            {/* SECTION 7: Methods of Classification */}
            <div
              ref={(el) => {
                sectionRefs.current['methods'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Methods of Classification
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Functional Classification',
                    icon: <FolderTree size={16} />,
                    content: 'This method organises records based on the business functions or activities they support. It groups records according to the purpose they serve within the organisation. For example, records related to human resources, finance, marketing, or operations would be classified under their respective functional areas. This method is particularly useful for aligning records management with business processes and ensuring that records are organised in a way that reflects how the organisation operates.',
                  },
                  {
                    title: 'Subject-Based Classification',
                    icon: <Tags size={16} />,
                    content: 'This method organises records based on their subject matter or content. It groups records that pertain to a specific topic or theme. For example, records related to environmental regulations, legal cases, or product development would be classified under their respective subject headings. This method is commonly used for organising research materials, library collections, and legal documents.',
                  },
                  {
                    title: 'Chronological Classification',
                    icon: <Calendar size={16} />,
                    content: 'This method organises records based on their date of creation or receipt. It groups records according to a chronological order, such as year, month, or day. This method is commonly used for organising correspondence, financial records, and historical documents. Chronological classification facilitates the retrieval of records based on timeframes and supports trend analysis and historical research.',
                  },
                  {
                    title: 'Alphabetical Classification',
                    icon: <Search size={16} />,
                    content: 'This method organises records based on alphabetical order, typically using names, titles, or keywords. It groups records according to the first letter of their identifier. This method is commonly used for organising customer records, employee files, and correspondence. Alphabetical classification facilitates easy retrieval of records based on names or titles and supports efficient customer service and administrative tasks.',
                  },
                  {
                    title: 'Geographical Classification',
                    icon: <Layout size={16} />,
                    content: 'This method organises records based on their geographical location or region. It groups records that pertain to a specific location, such as a country, state, or city. This method is commonly used for organising real estate records, environmental data, and market research. Geographical classification facilitates the retrieval of records based on location and supports regional analysis and planning.',
                  },
                  {
                    title: 'Numerical Classification',
                    icon: <Database size={16} />,
                    content: 'This method organises records based on numerical codes or identifiers. It groups records according to a sequential or hierarchical numbering system. This method is commonly used for organising inventory records, financial accounts, and project files. Numerical classification facilitates efficient retrieval of records based on numerical codes and supports data management and analysis.',
                  },
                  {
                    title: 'Hybrid Classification',
                    icon: <ClipboardList size={16} />,
                    content: 'This method combines two or more classification methods to create a more comprehensive and effective system. It involves using a combination of functional, subject-based, chronological, alphabetical, geographical, or numerical classification methods. Hybrid classification allows for greater flexibility and customisation, enabling organisations to tailor their classification system to their specific needs.',
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

            {/* SECTION 8: Classification Codes */}
            <div
              ref={(el) => {
                sectionRefs.current['codes'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Classification Codes
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Definition and Purpose',
                    icon: <Tags size={16} />,
                    content: 'Classification codes are alphanumeric or symbolic representations of categories within a classification system. They are designed to provide a concise and unambiguous way to identify and retrieve records. The primary purpose of classification codes is to streamline the organisation and management of information, making it easier to locate, track, and dispose of records. They also facilitate consistency and uniformity in record-keeping practices across an organisation.',
                  },
                  {
                    title: 'Structure and Format',
                    icon: <Layout size={16} />,
                    content: 'Classification codes can vary in structure and format, depending on the complexity of the classification scheme and the organisation\'s needs. They can be hierarchical, sequential, or faceted. Hierarchical codes use a system of levels or branches to represent relationships between categories. Sequential codes use a simple numbering system to assign unique identifiers. Faceted codes use multiple attributes or facets to describe records.',
                  },
                  {
                    title: 'Application and Use',
                    icon: <Search size={16} />,
                    content: 'Classification codes are used to assign unique identifiers to records, enabling them to be easily categorised and retrieved. They are typically applied during the creation or receipt of records and are recorded in metadata fields or file naming conventions. Classification codes can be used in both manual and electronic records management systems. In manual systems, they might be used to label filing cabinets or folders. In electronic systems, they might be used to tag files or documents in a database.',
                  },
                  {
                    title: 'Benefits and Advantages',
                    icon: <CheckCircle size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Efficiency:</strong> Streamline the organisation and retrieval of records, saving time and resources.</li>
                          <li><strong>Consistency:</strong> Ensure that records are classified consistently across the organisation, reducing ambiguity and errors.</li>
                          <li><strong>Accuracy:</strong> Minimise the risk of misfiling and lost records.</li>
                          <li><strong>Searchability:</strong> Facilitate efficient searching and filtering of records in electronic systems.</li>
                          <li><strong>Standardisation:</strong> Promote standardised record-keeping practices, improving communication and collaboration.</li>
                          <li><strong>Compliance:</strong> Support compliance with legal and regulatory requirements by ensuring that records are properly managed and retained.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Design Considerations',
                    icon: <ClipboardList size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Clarity and Simplicity:</strong> The codes should be easy to understand and remember.</li>
                          <li><strong>Uniqueness:</strong> Each code should be unique to avoid confusion and errors.</li>
                          <li><strong>Scalability:</strong> The coding system should be scalable to accommodate future growth and changes.</li>
                          <li><strong>Flexibility:</strong> The coding system should be flexible enough to accommodate different record types and formats.</li>
                          <li><strong>Consistency:</strong> The codes should be applied consistently across the organisation.</li>
                          <li><strong>Documentation:</strong> The coding system should be thoroughly documented and communicated to all relevant personnel.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Examples',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Functional:</strong> HR-EMP-TRAIN (Human Resources, Employee Training)</li>
                          <li><strong>Subject-Based:</strong> LEGAL-CONTRACT (Legal, Contracts)</li>
                          <li><strong>Chronological:</strong> FIN-2023-Q3 (Financial, 2023, Quarter 3)</li>
                          <li><strong>Geographical:</strong> MKT-US-NY (Marketing, United States, New York)</li>
                          <li><strong>Numerical:</strong> INV-00123 (Inventory, Item 123)</li>
                        </ul>
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

            {/* SECTION 9: Record Inventory */}
            <div
              ref={(el) => {
                sectionRefs.current['inventory'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Record Inventory
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Purpose and Scope',
                    icon: <ClipboardList size={16} />,
                    content: 'The primary purpose of a record inventory is to create a detailed map of an organisation\'s information assets. This involves identifying all records, regardless of format (paper, electronic, audio-visual, etc.), and documenting key attributes. The scope of the inventory defines the boundaries of what will be included. It is crucial to establish this scope at the outset, as it determines the scale and complexity of the inventory.',
                  },
                  {
                    title: 'Identification and Location',
                    icon: <Search size={16} />,
                    content: 'This involves systematically identifying all records and documenting their physical or digital locations. For physical records, this might include listing filing cabinets, storage rooms, off-site storage facilities, and even individual desks. For electronic records, it involves identifying servers, shared drives, cloud storage locations, databases, and individual computers. The goal is to ensure that no records are overlooked.',
                  },
                  {
                    title: 'Record Attributes and Metadata',
                    icon: <Tags size={16} />,
                    content: (
                      <>
                        <p>This involves documenting key attributes of each record, known as metadata. Common metadata elements include:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>File Name/Title:</strong> The unique identifier of the record.</li>
                          <li><strong>Creation Date:</strong> The date the record was created.</li>
                          <li><strong>Creator/Author:</strong> The person or entity that created the record.</li>
                          <li><strong>Format:</strong> The physical or digital format of the record.</li>
                          <li><strong>Content/Description:</strong> A brief summary of the record\'s content.</li>
                          <li><strong>Retention Period:</strong> The length of time the record must be retained.</li>
                          <li><strong>Security Classification:</strong> The level of confidentiality or sensitivity.</li>
                          <li><strong>Department/Function:</strong> The department or function associated with the record.</li>
                          <li><strong>Access Restrictions:</strong> Any limitations on who can access the record.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Inventory Methodology and Tools',
                    icon: <Database size={16} />,
                    content: (
                      <>
                        <p>The methodology used for conducting the inventory should be clearly defined and documented. Various tools can be used to support the inventory process:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Spreadsheets:</strong> For creating and managing the inventory list.</li>
                          <li><strong>Database Management Systems (DBMS):</strong> For storing and querying inventory data.</li>
                          <li><strong>Records Management Software:</strong> For automating the inventory process.</li>
                          <li><strong>Barcode Scanners/RFID Tags:</strong> For tracking physical records.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Inventory Analysis and Reporting',
                    icon: <BarChart size={16} />,
                    content: 'Once the inventory is complete, the data should be analysed to identify patterns, trends, and potential issues. This analysis can help to assess the volume and distribution of records, identify duplicate or redundant records, evaluate storage needs and costs, identify records with archival value, assess compliance with retention schedules and legal requirements, and identify security risks and vulnerabilities.',
                  },
                  {
                    title: 'Inventory Maintenance and Updates',
                    icon: <RefreshCw size={16} />,
                    content: 'A record inventory is not a one-time activity. It must be regularly maintained and updated to reflect changes in the organisation\'s records holdings. This involves adding new records to the inventory, updating metadata for existing records, removing records that have been disposed of, and tracking changes in record locations. Regular maintenance ensures that the inventory remains accurate and up to date.',
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

            {/* SECTION 10: Types of Records */}
            <div
              ref={(el) => {
                sectionRefs.current['types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Types of Records
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Active Records',
                    icon: <Zap size={16} />,
                    content: 'Active records are those that are frequently used in the day-to-day operations of an organisation. They are essential for ongoing business activities and are accessed regularly by employees. These records are often kept in readily accessible locations, such as office filing cabinets or active computer systems. Examples include current customer files, ongoing project documents, recent financial transactions, and frequently updated databases. The key characteristic of active records is their high retrieval rate. They are needed to support immediate operational needs, and their availability is critical for maintaining business continuity.',
                  },
                  {
                    title: 'Semi-Active Records',
                    icon: <Clock size={16} />,
                    content: 'Semi-active records are those that are used less frequently than active records but still retain some administrative, legal, or fiscal value. They are not needed for day-to-day operations but may be required for occasional reference or future use. These records often have a longer retention period than active records and may be stored in less accessible locations, such as off-site storage or archived digital systems. Examples include past project files, historical financial data, closed customer accounts, and superseded policies.',
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

            {/* SECTION 11: Benefits of Records Inventory */}
            <div
              ref={(el) => {
                sectionRefs.current['inventory-benefits'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Benefits of Records Inventory
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Improved Information Retrieval',
                    icon: <Search size={16} />,
                    content: 'A records inventory creates a comprehensive map of all organisational records, making it significantly easier to locate specific documents or information. By documenting the location, format, and key attributes of each record, employees can quickly and efficiently retrieve the information they need. This reduces time wasted searching for misplaced or lost documents, improving productivity and responsiveness.',
                  },
                  {
                    title: 'Enhanced Compliance and Legal Protection',
                    icon: <Shield size={16} />,
                    content: 'A records inventory helps ensure compliance with legal and regulatory requirements by providing a clear overview of all records and their retention schedules. This is crucial for organisations that must adhere to strict regulations, such as those in the financial, healthcare, or legal sectors. By identifying records that are subject to specific legal requirements, organisations can ensure that they are properly managed and retained for the required period.',
                  },
                  {
                    title: 'Reduced Storage Costs',
                    icon: <Trash2 size={16} />,
                    content: 'A records inventory helps organisations identify and eliminate duplicate, redundant, or obsolete records. By purging unnecessary records, organisations can reduce their storage space requirements, whether physical or digital. This translates to cost savings in terms of storage space, supplies, and maintenance. For example, by identifying and disposing of outdated paper records, an organisation can free up valuable office space and reduce the cost of off-site storage.',
                  },
                  {
                    title: 'Improved Data Security',
                    icon: <ShieldAlert size={16} />,
                    content: 'A records inventory helps organisations identify and protect sensitive or confidential information. By documenting the security classification of each record, organisations can implement appropriate access controls and security measures. This minimises the risk of unauthorised access, data breaches, and information leaks. For example, by identifying employee records that contain sensitive personal information, an organisation can restrict access to authorised personnel only.',
                  },
                  {
                    title: 'Facilitated Disaster Recovery and Business Continuity',
                    icon: <Shield size={16} />,
                    content: 'A records inventory is essential for developing effective disaster recovery and business continuity plans. By identifying critical records and their locations, organisations can prioritise their recovery efforts in the event of a disaster, such as a fire, flood, or cyberattack. This ensures that essential business operations can be resumed quickly, minimising downtime and disruption.',
                  },
                  {
                    title: 'Enhanced Information Governance',
                    icon: <ClipboardList size={16} />,
                    content: 'A records inventory supports effective information governance by providing a clear understanding of the organisation\'s information assets and their lifecycle. This allows organisations to develop and implement policies and procedures for the creation, maintenance, use, and disposal of records. By establishing clear guidelines for record-keeping practices, organisations can ensure consistency, accountability, and transparency.',
                  },
                  {
                    title: 'Improved Decision-Making',
                    icon: <BarChart size={16} />,
                    content: 'A records inventory facilitates data analysis and reporting, which supports informed decision-making. By organising records into meaningful categories, organisations can easily extract and analyse relevant information. This provides valuable insights into business operations, trends, and performance. For example, by analysing sales records, an organisation can identify high-performing products or regions and make informed decisions about marketing and sales strategies.',
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

            {/* SECTION 12: Components of a Records Inventory */}
            <div
              ref={(el) => {
                sectionRefs.current['components'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Components of a Records Inventory
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Record Identification and Description',
                    icon: <Tags size={16} />,
                    content: 'This is the core of the inventory, where each record is uniquely identified and described in detail. It involves assigning a unique identifier or record number to each entry. This identifier allows for easy tracking and referencing. The description should be thorough and include the record\'s title or subject, a brief summary of its content, and any relevant keywords. For example, a record might be identified as "HR-EMP-2023-001" and described as "Employee Performance Review for John Doe, 2023."',
                  },
                  {
                    title: '2. Physical or Digital Location',
                    icon: <Search size={16} />,
                    content: 'This component specifies the exact location where the record is stored. For physical records, this includes the building, room, filing cabinet, drawer, or shelf where the record is located. For digital records, this includes the server, folder path, database, cloud storage location, or other digital repository. Accurate location information is crucial for quickly retrieving records when needed.',
                  },
                  {
                    title: '3. Record Format and Media',
                    icon: <FileText size={16} />,
                    content: 'This component identifies the format and media of the record. This includes the physical or digital format in which the record is stored. Examples of physical formats include paper documents, microfilm, and audio tapes. Examples of digital formats include PDF, Word documents, spreadsheets, databases, and emails. Understanding the format and media is essential for ensuring that records can be accessed and preserved properly.',
                  },
                  {
                    title: '4. Creation Date and Time Period',
                    icon: <Calendar size={16} />,
                    content: 'This component specifies the date or time period when the record was created or received. This information is crucial for understanding the record\'s context and relevance. It also helps in applying appropriate retention schedules and identifying records that are eligible for disposal. For example, a record might be identified as "Created: 2023-03-15" or "Time Period: 2020-2023."',
                  },
                  {
                    title: '5. Responsible Department or Function',
                    icon: <ClipboardList size={16} />,
                    content: 'This component identifies the department or function that is responsible for the record. This helps in assigning ownership and accountability for the record\'s management. For example, a record might be assigned to the "Human Resources" department or the "Finance" function. This information is crucial for ensuring that records are managed consistently and that appropriate personnel are involved in their maintenance and disposition.',
                  },
                  {
                    title: '6. Retention Schedule and Disposition Action',
                    icon: <Clock size={16} />,
                    content: 'This component specifies the retention period and disposition action for the record. The retention period indicates how long the record must be kept, based on legal, regulatory, and business requirements. The disposition action specifies what should be done with the record at the end of its retention period, such as destruction, transfer to archives, or permanent preservation.',
                  },
                  {
                    title: '7. Security Classification and Access Restrictions',
                    icon: <Shield size={16} />,
                    content: 'This component specifies the security classification and access restrictions for the record. The security classification indicates the level of confidentiality or sensitivity of the record, such as "Confidential," "Restricted," or "Public." Access restrictions specify who is authorised to access the record and under what conditions. This component is crucial for protecting sensitive information and ensuring compliance with privacy regulations.',
                  },
                  {
                    title: '8. Metadata and Indexing Information',
                    icon: <Database size={16} />,
                    content: 'This component includes any additional metadata or indexing information that is relevant to the record. Metadata provides descriptive information about the record, such as author, keywords, and subject headings. Indexing information helps in retrieving records based on specific criteria. For example, a record might have metadata that includes the author\'s name, the date of publication, and a list of keywords.',
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
                  💡 Classification Insight
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
                  <span>Classification Methods</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Inventory Components</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Verification Aspects</span>
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
                Classification organises records for efficient retrieval and management. Benefits include enhanced retrieval, improved efficiency, consistent retention, compliance, data analysis, security, and business continuity. Document verification ensures authenticity, content validity, signature verification, legal validity, cross-referencing, integrity, and chain of custody. Classification schemes consider organisational functions, legal requirements, user needs, record types, retention, scalability, and standardisation. Methods include functional, subject-based, chronological, alphabetical, geographical, numerical, and hybrid. Classification codes streamline organisation. Record inventory provides a comprehensive map of records with components like identification, location, format, date, department, retention, security, and metadata.
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
                <strong className="text-white">Classification</strong> – Organises records by function, subject, or attributes for efficient retrieval. Benefits include enhanced retrieval, improved efficiency, consistent retention schedules, compliance, data analysis, security, and business continuity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Document Verification</strong> – Ensures authenticity, content validity, signature verification, legal validity, cross-referencing, integrity, and chain of custody. Critical for establishing trust and validity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Classification Schemes &amp; Methods</strong> – Considerations: organisational functions, legal requirements, user needs, record types, retention, scalability, and standardisation. Methods: functional, subject-based, chronological, alphabetical, geographical, numerical, and hybrid.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Records Inventory</strong> – Comprehensive listing of all records with components: identification, location, format, creation date, responsible department, retention schedule, security classification, and metadata. Benefits include improved retrieval, compliance, cost reduction, data security, disaster recovery, governance, and decision-making.
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
            Sidemann Academic Registry • Classification &amp; Inventory Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;