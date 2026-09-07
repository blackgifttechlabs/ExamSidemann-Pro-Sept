import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  GlobeIcon,
  Shield,
  ListChecks,
  SettingsIcon,
  Archive,
  Users,
  MessageSquare,
  Leaf,
  Cpu,
  CheckCircle,
  DollarSign,
  Truck,
  Warehouse,
  Hash,
  Clock as ClockIcon,
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
  { id: 'logistics', label: 'Logistics Management' },
  { id: 'principles', label: 'Principles' },
  { id: 'impact', label: 'Impact' },
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
        text: 'The term "logistics" comes from the Greek word "logistikos", meaning "skilled in calculating". It has evolved from a military concept to a critical business function.',
      },
      {
        title: 'Pro Tip',
        text: 'Use the "6 Rs" (Right Product, Quantity, Condition, Place, Time, Cost) as a checklist to evaluate your logistics performance. Missing any one can lead to customer dissatisfaction.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three core activities: Planning (strategy), Implementation (execution), and Control (monitoring). Together they form the "PIC" of logistics management.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t focus only on cost reduction. Logistics must balance cost, speed, and reliability. Cutting costs too much can harm service levels and customer satisfaction.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The term "logistics" comes from the Greek word "logistikos", meaning "skilled in calculating". It has evolved from a military concept to a critical business function.',
      },
      {
        title: 'Pro Tip',
        text: 'Use the "6 Rs" (Right Product, Quantity, Condition, Place, Time, Cost) as a checklist to evaluate your logistics performance. Missing any one can lead to customer dissatisfaction.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three core activities: Planning (strategy), Implementation (execution), and Control (monitoring). Together they form the "PIC" of logistics management.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t focus only on cost reduction. Logistics must balance cost, speed, and reliability. Cutting costs too much can harm service levels and customer satisfaction.',
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

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Logistics &{' '}
            <span className="text-emerald-300 font-bold italic">
              Distribution Management
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to logistics and distribution management, principles, and the impact on today's business environment.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Truck size={14} className="inline mr-1" /> Logistics
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Warehouse size={14} className="inline mr-1" /> Distribution
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <GlobeIcon size={14} className="inline mr-1" /> Supply Chain
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
                placeholder="Search for a concept, principle, impact..."
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
                Introduction to Logistics and Distribution Management
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Logistics and distribution management is the process of planning, implementing, and controlling the efficient, effective flow and storage of goods, services, and related information from the point of origin to the point of consumption to meet customers' requirements.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Think of it like this: Logistics and distribution management is all about getting the right stuff to the right place at the right time. It is about making sure products move smoothly from where they are made to where they are needed, whether that is a store, a customer's house, or another business. It involves everything from storing goods in warehouses to planning delivery routes.
                  </p>
</div>
            </div>

            {/* SECTION 2: Logistics Management (the 7 points) */}
            <div
              ref={(el) => {
                sectionRefs.current['logistics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Logistics and Distribution Management
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Planning the Flow of Goods (Strategic Planning)', icon: <Target size={16} />, content: 'This is the foundation of effective logistics. It involves predicting demand, deciding where to store goods, and figuring out the best ways to move them. Planning is not just about today; it is about anticipating future needs and challenges. Companies need to analyse market trends, customer preferences, and potential disruptions to create flexible and responsive supply chains. This includes determining the optimal number and location of warehouses, deciding on transportation modes (trucks, ships, planes), and establishing clear communication channels between all parties involved. A well-designed plan minimizes costs, reduces delays, and ensures that products are available when and where customers want them. This planning stage is critical for maintaining a competitive edge in today\'s fast-paced market.' },
                  { title: '2. Implementing the Plan (Operational Execution)', icon: <SettingsIcon size={16} />, content: 'Once the plan is in place, it needs to be put into action. This involves managing transportation, warehousing, and inventory. It is about making sure everything runs smoothly on a daily basis. Implementation is where the rubber meets the road. This phase involves coordinating with carriers, managing warehouse operations, and ensuring that orders are processed accurately and efficiently. This requires a high level of organization and attention to detail. Companies need to track shipments, manage inventory levels, and resolve any issues that arise promptly. This also includes using technology like tracking software, warehouse management systems (WMS), and transportation management systems (TMS) to monitor and optimize operations. Successful implementation ensures that goods move seamlessly through the supply chain, meeting customer expectations and minimizing disruptions.' },
                  { title: '3. Controlling the Process (Monitoring and Adjustment)', icon: <ListChecks size={16} />, content: 'It is not enough to just plan and implement; you also need to keep an eye on things and make adjustments as needed. This means tracking performance, identifying problems, and finding ways to improve efficiency. Control is about ensuring that the logistics and distribution system is working as intended. This involves monitoring key performance indicators (KPIs), such as delivery times, inventory turnover, and transportation costs. Companies need to analyse data, identify trends, and take corrective action when necessary. This also includes conducting regular audits, reviewing processes, and seeking feedback from customers and employees. Continuous improvement is essential for staying competitive and adapting to changing market conditions. By controlling the process, companies can identify inefficiencies, reduce waste, and improve overall performance.' },
                  { title: '4. Efficient Flow of Goods (Streamlining Operations)', icon: <Truck size={16} />, content: 'This means moving products quickly and efficiently, minimizing delays and costs. It is about optimizing routes, reducing handling, and using technology to speed things up. Efficiency is paramount in logistics. This involves streamlining processes, optimizing routes, and minimizing handling. Companies need to use technology, such as GPS tracking, automated warehouse systems, and real-time data analytics, to improve efficiency. This also includes implementing lean principles, such as reducing waste and eliminating unnecessary steps. By focusing on efficiency, companies can reduce costs, improve delivery times, and enhance customer satisfaction.' },
                  { title: '5. Effective Storage of Goods (Warehouse Management)', icon: <Warehouse size={16} />, content: 'Proper storage is essential for protecting products and ensuring they are available when needed. This involves managing warehouses, organizing inventory, and using technology to track stock levels. Effective storage is crucial for maintaining product quality and availability. This involves managing warehouse operations, organizing inventory, and using technology to track stock levels. Companies need to ensure that their warehouses are clean, safe, and well-organized. This also includes implementing inventory management systems, such as barcoding and RFID, to improve accuracy and efficiency. Proper storage minimizes damage, reduces waste, and ensures that products are readily available when needed.' },
                  { title: '6. Meeting Customer Requirements (Customer Satisfaction)', icon: <Users size={16} />, content: 'The goal of logistics and distribution management is to satisfy customers. This means delivering the right products, in the right quantity, at the right time, and in the right condition. Customer satisfaction is the driving force behind logistics. Companies need to understand customer expectations, anticipate their needs, and provide exceptional service. This involves delivering orders on time, providing accurate information, and handling returns and complaints efficiently. This also includes using customer feedback to improve processes and enhance service quality. By focusing on customer satisfaction, companies can build loyalty, increase sales, and strengthen their brand reputation.' },
                  { title: '7. Information Flow (Communication and Technology)', icon: <MessageSquare size={16} />, content: 'Logistics and distribution management relies heavily on the flow of information. This includes sharing data between suppliers, manufacturers, distributors, and customers. It is about using technology to track shipments, manage inventory, and communicate effectively. Information flow is the lifeblood of logistics. This involves sharing data between all parties involved in the supply chain. Companies need to use technology, such as electronic data interchange (EDI), cloud-based platforms, and mobile apps, to facilitate communication and collaboration. This also includes implementing data analytics to gain insights into performance and identify areas for improvement. Effective information flow ensures that everyone is on the same page, minimizing errors and delays.' },
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

            {/* SECTION 3: Principles of Logistics (7 Rs) */}
            <div
              ref={(el) => {
                sectionRefs.current['principles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Principles of Logistics and Distribution Management
              </h2>

              <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <div>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These are the fundamental guidelines that help businesses manage the flow of goods and information efficiently. They focus on delivering the right product, in the right quantity, in the right condition, at the right place, at the right time, and at the right cost. Think of it as the "6 Rs" (or sometimes "7 Rs") of getting things where they need to go:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-slate-700 dark:text-slate-300 mt-2">
                    <li><strong>Right Product:</strong> Getting the correct item.</li>
                    <li><strong>Right Quantity:</strong> Getting the correct amount.</li>
                    <li><strong>Right Condition:</strong> Getting the item in good shape.</li>
                    <li><strong>Right Place:</strong> Getting it to the correct location.</li>
                    <li><strong>Right Time:</strong> Getting it there when it is needed.</li>
                    <li><strong>Right Cost:</strong> Doing it efficiently without wasting money.</li>
                    <li><strong>(Sometimes added) Right Customer:</strong> Ensuring the right person receives the product.</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Right Product (Accuracy and Quality)', icon: <CheckCircle size={16} />, content: 'This principle emphasizes the importance of delivering the exact product that the customer ordered. It is not just about sending something; it is about sending the correct item. This requires meticulous attention to detail throughout the order fulfilment process, from order entry to picking and packing. Accurate product identification, using barcodes, RFID, or other tracking systems, is crucial. Moreover, the "right product" also implies maintaining quality. Products must be handled and stored properly to prevent damage or deterioration. This includes temperature control, humidity regulation, and careful packaging. If a company sends the wrong product, it leads to returns, customer dissatisfaction, and increased costs. Therefore, implementing quality control measures and ensuring accurate order fulfilment is essential for successful logistics.' },
                  { title: '2. Right Quantity (Inventory Management)', icon: <Hash size={16} />, content: 'This principle focuses on delivering the precise amount of product that the customer requested. Too much or too little can lead to problems. Overstocking ties up capital and increases storage costs, while understocking can result in lost sales and dissatisfied customers. Effective inventory management is key to achieving the "right quantity." This involves accurate demand forecasting, efficient stock control systems, and timely replenishment. Companies need to balance the costs of holding inventory with the risks of stockouts. This also includes implementing inventory optimization techniques, such as economic order quantity (EOQ) and safety stock calculations. The goal is to ensure that the right quantity of product is available when needed, without incurring excessive costs.' },
                  { title: '3. Right Condition (Preservation and Handling)', icon: <Shield size={16} />, content: 'This principle ensures that the product arrives in perfect condition, free from damage or defects. This requires careful handling during transportation and storage. Products must be packaged appropriately to protect them from physical damage, temperature fluctuations, and other environmental factors. For perishable goods, maintaining the right temperature and humidity is crucial. This also involves implementing quality control checks throughout the supply chain to identify and address any potential issues. Proper handling and storage not only prevent damage but also enhance customer satisfaction. Delivering products in the right condition builds trust and reinforces the company\'s reputation for quality.' },
                  { title: '4. Right Place (Location and Accessibility)', icon: <GlobeIcon size={16} />, content: 'This principle focuses on delivering the product to the correct location, whether it is a customer\'s home, a retail store, or a distribution centre. This requires efficient route planning, accurate address verification, and reliable delivery systems. Companies need to optimize their distribution network to ensure that products are delivered to the right place at the right time. This includes selecting the most efficient transportation modes and establishing strategically located warehouses. Using GPS tracking and delivery management software can help ensure accurate and timely deliveries. Delivering to the right place also means considering accessibility and convenience for the customer.' },
                  { title: '5. Right Time (Timeliness and Reliability)', icon: <ClockIcon size={16} />, content: 'This principle emphasizes the importance of delivering the product at the agreed-upon time. Late deliveries can lead to customer dissatisfaction, lost sales, and increased costs. To achieve the "right time," companies need to have reliable delivery schedules, efficient transportation systems, and effective communication with customers. This involves using real-time tracking systems, providing accurate delivery estimates, and proactively addressing any potential delays. Companies should also have contingency plans in place to handle unexpected disruptions. Timely and reliable deliveries are crucial for building customer loyalty and maintaining a competitive edge.' },
                  { title: '6. Right Cost (Efficiency and Optimization)', icon: <DollarSign size={16} />, content: 'This principle focuses on minimizing the total cost of logistics and distribution, while still meeting customer requirements. This involves optimizing transportation routes, reducing inventory holding costs, and streamlining warehouse operations. Companies need to analyse their logistics costs and identify areas for improvement. This includes negotiating favourable rates with carriers, implementing energy efficient practices, and reducing waste. Using data analytics and cost benefit analysis can help identify cost-saving opportunities. The goal is to provide efficient and cost-effective logistics services without compromising quality or customer satisfaction.' },
                  { title: '7. Right Customer (Personalization and Customer Focus)', icon: <Users size={16} />, content: 'This principle emphasizes the importance of ensuring that the product is delivered to the intended recipient. In the modern age, this also can mean personalization of the experience. Accurate customer data management, secure delivery protocols, and clear communication are essential. This also involves understanding the customer\'s needs and providing personalized services. This can be things like delivery notifications, or customized packing slips. The focus is to make sure the customer is happy with the entire process.' },
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

            {/* SECTION 4: Impact of Logistics */}
            <div
              ref={(el) => {
                sectionRefs.current['impact'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Impact of Logistics and Distribution in Today's Business
              </h2>

              <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <div>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Logistics and distribution are no longer just back-office functions; they are strategic drivers of success. In today's fast-paced, globalized economy, efficient logistics and distribution can make or break a business.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Basically, how a company gets its products to customers is super important now. It is not just about moving boxes. Good logistics helps a company:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-slate-700 dark:text-slate-300 mt-2">
                    <li>Keep customers happy by delivering on time.</li>
                    <li>Save money by being efficient.</li>
                    <li>Compete globally by reaching more markets.</li>
                    <li>Stay flexible when things change.</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Enhanced Customer Satisfaction (Meeting Evolving Expectations)', icon: <Users size={16} />, content: 'In today\'s customer-centric world, logistics and distribution play a pivotal role in shaping customer experiences. Customers expect fast, reliable, and transparent delivery services. Companies that excel in logistics can meet these expectations, fostering customer loyalty and repeat business. This means not only delivering products on time but also providing accurate tracking information, flexible delivery options, and seamless return processes. The rise of e-commerce has further amplified these expectations, with customers demanding same-day or next-day delivery. Companies that invest in robust logistics infrastructure and technology can gain a significant competitive advantage by exceeding customer expectations and building strong relationships.' },
                  { title: '2. Cost Optimization (Streamlining Operations and Reducing Waste)', icon: <DollarSign size={16} />, content: 'Efficient logistics and distribution can significantly reduce operating costs. By optimizing transportation routes, consolidating shipments, and minimizing inventory holding costs, companies can improve their bottom line. This involves implementing lean principles, such as reducing waste and eliminating unnecessary steps, throughout the supply chain. Technology plays a crucial role in cost optimization, enabling companies to track shipments, manage inventory levels, and analyse data to identify areas for improvement. Effective logistics also helps reduce the risk of product damage or loss, minimizing costly returns and replacements. By focusing on cost optimization, companies can enhance their profitability and remain competitive in price-sensitive markets.' },
                  { title: '3. Global Market Access (Expanding Reach and Opportunities)', icon: <GlobeIcon size={16} />, content: 'In an increasingly interconnected world, logistics and distribution are essential for businesses seeking to expand their reach and tap into new markets. Efficient logistics networks enable companies to overcome geographical barriers and deliver products to customers across the globe. This involves navigating complex customs regulations, managing international shipments, and establishing strategic partnerships with logistics providers. Companies that invest in robust global logistics capabilities can gain access to a wider customer base, increase their sales, and diversify their revenue streams. This also opens opportunities for sourcing raw materials and components from different parts of the world, optimizing costs and enhancing supply chain resilience.' },
                  { title: '4. Supply Chain Resilience (Adapting to Disruptions and Uncertainty)', icon: <Shield size={16} />, content: 'Today\'s business environment is characterized by volatility and uncertainty. Supply chains are vulnerable to disruptions such as natural disasters, political instability, and economic downturns. Robust logistics and distribution systems can help companies build resilience and mitigate the impact of these disruptions. This involves diversifying transportation routes, establishing backup suppliers, and implementing flexible inventory management strategies. Technology plays a crucial role in enhancing supply chain resilience, enabling companies to track shipments in real time, monitor inventory levels, and communicate effectively with suppliers and customers. Companies that prioritize supply chain resilience can minimize disruptions, maintain business continuity, and protect their brand reputation.' },
                  { title: '5. Inventory Management (Balancing Stock Levels and Demand)', icon: <Archive size={16} />, content: 'Effective inventory management is a critical component of logistics and distribution. Companies must strike a balance between holding sufficient inventory to meet customer demand and minimizing the costs associated with storage and obsolescence. This involves accurate demand forecasting, efficient stock control systems, and timely replenishment. Technology plays a vital role in inventory management, enabling companies to track inventory levels, automate replenishment processes, and optimize stock levels. Companies that excel in inventory management can reduce stockouts, minimize excess inventory, and improve their cash flow.' },
                  { title: '6. Technological Integration (Leveraging Data and Automation)', icon: <Cpu size={16} />, content: 'Technology is transforming logistics and distribution, enabling companies to automate processes, improve efficiency, and gain valuable insights from data. This includes the use of GPS tracking, warehouse management systems (WMS), transportation management systems (TMS), and data analytics. Companies that embrace technology can optimize their logistics operations, reduce costs, and enhance customer satisfaction. This also involves exploring emerging technologies, such as artificial intelligence (AI), blockchain, and the Internet of Things (IoT), to further improve logistics capabilities.' },
                  { title: '7. Sustainability (Reducing Environmental Impact)', icon: <Leaf size={16} />, content: 'Increasingly, businesses are recognizing the importance of sustainability in their logistics operations. This involves reducing carbon emissions, minimizing waste, and implementing eco-friendly practices. Companies can achieve this by optimizing transportation routes, using alternative fuels, and implementing sustainable packaging solutions. Consumers are increasingly demanding environmentally responsible products and services, making sustainability a key differentiator for businesses. Companies that prioritize sustainability in their logistics operations can enhance their brand reputation, attract environmentally conscious customers, and contribute to a more sustainable future.' },
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
                  💡 Logistics Insight
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
                  <span>Logistics Activities</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Principles (Rs)</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Impact Areas</span>
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
                Logistics and distribution management is about getting the right product to the right place, at the right time, in the right condition, in the right quantity, and at the right cost. It's a strategic function that drives customer satisfaction, cost efficiency, and global competitiveness. Mastering logistics principles and understanding its impact is essential for any business.
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
                <strong className="text-white">Logistics Management</strong> – involves planning, implementing, and controlling the flow of goods, services, and information from origin to consumption.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Core Activities</strong> – planning the flow, implementing operations, controlling processes, ensuring efficiency, effective storage, meeting customer requirements, and managing information flow.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Principles (7 Rs)</strong> – deliver the Right Product, Right Quantity, Right Condition, Right Place, Right Time, Right Cost, and Right Customer.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Impact</strong> – enhances customer satisfaction, optimizes costs, enables global market access, builds supply chain resilience, improves inventory management, leverages technology, and promotes sustainability.
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
            Sidemann Academic Registry • Logistics & Distribution Management 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;
