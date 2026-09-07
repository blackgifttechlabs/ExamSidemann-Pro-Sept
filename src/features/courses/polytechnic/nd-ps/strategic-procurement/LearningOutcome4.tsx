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
  CreditCard,
  Truck,
  Receipt,
  Flag,
  BarChart,
  Lock,
  Star,
  PieChart,
  MessageCircle,
  RefreshCw,
  Repeat,
  ClipboardList,
  Clock,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'payment', label: 'Payment Strategies' },
  { id: 'beneficial', label: 'Beneficial Strategies' },
  { id: 'ranking', label: 'Strategy Ranking' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome4: React.FC = () => {
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
        text: 'Milestone payments are particularly effective for large projects as they help manage cash flow for both parties and provide clear progress benchmarks.',
      },
      {
        title: 'Pro Tip',
        text: 'When choosing a payment strategy, consider the trust level with your supplier. Payment in advance requires high trust, while net terms build it over time.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the six payment strategies with the acronym "P-C-O-M-P-R": Prepayment, Cash on Delivery, On Invoice, Milestone, Progress, Retainage.',
      },
      {
        title: 'Common Mistake',
        text: 'Many businesses overlook retainage as a payment strategy. It can be a powerful tool to ensure quality and completion, especially in construction projects.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Milestone payments are particularly effective for large projects as they help manage cash flow for both parties and provide clear progress benchmarks.',
      },
      {
        title: 'Pro Tip',
        text: 'When choosing a payment strategy, consider the trust level with your supplier. Payment in advance requires high trust, while net terms build it over time.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the six payment strategies with the acronym "P-C-O-M-P-R": Prepayment, Cash on Delivery, On Invoice, Milestone, Progress, Retainage.',
      },
      {
        title: 'Common Mistake',
        text: 'Many businesses overlook retainage as a payment strategy. It can be a powerful tool to ensure quality and completion, especially in construction projects.',
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Payment Strategies &amp;{' '}
            <span className="text-amber-300 font-bold italic">
              Strategic Frameworks
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to different payment strategies, beneficial strategies for undertakings, and strategy ranking according to importance.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <CreditCard size={14} className="inline mr-1" /> Payment Strategies
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Star size={14} className="inline mr-1" /> Beneficial Strategies
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Strategy Ranking
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
                placeholder="Search for a payment type, beneficial strategy, ranking concept..."
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
                Introduction to Payment Strategies &amp; Frameworks
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine you are buying a new bike. You can pay for it all at once, pay a little bit each month, or pay when you get the bike. These are different "payment strategies." Companies also have different ways to pay for things they buy, depending on what they are buying and how they want to manage their money. This learning outcome covers the various payment strategies available, the strategies most beneficial to undertakings, and how to rank strategies according to importance.
                  </p>
</div>
            </div>

            {/* SECTION 2: Different Payment Strategies */}
            <div
              ref={(el) => {
                sectionRefs.current['payment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Different Payment Strategies
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What are Different Payment Strategies?</strong> Companies have different ways to pay for things they buy, depending on what they are buying and how they want to manage their money.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Payment in Advance (Prepayment)',
                    icon: <CreditCard size={16} />,
                    content: (
                      <>
                        <p><strong>Paying for something before you get it.</strong></p>
                        <p>Payment in advance, or prepayment, means that the buyer pays the seller before the goods or services are delivered. This strategy is often used when the seller needs to cover their upfront costs, or when the buyer is purchasing customized or high-value items. For example, a company might pay a software developer a portion of the project cost before they start working on it. This strategy can be beneficial for the seller because it provides them with immediate cash flow and reduces the risk of non-payment. However, it can be risky for the buyer because they are paying for something that they have not received yet. So, trust and a solid contract are very important. Companies use this strategy when they really need to secure a specific supplier or a product that is in high demand, or when the supplier has a limited amount of stock.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Payment on Delivery (Cash on Delivery - COD)',
                    icon: <Truck size={16} />,
                    content: (
                      <>
                        <p><strong>Paying for something when it is delivered to you.</strong></p>
                        <p>Payment on delivery, or cash on delivery (COD), means that the buyer pays the seller when the goods are delivered. This strategy is often used for smaller transactions or when the buyer wants to inspect the goods before paying. For example, you might pay for a pizza when it is delivered to your door. This strategy can be beneficial for the buyer because they can ensure that they are receiving the correct goods in good condition before paying. However, it can be risky for the seller because they are delivering goods without being paid upfront. Therefore, it is often used with trusted customers, or when the value of the goods is low.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Payment on Invoice (Net Terms)',
                    icon: <Receipt size={16} />,
                    content: (
                      <>
                        <p><strong>Paying for something after you get a bill for it, usually within a certain number of days.</strong></p>
                        <p>Payment on invoice, or net terms, means that the buyer pays the seller after they receive an invoice for the goods or services. The invoice typically specifies a due date, such as net 30 days or net 60 days. This strategy is commonly used for business-to-business transactions and allows the buyer some time to pay. For example, a company might receive an invoice for office supplies and have 30 days to pay it. This strategy can be beneficial for the buyer because it provides them with some flexibility in their cash flow. It also allows them to review the invoice and ensure that it is accurate before paying. It is also good for the seller because it shows trust in the buyer.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Milestone Payments',
                    icon: <Flag size={16} />,
                    content: (
                      <>
                        <p><strong>Paying for a big project in small parts as each part is finished.</strong></p>
                        <p>Milestone payments mean that the buyer pays the seller in installments as specific milestones or stages of a project are completed. This strategy is often used for large or complex projects, such as construction or software development. For example, a company might pay a contractor a portion of the project cost after each phase of construction is completed. This strategy can be beneficial for both the buyer and the seller. It provides the seller with regular cash flow, and it allows the buyer to monitor the progress of the project and ensure that it is on track. It also allows for the buyer to stop the project if the quality is not acceptable.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Progress Payments',
                    icon: <BarChart size={16} />,
                    content: (
                      <>
                        <p><strong>Paying for ongoing work at regular intervals, even if it is not fully finished yet.</strong></p>
                        <p>Progress payments mean that the buyer pays the seller at regular intervals, such as monthly or quarterly, based on the progress of the work. This strategy is often used for long-term projects or service contracts. For example, a company might pay a consulting firm a monthly fee for ongoing services. This strategy can be beneficial for the seller because it provides them with a steady stream of income. It also allows the buyer to monitor the progress of the work and ensure that it is being completed according to the contract. It is different from milestone payments, because it does not require a completed stage of work to be paid. It is more about the time spent.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Retainage',
                    icon: <Lock size={16} />,
                    content: (
                      <>
                        <p><strong>Holding back a small part of the payment until everything is finished and working properly.</strong></p>
                        <p>Retainage means that the buyer withholds a portion of each payment, typically 5% to 10%, until the project is completed and accepted. This strategy is often used in construction and other industries where quality and performance are critical. For example, a company might withhold 10% of each payment to a contractor until all the work is completed and inspected. This strategy can be beneficial for the buyer because it provides them with some leverage to ensure that the work is completed to their satisfaction. It also provides some protection against defects or other problems that may arise after the project is completed. It protects the buyer.</p>
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

            {/* SECTION 3: Strategies Most Beneficial to the Undertaking */}
            <div
              ref={(el) => {
                sectionRefs.current['beneficial'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Strategies Most Beneficial to the Undertaking
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What are Beneficial Strategies?</strong> Imagine you are trying to climb a mountain. Some ways of climbing will be easier and faster than others. "Beneficial strategies" are like the best routes to take. They are the plans and actions that will help you reach your goal with the least amount of trouble and the most success.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Focusing on Core Competencies',
                    icon: <Star size={16} />,
                    content: (
                      <>
                        <p><strong>Doing what you are good at and not wasting time on things you are not good at.</strong></p>
                        <p>When undertaking any project or business venture, it is crucial to focus on your core competencies. These are the unique skills, knowledge, or resources that give you a competitive advantage. Instead of trying to do everything yourself, identify what you do exceptionally well and concentrate your efforts on those areas. For example, if you are a software development company, your core competency might be creating innovative and user-friendly applications. You should focus on developing high-quality software and leave other tasks, like marketing or customer support, to specialists. This allows you to maximize your efficiency and deliver the best possible results. By focusing on your strengths, you can build a strong foundation and achieve sustainable success. It is like a chef focusing on their signature dish, rather than trying to make every dish on the menu.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Implementing Efficient Resource Allocation',
                    icon: <PieChart size={16} />,
                    content: (
                      <>
                        <p><strong>Using your time, money, and people wisely, and not wasting anything.</strong></p>
                        <p>Efficient resource allocation is essential for the success of any undertaking. This means carefully planning how you will use your resources, such as time, money, and personnel, to achieve your goals. For example, before starting a marketing campaign, you need to determine how much money you will spend on advertising, how many people you'll need to work on the campaign, and how long it will take. By creating a budget and timeline, you can ensure that your resources are used effectively. This also involves prioritizing tasks and allocating resources to the most critical areas. It is like a gardener deciding where to plant their seeds and how much water to give each plant. Efficient resource allocation helps you avoid wasting resources and ensures that you are making the most of what you have.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Establishing Clear Communication Channels',
                    icon: <MessageCircle size={16} />,
                    content: (
                      <>
                        <p><strong>Making sure everyone knows what is going on and can talk to each other easily.</strong></p>
                        <p>Clear communication is vital for the smooth operation of any undertaking. This means establishing effective channels for communication between team members, stakeholders, and clients. For example, you might use regular meetings, email updates, or project management software to keep everyone informed. It is important to be transparent and provide timely feedback. This helps to avoid misunderstandings and ensures that everyone is on the same page. Also establish clear rules on how to communicate, and what to do if there is a problem. Clear communication also fosters a collaborative environment and allows for quick problem-solving. It is like a team of builders using walkie-talkies to coordinate their work on a construction site.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Adopting a Flexible and Adaptable Approach',
                    icon: <RefreshCw size={16} />,
                    content: (
                      <>
                        <p><strong>Being ready to change your plans if things do not go as expected.</strong></p>
                        <p>In today's rapidly changing environment, it is essential to be flexible and adaptable. This means being willing to adjust your plans and strategies as needed. For example, if you are launching a new product and you discover that your target market is different than you thought, you need to be willing to change your marketing strategy. This also involves being open to feedback and learning from your mistakes. It is like a sailor adjusting their sails to adapt to changing wind conditions. Being flexible and adaptable allows you to respond quickly to challenges and capitalize on new opportunities.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Implementing Continuous Improvement Practices',
                    icon: <Repeat size={16} />,
                    content: (
                      <>
                        <p><strong>Always looking for ways to do things better and make things more efficient.</strong></p>
                        <p>Continuous improvement is a mindset that involves constantly seeking ways to improve your processes, products, and services. This means regularly reviewing your performance, identifying areas for improvement, and implementing changes. For example, you might use customer feedback to improve your product design or use data analytics to identify inefficiencies in your operations. This also involves encouraging innovation and empowering employees to suggest improvements. It is like a baker constantly experimenting with new ingredients and techniques to create the perfect cake. Implementing continuous improvement practices helps you stay competitive and achieve long-term success.</p>
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

            {/* SECTION 4: Strategy Ranking According to Importance */}
            <div
              ref={(el) => {
                sectionRefs.current['ranking'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Strategy Ranking According to Importance
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What is Strategy Ranking?</strong> Imagine you have a list of things you want to achieve, like getting good grades, learning a new skill, and saving money. Some of these goals are more important than others. Strategy ranking means putting those goals in order from the most important to the least important, so you know where to focus your energy.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Defining Clear and Measurable Criteria for Importance',
                    icon: <ClipboardList size={16} />,
                    content: (
                      <>
                        <p><strong>Making a list of rules that everyone agrees on to decide which goals are the most important.</strong></p>
                        <p>Before ranking strategies, it is essential to define what "importance" means in your context. This involves establishing clear and measurable criteria. These criteria act as the guidelines for evaluating each strategy. For example, criteria might include: "Impact on overall goals" (how much this strategy helps us reach our main goal), "Urgency" (how quickly we need to do this), "Resource availability" (how much time, money, and people we have), and "Potential return on investment" (how much benefit we get for the effort). Each criterion should be clearly defined and, if possible, assigned numerical values or categories (e.g., high, medium, low). This ensures that everyone involved in the ranking process understands the criteria in the same way. By establishing these criteria, you remove the guesswork and personal opinions from the ranking process, making it more objective and reliable. This allows for clear, repeatable results.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Assessing the Impact on Overall Goals',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>Figuring out how much each strategy helps you achieve your main goal.</strong></p>
                        <p>The most important factor in ranking strategies is their impact on your overall goals. This involves evaluating how much each strategy contributes to the achievement of your objectives. For example, if your main goal is to increase sales, a strategy that directly targets new customers might be ranked higher than a strategy that focuses on improving internal processes. It is important to consider both short-term and long-term impacts. Some strategies might provide immediate benefits, while others might have a more significant impact over time. By accurately assessing the impact on overall goals, you can prioritize strategies that are most likely to lead to success.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Evaluating the Urgency and Time Sensitivity',
                    icon: <Clock size={16} />,
                    content: (
                      <>
                        <p><strong>Figuring out how quickly you need to do each strategy and how important timing is.</strong></p>
                        <p>Urgency and time sensitivity are also important factors in ranking strategies. Some strategies might need to be implemented immediately to address urgent needs or capitalize on time-sensitive opportunities. For example, a strategy to address a sudden decline in customer satisfaction might be ranked higher than a strategy to develop a new product line. It is important to consider the potential consequences of delaying implementation. Some strategies might become less effective or even irrelevant if they are not implemented in a timely manner. By evaluating the urgency and time sensitivity, you can prioritize strategies that require immediate attention.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Considering Resource Availability and Constraints',
                    icon: <DollarSign size={16} />,
                    content: (
                      <>
                        <p><strong>Figuring out if you have enough time, money, and people to do each strategy.</strong></p>
                        <p>Resource availability and constraints are practical considerations that must be considered when ranking strategies. Some strategies might require significant resources, such as funding, personnel, or technology, while others might be more resource efficient. It is important to assess the feasibility of each strategy based on your available resources. For example, a strategy that requires a large investment might be ranked lower if your budget is limited. It is also important to consider any constraints, such as legal or regulatory requirements, that might affect the implementation of a strategy. By considering resource availability and constraints, you can prioritize strategies that are feasible and achievable.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Calculating the Potential Return on Investment (ROI)',
                    icon: <TrendingUp size={16} />,
                    content: (
                      <>
                        <p><strong>Figuring out how much benefit you get for the effort you put into each strategy.</strong></p>
                        <p>The potential return on investment (ROI) is a key factor in ranking strategies. This involves assessing the potential benefits and costs of each strategy and calculating the expected ROI. For example, a strategy that requires a small investment but offers a high potential return might be ranked higher than a strategy that requires a large investment but offers a low potential return. It is important to consider both financial and non-financial benefits, such as improved customer satisfaction or increased brand awareness. By calculating the potential ROI, you can prioritize strategies that offer the greatest value for your investment.</p>
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
                  💡 Payment Insight
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
                  <span>Payment Strategies</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Beneficial Strategies</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Ranking Criteria</span>
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
                Payment strategies: Prepayment, Cash on Delivery, Net Terms, Milestone Payments, Progress Payments, Retainage. Beneficial strategies: Focus on core competencies, efficient resource allocation, clear communication, flexibility, and continuous improvement. Strategy ranking requires clear criteria, assessment of impact on goals, urgency, resource availability, and ROI calculation.
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
                <strong className="text-white">Payment Strategies</strong> – Six key strategies: Prepayment, Cash on Delivery, Net Terms (on invoice), Milestone Payments, Progress Payments, and Retainage. Each has specific use cases, risks, and benefits.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Beneficial Strategies</strong> – Five strategies for success: Focusing on core competencies, efficient resource allocation, clear communication channels, flexibility/adaptability, and continuous improvement practices.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Strategy Ranking</strong> – Five criteria for ranking: Clear and measurable criteria, impact on overall goals, urgency/time sensitivity, resource availability/constraints, and potential ROI. Ranking helps prioritise efforts.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Best Practices</strong> – Choose payment strategies based on trust levels and project needs. Implement beneficial strategies to maximise success. Use systematic ranking to focus on what matters most.
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
            Sidemann Academic Registry • Payment Strategies &amp; Frameworks Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;
