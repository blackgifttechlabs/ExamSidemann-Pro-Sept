import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  GlobeIcon,
  Shield,
  ListChecks,
  SettingsIcon,
  LayersIcon,
  FileText,
  Type,
  Edit,
  Hash,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
  ClockIcon,
  HardDriveIcon,
  Archive,
  Users,
  Clipboard,
  Package,
  Building,
  Scale,
  Award,
  DollarSign as DollarSignIcon,
  Banknote,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'definition', label: 'Definition' },
  { id: 'scope', label: 'Scope' },
  { id: 'purpose', label: 'Purpose' },
  { id: 'history', label: 'History' },
  { id: 'organizations', label: 'Organizations' },
  { id: 'relationships', label: 'Relationships' },
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
        text: 'Public procurement accounts for approximately 15-30% of GDP in many countries, making it a significant driver of economic activity and a powerful tool for achieving policy goals.',
      },
      {
        title: 'Pro Tip',
        text: 'Always ensure that your procurement processes are transparent and well-documented. This not only ensures compliance but also builds trust with stakeholders and suppliers.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the six purposes of public procurement with the acronym V-F-T-E-I-I: Value for Money, Fairness, Transparency, Efficiency, Integrity, and Public Policy.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organizations underestimate the importance of post-contract management. A good procurement process doesn\'t end at contract award; effective monitoring and evaluation are crucial for success.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Public procurement accounts for approximately 15-30% of GDP in many countries, making it a significant driver of economic activity and a powerful tool for achieving policy goals.',
      },
      {
        title: 'Pro Tip',
        text: 'Always ensure that your procurement processes are transparent and well-documented. This not only ensures compliance but also builds trust with stakeholders and suppliers.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the six purposes of public procurement with the acronym V-F-T-E-I-I: Value for Money, Fairness, Transparency, Efficiency, Integrity, and Public Policy.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organizations underestimate the importance of post-contract management. A good procurement process doesn\'t end at contract award; effective monitoring and evaluation are crucial for success.',
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
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Public Procurement &amp;{' '}
            <span className="text-emerald-300 font-bold italic">
              Legal Frameworks
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to public procurement, its scope, purpose, historical development in Zimbabwe, organizational structures, and functional relationships.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Package size={14} className="inline mr-1" /> Scope
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scale size={14} className="inline mr-1" /> Purpose
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ClockIcon size={14} className="inline mr-1" /> History
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Building size={14} className="inline mr-1" /> Organizations
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
                placeholder="Search for a term, concept, framework..."
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
                Introduction to Public Procurement
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Public procurement is the process by which governments and public authorities acquire goods, services, and works from private companies. It is a critical function that ensures public bodies have the resources they need to serve citizens while achieving value for money, transparency, and accountability.
                  </p>
</div>
            </div>

            {/* SECTION 2: Definition */}
            <div
              ref={(el) => {
                sectionRefs.current['definition'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Definition of Public Procurement
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Public procurement is just a fancy way of saying "how the government buys things." It's the process governments use to purchase goods, services, and works from private companies. Think of it as when your local council buys new garbage trucks, or when a national government builds a new highway.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    <strong>Definition:</strong> Public procurement is the acquisition of goods, services, and works by a public authority, such as a government department or agency, using public funds. It encompasses the entire process from planning and tendering to contract management and payment.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Essentially, it's how public bodies spend taxpayers' money to get what they need to function and serve the public.
                  </p>
</div>
            </div>

            {/* SECTION 3: Scope */}
            <div
              ref={(el) => {
                sectionRefs.current['scope'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Scope of Public Procurement
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Public procurement covers a vast array of activities, including:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Goods',
                    icon: <Package size={16} />,
                    content: (
                      <>
                        <p>This includes everything from office supplies and computers to military equipment and medical supplies.</p>
                        <p><strong>Example:</strong> A school district buying new textbooks or a hospital purchasing medical devices.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Services',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p>This encompasses a wide range of services, such as consulting, cleaning, IT support, and transportation.</p>
                        <p><strong>Example:</strong> A government hiring a company to provide cybersecurity services or a city contracting with a waste management company.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Works',
                    icon: <Building size={16} />,
                    content: (
                      <>
                        <p>This refers to construction and infrastructure projects, such as building roads, bridges, schools, and hospitals.</p>
                        <p><strong>Example:</strong> A country building a new airport, or a city repairing damaged roads.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Utilities',
                    icon: <HardDriveIcon size={16} />,
                    content: (
                      <>
                        <p>This can include the procurement of electricity, water and other essential services.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Disposal of Public Assets',
                    icon: <Archive size={16} />,
                    content: (
                      <>
                        <p>This is the opposite of acquiring, but still part of the procurement process. It is how public bodies sell off assets they no longer need.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Research and Development',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p>Public bodies can also use procurement to fund research and development projects.</p>
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

            {/* SECTION 4: Purpose */}
            <div
              ref={(el) => {
                sectionRefs.current['purpose'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Purpose of Public Procurement
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The purpose of public procurement goes beyond simply buying things. It aims to achieve several important objectives:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Value for Money',
                    icon: <DollarSignIcon size={16} />,
                    content: (
                      <>
                        <p>Public procurement seeks to obtain the best possible value for taxpayers' money by ensuring that goods, services, and works are acquired at competitive prices and meet the required quality standards.</p>
                        <p>This means getting the most "bang for the buck" and avoiding wasteful spending.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Transparency and Accountability',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>Public procurement processes should be transparent and accountable to prevent corruption and ensure that public funds are used responsibly.</p>
                        <p>This involves open tendering processes, clear evaluation criteria, and public access to procurement information.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Fairness and Competition',
                    icon: <Scale size={16} />,
                    content: (
                      <>
                        <p>Public procurement aims to promote fair competition among suppliers, giving all qualified businesses an equal opportunity to bid for contracts.</p>
                        <p>This prevents favoritism and ensures that the best suppliers are selected based on merit.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Public Policy Objectives',
                    icon: <GlobeIcon size={16} />,
                    content: (
                      <>
                        <p>Public procurement can be used to achieve broader public policy objectives, such as promoting small and medium-sized enterprises (SMEs), supporting local businesses, or advancing environmental sustainability.</p>
                        <p>For example, a government might give preference to companies that employ people with disabilities or use environmentally friendly materials.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Efficiency and Effectiveness',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p>Public procurement processes should be efficient and effective to ensure that goods, services, and works are acquired in a timely manner and meet the needs of public authorities.</p>
                        <p>This means streamlining procedures and reducing bureaucratic delays.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Integrity and Ethical Conduct',
                    icon: <Award size={16} />,
                    content: (
                      <>
                        <p>Public procurement must be conducted with the highest levels of integrity and ethical conduct. This helps to prevent fraud and corruption, and ensures that public funds are used appropriately.</p>
                        <p>This includes avoiding conflicts of interest, and ensuring that all parties involved act honestly.</p>
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

            {/* SECTION 5: Historical Development in Zimbabwe */}
            <div
              ref={(el) => {
                sectionRefs.current['history'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Historical Development of the Legal Framework in Zimbabwe
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Zimbabwe's public procurement legal framework has evolved significantly over time, shaped by constitutional reforms and the need for greater transparency and efficiency.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-4">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <ClockIcon size={16} /> Key Milestones
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-4">
                  <div>
                    <p><strong>Early Stages:</strong></p>
                    <p>Historically, public procurement practices evolved within the general framework of government administration, often lacking specific, comprehensive legislation. Prior to more recent reforms, there were concerns about inefficiencies and a lack of transparency in how public funds were spent.</p>
                  </div>
                  <div>
                    <p><strong>The Procurement Act (1999):</strong></p>
                    <p>A significant milestone was the enactment of the Procurement Act (No. 1 of 1999). This act led to the establishment of the State Procurement Board, which aimed to centralize and regulate public procurement. This was a step towards formalizing the process, but challenges remained, including criticisms about the speed and fairness of tender awards.</p>
                  </div>
                  <div>
                    <p><strong>Constitutional Reform (2013):</strong></p>
                    <p>The 2013 Constitution of Zimbabwe (Amendment No. 20) marked a turning point. It gave public procurement constitutional status, emphasizing principles like transparency, fairness, honesty, cost-effectiveness, and competitiveness. This constitutional grounding provided a strong foundation for further legislative reforms.</p>
                  </div>
                  <div>
                    <p><strong>Public Procurement and Disposal of Public Assets Act (2017):</strong></p>
                    <p>In response to the constitutional mandate, the Public Procurement and Disposal of Public Assets Act (2017) was enacted. This act aimed to modernize and streamline public procurement, addressing previous shortcomings. This newer act is designed to provide a more comprehensive framework that covers the entire procurement cycle.</p>
                  </div>
                  <div>
                    <p><strong>Ongoing Developments:</strong></p>
                    <p>Zimbabwe continues to work on refining its public procurement framework, with a focus on:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Promoting e-government procurement.</li>
                      <li>Strengthening the role of the Procurement Regulatory Authority of Zimbabwe (PRAZ).</li>
                      <li>Aligning with regional and international best practices.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {renderCard(
                'Themes',
                <ListChecks size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Shift to Transparency:</strong> A move from less transparent practices to open and accountable processes.</li>
                    <li><strong>Emphasis on Efficiency:</strong> A drive to improve the speed and effectiveness of public procurement.</li>
                    <li><strong>Constitutional Anchoring:</strong> The 2013 Constitution provided a solid legal basis for reform.</li>
                    <li><strong>Modernization:</strong> The adoption of newer laws and the push for e-procurement reflect a desire to modernize the system.</li>
                  </ul>
                </>
              )}
            </div>

            {/* SECTION 6: Organizations of Public Procurement */}
            <div
              ref={(el) => {
                sectionRefs.current['organizations'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Organizations of Public Procurement
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The organization of public procurement varies from country to country, but generally involves a structure designed to ensure transparency, efficiency, and accountability. In Zimbabwe, the organization is primarily centered around the Procurement Regulatory Authority of Zimbabwe (PRAZ).
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-4">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Building size={16} /> Organizational Components
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-4">
                  <div>
                    <p><strong>1. Procurement Regulatory Authority of Zimbabwe (PRAZ):</strong></p>
                    <p>PRAZ is the central body responsible for regulating and supervising public procurement in Zimbabwe. Its functions include:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Developing and enforcing procurement regulations and guidelines.</li>
                      <li>Monitoring compliance with the Public Procurement and Disposal of Public Assets Act.</li>
                      <li>Providing training and capacity building to procuring entities.</li>
                      <li>Maintaining a database of registered suppliers.</li>
                      <li>Investigating complaints and disputes related to procurement.</li>
                    </ul>
                    <p>Essentially, PRAZ acts as the watchdog, ensuring that public procurement is conducted fairly and transparently.</p>
                  </div>
                  <div>
                    <p><strong>2. Procuring Entities:</strong></p>
                    <p>These are government ministries, departments, agencies, local authorities, and other public bodies that are responsible for carrying out procurement activities. Each procuring entity has its own procurement unit or department, which is responsible for planning, tendering, evaluating, and managing contracts. They must adhere to the regulations and guidelines set by PRAZ.</p>
                  </div>
                  <div>
                    <p><strong>3. Tender Committees:</strong></p>
                    <p>Procuring entities typically establish tender committees to evaluate bids and award contracts. These committees are composed of representatives from various departments within the procuring entity. Their role is to ensure that the evaluation process is fair, objective, and transparent.</p>
                  </div>
                  <div>
                    <p><strong>4. Suppliers:</strong></p>
                    <p>These are the businesses and individuals that provide goods, services, and works to public entities. They must register with PRAZ and comply with procurement regulations. They participate in tender processes by submitting bids.</p>
                  </div>
                  <div>
                    <p><strong>5. The Courts:</strong></p>
                    <p>The courts are the final place of appeal for any disputes arising from the public procurement process. They are the arbiters of the law.</p>
                  </div>
                </div>
              </div>

              {renderCard(
                'Features of the Organization',
                <ListChecks size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Centralized Oversight:</strong> PRAZ provides centralized oversight to ensure consistency and compliance across all procuring entities.</li>
                    <li><strong>Decentralized Implementation:</strong> Procuring entities are responsible for carrying out their own procurement activities, within the framework of PRAZ regulations.</li>
                    <li><strong>Emphasis on Transparency:</strong> The organization is designed to promote transparency through open tendering processes and public access to procurement information.</li>
                    <li><strong>Accountability Mechanisms:</strong> Mechanisms are in place to hold procuring entities and suppliers accountable for their actions.</li>
                  </ul>
                  <p>In essence, the organization of public procurement in Zimbabwe aims to balance centralized oversight with decentralized implementation, while promoting transparency and accountability.</p>
                </>
              )}
            </div>

            {/* SECTION 7: Functional Relationships */}
            <div
              ref={(el) => {
                sectionRefs.current['relationships'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Functional Relationship between Public Procurement and Other Units
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The functional relationship between public procurement and other units within an organization is crucial for ensuring efficiency, effectiveness, and alignment with overall organizational goals.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Finance/Accounting',
                    icon: <DollarSignIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Relationship:</strong> Public procurement works closely with finance to manage budgets, ensure funds are available for purchases, and process payments to suppliers.</p>
                        <p><strong>Function:</strong> Finance provides budget allocations, monitors expenditure, and ensures compliance with financial regulations. Procurement provides accurate cost estimates, purchase orders, and payment documentation.</p>
                        <p>This relationship is critical to ensure that all spending is within budget, and that all payments are accounted for.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Legal/Compliance',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p><strong>Relationship:</strong> Procurement collaborates with legal to ensure that contracts comply with relevant laws, regulations, and organizational policies.</p>
                        <p><strong>Function:</strong> Legal provides advice on contract terms, risk management, and dispute resolution. Procurement ensures that all procurement processes adhere to legal requirements and ethical standards.</p>
                        <p>This is very important to prevent legal issues, and to ensure that all contracts are sound.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Operations/End-Users',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p><strong>Relationship:</strong> Procurement works with operational units and end-users to understand their needs and requirements for goods, services, and works.</p>
                        <p><strong>Function:</strong> Operational units provide specifications and requirements, while procurement sources and acquires the necessary items. Effective communication ensures that procured items meet the operational needs.</p>
                        <p>This relationship ensures that the goods and services that are bought are the correct ones.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Planning/Strategy',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>Relationship:</strong> Procurement aligns its activities with the organization's strategic plans and objectives.</p>
                        <p><strong>Function:</strong> Planning provides strategic direction, while procurement implements procurement strategies that support those objectives. This includes forecasting demand and managing supplier relationships.</p>
                        <p>This ensures that the procurement is in line with the organization's goals.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Internal Audit',
                    icon: <Clipboard size={16} />,
                    content: (
                      <>
                        <p><strong>Relationship:</strong> Procurement works with internal audit to ensure compliance with procurement policies and procedures, and to identify areas for improvement.</p>
                        <p><strong>Function:</strong> Internal audit conducts audits of procurement processes, while procurement implements corrective actions to address audit findings. This promotes accountability and transparency.</p>
                        <p>This relationship helps to prevent fraud, and to improve the efficiency of the procurement process.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Stores/Inventory Management',
                    icon: <Archive size={16} />,
                    content: (
                      <>
                        <p><strong>Relationship:</strong> Procurement collaborates with stores/inventory management to ensure the timely delivery and storage of procured goods.</p>
                        <p><strong>Function:</strong> Stores manages inventory levels, while procurement ensures that goods are delivered according to schedule and specifications. This prevents stockouts and reduces storage costs.</p>
                        <p>This relationship ensures that there is a good flow of goods, and that there is not too much or too little stock.</p>
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
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Procurement Insight
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
                  <span>Scope Categories</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Purpose Elements</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Organizational Components</span>
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
                Public procurement is the acquisition of goods, services, and works by public authorities using public funds. Its scope includes goods, services, works, utilities, asset disposal, and R&D. Key purposes: Value for Money, Transparency, Fairness, Public Policy, Efficiency, and Integrity. The legal framework in Zimbabwe evolved through the Procurement Act (1999), the 2013 Constitution, and the Public Procurement and Disposal of Public Assets Act (2017). The organization revolves around PRAZ, procuring entities, tender committees, suppliers, and the courts. Procurement must collaborate closely with Finance, Legal, Operations, Planning, Internal Audit, and Stores for effective functioning.
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
                <strong className="text-white">Definition &amp; Scope</strong> – Public procurement is the acquisition of goods, services, and works by public authorities. Its scope covers goods, services, works, utilities, asset disposal, and R&D.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Purpose</strong> – Six key purposes: Value for Money, Transparency and Accountability, Fairness and Competition, Public Policy Objectives, Efficiency and Effectiveness, and Integrity and Ethical Conduct.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Legal Framework in Zimbabwe</strong> – Evolved from the Procurement Act (1999), through the 2013 Constitution, to the Public Procurement and Disposal of Public Assets Act (2017). PRAZ is the regulatory authority.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Organizations &amp; Relationships</strong> – Key entities: PRAZ, procuring entities, tender committees, suppliers, and courts. Procurement must collaborate with Finance, Legal, Operations, Planning, Internal Audit, and Stores for effective outcomes.
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
            Sidemann Academic Registry • Public Procurement Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;
