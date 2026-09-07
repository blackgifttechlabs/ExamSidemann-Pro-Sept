import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
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
  DollarSign,
  ClipboardCheck,
  Users,
  FileCheck,
  Boxes,
  BarChart,
  Sliders,
  GitBranch,
  Building2,
  Handshake,
  Calendar,
  Repeat,
  FileSpreadsheet,
  AlertTriangle,
  ShoppingBag,
  PieChart,
  Link,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'processes', label: 'Processes' },
  { id: 'models', label: 'Procurement Models' },
  { id: 'different', label: 'Different Models' },
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
        text: 'The centralized procurement model can lead to significant cost savings through volume discounts, but may reduce flexibility for individual departments.',
      },
      {
        title: 'Pro Tip',
        text: 'Use blanket orders for items with consistent demand; they reduce administrative overhead and ensure supply continuity.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the six processes that affect procurement with the acronym "B-N-S-C-I-P": Budgeting, Needs assessment, Supplier selection, Contract management, Inventory management, Performance evaluation.',
      },
      {
        title: 'Common Mistake',
        text: 'Failing to conduct a proper needs assessment leads to procurement of items that don\'t fit the actual requirement, causing waste and inefficiency.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The centralized procurement model can lead to significant cost savings through volume discounts, but may reduce flexibility for individual departments.',
      },
      {
        title: 'Pro Tip',
        text: 'Use blanket orders for items with consistent demand; they reduce administrative overhead and ensure supply continuity.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the six processes that affect procurement with the acronym "B-N-S-C-I-P": Budgeting, Needs assessment, Supplier selection, Contract management, Inventory management, Performance evaluation.',
      },
      {
        title: 'Common Mistake',
        text: 'Failing to conduct a proper needs assessment leads to procurement of items that don\'t fit the actual requirement, causing waste and inefficiency.',
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
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Procurement Processes &amp;{' '}
            <span className="text-sky-300 font-bold italic">
              Models
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to processes that affect procurement, procurement models, and different procurement models including blanket orders, standing orders, and more.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ClipboardCheck size={14} className="inline mr-1" /> Processes
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Building2 size={14} className="inline mr-1" /> Models
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Calendar size={14} className="inline mr-1" /> Different Models
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
                placeholder="Search for a process, model, concept..."
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
            {/* SECTION 1: Processes That Affect Procurement */}
            <div
              ref={(el) => {
                sectionRefs.current['processes'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Processes That Affect Procurement
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What are Processes That Affect Procurement?</strong>
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Procurement is just a fancy word for buying things. Many steps and actions happen before, during, and after you buy something. These steps and actions are "processes." Some of these processes can make buying things easier, and some can make it harder. We want to understand these processes, so we can make buying things as efficient and effective as possible.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Budgeting and Financial Planning',
                    icon: <DollarSign size={16} />,
                    content: (
                      <>
                        <p><strong>Deciding how much money you must spend and planning how to spend it.</strong></p>
                        <p>Before you can buy anything, you need to know how much money you have. Budgeting and financial planning are the processes that determine the financial resources available for procurement. If your budget is tight, you might need to find cheaper suppliers or delay certain purchases. Good financial planning helps you avoid overspending and ensures that you have enough money to buy the things you need. For example, a company might create an annual budget that allocates specific amounts of money for different departments to spend on supplies, equipment, and services. If the budgeting process is poorly done, then the procurement team might not have the money they need to buy essential items. Poor planning can lead to delays, and purchasing lower quality products. A solid budget, and financial plan, is the foundation for effective procurement.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Needs Assessment and Requirements Definition',
                    icon: <ClipboardCheck size={16} />,
                    content: (
                      <>
                        <p><strong>Figuring out exactly what you need to buy and what it needs to do.</strong></p>
                        <p>Before you start looking for suppliers, you need to know exactly what you need. This involves assessing your needs and defining the requirements for the goods or services you want to buy. This process helps you avoid buying things that you do not need or that do not meet your requirements. For example, if you need to buy new computers, you need to decide what kind of computers you need, how many you need, and what features they need to have. If your needs assessment is inaccurate, then you might end up buying the wrong computers, or not enough computers. A good needs assessment ensures that you buy the right things for the job.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Supplier Selection and Evaluation',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p><strong>Choosing the best company to buy from and checking if they are reliable.</strong></p>
                        <p>Once you know what you need, you need to find a supplier who can provide it. This involves selecting and evaluating potential suppliers. You need to consider factors such as price, quality, reliability, and delivery time. For example, you might compare quotes from different suppliers, check their references, and visit their facilities. If your supplier selection process is flawed, then you might end up working with an unreliable supplier who provides poor quality goods or services. A good supplier selection process ensures that you work with a reliable supplier who can meet your needs.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Contract Management',
                    icon: <FileCheck size={16} />,
                    content: (
                      <>
                        <p><strong>Making sure everyone follows the agreement and handling any problems that come up.</strong></p>
                        <p>After you have selected a supplier, you need to create a contract that outlines the terms and conditions of the agreement. This involves contract management, which includes monitoring the supplier's performance, processing payments, and resolving any disputes. For example, you might need to track delivery schedules, inspect the quality of goods, and handle any warranty claims. If your contract management process is weak, then you might end up with disputes, delays, or financial losses. Good contract management ensures that the agreement is followed and that any problems are resolved quickly and efficiently.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Inventory Management',
                    icon: <Boxes size={16} />,
                    content: (
                      <>
                        <p><strong>Keeping track of what you have in stock and making sure you do not run out.</strong></p>
                        <p>After you have bought your goods, you need to manage your inventory. This involves keeping track of what you have in stock, storing it properly, and ensuring that you don't run out. For example, you might use an inventory management system to track stock levels, set reorder points, and forecast demand. If your inventory management process is poor, then you might end up with stockouts, excess inventory, or damaged goods. Good inventory management ensures that you have the right amount of stock at the right time.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Performance Evaluation and Feedback',
                    icon: <BarChart size={16} />,
                    content: (
                      <>
                        <p><strong>Checking how well you did with buying things and learning how to do better next time.</strong></p>
                        <p>After the procurement process is complete, it is important to evaluate your performance and gather feedback. This involves reviewing the entire process, identifying any areas for improvement, and making changes for future procurements. For example, you might review your supplier selection process, your contract management process, and your inventory management process. If you do not evaluate your performance, then you might keep making the same mistakes. Good performance evaluation helps you improve your procurement processes and make them more efficient and effective.</p>
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

            {/* SECTION 2: Procurement Models */}
            <div
              ref={(el) => {
                sectionRefs.current['models'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procurement Models
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What are Procurement Models?</strong>
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Imagine you are building a house. You can hire one company to do everything, or you can hire different companies to do different parts. The way you choose to organize who does what is your "model." Procurement models are just different ways to organize how a company buys things. They help decide who makes the decisions, how they make them, and how they work with suppliers.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Centralized Procurement Model',
                    icon: <Sliders size={16} />,
                    content: (
                      <>
                        <p><strong>One big office does all the buying for the whole company.</strong></p>
                        <p>In a centralized procurement model, all purchasing decisions are made by a single department or team. This means that all requests for goods or services, no matter where they come from within the company, are processed through this central point. This approach is often used by large organizations or companies with multiple locations. The main advantage of this model is that it allows for greater control and standardization. By having one central team handle all procurement, the company can ensure that consistent processes are followed, that bulk discounts are negotiated, and that overall spending is better managed. For example, if a company has offices in different cities, instead of each office buying their own office supplies, the central procurement team buys all the supplies at once, getting a better price. This model also allows for specialized expertise to be developed within the central team, leading to more efficient and effective purchasing. However, it can sometimes lead to delays or a lack of flexibility if the central team is overloaded or does not understand the specific needs of different departments.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Decentralized Procurement Model',
                    icon: <GitBranch size={16} />,
                    content: (
                      <>
                        <p><strong>Each part of the company does its own buying.</strong></p>
                        <p>In a decentralized procurement model, purchasing decisions are made at the local level by individual departments or teams. This means that each department has the authority to buy the goods and services it needs, without going through a central point. This approach is often used by companies with diverse product lines or operating in different markets. The main advantage of this model is that it allows for greater flexibility and responsiveness. Departments can quickly purchase the items they need, without waiting for approval from a central team. For example, a research and development department might need to buy specialized equipment quickly, and a decentralized model allows them to do so. This model also allows departments to develop closer relationships with local suppliers, which can lead to better service and faster delivery times. However, it can sometimes lead to a lack of control and standardization, as different departments might follow different processes and pay different prices for the same items.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Hybrid Procurement Model',
                    icon: <Building2 size={16} />,
                    content: (
                      <>
                        <p><strong>A mix of both, some buying is done centrally, and some is done by each part of the company.</strong></p>
                        <p>A hybrid procurement model combines elements of both centralized and decentralized procurement. This means that some purchasing decisions are made centrally, while others are made at the local level. This approach is often used by companies that want to balance the benefits of control and flexibility. For example, a company might centralize the purchase of high-value items, such as equipment and technology, while allowing departments to purchase low-value items, such as office supplies, locally. This allows the company to maintain control over strategic purchases while giving departments the flexibility to meet their day-to-day needs. The hybrid model allows a company to tailor its procurement strategy to its specific needs and circumstances. It is often considered to be the most adaptable model.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Outsourced Procurement Model',
                    icon: <Handshake size={16} />,
                    content: (
                      <>
                        <p><strong>Hiring another company to do all the buying for you.</strong></p>
                        <p>In an outsourced procurement model, a company hires a third-party organization to handle all or part of its purchasing activities. This approach is often used by companies that want to focus on their core competencies or reduce their operating costs. The outsourced provider has specialized expertise in procurement and can often negotiate better prices and terms with suppliers. For example, a small company might outsource its procurement to a larger company that has greater buying power. This allows the small company to benefit from the larger company's economies of scale. Outsourcing can also help companies to improve their procurement processes and reduce their risk of fraud or errors. However, it can also lead to a loss of control and a dependence on the outsourced provider.</p>
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

            {/* SECTION 3: Different Procurement Models */}
            <div
              ref={(el) => {
                sectionRefs.current['different'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Different Procurement Models
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What are Different Procurement Models?</strong>
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Think of buying things like going to the grocery store. Sometimes you buy a lot of the same thing (like milk every week), sometimes you need something right away (like medicine), and sometimes you only need a few small things. Procurement models are just different ways to organize how you buy things, depending on what you need and how often you need it.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Blanket Orders',
                    icon: <Calendar size={16} />,
                    content: (
                      <>
                        <p><strong>A big agreement to buy a lot of something over a long time, but you only pay for what you use.</strong></p>
                        <p>A blanket order is like having a pre-approved agreement with a supplier to buy a certain amount of goods or services over a specified period, typically a year. You don't take delivery of everything at once; instead, you release smaller orders as needed. This is perfect for items you use regularly, like office supplies or raw materials. For example, a company might have a blanket order for paper with a supplier. They do not want to store a year's worth of paper at once, so they order smaller amounts every month. This approach offers several benefits. It simplifies the ordering process, reduces paperwork, and often leads to better pricing due to the large volume commitment. It also helps to ensure a consistent supply of essential items.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Standing Orders',
                    icon: <Repeat size={16} />,
                    content: (
                      <>
                        <p><strong>An automatic order that happens regularly, like getting a newspaper delivered every day.</strong></p>
                        <p>A standing order is a recurring order for a fixed quantity of goods or services that are delivered at regular intervals, such as daily, weekly, or monthly. This is ideal for items that are consumed consistently and predictably, like cleaning supplies or routine maintenance services. For example, a restaurant might have a standing order for fresh bread that is delivered every morning. This eliminates the need to place individual orders each time, saving time and effort. It also helps to ensure that you always have the items you need on hand. Standing orders are particularly useful for items with a short shelf life or that are essential for daily operations.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Term Contracts',
                    icon: <FileSpreadsheet size={16} />,
                    content: (
                      <>
                        <p><strong>A long-term agreement to buy something at a fixed price, even if the price goes up or down.</strong></p>
                        <p>A term contract is a long-term agreement with a supplier to provide goods or services at a predetermined price for a specified period. This is often used for high-value items or services where price stability is important, such as energy supply or long-term maintenance agreements. For example, a city might have a term contract with a construction company for road repairs over a five-year period. This provides price certainty and helps with budgeting. It also allows for a strong relationship between the buyer and the supplier. Term contracts are beneficial when market prices are volatile or when you need to ensure a consistent supply of critical resources.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Urgent Orders',
                    icon: <AlertTriangle size={16} />,
                    content: (
                      <>
                        <p><strong>Buying something right away because you need it now.</strong></p>
                        <p>An urgent order is placed when there is an immediate need for goods or services due to an unexpected event or emergency. This might include replacing a broken piece of equipment, purchasing medical supplies, or responding to a natural disaster. For example, if a factory's machine breaks down, they need a replacement part immediately. Urgent orders require a fast turnaround time and often involve expedited shipping or special handling. They may also involve higher costs due to the urgency. Having a process to handle urgent orders efficiently is crucial for minimizing disruptions and ensuring business continuity.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Low-Value Orders',
                    icon: <ShoppingBag size={16} />,
                    content: (
                      <>
                        <p><strong>Buying small, cheap things without going through a lot of paperwork.</strong></p>
                        <p>Low-value orders are for small, inexpensive items that are purchased frequently. These might include office supplies, cleaning materials, or small tools. To streamline the process, companies often use simplified purchasing procedures, such as purchase cards or petty cash. For example, an employee might use a purchase card to buy printer ink from an office supply store. This reduces the administrative burden and allows for faster procurement of essential items. Low-value orders are typically handled with minimal approvals and paperwork.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Buying Situations',
                    icon: <ClipboardCheck size={16} />,
                    content: (
                      <>
                        <p><strong>The different reasons and ways you buy things, depending on if it is new, the same as before, or a little different.</strong></p>
                        <p>Buying situations refer to the different scenarios that influence the procurement process. These typically include:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>New Task:</strong> Purchasing something for the first time. This requires extensive research and evaluation.</li>
                          <li><strong>Straight Rebuy:</strong> Repurchasing the same item from the same supplier. This is a routine process.</li>
                          <li><strong>Modified Rebuy:</strong> Repurchasing an item but with some changes, such as specifications or supplier.</li>
                        </ul>
                        <p>Understanding the buying situation helps to determine the appropriate procurement strategy and level of effort. For example, a new task might require a formal tendering process, while a straight rebuy can be handled with a simple purchase order.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Pareto Analysis',
                    icon: <PieChart size={16} />,
                    content: (
                      <>
                        <p><strong>Focusing on the 20% of things that cause 80% of the problems or results.</strong></p>
                        <p>Pareto analysis, also known as the 80/20 rule, is a technique used to prioritize procurement activities. It suggests that 80% of the effects come from 20% of the causes. In procurement, this means focusing on the 20% of suppliers or items that account for 80% of the spending or problems. For example, a company might find that 20% of its suppliers account for 80% of its procurement spending. By focusing on these key suppliers, the company can negotiate better deals and improve supplier relationships. Pareto analysis helps to identify the most critical areas for improvement and allocate resources effectively.</p>
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
                  <span>Processes</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Procurement Models</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Different Models</span>
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
                Key processes: Budgeting, Needs Assessment, Supplier Selection, Contract Management, Inventory Management, Performance Evaluation. Procurement models: Centralized, Decentralized, Hybrid, Outsourced. Different models: Blanket Orders, Standing Orders, Term Contracts, Urgent Orders, Low-Value Orders, Buying Situations (New Task, Straight Rebuy, Modified Rebuy), and Pareto Analysis.
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
                <strong className="text-white">Processes That Affect Procurement</strong> – Six key processes: Budgeting, Needs Assessment, Supplier Selection, Contract Management, Inventory Management, and Performance Evaluation. Each step is crucial for efficient and effective procurement.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Procurement Models</strong> – Four organizational approaches: Centralized (single department), Decentralized (local departments), Hybrid (mix of both), and Outsourced (third-party). Each has trade-offs in control, flexibility, and cost.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Different Procurement Models</strong> – Seven specific models: Blanket Orders (long-term volume agreements), Standing Orders (regular recurring orders), Term Contracts (fixed-price long-term), Urgent Orders (emergency purchases), Low-Value Orders (simplified for small items), Buying Situations (New Task, Straight Rebuy, Modified Rebuy), and Pareto Analysis (focus on critical 20%).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Best Practices</strong> – Align procurement processes with organisational goals, choose the right model for your needs, and use appropriate tools like blanket orders or Pareto analysis to optimise efficiency and value.
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
            Sidemann Academic Registry • Procurement Processes &amp; Models Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;
