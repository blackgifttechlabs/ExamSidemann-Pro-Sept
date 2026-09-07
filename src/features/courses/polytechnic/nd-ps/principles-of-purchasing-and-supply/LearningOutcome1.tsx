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
  Users,
  Wrench,
  BarChart,
  MessageSquare,
  Calendar,
  Mail,
  User,
  Headphones,
  TrendingUp,
  AlertTriangle,
  Leaf,
  Cpu,
  DollarSign,
  Search,
  X as XIcon,
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
  { id: 'micro', label: 'Micro Environment' },
  { id: 'macro', label: 'Macro Environment' },
  { id: 'importance', label: 'Importance' },
  { id: 'issues', label: 'Contemporary Issues' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome1: React.FC = () => {
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
        text: 'The term "purchasing" has evolved from a clerical function to a strategic business activity. Modern purchasing professionals are expected to contribute to corporate strategy, not just process orders.',
      },
      {
        title: 'Pro Tip',
        text: 'To build supply chain resilience, avoid over-reliance on single suppliers. Diversify your supplier base and develop contingency plans for potential disruptions.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the micro environment factors as "SCCC" — Suppliers, Customers, Competitors, and the Company itself. These are the direct influences on purchasing decisions.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t ignore the macro environment. Political instability, economic downturns, or technological shifts can have a significant impact on purchasing decisions and supply chain performance.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The term "purchasing" has evolved from a clerical function to a strategic business activity. Modern purchasing professionals are expected to contribute to corporate strategy, not just process orders.',
      },
      {
        title: 'Pro Tip',
        text: 'To build supply chain resilience, avoid over-reliance on single suppliers. Diversify your supplier base and develop contingency plans for potential disruptions.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the micro environment factors as "SCCC" — Suppliers, Customers, Competitors, and the Company itself. These are the direct influences on purchasing decisions.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t ignore the macro environment. Political instability, economic downturns, or technological shifts can have a significant impact on purchasing decisions and supply chain performance.',
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

  // Helper to render a clean card
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
            <FolderTree size={14} className="inline mr-1" /> PROCUREMENT &amp; SUPPLY CHAIN
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Micro &amp; Macro{' '}
            <span className="text-emerald-300 font-bold italic">
              Purchasing Environments
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive overview of micro and macro purchasing environments, the importance of purchasing, and contemporary issues in purchasing.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Micro
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <GlobeIcon size={14} className="inline mr-1" /> Macro
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <TrendingUp size={14} className="inline mr-1" /> Importance
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
                placeholder="Search for a concept, factor, issue..."
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
            {/* SECTION 1: Intro */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Micro and Macro Purchasing Environments
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When a business buys things, it is not just a simple transaction. There are factors that directly affect the company (micro) and larger, external factors (macro) that influence those purchases. It is like how weather (macro) and your own garden (micro) both affect where your vegetables come from.
                  </p>
</div>
            </div>

            {/* SECTION 2: Micro Purchasing Environment */}
            <div
              ref={(el) => {
                sectionRefs.current['micro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Micro Purchasing Environment
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The things that directly affect a company's buying decisions.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Users size={16} /> Detailed Explanation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The micro purchasing environment consists of the factors that directly impact a company's purchasing decisions. These are the elements that are close to the company and within its immediate sphere of influence. This includes:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <li><strong>Suppliers:</strong> The businesses that provide goods and services. Their reliability, pricing, and relationships play a significant role.</li>
                  <li><strong>Customers:</strong> Customer demand drives purchasing needs. What customers want directly influences what a company buys.</li>
                  <li><strong>Competitors:</strong> Competitor actions can influence purchasing strategy, especially regarding pricing and quality.</li>
                  <li><strong>The Company Itself:</strong> Internal factors like financial resources, production capabilities, and overall strategy.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  For example, a restaurant's microenvironment includes food suppliers, customers, other restaurants, and its own budget. If a supplier raises prices, the restaurant might find a new supplier, raise menu prices, or reduce quality. If customers demand more vegetarian options, the restaurant will adjust its purchases. If a competitor opens with lower prices, the restaurant may need to adjust its strategy.
                </p>
              </div>
            </div>

            {/* SECTION 3: Macro Purchasing Environment */}
            <div
              ref={(el) => {
                sectionRefs.current['macro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Macro Purchasing Environment
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The larger, outside forces that indirectly affect a company's buying decisions.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <GlobeIcon size={16} /> Detailed Explanation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The macro purchasing environment consists of the larger, external forces that indirectly impact a company's purchasing decisions. These are factors outside of the company's direct control but can still have a significant influence. This includes:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <li><strong>Economic Factors:</strong> Inflation, interest rates, and economic growth affect purchasing power and demand.</li>
                  <li><strong>Technological Factors:</strong> New technologies can create new needs or make existing products obsolete.</li>
                  <li><strong>Political Factors:</strong> Government regulations, trade policies, and political stability affect purchasing decisions.</li>
                  <li><strong>Social Factors:</strong> Changes in consumer preferences, demographics, and cultural trends influence purchasing.</li>
                  <li><strong>Legal Factors:</strong> Laws regarding safety, environment, and fair-trade practices impact what and how products are purchased.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  For example, a global recession reduces business spending. New technology may require new equipment investment. Government tariffs may require finding new suppliers. Growing trends toward sustainability may require switching to environmentally friendly materials. All these factors are outside the company's direct control but influence decisions.
                </p>
              </div>
            </div>

            {/* SECTION 4: Importance of Purchasing */}
            <div
              ref={(el) => {
                sectionRefs.current['importance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Importance of Purchasing
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Purchasing is more than just buying stuff. It is about getting the right things, at the right price, at the right time. This is crucial for a company's success and a nation's economy.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Target size={16} /> 1. Internal Importance (Within a Company)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    How good buying helps a company run smoothly and make money.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Ensures necessary materials, equipment, and resources for operations.</li>
                    <li>Quality materials reduce production errors.</li>
                    <li>Materials available when needed.</li>
                    <li>Good prices on materials.</li>
                    <li>Cost savings, improved product quality, increased customer satisfaction.</li>
                    <li>Minimizes waste and reduces inventory costs.</li>
                    <li>Builds strong supplier relationships for better terms and quicker delivery.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <TrendingUp size={16} /> 2. External Importance (Nationally)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    How good buying helps a country's economy grow and stay strong.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Influences trade balances, job creation, and economic growth.</li>
                    <li>Government procurement and private sector imports affect trade balance.</li>
                    <li>Creates jobs and stimulates economic activity.</li>
                    <li>Influences technological development and innovation.</li>
                    <li>Ensures critical resources (food, energy, medical supplies) are available.</li>
                    <li>Key driver of a nation's economic stability and growth.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 5: Contemporary Issues in Purchasing */}
            <div
              ref={(el) => {
                sectionRefs.current['issues'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Contemporary Issues in Purchasing
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These are the current challenges and trends that purchasing professionals must deal with. It is about how the world is changing and how that affects how companies buy things.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} /> 1. Supply Chain Resilience and Disruption
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Dealing with unexpected problems that stop supplies from arriving on time.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Global supply chains are complex and vulnerable to disruptions (natural disasters, geopolitical events, pandemics, cyberattacks).</li>
                    <li>COVID-19 highlighted supply chain fragility.</li>
                    <li>Focus on building resilient supply chains through diversification, inventory buffers, and contingency plans.</li>
                    <li>Investing in technologies for visibility and proactive risk management.</li>
                    <li>Building stronger supplier relationships and communication.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Leaf size={16} /> 2. Sustainability and Ethical Sourcing
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Buying things in a way that is good for the environment and fair to workers.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Growing concern about environmental and social impact.</li>
                    <li>Considering environmental footprint and labour practices of suppliers.</li>
                    <li>Sourcing from suppliers with sustainable practices.</li>
                    <li>Conducting audits for labour law and ethical standards compliance.</li>
                    <li>Building positive brand image and long-term value.</li>
                    <li>Attracting and retaining customers and talented employees.</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Cpu size={16} /> 3. Digital Transformation and Technology Adoption
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Using new technology to buy things faster and smarter.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Technology is transforming the purchasing function.</li>
                    <li>Use of e-procurement systems, data analytics, AI, and blockchain.</li>
                    <li>Automating tasks like requisitioning, ordering, and invoicing.</li>
                    <li>Data analytics for spending patterns, supplier performance, and market trends.</li>
                    <li>AI for supplier selection and contract negotiation.</li>
                    <li>Blockchain for transparency and traceability.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <DollarSign size={16} /> 4. Global Economic Uncertainty and Inflation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Dealing with rising prices and unstable economies around the world.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Global economic uncertainty and inflation are significant challenges.</li>
                    <li>Fluctuations in currency exchange rates, rising commodity prices, geopolitical instability.</li>
                    <li>Developing strategies to mitigate risks and maintain competitive pricing.</li>
                    <li>Diversifying suppliers, negotiating long-term contracts, hedging against currency fluctuations.</li>
                    <li>Finding ways to reduce internal costs to offset rising prices.</li>
                  </ul>
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
                  <span>Micro Environment Factors</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Macro Environment Factors</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Contemporary Issues</span>
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
                The micro environment directly affects purchasing decisions through suppliers, customers, competitors, and internal factors. The macro environment (economic, technological, political, social, legal) indirectly influences purchasing. Effective purchasing is important both internally (efficiency, profitability) and externally (national economic health). Contemporary issues like supply chain resilience, sustainability, digital transformation, and economic uncertainty require proactive and strategic management.
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
                <strong className="text-white">Micro Environment</strong> – direct factors affecting purchasing: Suppliers, Customers, Competitors, and the Company itself.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Macro Environment</strong> – external forces: Economic, Technological, Political, Social, and Legal factors that indirectly influence purchasing decisions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Internal Importance</strong> – purchasing ensures operational efficiency, cost savings, quality materials, and strong supplier relationships.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">External Importance</strong> – purchasing influences trade balances, job creation, innovation, and national economic stability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Contemporary Issues</strong> – supply chain resilience, sustainability and ethical sourcing, digital transformation, and global economic uncertainty require strategic purchasing management.
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

export default LearningOutcome1;