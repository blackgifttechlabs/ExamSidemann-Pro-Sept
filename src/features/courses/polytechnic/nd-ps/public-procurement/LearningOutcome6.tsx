import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  Shield,
  ListChecks,
  SettingsIcon,
  FileText,
  Users,
  BarChart,
  AlertTriangle,
  Link,
  Gavel,
  Award,
  DollarSign as DollarSignIcon,
  Eye,
  ShoppingCart,
  Filter,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
  Clock,
  Globe,
  Cpu,
  Layout,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'factors', label: 'Selection Factors' },
  { id: 'methods', label: 'Common Methods' },
  { id: 'restricted', label: 'Restricted Bidding' },
  { id: 'direct', label: 'Direct Procurement' },
  { id: 'rfq', label: 'RFQ Method' },
  { id: 'eprocurement', label: 'E-Procurement' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome6: React.FC = () => {
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
        text: 'The choice of procurement method can significantly impact project costs. Open tendering typically results in 10-20% lower prices compared to restricted bidding due to increased competition.',
      },
      {
        title: 'Pro Tip',
        text: 'Always document your justification for selecting a procurement method. This protects against legal challenges and ensures transparency in the decision-making process.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the factors influencing procurement method selection with the acronym "N-V-U-A-L-R-O-F-S": Nature/Complexity, Value, Urgency, Availability, Legal/Regulatory, Organizational Policies, Funding Source, Strategic Objectives.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations use restricted bidding when open tendering would be more appropriate, often due to time pressure or perceived convenience. This can lead to higher costs and reduced competition.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The choice of procurement method can significantly impact project costs. Open tendering typically results in 10-20% lower prices compared to restricted bidding due to increased competition.',
      },
      {
        title: 'Pro Tip',
        text: 'Always document your justification for selecting a procurement method. This protects against legal challenges and ensures transparency in the decision-making process.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the factors influencing procurement method selection with the acronym "N-V-U-A-L-R-O-F-S": Nature/Complexity, Value, Urgency, Availability, Legal/Regulatory, Organizational Policies, Funding Source, Strategic Objectives.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations use restricted bidding when open tendering would be more appropriate, often due to time pressure or perceived convenience. This can lead to higher costs and reduced competition.',
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
      <header className="bg-[#134e4a] dark:bg-[#042f2e] border-b border-teal-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Procurement Methods &amp;{' '}
            <span className="text-cyan-300 font-bold italic">
              Selection Factors
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to factors influencing procurement method selection, common methods, problems with restricted bidding, implementing direct procurement, RFQ method, and e-procurement.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Filter size={14} className="inline mr-1" /> Selection Factors
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ShoppingCart size={14} className="inline mr-1" /> Methods
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Cpu size={14} className="inline mr-1" /> E-Procurement
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
                placeholder="Search for a method, factor, concept..."
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
                Introduction to Procurement Methods
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The selection of a procurement method is a critical decision that significantly impacts the outcome of any procurement process. It involves choosing the most appropriate approach for acquiring goods, services, or works, based on various factors. This module covers the key factors influencing method selection, the common procurement methods available, and their practical implementation.
                  </p>
</div>
            </div>

            {/* SECTION 2: Factors Influencing Procurement Method Selection */}
            <div
              ref={(el) => {
                sectionRefs.current['factors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors Influencing Procurement Method Selection
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The selection of a procurement method is a critical decision that significantly impacts the outcome of any procurement process. It involves choosing the most appropriate approach for acquiring goods, services, or works, based on various factors.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Nature and Complexity',
                    icon: <Layout size={16} />,
                    content: 'Simple, low-value procurements may warrant less formal methods, such as RFQ or direct purchase. Complex, high-value procurements require more rigorous and competitive processes like open tendering or RFP. The complexity of specifications directly impacts the chosen approach.',
                  },
                  {
                    title: '2. Value of the Procurement',
                    icon: <DollarSignIcon size={16} />,
                    content: 'Thresholds determine which methods are appropriate for different value ranges. Below certain thresholds, direct purchase or RFQs may be used. Higher-value procurements typically necessitate more competitive methods like open tendering or RFPs.',
                  },
                  {
                    title: '3. Urgency',
                    icon: <Clock size={16} />,
                    content: 'Emergency situations may necessitate expedited methods like direct procurement or emergency tendering. Routine procurements allow for more structured and competitive processes with sufficient time for planning, tendering, and evaluation.',
                  },
                  {
                    title: '4. Availability of Suppliers',
                    icon: <Users size={16} />,
                    content: 'If there are limited suppliers, limited tendering or direct procurement may be necessary. If there are many suppliers, open tendering is usually preferred to foster competition and select the most suitable supplier based on merit.',
                  },
                  {
                    title: '5. Legal and Regulatory Requirements',
                    icon: <Shield size={16} />,
                    content: 'Applicable laws, regulations, and policies dictate which procurement methods are permissible. Public procurement laws might mandate the use of open tendering for certain types of procurements or require specific documentation and approval processes.',
                  },
                  {
                    title: '6. Market Conditions',
                    icon: <Globe size={16} />,
                    content: 'In a buyer\'s market, open tendering and competitive bidding are advantageous. In a seller\'s market, limited tendering or direct procurement might be necessary. Market conditions can also impact the availability of resources and materials.',
                  },
                  {
                    title: '7. Risk Assessment',
                    icon: <AlertTriangle size={16} />,
                    content: 'High-risk procurements may require more rigorous due diligence, detailed contract terms, and robust risk mitigation strategies. This might involve using methods that allow for detailed proposals, technical evaluations, and thorough background checks.',
                  },
                  {
                    title: '8. Organizational Policies',
                    icon: <SettingsIcon size={16} />,
                    content: 'Internal policies related to ethical conduct, sustainability, and small business participation can dictate which methods are allowed or preferred. These policies reflect the organization\'s values and priorities.',
                  },
                  {
                    title: '9. Funding Source',
                    icon: <DollarSignIcon size={16} />,
                    content: 'Government grants, donor funds, or internal budgets can dictate what procurement methods are allowed or required. Each funding source may have specific procurement guidelines and reporting requirements.',
                  },
                  {
                    title: '10. Strategic Objectives',
                    icon: <Target size={16} />,
                    content: 'The procurement method should align with strategic objectives, such as promoting innovation, supporting local businesses, or fostering sustainable development. This ensures procurement activities contribute to the organisation\'s overall mission.',
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

            {/* SECTION 3: Common Procurement Methods */}
            <div
              ref={(el) => {
                sectionRefs.current['methods'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Common Procurement Methods
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine you need to buy something for your school or town. You have a few ways to do it: open to everyone, ask a few people, buy directly, make a deal for later, quick price check, ask for ideas, or buy online. Below are the detailed explanations of each method.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Open Tendering',
                    icon: <Globe size={16} />,
                    content: (
                      <>
                        <p><strong>Like holding a public auction. You tell everyone what you need, and they all get a chance to offer their best price.</strong></p>
                        <p>This method involves publicly advertising the procurement opportunity, allowing any interested and qualified supplier to submit a bid.</p>
                        <p>Used for high-value or complex procurements where maximum competition is desired. Promotes transparency, fairness, and value for money.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Limited Tendering',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p><strong>Like asking only a few trusted stores for their prices.</strong></p>
                        <p>This method involves inviting bids from a select group of pre-qualified suppliers.</p>
                        <p>Used when there are a limited number of suppliers capable of meeting the requirements or when specialised expertise is needed. Can be faster than open tendering but may limit competition.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Direct Procurement',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>Like going straight to your favourite store and buying something.</strong></p>
                        <p>This method involves purchasing goods, services, or works directly from a single supplier without competition.</p>
                        <p>Used in emergency situations, when there is only one supplier, or for specialized items. Requires strong justification and may involve higher risks.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Framework Agreements',
                    icon: <Link size={16} />,
                    content: (
                      <>
                        <p><strong>Like making a deal with a store to buy things from them regularly.</strong></p>
                        <p>This method involves establishing agreements with suppliers for recurring purchases of goods, services, or works over a period of time.</p>
                        <p>Used for frequently purchased goods or services. Streamlines the procurement process and provides price certainty.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Request for Quotations (RFQ)',
                    icon: <Search size={16} />,
                    content: (
                      <>
                        <p><strong>Like quickly asking a few stores for their prices.</strong></p>
                        <p>A simplified method used for low-value, routine purchases. Involves requesting price quotations from multiple suppliers.</p>
                        <p>Fast and efficient for small purchases. The contract is awarded to the supplier with the lowest price or most advantageous offer.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Request for Proposals (RFP)',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p><strong>Like asking companies to give you their best ideas.</strong></p>
                        <p>Used for complex procurements where factors other than price are important. Allows suppliers to propose solutions and approaches.</p>
                        <p>Evaluation is based on a combination of factors, such as technical merit, experience, and cost.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. E-Procurement',
                    icon: <Cpu size={16} />,
                    content: (
                      <>
                        <p><strong>Like buying things online.</strong></p>
                        <p>Using electronic platforms to conduct procurement activities, such as online tendering and reverse auctions.</p>
                        <p>Enhances efficiency, transparency, and accessibility. Reduces costs and improves communication with suppliers.</p>
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

              {renderCard(
                'Selection Process',
                <Target size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>The selection of a procurement method should be based on a thorough analysis of the factors described above.</li>
                    <li>A documented justification for the chosen method is essential.</li>
                    <li>Approvals should be obtained from relevant authorities before proceeding.</li>
                  </ul>
                </>
              )}
            </div>

            {/* SECTION 4: Problems Associated with Restricted Bidding */}
            <div
              ref={(el) => {
                sectionRefs.current['restricted'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Problems Associated with Restricted Bidding
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Reduced Competition',
                    icon: <AlertTriangle size={16} />,
                    content: 'By inviting only a select group of suppliers, the procuring entity misses out on potential bids from other qualified businesses. This can lead to higher prices, reduced innovation, and a lack of market dynamism.',
                  },
                  {
                    title: '2. Lack of Transparency',
                    icon: <Eye size={16} />,
                    content: 'Restricted bidding can raise concerns about transparency and fairness. The selection process for invited bidders may not be clear or objective, leading to perceptions of favoritism or bias.',
                  },
                  {
                    title: '3. Potential for Favouritism and Corruption',
                    icon: <Shield size={16} />,
                    content: 'When the selection of bidders is not open to public scrutiny, there\'s a greater risk of favouritism or corruption. Procuring entities may be tempted to invite suppliers with whom they have personal or financial relationships.',
                  },
                  {
                    title: '4. Limited Value for Money',
                    icon: <DollarSignIcon size={16} />,
                    content: 'With reduced competition, the procuring entity may not obtain the best possible value for its money. Suppliers may inflate prices, knowing that they are among a limited group of bidders.',
                  },
                  {
                    title: '5. Difficulty in Justification',
                    icon: <FileText size={16} />,
                    content: 'Procuring entities must provide strong justification for using restricted bidding. Demonstrating valid reasons for limiting competition can be challenging, especially when there are other qualified suppliers in the market.',
                  },
                  {
                    title: '6. Risk of Legal Challenges',
                    icon: <Gavel size={16} />,
                    content: 'Suppliers who are excluded from restricted bidding may challenge the decision, potentially leading to legal disputes and delays. If justification cannot be demonstrated, the procuring entity may face legal penalties.',
                  },
                  {
                    title: '7. Reduced Supplier Diversity',
                    icon: <Users size={16} />,
                    content: 'Restricted bidding can limit opportunities for small and medium-sized enterprises (SMEs) and other diverse suppliers. This can stifle innovation and limit economic opportunities for these businesses.',
                  },
                  {
                    title: '8. Potential for Collusion',
                    icon: <AlertTriangle size={16} />,
                    content: 'When the group of bidders is small, there is an increased risk of collusion between the bidders. This can lead to artificially high prices and poor service.',
                  },
                  {
                    title: '9. Dependence on Limited Suppliers',
                    icon: <Link size={16} />,
                    content: 'Over time, relying on a restricted group of suppliers can create dependence and limit the procuring entity\'s ability to switch to alternative suppliers if needed. This can lead to a lack of bargaining power and increased risks.',
                  },
                  {
                    title: '10. Difficulty in Performance Comparison',
                    icon: <BarChart size={16} />,
                    content: 'Without a wide range of bids, it can be harder to compare the performance and value of different suppliers. This can make it difficult to determine whether the chosen supplier is truly the best option.',
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

            {/* SECTION 5: Implementing the Direct Procurement Method */}
            <div
              ref={(el) => {
                sectionRefs.current['direct'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Implementing the Direct Procurement Method
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Implementing the direct procurement method, also known as single-source or sole source procurement, requires careful justification and adherence to specific procedures. It's crucial to ensure transparency and accountability, even though competitive bidding is bypassed.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Justification and Documentation',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p><strong>Identify the Reason:</strong> Clearly define why direct procurement is necessary. Common justifications include: unique supplier, emergency, standardization, specialized expertise, or proprietary technology.</p>
                        <p><strong>Document Thoroughly:</strong> Create a detailed written justification with evidence. This documentation is crucial for audits and legal compliance.</p>
                        <p><strong>Obtain Approvals:</strong> Secure necessary approvals from relevant authorities such as management, legal, or finance departments.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Supplier Selection and Due Diligence',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>Verify Supplier Uniqueness:</strong> Conduct thorough research to confirm the selected supplier is the only viable option.</p>
                        <p><strong>Assess Supplier Capabilities:</strong> Evaluate financial stability, technical expertise, and past performance.</p>
                        <p><strong>Negotiate Terms and Conditions:</strong> Negotiate fair and reasonable terms including clear specifications, delivery schedules, payment terms, and warranty provisions.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Contract Development and Execution',
                    icon: <Link size={16} />,
                    content: (
                      <>
                        <p><strong>Develop a Contract:</strong> Create a written contract that clearly outlines terms and conditions. Include provisions for dispute resolution, termination, and intellectual property rights.</p>
                        <p><strong>Monitor Performance:</strong> Establish a system for monitoring the supplier\'s performance and ensuring compliance.</p>
                        <p><strong>Manage Payments:</strong> Process payments according to the agreed-upon schedule. Maintain accurate records of all payments.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Transparency and Accountability',
                    icon: <Eye size={16} />,
                    content: (
                      <>
                        <p><strong>Maintain Records:</strong> Keep accurate and complete records of all procurement activities, including justifications, approvals, contracts, and performance evaluations.</p>
                        <p><strong>Ensure Compliance:</strong> Adhere to all applicable laws, regulations, and organizational policies. Implement internal controls to prevent fraud and corruption.</p>
                        <p><strong>Audit Trail:</strong> Create an audit trail that can be followed to ensure the process was handled correctly.</p>
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

              {renderCard(
                'Considerations',
                <Shield size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Risk Management:</strong> Direct procurement involves higher risks due to the lack of competition. Implement robust risk management strategies.</li>
                    <li><strong>Ethical Conduct:</strong> Maintain high ethical standards. Avoid any conflicts of interest that could compromise integrity.</li>
                    <li><strong>Price Reasonableness:</strong> Even without competition, ensure that the price is fair and reasonable. Conduct market research or obtain independent cost estimates.</li>
                    <li><strong>Documentation is:</strong> the most important part of this process.</li>
                  </ul>
                </>
              )}
            </div>

            {/* SECTION 6: The Request for Quotations (RFQ) Method */}
            <div
              ref={(el) => {
                sectionRefs.current['rfq'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Request for Quotations (RFQ) Method
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The Request for Quotations (RFQ) method is a streamlined procurement process typically used for acquiring readily available, low-value goods or services. It's designed for situations where specifications are clear, and price is the primary factor in the selection process.
                  </p>
</div>

              {renderCard(
                'Characteristics of the RFQ Method',
                <ListChecks size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Simplicity:</strong> Straightforward process with minimal administrative overhead. Ideal for routine purchases.</li>
                    <li><strong>Price-Focused:</strong> Primary selection criterion is usually the lowest price. Suitable for commodities or standardized items.</li>
                    <li><strong>Quick Turnaround:</strong> Designed for rapid acquisition, minimizing delays. Useful for urgent needs.</li>
                    <li><strong>Clear Specifications:</strong> Requirements are clearly defined and easily understood by suppliers.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Steps in the RFQ Process',
                <Target size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>1. Define Requirements:</strong> Clearly specify the goods or services needed, including quantities, quality standards, and delivery requirements.</li>
                    <li><strong>2. Identify Potential Suppliers:</strong> Identify a list of qualified suppliers who can provide the required goods or services.</li>
                    <li><strong>3. Issue the RFQ:</strong> Send the RFQ to the selected suppliers, requesting price quotations. Include clear instructions and deadlines.</li>
                    <li><strong>4. Receive and Evaluate Quotations:</strong> Receive quotations by the deadline. Evaluate based on price and compliance with specifications.</li>
                    <li><strong>5. Award the Contract:</strong> Award to the supplier with the lowest price or most advantageous offer. Issue a purchase order or contract.</li>
                    <li><strong>6. Manage the Contract:</strong> Ensure delivery according to agreed terms. Process payments and maintain accurate records.</li>
                  </ul>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Advantages',
                    icon: <Award size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Efficiency:</strong> Quick and efficient way to acquire goods or services.</li>
                          <li><strong>Cost-Effectiveness:</strong> Helps to obtain competitive prices.</li>
                          <li><strong>Simplicity:</strong> Easy to understand and implement.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Disadvantages',
                    icon: <AlertTriangle size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Limited Scope:</strong> Not suitable for complex procurements.</li>
                          <li><strong>Focus on Price:</strong> May not adequately consider quality, reliability, or technical capabilities.</li>
                          <li><strong>Potential for Low Quality:</strong> Focusing only on price may lead to lower quality goods or services.</li>
                          <li><strong>Limited Supplier Relationships:</strong> May not foster long-term relationships with suppliers.</li>
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

              {renderCard(
                'When to Use the RFQ Method',
                <Target size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>For low-value, routine purchases.</li>
                    <li>When specifications are clear and price is the primary consideration.</li>
                    <li>When quick turnaround is essential.</li>
                    <li>For purchasing commodities or standardized items.</li>
                  </ul>
                </>
              )}
            </div>

            {/* SECTION 7: Performing Public Procurement Through E-Procurement Platforms */}
            <div
              ref={(el) => {
                sectionRefs.current['eprocurement'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Performing Public Procurement Through E-Procurement Platforms
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Performing public procurement through e-procurement platforms offers numerous advantages, enhancing efficiency, transparency, and accountability. Here's a breakdown of how to effectively implement public procurement through these platforms.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Platform Selection and Setup',
                    icon: <Cpu size={16} />,
                    content: (
                      <>
                        <p><strong>Assess Needs:</strong> Identify specific needs such as types of procurements, volume, and required functionalities.</p>
                        <p><strong>Evaluate Platforms:</strong> Research functionality, security, usability, integration capabilities, cost, and vendor support.</p>
                        <p><strong>Platform Setup and Configuration:</strong> Configure the platform to match procurement processes and policies. Set up user accounts and access controls. Integrate with financial management systems.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Supplier Registration and Management',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p><strong>Establish a Supplier Database:</strong> Create a centralized database of registered suppliers with online registration.</p>
                        <p><strong>Supplier Communication:</strong> Use the platform to communicate with suppliers, including notifications of tender opportunities and updates. Provide clear instructions and support.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. E-Tendering Process',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p><strong>Tender Publication:</strong> Publish tender notices and documents on the e-procurement platform.</p>
                        <p><strong>Bid Submission:</strong> Enable suppliers to submit bids electronically with secure encryption. Set clear deadlines.</p>
                        <p><strong>Bid Evaluation:</strong> Use the platform for electronic scoring and evaluation with an audit trail.</p>
                        <p><strong>Contract Award:</strong> Notify the successful bidder and publish contract award information. Generate electronic contracts.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. E-Auctioning',
                    icon: <Gavel size={16} />,
                    content: (
                      <>
                        <p><strong>Reverse Auctions:</strong> Use for competitive bidding where suppliers bid down prices. Set clear rules and guidelines. Monitor the auction and ensure fair competition.</p>
                        <p><strong>Forward Auctions:</strong> Use to sell off public assets.</p>
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
                  <span>Selection Factors</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Common Methods</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Restricted Bidding Issues</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Selection factors: Nature/Complexity, Value, Urgency, Supplier Availability, Legal/Regulatory, Market Conditions, Risk, Organisational Policies, Funding Source, Strategic Objectives. Common methods: Open Tendering, Limited Tendering, Direct Procurement, Framework Agreements, RFQ, RFP, E-Procurement. Restricted bidding problems include reduced competition, lack of transparency, favouritism, limited value for money, legal challenges, and collusion risks. Direct procurement requires strong justification, thorough documentation, and robust oversight. RFQ is ideal for low-value, routine purchases. E-procurement enhances efficiency and transparency.
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
                <strong className="text-white">Selection Factors</strong> – Ten key factors: Nature/Complexity, Value, Urgency, Supplier Availability, Legal/Regulatory, Market Conditions, Risk, Organisational Policies, Funding Source, and Strategic Objectives. These guide the choice of procurement method.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Common Methods</strong> – Open Tendering, Limited Tendering, Direct Procurement, Framework Agreements, RFQ, RFP, and E-Procurement. Each method has specific use cases, advantages, and limitations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Restricted Bidding</strong> – Problems include reduced competition, lack of transparency, potential for favouritism, limited value for money, legal challenges, collusion risks, and supplier dependence. Use with caution and strong justification.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Direct Procurement &amp; RFQ</strong> – Direct procurement requires thorough justification, documentation, and oversight. RFQ is efficient for low-value, routine purchases where price is the primary consideration.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">E-Procurement</strong> – Platforms enhance efficiency, transparency, and accessibility through e-tendering, e-auctioning, and automated workflows. Key steps: platform selection, supplier management, e-tendering, and e-auctioning.
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
            Sidemann Academic Registry • Procurement Methods Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome6;
