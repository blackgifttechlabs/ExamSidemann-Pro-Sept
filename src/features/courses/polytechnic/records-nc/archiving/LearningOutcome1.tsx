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
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'values', label: 'Appraisal Values' },
  { id: 'process', label: 'Process & Decisions' },
  { id: 'disposal', label: 'Disposal' },
  { id: 'transfer', label: 'Transfer' },
  { id: 'retention', label: 'Retention Schedules' },
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
        text: 'The concept of primary and secondary values in records appraisal was introduced by Theodore R. Schellenberg and remains a cornerstone of archival theory.',
      },
      {
        title: 'Pro Tip',
        text: 'Always involve legal counsel when establishing retention schedules to ensure compliance with all applicable laws and regulations.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three primary values with "A-L-F": Administrative, Legal, Fiscal. Secondary values are "H-E": Historical, Evidential.',
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
        text: 'The concept of primary and secondary values in records appraisal was introduced by Theodore R. Schellenberg and remains a cornerstone of archival theory.',
      },
      {
        title: 'Pro Tip',
        text: 'Always involve legal counsel when establishing retention schedules to ensure compliance with all applicable laws and regulations.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three primary values with "A-L-F": Administrative, Legal, Fiscal. Secondary values are "H-E": Historical, Evidential.',
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
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FileText size={14} className="inline mr-1" /> RECORDS MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Records Appraisal —{' '}
            <span className="text-emerald-300 font-bold italic">
              Values, Process &amp; Disposal
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to records appraisal criteria, primary and secondary values, the appraisal process, records disposal, transfer procedures, and retention schedules.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Appraisal
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Archive size={14} className="inline mr-1" /> Disposal
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Clock size={14} className="inline mr-1" /> Retention
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
                placeholder="Search for a concept, value, process step..."
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
            {/* SECTION 1: Intro / Overview */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Records Appraisal Overview
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Records appraisal is the process of evaluating records to determine their value for ongoing administrative, legal, financial, or historical purposes, and deciding their ultimate fate. This evaluation is a critical function that ensures organizations retain essential information while responsibly disposing of material that no longer serves a purpose. It involves a systematic analysis of records to understand their context, content, and potential future use.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    This process goes beyond simply looking at the information contained within the records; it necessitates an understanding of the organizational functions that created them, the legal and regulatory environment in which they were produced, and the potential research value they may hold. Furthermore, records appraisal is not a static process. It must adapt to changes in technology, organizational structures, and societal values. As digital records become increasingly prevalent, appraisers must consider the unique challenges of preserving and accessing electronic information. This includes evaluating the long-term viability of file formats, the security of digital storage, and the need for data migration.
                  </p>
</div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Key Aspects of Records Appraisal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Defining Appraisal Criteria',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p>Appraisal criteria are the standards used to evaluate records. These criteria act as a compass, guiding the appraiser in making informed decisions. The criteria are usually based on the organization's mission, legal obligations, and operational needs. For example, a government agency might prioritize records related to policy decisions, legal precedents, and financial transactions. On the other hand, a historical society might value records that document social trends, cultural practices, or significant events.</p>
                        <p>It is vital that these criteria are clearly defined, documented, and consistently applied to ensure fairness and objectivity in the appraisal process. The criteria are often reviewed and updated periodically to reflect changes in the organization's activities, legal requirements, and societal values. A well-defined set of criteria ensures that records are retained or disposed of in a way that aligns with the organization's priorities and responsibilities.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Assessing Administrative Value',
                    icon: <ClipboardList size={16} />,
                    content: (
                      <>
                        <p>Administrative value refers to the usefulness of records for the ongoing operations of an organization. Records with high administrative value are essential for daily tasks, decision-making, and accountability. These records might include policy documents, procedure manuals, correspondence, and financial records. For example, a customer service department would rely on records of customer interactions to resolve issues and improve services.</p>
                        <p>Assessing administrative value involves determining how frequently records are used, how critical they are to the organization's functions, and whether they are easily accessible. Records with low administrative value may be considered for disposal, while those with high value should be retained for as long as they are needed. This assessment is often conducted by consulting with the departments or individuals responsible for creating and using the records.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Evaluating Legal and Fiscal Value',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>Legal and fiscal value pertains to the importance of records for meeting legal obligations and financial accountability. Legal records may include contracts, patents, and litigation files, which are essential for protecting the organization's rights and interests. Fiscal records, such as financial statements, tax returns, and audit reports, are necessary for demonstrating financial transparency and compliance with regulations.</p>
                        <p>These records are often subject to specific retention periods mandated by laws and regulations. For example, tax records might need to be retained for several years to comply with tax laws. Evaluating legal and fiscal value involves identifying the relevant laws and regulations, determining the required retention periods, and assessing the potential risks and liabilities associated with the records. This assessment is often conducted in consultation with legal and financial experts.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Determining Historical or Evidential Value',
                    icon: <BookOpen size={16} />,
                    content: (
                      <>
                        <p>Historical or evidential value relates to the importance of records for documenting the history of an organization, a community, or a society. These records provide evidence of past activities, decisions, and events, and they can be used for research, education, and cultural preservation. For example, records of a historical society might document the development of a local community, while records of a government agency might reveal policy changes over time.</p>
                        <p>Determining historical value involves assessing the uniqueness, significance, and authenticity of the records. Records with high historical value are often preserved permanently in archives or historical repositories. This assessment requires a deep understanding of the context in which the records were created and used, and it often involves consulting with historians and archivists.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Considering Technological and Format Changes',
                    icon: <Monitor size={16} />,
                    content: (
                      <>
                        <p>Records are created and stored in a variety of formats, including paper, electronic files, and multimedia. Technological advancements can make older formats obsolete, posing challenges for long-term preservation and access. For example, records created on outdated computer systems may be difficult to access without specialized software or hardware.</p>
                        <p>Appraisers must consider the technological and format changes that may affect the records' accessibility and preservation. This involves assessing the stability and longevity of the formats, the availability of migration or conversion tools, and the costs associated with preserving and accessing the records. In some cases, it may be necessary to migrate records to newer formats to ensure their long-term preservation. This aspect of appraisal is increasingly important as organizations transition to digital records management.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Applying Appraisal Schedules and Retention Policies',
                    icon: <Calendar size={16} />,
                    content: (
                      <>
                        <p>Appraisal schedules and retention policies provide a systematic framework for managing records throughout their lifecycle. These documents specify the retention periods for different types of records, based on their administrative, legal, fiscal, and historical value. Appraisal schedules are often developed in consultation with legal, financial, and operational experts.</p>
                        <p>They ensure that records are retained for as long as they are needed and disposed of when they are no longer required. Applying these schedules and policies ensures consistency and efficiency in the appraisal process, and it helps to prevent the accumulation of unnecessary records. Regular review and updates of these schedules are essential to reflect changes in the organization's needs and legal requirements.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Documenting Appraisal Decisions',
                    icon: <ClipboardList size={16} />,
                    content: (
                      <>
                        <p>Documenting appraisal decisions is essential for accountability and transparency. This involves creating detailed records of the appraisal process, including the criteria used, the assessments made, and the decisions reached. These records provide a clear audit trail, demonstrating that the appraisal was conducted in a fair and objective manner.</p>
                        <p>Documenting appraisal decisions also helps to ensure consistency in future appraisals and provides valuable information for researchers and historians. This documentation should be retained for as long as the records themselves are retained, and it should be easily accessible to authorized personnel.</p>
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

            {/* SECTION 2: Primary and Secondary Values */}
            <div
              ref={(el) => {
                sectionRefs.current['values'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                "Primary Values" and "Secondary Values"
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In records appraisal, "primary values" and "secondary values" are fundamental concepts that help determine the long-term significance of records. These values guide decisions about which records to retain and which to dispose of, ensuring that organizations preserve essential information while managing resources effectively.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Primary Values',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p>Primary values relate to the immediate and ongoing use of records within an organization. These values are typically associated with the operational and functional needs of the organization that created the records. They are the initial reasons for creating and maintaining records, and they directly support the organization's core activities.</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Administrative Value:</strong> Refers to the usefulness of records for the day-to-day operations. For example, employee records, operational manuals, and daily correspondence are crucial for managing human resources and facilitating communication.</li>
                          <li><strong>Legal Value:</strong> Pertains to the importance of records for meeting legal obligations and protecting the organization's rights and interests. Legal records, such as contracts, patents, litigation files, and regulatory compliance documents, are essential for demonstrating adherence to laws and regulations.</li>
                          <li><strong>Fiscal Value:</strong> Relates to the importance of records for financial accountability and auditing. Fiscal records, such as financial statements, audit reports, and transaction records, are essential for demonstrating financial transparency and compliance with accounting standards.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '2. Secondary Values',
                    icon: <Archive size={16} />,
                    content: (
                      <>
                        <p>Secondary values refer to the long-term significance of records beyond their immediate administrative, legal, or fiscal use. These values are often associated with the records' potential for research, historical documentation, and cultural preservation.</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Historical Value:</strong> Refers to the importance of records for documenting the history of an organization, a community, or a society. Records with historical value provide evidence of past activities, decisions, and events, and they can be used for research, education, and cultural preservation.</li>
                          <li><strong>Evidential Value:</strong> Relates to the importance of records as evidence of past actions and decisions. Records with evidential value provide insights into the functions, policies, and procedures of an organization, and they can be used to reconstruct past events. For instance, minutes of meetings, policy documents, and decision-making memos can provide valuable evidence of how an organization operated.</li>
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

            {/* SECTION 3: Appraisal Process and Decisions */}
            <div
              ref={(el) => {
                sectionRefs.current['process'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Appraisal Process &amp; Decisions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Identification and Inventory',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p>The first step is to identify and inventory the records. This involves creating a comprehensive list of all records within the organization, including their format, content, and location. This inventory serves as a foundation for the appraisal process, providing a clear picture of the records holdings. Identifying records involves surveying departments, reviewing existing records management systems, and consulting with staff who create and use the records. Inventorying involves documenting key information about each record series, such as its title, date range, format, volume, and location.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Establishing Appraisal Criteria',
                    icon: <ClipboardList size={16} />,
                    content: (
                      <>
                        <p>Once the records have been identified and inventoried, the next step is to establish appraisal criteria. These criteria are the standards used to evaluate the value of records and determine their retention or disposal. Appraisal criteria are typically based on the organization's mission, legal obligations, operational needs, and historical significance. These criteria provide a framework for making consistent and objective appraisal decisions. For example, criteria might include the legal retention period for financial records, the administrative value of operational documents, or the historical significance of policy records.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Evaluating Records Against Criteria',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p>With the appraisal criteria in place, the next step is to evaluate each record series against these criteria. This involves assessing the administrative, legal, fiscal, historical, and evidential value of the records. For example, financial records might be evaluated based on their legal retention periods and fiscal significance, while policy records might be assessed for their historical and evidential value. This evaluation requires a thorough understanding of the records' content, context, and potential uses.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Determining Retention Periods and Disposition',
                    icon: <Calendar size={16} />,
                    content: (
                      <>
                        <p>Based on the evaluation, retention periods and disposition decisions are determined for each record series. Retention periods specify how long records should be kept, while disposition decisions indicate their ultimate fate, such as permanent preservation or disposal. Retention periods are often based on legal requirements, operational needs, and historical significance. For example, financial records might be retained for seven years to comply with tax laws, while historical records might be preserved permanently in an archive.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Documenting Appraisal Decisions',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p>Documenting appraisal decisions is essential for accountability, transparency, and consistency. This involves creating detailed records of the appraisal process, including the criteria used, the assessments made, and the decisions reached. These records provide an audit trail, demonstrating that the appraisal was conducted in a fair and objective manner. Documentation should include the rationale behind retention periods and disposition decisions, as well as any consultations with experts or stakeholders.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Implementing Appraisal Decisions',
                    icon: <Archive size={16} />,
                    content: (
                      <>
                        <p>Once the appraisal decisions have been documented, they must be implemented. This involves applying the retention periods and disposition decisions to the records, which may include transferring records to an archive, storing them in a secure location, or disposing of them according to established procedures. Implementation requires careful planning and coordination to ensure that records are managed in a way that aligns with the appraisal decisions.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Reviewing and Updating Appraisal Decisions',
                    icon: <RefreshCw size={16} />,
                    content: (
                      <>
                        <p>The appraisal process is not a one-time event. It is an ongoing process that requires regular review and updates. Changes in laws, regulations, organizational needs, and technology can affect the value and disposition of records. Appraisal decisions should be reviewed periodically to ensure that they remain relevant and effective. This might involve reassessing the appraisal criteria, re-evaluating record series, and updating retention schedules.</p>
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

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Appraisal Decisions – Key Factors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Legal and Regulatory Requirements',
                    icon: <Shield size={16} />,
                    content: 'Laws and regulations often dictate retention periods. Organizations must comply with legal obligations to avoid penalties.',
                  },
                  {
                    title: 'Administrative and Operational Needs',
                    icon: <ClipboardList size={16} />,
                    content: 'Records essential for daily operations and decision-making are retained longer. Frequency of use and criticality are key factors.',
                  },
                  {
                    title: 'Historical and Evidential Value',
                    icon: <BookOpen size={16} />,
                    content: 'Records with historical significance or evidential value are preserved permanently for research and cultural preservation.',
                  },
                  {
                    title: 'Financial and Fiscal Considerations',
                    icon: <Hash size={16} />,
                    content: 'Financial records are retained to meet fiscal accountability and auditing requirements. Costs of storage also influence decisions.',
                  },
                  {
                    title: 'Technological and Format Obsolescence',
                    icon: <Monitor size={16} />,
                    content: 'Records in obsolete formats may need migration to ensure long-term accessibility. This affects retention and disposal decisions.',
                  },
                  {
                    title: 'Organizational Policies and Priorities',
                    icon: <Target size={16} />,
                    content: 'Organisational mission, values, and strategic goals shape which records are deemed valuable.',
                  },
                  {
                    title: 'Risk Assessment and Mitigation',
                    icon: <Shield size={16} />,
                    content: 'Sensitive records require risk assessment. Retention and disposal decisions must mitigate legal, financial, and reputational risks.',
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

            {/* SECTION 4: Records Disposal */}
            <div
              ref={(el) => {
                sectionRefs.current['disposal'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Records Disposal
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Records disposal is the systematic process of destroying or deleting records that are no longer needed, either because they have reached the end of their retention period or because they no longer have any administrative, legal, fiscal, or historical value. It is a critical component of records management, ensuring that organizations manage their information efficiently, comply with regulations, and minimize risks.
                  </p>
</div>

              {renderCard(
                'Importance of Records Disposal',
                <Trash2 size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Legal Compliance:</strong> Many laws mandate specific retention periods; disposal after expiry avoids legal liabilities.</li>
                    <li><strong>Cost Reduction:</strong> Frees up storage space and reduces costs associated with maintaining records.</li>
                    <li><strong>Risk Mitigation:</strong> Secure disposal prevents unauthorized access to sensitive information.</li>
                    <li><strong>Efficiency Improvement:</strong> Streamlines access to essential information by removing clutter.</li>
                    <li><strong>Environmental Responsibility:</strong> Proper disposal of physical records contributes to sustainability.</li>
                  </ul>
                </>
              )}

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Types of Records Disposals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Shredding (Physical Paper)',
                    icon: <Trash2 size={16} />,
                    content: 'Mechanical cutting of paper into unreadable pieces. Micro-cut offers highest security. Essential for sensitive documents.',
                  },
                  {
                    title: '2. Burning/Incineration',
                    icon: <Trash2 size={16} />,
                    content: 'Complete destruction through combustion. Used for highly sensitive documents requiring maximum security.',
                  },
                  {
                    title: '3. Recycling (Non-Confidential)',
                    icon: <Archive size={16} />,
                    content: 'Environmentally friendly disposal of non-confidential paper records through recycling processes.',
                  },
                  {
                    title: '4. Deletion (Digital)',
                    icon: <Monitor size={16} />,
                    content: 'Removing digital files; secure deletion overwrites data to prevent recovery. Essential for sensitive electronic records.',
                  },
                  {
                    title: '5. Degaussing (Magnetic Media)',
                    icon: <Monitor size={16} />,
                    content: 'Using a strong magnetic field to erase data from hard drives, tapes, and floppy disks. Renders media unusable.',
                  },
                  {
                    title: '6. Physical Destruction (Digital Storage)',
                    icon: <Trash2 size={16} />,
                    content: 'Shredding, crushing, or drilling of hard drives, SSDs, and USB drives to ensure data is irrecoverable.',
                  },
                  {
                    title: '7. Data Wiping (Digital Storage)',
                    icon: <Monitor size={16} />,
                    content: 'Overwriting data multiple times with specialised software to ensure irrecoverability without physical destruction.',
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

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Disposal vs. Destruction</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Scope and Purpose',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>Disposal:</strong> Broad term including transfer to archives, recycling, and destruction. Manages lifecycle.</p>
                        <p><strong>Destruction:</strong> Specific act of eliminating records irrecoverably. Subset of disposal for sensitive data.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Methods and Techniques',
                    icon: <ClipboardList size={16} />,
                    content: (
                      <>
                        <p><strong>Disposal:</strong> Includes shredding, burning, recycling, deletion, degaussing, and transfer.</p>
                        <p><strong>Destruction:</strong> Focuses on techniques like shredding, burning, degaussing, physical destruction, and secure wiping.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Legal and Regulatory Implications',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p><strong>Disposal:</strong> Must comply with data privacy laws, industry regulations, and legal holds.</p>
                        <p><strong>Destruction:</strong> Subject to strict requirements; failure can result in severe penalties.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Data Security',
                    icon: <Trash2 size={16} />,
                    content: (
                      <>
                        <p><strong>Disposal:</strong> Handles records based on risk; non-confidential may be recycled, confidential shredded.</p>
                        <p><strong>Destruction:</strong> Focused on eliminating data unrecoverably, used for highest security needs.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Documentation and Audit Trail',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p><strong>Disposal:</strong> Activities documented, including types, methods, and dates for audit trail.</p>
                        <p><strong>Destruction:</strong> Requires meticulous documentation, including certificates of destruction and chain-of-custody records.</p>
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

            {/* SECTION 5: Transfer Procedures */}
            <div
              ref={(el) => {
                sectionRefs.current['transfer'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Records Transfer Procedures
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Developing a Transfer Schedule and Policy',
                    icon: <Calendar size={16} />,
                    content: 'A transfer schedule outlines frequency and timing of transfers, specifying which record series are eligible. The policy establishes guidelines and responsibilities.',
                  },
                  {
                    title: '2. Preparing Records for Transfer',
                    icon: <ClipboardList size={16} />,
                    content: 'Records must be reviewed, organised, and boxed with clear labels. Digital records need consistent naming and metadata. Preservation measures should be applied.',
                  },
                  {
                    title: '3. Creating a Transfer List and Documentation',
                    icon: <FileText size={16} />,
                    content: 'A transfer list itemizes records with titles, date ranges, and box numbers. Documentation ensures accountability and provides an audit trail.',
                  },
                  {
                    title: '4. Packaging and Transportation',
                    icon: <Archive size={16} />,
                    content: 'Physical records should be in sturdy, labelled boxes; digital records transferred securely. Environmental conditions must be controlled.',
                  },
                  {
                    title: '5. Receiving and Verifying Records',
                    icon: <CheckCircle size={16} />,
                    content: 'Records are checked against the transfer list, condition assessed, and receipt issued. Discrepancies documented.',
                  },
                  {
                    title: '6. Updating Records Management Systems',
                    icon: <Monitor size={16} />,
                    content: 'Systems updated to reflect new location, access permissions, and retention schedules. Ensures accurate tracking.',
                  },
                  {
                    title: '7. Implementing Access and Retrieval Procedures',
                    icon: <Target size={16} />,
                    content: 'Clear procedures for requesting, retrieving, and handling access restrictions. Security measures protect records.',
                  },
                  {
                    title: '8. Monitoring and Auditing the Transfer Process',
                    icon: <RefreshCw size={16} />,
                    content: 'Regular reviews, spot checks, and stakeholder feedback ensure effectiveness and compliance with procedures.',
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

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Transfer from Records Centre to Archives</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Appraisal and Selection',
                    icon: <Target size={16} />,
                    content: 'Records evaluated for historical, evidential, or research value. Archivists and experts identify records for permanent preservation.',
                  },
                  {
                    title: '2. Developing a Transfer Agreement and Schedule',
                    icon: <FileText size={16} />,
                    content: 'Formal agreement outlines responsibilities, required documentation, and handling instructions. Schedule coordinates timing.',
                  },
                  {
                    title: '3. Preparing Records for Transfer',
                    icon: <ClipboardList size={16} />,
                    content: 'Records reviewed, non-archival materials removed, preservation treatments applied. Digital records migrated to stable formats.',
                  },
                  {
                    title: '4. Creating a Transfer List and Documentation',
                    icon: <FileText size={16} />,
                    content: 'Detailed list itemising records, with provenance, access restrictions, and preservation notes for archives.',
                  },
                  {
                    title: '5. Packaging and Transportation',
                    icon: <Archive size={16} />,
                    content: 'Archival-quality boxes, secure digital transfer, and controlled environmental conditions during transport.',
                  },
                  {
                    title: '6. Receiving and Verifying Records',
                    icon: <CheckCircle size={16} />,
                    content: 'Records checked against list, condition assessed, receipt issued. Discrepancies documented.',
                  },
                  {
                    title: '7. Updating Archival Management Systems',
                    icon: <Monitor size={16} />,
                    content: 'Systems updated with new location, access permissions, and preservation notes. Finding aids created.',
                  },
                  {
                    title: '8. Implementing Access and Preservation Procedures',
                    icon: <Shield size={16} />,
                    content: 'Clear access procedures, preservation measures (environmental controls, pest management, disaster preparedness).',
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

            {/* SECTION 6: Retention Schedules */}
            <div
              ref={(el) => {
                sectionRefs.current['retention'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Records Retention Schedules
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Ensuring Legal and Regulatory Compliance',
                    icon: <Shield size={16} />,
                    content: 'Retention schedules help comply with laws mandating retention periods for financial, personnel, and legal records, preventing penalties.',
                  },
                  {
                    title: '2. Optimizing Storage and Resource Management',
                    icon: <Archive size={16} />,
                    content: 'Prevents accumulation of unnecessary records, freeing storage space and reducing costs, especially important for digital records.',
                  },
                  {
                    title: '3. Mitigating Risks and Ensuring Data Security',
                    icon: <Trash2 size={16} />,
                    content: 'Specifies when to dispose of records, minimising risk of data breaches and unauthorised access to sensitive information.',
                  },
                  {
                    title: '4. Enhancing Operational Efficiency',
                    icon: <ClipboardList size={16} />,
                    content: 'Streamlines access to essential information, reducing time spent searching and improving decision-making.',
                  },
                  {
                    title: '5. Facilitating Consistent and Transparent Practices',
                    icon: <Target size={16} />,
                    content: 'Promotes consistency across departments, ensuring accountability and providing an audit trail for records activities.',
                  },
                  {
                    title: '6. Supporting Business Continuity and Disaster Recovery',
                    icon: <RefreshCw size={16} />,
                    content: 'Identifies and prioritises essential records, enabling quick recovery from disasters and minimising disruptions.',
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

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Types of Retention Schedules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Event-Based Retention Schedules',
                    icon: <Calendar size={16} />,
                    content: 'Retention tied to a specific event (e.g., personnel files retained after termination). Useful for records with variable lifecycles.',
                  },
                  {
                    title: '2. Date-Based Retention Schedules',
                    icon: <Clock size={16} />,
                    content: 'Fixed retention period from creation date or fiscal year end. Simple and common (e.g., tax records for 7 years).',
                  },
                  {
                    title: '3. Functional Retention Schedules',
                    icon: <Target size={16} />,
                    content: 'Organised by function (e.g., all HR records). Ensures consistency across departments and aligns with organisational processes.',
                  },
                  {
                    title: '4. Hybrid Retention Schedules',
                    icon: <RefreshCw size={16} />,
                    content: 'Combines elements of different types for flexibility. Adaptable to complex record-keeping environments.',
                  },
                  {
                    title: '5. Departmental Retention Schedules',
                    icon: <ClipboardList size={16} />,
                    content: 'Tailored to specific departmental needs. Allows flexibility but requires coordination to avoid inconsistencies.',
                  },
                  {
                    title: '6. Master Retention Schedules',
                    icon: <FileText size={16} />,
                    content: 'Comprehensive overview for the entire organisation. Ensures consistency and compliance across all departments.',
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
                  <span>Appraisal Values</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Disposal Methods</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Retention Schedule Types</span>
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
                Records appraisal evaluates records for administrative, legal, fiscal, historical, and evidential value. Primary values (Administrative, Legal, Fiscal) support immediate operations; secondary values (Historical, Evidential) ensure long-term preservation. The appraisal process includes identification, criteria setting, evaluation, retention determination, documentation, implementation, and review. Disposal includes destruction, recycling, and transfer; destruction is a subset for sensitive data. Transfer to archives requires appraisal, agreement, preparation, documentation, and preservation. Retention schedules ensure legal compliance, cost reduction, risk mitigation, and efficiency.
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
                <strong className="text-white">Appraisal Values</strong> – Primary values (Administrative, Legal, Fiscal) support current operations; secondary values (Historical, Evidential) ensure long-term preservation and research use.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Appraisal Process</strong> – Seven steps: Identification, Criteria Establishment, Evaluation, Retention Determination, Documentation, Implementation, and Review. Decisions are guided by legal, operational, historical, and risk factors.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Disposal &amp; Destruction</strong> – Disposal is broad, including transfer and recycling; destruction is irreversible elimination. Methods include shredding, incineration, recycling, deletion, degaussing, physical destruction, and data wiping.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Transfer Procedures</strong> – From registry to records centre and from centre to archives. Involves schedule, preparation, documentation, packaging, verification, system updates, and preservation measures.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Retention Schedules</strong> – Ensure legal compliance, cost reduction, risk mitigation, and efficiency. Types include event-based, date-based, functional, hybrid, departmental, and master schedules.
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
            Sidemann Academic Registry • Records Appraisal &amp; Management Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;