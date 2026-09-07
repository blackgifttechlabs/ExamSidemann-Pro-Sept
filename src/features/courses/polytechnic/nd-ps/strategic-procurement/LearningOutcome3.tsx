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
  Archive,
  HardDriveIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'supplier', label: 'Supplier Management' },
  { id: 'cost', label: 'Cost Reduction' },
  { id: 'inventory', label: 'Inventory Management' },
  { id: 'technology', label: 'Technology' },
  { id: 'risk', label: 'Risk Management' },
  { id: 'pestel', label: 'PESTEL' },
  { id: 'swot', label: 'SWOT' },
  { id: 'bestpractices', label: 'Best Practices' },
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
        text: 'A well-executed procurement strategy can reduce costs by 10-30% while improving quality and supplier relationships.',
      },
      {
        title: 'Pro Tip',
        text: 'When conducting a SWOT analysis, be brutally honest about your weaknesses. Acknowledging them is the first step to improvement.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember PESTEL with "Political, Economic, Social, Technological, Environmental, Legal" – think of the external factors that can impact procurement.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations focus only on cost reduction and ignore supplier relationship management, which can lead to supply chain disruptions and quality issues.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'A well-executed procurement strategy can reduce costs by 10-30% while improving quality and supplier relationships.',
      },
      {
        title: 'Pro Tip',
        text: 'When conducting a SWOT analysis, be brutally honest about your weaknesses. Acknowledging them is the first step to improvement.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember PESTEL with "Political, Economic, Social, Technological, Environmental, Legal" – think of the external factors that can impact procurement.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations focus only on cost reduction and ignore supplier relationship management, which can lead to supply chain disruptions and quality issues.',
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
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Procurement Strategies &amp;{' '}
            <span className="text-purple-300 font-bold italic">
              Analysis
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to identifying and analysing procurement strategies, including PESTEL, SWOT, and international best practices.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Strategies
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <GlobeIcon size={14} className="inline mr-1" /> PESTEL
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ListChecks size={14} className="inline mr-1" /> SWOT
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Best Practices
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
                placeholder="Search for a strategy, framework, concept..."
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
                What are Procurement Strategies?
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine a company is like a kitchen. They need ingredients (supplies) to make food (products). Procurement strategies are like the recipes they use to buy those ingredients. We want to understand their recipes to see if they are making good food (products) and saving money.
                  </p>
</div>
            </div>

            {/* SECTION 2: Analysing Supplier Relationship Management */}
            <div
              ref={(el) => {
                sectionRefs.current['supplier'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Analysing Supplier Relationship Management
              </h2>

              {renderCard(
                'Looking at how the company treats and works with the people they buy from.',
                <Target size={16} />,
                <>
                  <p>A company's relationship with its suppliers is a key part of its procurement strategy. We analysed how they build and maintain these relationships. Do they focus on short-term deals or long-term partnerships? Do they negotiate hard on price, or do they prioritize collaboration and innovation? For example, a company might have a strategy of building strong, long-term relationships with a few key suppliers, working closely with them to improve quality and reduce costs. This could involve sharing information, collaborating on product development, and providing training and support. On the other hand, a company might focus on short-term deals and constantly switch suppliers to get the lowest price. This approach can lead to lower costs in the short term, but it can also lead to quality problems and unreliable supply. analysing these relationships helps us understand if they are getting the best value, and if the products they are receiving are of good quality.</p>
                </>
              )}
            </div>

            {/* SECTION 3: Evaluating Cost Reduction Strategies */}
            <div
              ref={(el) => {
                sectionRefs.current['cost'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Evaluating Cost Reduction Strategies
              </h2>

              {renderCard(
                'Checking how the company tries to save money when buying things.',
                <Hash size={16} />,
                <>
                  <p>Cost reduction is a common goal of procurement strategies. We analysed how the company tries to reduce its spending on goods and services. This might involve negotiating discounts, consolidating purchases, or finding cheaper suppliers. For example, a company might use a strategy of bulk purchasing to get lower prices on high volume items. Or, they might use a competitive bidding process to ensure they are getting the best price from suppliers. We want to know if they are saving money in a smart way, or if they are just cutting corners. For example, are they sacrificing quality for a lower price? We also look at if they are looking at the total cost, or just the initial cost. For example, a cheaper product might break more often, and cost more in the long run. Analysing these cost reduction strategies helps us see if the company is being efficient and effective with its spending.</p>
                </>
              )}
            </div>

            {/* SECTION 4: Assessing Inventory Management Practices */}
            <div
              ref={(el) => {
                sectionRefs.current['inventory'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Assessing Inventory Management Practices
              </h2>

              {renderCard(
                'Seeing how the company keeps track of what they have and makes sure they do not run out or have too much.',
                <Archive size={16} />,
                <>
                  <p>Inventory management is another important aspect of procurement. We analyse how the company manages its stock of goods and materials. Do they use a "just-in-time" approach, where they only order what they need when they need it? Or do they maintain large stockpiles of inventory? For example, a company might use a computerized inventory management system to track stock levels and automatically reorder items when they reach a certain point. Or, they might use a manual system of counting and ordering. We want to know if they are keeping the right amount of stock, and if they are storing it properly. Poor inventory management can lead to stockouts, which can disrupt production and sales. It can also lead to excess inventory, which can tie up capital and increase storage costs. Analysing these practices helps us understand if the company is managing its inventory efficiently and effectively.</p>
                </>
              )}
            </div>

            {/* SECTION 5: Examining Technology Utilization */}
            <div
              ref={(el) => {
                sectionRefs.current['technology'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Examining Technology Utilization
              </h2>

              {renderCard(
                'Checking if the company uses computers and software to make buying things easier and faster.',
                <LayersIcon size={16} />,
                <>
                  <p>Technology plays an increasingly important role in procurement. We analyse how the company uses technology to streamline its procurement processes. This might involve using e-procurement platforms, automated ordering systems, or data analytics tools. For example, a company might use an online portal to manage its supplier relationships and place orders electronically. Or, they might use data analytics to identify trends in spending and identify opportunities for cost savings. We want to know if they are using the latest technology, and if they are using it effectively. Using technology can improve efficiency, reduce costs, and increase transparency in the procurement process. analysing technology utilization helps us understand if the company is leveraging technology to its advantage.</p>
                </>
              )}
            </div>

            {/* SECTION 6: Evaluating Risk Management Strategies */}
            <div
              ref={(el) => {
                sectionRefs.current['risk'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Evaluating Risk Management Strategies
              </h2>

              {renderCard(
                'Seeing how the company plans for and handles things that could go wrong when buying things.',
                <Shield size={16} />,
                <>
                  <p>Procurement involves risks, such as supply disruptions, price fluctuations, and quality problems. We analyse how the company manages these risks. Do they have contingency plans in place? Do they diversify their supplier base? For example, a company might have a strategy of working with multiple suppliers in different regions to reduce the risk of supply disruptions. Or, they might have a plan in place to handle unexpected price increases. We want to know if they are prepared for problems, and if they can handle them effectively. Good risk management can help companies avoid costly disruptions and ensure a reliable supply of goods and services. Analysing risk management strategies helps us understand if the company is prepared for potential challenges.</p>
                </>
              )}
            </div>

            {/* SECTION 7: PESTEL Factors */}
            <div
              ref={(el) => {
                sectionRefs.current['pestel'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                PESTEL Factors
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What are PESTEL Factors?</strong>
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Imagine you are trying to start a lemonade stand. You need to think about more than just lemons and sugar. You need to think about things like the weather (environment), if people have money to buy lemonade (economic), if the government will let you sell lemonade (political), if people like lemonade (social), if there are new ways to make lemonade faster (technological), and if there are laws about selling food (legal). PESTEL is just a way to remember all those big things that can affect your lemonade stand (or any business).
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Political Factors: Government Rules and Stability',
                    icon: <GlobeIcon size={16} />,
                    content: (
                      <>
                        <p>How the government's rules and how stable the country is can affect your business.</p>
                        <p>Political factors are all about how the government's actions and the overall political climate can impact a business. This includes things like tax laws, trade policies, government stability, and regulations. For example, if the government suddenly increases taxes on imported sugar, it could make your lemonade more expensive. Or, if there's political instability in your region, it might be hard to get supplies or customers. It is like knowing if the local mayor likes lemonade stands or if they are trying to shut them down. Businesses need to keep an eye on these political factors because they can change quickly and have a big impact on their operations and profitability. For example, a change in environmental regulations could force a company to invest in new equipment or change its production processes. Understanding these political factors allows businesses to anticipate potential changes and adapt their strategies accordingly.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Economic Factors: Money and the Economy',
                    icon: <Hash size={16} />,
                    content: (
                      <>
                        <p>How the overall economy and people's money situation affects your business.</p>
                        <p>Economic factors are all about how the economy's health affects businesses. This includes things like interest rates, inflation, unemployment, and consumer spending. For example, if people are losing their jobs, they might have less money to spend on lemonade. Or, if interest rates are high, it might be harder for you to borrow money to expand your lemonade stand. It is like knowing if people have a lot of spare change for lemonade or if they are saving their money. Businesses need to understand these economic factors to make informed decisions about pricing, investment, and expansion. For example, during an economic downturn, a company might focus on cost-cutting measures and delay major investments. Understanding the economic situation helps businesses to navigate through tough times and capitalize on opportunities during periods of growth.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Social Factors: People\'s Habits and Beliefs',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p>How people's lifestyles, beliefs, and what they like affect your business.</p>
                        <p>Social factors are all about how people's habits, beliefs, and values affect businesses. This includes things like demographic trends, cultural norms, and lifestyle changes. For example, if people are becoming more health-conscious, they might prefer sugar-free lemonade. Or, if there is a trend towards buying local products, you might want to highlight that your lemons are from a nearby farm. It is like knowing if people prefer sweet or sour lemonade, or if they like it with ice or without. Businesses need to understand these social factors to tailor their products and marketing to meet the needs and preferences of their target market. For example, a company might launch a new product line that caters to the growing vegan market. Understanding social trends allows businesses to stay relevant and connect with their customers.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Technological Factors: New Tools and Ideas',
                    icon: <LayersIcon size={16} />,
                    content: (
                      <>
                        <p>How new technologies and inventions can help or hurt your business.</p>
                        <p>Technological factors are all about how new technologies and innovations affect businesses. This includes things like automation, artificial intelligence, and the internet. For example, if someone invents a machine that squeezes lemons faster, you might be able to make more lemonade. Or, if you can sell lemonade online, you can reach more customers. It is like knowing if there is a better way to make or sell lemonade. Businesses need to stay up to date with technological advancements to remain competitive and improve their efficiency. For example, a company might invest in a new e-commerce platform to expand its online sales. Understanding technological factors allows businesses to leverage technology to their advantage and stay ahead of the curve.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Environmental Factors: Nature and Sustainability',
                    icon: <Archive size={16} />,
                    content: (
                      <>
                        <p>How the environment and being eco-friendly affects your business.</p>
                        <p>Environmental factors are all about how the natural environment and sustainability concerns affect businesses. This includes things like climate change, pollution, and resource scarcity. For example, if there is a drought, it might be harder to get lemons. Or, if people are concerned about plastic waste, you might want to use paper cups instead of plastic. It is like knowing if the weather will be good for growing lemons, or if people want their lemonade in eco-friendly cups. Businesses need to consider environmental factors to minimize their impact on the planet and meet the growing demand for sustainable products and practices. For example, a company might invest in renewable energy sources or implement a recycling program. Understanding environmental factors allows businesses to operate responsibly and build a positive brand image.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Legal Factors: Laws and Regulations',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p>How the laws and rules affect your business.</p>
                        <p>Legal factors are all about how laws and regulations affect businesses. This includes things like consumer protection, data privacy, and lab or laws. For example, you need to follow food safety regulations when selling lemonade. Or you need to comply with lab or laws when hiring employees. It is like knowing if you need a permit to sell lemonade, or if there are rules about how you can advertise. Businesses need to comply with legal factors to avoid penalties and operate ethically. For example, a company might need to comply with data privacy regulations when collecting customer information. Understanding legal factors allows businesses to operate within the legal framework and protect themselves from legal risks.</p>
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

            {/* SECTION 8: How SWOT Analysis Is Conducted */}
            <div
              ref={(el) => {
                sectionRefs.current['swot'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                How SWOT Analysis Is Conducted
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What is SWOT Analysis?</strong>
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Imagine you are trying to decide if you should start a lemonade stand. SWOT analysis is like making a four-part list. You write down:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    <li><strong>Strengths:</strong> What you are good at (like making tasty lemonade).</li>
                    <li><strong>Weaknesses:</strong> What you are not so good at (like not having a lot of money).</li>
                    <li><strong>Opportunities:</strong> Good things that could happen (like a hot summer).</li>
                    <li><strong>Threats:</strong> Bad things that could happen (like a competitor opening a stand).</li>
                  </ul>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">This list helps you see the whole picture and make a better decision.</p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Identifying Internal Strengths',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p>Figuring out what your company or project does well.</p>
                        <p>The first step in a SWOT analysis is to identify the internal strengths of your organization or project. These are the positive attributes that give you an advantage. This could include things like a strong brand name, skilled employees, unique technology, or efficient processes. For example, if you are analysing a lemonade stand, a strength might be that you have a secret recipe that makes your lemonade taste better than anyone else's. It is important to be specific and realistic when identifying strengths. This is not about bragging; it is about being truthful. Think about what your company does better than the competition. These strengths can be used to capitalize on opportunities and overcome weaknesses. By understanding your strengths, you can leverage them to achieve your goals and build a competitive advantage.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Identifying Internal Weaknesses',
                    icon: <Edit size={16} />,
                    content: (
                      <>
                        <p>Figuring out what your company or project does not do so well.</p>
                        <p>The next step is to identify the internal weaknesses of your organization or project. These are the areas where you need to improve. This could include things like lack of resources, outdated technology, poor management, or inefficient processes. For example, a weakness of your lemonade stand might be that you do not have enough money to buy a fancy stand or hire extra help. It is important to be honest and self-critical when identifying weaknesses. This is not about being negative, it is about being realistic. Acknowledging weaknesses allows you to take steps to address them and prevent them from hindering your progress. By identifying your weaknesses, you can develop strategies to improve them and minimize their impact.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Identifying External Opportunities',
                    icon: <GlobeIcon size={16} />,
                    content: (
                      <>
                        <p>Figuring out good things that could happen outside your company or project that could help you.</p>
                        <p>The third step is to identify the external opportunities that are available to your organization or project. These are the favourable conditions in the external environment that you can take advantage of. This could include things like emerging markets, new technologies, changing customer preferences, or favourable government policies. For example, an opportunity for your lemonade stand might be a heat wave that increases demand for cold drinks. It is important to be proactive and look for opportunities that align with your strengths. These opportunities can help you grow and expand your business. By identifying opportunities, you can develop strategies to capitalize on them and gain a competitive advantage.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Identifying External Threats',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>Figuring out bad things that could happen outside your company or project that could hurt you.</p>
                        <p>The final step is to identify the external threats that could harm your organization or project. These are the unfavourable conditions in the external environment that you need to be aware of. This could include things like competition, economic downturns, changing regulations, or technological disruptions. For example, a threat to your lemonade stand might be a new competitor opening a stand across the street. It is important to be vigilant and monitor the external environment for potential threats. These threats can pose significant challenges to your business. By identifying threats, you can develop strategies to mitigate them and minimize their impact.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Organizing and Prioritizing the Findings',
                    icon: <ListChecks size={16} />,
                    content: (
                      <>
                        <p>Putting all the good and bad things into a clear chart or list and deciding which ones are most important.</p>
                        <p>Once you have identified the strengths, weaknesses, opportunities, and threats, you need to organize and prioritize them. This involves creating a clear and concise summary of your findings, often in the form of a four-quadrant matrix. You can then prioritize the findings based on their importance and impact. This helps you focus on the most critical issues and develop targeted strategies. For example, you might prioritize the threats that pose the greatest risk to your business and the opportunities that offer the greatest potential for growth. By organizing and prioritizing the findings, you can create a clear and actionable plan.</p>
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

            {/* SECTION 9: Purchasing Procedures Compared with International Best Practices */}
            <div
              ref={(el) => {
                sectionRefs.current['bestpractices'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Purchasing Procedures Compared with International Best Practices
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What is Comparing Purchasing Procedures with International Best Practices?</strong>
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Imagine you are trying to bake a cake. You have your own recipe, but you want to see if there are better ways to do it. So, you look at recipes from famous bakers around the world. That is what comparing purchasing procedures with international best practices is like. We are checking if the way a company buys things is as good as the best ways other companies around the world do it.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Evaluating Transparency and Ethical Standards',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>Checking if the company is honest and open about how they buy things, and if they follow good rules.</p>
                        <p>International best practices emphasize transparency and ethical conduct in purchasing. This means that all purchasing processes should be clear, open, and free from corruption. We compare the company's procedures to see if they meet these standards. For example, do they have clear guidelines for selecting suppliers? Do they avoid conflicts of interest? Do they have a system for reporting and investigating ethical violations? Best practices also include promoting fair competition and treating all suppliers equally. We check if the company's procedures ensure that all suppliers have a fair chance to win contracts. For example, are they using open and competitive bidding processes? Are they providing clear and complete information to all bidders? Comparing these aspects helps us determine if the company is operating with integrity and building trust with its stakeholders.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Assessing Efficiency and Effectiveness',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p>Checking if the company buys things quickly and gets the best value for their money.</p>
                        <p>International best practices focus on efficiency and effectiveness in purchasing. This means that the purchasing process should be streamlined and optimized to minimize costs and maximize value. We compare the company's procedures to see if they are efficient and effective. For example, are they using technology to automate tasks and reduce paperwork? Are they using data analytics to identify cost savings and improve supplier performance? Best practices also include using strategic sourcing and category management to leverage purchasing power and negotiate better deals. We check if the company is using these techniques. For example, are they consolidating purchases across different departments? Are they developing long-term relationships with key suppliers? Comparing these aspects helps us determine if the company is maximizing its resources and achieving its purchasing objectives.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Examining Supplier Relationship Management',
                    icon: <LayersIcon size={16} />,
                    content: (
                      <>
                        <p>Checking if the company builds good relationships with the people they buy from, and if they work together well.</p>
                        <p>International best practices emphasize building strong and collaborative relationships with suppliers. This means that the company should view suppliers as partners, not just vendors. We compare the company's procedures to see if they are fostering positive supplier relationships. For example, are they communicating effectively with suppliers? Are they providing timely feedback and support? Best practices also include promoting supplier development and innovation. We check if the company is working with suppliers to improve their capabilities and develop new products or services. For example, are they providing training and technical assistance to suppliers? Are they collaborating on research and development projects? Comparing these aspects helps us determine if the company is building a sustainable and mutually beneficial supply chain.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Evaluating Risk Management Practices',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>Checking if the company plans for and handles things that could go wrong when buying things.</p>
                        <p>International best practices emphasize proactive risk management in purchasing. This means that the company should identify and assess potential risks and develop strategies to mitigate them. We compare the company's procedures to see if they are effectively managing risks. For example, are they diversifying their supplier base to reduce the risk of supply disruptions? Are they conducting due diligence on suppliers to assess their financial stability and ethical practices? Best practices also include having contingency plans in place to handle unexpected events. We check if the company is prepared for emergencies. For example, do they have backup suppliers in case of a natural disaster or other disruption? Comparing these aspects helps us determine if the company is building a resilient and secure supply chain.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Assessing Sustainability and Social Responsibility',
                    icon: <Archive size={16} />,
                    content: (
                      <>
                        <p>Checking if the company cares about the environment and treats people fairly when they buy things.</p>
                        <p>International best practices emphasize sustainability and social responsibility in purchasing. This means that the company should consider the environmental and social impact of its purchasing decisions. We compare the company's procedures to see if they are promoting sustainability and social responsibility. For example, are they sourcing materials from environmentally friendly suppliers? Are they ensuring that their suppliers adhere to fair lab or practices? Best practices also include engaging with stakeholders and reporting on sustainability performance. We check if the company is transparent about its sustainability efforts. For example, are they publishing sustainability reports? Are they engaging with customers and communities on sustainability issues? Comparing these aspects helps us determine if the company is operating responsibly and contributing to a sustainable future.</p>
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
                  💡 Strategy Insight
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
                  <span>PESTEL Factors</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>SWOT Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Best Practice Areas</span>
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
                Procurement strategies encompass supplier relationship management, cost reduction, inventory management, technology utilisation, and risk management. PESTEL analysis helps understand external factors (Political, Economic, Social, Technological, Environmental, Legal). SWOT analysis identifies internal Strengths and Weaknesses, and external Opportunities and Threats. Compare purchasing procedures with international best practices in transparency, efficiency, supplier relationships, risk management, and sustainability.
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
                <strong className="text-white">Procurement Strategies</strong> – Analyse supplier relationships, cost reduction, inventory management, technology utilisation, and risk management to understand how organisations buy effectively.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">PESTEL Analysis</strong> – Examine Political, Economic, Social, Technological, Environmental, and Legal factors that shape the external environment and impact procurement decisions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">SWOT Analysis</strong> – Identify internal Strengths and Weaknesses, and external Opportunities and Threats to develop a clear strategic direction.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">International Best Practices</strong> – Compare purchasing procedures against global standards in transparency, efficiency, supplier relationships, risk management, and sustainability to drive continuous improvement.
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
            Sidemann Academic Registry • Procurement Strategies &amp; Analysis Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;
