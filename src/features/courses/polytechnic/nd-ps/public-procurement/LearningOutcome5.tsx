import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  Shield,
  SettingsIcon,
  FileText,
  Archive,
  Clipboard,
  ClipboardList,
  FileSearch,
  Search,
  DollarSign,
  Calendar,
  Users,
  MapPin,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  File,
  Activity,
  Star,
  UserCheck,
  MessageCircle,
  Eye,
  Users2,
  Building2,
  Clock,
  FileBarChart,
  FileCheck,
  Package,
  TrendingUp,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
  X as XIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'preparation', label: 'Preparation' },
  { id: 'planning', label: 'Planning' },
  { id: 'plans', label: 'Annual & Individual Plans' },
  { id: 'shared', label: 'Shared Procurement' },
  { id: 'divisions', label: 'Divisions' },
  { id: 'consultations', label: 'Market Consultations' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome5: React.FC = () => {
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
        text: 'Proper procurement preparation can reduce project costs by up to 20% by identifying market opportunities and risks early.',
      },
      {
        title: 'Pro Tip',
        text: 'Always conduct market consultations before finalizing specifications. This helps ensure that your requirements are realistic and achievable in the current market.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 10 steps of procurement preparation with the acronym "N-M-D-P-B-R-D-E-I-T": Needs Assessment, Market Research, Defining Specs, Procurement Strategy, Budgeting, Risk Assessment, Developing Tender Docs, Evaluation Criteria, Internal Approvals, Timetable.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organizations skip the market analysis step and rush into tendering, which often leads to unrealistic specifications and poor supplier responses.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Proper procurement preparation can reduce project costs by up to 20% by identifying market opportunities and risks early.',
      },
      {
        title: 'Pro Tip',
        text: 'Always conduct market consultations before finalizing specifications. This helps ensure that your requirements are realistic and achievable in the current market.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 10 steps of procurement preparation with the acronym "N-M-D-P-B-R-D-E-I-T": Needs Assessment, Market Research, Defining Specs, Procurement Strategy, Budgeting, Risk Assessment, Developing Tender Docs, Evaluation Criteria, Internal Approvals, Timetable.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organizations skip the market analysis step and rush into tendering, which often leads to unrealistic specifications and poor supplier responses.',
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
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Procurement Preparation &amp;{' '}
            <span className="text-rose-300 font-bold italic">
              Planning
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to procurement preparation, planning, annual and individual procurement plans, shared procurement, divisions of procurement, and market consultations.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Clipboard size={14} className="inline mr-1" /> Preparation
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Planning
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Calendar size={14} className="inline mr-1" /> Annual Plans
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Shared Procurement
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
                placeholder="Search for a step, plan type, concept..."
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
                Introduction to Procurement Preparation &amp; Planning
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Procurement preparation and planning are the foundational steps that set the stage for successful procurement outcomes. This module covers the essential activities, strategies, and considerations that ensure procurement is conducted efficiently, transparently, and in alignment with organizational goals.
                  </p>
</div>
            </div>

            {/* SECTION 2: Procurement Preparation */}
            <div
              ref={(el) => {
                sectionRefs.current['preparation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procurement Preparation
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Procurement preparation is the crucial initial phase of the procurement process. It involves all the activities and planning that take place before a formal solicitation (like a tender) is issued. Effective preparation sets the stage for a successful procurement outcome, ensuring that the right goods, services, or works are acquired at the best value.
                  </p>
</div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Activities in Procurement Preparation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Needs Assessment',
                    icon: <ClipboardList size={16} />,
                    content: (
                      <>
                        <p>This involves clearly defining the organization's requirements for goods, services, or works.</p>
                        <p>It includes identifying the specific needs, quantities, quality standards, and delivery timelines.</p>
                        <p>This is the first step, and the most vital, as it defines what is needed.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Market Research',
                    icon: <Search size={16} />,
                    content: (
                      <>
                        <p>Conducting thorough market research to understand the availability of suppliers, market trends, pricing, and potential risks.</p>
                        <p>This helps to identify potential suppliers, assess their capabilities, and determine the feasibility of the procurement.</p>
                        <p>This research can save money, and time, and also makes it possible to find the best possible supplier.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Defining Specifications',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p>Developing clear and detailed specifications that accurately describe the required goods, services, or works.</p>
                        <p>Specifications should be objective, measurable, and non-discriminatory.</p>
                        <p>Clear specifications prevent misunderstandings and ensure that suppliers can provide accurate bids.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Developing the Procurement Strategy',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p>Determining the appropriate procurement method (e.g., open tendering, limited tendering, direct procurement) based on the nature of the procurement and applicable regulations.</p>
                        <p>This includes deciding on the evaluation criteria, contract terms, and risk management strategies.</p>
                        <p>A well-defined strategy ensures that the procurement process is efficient and effective.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Budgeting and Funding',
                    icon: <DollarSign size={16} />,
                    content: (
                      <>
                        <p>Securing the necessary funding for the procurement and developing a realistic budget.</p>
                        <p>This includes estimating the total cost of the procurement, including all related expenses.</p>
                        <p>Proper budgeting prevents financial shortfalls and ensures that the procurement can be completed successfully.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Risk Assessment and Management',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>Identifying and assessing potential risks associated with the procurement, such as supplier risks, market risks, and legal risks.</p>
                        <p>Developing strategies to mitigate these risks and ensure the successful completion of the procurement.</p>
                        <p>Risk management is vital to the success of any large project.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Developing the Tender Documents',
                    icon: <File size={16} />,
                    content: (
                      <>
                        <p>Preparing the tender documents, including the invitation to tender, instructions to bidders, specifications, evaluation criteria, and contract terms.</p>
                        <p>Tender documents should be clear, concise, and compliant with applicable regulations.</p>
                        <p>Good tender documents lead to good bids.</p>
                      </>
                    ),
                  },
                  {
                    title: '8. Establishing Evaluation Criteria',
                    icon: <CheckCircle size={16} />,
                    content: (
                      <>
                        <p>Defining the criteria that will be used to evaluate bids and select the successful supplier.</p>
                        <p>Evaluation criteria should be objective, measurable, and aligned with the organization's needs.</p>
                        <p>Good evaluation criteria, leads to the best possible supplier being chosen.</p>
                      </>
                    ),
                  },
                  {
                    title: '9. Internal Approvals',
                    icon: <UserCheck size={16} />,
                    content: (
                      <>
                        <p>Obtaining all necessary internal approvals before issuing the tender.</p>
                        <p>This may involve approvals from management, legal, finance, and other relevant departments.</p>
                        <p>This step is very important in government procurement.</p>
                      </>
                    ),
                  },
                  {
                    title: '10. Timetable Creation',
                    icon: <Calendar size={16} />,
                    content: (
                      <>
                        <p>Creating a timetable of events, and deadlines.</p>
                        <p>This helps to keep all parties informed, and to keep the process on track.</p>
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

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Importance of Procurement Preparation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Minimizes Risks',
                    icon: <Shield size={16} />,
                    content: 'Proper preparation helps to identify and mitigate potential risks, reducing the likelihood of problems during the procurement process.',
                  },
                  {
                    title: 'Ensures Value for Money',
                    icon: <DollarSign size={16} />,
                    content: 'Thorough market research and clear specifications help to ensure that the organization obtains the best possible value for its investment.',
                  },
                  {
                    title: 'Promotes Efficiency',
                    icon: <Activity size={16} />,
                    content: 'Well-defined procedures and clear documentation streamline the procurement process, saving time and resources.',
                  },
                  {
                    title: 'Enhances Compliance',
                    icon: <FileCheck size={16} />,
                    content: 'Proper preparation helps to ensure that the procurement is conducted in compliance with applicable laws, regulations, and policies.',
                  },
                  {
                    title: 'Facilitates Successful Outcomes',
                    icon: <Star size={16} />,
                    content: 'Effective preparation increases the likelihood of a successful procurement outcome, ensuring that the organization\'s needs are met.',
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

            {/* SECTION 3: Procurement Planning */}
            <div
              ref={(el) => {
                sectionRefs.current['planning'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procurement Planning
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Planning of procurement is the foundational step in any successful acquisition process. It involves strategically outlining how an organization will acquire the necessary goods, services, or works to meet its operational needs. It's not just about buying things; it's about doing so in a way that aligns with the organization's goals, maximizes value, and minimizes risks.
                  </p>
</div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Steps in Procurement Planning</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Defining Organizational Needs',
                    icon: <ClipboardList size={16} />,
                    content: (
                      <>
                        <p>The process begins with a clear understanding of what the organization needs. This involves identifying the specific goods, services, or works required, their quantities, quality standards, and delivery timelines.</p>
                        <p>This step ensures that the procurement aligns with the organization's strategic objectives.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Conducting Market Analysis',
                    icon: <Search size={16} />,
                    content: (
                      <>
                        <p>A thorough market analysis is essential to understand the availability of suppliers, market trends, pricing, and potential risks.</p>
                        <p>This research helps to identify potential suppliers, assess their capabilities, and determine the feasibility of the procurement.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Developing a Procurement Strategy',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p>This involves selecting the most appropriate procurement method (e.g., open tendering, limited tendering, direct procurement) based on the nature of the procurement and applicable regulations.</p>
                        <p>It also includes defining the evaluation criteria, contract terms, and risk management strategies.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Budgeting and Funding',
                    icon: <DollarSign size={16} />,
                    content: (
                      <>
                        <p>Securing the necessary funding for the procurement and developing a realistic budget is crucial.</p>
                        <p>This includes estimating the total cost of the procurement, including all related expenses, and ensuring that funds are available.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Risk Assessment and Management',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>Identifying and assessing potential risks associated with the procurement, such as supplier risks, market risks, and legal risks, is essential.</p>
                        <p>Developing strategies to mitigate these risks ensures that the procurement can be completed successfully.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Developing Specifications',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p>Creating clear and detailed specifications that accurately describe the required goods, services, or works is vital.</p>
                        <p>Specifications should be objective, measurable, and non-discriminatory to ensure that suppliers can provide accurate bids.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Establishing Evaluation Criteria',
                    icon: <CheckCircle size={16} />,
                    content: (
                      <>
                        <p>Defining the criteria that will be used to evaluate bids and select the successful supplier ensures fairness and transparency.</p>
                        <p>Evaluation criteria should be objective, measurable, and aligned with the organization's needs.</p>
                      </>
                    ),
                  },
                  {
                    title: '8. Creating a Procurement Timetable',
                    icon: <Calendar size={16} />,
                    content: (
                      <>
                        <p>Developing a detailed timetable that outlines milestones and deadlines ensures that the procurement process stays on track.</p>
                        <p>This helps to coordinate activities and avoid delays.</p>
                      </>
                    ),
                  },
                  {
                    title: '9. Stakeholder Engagement',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p>Involving relevant stakeholders, such as end-users, technical experts, and legal counsel, throughout the planning process ensures that all perspectives are considered.</p>
                        <p>This also helps in creating buy in from all portions of the organisation.</p>
                      </>
                    ),
                  },
                  {
                    title: '10. Documentation',
                    icon: <Archive size={16} />,
                    content: (
                      <>
                        <p>Keeping accurate and complete records of all planning activities is essential for transparency and accountability.</p>
                        <p>This documentation serves as a reference for future audits and evaluations.</p>
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

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Importance of Procurement Planning</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Maximizes Value for Money',
                    icon: <DollarSign size={16} />,
                    content: 'Planning ensures that the organization gets the best possible value for its investment.',
                  },
                  {
                    title: 'Reduces Risks',
                    icon: <Shield size={16} />,
                    content: 'Proactive risk assessment and management minimize the likelihood of problems during the procurement process.',
                  },
                  {
                    title: 'Ensures Compliance',
                    icon: <FileCheck size={16} />,
                    content: 'Planning helps to ensure that the procurement is conducted in compliance with applicable laws, regulations, and policies.',
                  },
                  {
                    title: 'Improves Efficiency',
                    icon: <Activity size={16} />,
                    content: 'Well-defined procedures and clear documentation streamline the procurement process, saving time and resources.',
                  },
                  {
                    title: 'Enhances Transparency',
                    icon: <Eye size={16} />,
                    content: 'Thorough planning promotes transparency and accountability throughout the procurement process.',
                  },
                  {
                    title: 'Aligns with Organizational Goals',
                    icon: <Target size={16} />,
                    content: 'Planning ensures that procurement activities are aligned with the organization\'s strategic objectives.',
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

            {/* SECTION 4: Designing Annual and Individual Procurement Plan */}
            <div
              ref={(el) => {
                sectionRefs.current['plans'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Designing Annual and Individual Procurement Plan
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Designing annual and individual procurement plans is a strategic process that ensures an organization's procurement activities are aligned with its overall goals and objectives. Here's a breakdown of how to approach both:
                  </p>
</div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-4">Annual Procurement Plan</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">An annual procurement plan provides a high-level overview of the organization's anticipated procurement needs for the upcoming year. It's a strategic document that guides procurement activities and ensures that resources are allocated efficiently.</p>
              </div>

              <h4 className="text-md font-bold text-slate-700 dark:text-slate-300 mt-2">Steps in Designing an Annual Procurement Plan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Analyze Organizational Needs',
                    icon: <ClipboardList size={16} />,
                    content: 'Review the organization\'s strategic plan, operational plans, and budget to identify anticipated procurement needs. Gather input from various departments and stakeholders to understand their requirements. Look at past procurement activities and identify recurring needs.',
                  },
                  {
                    title: '2. Conduct Market Analysis',
                    icon: <Search size={16} />,
                    content: 'Research market trends, supplier capabilities, and pricing to assess the feasibility of planned procurements. Identify potential risks and opportunities in the market. Consider the impact of economic conditions and other external factors.',
                  },
                  {
                    title: '3. Prioritize Procurements',
                    icon: <Target size={16} />,
                    content: 'Prioritize procurement needs based on their importance to the organization\'s goals and objectives. Consider factors such as urgency, budget constraints, and potential risks. Create a prioritized list of procurement projects.',
                  },
                  {
                    title: '4. Develop a Procurement Strategy',
                    icon: <SettingsIcon size={16} />,
                    content: 'Determine the appropriate procurement methods for each project (e.g., open tendering, limited tendering, direct procurement). Outline the evaluation criteria, contract terms, and risk management strategies. Consider the organization\'s policies and regulations.',
                  },
                  {
                    title: '5. Create a Budget',
                    icon: <DollarSign size={16} />,
                    content: 'Estimate the total cost of each procurement project and develop an overall procurement budget. Ensure that the budget aligns with the organization\'s financial resources. Consider contingency funds for unexpected expenses.',
                  },
                  {
                    title: '6. Develop a Timetable',
                    icon: <Calendar size={16} />,
                    content: 'Create a timeline for each procurement project, including milestones and deadlines. Coordinate the timetable with other organizational activities. Consider seasonal factors and lead times.',
                  },
                  {
                    title: '7. Document the Plan',
                    icon: <FileText size={16} />,
                    content: 'Document the annual procurement plan in a clear and concise manner. Include all relevant information, such as project descriptions, budgets, timelines, and procurement strategies. Obtain necessary approvals from management.',
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

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mt-6">Individual Procurement Plan</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">An individual procurement plan focuses on a specific procurement project. It provides detailed information on how the project will be executed.</p>
              </div>

              <h4 className="text-md font-bold text-slate-700 dark:text-slate-300 mt-2">Steps in Designing an Individual Procurement Plan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Define Project Scope',
                    icon: <FileText size={16} />,
                    content: 'Clearly define the scope of the procurement project, including the specific goods, services, or works required. Develop detailed specifications and requirements. Ensure that the project aligns with the organization\'s needs.',
                  },
                  {
                    title: '2. Conduct Detailed Market Research',
                    icon: <Search size={16} />,
                    content: 'Perform a more in-depth market analysis to identify potential suppliers and assess their capabilities. Gather information on pricing, delivery times, and quality standards. Evaluate supplier risks and opportunities.',
                  },
                  {
                    title: '3. Select Procurement Method',
                    icon: <SettingsIcon size={16} />,
                    content: 'Choose the most appropriate procurement method based on the project\'s scope and complexity. Consider factors such as the value of the contract, the number of potential suppliers, and the urgency of the need.',
                  },
                  {
                    title: '4. Develop Tender Documents',
                    icon: <File size={16} />,
                    content: 'Prepare the tender documents, including the invitation to tender, instructions to bidders, specifications, evaluation criteria, and contract terms. Ensure that the documents are clear, concise, and compliant with applicable regulations.',
                  },
                  {
                    title: '5. Establish Evaluation Criteria',
                    icon: <CheckCircle size={16} />,
                    content: 'Define the specific criteria that will be used to evaluate bids and select the successful supplier. Ensure that the criteria are objective, measurable, and aligned with the project\'s objectives.',
                  },
                  {
                    title: '6. Create an Evaluation Plan',
                    icon: <Clipboard size={16} />,
                    content: 'Develop a plan on how the evaluation of the tenders will be executed.',
                  },
                  {
                    title: '7. Manage Risk',
                    icon: <Shield size={16} />,
                    content: 'Conduct a thorough risk assessment and develop strategies to mitigate potential risks. Consider risks related to suppliers, contracts, and project implementation.',
                  },
                  {
                    title: '8. Develop a Contract Management Plan',
                    icon: <FileCheck size={16} />,
                    content: 'Outline how the contract will be managed, including performance monitoring, payment schedules, and dispute resolution procedures. Develop a plan for contract closeout.',
                  },
                  {
                    title: '9. Obtain Approvals',
                    icon: <UserCheck size={16} />,
                    content: 'Obtain all necessary approvals from management and relevant departments before issuing the tender.',
                  },
                  {
                    title: '10. Document the Plan',
                    icon: <Archive size={16} />,
                    content: 'Document the individual procurement plan in detail, including all relevant information and approvals. Keep accurate records of all actions taken.',
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

            {/* SECTION 5: Planning for Shared Procurement */}
            <div
              ref={(el) => {
                sectionRefs.current['shared'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Planning for Shared Procurement
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Planning for shared procurement, also known as collaborative or joint procurement, involves multiple organizations combining their purchasing power to achieve economies of scale, reduce costs, and improve efficiency. It requires careful planning and coordination to ensure success.
                  </p>
</div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Steps in Planning for Shared Procurement</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Identify Participating Organizations',
                    icon: <Users size={16} />,
                    content: 'Determine which organizations will participate in the shared procurement initiative. Ensure that participating organizations have similar procurement needs and goals. Establish clear roles and responsibilities for each organization.',
                  },
                  {
                    title: '2. Define Shared Needs and Requirements',
                    icon: <ClipboardList size={16} />,
                    content: 'Conduct a thorough analysis of the procurement needs of all participating organizations. Identify common goods, services, or works that can be procured jointly. Develop standardized specifications and requirements to ensure consistency.',
                  },
                  {
                    title: '3. Establish a Governance Structure',
                    icon: <Building2 size={16} />,
                    content: 'Create a governance structure that outlines how decisions will be made and how the shared procurement initiative will be managed. Establish a steering committee or working group with representatives from each participating organization. Define clear decision-making processes and communication protocols.',
                  },
                  {
                    title: '4. Develop a Procurement Strategy',
                    icon: <Target size={16} />,
                    content: 'Determine the most appropriate procurement method for the shared procurement (e.g., joint tendering, framework agreements). Outline the evaluation criteria, contract terms, and risk management strategies. Consider the legal and regulatory requirements for shared procurement.',
                  },
                  {
                    title: '5. Conduct Market Analysis',
                    icon: <Search size={16} />,
                    content: 'Research market trends, supplier capabilities, and pricing to assess the feasibility of the shared procurement. Identify potential suppliers who can meet the combined needs of the participating organizations. Consider the impact of market conditions on the shared procurement.',
                  },
                  {
                    title: '6. Develop a Budget and Funding Mechanism',
                    icon: <DollarSign size={16} />,
                    content: 'Estimate the total cost of the shared procurement and develop a joint budget. Establish a funding mechanism that outlines how costs will be shared among the participating organizations. Consider potential cost savings and efficiency gains.',
                  },
                  {
                    title: '7. Develop Tender Documents',
                    icon: <File size={16} />,
                    content: 'Prepare joint tender documents that reflect the combined needs and requirements of the participating organizations. Ensure that the tender documents are clear, concise, and compliant with applicable regulations. Clearly state how the contract will be managed.',
                  },
                  {
                    title: '8. Establish Evaluation Criteria',
                    icon: <CheckCircle size={16} />,
                    content: 'Define the evaluation criteria that will be used to select the successful supplier. Ensure that the criteria are objective, measurable, and aligned with the shared objectives of the participating organizations. Create a plan on how the evaluation of the tenders will be handled.',
                  },
                  {
                    title: '9. Develop a Contract Management Plan',
                    icon: <FileCheck size={16} />,
                    content: 'Outline how the contract will be managed, including performance monitoring, payment schedules, and dispute resolution procedures. Establish clear lines of communication between the participating organizations and the supplier. Create a plan for contract close out.',
                  },
                  {
                    title: '10. Communication and Collaboration',
                    icon: <MessageCircle size={16} />,
                    content: 'Establish clear communication channels and protocols to ensure effective collaboration among the participating organizations. Conduct regular meetings and provide updates on the progress of the shared procurement initiative. Ensure that all parties are informed of any changes to the procurement process.',
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

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mt-4">Benefits of Shared Procurement</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Economies of Scale',
                    icon: <TrendingUp size={16} />,
                    content: 'Increased purchasing power leads to lower prices and better terms.',
                  },
                  {
                    title: 'Reduced Costs',
                    icon: <DollarSign size={16} />,
                    content: 'Shared resources and administrative costs lead to overall cost savings.',
                  },
                  {
                    title: 'Improved Efficiency',
                    icon: <Activity size={16} />,
                    content: 'Streamlined procurement processes and standardized requirements lead to greater efficiency.',
                  },
                  {
                    title: 'Enhanced Supplier Relationships',
                    icon: <Users2 size={16} />,
                    content: 'Joint procurement can strengthen relationships with suppliers.',
                  },
                  {
                    title: 'Increased Access to Expertise',
                    icon: <BookOpen size={16} />,
                    content: 'Participating organizations can share expertise and best practices.',
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

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mt-4">Challenges of Shared Procurement</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Coordination',
                    icon: <AlertTriangle size={16} />,
                    content: 'Coordinating the needs and requirements of multiple organizations can be challenging.',
                  },
                  {
                    title: 'Decision-Making',
                    icon: <Target size={16} />,
                    content: 'Reaching consensus on procurement decisions can be time-consuming.',
                  },
                  {
                    title: 'Legal and Regulatory Issues',
                    icon: <Shield size={16} />,
                    content: 'Shared procurement may involve complex legal and regulatory issues.',
                  },
                  {
                    title: 'Risk Management',
                    icon: <AlertTriangle size={16} />,
                    content: 'Managing risks associated with shared procurement requires careful planning and coordination.',
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

            {/* SECTION 6: Divisions of Procurement */}
            <div
              ref={(el) => {
                sectionRefs.current['divisions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Divisions of Procurement
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The division of procurements refers to the strategic categorization and structuring of procurement activities within an organization. This division helps to streamline processes, improve efficiency, and ensure that different types of procurements are handled appropriately.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. By Type of Goods, Services, or Works',
                    icon: <Package size={16} />,
                    content: (
                      <>
                        <p>This is a fundamental division. Procurements are categorized based on what is being acquired.</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Goods:</strong> Tangible items like office supplies, equipment, or materials.</li>
                          <li><strong>Services:</strong> Intangible items like consulting, maintenance, or IT support.</li>
                          <li><strong>Works:</strong> Construction, infrastructure projects, or renovations.</li>
                        </ul>
                        <p>This division allows for specialized expertise and processes for each category.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. By Value or Threshold',
                    icon: <DollarSign size={16} />,
                    content: (
                      <>
                        <p>Procurements are often divided based on their monetary value.</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Small Value Procurements:</strong> Low-value, routine purchases.</li>
                          <li><strong>Medium Value Procurements:</strong> Moderately valued purchases requiring more formal processes.</li>
                          <li><strong>High Value Procurements:</strong> Large, complex purchases requiring extensive planning and oversight.</li>
                        </ul>
                        <p>This division allows for streamlined processes for smaller purchases and more rigorous processes for larger ones. Thresholds are often set by law.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. By Procurement Method',
                    icon: <SettingsIcon size={16} />,
                    content: (
                      <>
                        <p>Procurements are divided based on the method used to acquire goods, services, or works.</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Open Tendering:</strong> Publicly advertised tenders open to all qualified bidders.</li>
                          <li><strong>Limited Tendering:</strong> Tenders sent to a select group of qualified bidders.</li>
                          <li><strong>Direct Procurement:</strong> Purchases made directly from a single supplier.</li>
                          <li><strong>Framework Agreements:</strong> Agreements with suppliers for recurring purchases over a period of time.</li>
                        </ul>
                        <p>This division ensures that the appropriate method is used for each procurement scenario.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. By Department or Business Unit',
                    icon: <Building2 size={16} />,
                    content: (
                      <>
                        <p>Procurements are divided based on the department or business unit that requires the goods, services, or works.</p>
                        <p>Each department may have its own procurement team or designated personnel.</p>
                        <p>This division allows for decentralized procurement and ensures that the needs of individual departments are met.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. By Project or Program',
                    icon: <FileBarChart size={16} />,
                    content: (
                      <>
                        <p>Procurements are divided based on specific projects or programs.</p>
                        <p>Large projects may have dedicated procurement teams or plans.</p>
                        <p>This division allows for focused procurement activities and ensures that project requirements are met.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. By Geographical Location',
                    icon: <MapPin size={16} />,
                    content: (
                      <>
                        <p>Procurements are divided based on the geographical location of the supplier or the delivery location.</p>
                        <p>This may be relevant for organizations with operations in multiple regions.</p>
                        <p>This can be very important when dealing with local content requirements.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. By Urgency',
                    icon: <Clock size={16} />,
                    content: (
                      <>
                        <p>Procurements can be divided based on how urgent they are.</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Emergency procurements.</strong></li>
                          <li><strong>Routine procurements.</strong></li>
                        </ul>
                        <p>This division allows for faster processing of emergency procurement.</p>
                      </>
                    ),
                  },
                  {
                    title: '8. By Funding Source',
                    icon: <CreditCard size={16} />,
                    content: (
                      <>
                        <p>Procurements can be divided based on the funding source.</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Government funded.</strong></li>
                          <li><strong>Donor funded.</strong></li>
                          <li><strong>Internal funds.</strong></li>
                        </ul>
                        <p>This division allows for correct adherence to the funding source requirements.</p>
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

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Benefits of Dividing Procurements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Improved Efficiency',
                    icon: <Activity size={16} />,
                    content: 'Streamlines processes and reduces administrative burdens.',
                  },
                  {
                    title: 'Enhanced Control',
                    icon: <Shield size={16} />,
                    content: 'Allows for better oversight and management of procurement activities.',
                  },
                  {
                    title: 'Specialized Expertise',
                    icon: <Star size={16} />,
                    content: 'Enables the development of specialized expertise for different types of procurements.',
                  },
                  {
                    title: 'Reduced Risks',
                    icon: <AlertTriangle size={16} />,
                    content: 'Minimizes risks associated with complex or high-value procurements.',
                  },
                  {
                    title: 'Increased Compliance',
                    icon: <FileCheck size={16} />,
                    content: 'Ensures that procurement activities comply with applicable laws and regulations.',
                  },
                  {
                    title: 'Better Value for Money',
                    icon: <DollarSign size={16} />,
                    content: 'Facilitates the selection of the most appropriate procurement method and supplier.',
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

            {/* SECTION 7: Market Consultations */}
            <div
              ref={(el) => {
                sectionRefs.current['consultations'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Market Consultations
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Market consultations are a valuable tool in the procurement process, particularly for complex or high-value procurements. They involve engaging with potential suppliers and industry experts to gather information, insights, and feedback before issuing a formal solicitation (like a tender).
                  </p>
</div>

              {renderCard(
                'What are Market Consultations?',
                <Users size={16} />,
                <>
                  <p>Market consultations are a form of pre-procurement engagement.</p>
                  <p>They involve discussions, meetings, or surveys with potential suppliers, industry associations, and other relevant stakeholders.</p>
                  <p>The goal is to gather information about market conditions, supplier capabilities, and potential solutions before finalizing procurement requirements.</p>
                </>
              )}

              {renderCard(
                'Objectives of Market Consultations',
                <Target size={16} />,
                <>
                  <p><strong>Gather Market Intelligence:</strong> Understand market trends, pricing, and supplier capabilities. Identify potential risks and opportunities. Assess the availability of innovative solutions.</p>
                  <p><strong>Refine Procurement Requirements:</strong> Validate the organization's needs and specifications. Identify potential challenges and refine requirements accordingly. Ensure that requirements are realistic and achievable.</p>
                  <p><strong>Improve Tender Documents:</strong> Gather feedback on draft tender documents. Ensure that the documents are clear, concise, and non-discriminatory. Identify potential ambiguities or inconsistencies.</p>
                  <p><strong>Promote Competition:</strong> Increase awareness of upcoming procurement opportunities. Encourage participation from a wider range of suppliers. Foster a competitive bidding environment.</p>
                  <p><strong>Build Relationships:</strong> Establish relationships with potential suppliers and industry experts. Gain insights into supplier perspectives and concerns. Facilitate open communication and collaboration.</p>
                  <p><strong>Assess the feasibility of the project:</strong> Determine if the project as envisioned is actually possible within the current market.</p>
                  <p><strong>Determine if the budget is sufficient:</strong> Gain insight into the cost of the project, and determine if the budget is sufficient.</p>
                </>
              )}

              {renderCard(
                'Methods of Market Consultations',
                <MessageCircle size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Requests for Information (RFIs):</strong> Formal requests for information from potential suppliers. Used to gather data on supplier capabilities and market conditions.</li>
                    <li><strong>Industry Workshops and Seminars:</strong> Meetings with potential suppliers and industry experts. Used to discuss procurement requirements and gather feedback.</li>
                    <li><strong>One-on-One Meetings:</strong> Individual meetings with potential suppliers. Used to discuss specific requirements and gather detailed information.</li>
                    <li><strong>Online Surveys and Questionnaires:</strong> Surveys distributed to potential suppliers. Used to gather quantitative and qualitative data.</li>
                    <li><strong>Draft Tender Document Reviews:</strong> Suppliers are given the ability to review a draft of the tender document, and give feedback.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Benefits of Market Consultations',
                <Star size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Improved Procurement Outcomes:</strong> Ensures that procurement requirements are aligned with market realities. Reduces the risk of unsuccessful procurements.</li>
                    <li><strong>Increased Efficiency:</strong> Streamlines the procurement process by identifying potential issues early on. Reduces the need for costly revisions.</li>
                    <li><strong>Enhanced Transparency:</strong> Promotes open communication and collaboration with suppliers. Builds trust and confidence in the procurement process.</li>
                    <li><strong>Reduced Risk:</strong> Helps to identify and mitigate potential risks before issuing a tender.</li>
                  </ul>
                  <p>In essence, market consultations are a proactive approach to procurement that helps organizations gather valuable insights and make informed decisions.</p>
                </>
              )}
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Planning Insight
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
                  <span>Preparation Activities</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Planning Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Division Categories</span>
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
                Procurement preparation involves needs assessment, market research, specifications, strategy, budgeting, risk assessment, tender documents, evaluation criteria, approvals, and timetable. Procurement planning defines organizational needs, conducts market analysis, develops strategy, budgets, assesses risk, creates specifications, establishes evaluation criteria, sets a timetable, engages stakeholders, and documents everything. Annual and individual plans guide strategic and project-specific procurement. Shared procurement offers economies of scale but requires careful coordination. Divisions by type, value, method, department, project, location, urgency, and funding source improve efficiency. Market consultations gather intelligence, refine requirements, and improve outcomes.
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
                <strong className="text-white">Procurement Preparation</strong> – Ten essential activities: Needs Assessment, Market Research, Specifications, Strategy, Budgeting, Risk Assessment, Tender Documents, Evaluation Criteria, Approvals, Timetable. Preparation minimizes risks, ensures value, promotes efficiency, enhances compliance, and facilitates success.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Procurement Planning</strong> – Ten steps: Define Needs, Market Analysis, Strategy, Budgeting, Risk Assessment, Specifications, Evaluation Criteria, Timetable, Stakeholder Engagement, Documentation. Planning maximizes value, reduces risks, ensures compliance, improves efficiency, enhances transparency, and aligns with goals.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Annual &amp; Individual Plans</strong> – Annual plans provide high-level strategic direction; individual plans detail specific project execution. Both require thorough analysis, strategy development, budgeting, and documentation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Shared Procurement &amp; Divisions</strong> – Shared procurement offers economies of scale but requires coordination. Divisions by type, value, method, department, project, location, urgency, and funding source improve efficiency and control.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Market Consultations</strong> – Pre-procurement engagement with suppliers and experts to gather intelligence, refine requirements, improve documents, promote competition, build relationships, and assess feasibility. Key methods: RFIs, workshops, meetings, surveys, and draft reviews.
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
            Sidemann Academic Registry • Procurement Preparation &amp; Planning Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;
