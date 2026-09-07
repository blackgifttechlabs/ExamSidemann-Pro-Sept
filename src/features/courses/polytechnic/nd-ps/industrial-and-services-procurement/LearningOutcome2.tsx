import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Hash,
  Paperclip,
  SearchIcon,
  ClockIcon,
  Layout,
  HardDriveIcon,
  Edit,
  Target,
  GlobeIcon,
  Shield,
  ListChecks,
  SettingsIcon,
  Type,
  BookOpen,
  LayersIcon,
  FileText,
  Scissors,
  CircleIcon,
  Archive,
  Database,
  DollarSign,
  Users,
  Wrench,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  AlertCircle,
  Monitor,
  Cpu,
  Link2,
  Zap,
  Globe,
  FileCode,
  FolderTree as FolderTreeIcon,
  UserCheck,
  GraduationCap,
  Briefcase,
  Rocket,
  Menu,
  MousePointer,
  Touchpad,
  Grid3X3,
  Palette,
  Settings,
  BookOpen as BookOpenIcon,
  FileText as FileTextIcon,
  MessageSquare,
  Handshake,
  PenTool,
  Scale,
  Landmark,
  PiggyBank,
  TrendingUp,
  CloudRain,
  Sun,
  Wind,
  ArrowRightCircle,
  GitBranch,
  Store,
  HardDrive,
  Building,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'what-are-capital-goods', label: 'What are Capital Goods?' },
  { id: 'capital-equipment', label: 'Capital Equipment' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'characteristics', label: 'Characteristics' },
  { id: 'purchase-factors', label: 'Purchase Factors' },
  { id: 'buying-center', label: 'Buying Center' },
  { id: 'acquisition-steps', label: 'Acquisition Steps' },
  { id: 'acquisition-methods', label: 'Acquisition Methods' },
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
        text: 'Capital goods are also known as "producer goods" because they are used to produce other goods and services, rather than being consumed directly by consumers.',
      },
      {
        title: 'Pro Tip',
        text: 'When evaluating capital equipment, always consider the total cost of ownership (TCO), including maintenance, energy costs, and potential downtime.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 6 characteristics of capital goods: Durability, High Cost, Used in Production, Long-Term Investment, Depreciation, and Impact on Productivity.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse capital goods with consumer goods. Capital goods are used to produce other goods, while consumer goods are bought for personal consumption.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Capital goods are also known as "producer goods" because they are used to produce other goods and services, rather than being consumed directly by consumers.',
      },
      {
        title: 'Pro Tip',
        text: 'When evaluating capital equipment, always consider the total cost of ownership (TCO), including maintenance, energy costs, and potential downtime.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 6 characteristics of capital goods: Durability, High Cost, Used in Production, Long-Term Investment, Depreciation, and Impact on Productivity.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse capital goods with consumer goods. Capital goods are used to produce other goods, while consumer goods are bought for personal consumption.',
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
                ? 'bg-orange-600 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Classification of{' '}
            <span className="text-sky-300 font-bold italic">
              Capital Goods
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Comprehensive overview of capital goods, their characteristics, factors influencing purchases, acquisition processes, and financing methods.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <HardDrive size={14} className="inline mr-1" /> Capital Equipment
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <DollarSign size={14} className="inline mr-1" /> Financing
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Buying Center
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-orange-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, acquisition, financing..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-orange-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XIcon size={18} className="text-orange-200" />
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
            {/* SECTION 1: What are Capital Goods? */}
            <div
              ref={(el) => {
                sectionRefs.current['what-are-capital-goods'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                What are Capital Goods?
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Capital goods are the things a company buys to use in making other things or providing services. They're like the tools and machines a business needs to operate.
                  </p>
</div>
            </div>

            {/* SECTION 2: Capital Equipment */}
            <div
              ref={(el) => {
                sectionRefs.current['capital-equipment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Capital Equipment
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Big, expensive machines and tools that a company uses for a long time.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <HardDriveIcon size={16} /> Detailed Explanation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Capital equipment refers to major, durable assets that a company purchases for long-term use in its operations. These are typically large, expensive items that are essential for production or service delivery.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Examples include manufacturing machinery, heavy construction equipment, large vehicles (like airplanes or trucks), and major IT infrastructure like servers and data centers. Capital equipment is characterized by its long lifespan, significant cost, and its direct contribution to the company's productive capacity. When a company invests in capital equipment, it's making a long-term commitment to its operations and expecting a return on that investment over several years.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  The purchase of capital equipment often involves a significant decision-making process, including careful evaluation of factors like cost, performance, reliability, and maintenance requirements. This type of equipment is central to the core operations of a business.
                </p>
              </div>
            </div>

            {/* SECTION 3: Accessories */}
            <div
              ref={(el) => {
                sectionRefs.current['accessories'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Accessories
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Smaller tools and parts that help the big machines work better or do more things.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Wrench size={16} /> Detailed Explanation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Accessories, in the context of capital goods, are supplementary items that enhance the functionality or efficiency of capital equipment. These are typically smaller, less expensive items compared to the main equipment itself. Accessories can include things like specialized tools, attachments, spare parts, and software upgrades. They are designed to improve the performance, versatility, or lifespan of the primary capital equipment. For instance, for a manufacturing machine, accessories might include different cutting tools, molds, or control panels. For a computer server, accessories could be extra memory modules or backup power supplies. Accessories are important because they allow companies to customize their capital equipment to meet specific needs and improve productivity. They also help to extend the lifespan of the equipment by providing replacement parts and upgrades. While they are less expensive than capital equipment, accessories are still an important investment that can significantly impact a company's operations. They are needed to keep the Capital equipment running properly.
                </p>
              </div>
            </div>

            {/* SECTION 4: Characteristics of Capital Goods */}
            <div
              ref={(el) => {
                sectionRefs.current['characteristics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Characteristics of Capital Goods
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These are the things that make tools and machines different from other things a company buys. It's like understanding what makes a hammer different from a bag of nails.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Shield size={16} /> 1. Durability
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>They last a long time.</strong>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Capital goods are designed to have a long lifespan, often spanning several years or even decades. This durability is essential because these goods represent a significant investment for a company. For example, a manufacturing plant might purchase a large piece of machinery that is expected to operate reliably for 10 to 15 years. This durability is achieved through the use of high-quality materials, robust construction, and careful engineering. The long lifespan of capital goods allows companies to spread the cost of the investment over an extended period, making them more affordable in the long run. It also reduces the frequency of replacements, minimizing downtime and disruption to operations. The durability of capital goods is a key factor in their value proposition, as it ensures that they can provide a reliable return on investment over an extended period.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <DollarSign size={16} /> 2. High Cost
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>They're expensive.</strong>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Capital goods typically involve a substantial financial investment. This is due to their complexity, the materials used in their construction, and the specialized engineering required. For example, a large piece of construction equipment, like a crane or a bulldozer, can cost hundreds of thousands or even millions of dollars. The high cost of capital goods often requires companies to secure financing or develop a long-term investment plan. This investment is justified by the expectation that the capital goods will generate a return over their lifespan, either through increased productivity, reduced operating costs, or enhanced revenue. The high cost also means that purchasing decisions are carefully considered and often involve multiple stakeholders within the organization.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Layout size={16} /> 3. Used in Production
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>They're used to make other things or provide services.</strong>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Capital goods are used directly in the production of other goods or the provision of services. They are essential tools that enable companies to manufacture products, deliver services, and carry out their core operations. For example, a printing press is used to produce books and magazines, and a delivery truck is used to transport goods. Without these capital goods, companies would be unable to carry out their primary functions. The use of capital goods in production can increase efficiency, improve quality, and expand capacity. They allow companies to automate processes, streamline operations, and produce goods and services on a larger scale.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <ClockIcon size={16} /> 4. Long-Term Investment
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Companies buy them expecting to use them for many years.</strong>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Capital goods represent a long-term investment for a company. Unlike consumable goods that are used up quickly, capital goods are expected to provide value over an extended period. This long-term perspective influences purchasing decisions, as companies must consider factors such as depreciation, maintenance, and future needs. For example, when a company purchases a new building, it expects to use that building for many years to come. The long-term nature of capital goods investments requires careful planning and financial forecasting. Companies must assess the potential return on investment and ensure that the capital goods will remain relevant and productive over their lifespan.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Archive size={16} /> 5. Depreciation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>They lose value over time.</strong>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Capital goods depreciate over time, meaning that their value decreases due to wear and tear, obsolescence, and technological advancements. This depreciation is an important factor to consider when evaluating the financial performance of capital goods. Companies use various accounting methods to calculate depreciation and reflect the declining value of these assets on their financial statements. For example, a company might use the straight-line depreciation method to evenly distribute the cost of a machine over its useful life. Depreciation is not just an accounting concept; it also reflects the reality that capital goods become less efficient and reliable over time. Regular maintenance and upgrades can help to slow down the depreciation process, but eventually, capital goods will need to be replaced.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Target size={16} /> 6. Impact on Productivity
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>They help companies make more things or do more work.</strong>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Capital goods have a direct impact on a company's productivity. By providing efficient tools and machinery, they enable companies to produce more goods or deliver more services with the same amount of resources. For example, a company that invests in automated manufacturing equipment can produce more products in less time, reducing labor costs and increasing output. Capital goods can also improve the quality of products and services, leading to increased customer satisfaction. The impact of capital goods on productivity is a key factor in their value proposition. Companies invest in these assets to improve their efficiency, competitiveness, and profitability. They are a tool to increase output.
                </p>
              </div>
            </div>

            {/* SECTION 5: Factors Influencing Purchase */}
            <div
              ref={(el) => {
                sectionRefs.current['purchase-factors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors Influencing Purchase of Capital Equipment
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These are the things a company thinks about before buying big machines or tools. It's like deciding if you really need a new car and figuring out which one is the best fit.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Target size={16} /> 1. Return on Investment (ROI)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Will this machine make us more money than it costs?</strong>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  ROI is a critical factor influencing capital equipment purchases. Companies meticulously analyze the potential financial benefits of an investment against its costs. This involves calculating the expected increase in revenue, reduction in operating expenses, or improvement in efficiency that the equipment will generate. For example, a manufacturing company might assess whether a new automated assembly line will significantly reduce labor costs and increase production output, thereby generating a positive ROI. Companies consider factors such as the equipment's lifespan, maintenance costs, and potential resale value when calculating ROI. A high ROI indicates that the investment is likely to be profitable and justifies the expenditure.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Layout size={16} /> 2. Production Capacity and Efficiency
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Will this machine help us make more things faster?</strong>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Companies often purchase capital equipment to increase their production capacity or improve their operational efficiency. This involves evaluating the equipment's ability to handle increased demand, streamline processes, and reduce downtime. For example, a packaging company might invest in a high-speed packaging machine to meet growing customer orders and reduce packaging time. Companies consider factors such as the equipment's throughput, speed, and reliability when assessing its impact on production capacity and efficiency. Capital equipment that can significantly enhance productivity is highly desirable.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <GlobeIcon size={16} /> 3. Technological Advancements
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Is there a newer, better machine that will make our work easier?</strong>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Rapid technological advancements can drive the purchase of capital equipment. Companies may replace outdated equipment with newer, more advanced models to gain a competitive edge. This involves evaluating the latest technologies and assessing their potential benefits. For example, a printing company might invest in a digital printing press that offers higher print quality, faster turnaround times, and greater flexibility compared to traditional presses. Companies consider factors such as the equipment's features, capabilities, and compatibility with existing systems when evaluating technological advancements. Staying up-to-date with technology can lead to significant improvements in productivity and quality.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <SettingsIcon size={16} /> 4. Maintenance and Operating Costs
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>How much will it cost to keep this machine running?</strong>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Maintenance and operating costs are important considerations when purchasing capital equipment. This involves evaluating the equipment's energy consumption, maintenance requirements, and potential repair costs. For example, a transportation company might consider the fuel efficiency and maintenance costs of a new truck when making a purchase decision. Companies consider factors such as the availability of spare parts, the cost of labor, and the equipment's reliability when assessing maintenance and operating costs. Equipment with low maintenance and operating costs is more desirable.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <DollarSign size={16} /> 5. Availability of Financing
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Can we afford to buy this machine, or can we get a loan?</strong>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The availability of financing can significantly influence capital equipment purchases. Companies may consider leasing options, loans, or other financing arrangements to make the purchase more affordable. For example, a small business might lease a piece of equipment rather than purchasing it outright to conserve capital. Companies consider factors such as interest rates, repayment terms, and the availability of government incentives when evaluating financing options. Favorable financing terms can make capital equipment purchases more accessible.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Shield size={16} /> 6. Regulatory and Safety Compliance
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Does this machine meet all the safety rules and regulations?</strong>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Capital equipment must comply with all relevant regulatory and safety standards. Companies must ensure that the equipment meets all applicable safety requirements and environmental regulations. For example, a construction company might ensure that a new crane meets all safety standards before putting it into operation. Companies consider factors such as safety certifications, emissions standards, and noise levels when evaluating regulatory and safety compliance. Noncompliance can lead to fines, penalties, and even legal action.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <BookOpenIcon size={16} /> 7. Supplier Reputation and Support
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Is the company selling this machine reliable and will they help us if something goes wrong?</strong>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The reputation and support offered by the supplier are crucial factors in capital equipment purchases. Companies prefer to purchase equipment from reputable suppliers who offer reliable products and excellent customer support. This involves evaluating the supplier's track record, technical expertise, and after-sales service. For example, a company might choose to purchase equipment from a supplier with a proven track record of providing high-quality products and responsive customer support. Companies consider factors such as warranty terms, technical support availability, and the supplier's financial stability when evaluating supplier reputation and support. A reliable supplier can provide peace of mind and ensure the long-term success of the investment.
                </p>
              </div>
            </div>

            {/* SECTION 6: Buying Center Composition */}
            <div
              ref={(el) => {
                sectionRefs.current['buying-center'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Buying Center Composition in Capital Equipment
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The term "buying center composition in capital equipment" refers to the group of people within an organization who are involved in making a significant purchase decision about capital equipment. This equipment, like large machinery, complex software systems, or major infrastructure components, represents a substantial investment. Understanding the roles and sizes of these buying centers is crucial for businesses that sell such equipment.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Essentially, it's about figuring out who influences and makes the final decision when a company buys big, expensive things. These aren't simple purchases; they often involve many departments and specialists.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Users size={16} /> Key Point
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>The size and composition of the buying center directly correlate with the complexity and cost of the capital equipment.</strong>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Explanation: When a company considers purchasing relatively simple and inexpensive capital equipment, the buying center tends to be smaller and involve fewer roles. For example, if a small manufacturing plant needs to replace a single piece of standard machinery, the decision might involve only the plant manager, the maintenance supervisor, and perhaps a purchasing agent. The process is relatively straightforward, and the impact on the company is limited.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  However, when dealing with complex and high-cost capital equipment, like a complete overhaul of a production line or the implementation of a new enterprise resource planning (ERP) system, the buying center expands significantly. This is because the decision has far-reaching implications for the entire organization. In such cases, you might find representatives from various departments involved, each with their own specialized knowledge and concerns. For instance, the IT department would be involved to ensure compatibility with existing systems, the finance department to assess the return on investment and manage the budget, the operations department to evaluate the equipment's impact on production efficiency, and senior management to approve the overall strategic alignment.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  The complexity of the decision also necessitates a broader range of roles. You'll likely see:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Users:</strong> Those who will directly use the equipment and have practical insights.</li>
                  <li><strong>Influencers:</strong> Technical experts or consultants who provide recommendations.</li>
                  <li><strong>Deciders:</strong> Individuals with the authority to approve the purchase, often senior managers.</li>
                  <li><strong>Buyers:</strong> Purchasing agents who handle the transaction details.</li>
                  <li><strong>Gatekeepers:</strong> Individuals who control the flow of information, such as administrative assistants or IT staff.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  The higher the cost and complexity, the more people are concerned with the purchase, and the more careful the company has to be. This leads to a larger buying center, with people from more diverse roles, who will all be involved in the final decision. This is done to help the company make the best possible purchase.
                </p>
              </div>
            </div>

            {/* SECTION 7: Steps Followed in Acquisition */}
            <div
              ref={(el) => {
                sectionRefs.current['acquisition-steps'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Steps Followed in the Acquisition of Capital Equipment
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The acquisition of capital equipment is a significant undertaking for any organization. Unlike everyday purchases, these acquisitions involve substantial investments and long-term implications for the company's operations and financial health. The process is typically structured and methodical, encompassing several distinct stages to ensure a well-informed and beneficial decision.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Essentially, it's a careful, multi-step process that companies follow when they need to buy big, expensive things that are essential to their business. It's not just about spending money; it's about making smart investments that will pay off in the long run.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <SearchIcon size={16} /> 1. Recognition of Need
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Explanation: The process begins when an organization identifies a need for new or replacement capital equipment. This recognition can stem from various factors, such as outdated equipment, increased production demands, technological advancements, or the need to improve efficiency or reduce costs. For instance, a manufacturing company might realize its current machinery is no longer meeting production targets due to wear and tear or technological obsolescence. Similarly, a hospital might need to upgrade its diagnostic imaging equipment to provide better patient care. The recognition of need is often triggered by internal assessments, performance reviews, or market analyses. This initial step is crucial because it sets the foundation for the entire acquisition process, ensuring that the purchase is aligned with the organization's strategic goals and operational requirements. It's the moment someone says "We need something new, or something better."
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Edit size={16} /> 2. Specification of Requirements
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Explanation: Once the need is established, the organization must clearly define the specific requirements of the capital equipment. This involves detailing the technical specifications, performance criteria, and any other essential features that the equipment must possess. For example, if a construction company needs a new excavator, they must specify the required digging depth, lifting capacity, engine power, and any specialized attachments. Similarly, a software company purchasing a new server system would need to define its storage capacity, processing speed, and network compatibility. This step often involves collaboration between various departments, such as engineering, operations, and IT, to ensure that all relevant requirements are considered. Detailed specifications are essential for evaluating potential suppliers and ensuring that the selected equipment meets the organization's needs. This is where the company makes a detailed list of what the new equipment must be able to do.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <GlobeIcon size={16} /> 3. Search for Potential Suppliers
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Explanation: After defining the requirements, the organization initiates a search for potential suppliers who can provide the necessary equipment. This stage involves researching manufacturers, distributors, and vendors, and gathering information about their products, services, and reputation. The search can be conducted through various channels, such as online directories, industry publications, trade shows, and referrals. The goal is to identify a pool of qualified suppliers who can meet the organization's needs and provide competitive pricing. This phase is crucial for ensuring that the organization has access to a wide range of options and can make an informed decision. This is where the company finds out who sells the equipment they need.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <ListChecks size={16} /> 4. Evaluation of Proposals
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Explanation: Once potential suppliers are identified, the organization requests proposals or quotations from them. These proposals typically include information about the equipment's specifications, pricing, delivery terms, and warranty. The organization then evaluates these proposals based on various factors, such as technical capabilities, cost-effectiveness, reliability, and supplier reputation. This evaluation may involve conducting site visits, requesting product demonstrations, and consulting with technical experts. The goal is to select the supplier that offers the best value proposition and meets the organization's specific requirements. This is where the company compares all the offers and decides which one is the best.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Target size={16} /> 5. Selection of Supplier and Negotiation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Explanation: After evaluating the proposals, the organization selects the preferred supplier and begins negotiations. This stage involves discussing pricing, delivery schedules, payment terms, and any other contractual agreements. The goal is to reach a mutually beneficial agreement that satisfies both parties' needs. Negotiations may involve multiple rounds of discussions and require careful consideration of legal and financial implications. Once an agreement is reached, a formal contract is drafted and signed. This is where the company picks a winner and talks about the details of the purchase.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <DollarSign size={16} /> 6. Purchase and Delivery
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Explanation: With the contract in place, the organization places the order and arranges for the delivery of the capital equipment. This stage involves coordinating with the supplier to ensure timely delivery and proper installation. The organization may also need to arrange for transportation, storage, and any necessary permits or licenses. Upon delivery, the equipment is inspected to ensure it meets the specified requirements and is in good working condition. This is where the company pays for the equipment and gets it delivered.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <SettingsIcon size={16} /> 7. Installation and Training
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Explanation: After delivery, the capital equipment is installed and commissioned. This stage may involve technical expertise from the supplier or internal staff. The organization may also need to provide training to employees who will be operating or maintaining the equipment. Proper installation and training are essential for ensuring that the equipment operates efficiently and safely. This is where the equipment is set up and the employees learn how to use it.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Archive size={16} /> 8. Post-Purchase Evaluation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Explanation: After the capital equipment has been in operation for a period, the organization conducts a post-purchase evaluation. This evaluation assesses the equipment's performance, reliability, and overall effectiveness. It also evaluates the supplier's performance in terms of delivery, installation, and support. The findings of this evaluation can be used to improve future acquisition processes and inform decisions about future investments. This is where the company checks to see if the equipment is working as expected and if they made a good decision.
                </p>
              </div>
            </div>

            {/* SECTION 8: Methods Used to Acquire */}
            <div
              ref={(el) => {
                sectionRefs.current['acquisition-methods'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Methods Used to Acquire Capital Equipment
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When a company needs to acquire capital equipment, they have several financing options available. These methods vary in terms of ownership, upfront costs, long-term financial implications, and flexibility. Choosing the right method is crucial for optimizing cash flow and achieving strategic goals.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Essentially, companies have different ways to pay for big, essential equipment. Each method has its own advantages and disadvantages.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <HardDriveIcon size={16} /> 1. Outright Purchase
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Explanation: This method involves paying the full cost of the equipment upfront. The company takes immediate ownership of the asset and records it on its balance sheet. This approach is ideal for companies with strong cash reserves and who want to avoid long-term debt or lease obligations. While it provides immediate ownership and avoids interest payments, it can strain a company's cash flow, especially for smaller businesses or significant equipment acquisitions. For instance, if a company has a large sum of cash, and knows that the equipment will be used for a very long time, it may make sense to simply buy it outright. This will avoid any long term interest payments.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <ClockIcon size={16} /> 2. Leasing (Operating Lease)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Explanation: An operating lease allows a company to use the equipment for a specified period in exchange for regular payments. The lessor (owner) retains ownership of the equipment, and the lessee (user) has the right to use it. At the end of the lease term, the lessee typically has the option to return the equipment, renew the lease, or purchase it at fair market value. This method requires minimal upfront investment and offers flexibility, as companies can upgrade to newer equipment at the end of the lease term. Leasing is often preferred for equipment that becomes obsolete quickly, such as computers or software. However, the total cost of leasing over time may exceed the purchase price, and the company never owns the asset. At the end of the lease, the equipment returns to the owner.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Database size={16} /> 3. Financial Lease (Capital Lease)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Explanation: A financial lease, also known as a capital lease, is similar to a loan. The lessee essentially finances the purchase of the equipment through lease payments. At the end of the lease term, the lessee typically takes ownership of the equipment for a nominal fee. This method allows companies to acquire assets without a large upfront investment and build equity over time. The asset and the lease obligation are recorded on the company's balance sheet. This kind of lease is used when the company intends to own the item at the end of the lease period.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Paperclip size={16} /> 4. Hire Purchase (Installment Purchase)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Explanation: Hire purchase involves paying for the equipment in installments over a specified period. The company gains ownership of the equipment after the final payment is made. This method combines elements of leasing and outright purchase, offering a balance between affordability and ownership. Hire purchase agreements are often used for vehicles and machinery. It's similar to a loan, but the lender retains ownership until the final payment.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Layout size={16} /> 5. Mortgage
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Explanation: A mortgage is a long-term loan secured by real estate or other significant assets. This method is typically used for acquiring buildings, land, or very large equipment purchases. The company borrows a substantial sum of money from a lender and repays it over an extended period with interest. This method allows companies to acquire expensive assets without a substantial upfront investment. However, it also involves long-term debt obligations and interest payments.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <DollarSign size={16} /> 6. Loan Financing
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Explanation: Companies can obtain a loan from a bank or financial institution to finance the purchase of capital equipment. The loan is repaid in installments over a specified period, with interest. This method allows companies to retain ownership of the equipment while spreading out the cost over time. Loan financing provides flexibility in terms of repayment terms and interest rates, depending on the lender and the company's creditworthiness. This is a very common method, and allows for the company to own the item from the start.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Shield size={16} /> 7. Government Grants and Subsidies
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Explanation: In some cases, companies may be eligible for government grants or subsidies to support the acquisition of capital equipment, particularly for investments in research and development, environmental sustainability, or regional development. These programs can significantly reduce the cost of acquiring equipment and promote investment in specific sectors. This is not available for all equipment, and is highly dependent on the type of business, and the type of equipment being purchased.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <ListChecks size={16} /> 8. Equipment Financing Agreements
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Explanation: These are specialized financing options offered by equipment manufacturers or financial institutions that focus on equipment loans. They often have customized terms and conditions tailored to the specific type of equipment and industry. This provides the ability to get very specific financing, for very specific equipment.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Capital Goods Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-orange-500 dark:text-orange-400" />
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
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Characteristics</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Purchase Factors</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Acquisition Steps</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Financing Methods</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">8</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Capital goods are essential investments for any business. Understanding their characteristics, the factors that influence purchase decisions, the acquisition process, and financing options is critical for effective procurement management. The buying center composition varies with the complexity of the purchase, and a structured approach to acquisition ensures informed decisions and long-term value.
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
          className="w-12 h-12 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-orange-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Capital Goods</strong> – durable assets used in production, including capital equipment and accessories, characterized by high cost, long lifespan, and impact on productivity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Characteristics</strong> – durability, high cost, used in production, long-term investment, depreciation, and impact on productivity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Purchase Factors</strong> – ROI, production capacity, technological advancements, maintenance costs, financing availability, regulatory compliance, and supplier reputation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Buying Center</strong> – the group of people involved in the purchase decision; its size and composition increase with the cost and complexity of the equipment.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Acquisition &amp; Financing</strong> – an 8-step process from need recognition to post-purchase evaluation; financing methods include outright purchase, leasing, hire purchase, loans, and grants.
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
            Sidemann Academic Registry • ND Purchasing &amp; Supply – Capital Goods 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;
