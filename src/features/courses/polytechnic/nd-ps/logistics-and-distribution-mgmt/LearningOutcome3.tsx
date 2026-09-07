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
  Scissors,
  Archive,
  Database,
  DollarSign,
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
  File,
  Clipboard,
  BookMarked,
  Link,
  CreditCard,
  Receipt,
  Package,
  Handshake,
  Building,
  Ship,
  Lock,
  Scale,
  Gavel,
  FileCheck,
  CheckCircle,
  XCircle,
  PenTool,
  Award,
  AlertCircle,
  FileSignature,
  Timer,
  RefreshCw,
  Star,
  Clock,
  Home,
  Landmark,
  Key,
  BadgeCheck,
  Truck,
  Warehouse,
  Globe,
  RefreshCcw,
  TrendingDown,
  MapPin,
  Box,
  Route,
  TruckIcon,
  Loader,
  Navigation,
  ClipboardCheck,
  ReceiptText,
  Radio,
  Barcode,
  Scan,
  Cpu as CpuIcon,
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
  { id: 'factors', label: 'Factors' },
  { id: 'structures', label: 'Structures' },
  { id: 'operational', label: 'Operational' },
  { id: 'tools', label: 'Tools' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome3: React.FC = () => {
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
        text: 'The location of a warehouse can account for up to 30% of total logistics costs. Strategic placement near customers and suppliers is critical for profitability.',
      },
      {
        title: 'Pro Tip',
        text: 'When designing a distribution network, use a weighted scoring model that considers customer proximity, transportation costs, labour availability, and real estate costs.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 6 operational logistics activities: Route Planning, Load Planning, Vehicle Tracking, Booking of Deliveries, Proof of Delivery, and Post-Delivery Invoicing.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t overlook the importance of Proof of Delivery (POD). Without it, you risk disputes, delayed payments, and customer dissatisfaction.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The location of a warehouse can account for up to 30% of total logistics costs. Strategic placement near customers and suppliers is critical for profitability.',
      },
      {
        title: 'Pro Tip',
        text: 'When designing a distribution network, use a weighted scoring model that considers customer proximity, transportation costs, labour availability, and real estate costs.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 6 operational logistics activities: Route Planning, Load Planning, Vehicle Tracking, Booking of Deliveries, Proof of Delivery, and Post-Delivery Invoicing.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t overlook the importance of Proof of Delivery (POD). Without it, you risk disputes, delayed payments, and customer dissatisfaction.',
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Distribution of Supplies &{' '}
            <span className="text-purple-300 font-bold italic">
              Operational Logistics
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to distribution of supplies, factors affecting network choice, regional structures, operational logistics, and logistics tools.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Truck size={14} className="inline mr-1" /> Distribution
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Warehouse size={14} className="inline mr-1" /> Warehousing
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Route size={14} className="inline mr-1" /> Route Planning
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
                placeholder="Search for a concept, factor, tool..."
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
            {/* SECTION 1: Distribution of Supplies */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Distribution of Supplies
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    This is the process of getting supplies from where they are made or stored to where they are needed. It is about making sure the right things are in the right place at the right time.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Think of it like getting groceries from the store to your house. You need to figure out how to get them there, where to keep them until you need them, and how to make sure you have enough.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <ListChecks size={16} /> Functions
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Inventory Management:</strong> Keeping track of how much supply is available.</li>
                    <li><strong>Warehousing:</strong> Storing supplies until they are needed.</li>
                    <li><strong>Transportation:</strong> Moving supplies from one place to another.</li>
                    <li><strong>Order Fulfilment:</strong> Getting supplies to customers or other locations when they are ordered.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Target size={16} /> Objectives
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Efficiency:</strong> Minimizing the cost of moving and storing supplies.</li>
                    <li><strong>Reliability:</strong> Ensuring supplies are available when needed.</li>
                    <li><strong>Responsiveness:</strong> Quickly responding to changes in demand.</li>
                    <li><strong>Customer Satisfaction:</strong> Getting supplies to customers on time and in good condition.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <BookOpen size={16} /> Detailed Explanation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The distribution of supplies is the lifeblood of any business that deals with physical goods. It is not just about moving boxes; it is about creating a smooth, efficient flow of materials from suppliers to customers. Effective distribution involves careful planning and coordination of inventory management, warehousing, transportation, and order fulfilment. The goal is to minimize costs while maximizing customer satisfaction. This means keeping track of inventory levels, storing supplies in strategic locations, choosing the most efficient transportation methods, and processing orders quickly and accurately. Modern distribution systems use technology to automate processes, track shipments, and optimize routes, ensuring that supplies are delivered on time and in good condition.
                </p>
              </div>
            </div>

            {/* SECTION 2: Factors Affecting Choice */}
            <div
              ref={(el) => {
                sectionRefs.current['factors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors Affecting Choice of Distribution Network and Warehouse Location
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These are the things you need to think about when deciding how to move supplies and where to store them. It is like deciding where to build a new store. You need to think about customers, costs, speed, products, and suppliers.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Customer Location and Demand', icon: <MapPin size={16} />, content: 'Warehouses should be located close to customers to reduce delivery times and transportation costs. Areas with high demand may require more warehouses or larger facilities.' },
                  { title: 'Transportation Costs', icon: <DollarSign size={16} />, content: 'Transportation costs can be a significant part of distribution expenses. Factors like distance, fuel prices, and transportation mode influence these costs.' },
                  { title: 'Product Characteristics', icon: <Box size={16} />, content: 'Perishable goods require refrigerated warehouses and fast transportation. Heavy or bulky items may require specialized handling and storage.' },
                  { title: 'Supplier Location', icon: <Truck size={16} />, content: 'Warehouses should be located near suppliers to reduce inbound transportation costs. Proximity to suppliers can also improve communication and collaboration.' },
                  { title: 'Infrastructure', icon: <GlobeIcon size={16} />, content: 'Access to roads, railways, ports, and airports is essential for efficient transportation. Availability of utilities and communication networks is also important.' },
                  { title: 'Labour Availability and Costs', icon: <Users size={16} />, content: 'Warehouses require a skilled workforce for tasks like picking, packing, and shipping. Labour costs vary significantly by location.' },
                  { title: 'Real Estate Costs', icon: <DollarSign size={16} />, content: 'The cost of land and buildings can vary significantly by location. Rental rates and property taxes are also important considerations.' },
                  { title: 'Regulatory Environment', icon: <Shield size={16} />, content: 'Local regulations related to zoning, environmental protection, and labour laws can impact warehouse operations. Tax incentives and other government programs may also influence location decisions.' },
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

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Target size={16} /> Detailed Explanation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Selecting the optimal distribution network and warehouse location is a complex decision that involves balancing numerous factors. Customer location and demand are paramount, as proximity to customers reduces delivery times and transportation costs. Transportation costs, influenced by distance and mode, are a significant expense, demanding careful analysis. Product characteristics dictate storage and handling requirements, with perishable goods needing refrigerated facilities and bulky items needing specialized equipment. Supplier location impacts inbound transportation costs and fosters collaboration. Infrastructure, including roads, railways, and utilities, is vital for efficient operations. Labour availability and costs, real estate expenses, and the regulatory environment all play crucial roles. Ultimately, the goal is to create a distribution network that minimizes costs, maximizes service levels, and supports the company's overall strategic objectives.
                </p>
              </div>
            </div>

            {/* SECTION 3: Regional Structures */}
            <div
              ref={(el) => {
                sectionRefs.current['structures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Regional and Local Structures
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Regional and local structures refer to the organizational frameworks and systems that operate at different geographic levels within a country or across a broader area. They are essential for governance, service delivery, and economic development.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <GlobeIcon size={16} /> 1. Regional
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Definition:</strong> Regional structures operate across a larger geographic area, often encompassing multiple local jurisdictions. They can be governmental, economic, or administrative.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Functions:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Coordination:</strong> Regional structures often coordinate activities between local entities, ensuring consistency and efficiency.</li>
                    <li><strong>Planning:</strong> They may develop and implement regional development plans, addressing issues like transportation, infrastructure, and economic growth.</li>
                    <li><strong>Resource Allocation:</strong> Regional bodies can distribute resources, such as funding or services, across the region.</li>
                    <li><strong>Oversight:</strong> They may oversee local activities to ensure compliance with regional or national policies.</li>
                    <li><strong>Economic Development:</strong> Regional groups often work to promote economic growth through attracting investment and supporting businesses.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Examples:</strong> Regional governments or authorities, economic development zones, regional transportation authorities, multi-state or provincial agreements.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Detailed Explanation:</strong> Regional structures are vital for addressing issues that transcend local boundaries. They provide a platform for cooperation and coordination, allowing for more efficient use of resources and a more holistic approach to development. By coordinating activities such as infrastructure development, transportation planning, and economic development, regional structures can help to ensure that local jurisdictions work together to achieve common goals. They also play a crucial role in distributing resources and overseeing local activities, ensuring that national and regional policies are implemented effectively. For instance, a regional transportation authority might coordinate the development of a regional transit system, while a regional economic development zone might work to attract investment and promote job creation.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Building size={16} /> 2. Local Structures
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Definition:</strong> Local structures operate at the most immediate level, serving specific communities or neighbourhoods.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Functions:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Service Delivery:</strong> Local structures are responsible for providing essential services, such as sanitation, waste management, and local infrastructure maintenance.</li>
                    <li><strong>Community Governance:</strong> They often represent the interests of residents and provide a platform for community participation.</li>
                    <li><strong>Regulation:</strong> Local authorities may enforce local ordinances and regulations related to zoning, building codes, and public safety.</li>
                    <li><strong>Local Planning:</strong> They develop and implement local development plans, addressing issues specific to the community.</li>
                    <li><strong>Representation:</strong> Local structures represent the needs of the people to larger regional, or national bodies.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Examples:</strong> City or town councils, neighbourhood associations, school districts, local service districts.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Detailed Explanation:</strong> Local structures are the foundation of community governance and service delivery. They are responsible for addressing the day-to-day needs of residents, providing essential services, and representing the interests of the community. Local authorities play a crucial role in maintaining public safety, enforcing local regulations, and developing local infrastructure. They also serve as a vital link between residents and higher levels of government, ensuring that local concerns are heard and addressed. For example, a city council might be responsible for maintaining local roads, providing waste management services, and enforcing zoning regulations. Neighbourhood associations provide a platform for residents to participate in local decision-making and address community issues.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 4: Operational Logistics */}
            <div
              ref={(el) => {
                sectionRefs.current['operational'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Operational Logistics
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These are the day-to-day activities that ensure the smooth and efficient movement of goods. Think of it like running a delivery service: you need to plan routes, pack the truck, track vehicles, book deliveries, get proof of delivery, and send invoices.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Route Planning', icon: <Route size={16} />, content: (
                    <>
                      <p><strong>Definition:</strong> Determining the most efficient and cost-effective routes for vehicles to travel.</p>
                      <p><strong>Functions:</strong> Analysing delivery locations, considering traffic patterns and road conditions, optimizing routes to minimize travel time and fuel consumption, using GPS and mapping software.</p>
                      <p><strong>Detailed Explanation:</strong> Route planning is the strategic foundation of efficient transportation. It involves analysing delivery locations, considering traffic patterns, road conditions, and distance, to determine the most efficient routes. Modern software uses algorithms and real-time data to optimize routes, minimize travel time, and reduce fuel consumption. Effective route planning also considers vehicle capacity, delivery windows, and potential road closures.</p>
                    </>
                  ) },
                  { title: '2. Load Planning', icon: <Box size={16} />, content: (
                    <>
                      <p><strong>Definition:</strong> Organizing and arranging cargo within a vehicle to maximize space utilization and ensure safe transport.</p>
                      <p><strong>Functions:</strong> Determining optimal placement, considering weight distribution and cargo stability, using loading equipment and techniques, minimizing risk of damage.</p>
                      <p><strong>Detailed Explanation:</strong> Load planning is crucial for maximizing vehicle capacity and ensuring safe transport. It involves organizing cargo considering weight, size, and fragility. Proper planning minimizes damage, reduces trips, and optimizes space. Efficient load planning reduces costs and enhances delivery efficiency.</p>
                    </>
                  ) },
                  { title: '3. Vehicle Tracking', icon: <Navigation size={16} />, content: (
                    <>
                      <p><strong>Definition:</strong> Monitoring the location and status of vehicles in real-time.</p>
                      <p><strong>Functions:</strong> Using GPS and telematics, tracking speed, fuel consumption, maintenance, providing real-time updates, improving driver safety and security.</p>
                      <p><strong>Detailed Explanation:</strong> Vehicle tracking provides real-time visibility into vehicle location and status. GPS and telematics provide data on speed, fuel, and maintenance. Real-time updates can be shared with customers, enhancing their experience. It also improves security and enables rapid recovery of stolen vehicles.</p>
                    </>
                  ) },
                  { title: '4. Booking of Deliveries', icon: <Calendar size={16} />, content: (
                    <>
                      <p><strong>Definition:</strong> Scheduling and confirming delivery appointments with customers.</p>
                      <p><strong>Functions:</strong> Coordinating delivery times with customer availability, providing confirmations and notifications, managing schedules, using online booking systems.</p>
                      <p><strong>Detailed Explanation:</strong> Booking of deliveries involves scheduling appointments with customers to ensure deliveries at convenient times. Online booking systems allow customers to select preferred times and track orders. Effective booking enhances satisfaction and reduces missed deliveries.</p>
                    </>
                  ) },
                  { title: '5. Proof of Delivery (POD)', icon: <ClipboardCheck size={16} />, content: (
                    <>
                      <p><strong>Definition:</strong> Obtaining confirmation that a delivery has been successfully completed.</p>
                      <p><strong>Functions:</strong> Collecting signatures or electronic confirmations, recording delivery times and locations, providing documentation for invoicing and dispute resolution, using mobile devices for electronic POD.</p>
                      <p><strong>Detailed Explanation:</strong> POD is essential for confirming successful delivery. It involves obtaining signatures or electronic confirmations, recording times and locations, and providing documentation. Mobile devices allow electronic POD, capturing signatures and photos. POD provides a record, protecting companies from disputes and ensuring accurate invoicing.</p>
                    </>
                  ) },
                  { title: '6. Post-Delivery Invoicing', icon: <ReceiptText size={16} />, content: (
                    <>
                      <p><strong>Definition:</strong> Generating and sending invoices to customers after deliveries have been completed.</p>
                      <p><strong>Functions:</strong> Generating accurate invoices based on delivery data, sending invoices electronically or by mail, tracking payments, integrating with accounting systems.</p>
                      <p><strong>Detailed Explanation:</strong> Post-delivery invoicing generates invoices based on delivery data. It includes sending invoices electronically, tracking payments, and managing accounts receivable. Integration with accounting systems streamlines the process. Timely and accurate invoicing is essential for maintaining cash flow and customer satisfaction.</p>
                    </>
                  ) },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5: Logistics Tools */}
            <div
              ref={(el) => {
                sectionRefs.current['tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Logistics Tools
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These technologies help streamline and optimize various logistics operations: EDI (Electronic Data Interchange), Data Capture (Barcoding, OCR, Radio Transmission), and Simulation.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Link size={16} /> 1. Electronic Data Interchange (EDI)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Definition:</strong> The electronic exchange of business documents between computers, using a standardized format.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Automating the exchange of purchase orders, invoices, and shipping notices.</li>
                    <li>Reducing manual data entry and errors.</li>
                    <li>Speeding up transaction processing.</li>
                    <li>Improving communication between trading partners.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Detailed Explanation:</strong> EDI is a cornerstone of modern supply chain management. It allows businesses to electronically exchange critical documents in a standardized format. This eliminates paper-based transactions, reducing errors and delays. EDI streamlines communication, leading to improved accuracy, reduced costs, and enhanced customer service.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Scan size={16} /> 2. Data Capture (Barcoding, OCR, Radio Transmission)
                  </h3>
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <div>
                      <p><strong>Barcoding:</strong></p>
                      <p>Using barcodes to encode product information and track inventory. Functions: Quickly scanning and recording product data, improving inventory accuracy, and speeding up checkout processes.</p>
                    </div>
                    <div>
                      <p><strong>Optical Character Recognition (OCR):</strong></p>
                      <p>Converting printed or handwritten text into digital data. Functions: Automating data entry from documents like invoices and shipping labels, reducing manual effort, and improving accuracy.</p>
                    </div>
                    <div>
                      <p><strong>Radio Transmission (RFID):</strong></p>
                      <p>Using radio frequency identification to track and monitor objects. Functions: Tracking inventory in real-time, automating warehouse operations, and improving supply chain visibility.</p>
                    </div>
                    <p><strong>Detailed Explanation:</strong> Data capture technologies automate information collection, reducing manual effort and improving accuracy. Barcoding enables rapid scanning, enhancing inventory management. OCR converts printed text to digital data, automating data entry. RFID tracks objects in real-time, providing greater visibility. These technologies improve efficiency and accuracy.</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <CpuIcon size={16} /> 3. Simulation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Definition:</strong> Using computer models to simulate and analyse logistics operations.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Testing and optimizing distribution networks.</li>
                    <li>Analysing the impact of changes in demand or supply.</li>
                    <li>Evaluating different transportation scenarios.</li>
                    <li>Identifying potential bottlenecks and inefficiencies.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Detailed Explanation:</strong> Simulation tools allow businesses to create virtual models of their logistics operations, enabling them to test different scenarios without disrupting actual operations. This includes optimizing distribution networks, evaluating demand changes, and assessing transportation strategies. Simulation helps identify bottlenecks and inefficiencies, allowing informed decisions and improved logistics performance.
                  </p>
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
                  <span>Distribution Factors</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Operational Activities</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Logistics Tools</span>
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
                Distribution network design and warehouse location are strategic decisions that balance customer proximity, transportation costs, product characteristics, and labour availability. Operational logistics – route planning, load planning, tracking, booking, POD, and invoicing – are the daily activities that ensure efficient goods movement. Technology tools like EDI, data capture, and simulation help optimize these processes for cost reduction and customer satisfaction.
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
                <strong className="text-white">Distribution of Supplies</strong> – involves inventory management, warehousing, transportation, and order fulfilment to deliver the right products at the right time.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Location Factors</strong> – include customer demand, transportation costs, product characteristics, supplier proximity, infrastructure, labour, real estate, and regulations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Regional &amp; Local Structures</strong> – regional bodies coordinate planning and resource allocation across areas, while local structures deliver services and governance at the community level.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Operational Logistics</strong> – route planning, load planning, vehicle tracking, delivery booking, proof of delivery, and post-delivery invoicing are essential daily activities.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Logistics Tools</strong> – EDI, data capture (barcoding, OCR, RFID), and simulation help automate, track, and optimize logistics operations.
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

export default LearningOutcome3;
