import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  GlobeIcon,
  ListChecks,
  SettingsIcon,
  LayersIcon,
  TrendingUp,
  Award,
  AlertCircle,
  Building2,
  FileBarChart,
  PieChart,
  LineChart,
  Activity,
  Star,
  Heart,
  UserCheck,
  MapPin,
  Map,
  Truck,
  Package,
  DollarSign,
  List,
  Monitor,
  Users2,
  Clock,
  ShoppingCart,
  Warehouse,
  Hash,
  Layout,
  Edit,
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
  { id: 'lrp', label: 'LRP' },
  { id: 'interfaces', label: 'Interfaces' },
  { id: 'stocking', label: 'Stocking Points' },
  { id: 'influence', label: 'Influence' },
  { id: 'allocation', label: 'Allocation' },
  { id: 'replenishment', label: 'Replenishment' },
  { id: 'value', label: 'Added Value' },
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
        text: 'Logistic Resources Planning (LRP) integrates all logistics activities into a cohesive system, breaking down silos between transportation, warehousing, and inventory management.',
      },
      {
        title: 'Pro Tip',
        text: 'When implementing LRP, start with a pilot program in one region to test the system before rolling it out globally. This allows you to identify and fix issues early.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember LRP\'s core components: Integration, Optimization, Forecasting, Inventory Management, Transportation, and Customer Service.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t treat LRP as a standalone system. It must interface with MRP, forecasting, and EPOS to provide accurate data and enable seamless operations.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Logistic Resources Planning (LRP) integrates all logistics activities into a cohesive system, breaking down silos between transportation, warehousing, and inventory management.',
      },
      {
        title: 'Pro Tip',
        text: 'When implementing LRP, start with a pilot program in one region to test the system before rolling it out globally. This allows you to identify and fix issues early.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember LRP\'s core components: Integration, Optimization, Forecasting, Inventory Management, Transportation, and Customer Service.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t treat LRP as a standalone system. It must interface with MRP, forecasting, and EPOS to provide accurate data and enable seamless operations.',
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
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Logistic Resources Planning{' '}
            <span className="text-rose-300 font-bold italic">
              (LRP) &amp; Distribution
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to Logistic Resources Planning, interfaces with other systems, stocking points, allocation rules, inventory replenishment, added value, and operation techniques.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Package size={14} className="inline mr-1" /> LRP
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Truck size={14} className="inline mr-1" /> Distribution
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Warehouse size={14} className="inline mr-1" /> Inventory
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
                placeholder="Search for a concept, technique, rule..."
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
            {/* SECTION 1: LRP */}
            <div
              ref={(el) => {
                sectionRefs.current['lrp'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Logistic Resources Planning (LRP)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    LRP is a system that integrates and optimizes all logistics-related activities within a company, including transportation, warehousing, inventory management, and distribution. It aims to ensure that the right resources are available at the right time and in the right place to meet customer demand while minimizing costs.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Think of LRP as a super-smart planner for all the "moving stuff" parts of a business. It is like having a brain that figures out how much stuff to have, where to keep it, how to move it, and when to move it — all to make sure customers get what they need, without wasting money.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Integration of Logistics Activities', icon: <LayersIcon size={16} />, content: 'LRP brings together all the different parts of logistics, like moving things, storing things, and keeping track of things. This means that instead of each part working by itself, they all work together. This helps the company see the big picture and make better decisions. This integration allows for better coordination, faster response times, and optimized resource utilization.' },
                  { title: '2. Resource Optimization', icon: <SettingsIcon size={16} />, content: 'LRP helps companies use their resources, like trucks, warehouses, and people, in the best way possible. It figures out how to use these resources without wasting them. This can save the company money and make things run smoother. By analysing data and using advanced algorithms, LRP can identify opportunities to reduce costs and improve efficiency.' },
                  { title: '3. Demand Forecasting and Planning', icon: <TrendingUp size={16} />, content: 'LRP helps companies guess how much stuff they will need in the future. This helps them make sure they have enough stuff to meet customer demand, without having too much stuff sitting around. LRP uses historical data, market trends, and other relevant information to predict future demand.' },
                  { title: '4. Inventory Management', icon: <ListChecks size={16} />, content: 'LRP helps companies keep track of their inventory and make sure they have the right amount of stuff. It helps them avoid having too much stuff (which costs money to store) or too little stuff (which can lead to lost sales). This involves using techniques such as safety stock calculations, economic order quantity (EOQ), and just-in-time (JIT) inventory management.' },
                  { title: '5. Transportation and Distribution Optimization', icon: <Truck size={16} />, content: 'LRP helps companies figure out the best ways to move their stuff. It helps them choose the right trucks, planes, or ships, and plan the best routes. This can save the company money on transportation costs and make deliveries faster. This involves selecting the most efficient transportation modes, planning optimal routes, and managing carrier relationships.' },
                  { title: '6. Customer Service Improvement', icon: <Star size={16} />, content: 'LRP helps companies make sure their customers are happy. It helps them deliver orders on time and in good condition. This can lead to more satisfied customers and more repeat business. By ensuring that the right products are delivered to the right place at the right time, companies can enhance customer satisfaction and build loyalty.' },
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

            {/* SECTION 2: LRP Interfaces */}
            <div
              ref={(el) => {
                sectionRefs.current['interfaces'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                How LRP Interfaces with Other Systems
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    LRP does not operate in isolation. It relies on and interacts with other systems to ensure seamless operations and accurate data flow. Think of LRP as the "boss" of moving stuff, but it needs to talk to other "departments" to do its job.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: '1. MRP & Master Schedule', icon: <FileBarChart size={16} />, content: 'MRP calculates materials needed for production based on the master schedule. It provides LRP with information on when and how much raw material is needed for production. The master schedule outlines the production plan, specifying when finished products will be manufactured. LRP collaborates with MRP and the master schedule to ensure logistics align with production plans, minimizing delays and reducing inventory holding costs.' },
                  { title: '2. Forecasting', icon: <LineChart size={16} />, content: 'Forecasting predicts future demand for products or services. It provides LRP with information on expected demand levels, allowing LRP to plan inventory levels, transportation capacity, and warehouse space accordingly. Accurate forecasts enable LRP to optimize resources, minimize stockouts, and reduce excess inventory.' },
                  { title: '3. Electronic Point of Sale (EPOS)', icon: <ShoppingCart size={16} />, content: 'EPOS systems capture sales data at the point of sale, providing real-time information on product demand. It provides LRP with up-to-date information on sales trends and customer preferences. This allows LRP to adjust inventory levels and distribution plans accordingly, ensuring products are available in the right locations at the right time.' },
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

            {/* SECTION 3: Stocking Points */}
            <div
              ref={(el) => {
                sectionRefs.current['stocking'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Deciding Stocking Points
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    This refers to determining the optimal locations for storing inventory within your supply chain. It is about figuring out where to keep your products, so they are available when needed.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Think of it like deciding where to keep your snacks in your house. You might keep some in the kitchen, some in the pantry, and maybe some in your room. You decide where to keep them based on how often you need them and how easy it is to get to them. Businesses do the same thing with their products.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Customer Location and Demand', icon: <MapPin size={16} />, content: 'Stocking points should be located close to major customer concentrations to reduce delivery times and transportation costs. Areas with high demand may require multiple stocking points or larger facilities. Placing inventory near customers minimizes delivery time and shipping expenses.' },
                  { title: '2. Transportation Costs', icon: <Truck size={16} />, content: 'Transportation costs are a significant factor. Locating stocking points near major transportation hubs (ports, airports, highways) can reduce costs. However, real estate and labour costs in these areas may be higher, requiring a careful cost-benefit analysis.' },
                  { title: '3. Product Characteristics', icon: <Package size={16} />, content: 'The nature of the products influences stocking point requirements. Perishable goods require refrigerated storage and rapid transportation. Heavy or bulky items may necessitate specialized handling equipment and storage facilities.' },
                  { title: '4. Inventory Holding Costs', icon: <DollarSign size={16} />, content: 'Inventory holding costs, including storage, insurance, and obsolescence, are a major consideration. Locating stocking points in areas with lower real estate costs can reduce these expenses. However, this may increase transportation costs and delivery times.' },
                  { title: '5. Supplier Location', icon: <Building2 size={16} />, content: 'Stocking points should be located strategically in relation to suppliers to minimize inbound transportation costs and lead times. Proximity to suppliers can also improve communication and collaboration, enhancing overall supply chain efficiency.' },
                  { title: '6. Infrastructure and Facilities', icon: <Warehouse size={16} />, content: 'The availability of adequate infrastructure, such as roads, railways, ports, and utilities, is essential for efficient stocking point operations. The suitability and capacity of existing warehouse facilities must also be considered.' },
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

            {/* SECTION 4: Influence on Logistics */}
            <div
              ref={(el) => {
                sectionRefs.current['influence'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors Influencing Logistics and Distribution
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These factors significantly impact how goods are moved, stored, and delivered. Think about running a lemonade stand: you need to consider supply and demand, service levels, volumetrics, volatility, and infrastructure.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Supply and Demand Parameters', icon: <GlobeIcon size={16} />, content: 'Supply refers to the availability of goods (production capacity, supplier reliability, lead times). Demand refers to customer needs (preferences, market trends, seasonality). Balancing supply and demand is crucial for optimizing inventory levels, transportation schedules, and warehouse capacity.' },
                  { title: '2. Service Levels', icon: <Award size={16} />, content: 'Service levels define the quality of logistics services provided to customers, including delivery speed, order accuracy, and customer responsiveness. High service levels require efficient logistics operations that can meet customer expectations for timely and accurate deliveries.' },
                  { title: '3. Volumetrics', icon: <Package size={16} />, content: 'Volumetrics refers to the volume and size of goods being handled. Product dimensions, weight, and packaging influence volumetrics. High volumetrics require specialized handling equipment and optimized warehouse layouts to maximize space utilization.' },
                  { title: '4. Volatility', icon: <AlertCircle size={16} />, content: 'Volatility is the degree of fluctuation or unpredictability in supply and demand. Market fluctuations, seasonal variations, and unexpected events (natural disasters, economic downturns) require flexible and adaptable logistics operations with contingency plans.' },
                  { title: '5. Infrastructure', icon: <Building2 size={16} />, content: 'Infrastructure includes transportation networks (roads, railways, ports), warehouse facilities, and communication systems. Adequate infrastructure is essential for efficient logistics and can significantly impact delivery times, transportation costs, and overall supply chain performance.' },
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

            {/* SECTION 5: Allocation Rules */}
            <div
              ref={(el) => {
                sectionRefs.current['allocation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Allocation Rules for Goods in Short Supply
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These rules determine how limited goods are distributed among customers or internal departments. Imagine there are only a few toys left, and many kids want them — you need a fair way to decide who gets them.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. First-Come, First-Served (FCFS)', icon: <Clock size={16} />, content: 'Orders are fulfilled in the order they are received. This is simple and transparent but can lead to dissatisfaction if some customers miss out. It can also create a rush of orders, potentially overwhelming the system.' },
                  { title: '2. Priority Customers', icon: <Star size={16} />, content: 'Goods are allocated to key customers or those with long-term contracts. This maintains relationships with important clients but can alienate smaller customers. Clear communication and transparency are essential when using this strategy.' },
                  { title: '3. Proportional Allocation', icon: <PieChart size={16} />, content: 'Goods are allocated based on historical order volumes or customer size. This ensures a fair distribution but may not address urgent needs. It prevents any single customer from dominating the limited supply.' },
                  { title: '4. Allocation by Need', icon: <Heart size={16} />, content: 'Goods are allocated based on the urgency or criticality of the need. This is used for essential goods or in emergency situations. Requires careful evaluation and transparent decision-making.' },
                  { title: '5. Random Allocation', icon: <Hash size={16} />, content: 'Goods are allocated randomly through a lottery or drawing. This is perceived as fair but can be unpredictable and may not satisfy urgent needs. Ensures everyone has an equal chance.' },
                  { title: '6. Combination of Methods', icon: <LayersIcon size={16} />, content: 'Using a combination of allocation rules to address different customer needs and priorities. This provides flexibility but requires careful planning, clear communication, and transparent decision-making processes to ensure fairness.' },
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

            {/* SECTION 6: Replenishment */}
            <div
              ref={(el) => {
                sectionRefs.current['replenishment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Replenishing Local Inventories and Satisfying Orders
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These are the core functions of logistics, ensuring goods are available where and when they are needed. Imagine running a small store — you need to replenish local inventories (stocking up) and satisfy end customers' orders (selling).
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Package size={16} /> 1. Replenishing Local Inventories
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Definition:</strong> The process of restocking local warehouses or retail locations with goods to ensure continuous availability.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Rules:</strong> Fixed Order Quantity (ordering the same amount each time), Fixed Order Period (ordering at regular intervals), Just-in-Time (JIT) (ordering only when needed), Safety Stock (maintaining extra inventory for demand fluctuations).
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Modes & Infrastructure:</strong> Trucks (frequent, smaller deliveries), Rail (large volumes over long distances), Local Warehouses (storing inventory close to demand), Distribution Centres (consolidating shipments).
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <ShoppingCart size={16} /> 2. Satisfying End Customers' Orders
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Definition:</strong> Fulfilling customer orders promptly and accurately, ensuring a positive customer experience.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Rules:</strong> Order Fulfilment Policies (processing times, shipping methods), Customer Service Standards (prompt interactions), Delivery Time Windows (specific delivery frames), Order Tracking (real-time updates).
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Modes & Infrastructure:</strong> Delivery Vans (last-mile deliveries), Courier Services (fast, reliable small packages), Click-and-Collect (pick up from local stores), E-commerce Platforms (online ordering).
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 7: Added Value */}
            <div
              ref={(el) => {
                sectionRefs.current['value'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Added Value in Logistics
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Added value refers to the enhancements or benefits that make a product or service more desirable to customers. Think of it like adding extra toppings to a pizza — it makes the pizza more special and worth more.
                  </p>
</div>

              <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4">5 Importance of Differentiation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Brand Recognition', icon: <Award size={16} />, content: 'Unique features or designs help a product stand out, building a strong brand identity. In a crowded market, differentiation is key to brand recognition. This attracts new customers and fosters brand loyalty, commanding premium pricing.' },
                  { title: '2. Customer Loyalty', icon: <Heart size={16} />, content: 'Offering features that meet specific customer needs builds loyalty and repeat business. When a brand consistently delivers products that exceed expectations, it cultivates a loyal following. Loyal customers are more likely to make repeat purchases and recommend the brand.' },
                  { title: '3. Premium Pricing', icon: <DollarSign size={16} />, content: 'Differentiated products can justify higher prices, increasing profit margins. By offering unique features or superior performance, companies can command premium price points compared to competitors, increasing overall profitability.' },
                  { title: '4. Competitive Advantage', icon: <Target size={16} />, content: 'Unique features or capabilities provide a competitive edge in the market. Offering innovations like longer battery life, faster processing, or unique software solutions sets a brand apart, attracting customers and capturing market share.' },
                  { title: '5. Meeting Specific Needs', icon: <UserCheck size={16} />, content: 'Tailoring products to specific user groups (e.g., gamers, professionals) increases customer satisfaction. Different user groups have different needs — gaming laptops focus on graphics and cooling, business laptops on security and portability.' },
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

              <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4">5 Factors Affecting Place and Time Added Value Operation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Logistics Network', icon: <Map size={16} />, content: 'The efficiency of the distribution network affects how quickly and reliably products reach customers. Well-designed networks with efficient transportation, warehousing, and inventory management minimize delays.' },
                  { title: '2. Demand Forecasting', icon: <LineChart size={16} />, content: 'Accurate forecasting ensures products are available when and where customers need them. Analysing historical sales data, market trends, and seasonal variations minimizes stockouts and reduces excess inventory.' },
                  { title: '3. Inventory Management', icon: <ListChecks size={16} />, content: 'Efficient inventory management balances availability with storage costs. Optimizing inventory levels ensures products are available when needed without incurring excessive holding costs through strategies like JIT and safety stock.' },
                  { title: '4. Transportation Infrastructure', icon: <Truck size={16} />, content: 'The quality of roads, ports, and other infrastructure affects delivery speed and reliability. Well-maintained infrastructure facilitates efficient transportation and reduces transit times.' },
                  { title: '5. Information Technology (IT)', icon: <Monitor size={16} />, content: 'IT systems enable real-time tracking, communication, and coordination, improving efficiency. ERP, WMS, and TMS systems provide visibility into supply chain operations, tracking inventory, monitoring deliveries, and communicating with stakeholders.' },
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

              <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4">Operation Techniques for Managing Features and Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Modular Design', icon: <Layout size={16} />, content: 'Designing products with interchangeable components allows for flexible customization. Modular design simplifies manufacturing and assembly, reducing lead times and improving responsiveness. It also allows for easier upgrades and repairs.' },
                  { title: '2. Configure-to-Order (CTO)', icon: <Edit size={16} />, content: 'Allowing customers to customize products online or through sales channels. CTO enhances customer satisfaction by providing personalized products and reduces the need for large inventories of finished goods.' },
                  { title: '3. Feature Bundling', icon: <Package size={16} />, content: 'Offering pre-configured packages of features at discounted prices. This simplifies the purchasing process, increases sales volume, and promotes the adoption of new features and technologies.' },
                  { title: '4. Software-Based Options', icon: <SettingsIcon size={16} />, content: 'Enabling or disabling features through software updates or licenses. This provides flexibility, reduces physical product variations, and enhances product lifecycle management and customer satisfaction.' },
                  { title: '5. Real-Time Inventory and Production Data', icon: <Activity size={16} />, content: 'Using real-time data to manage inventory and production, ensuring availability of options. Real-time data enables quick response to demand changes, minimizes stockouts, and supports efficient production planning and scheduling.' },
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
                  💡 LRP Insight
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
                  <span>LRP Components</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Allocation Rules</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Interface Systems</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Logistic Resources Planning (LRP) integrates all logistics activities to optimize resource use and meet customer demand. It interfaces with MRP, forecasting, and EPOS systems. Stocking points should balance customer proximity, transportation costs, product characteristics, and infrastructure. Allocation rules must be fair and strategic. Effective replenishment and added value operations enhance customer satisfaction and competitive advantage.
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
                <strong className="text-white">LRP</strong> – integrates and optimizes all logistics activities (transportation, warehousing, inventory, distribution) to ensure the right resources are available at the right time and place.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">LRP Interfaces</strong> – collaborates with MRP, forecasting, and EPOS systems to ensure seamless operations and accurate data flow.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Stocking Points</strong> – determined by customer location, transportation costs, product characteristics, holding costs, supplier location, and infrastructure.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Allocation Rules</strong> – include FCFS, priority customers, proportional allocation, allocation by need, random allocation, and hybrid approaches for goods in short supply.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Added Value</strong> – differentiation through brand recognition, customer loyalty, premium pricing, competitive advantage, and meeting specific needs enhances product value.
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
            Sidemann Academic Registry • Logistics & Supply Chain Management 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;
