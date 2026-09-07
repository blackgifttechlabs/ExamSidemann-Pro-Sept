import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  SearchIcon,
  Layout,
  GlobeIcon,
  Shield,
  SettingsIcon,
  BookOpen,
  Archive,
  Database,
  DollarSign,
  Users,
  ClipboardCheck,
  BarChart3,
  Zap,
  AlertCircle,
  RefreshCw,
  Handshake,
  Building2,
  Truck,
  Clipboard,
  CheckCircle,
  Cloud,
  MapPin,
  Cpu,
  Rocket,
  Heart,
  Brain,
  BookOpen as BookOpenIcon,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw as RefreshIcon,
  ChevronUp,
  AlertTriangle,
  Monitor,
  Link2,
  FileCode,
  UserCheck,
  GraduationCap,
  Briefcase,
  Menu,
  MousePointer,
  Touchpad,
  Grid3X3,
  Palette,
  Settings,
  FileText as FileTextIcon,
  MessageSquare,
  Mail,
  Calendar,
  Globe,
  Factory,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'location-layout', label: 'Location & Layout' },
  { id: 'automation-benefits', label: 'Automation Benefits' },
  { id: 'security', label: 'Security Measures' },
  { id: 'health-safety', label: 'Health & Safety' },
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
        text: 'The first automated warehouse was introduced by IBM in the 1960s. Today, Amazon operates over 100 automated fulfilment centres worldwide with thousands of robots.',
      },
      {
        title: 'Pro Tip',
        text: 'When designing an automated warehouse layout, always consider the flow of materials first. An efficient layout reduces travel time and increases throughput significantly.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 10 benefits of automation: Efficiency, Accuracy, Cost, Safety, Space Optimisation, Visibility, Fulfilment Speed, Data Analytics, Scalability, and Supply Chain Integration.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t overlook the importance of proper training when implementing automation. Even the most advanced systems are only as effective as the people operating and maintaining them.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first automated warehouse was introduced by IBM in the 1960s. Today, Amazon operates over 100 automated fulfilment centres worldwide with thousands of robots.',
      },
      {
        title: 'Pro Tip',
        text: 'When designing an automated warehouse layout, always consider the flow of materials first. An efficient layout reduces travel time and increases throughput significantly.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 10 benefits of automation: Efficiency, Accuracy, Cost, Safety, Space Optimisation, Visibility, Fulfilment Speed, Data Analytics, Scalability, and Supply Chain Integration.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t overlook the importance of proper training when implementing automation. Even the most advanced systems are only as effective as the people operating and maintaining them.',
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Automated Warehouse{' '}
            <span className="text-purple-300 font-bold italic">
              Location, Layout &amp; Safety
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Complete guide to location and layout considerations, benefits of automation, security measures, and health &amp; safety in automated storage facilities.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <MapPin size={14} className="inline mr-1" /> Location &amp; Layout
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Rocket size={14} className="inline mr-1" /> Automation
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Security &amp; Safety
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
                placeholder="Search for a concept, automation, security..."
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
            {/* SECTION 1: Location and Layout of a Storage Facility in an Automated Organization */}
            <div
              ref={(el) => {
                sectionRefs.current['location-layout'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Location and Layout of a Storage Facility in an Automated Organization
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In an automated organization, the location and layout of a storage facility are critical determinants of efficiency, cost-effectiveness, and responsiveness. Unlike traditional warehouses, automated facilities leverage technology to optimize every aspect of material handling and storage. The strategic placement and intelligent design of these facilities are essential for seamless integration with other automated systems, such as production lines and distribution networks.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <MapPin size={16} /> Location Considerations:
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Proximity to Transportation Networks:</strong> Automated warehouses should be strategically located near major transportation hubs, such as highways, railways, and ports. This minimizes transportation costs and reduces lead times for inbound and outbound shipments. In an automated environment, where speed and efficiency are paramount, proximity to transportation networks ensures that materials can be moved quickly and seamlessly. This also reduces the carbon footprint, related to transportation.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Access to Labour and Skilled Technicians:</strong> While automation reduces the need for manual labour, skilled technicians are still required for maintenance, troubleshooting, and system management. The location should offer access to a pool of qualified technicians and engineers with expertise in automation and robotics. This ensures that the facility can operate efficiently and minimize downtime. The availability of training facilities is also an important factor.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Land Availability and Cost:</strong> Automated warehouses require significant land area for storage, handling, and expansion. The location should offer affordable land with suitable zoning regulations. The cost of land can significantly impact the overall investment in an automated warehouse. The land must also be suitable for the heavy loads, that automated storage systems, will place upon it.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Proximity to Suppliers and Customers:</strong> Locating the warehouse closer to suppliers and customers can reduce transportation costs and lead times. This is particularly important for organizations that operate in just-in-time (JIT) environments. Proximity to suppliers, also allows for easier collaboration, and communication. Proximity to customers, allows for faster delivery times, and improved customer satisfaction.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Infrastructure and Utilities:</strong> Automated warehouses require reliable access to infrastructure and utilities, such as electricity, water, and internet connectivity. High-speed internet is essential for communication and data exchange with automated systems. Reliable power supply is critical for continuous operation. The utilities must also be able to handle the high demands, of an automated system.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Environmental Considerations:</strong> The location should comply with environmental regulations and minimize its impact on the surrounding environment. This includes considerations such as noise pollution, air emissions, and waste disposal. Sustainable building practices and energy-efficient technologies should be incorporated into the design and operation of the facility. This also includes, the correct handling, and storage, of any hazardous materials.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Layout size={16} /> Layout Considerations:
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Automated Storage and Retrieval Systems (AS/RS):</strong> AS/RS systems are the core of automated warehouses. They consist of automated cranes or shuttles that move materials between storage locations and picking stations. The layout should be designed to optimize the flow of materials through the AS/RS system. This includes the correct placement of the AS/RS system, within the warehouse, to allow for the most efficient flow of goods.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Automated Guided Vehicles (AGVs) and Robots:</strong> AGVs and robots are used for automated materials handling within the warehouse. The layout should provide clear pathways and sufficient space for these vehicles to navigate safely and efficiently. This includes the correct placement of charging stations.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Conveyor Systems:</strong> Conveyor systems are used to transport materials between different areas of the warehouse. The layout should be designed to minimize conveyor lengths and optimize the flow of materials. This also includes, the correct integration, of the conveyor systems, with other automated systems.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Picking and Packing Stations:</strong> Automated picking and packing stations are used to fulfil customer orders. The layout should be designed to minimize picking times and optimize packing efficiency. This includes, the correct ergonomic design, of these stations.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Receiving and Shipping Areas:</strong> Automated receiving and shipping areas are used to process inbound and outbound shipments. The layout should be designed to minimize congestion and optimize the flow of materials. This also includes, the correct integration of these areas, with the transportation network.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Control Room and Monitoring Systems:</strong> A centralized control room is essential for monitoring and managing the automated warehouse. The layout should provide clear visibility of all operations and allow for efficient control of automated systems. This includes the correct placement of monitoring equipment.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Maintenance and Repair Areas:</strong> Dedicated maintenance and repair areas are essential for ensuring the continuous operation of automated systems. The layout should provide easy access to these areas and sufficient space for maintenance activities. This also includes the correct storage of spare parts.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Scalability and Flexibility:</strong> The layout should be designed to accommodate future expansion and changes in demand. Modular design and flexible automation systems can facilitate scalability and adaptability. This allows for the easy integration of new technologies, and equipment.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Safety and Security Systems:</strong> Comprehensive safety and security systems are essential for protecting personnel and materials. This includes fire suppression systems, emergency exits, access control systems, and surveillance cameras. This also includes, the correct placement of safety barriers, and warning signs.
                </p>
              </div>
            </div>

            {/* SECTION 2: Benefits of Automation in Warehouse Management */}
            <div
              ref={(el) => {
                sectionRefs.current['automation-benefits'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Benefits of Automation in Warehouse Management
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Automation in warehouse management has revolutionized the way organizations handle inventory, logistics, and order fulfilment. It is not just about replacing manual labour; it is about optimizing processes, improving accuracy, and enhancing overall efficiency. The integration of technology and automated systems brings a multitude of benefits, transforming warehouses from static storage spaces into dynamic, data driven centres of operational excellence.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Zap size={16} /> Increased Efficiency and Productivity
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Automation significantly accelerates warehouse operations by automating repetitive tasks such as picking, packing, and sorting. Automated systems, such as automated storage and retrieval systems (AS/RS), automated guided vehicles (AGVs), and conveyor systems, can move materials faster and more consistently than human workers. This leads to increased throughput, reduced lead times, and improved order fulfilment rates. By minimizing manual handling, automation reduces the risk of errors and ensures that tasks are completed with greater speed and accuracy. This also allows for 24/7 operation, which increases overall productivity.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle size={16} /> Improved Accuracy and Reduced Errors
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Human error is a common source of inaccuracies in warehouse operations. Automation minimizes this risk by using technology to track inventory, process orders, and manage materials. Barcode scanning, RFID technology, and automated data capture systems ensure accurate data entry and reduce the likelihood of misplaced or mislabelled items. This leads to improved inventory accuracy, reduced stock discrepancies, and fewer customer complaints. This accuracy also allows for better inventory forecasting.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <DollarSign size={16} /> Reduced Labour Costs
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Automation reduces the need for manual labour in warehouse operations, leading to significant cost savings. While the initial investment in automation technology can be substantial, the long-term savings in labour costs can be significant. Automation can also reduce the need for overtime and temporary workers, further reducing labour expenses. This allows for the reallocation of staff, to more value-added tasks.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Shield size={16} /> Enhanced Safety and Ergonomics
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Automated systems can handle heavy lifting and repetitive tasks, reducing the risk of injuries to warehouse workers. Automated guided vehicles (AGVs) and robots can navigate safely through the warehouse, minimizing the risk of collisions. Automated storage and retrieval systems (AS/RS) can reduce the need for workers to climb ladders or reach high shelves, improving ergonomics and reducing the risk of falls. This also reduces the risk of repetitive strain injuries.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Archive size={16} /> Optimized Space Utilization
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Automated storage and retrieval systems (AS/RS) can maximize the use of vertical space in warehouses, increasing storage capacity. Automated systems can also optimize the layout of the warehouse, ensuring that materials are stored and retrieved efficiently. This optimized space utilization, reduces the need for expansion, saving costs.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Database size={16} /> Improved Inventory Visibility and Tracking
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Automated inventory management systems provide real-time visibility into inventory levels, locations, and movements. This allows organizations to track inventory accurately, prevent stockouts, and optimize inventory levels. Real-time data also enables better demand forecasting and inventory planning. This also provides an audit trail, for all inventory movements.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                    <Truck size={16} /> Faster Order Fulfilment and Delivery
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Automation accelerates order fulfilment and delivery processes, leading to faster turnaround times and improved customer satisfaction. Automated picking, packing, and sorting systems can process orders quickly and accurately. Automated shipping systems can ensure that orders are shipped promptly and efficiently. This speed is vital in today's, on demand economy.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2">
                    <BarChart3 size={16} /> Enhanced Data Collection and Analysis
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Automated systems collect vast amounts of data on warehouse operations, providing valuable insights for analysis and improvement. This data can be used to identify bottlenecks, optimize processes, and improve overall efficiency. Data analytics can also be used to track key performance indicators (KPIs) and monitor the performance of automated systems. This data driven approach, allows for continual improvement.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                    <RefreshCw size={16} /> Increased Scalability and Flexibility
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Automated warehouse systems can be easily scaled up or down to meet changing demand. Modular automation systems can be configured to adapt to different warehouse layouts and operational requirements. This flexibility allows organizations to respond quickly to changes in market conditions and customer demands. This also allows for the integration of new technologies, as they become available.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <GlobeIcon size={16} /> Improved Supply Chain Integration
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Automated warehouse systems can be integrated with other supply chain systems, such as enterprise resource planning (ERP) and transportation management systems (TMS). This integration facilitates seamless data exchange and improves coordination between different supply chain functions. This also allows for better communication, with suppliers, and customers.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: Security Measures in Stores Management */}
            <div
              ref={(el) => {
                sectionRefs.current['security'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Security Measures in Stores Management
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Security measures in stores management are essential for safeguarding inventory, protecting personnel, and maintaining operational integrity. It is not just about preventing theft; it is a comprehensive approach that encompasses physical security, access control, data protection, and safety protocols. Implementing robust security measures is crucial for minimizing risks, ensuring business continuity, and building trust among stakeholders.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Building2 size={16} /> Physical Security and Access Control
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Physical security involves protecting the storage facility from unauthorized access and external threats. This includes measures such as sturdy perimeter fencing, reinforced doors and windows, and well-lit surroundings. Access control systems, such as key card access, biometric scanners, and security codes, restrict entry to authorized personnel only. These measures create a physical barrier against intruders and deter potential theft. Additionally, surveillance cameras strategically placed throughout the facility provide real-time monitoring and recording of activities, enhancing security, and facilitating investigations in case of incidents. Physical security also includes, the safe storage of high value items, in secure cages, or rooms.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Database size={16} /> Inventory Tracking and Control Systems
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Implementing robust inventory tracking and control systems is crucial for preventing internal theft and ensuring accurate inventory records. Barcode scanning, RFID technology, and inventory management software provide real-time visibility into inventory levels and movements. Regular cycle counts and physical inventory audits help to identify discrepancies and detect potential theft or pilferage. These systems also allow for the tracking of inventory location, and the identification of any missing items. This real-time data allows for quick responses, to any security breaches.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Users size={16} /> Security Personnel and Training
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Employing trained security personnel to monitor the storage facility and enforce security protocols is essential. Security guards can patrol the premises, monitor surveillance cameras, and respond to security incidents. Regular security training for all personnel, including warehouse staff, helps to raise awareness of security risks and promote a culture of security consciousness. Training should cover topics such as theft prevention, emergency response procedures, and proper handling of sensitive materials. This also includes training on how to identify suspicious activity.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Shield size={16} /> Data Security and Information Protection
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    In today's digital age, data security is paramount. Implementing strong cybersecurity measures, such as firewalls, intrusion detection systems, and data encryption, protects sensitive inventory data and customer information from unauthorized access and cyberattacks. Regular data backups and disaster recovery plans ensure business continuity in case of data loss or system failures. Access to sensitive data should be restricted to authorized personnel only, and strong password policies should be enforced. This also includes the secure destruction of any sensitive documents.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <ClipboardCheck size={16} /> Safety Protocols and Emergency Response
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Security measures also encompass safety protocols to protect personnel from accidents and injuries. This includes implementing safety procedures for materials handling, storage, and transportation. Emergency response plans should be in place to address potential hazards such as fires, spills, and natural disasters. Regular safety training and drills ensure that personnel are prepared to respond effectively to emergencies. This also includes, the correct storage, and handling, of hazardous materials.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Handshake size={16} /> Supplier and Vendor Security
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Extending security measures to suppliers and vendors is crucial for maintaining a secure supply chain. Background checks and security audits of suppliers and vendors help to identify potential security risks. Secure transportation and delivery protocols ensure that materials are protected during transit. This also includes, the secure transfer of data, between systems.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                    <SearchIcon size={16} /> Regular Security Audits and Risk Assessments
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Conducting regular security audits and risk assessments helps to identify vulnerabilities and improve security measures. This involves reviewing security protocols, evaluating the effectiveness of security systems, and identifying potential threats. Risk assessments should consider factors such as the value of inventory, the location of the storage facility, and the nature of the business. This allows for the proactive identification, and mitigation of risks.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2">
                    <AlertCircle size={16} /> Incident Reporting and Investigation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Establishing clear incident reporting procedures ensures that security incidents are promptly reported and investigated. This includes procedures for reporting theft, damage, and other security breaches. Thorough investigations help to identify the root causes of incidents and prevent recurrence. This also includes the correct documentation of all incidents.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                    <Cloud size={16} /> Environmental Controls
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Depending on the stored goods, environmental controls are a significant security measure. This includes temperature control, humidity control, and air quality control. These controls prevent damage, spoilage, and degradation of stored items.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <DollarSign size={16} /> Insurance Coverage
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    While not a preventative measure, adequate insurance coverage is vital. Insurance protects the organization from financial losses due to theft, damage, or other security breaches. This allows for business continuity, after a security incident.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 4: Health and Safety Measures */}
            <div
              ref={(el) => {
                sectionRefs.current['health-safety'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Healthy and Safety Measures
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Healthy and safety measures are a comprehensive set of protocols, procedures, and practices designed to prevent workplace injuries, illnesses, and fatalities. It is not simply about compliance with regulations; it is about fostering a culture of well-being, ensuring that employees are protected from hazards, and promoting a safe and healthy work environment. Implementing robust health and safety measures is essential for maintaining a productive workforce, reducing absenteeism, and minimizing liability.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <SearchIcon size={16} /> Hazard Identification and Risk Assessment
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The foundation of effective health and safety measures is the systematic identification of potential hazards and the assessment of associated risks. This involves conducting thorough workplace inspections, analysing accident and incident data, and gathering input from employees. Risk assessments should evaluate the likelihood and severity of potential injuries or illnesses, allowing organizations to prioritize control measures. This process should be ongoing, as new hazards may arise, and existing hazards may change. This proactive approach allows for the prevention of accidents before they occur.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <ClipboardCheck size={16} /> Implementation of Control Measures
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Once hazards have been identified and risks assessed, appropriate control measures must be implemented. These measures can include:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Elimination:</strong> Removing the hazard entirely.</li>
                    <li><strong>Substitution:</strong> Replacing hazardous materials or processes with safer alternatives.</li>
                    <li><strong>Engineering controls:</strong> Modifying equipment or processes to reduce exposure to hazards.</li>
                    <li><strong>Administrative controls:</strong> Implementing work practices and procedures to minimize risk.</li>
                    <li><strong>Personal protective equipment (PPE):</strong> Providing employees with appropriate PPE, such as safety glasses, gloves, and respirators.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    The selection and implementation of control measures should be based on the hierarchy of controls, prioritizing the most effective measures. Control measures should be regularly reviewed and updated to ensure their effectiveness.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <BookOpen size={16} /> Safety Training and Education
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Comprehensive safety training and education are essential for ensuring that employees understand potential hazards and know how to protect themselves. Training should cover topics such as:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Hazard communication.</li>
                    <li>Emergency procedures.</li>
                    <li>Proper use of equipment and PPE.</li>
                    <li>Safe work practices.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Training should be provided to all employees, including new hires, and should be regularly refreshed. Training should be tailored to the specific hazards and risks associated with each job role. This ensures that employees are competent, and confident in their abilities to work safely.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <AlertCircle size={16} /> Emergency Preparedness and Response
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Organizations should have well-defined emergency preparedness and response plans in place to address potential emergencies such as fires, chemical spills, and medical emergencies. These plans should include:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Evacuation procedures.</li>
                    <li>First aid and medical assistance.</li>
                    <li>Emergency communication protocols.</li>
                    <li>Designated emergency responders.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Regular emergency drills and simulations should be conducted to ensure that employees are familiar with emergency procedures. This ensures that, in the event of an emergency, everyone knows what to do.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Heart size={16} /> Health Monitoring and Surveillance
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    In some industries, health monitoring and surveillance programs may be necessary to assess employee exposure to hazardous substances and identify potential health effects. This can include:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Regular medical examinations.</li>
                    <li>Exposure monitoring.</li>
                    <li>Biological monitoring.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Health monitoring and surveillance data should be used to evaluate the effectiveness of control measures and identify areas for improvement. This allows for the early detection of any health issues.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Clipboard size={16} /> Incident Reporting and Investigation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Establishing clear incident reporting procedures ensures that all accidents, injuries, and near misses are promptly reported and investigated. Thorough investigations help to identify the root causes of incidents and prevent recurrence. Incident reports should be analysed to identify trends and patterns, allowing organizations to implement proactive measures to prevent future incidents. This also allows for the identification of any unsafe work practices.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                    <SettingsIcon size={16} /> Ergonomics and Workplace Design
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Ergonomics focuses on designing workplaces and tasks to minimize physical strain and discomfort. This includes:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Adjustable workstations.</li>
                    <li>Proper lifting techniques.</li>
                    <li>Minimizing repetitive motions.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Ergonomic assessments should be conducted to identify and address potential ergonomic hazards. This improves employee comfort and reduces injuries.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2">
                    <Users size={16} /> Promoting a Culture of Safety
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Creating a culture of safety involves fostering a workplace where safety is a shared value and responsibility. This includes:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Encouraging open communication about safety concerns.</li>
                    <li>Recognizing and rewarding safe behaviours.</li>
                    <li>Providing employees with opportunities to participate in safety initiatives.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    A strong safety culture empowers employees to take ownership of their safety and the safety of their colleagues.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                    <SearchIcon size={16} /> Regular Inspections and Audits
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Regular inspections and audits of the workplace, and safety equipment, are vital. This ensures that all safety measures are functioning correctly.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <Brain size={16} /> Mental Health Awareness
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Modern safety practices, include mental health awareness. This includes providing resources, and training, to help employees deal with stress, and other mental health challenges.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Automation Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <RefreshIcon size={16} className="text-orange-500 dark:text-orange-400" />
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
                  <span>Location Factors</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Automation Benefits</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Security Measures</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">10</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Automated warehouses require careful consideration of location and layout to maximise efficiency. Automation brings significant benefits—efficiency, accuracy, cost savings, safety, and scalability—but also requires robust security measures. Health and safety are paramount, with a focus on hazard identification, control measures, training, and a culture of safety. A well-planned automated warehouse is a foundation for operational excellence.
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
                <strong className="text-white">Location &amp; Layout</strong> – consider proximity to transport, skilled labour, land costs, supplier/customer proximity, infrastructure, and environmental factors. Layout must optimise AS/RS, AGVs, conveyors, picking stations, and safety systems.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Automation Benefits</strong> – increased efficiency, improved accuracy, reduced labour costs, enhanced safety, optimised space utilisation, better visibility, faster fulfilment, data analytics, scalability, and supply chain integration.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Security Measures</strong> – physical security, inventory tracking, security personnel, data protection, safety protocols, supplier security, regular audits, incident reporting, environmental controls, and insurance coverage.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Health &amp; Safety</strong> – hazard identification, risk assessment, control measures (elimination, substitution, engineering, administrative, PPE), training, emergency preparedness, health monitoring, incident investigation, ergonomics, safety culture, regular inspections, and mental health awareness.
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
            Sidemann Academic Registry • ND Purchasing &amp; Supply – Automated Warehouse 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;
