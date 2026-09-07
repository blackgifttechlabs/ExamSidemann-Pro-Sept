import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  GlobeIcon,
  Shield,
  SettingsIcon,
  LayersIcon,
  FileText,
  Archive,
  Truck,
  Train,
  Ship,
  Plane,
  Pipette,
  Navigation,
  MapPin,
  Map,
  Clock,
  DollarSign,
  Package,
  Calendar,
  Lock,
  BarChart,
  Activity,
  RefreshCw,
  MessageCircle,
  AlertCircle,
  Fuel,
  Trash,
  Users2,
  Volume,
  LineSquiggle as Road,
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
  { id: 'elements', label: 'Elements' },
  { id: 'functions', label: 'Functions' },
  { id: 'characteristics', label: 'Modal Characteristics' },
  { id: 'selection', label: 'Selection Factors' },
  { id: 'costing', label: 'Costing' },
  { id: 'environment', label: 'Environment' },
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
        text: 'The global transport industry accounts for about 24% of energy-related CO2 emissions. Choosing the right mode can significantly reduce environmental impact.',
      },
      {
        title: 'Pro Tip',
        text: 'When selecting a transport mode, use a weighted scoring model that considers cost, speed, reliability, and accessibility tailored to your specific cargo needs.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 6 selection factors: Cost, Speed, Reliability, Accessibility, Cargo Type, and Safety. They form a useful checklist for transport decisions.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t only focus on freight cost per unit. Consider total landed cost including inventory carrying cost, packaging, handling, and risk of damage or delay.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The global transport industry accounts for about 24% of energy-related CO2 emissions. Choosing the right mode can significantly reduce environmental impact.',
      },
      {
        title: 'Pro Tip',
        text: 'When selecting a transport mode, use a weighted scoring model that considers cost, speed, reliability, and accessibility tailored to your specific cargo needs.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 6 selection factors: Cost, Speed, Reliability, Accessibility, Cargo Type, and Safety. They form a useful checklist for transport decisions.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t only focus on freight cost per unit. Consider total landed cost including inventory carrying cost, packaging, handling, and risk of damage or delay.',
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

  // Helper to render a card without colored left border, clean styling
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
            Transport Modes & Logistics{' '}
            <span className="text-sky-300 font-bold italic">
              Cargo Transportation
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to determining the most appropriate mode of transport, elements and functions of transport, modal characteristics, factors in carrier selection, transport costing, and environmental issues.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Truck size={14} className="inline mr-1" /> Road
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Ship size={14} className="inline mr-1" /> Water
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Plane size={14} className="inline mr-1" /> Air
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Train size={14} className="inline mr-1" /> Rail
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
                placeholder="Search for a mode, factor, costing concept..."
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
                Determining the Most Appropriate Mode of Transport for Various Cargo
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Choosing the right transport mode is crucial for efficient logistics. It depends on factors like cargo type, distance, speed, cost, and reliability.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Think of it like choosing the best way to travel. You would not take a boat to the grocery store, or a plane for a short trip. Cargo is the same. You pick the method based on what you are moving, how fast it needs to get there, and how much you can spend.
                  </p>
</div>
            </div>

            {/* SECTION 2: Elements of Transport */}
            <div
              ref={(el) => {
                sectionRefs.current['elements'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Elements of Transport (2.2.1)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The four key elements of transport are infrastructure, vehicles, operations, and information. Together they form the backbone of any logistics system.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Infrastructure', icon: <Road size={16} />, content: 'The physical network – roads, railways, waterways, airways. The quality and accessibility of infrastructure directly impact speed, reliability, and cost. Inadequate infrastructure leads to delays and increased expenses.' },
                  { title: '2. Vehicles', icon: <Truck size={16} />, content: 'The means of transportation – trucks, trains, ships, planes. Choice depends on cargo type, size, distance, and speed required. Each vehicle type has its own capacity, speed, fuel efficiency, and operating costs.' },
                  { title: '3. Operations', icon: <SettingsIcon size={16} />, content: 'The processes – loading, unloading, routing, scheduling, tracking. Effective operations ensure safe and efficient movement, involving coordination with carriers, warehouses, and customs.' },
                  { title: '4. Information', icon: <FileText size={16} />, content: 'Data and communication – real-time tracking, electronic documentation, data analytics. Information flow enhances transparency, improves communication, and enables proactive problem-solving.' },
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

            {/* SECTION 3: Functions of Transport */}
            <div
              ref={(el) => {
                sectionRefs.current['functions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Functions of Transport (2.2.2)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Movement', icon: <Navigation size={16} />, content: 'The physical relocation of goods from one location to another. Efficiency depends on distance, speed, and mode. Optimizing routes, consolidating shipments, and using efficient vehicles improve performance.' },
                  { title: '2. Storage', icon: <Archive size={16} />, content: 'Temporary storage during transit – at warehouses, terminals, or distribution centres. Effective storage management protects goods and ensures availability when needed.' },
                  { title: '3. Information Flow', icon: <MessageCircle size={16} />, content: 'Data generated by transportation – tracking, delivery status, inventory levels. Timely and accurate sharing of this data enhances transparency and decision-making.' },
                  { title: '4. Consolidation/Break-Bulk', icon: <LayersIcon size={16} />, content: 'Combining small shipments into larger ones to maximize vehicle utilization, or separating large shipments for distribution to multiple destinations. Requires careful planning and coordination.' },
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

            {/* SECTION 4: Modal Characteristics */}
            <div
              ref={(el) => {
                sectionRefs.current['characteristics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Modal Characteristics (2.2.3)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Each transport mode has distinct characteristics that make it suitable for specific cargo types, distances, and requirements.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Road Transport (Trucks)', icon: <Truck size={16} />, content: 'Offers flexibility and door-to-door delivery. Suitable for short to medium distances. Relatively expensive per tonne-kilometre compared to rail/water, but provides accessibility to remote locations. Subject to traffic and weather.' },
                  { title: '2. Rail Transport (Trains)', icon: <Train size={16} />, content: 'Efficient for heavy loads over long distances. Cost-effective and more environmentally friendly than road. Limited by fixed rail networks – best for bulk commodities (coal, grain, minerals) and long-haul shipments.' },
                  { title: '3. Water Transport (Ships)', icon: <Ship size={16} />, content: 'Most cost-effective for very large volumes over long distances (oceans). Suitable for bulk commodities and containerized cargo. Slow and subject to weather and port congestion.' },
                  { title: '4. Air Transport (Planes)', icon: <Plane size={16} />, content: 'Fastest mode, ideal for urgent and high-value goods. Most expensive and has limited capacity. Best for lightweight, time-sensitive items like electronics, pharmaceuticals, and perishables.' },
                  { title: '5. Pipeline Transport', icon: <Pipette size={16} />, content: 'Specialized for liquids and gases (oil, natural gas). Offers continuous flow and low operating costs. Requires high initial investment and is limited to specific cargo types.' },
                  { title: '6. Intermodal Transportation', icon: <RefreshCw size={16} />, content: 'Uses multiple modes (truck, rail, ship, plane) without handling the freight itself when changing modes. Relies on standardized containers, making transfers seamless. Combines the advantages of different modes.' },
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

            {/* SECTION 5: Factors Determining Selection */}
            <div
              ref={(el) => {
                sectionRefs.current['selection'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors Determining the Selection of Transport Carrier/Mode
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Choosing the right transport is key for efficiency and cost-effectiveness. Think of it as choosing the best route for a road trip – consider cost, speed, reliability, accessibility, cargo type, and safety.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Cost (Economic Considerations)', icon: <DollarSign size={16} />, content: 'Total cost including freight rates, fuel surcharges, handling fees, insurance. Compare cost-effectiveness across modes. Air is fast but expensive; ocean is slow but cheap. Must weigh savings vs benefits of speed.' },
                  { title: '2. Speed (Transit Time)', icon: <Clock size={16} />, content: 'Crucial for perishable, urgent, or high-value goods. Faster modes (air, expedited truck) cost more. Balance speed with cost – non-perishable goods may use slower modes to save money.' },
                  { title: '3. Reliability (Consistency and Dependability)', icon: <Shield size={16} />, content: 'On-time delivery, minimal delays, accurate tracking. Choose carriers with proven track record. Reliability minimizes disruption to supply chain and maintains customer satisfaction.' },
                  { title: '4. Accessibility (Reach and Coverage)', icon: <MapPin size={16} />, content: 'Ability to reach origin and destination. Road offers greatest flexibility; rail/water limited by fixed routes; air needs airports. Ensure mode can serve your markets.' },
                  { title: '5. Cargo Type (Nature of Goods)', icon: <Package size={16} />, content: 'Perishables need temperature control; hazardous materials need specialized containers; oversized need heavy-duty transport. Choose mode that can handle cargo requirements.' },
                  { title: '6. Safety (Security and Risk Management)', icon: <Lock size={16} />, content: 'Protection from damage, theft, and risk. Consider cargo insurance, tracking, security personnel. High-value or sensitive cargo may require enhanced security features.' },
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

            {/* SECTION 6: Transport Costing and Budgeting */}
            <div
              ref={(el) => {
                sectionRefs.current['costing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Transport Costing and Budgeting
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Transport costing and budgeting are essential for managing the financial aspects of logistics. They involve tracking expenses, forecasting costs, and creating budgets to ensure efficient and cost-effective operations.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Cost Identification', icon: <FileText size={16} />, content: 'Break down expenses into fixed costs (vehicle depreciation, insurance) and variable costs (fuel, maintenance, labour). Track through detailed records and transport management systems. Identify hidden costs like delays or inefficient routing.' },
                  { title: '2. Cost Allocation', icon: <BarChart size={16} />, content: 'Assign costs to specific activities, routes, or customers. Use activity-based costing to determine cost drivers and profitability. Helps in identifying areas for efficiency improvement.' },
                  { title: '3. Budgeting', icon: <Calendar size={16} />, content: 'Create a financial plan forecasting expenses and revenues. Estimate fuel, maintenance, labour based on historical data and future projections. Make budgets flexible to handle fuel price fluctuations and demand changes.' },
                  { title: '4. Performance Measurement', icon: <Activity size={16} />, content: 'Track actual costs against budgeted costs and analyse variances. Use KPIs like cost per mile, fuel efficiency, on-time delivery. Regular reporting and benchmarking against industry standards drive improvement.' },
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

            {/* SECTION 7: Environmental Issues */}
            <div
              ref={(el) => {
                sectionRefs.current['environment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Environmental Issues in Transportation
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Transportation is a major contributor to environmental pollution. Addressing these issues is crucial for sustainable logistics. Key issues include air pollution, climate change, noise pollution, land use, resource depletion, and waste generation.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Air Pollution', icon: <AlertCircle size={16} />, content: 'Vehicle emissions (NOx, SOx, particulate matter) cause respiratory problems. Mitigate with cleaner technologies (electric vehicles), alternative fuels, optimized routes, and reduced idle time.' },
                  { title: '2. Climate Change', icon: <GlobeIcon size={16} />, content: 'GHG emissions (especially CO2) from transport contribute to global warming. Reduce through renewable energy, improved fuel efficiency, carbon offsetting, and sustainable practices.' },
                  { title: '3. Noise Pollution', icon: <Volume size={16} />, content: 'Traffic noise impacts communities near highways and airports. Use noise barriers, quieter vehicles, and optimise delivery schedules to minimize night-time noise.' },
                  { title: '4. Land Use', icon: <Map size={16} />, content: 'Roads and airports consume land and can fragment habitats. Promote sustainable planning, alternative modes (public transit, cycling), and minimise new construction.' },
                  { title: '5. Resource Depletion', icon: <Fuel size={16} />, content: 'Fossil fuels are finite. Transition to renewable energy, improve fuel efficiency, and use sustainable materials in manufacturing and infrastructure.' },
                  { title: '6. Waste Generation', icon: <Trash size={16} />, content: 'Used tires, oils, vehicle parts. Implement recycling programs, extend vehicle lifespans, use remanufactured parts, and adopt circular supply chains.' },
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
                  💡 Transport Insight
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
                  <span>Transport Modes</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Selection Factors</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Environmental Issues</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Choosing the right transport mode is a strategic decision that impacts cost, speed, reliability, and environmental footprint. Consider the six selection factors – Cost, Speed, Reliability, Accessibility, Cargo Type, and Safety – and always factor in total landed cost. Sustainable practices are increasingly important for both regulatory compliance and brand reputation.
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
                <strong className="text-white">Transport Modes</strong> – each mode (road, rail, water, air, pipeline, intermodal) has unique characteristics affecting cost, speed, capacity, and accessibility.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Elements of Transport</strong> – infrastructure, vehicles, operations, and information – all must work together for efficient logistics.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Selection Factors</strong> – cost, speed, reliability, accessibility, cargo type, and safety guide mode/carrier selection.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Costing &amp; Budgeting</strong> – identify, allocate, budget, and measure transport costs to optimise financial performance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Environmental Impact</strong> – address air pollution, climate change, noise, land use, resource depletion, and waste for sustainable transport.
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
            Sidemann Academic Registry • Logistics & Transport Management 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;
