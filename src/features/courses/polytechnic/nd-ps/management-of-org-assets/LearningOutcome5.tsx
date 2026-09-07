import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  ClockIcon,
  FileText,
  AlertTriangle,
  DollarSign,
  Loader as Refresh,
  Shield as ShieldIcon,
  Zap,
  Briefcase,
  TrendingUp,
  Split,
  Calculator,
  TrendingDown,
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
  { id: 'classification', label: 'Project Classification' },
  { id: 'investments', label: 'New Investments' },
  { id: 'replacement', label: 'Replacement Decisions' },
  { id: 'working-capital', label: 'Working Capital' },
  { id: 'tax', label: 'Tax & Cost Savings' },
  { id: 'allowances', label: 'Capital Allowances' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome5: React.FC = () => {
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
        text: 'Capital budgeting decisions typically involve investments with a life span of more than one year. These decisions are among the most important a company makes, as they commit significant resources for long periods.',
      },
      {
        title: 'Pro Tip',
        text: 'Always consider the time value of money when evaluating capital projects. A dollar today is worth more than a dollar in the future due to inflation and opportunity costs.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three main project categories: Replacement (maintain operations), Expansion (grow the business), and Safety/Environmental (compliance and responsibility).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to include changes in working capital when calculating project cash flows. New investments often require additional inventory or receivables that tie up cash.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Capital budgeting decisions typically involve investments with a life span of more than one year. These decisions are among the most important a company makes, as they commit significant resources for long periods.',
      },
      {
        title: 'Pro Tip',
        text: 'Always consider the time value of money when evaluating capital projects. A dollar today is worth more than a dollar in the future due to inflation and opportunity costs.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three main project categories: Replacement (maintain operations), Expansion (grow the business), and Safety/Environmental (compliance and responsibility).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to include changes in working capital when calculating project cash flows. New investments often require additional inventory or receivables that tie up cash.',
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
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> FINANCIAL MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Capital Budgeting &amp;{' '}
            <span className="text-rose-300 font-bold italic">
              Investment Decisions
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to project classification, replacement decisions, working capital changes, tax calculations, and capital allowances.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Briefcase size={14} className="inline mr-1" /> Capital Budgeting
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Calculator size={14} className="inline mr-1" /> Calculations
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <DollarSign size={14} className="inline mr-1" /> Working Capital
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
                placeholder="Search for a concept, formula, calculation..."
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
            {/* SECTION 1: Classification of Projects */}
            <div
              ref={(el) => {
                sectionRefs.current['classification'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Classification of Projects
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When a business decides to spend money on big things (like new equipment or buildings), it is called a "capital budgeting" decision. These projects can be classified into different groups. Some projects are about replacing old stuff, some are about growing the business, and some are about making the workplace safer. We also need to understand if projects are "independent" (meaning we can do them all) or "mutually exclusive" (meaning we can only choose one).
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Briefcase size={16} /> Categories of Capital Budgeting Projects
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Capital budgeting projects are the big-ticket items a company invests in, aiming for long-term returns. These projects are crucial because they tie up significant funds and influence the company's future. The process of evaluating these projects involves careful analysis of potential costs, benefits, and risks. The goal is to select projects that will increase the company's value and contribute to its strategic objectives.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Refresh size={16} /> Replacement Projects
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    These projects involve replacing existing assets with newer, more efficient ones. The primary goal is to maintain current operations or improve efficiency. For example, replacing an old machine with a new, faster one. These projects are often driven by the need to reduce operating costs, improve product quality, or comply with regulatory requirements.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <TrendingUp size={16} /> Expansion Projects
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    These projects aim to increase the company's capacity, market share, or product offerings. This could involve building a new factory, entering a new market, or developing a new product line. Expansion projects are typically driven by the company's growth strategy and its desire to increase revenue and profitability.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <ShieldIcon size={16} /> Safety or Environmental Projects
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    These projects focus on improving workplace safety or reducing the company's environmental impact. This could involve installing safety equipment, upgrading pollution control systems, or implementing sustainable practices. These projects are often driven by regulatory requirements or the company's commitment to corporate social responsibility.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Split size={16} /> Independent and Mutually Exclusive Projects
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Independent Projects:</strong> These projects are unrelated, and the decision to accept or reject one project does not affect the decision regarding other projects. For example, a company might consider building a new warehouse and upgrading its IT system. These projects can be evaluated independently, and the company can choose to undertake both, one, and neither.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Mutually Exclusive Projects:</strong> These projects are alternatives, and the company can only choose one. For example, a company might consider building a new factory in one of two locations. Choosing one location means the other cannot be chosen. Mutually exclusive projects require careful comparison, as the company must select the project that provides the highest return or best aligns with its strategic objectives.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <FileText size={16} /> Key Considerations
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Capital budgeting decisions require careful financial analysis.</li>
                    <li>Projects should align with the company's strategic goals.</li>
                    <li>Risk assessment is crucial for all investment decisions.</li>
                    <li>Different projects have different risk profiles and return expectations.</li>
                    <li>Consider the company's overall financial health and access to capital.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 2: New Investments and Cost Calculations */}
            <div
              ref={(el) => {
                sectionRefs.current['investments'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                New Investments, Cost Calculations, and Changes in Working Capital
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A new investment is when a company spends money on something with the expectation of future returns. This could be buying new equipment, building a factory, or launching a new product. The decision to make a new investment is a capital budgeting decision, and it requires careful analysis to ensure it is a good use of the company's funds.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Calculator size={16} /> Cost of Assets and Installation Costs (Calculate)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  When calculating the total cost of a new asset, you need to include not only the purchase price but also any costs associated with getting the asset ready for use. This includes installation costs.
                </p>
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-slate-600 dark:text-slate-400">
                  Total Cost = Purchase Price + Installation Costs + Other Related Costs (e.g., shipping, training)
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  <strong>Example 1:</strong> A company purchases a new machine for $100,000. Installation costs are $15,000, and shipping costs are $2,000.
                </p>
                <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-slate-600 dark:text-slate-400">
                  Total Cost = $100,000 + $15,000 + $2,000 = $117,000
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  <strong>Example 2:</strong> A company buys a new computer system for $50,000. Installation costs are $8,000, and employee training costs are $3,000.
                </p>
                <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-slate-600 dark:text-slate-400">
                  Total Cost = $50,000 + $8,000 + $3,000 = $61,000
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <DollarSign size={16} /> Change in Working Capital
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Working capital is the difference between a company's current assets and current liabilities. It represents the company's ability to meet its short-term obligations. A new investment can affect working capital by increasing or decreasing current assets or current liabilities.
                </p>
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-slate-600 dark:text-slate-400">
                  Change in Working Capital = Change in Current Assets − Change in Current Liabilities
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  <strong>Example 1: Increase in Working Capital</strong> — A company invests in a new inventory management system. This increases inventory (a current asset) by $20,000 and increases accounts payable (a current liability) by $5,000.
                </p>
                <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-slate-600 dark:text-slate-400">
                  Change in Working Capital = $20,000 − $5,000 = $15,000 (Increase)
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  <strong>Example 2: Decrease in Working Capital</strong> — A company invests in a new customer service system. This increases accounts receivable (a current asset) by $10,000 and increases short-term loans (a current liability) by $18,000.
                </p>
                <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-slate-600 dark:text-slate-400">
                  Change in Working Capital = $10,000 − $18,000 = −$8,000 (Decrease)
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <FileText size={16} /> Exam Question Examples
                </h3>
                <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                  <div>
                    <p><strong>Question 1:</strong> A company is considering purchasing a new piece of equipment. The purchase price is $75,000. Installation costs are estimated to be $12,000, and employee training will cost $5,000. Calculate the total cost of the new equipment.</p>
                    <p><strong>Answer:</strong> Total Cost = $75,000 + $12,000 + $5,000 = $92,000</p>
                  </div>
                  <hr className="border-gray-300 dark:border-gray-700" />
                  <div>
                    <p><strong>Question 2:</strong> A company is investing in a new marketing campaign. This campaign is expected to increase accounts receivable by $25,000 and increase accounts payable by $10,000. Calculate the change in working capital. Indicate whether the change is an increase or decrease.</p>
                    <p><strong>Answer:</strong> Change in Working Capital = $25,000 − $10,000 = $15,000 (Increase)</p>
                  </div>
                  <hr className="border-gray-300 dark:border-gray-700" />
                  <div>
                    <p><strong>Question 3:</strong> A company buys a new delivery truck for 40,000. Installation of shelving and company logos costs 4,000. Training for the new truck costs 1,000. Calculate the total cost of the new delivery truck.</p>
                    <p><strong>Answer:</strong> Total Cost = 40,000 + 4,000 + 1,000 = 45,000</p>
                  </div>
                  <hr className="border-gray-300 dark:border-gray-700" />
                  <div>
                    <p><strong>Question 4:</strong> A company implements a new online ordering system, that increases inventory by 15,000, and increases short term loans by 12,000. Calculate the change in working capital. Indicate whether the change is an increase or decrease.</p>
                    <p><strong>Answer:</strong> Change in Working Capital = 15,000 − 12,000 = 3,000 (Increase)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: Replacement Decisions */}
            <div
              ref={(el) => {
                sectionRefs.current['replacement'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Replacement Decisions
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Replacement decisions involve determining whether to replace an existing asset with a newer, more efficient one. This often involves evaluating the costs and benefits of the replacement, including the disposal value of the old asset.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <DollarSign size={16} /> Disposal Value of Old Assets – Calculate
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The disposal value (or salvage value) of an old asset is the amount of money a company expects to receive when it sells or disposes of the asset. This value can be affected by factors such as the asset's condition, age, and market demand.
                </p>
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-slate-600 dark:text-slate-400">
                  Disposal Value = Market Price − Selling Costs
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  <strong>Example 1:</strong> A company sells an old machine for $10,000. Selling costs, such as commissions and transportation, are $500.
                </p>
                <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-slate-600 dark:text-slate-400">
                  Disposal Value = $10,000 − $500 = $9,500
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  <strong>Example 2:</strong> A company disposes of old office furniture. The estimated market price is $2,000, and removal costs are $200.
                </p>
                <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-slate-600 dark:text-slate-400">
                  Disposal Value = $2,000 − $200 = $1,800
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Calculator size={16} /> Calculating Scrapping Allowance or Recoupment
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  When an old asset is replaced, there may be a difference between its book value (the value on the company's balance sheet) and its disposal value. This difference can result in a scrapping allowance (loss) or recoupment (gain).
                </p>
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-slate-600 dark:text-slate-400">
                  Scrapping Allowance (Loss) = Book Value − Disposal Value<br />
                  Recoupment (Gain) = Disposal Value − Book Value
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  <strong>Example 1: Scrapping Allowance (Loss)</strong> — A company has an old machine with a book value of $15,000. The company sells the machine for $12,000.
                </p>
                <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-slate-600 dark:text-slate-400">
                  Scrapping Allowance (Loss) = $15,000 − $12,000 = $3,000
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  <strong>Example 2: Recoupment (Gain)</strong> — A company has an old delivery truck with a book value of $8,000. The company sells the truck for $10,000.
                </p>
                <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-slate-600 dark:text-slate-400">
                  Recoupment (Gain) = $10,000 − $8,000 = $2,000
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  <strong>Example 3: Including selling costs.</strong> — A machine with a book value of 20,000 is sold for 18,000. Selling costs are 1,000.
                </p>
                <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-slate-600 dark:text-slate-400">
                  Disposal value = 18,000 − 1,000 = 17,000<br />
                  Scrapping Allowance (Loss) = 20,000 − 17,000 = 3,000
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <FileText size={16} /> Exam Question Examples
                </h3>
                <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                  <div>
                    <p><strong>Question 1:</strong> A company is replacing an old computer system. The old system has a book value of $5,000. The company sells the old system for $3,000. Calculate the scrapping allowance or recoupment.</p>
                    <p><strong>Answer:</strong> Scrapping Allowance (Loss) = $5,000 - $3,000 = $2,000</p>
                  </div>
                  <hr className="border-gray-300 dark:border-gray-700" />
                  <div>
                    <p><strong>Question 2:</strong> A company is replacing an old piece of machinery. The old machinery has a book value of $25,000. The company sells the old machinery for $30,000. Calculate the recoupment or scrapping allowance.</p>
                    <p><strong>Answer:</strong> Recoupment (Gain) = $30,000 - $25,000 = $5,000</p>
                  </div>
                  <hr className="border-gray-300 dark:border-gray-700" />
                  <div>
                    <p><strong>Question 3:</strong> A company sells an old truck for $15,000. Selling costs are $750. Calculate the disposal value.</p>
                    <p><strong>Answer:</strong> Disposal Value = $15,000 - $750 = $14,250</p>
                  </div>
                  <hr className="border-gray-300 dark:border-gray-700" />
                  <div>
                    <p><strong>Question 4:</strong> A company replaces an old printer with a book value of 1,000. It is sold for 800. Removal costs are 100. Calculate the disposal value. Calculate the scrapping allowance or recoupment.</p>
                    <p><strong>Answer:</strong> Disposal Value = 800 - 100 = 700 / Scrapping Allowance (Loss) = 1,000 - 700 = 300</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: Alternative Interventions for Working Capital Changes */}
            <div
              ref={(el) => {
                sectionRefs.current['working-capital'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Alternative Interventions for Working Capital Changes
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Working capital management is crucial for a company's liquidity and operational efficiency. When working capital fluctuates, it is essential to implement appropriate interventions.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2 mb-2">
                    <TrendingUp size={16} /> Interventions When There Is an Increase in Working Capital
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Reduce Inventory Levels:</strong> Implement just-in-time inventory systems, improve demand forecasting, or offer discounts to reduce stock.</li>
                    <li><strong>Tighten Credit Policies:</strong> Tighten credit terms, offer early payment discounts, or improve collection processes.</li>
                    <li><strong>Negotiate Longer Payment Terms with Suppliers:</strong> Increase accounts payable by negotiating longer payment terms, freeing up cash.</li>
                    <li><strong>Invest Excess Cash:</strong> If the increase is due to excess cash, invest it in short-term, liquid investments.</li>
                    <li><strong>Reduce Short-Term Debt:</strong> Pay down short-term debts such as short-term loans.</li>
                    <li><strong>Increase Dividends or Share Buybacks:</strong> Return excess cash to shareholders.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-2">
                    <TrendingDown size={16} /> Interventions When There Is a Decrease in Working Capital
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Increase Inventory Turnover:</strong> Ensure adequate stock levels to meet demand and avoid lost sales.</li>
                    <li><strong>Offer Incentives for Early Payment:</strong> Expedite cash inflows by offering discounts for early payment.</li>
                    <li><strong>Negotiate Shorter Payment Terms with Suppliers:</strong> Reduce accounts payable by negotiating shorter payment terms, if possible.</li>
                    <li><strong>Secure Short-Term Financing:</strong> If cash is tight, secure short-term financing, such as lines of credit.</li>
                    <li><strong>Sell Non-Core Assets:</strong> Sell off assets that are not essential to the core business operations.</li>
                    <li><strong>Delay Non-Essential Expenditures:</strong> Postpone non-critical expenses until the working capital situation improves.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 5: Incremental After-Tax Revenue or Cost Savings */}
            <div
              ref={(el) => {
                sectionRefs.current['tax'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Incremental After-Tax Revenue or Cost Savings
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    This refers to the additional revenue or cost savings generated by a new project or investment, after accounting for taxes.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Calculator size={16} /> Formula and Examples
                </h3>
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-slate-600 dark:text-slate-400">
                  Incremental After-Tax Revenue/Cost Savings = (Incremental Revenue/Cost Savings) × (1 - Tax Rate)
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  <strong>Example 1: Incremental After-Tax Revenue</strong> — A new marketing campaign is expected to generate $50,000 in additional revenue. The company's tax rate is 30%.
                </p>
                <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-slate-600 dark:text-slate-400">
                  Incremental After-Tax Revenue = $50,000 × (1 - 0.30) = $50,000 × 0.70 = $35,000
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  <strong>Example 2: Incremental After-Tax Cost Savings</strong> — A new machine is expected to reduce operating costs by $20,000. The company's tax rate is 25%.
                </p>
                <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-slate-600 dark:text-slate-400">
                  Incremental After-Tax Cost Savings = $20,000 × (1 - 0.25) = $20,000 × 0.75 = $15,000
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  <strong>Example 3: Combined Revenue and Cost Savings</strong> — A new project is expected to increase revenue by $30,000 and reduce costs by $10,000. The company's tax rate is 35%.
                </p>
                <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-slate-600 dark:text-slate-400">
                  Total Incremental Benefit = $30,000 + $10,000 = $40,000<br />
                  Incremental After-Tax Benefit = $40,000 × (1 - 0.35) = $40,000 × 0.65 = $26,000
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <FileText size={16} /> Exam Question Examples
                </h3>
                <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                  <div>
                    <p><strong>Question 1:</strong> A company implements a new software system that is expected to save $15,000 in annual labour costs. The company's tax rate is 20%. Calculate the incremental after-tax cost savings.</p>
                    <p><strong>Answer:</strong> Incremental After-Tax Cost Savings = $15,000 × (1 - 0.20) = $15,000 × 0.80 = $12,000</p>
                  </div>
                  <hr className="border-gray-300 dark:border-gray-700" />
                  <div>
                    <p><strong>Question 2:</strong> A company launches a new product line that is expected to generate $75,000 in additional revenue. The company's tax rate is 40%. Calculate the incremental after-tax revenue.</p>
                    <p><strong>Answer:</strong> Incremental After-Tax Revenue = $75,000 × (1 - 0.40) = $75,000 × 0.60 = $45,000</p>
                  </div>
                  <hr className="border-gray-300 dark:border-gray-700" />
                  <div>
                    <p><strong>Question 3:</strong> A new project increases revenue by 100,000 and decreases costs by 20,000. The tax rate is 30%. Calculate the total incremental benefit. Calculate the incremental after-tax benefit.</p>
                    <p><strong>Answer:</strong> Total incremental benefit = 100,000 + 20,000 = 120,000 / Incremental after-tax benefit = 120,000 × (1-0.30) = 84,000</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 6: Capital Allowances */}
            <div
              ref={(el) => {
                sectionRefs.current['allowances'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Capital Allowances
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In essence, capital allowances are tax deductions that businesses can claim for the depreciation of capital assets. Instead of deducting the full cost of an asset in the year of purchase, businesses can spread the deductions over several years. This reflects the gradual wear and tear of the asset.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <ClockIcon size={16} /> Wear and Tear Allowance
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    This allowance is designed to account for the gradual decline in the value of an asset due to its use over time. It is essentially a form of depreciation allowed for tax purposes. The calculation of wear and tear allowance often depends on factors like: The type of asset. Its useful lifespan. The applicable tax regulations. Wear and tear allowances are how tax authorities allow businesses to account for the fact that equipment, and other assets, lose value over time.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Zap size={16} /> Special Initial Allowance
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    A special initial allowance is an additional deduction that businesses can sometimes claim in the year they purchase a new asset. It is often used as an incentive to encourage businesses to invest in new equipment or technology. This allowance allows businesses to deduct a larger portion of the asset's cost in the initial year, providing a more immediate tax benefit. These types of allowances are often used by governments to stimulate investment in certain sectors of the economy.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} /> Key Considerations
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>The specific rules and rates for capital allowances vary significantly between countries and jurisdictions.</li>
                  <li>It is essential for businesses to consult with tax professionals to ensure they are claiming the correct allowances and complying with all applicable regulations.</li>
                  <li>Tax laws are subject to change, so keeping up to date with the current regulations is very important.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Financial Insight
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
                  <span>Project Categories</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Key Formulas</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Working Capital Interventions</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">12</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Capital budgeting decisions shape a company's future. Understand project classifications (replacement, expansion, safety/Environmental). Accurately calculate total costs including installation and working capital changes. Consider the tax implications of investments through capital allowances and after-tax calculations. When working capital changes, implement appropriate interventions to maintain liquidity.
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
                <strong className="text-white">Project Classification</strong> – capital budgeting projects include Replacement (maintain efficiency), Expansion (growth), and Safety/Environmental (compliance). Projects can be independent or mutually exclusive.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Cost Calculations</strong> – total asset cost = purchase price + installation + other related costs. Working capital changes = change in current assets − change in current liabilities.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Replacement Decisions</strong> – disposal value = market price − selling costs. Scrapping allowance (loss) = book value − disposal value; recoupment (gain) = disposal value − book value.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Working Capital Interventions</strong> – for increases: reduce inventory, tighten credit, invest excess cash; for decreases: secure financing, sell assets, delay expenditures.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Tax &amp; Capital Allowances</strong> – incremental after-tax benefit = (revenue/cost savings) × (1 − tax rate). Capital allowances include wear and tear allowances and special initial allowances, which vary by jurisdiction.
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
            Sidemann Academic Registry • Financial Management – Capital Budgeting 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;