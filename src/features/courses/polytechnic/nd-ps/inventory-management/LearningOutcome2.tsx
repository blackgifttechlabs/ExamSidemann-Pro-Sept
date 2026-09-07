import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Layout,
  GlobeIcon,
  Shield,
  ListChecks,
  SettingsIcon,
  LayersIcon,
  FileText,
  Database,
  Package,
  ClipboardCheck,
  Truck,
  Move,
  Gauge,
  Award,
  AlertTriangle,
  BarChart,
  Eye,
  DollarSign,
  RefreshCw,
  Filter,
  Lock,
  Wrench,
  Recycle,
  Undo,
  TrendingUp,
  Cpu,
  Lightbulb,
  MessageSquare,
  BookOpen,
  Search,
  X as XIcon,
  Sparkles,
  Loader as
  RefreshIcon,
  ChevronUp,
  AlertCircle,
  Monitor,
  Link2,
  FileCode,
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
  FileText as FileTextIcon,
  MessageSquare as MessageSquareIcon,
  Mail,
  Calendar,
  MapPin,
  Globe,
  Factory,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'stores-activities', label: 'Stores Activities' },
  { id: 'explaining-activities', label: 'Explaining Activities' },
  { id: 'advantages-limitations', label: 'Advantages & Limitations' },
  { id: 'standardisation', label: 'Standardisation' },
  { id: 'inventory-control', label: 'Inventory Control' },
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
        text: 'The concept of standardisation dates back to ancient civilisations, where standardised weights and measures were used for trade and construction.',
      },
      {
        title: 'Pro Tip',
        text: 'ABC analysis is a powerful inventory control technique. Classify items as A (high value, low quantity), B (moderate), and C (low value, high quantity) to prioritise management efforts.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 10 stores activities: Receiving, Storage, Inventory Control, Issuing, Materials Handling, Record-Keeping, Safety, Housekeeping, Waste Management, Returns Management.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse standardisation with uniformity. Standardisation is about establishing best practices, not making everything identical without reason.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The concept of standardisation dates back to ancient civilisations, where standardised weights and measures were used for trade and construction.',
      },
      {
        title: 'Pro Tip',
        text: 'ABC analysis is a powerful inventory control technique. Classify items as A (high value, low quantity), B (moderate), and C (low value, high quantity) to prioritise management efforts.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 10 stores activities: Receiving, Storage, Inventory Control, Issuing, Materials Handling, Record-Keeping, Safety, Housekeeping, Waste Management, Returns Management.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse standardisation with uniformity. Standardisation is about establishing best practices, not making everything identical without reason.',
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
            Stores Activities &amp;{' '}
            <span className="text-sky-300 font-bold italic">
              Inventory Control
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Comprehensive guide to stores activities, advantages and limitations, standardisation, and the key elements of inventory control.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Package size={14} className="inline mr-1" /> Stores Activities
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ClipboardCheck size={14} className="inline mr-1" /> Inventory Control
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <TrendingUp size={14} className="inline mr-1" /> Standardisation
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
                placeholder="Search for a concept, stores, standardisation..."
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
            {/* SECTION 1: Stores Activities */}
            <div
              ref={(el) => {
                sectionRefs.current['stores-activities'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Stores Activities
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Stores activities encompass a wide range of tasks and processes that are essential for the efficient management of inventory and materials within a storage facility. It is not simply about placing items on shelves; it is a comprehensive system that ensures the accurate receipt, storage, retrieval, and dispatch of goods. Effective stores activities are crucial for maintaining optimal inventory levels, minimizing costs, and supporting overall operational efficiency.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Package size={16} /> Receiving and Inspection
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Accepting incoming materials from suppliers or other departments. Includes verifying quantity and quality against purchase orders or delivery documents. Inspection ensures materials meet quality standards and are free from damage.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Layout size={16} /> Storage and Organization
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Proper placement and organization of materials within the storage facility. Includes assigning storage locations, implementing storage systems, and ensuring materials are stored safely and efficiently.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Database size={16} /> Inventory Control and Management
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Monitoring and controlling inventory levels to ensure materials are available when needed while minimising holding costs. Includes cycle counting, physical inventory counts, and inventory management systems.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Truck size={16} /> Issuing and Dispatching
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Releasing materials to authorised personnel or departments. Includes picking, packing, and dispatching goods. Accurate issuing ensures materials are delivered to the right place at the right time.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Move size={16} /> Materials Handling
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Physical movement of materials within the storage facility. Includes loading, unloading, transporting, and stacking materials. Efficient handling minimises time, reduces damage, and ensures safe movement.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <FileText size={16} /> Record-Keeping and Documentation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Maintaining accurate records of all inventory transactions, including receipts, issues, and transfers. Essential for inventory control, auditing, and financial reporting.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Shield size={16} /> Safety and Security
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Implementing safety procedures and security measures to protect personnel and materials. Includes safety inspections, safety training, and access control systems.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <SettingsIcon size={16} /> Housekeeping and Maintenance
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Maintaining a clean and organised storage facility. Includes sweeping, cleaning, and routine maintenance of equipment and storage systems.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Recycle size={16} /> Waste Management
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Managing and disposing of waste materials generated within the stores. Includes correct disposal of hazardous materials and recycling of recyclable materials.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Undo size={16} /> Returns Management
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Handling and processing of returned goods. Includes inspection of returned goods and correct placement back into inventory.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 2: Explaining the Different Stores Activities */}
            <div
              ref={(el) => {
                sectionRefs.current['explaining-activities'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Explaining the Different Stores Activities
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Stores activities are the core operational processes that govern the flow of materials and inventory within a storage facility. They are not isolated tasks but rather a series of interconnected actions that ensure the efficient management of goods from receipt to dispatch. Understanding and effectively executing these activities is crucial for maintaining optimal inventory levels, minimizing costs, and supporting the overall operational efficiency of an organization.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <ClipboardCheck size={16} /> Receiving and Inspection
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    This is the initial point of contact for incoming materials. It involves the physical acceptance of goods from suppliers or other internal departments. The process begins with verifying the delivery against purchase orders or delivery documents, ensuring that the correct quantities and types of materials have been received. Following this, a thorough inspection is conducted to assess the quality of the goods and identify any damages or discrepancies. This step is crucial for preventing the acceptance of substandard or incorrect materials, which could lead to production delays or customer dissatisfaction. Accurate receiving and inspection are fundamental for maintaining accurate inventory records and ensuring that only quality goods enter the storage facility. This also ensures that the correct amounts are received, which is vital for later stock counts.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <LayersIcon size={16} /> Storage and Organization
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Once materials have been received and inspected, they must be properly stored and organized within the storage facility. This involves assigning appropriate storage locations based on the characteristics of the materials, such as size, weight, and frequency of use. Various storage systems, such as shelving, racking, and bins, are utilized to maximize space utilization and ensure easy access to materials. Proper organization minimizes handling time, prevents damage, and ensures that materials are readily available when needed. This also includes the correct storage of hazardous materials, and temperature controlled items. The labelling of all items, in a clear, and concise manner, is also very important. A well-organized store reduces the risk of accidents.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <BarChart size={16} /> Inventory Control and Management
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    This activity focuses on maintaining optimal inventory levels to meet demand while minimizing holding costs. It involves continuous monitoring of stock levels, tracking inventory movement, and implementing control measures to prevent stockouts or overstocking. Regular cycle counts and physical inventory counts are conducted to ensure accuracy and identify any discrepancies. Inventory management systems, such as barcode scanning and RFID technology, are used to automate data collection and improve efficiency. Effective inventory control and management are essential for optimizing inventory turnover, reducing obsolescence, and improving cash flow. This also includes, the correct forecasting, of future inventory needs.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Truck size={16} /> Issuing and Dispatching
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    This activity involves the release of materials to authorized personnel or departments for production, sales, or other purposes. It includes activities such as picking, packing, and dispatching goods. Accurate picking ensures that the correct materials are selected from storage, while proper packing protects the goods during transit. Dispatching involves coordinating the movement of goods to their destination, whether it is an internal department or an external customer. Proper documentation, such as issue slips and delivery notes, is essential for tracking material movement and maintaining accurate records. This ensures that the correct items, are sent to the correct location.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Move size={16} /> Materials Handling
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    This activity encompasses the physical movement of materials within the storage facility. It includes activities such as loading, unloading, transporting, and stacking materials. Efficient materials handling minimizes handling time, reduces the risk of damage, and ensures that materials are moved safely. The use of appropriate materials handling equipment, such as forklifts, pallet jacks, and conveyors, is crucial for optimizing efficiency and preventing injuries. This also includes, the correct lifting techniques, to avoid injuries.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <FileText size={16} /> Record-Keeping and Documentation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Maintaining accurate records of all inventory transactions is essential for inventory control, auditing, and financial reporting. This activity involves data entry, filing, and generating reports related to inventory receipts, issues, transfers, and adjustments. Accurate record-keeping provides a clear audit trail and ensures that all inventory movements are properly documented. This also includes the safe storage of all documentation, both physical, and digital.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Shield size={16} /> Safety and Security
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Ensuring the safety of personnel and the security of materials is a critical aspect of stores activities. This involves implementing safety procedures, providing safety training, and conducting regular safety inspections. Security measures, such as access control systems and surveillance cameras, are implemented to prevent theft and unauthorized access. Proper storage of hazardous materials and the implementation of emergency response plans are also essential. This also includes, fire prevention, and spill control.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Wrench size={16} /> Housekeeping and Maintenance
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Maintaining a clean and organized storage facility is essential for safety, efficiency, and preventing damage to materials. This activity involves regular cleaning, sweeping, and organizing storage areas. Routine maintenance of equipment and storage systems is also conducted to ensure that they are in good working order. A clean and well-maintained store increases employee morale.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Recycle size={16} /> Waste Management
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    This activity involves the correct handling, and disposal of all waste materials, generated within the stores area. This includes the correct disposal of hazardous waste, and the correct recycling of recyclable items.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Undo size={16} /> Returns Management
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    This activity involves the handling, and processing of returned goods. This includes the inspection of returned goods, to determine their condition, and then the correct placement of these goods back into inventory.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: Advantages and Limitations */}
            <div
              ref={(el) => {
                sectionRefs.current['advantages-limitations'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Advantages and Limitations of Stores Activities
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Stores activities, while fundamental to efficient inventory and materials management, present both significant advantages and inherent limitations. Understanding these aspects is crucial for optimizing operations and mitigating potential challenges. The effectiveness of stores activities directly impacts operational efficiency, cost control, and overall supply chain performance.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Award size={16} /> Advantages
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li>
                      <span className="font-bold">Improved Inventory Control and Accuracy:</span>
                      <p className="mt-1">Well-defined stores activities, particularly those involving receiving, inspection, and inventory control, significantly enhance inventory accuracy. By implementing robust tracking systems, conducting regular stock counts, and adhering to strict documentation procedures, organizations can minimize discrepancies between physical and recorded inventory. This accuracy reduces the risk of stockouts, overstocking, and obsolescence, leading to improved operational efficiency and cost savings. Accurate inventory data is also vital for financial reporting, and auditing.</p>
                    </li>
                    <li>
                      <span className="font-bold">Enhanced Operational Efficiency:</span>
                      <p className="mt-1">Efficient stores activities streamline the flow of materials, minimizing handling time and reducing lead times. Proper storage and organization facilitate quick retrieval of materials, supporting timely production and order fulfilment. Effective materials handling practices, using appropriate equipment and techniques, further contribute to operational efficiency. This streamlined flow, reduces downtime, and increases productivity.</p>
                    </li>
                    <li>
                      <span className="font-bold">Reduced Costs:</span>
                      <p className="mt-1">Effective stores activities contribute to cost reduction in several ways. Optimized inventory control minimizes holding costs associated with excess stock. Proper storage and handling prevent damage and obsolescence, reducing waste and write-offs. Efficient materials handling reduces labour costs and minimizes the risk of accidents. Furthermore, accurate record-keeping and documentation prevent discrepancies and financial losses. This cost reduction, increases profit margins.</p>
                    </li>
                    <li>
                      <span className="font-bold">Improved Safety and Security:</span>
                      <p className="mt-1">Stores activities emphasize safety and security, protecting both personnel and materials. Implementing safety procedures, providing safety training, and conducting regular safety inspections minimize the risk of accidents and injuries. Security measures, such as access control and surveillance systems, prevent theft and unauthorized access. Proper storage of hazardous materials and the implementation of emergency response plans ensure a safe working environment. This is vital, to avoid legal issues, and to protect employees.</p>
                    </li>
                    <li>
                      <span className="font-bold">Enhanced Customer Satisfaction:</span>
                      <p className="mt-1">Efficient stores activities contribute to enhanced customer satisfaction by ensuring timely order fulfilment and product availability. Accurate inventory control minimizes the risk of stockouts, ensuring that customer orders are met promptly. Proper handling and storage prevent damage, ensuring that products arrive in good condition. This leads to increased customer loyalty and repeat business.</p>
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertTriangle size={16} /> Limitations
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li>
                      <span className="font-bold">Potential for Human Error:</span>
                      <p className="mt-1">Stores activities, particularly those involving manual processes, are susceptible to human error. Inaccurate data entry, incorrect picking, and improper handling can lead to inventory discrepancies, delays, and financial losses. This is especially true when there is a high volume of transactions.</p>
                    </li>
                    <li>
                      <span className="font-bold">Dependence on Physical Space:</span>
                      <p className="mt-1">Stores activities are inherently dependent on physical space. Limited storage capacity can restrict inventory levels and hinder operational efficiency. Expanding storage space can be costly and may not always be feasible. This limitation can be amplified in areas with high real estate costs.</p>
                    </li>
                    <li>
                      <span className="font-bold">Risk of Obsolescence and Damage:</span>
                      <p className="mt-1">Despite efforts to minimize these risks, stores activities cannot eliminate the risk of obsolescence and damage. Changes in market demand, technological advancements, and environmental factors can lead to inventory obsolescence. Improper storage and handling can result in damage, spoilage, or deterioration of materials. This is especially true for perishable goods.</p>
                    </li>
                    <li>
                      <span className="font-bold">Complexity and Coordination:</span>
                      <p className="mt-1">Stores activities involve a complex interplay of various processes and functions. Effective coordination between receiving, storage, inventory control, and dispatch is essential for smooth operations. This coordination can be challenging, especially in large organizations with multiple storage facilities. This complexity can lead to delays.</p>
                    </li>
                    <li>
                      <span className="font-bold">Technology Dependence and Implementation Costs:</span>
                      <p className="mt-1">While technology can enhance the efficiency of stores activities, it also introduces a dependence on technology. Implementing and maintaining inventory management systems, barcode scanners, and other technologies can be costly. Furthermore, technical glitches or system failures can disrupt operations. This can cause downtime, and lost revenue.</p>
                    </li>
                    <li>
                      <span className="font-bold">Susceptibility to External Factors:</span>
                      <p className="mt-1">Stores activities can be significantly impacted by external factors such as supply chain disruptions, natural disasters, and economic downturns. These factors can lead to material shortages, delivery delays, and fluctuations in demand. This means that contingency plans, must be put into place.</p>
                    </li>
                    <li>
                      <span className="font-bold">Difficulty in Forecasting Demand:</span>
                      <p className="mt-1">Even with the best technology, and data, forecasting demand can be very difficult. This means that there is always a risk of overstocking, or understocking.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 4: Standardisation */}
            <div
              ref={(el) => {
                sectionRefs.current['standardisation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Standardisation
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Standardisation is the process of developing and implementing technical standards based on the consolidated results of science, technology, and experience. It is about creating a common set of rules, guidelines, or characteristics for activities or their results, aimed at achieving the optimum degree of order in a given context. It is not just about uniformity; it is about efficiency, safety, quality, and interoperability. By establishing agreed-upon standards, organizations can streamline processes, reduce costs, and enhance the reliability and compatibility of products and services.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <TrendingUp size={16} /> Improved Efficiency and Productivity
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Standardisation streamlines processes and eliminates unnecessary variations, leading to improved efficiency and productivity. By establishing consistent procedures, workflows, and specifications, organizations can reduce duplication of effort, minimize errors, and optimize resource utilization. Standardised work practices ensure that tasks are performed consistently and efficiently, regardless of who is performing them. This leads to faster production cycles, reduced lead times, and increased output. This efficiency translates to cost savings, and increased profitability.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Award size={16} /> Enhanced Quality and Reliability
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Standardisation promotes quality and reliability by establishing clear benchmarks and specifications. By adhering to established standards, organizations can ensure that products and services consistently meet customer expectations. Standardised quality control procedures and testing methods ensure that products are manufactured to a high level of consistency and reliability. This reduces the risk of defects, recalls, and customer complaints, enhancing brand reputation and customer trust. This also ensures that the products are safe for the customer.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <DollarSign size={16} /> Reduced Costs and Waste
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Standardisation helps to reduce costs and waste by eliminating unnecessary variations and inefficiencies. By using standardised components, materials, and processes, organizations can achieve economies of scale, reduce inventory costs, and minimize waste. Standardised designs and specifications facilitate easier maintenance and repair, reducing downtime and maintenance costs. Furthermore, standardised packaging and labelling reduce shipping and handling costs. This cost reduction, allows for more competitive pricing.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <LayersIcon size={16} /> Increased Interoperability and Compatibility
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Standardisation promotes interoperability and compatibility between products, systems, and services. By adhering to common standards, organizations can ensure that their products and services can seamlessly integrate with those of other organizations. This is particularly important in industries such as telecommunications, information technology, and manufacturing. Standardised interfaces and protocols facilitate data exchange, communication, and collaboration, leading to improved efficiency and innovation. This interoperability allows for easier integration of new technologies.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Shield size={16} /> Improved Safety and Health
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Standardisation plays a crucial role in improving safety and health by establishing safety standards and guidelines. By adhering to established safety standards, organizations can minimize the risk of accidents, injuries, and health hazards. Standardised safety procedures and equipment ensure that workplaces are safe and compliant with regulations. This is especially important in industries such as construction, manufacturing, and healthcare. This also protects the customer, from unsafe products.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <GlobeIcon size={16} /> Facilitation of Trade and Market Access
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Standardisation facilitates trade and market access by establishing internationally recognized standards. By adhering to international standards, organizations can ensure that their products and services meet the requirements of global markets. This eliminates technical barriers to trade and promotes international collaboration. Standardised certifications and conformity assessment procedures build trust and confidence among customers and regulators. This allows for easier access to international markets.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Lightbulb size={16} /> Promotion of Innovation and Technological Advancement
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    While standardisation establishes a framework for consistency, it also promotes innovation and technological advancement. Standards provide a foundation for developing new technologies and improving existing ones. By establishing common platforms and interfaces, standards facilitate the development of new products and services that are compatible with existing infrastructure. Furthermore, standards can drive innovation by establishing performance benchmarks and encouraging the development of new technologies to meet or exceed those benchmarks. This also allows for the sharing of best practices.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <MessageSquare size={16} /> Enhanced Communication and Understanding
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Standardisation promotes clear and consistent communication by establishing common terminology, symbols, and units of measurement. This eliminates ambiguity and ensures that information is accurately conveyed. Standardised documentation and reporting formats facilitate data exchange and analysis. This also prevents misunderstandings, due to different interpretations.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <ListChecks size={16} /> Regulatory Compliance
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Standardisation helps organizations comply with regulations by providing a framework for meeting legal and regulatory requirements. By adhering to established standards, organizations can ensure that their products and services meet the necessary safety, environmental, and quality requirements. This reduces the risk of penalties and legal action.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 5: Elements of Inventory Control */}
            <div
              ref={(el) => {
                sectionRefs.current['inventory-control'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Elements of Inventory Control
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Inventory control is the systematic process of managing and regulating the quantity, location, and usage of inventory items. It is not just about counting stock; it is a strategic approach to ensuring that the right amount of inventory is available at the right time, minimizing costs, and maximizing customer satisfaction. Effective inventory control is crucial for maintaining a healthy balance between supply and demand, preventing stockouts and overstocking, and optimizing working capital.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <TrendingUp size={16} /> Demand Forecasting
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Accurate demand forecasting is the foundation of effective inventory control. It involves predicting future demand for products or materials based on historical data, market trends, and other relevant factors. This allows organizations to anticipate their inventory needs and avoid both stockouts and excessive inventory holding costs. Various forecasting techniques, such as statistical analysis, trend analysis, and seasonal adjustments, are used to improve forecast accuracy. Demand forecasting is not a one-time activity; it requires continuous monitoring and adjustment to reflect changing market conditions and customer demands. This element is vital, because it sets the baseline, for all inventory control decisions.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Eye size={16} /> Inventory Tracking and Monitoring
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Real-time tracking and monitoring of inventory levels are essential for effective control. This involves implementing systems and processes to track the movement of inventory, from receiving to dispatch. Barcode scanning, RFID technology, and inventory management software are commonly used to automate data collection and provide real-time visibility into inventory levels. This allows organizations to identify potential stockouts or overstocking situations promptly and take corrective action. Accurate inventory tracking ensures that inventory records are up-to-date and reliable, providing a solid foundation for decision-making. This also allows for the tracking of inventory location.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <DollarSign size={16} /> Inventory Valuation and Costing
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Accurate inventory valuation and costing are crucial for financial reporting and decision-making. This involves determining the value of inventory using methods such as FIFO (first-in, first-out), LIFO (last-in, first-out), or weighted average cost. Tracking inventory costs, including purchasing costs, holding costs, and ordering costs, allows organizations to assess the profitability of inventory items and identify areas for cost reduction. This also includes, the correct calculation of the cost of goods sold. This is vital, for accurate financial statements.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <RefreshCw size={16} /> Inventory Replenishment Policies
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Establishing clear inventory replenishment policies is essential for ensuring that inventory is replenished in a timely and efficient manner. This involves determining the optimal order quantity, reorder point, and lead time for each inventory item. Techniques such as economic order quantity (EOQ), reorder point (ROP), and safety stock calculations are used to optimize replenishment decisions. Replenishment policies should be regularly reviewed and adjusted to reflect changes in demand, lead times, and other factors. This ensures that stock levels, are always at the correct levels.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Filter size={16} /> Inventory Classification and Categorization
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Classifying and categorizing inventory items based on their value, demand, or other relevant criteria allows organizations to prioritize inventory control efforts. ABC analysis, which classifies inventory items into A, B, and C categories based on their value, is a commonly used technique. This helps organizations to focus their attention on the most critical inventory items and allocate resources accordingly. This allows for the correct allocation of resources.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <ClipboardCheck size={16} /> Inventory Auditing and Cycle Counting
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Regular inventory audits and cycle counts are essential for ensuring the accuracy of inventory records and identifying discrepancies. Cycle counting involves counting a small portion of inventory items on a regular basis, while physical inventory counts involve counting all inventory items at a specific point in time. These activities help to identify and correct errors, prevent shrinkage, and ensure that inventory records are reliable. This also acts as a deterrent, to theft.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Package size={16} /> Inventory Storage and Handling
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Proper storage and handling of inventory items are crucial for preventing damage, spoilage, and obsolescence. This involves implementing appropriate storage systems, such as shelving, racking, and bins, and ensuring that materials are handled safely and efficiently. Proper storage conditions, such as temperature and humidity control, are also essential for certain types of inventory items. This also includes the correct labelling of all items.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Gauge size={16} /> Inventory Performance Measurement
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Regularly measuring and analysing inventory performance is essential for evaluating the effectiveness of inventory control practices. Key performance indicators (KPIs) such as inventory turnover, stockout rates, and holding costs are used to assess performance and identify areas for improvement. This allows for continuous improvement, of inventory control processes.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Cpu size={16} /> Technology Implementation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The correct implementation of technology is vital to good inventory control. This includes things such as, barcode scanners, RFID tags, and inventory management software. These tools provide real time data and improve accuracy.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Lock size={16} /> Security Measures
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    This is the implementation of security measures, to protect inventory. This includes things like, security cameras, access control, and security personnel.
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
                  💡 Stores Insight
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
                  <span>Stores Activities</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Elements of Inventory Control</span>
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
                Effective stores activities and inventory control are essential for operational efficiency. Understand the full range of stores activities—receiving, storage, issuing, materials handling, and more. Recognise the advantages and limitations of stores operations. Standardisation brings efficiency, quality, and cost reduction. The elements of inventory control—forecasting, tracking, valuation, replenishment, classification, auditing, storage, performance measurement, technology, and security—provide a comprehensive framework for managing inventory effectively.
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
                <strong className="text-white">Stores Activities</strong> – include receiving, storage, inventory control, issuing, materials handling, record-keeping, safety, housekeeping, waste management, and returns management.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Advantages</strong> – improved inventory control, enhanced operational efficiency, reduced costs, improved safety, and enhanced customer satisfaction.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Limitations</strong> – potential for human error, dependence on physical space, risk of obsolescence, complexity, technology dependence, susceptibility to external factors, and difficulty in forecasting demand.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Standardisation</strong> – improves efficiency, quality, cost reduction, interoperability, safety, trade facilitation, innovation, communication, and regulatory compliance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Inventory Control</strong> – elements include demand forecasting, tracking, valuation, replenishment policies, classification, auditing, storage, performance measurement, technology, and security measures.
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
            Sidemann Academic Registry • ND Purchasing &amp; Supply – Stores &amp; Inventory Control 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;
