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
  Scale,
  Gavel,
  Users,
  DollarSign,
  AlertTriangle,
  File,
  Activity,
  BadgeCheck,
  Clipboard,
  Eye,
  Monitor,
  Users2,
  Building2,
  FileCheck,
  ClockIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'rules', label: 'Procurement Rules' },
  { id: 'meanings', label: 'Meanings' },
  { id: 'importance', label: 'Importance' },
  { id: 'act', label: 'The Act' },
  { id: 'framework', label: 'Framework' },
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
        text: 'Public procurement rules are designed to ensure that taxpayer money is spent efficiently and ethically. In many countries, procurement accounts for 15-30% of GDP, making these rules crucial for economic governance.',
      },
      {
        title: 'Pro Tip',
        text: 'Always document every step of the procurement process. Good documentation is your best defence against allegations of impropriety or favoritism.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five pillars of procurement rules with the acronym "F-V-T-I-A": Fairness, Value for Money, Transparency, Integrity, and Accountability.',
      },
      {
        title: 'Common Mistake',
        text: 'Many procurement professionals focus too much on price and overlook other important factors like quality, reliability, and after-sales service. Value for money is about the total cost of ownership, not just the purchase price.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Public procurement rules are designed to ensure that taxpayer money is spent efficiently and ethically. In many countries, procurement accounts for 15-30% of GDP, making these rules crucial for economic governance.',
      },
      {
        title: 'Pro Tip',
        text: 'Always document every step of the procurement process. Good documentation is your best defence against allegations of impropriety or favoritism.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five pillars of procurement rules with the acronym "F-V-T-I-A": Fairness, Value for Money, Transparency, Integrity, and Accountability.',
      },
      {
        title: 'Common Mistake',
        text: 'Many procurement professionals focus too much on price and overlook other important factors like quality, reliability, and after-sales service. Value for money is about the total cost of ownership, not just the purchase price.',
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
            Procurement Rules &amp;{' '}
            <span className="text-sky-300 font-bold italic">
              the Public Procurement Act
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to procurement rules, their meanings and importance, the Public Procurement Act, and the public procurement framework.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scale size={14} className="inline mr-1" /> Rules
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <File size={14} className="inline mr-1" /> The Act
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Building2 size={14} className="inline mr-1" /> Framework
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
                placeholder="Search for a rule, principle, framework component..."
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
                Introduction to Procurement Rules
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Procurement rules are the set of guidelines and regulations that govern how organizations, especially public bodies, buy goods, services, and works. They dictate the "how-to" of purchasing, ensuring that the process is fair, transparent, and efficient.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    <strong>Key Principles:</strong> Fairness, Transparency, Accountability, and Efficiency.
                  </p>
</div>
            </div>

            {/* SECTION 2: Procurement Rules Overview */}
            <div
              ref={(el) => {
                sectionRefs.current['rules'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procurement Rules Overview
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Here's a simpler way to think about procurement rules:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-slate-700 dark:text-slate-300">
                    <li><strong>They're like the "rulebook" for buying things:</strong> Just as a sports game has rules to ensure fair play, procurement has rules to ensure fair purchasing.</li>
                    <li><strong>They aim to prevent unfairness and waste:</strong> They stop things like favoritism, bribery, and overspending.</li>
                    <li><strong>They promote good use of resources:</strong> They help organizations get the best value for their money.</li>
                    <li><strong>They provide a consistent process:</strong> They ensure that everyone follows the same procedures when making purchases.</li>
                  </ul>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Transparency',
                    icon: <Eye size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> All procurement processes should be open and accessible to the public, or at least all eligible suppliers. Information about tenders, evaluations, and contract awards should be readily available.</p>
                        <p><strong>Purpose:</strong> To prevent corruption, build public trust, and ensure that all qualified suppliers have an equal opportunity to participate.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Fairness and Impartiality',
                    icon: <Scale size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> All suppliers should be treated equally, and decisions should be made based on objective criteria, without favoritism or bias.</p>
                        <p><strong>Purpose:</strong> To promote competition, ensure that the best suppliers are selected, and maintain the integrity of the procurement process.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Competition',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> Procurement should be conducted in a way that encourages competition among suppliers, to obtain the best possible value for money.</p>
                        <p><strong>Purpose:</strong> To drive down prices, improve quality, and stimulate innovation.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Value for Money',
                    icon: <DollarSign size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> Procurement decisions should be based on a balance of cost, quality, and other relevant factors, to achieve the best overall outcome.</p>
                        <p><strong>Purpose:</strong> To ensure that public funds are used efficiently and effectively.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Accountability',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> Procurement officials and organizations should be held responsible for their actions and decisions.</p>
                        <p><strong>Purpose:</strong> To prevent abuse of power, ensure that procurement processes are conducted ethically, and maintain public trust.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Integrity and Ethical Conduct',
                    icon: <BadgeCheck size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> Procurement should be conducted with the highest standards of integrity and ethical behavior, avoiding conflicts of interest and preventing corruption.</p>
                        <p><strong>Purpose:</strong> To maintain public confidence, ensure that procurement decisions are made in the public interest, and prevent fraud.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Non-Discrimination',
                    icon: <Users2 size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> All eligible suppliers should be given an equal opportunity to participate in procurement processes, regardless of their nationality, size, or other factors.</p>
                        <p><strong>Purpose:</strong> To promote fair competition and ensure that the best suppliers are selected based on merit.</p>
                      </>
                    ),
                  },
                  {
                    title: '8. Efficiency and Effectiveness',
                    icon: <Activity size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> Procurement processes should be streamlined and conducted in a timely manner, to minimize delays and costs.</p>
                        <p><strong>Purpose:</strong> To ensure that goods, services, and works are acquired efficiently and that public needs are met promptly.</p>
                      </>
                    ),
                  },
                  {
                    title: '9. Compliance with Laws and Regulations',
                    icon: <FileCheck size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> All procurement activities must comply with applicable laws, regulations, and policies.</p>
                        <p><strong>Purpose:</strong> To ensure legal compliance, prevent legal challenges, and maintain the integrity of the procurement process.</p>
                      </>
                    ),
                  },
                  {
                    title: '10. Conflict of Interest Avoidance',
                    icon: <AlertTriangle size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> Those involved in procurement must avoid situations where personal interests could improperly influence procurement decisions.</p>
                        <p><strong>Purpose:</strong> To maintain impartiality and public trust in the procurement process.</p>
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

            {/* SECTION 4: Reasons Why Procurement Rules Are Important */}
            <div
              ref={(el) => {
                sectionRefs.current['importance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Reasons Why General Procurement Rules Are Important
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Ensuring Fair Competition',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p>Procurement rules create a level playing field for all potential suppliers. This allows smaller businesses to compete with larger ones, fostering innovation and preventing monopolies.</p>
                        <p>Without rules, favoritism and corruption could easily dominate, shutting out qualified suppliers and stifling economic growth.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Promoting Transparency and Accountability',
                    icon: <Eye size={16} />,
                    content: (
                      <>
                        <p>Clear procurement rules make the entire purchasing process visible, reducing the risk of corruption and misuse of funds.</p>
                        <p>Transparency builds public trust, especially in government procurement, where taxpayers' money is being spent. Accountability ensures that those responsible for procurement decisions can be held responsible for their actions.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Achieving Value for Money',
                    icon: <DollarSign size={16} />,
                    content: (
                      <>
                        <p>Procurement rules encourage competition and objective evaluation of bids, leading to better prices and higher quality goods and services.</p>
                        <p>This is crucial for both public and private organizations, as it ensures that resources are used efficiently.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Maintaining Ethical Standards',
                    icon: <BadgeCheck size={16} />,
                    content: (
                      <>
                        <p>Procurement rules often include codes of conduct and conflict of interest policies, promoting ethical behavior among procurement professionals.</p>
                        <p>This helps to prevent bribery, fraud, and other forms of corruption, which can undermine public trust and damage an organization's reputation.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Supporting Public Policy Objectives',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p>In public procurement, rules can be used to promote broader policy goals, such as supporting small businesses, promoting environmental sustainability, or advancing social equity.</p>
                        <p>This allows governments to use their purchasing power to achieve positive social and economic outcomes.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Legal Compliance',
                    icon: <FileCheck size={16} />,
                    content: (
                      <>
                        <p>Procurement rules often reflect or implement legal requirements, ensuring that organizations comply with applicable laws and regulations.</p>
                        <p>This reduces the risk of legal challenges and penalties.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Standardizing Processes',
                    icon: <SettingsIcon size={16} />,
                    content: (
                      <>
                        <p>Procurement rules provide a consistent framework for purchasing, ensuring that all transactions are handled in a uniform and efficient manner.</p>
                        <p>This streamlines operations, reduces errors, and improves overall efficiency.</p>
                      </>
                    ),
                  },
                  {
                    title: '8. Risk Mitigation',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>Proper procurement rules aid in managing risk. They help to ensure that proper due diligence is carried out on suppliers, and that contracts are sound.</p>
                        <p>This reduces the risk of financial loss, legal problems, and reputational damage.</p>
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

            {/* SECTION 5: The Public Procurement Act */}
            <div
              ref={(el) => {
                sectionRefs.current['act'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Public Procurement Act
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Think of the Public Procurement Act as the rulebook that governments and other public organizations follow when they buy things. It's designed to make sure they spend taxpayer money wisely and fairly.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Ensuring Transparency and Accountability',
                    icon: <Eye size={16} />,
                    content: (
                      <>
                        <p>The Public Procurement Act mandates that all stages of the procurement process, from planning to awarding contracts, are open and visible. This means that information about tenders, evaluations, and contract awards should be readily accessible to the public and potential suppliers.</p>
                        <p>This transparency is crucial for preventing corruption and building public trust. By making the process visible, it ensures that public funds are used responsibly and that decisions are made in the public interest. Accountability is also a core element, as it holds public officials responsible for their procurement decisions, ensuring that they act ethically and in compliance with the law.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Promoting Fair Competition',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p>The Act aims to create a level playing field for all potential suppliers, regardless of their size or background. It establishes rules that prevent favoritism and discrimination, ensuring that all qualified businesses have an equal opportunity to compete for public contracts.</p>
                        <p>This promotes healthy competition, which drives down prices and improves the quality of goods and services. By ensuring that all suppliers are treated fairly, the Act encourages innovation and efficiency, ultimately benefiting the public.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Achieving Value for Money',
                    icon: <DollarSign size={16} />,
                    content: (
                      <>
                        <p>A central objective of the Public Procurement Act is to ensure that public funds are used efficiently and effectively. This involves selecting suppliers who offer the best combination of price, quality, and other relevant factors.</p>
                        <p>The Act encourages procuring entities to conduct thorough evaluations of bids, considering not just the lowest price, but also the overall value proposition. This includes assessing the supplier's experience, technical capabilities, and financial stability. By focusing on value for money, the Act helps to maximize the impact of public spending.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Standardizing Procurement Processes',
                    icon: <SettingsIcon size={16} />,
                    content: (
                      <>
                        <p>The Act establishes uniform procedures and guidelines for all public procurement activities. This helps to ensure consistency and efficiency across different government departments and agencies.</p>
                        <p>Standardization simplifies the procurement process for both procuring entities and suppliers, reducing administrative burdens and minimizing errors. By providing a clear and consistent framework, the Act promotes predictability and fairness, making it easier for businesses to participate in public procurement.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Preventing Corruption and Fraud',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>The Act includes provisions to prevent corruption and fraud, such as conflict of interest rules, ethical guidelines, and mechanisms for reporting and investigating irregularities.</p>
                        <p>This is a very important part of the Act. By setting clear standards of conduct and implementing robust oversight mechanisms, the Act helps to safeguard public funds and maintain the integrity of the procurement process.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Supporting Public Policy Objectives',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p>The Public Procurement Act can be used to advance broader public policy goals, such as promoting small and medium-sized enterprises (SMEs), supporting local businesses, or advancing environmental sustainability.</p>
                        <p>This allows governments to use their purchasing power to achieve positive social and economic outcomes. For example, the Act may include provisions that give preference to suppliers who employ people with disabilities or use environmentally friendly materials.</p>
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

            {/* SECTION 6: The Public Procurement Framework */}
            <div
              ref={(el) => {
                sectionRefs.current['framework'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Public Procurement Framework
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The public procurement framework is essentially the system of laws, regulations, policies, and procedures that govern how public entities acquire goods, services, and works. It's designed to ensure that public funds are spent efficiently, effectively, and ethically.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Legislation (Laws)',
                    icon: <File size={16} />,
                    content: (
                      <>
                        <p>This forms the foundation of the framework. It includes the primary Public Procurement Act and any related laws that set out the overarching principles and rules for public procurement.</p>
                        <p>These laws define the roles and responsibilities of players, such as the regulatory authority and procuring entities, and establish the legal basis for procurement processes.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Regulations',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p>Regulations provide more detailed guidance on how to implement the legislation. They cover specific aspects of procurement, such as tendering procedures, evaluation criteria, and contract management.</p>
                        <p>Regulations are often issued by the regulatory authority and are legally binding on procuring entities.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Policies and Guidelines',
                    icon: <BookOpen size={16} />,
                    content: (
                      <>
                        <p>These are internal documents issued by government agencies or regulatory bodies that provide further clarification and guidance on procurement practices.</p>
                        <p>Policies and guidelines may address specific areas, such as sustainable procurement, small business participation, or risk management.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Institutions and Organizations',
                    icon: <Building2 size={16} />,
                    content: (
                      <>
                        <p>This includes the regulatory authority, which oversees and regulates public procurement, and the procuring entities, which are responsible for carrying out procurement activities.</p>
                        <p>Other institutions may include tender boards, evaluation committees, and dispute resolution bodies.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Processes and Procedures',
                    icon: <Clipboard size={16} />,
                    content: (
                      <>
                        <p>This encompasses the entire procurement cycle, from planning and tendering to contract management and payment.</p>
                        <p>It includes specific procedures for different procurement methods, such as open tendering, limited tendering, and direct procurement.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Standards and Codes of Conduct',
                    icon: <BadgeCheck size={16} />,
                    content: (
                      <>
                        <p>These establish ethical standards for procurement professionals and suppliers, promoting integrity and preventing corruption.</p>
                        <p>They may include codes of conduct for public officials, conflict of interest policies, and guidelines on gifts and hospitality.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Oversight and Monitoring Mechanisms',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>These mechanisms are in place to ensure compliance with the procurement framework and to detect and prevent irregularities.</p>
                        <p>They may include internal audits, external audits, and mechanisms for reporting and investigating complaints.</p>
                      </>
                    ),
                  },
                  {
                    title: '8. Dispute Resolution Mechanisms',
                    icon: <Gavel size={16} />,
                    content: (
                      <>
                        <p>These are the ways that disagreements about the procurement process are resolved, such as administrative reviews, and court proceedings.</p>
                      </>
                    ),
                  },
                  {
                    title: '9. E-Procurement Systems',
                    icon: <Monitor size={16} />,
                    content: (
                      <>
                        <p>Increasingly, electronic platforms are used to conduct procurement activities, enhancing transparency and efficiency.</p>
                        <p>These systems may include online tendering portals, electronic contract management systems, and supplier databases.</p>
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
                  <span>Rule Categories</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Act Objectives</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Framework Components</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">9</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Procurement rules ensure fairness, transparency, and value for money. Key rules include Transparency, Fairness, Competition, Value for Money, Accountability, Integrity, Non-Discrimination, Efficiency, Compliance, and Conflict of Interest Avoidance. The Public Procurement Act establishes the legal framework for public procurement, promoting transparency, fair competition, value for money, standardization, anti-corruption, and public policy objectives. The public procurement framework consists of legislation, regulations, policies, institutions, processes, standards, oversight, dispute resolution, and e-procurement systems.
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
                <strong className="text-white">Procurement Rules</strong> – Guidelines that ensure fairness, transparency, and accountability in purchasing. They prevent corruption, promote competition, and ensure efficient use of resources.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Key Rules</strong> – Transparency, Fairness, Competition, Value for Money, Accountability, Integrity, Non-Discrimination, Efficiency, Compliance, and Conflict of Interest Avoidance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Public Procurement Act</strong> – The legal foundation for public procurement, promoting transparency, fair competition, value for money, standardization, anti-corruption, and public policy objectives.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Procurement Framework</strong> – Comprises legislation, regulations, policies, institutions, processes, standards, oversight, dispute resolution, and e-procurement systems working together to ensure effective public spending.
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
            Sidemann Academic Registry • Procurement Rules Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;
