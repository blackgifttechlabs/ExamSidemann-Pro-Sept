import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  TrendingUp,
  Award,
  AlertCircle,
  Building2,
  Store,
  GitBranch,
  FileBarChart,
  Share2,
  Upload,
  X,
  Search,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'status', label: 'Status of Purchasing' },
  { id: 'indicators', label: 'Indicators' },
  { id: 'implications', label: 'Implications' },
  { id: 'centralized-decentralized', label: 'Centralized vs Decentralized' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome2: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(
    null
  );

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
        text: 'The purchasing function has evolved from a purely administrative role to a strategic business partner. Companies with high-status purchasing departments often outperform their competitors.',
      },
      {
        title: 'Pro Tip',
        text: 'To raise the status of purchasing in your organization, focus on demonstrating value through cost savings, risk mitigation, and strategic supplier partnerships.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the indicators of high purchasing status: Strategic integration, strong supplier relationships, technology investment, and senior reporting.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t assume centralized purchasing is always better. Decentralized purchasing can offer flexibility and responsiveness, especially in diverse business units.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The purchasing function has evolved from a purely administrative role to a strategic business partner. Companies with high-status purchasing departments often outperform their competitors.',
      },
      {
        title: 'Pro Tip',
        text: 'To raise the status of purchasing in your organization, focus on demonstrating value through cost savings, risk mitigation, and strategic supplier partnerships.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the indicators of high purchasing status: Strategic integration, strong supplier relationships, technology investment, and senior reporting.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t assume centralized purchasing is always better. Decentralized purchasing can offer flexibility and responsiveness, especially in diverse business units.',
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

  // Helper to render a clean card (no coloured left border)
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
            <FolderTree size={14} className="inline mr-1" /> PROCUREMENT &amp; SUPPLY CHAIN
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Status of Purchasing{' '}
            <span className="text-sky-300 font-bold italic">
              Within the Organization
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to understanding purchasing status, indicators of status, implications of purchasing position, and centralized vs decentralized purchasing structures.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Building2 size={14} className="inline mr-1" /> Status
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Award size={14} className="inline mr-1" /> Indicators
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <GitBranch size={14} className="inline mr-1" /> Centralized vs Decentralized
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
                placeholder="Search for a concept, indicator, structure..."
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
                  <X size={18} className="text-indigo-200" />
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
            {/* SECTION 1: Status of Purchasing Within the Organization */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Status of Purchasing Within the Organization
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    What is the Status of Purchasing Within an Organization? It is about understanding how important the "buying department" is seen within a company. Is it just a group that orders supplies, or is it a crucial part of the company's strategy? We will look at how its role has changed and what it means for the company.
                  </p>
</div>

              {renderCard(
                'The Shift from Administrative to Strategic',
                <TrendingUp size={16} />,
                <>
                  <p><strong>Key Point:</strong> Purchasing used to be just about paperwork, now it is about making smart decisions that help the whole company.</p>
                  <p><strong>Detailed Explanation:</strong> For a long time, purchasing was viewed as a purely administrative function. Its primary role was to process orders, manage inventory, and ensure that the company had the necessary supplies to operate. This meant focusing on tasks like filling out forms, getting the best prices for basic materials, and keeping track of what was in the warehouse. In this traditional view, purchasing was often seen as a back-office function, with limited interaction with other departments.</p>
                  <p>However, in today's complex and competitive business environment, the role of purchasing has undergone a significant transformation. Companies have realized that effective purchasing can have a profound impact on their bottom line and overall success. This has led to a shift from a purely transactional approach to a more strategic one. Now, purchasing is involved in critical decisions that affect the entire organization. This includes activities like selecting strategic suppliers, negotiating complex contracts, and contributing to product development.</p>
                  <p>Purchasing professionals are now expected to have a deep understanding of market trends, supply chain dynamics, and the company's overall business strategy. They are involved in cross functional teams, working closely with other departments like engineering, marketing, and finance. This collaborative approach allows them to identify opportunities for cost savings, innovation, and risk mitigation.</p>
                  <p>For example, purchasing might work with engineering to source new materials that can improve product quality or reduce production costs. They might also work with marketing to ensure that the company's sourcing practices align with its brand values and customer expectations. This strategic shift has elevated the status of purchasing within organizations, making it a critical function that contributes to the company's competitive advantage.</p>
                </>
              )}
            </div>

            {/* SECTION 2: Indicators of Purchasing Status */}
            <div
              ref={(el) => {
                sectionRefs.current['indicators'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Indicators of Purchasing Status
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    What are Indicators of Purchasing Status? It is about looking for clues that tell us how important the "buying department" is seen by the rest of the company. We will examine what happens when purchasing is valued and what happens when it is not.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2 mb-2">
                    <Award size={16} /> 1. Indicators of High Purchasing Status
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Strategic Integration:</strong> Purchasing is involved in early product development, strategic planning, and overall business strategy.</li>
                    <li><strong>Strong Supplier Relationships:</strong> Focus on long-term partnerships, collaboration, and mutual benefit.</li>
                    <li><strong>Technology Investment:</strong> Investment in e-procurement systems, data analytics, and training.</li>
                    <li><strong>Senior Reporting:</strong> Purchasing reports directly to senior management (CEO, CFO, CPO).</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-2">
                    <AlertCircle size={16} /> 2. Indicators of Low Purchasing Status
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Administrative Focus:</strong> Primarily responsible for processing orders and managing inventory.</li>
                    <li><strong>Transactional Relationships:</strong> Focus on price over quality or long-term relationships.</li>
                    <li><strong>Lack of Investment:</strong> Reliance on manual processes and outdated systems; limited training.</li>
                    <li><strong>Low-Level Reporting:</strong> Purchasing reports to middle management, limited interaction with senior leaders.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <TrendingUp size={16} /> Implications of Status
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  High purchasing status leads to better cost management, innovation, and competitive advantage. Low status often results in missed opportunities, higher costs, and increased risk.
                </p>
              </div>
            </div>

            {/* SECTION 3: Implications of Purchasing's Position */}
            <div
              ref={(el) => {
                sectionRefs.current['implications'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Implications of Purchasing's Position on the Organizational Structure
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Where the "buying department" sits in the company's chart tells us who they report to and how much power they have. This affects how they work and how much they can help the company.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Building2 size={16} /> Centralized Purchasing
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Increased buying power and cost savings</li>
                    <li>Standardization and improved control</li>
                    <li>Potential for bureaucracy and reduced flexibility</li>
                    <li>Often reports to senior executive (CPO, CFO)</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Store size={16} /> Decentralized Purchasing
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Increased flexibility and responsiveness</li>
                    <li>Closer stakeholder relationships</li>
                    <li>Potential for duplication and reduced buying power</li>
                    <li>Purchasing distributed across departments</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <GitBranch size={16} /> Hybrid Purchasing
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Combines centralization and decentralization</li>
                    <li>Strategic sourcing centralized, operational buying decentralized</li>
                    <li>Balances benefits of both approaches</li>
                    <li>Requires careful coordination</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <FileBarChart size={16} /> Reporting Structure
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>High-level reporting indicates strategic importance</li>
                    <li>Low-level reporting suggests operational role</li>
                    <li>Direct access to senior management increases influence</li>
                    <li>Impacts purchasing's ability to drive company-wide decisions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 4: Centralized and Decentralized Purchasing */}
            <div
              ref={(el) => {
                sectionRefs.current['centralized-decentralized'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Centralized and Decentralized Purchasing
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    What are Centralized and Decentralized Purchasing? It is about how a company organizes its "buying department." Does one big team do all the buying, or do different departments handle their own purchases? It is like deciding whether one person does all the grocery shopping for a big family, or if each family member buys their own food.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Building2 size={16} /> Centralized Purchasing
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Key Point:</strong> One big team does all the buying for the whole company.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Detailed Explanation:</strong> Centralized purchasing means that a single department or team within an organization is responsible for all or most of the company's purchasing activities. This team handles the procurement of goods and services for all departments or business units. This approach aims to consolidate purchasing power, standardize processes, and improve efficiency.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    Imagine a large company with multiple offices across the country. Instead of each office buying its own office supplies, furniture, and equipment, a central purchasing team handles all those purchases. This allows the company to leverage its buying power, negotiate better prices with suppliers, and ensure that all offices are using the same quality of products.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    One of the key advantages of centralized purchasing is cost savings. By consolidating purchasing volume, the company can negotiate better discounts and terms with suppliers. This also reduces duplication of effort, as there's no need for multiple departments to research suppliers and negotiate contracts. Additionally, centralized purchasing ensures consistency in purchasing policies and procedures, which can improve compliance and reduce risks.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    However, centralized purchasing can also have its drawbacks. It can lead to bureaucratic delays, as requests for purchases must go through a central team. This can slow down operations and make it difficult for departments to respond quickly to their specific needs. Also, a centralized team may not fully understand the unique requirements of each department, leading to purchases that do not quite fit the bill.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Store size={16} /> Decentralized Purchasing
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Key Point:</strong> Each department does its own buying.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Detailed Explanation:</strong> Decentralized purchasing means that individual departments or business units are responsible for their own purchasing activities. Each department handles its own procurement of goods and services, based on its specific needs and requirements. This approach aims to increase flexibility and responsiveness.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    Imagine a hospital with multiple departments, such as surgery, radiology, and pharmacy. Instead of a central purchasing team handling all purchases, each department is responsible for buying its own supplies and equipment. This allows each department to quickly obtain the specific items it needs, without going through a central team.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    One of the key advantages of decentralized purchasing is its flexibility. Departments can quickly respond to their specific needs and make purchasing decisions that best suit their operations. This approach also promotes closer relationships between departments and suppliers, as they interact directly. However, decentralized purchasing can also lead to higher costs, as departments may not have the same buying power as a central team. There may also be duplication of effort, as multiple departments research suppliers and negotiate contracts. Additionally, decentralized purchasing can lead to inconsistencies in purchasing policies and procedures, which can increase risks.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    It is also possible to have a hybrid model, where some purchases are centralized, and others are decentralized.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Purchasing Insight
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
                  <span>Status Indicators</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">2 sets</span>
                </li>
                <li className="flex justify-between">
                  <span>Purchasing Structures</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Implications Categories</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Purchasing's status within an organization ranges from administrative to strategic. High status is indicated by strategic integration, strong supplier relationships, technology investment, and senior reporting. The position of purchasing (centralized, decentralized, or hybrid) has significant implications for cost, flexibility, and control. Understanding these factors helps organizations leverage purchasing for competitive advantage.
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
                <strong className="text-white">Status of Purchasing</strong> – has evolved from administrative to strategic, influencing company competitiveness and profitability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Indicators of Status</strong> – high status: strategic involvement, supplier partnerships, technology, senior reporting; low status: administrative focus, transactional, lack of investment, low-level reporting.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Organizational Structures</strong> – centralized (cost savings, control), decentralized (flexibility, responsiveness), hybrid (balance of both). Reporting structure impacts influence.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Strategic Implications</strong> – purchasing's position affects cost management, risk mitigation, innovation, and overall organizational performance.
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
            Sidemann Academic Registry • Procurement &amp; Supply Chain Management 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;