import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  ClockIcon,
  Layout,
  Target,
  GlobeIcon,
  Shield,
  ListChecks,
  LayersIcon,
  Database,
  Package,
  ClipboardCheck,
  Truck,
  Move,
  Gauge,
  Award,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Users,
  Cpu as Crane,
  Box,
  Scan,
  Dock,
  Cpu,
  BookOpen,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
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
  MessageSquare,
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
  { id: 'benefits', label: 'Benefits' },
  { id: 'equipment', label: 'Storage & Handling Equipment' },
  { id: 'double-handling', label: 'Double Handling Effects' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome4: React.FC = () => {
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
        text: 'Double handling can account for up to 30% of total warehouse operating costs. Eliminating unnecessary movements is one of the most effective ways to improve efficiency.',
      },
      {
        title: 'Pro Tip',
        text: 'When selecting storage and handling equipment, consider the total cost of ownership, including maintenance, energy consumption, and training requirements.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 10 benefits of proper materials handling: Safety, Efficiency, Waste Reduction, Space Utilisation, Inventory Accuracy, Employee Morale, Compliance, Cost Savings, Supply Chain Efficiency, Customer Satisfaction.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t underestimate the impact of double handling. Even small inefficiencies can multiply across hundreds or thousands of movements, leading to significant costs.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Double handling can account for up to 30% of total warehouse operating costs. Eliminating unnecessary movements is one of the most effective ways to improve efficiency.',
      },
      {
        title: 'Pro Tip',
        text: 'When selecting storage and handling equipment, consider the total cost of ownership, including maintenance, energy consumption, and training requirements.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 10 benefits of proper materials handling: Safety, Efficiency, Waste Reduction, Space Utilisation, Inventory Accuracy, Employee Morale, Compliance, Cost Savings, Supply Chain Efficiency, Customer Satisfaction.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t underestimate the impact of double handling. Even small inefficiencies can multiply across hundreds or thousands of movements, leading to significant costs.',
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Materials Handling &{' '}
            <span className="text-amber-300 font-bold italic">
              Double Handling Effects
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Comprehensive guide to the benefits of proper materials handling, equipment used for storage and handling, and the effects of double handling.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Package size={14} className="inline mr-1" /> Materials Handling
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ClipboardCheck size={14} className="inline mr-1" /> Equipment
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <AlertTriangle size={14} className="inline mr-1" /> Double Handling
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
                placeholder="Search for a concept, equipment, double handling..."
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
            {/* SECTION 1: Benefits of Proper Materials Handling */}
            <div
              ref={(el) => {
                sectionRefs.current['benefits'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Benefits of Proper Materials Handling
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Materials handling encompasses the movement, storage, control, and protection of materials and products throughout the manufacturing, warehousing, distribution, consumption, and disposal processes. It is not just about moving items from point A to point B; it is about optimizing the flow of materials to enhance efficiency, safety, and cost-effectiveness. Equipping employees with proper materials handling skills is crucial for minimizing risks, maximizing productivity, and ensuring a smooth and safe operational environment.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Shield size={16} /> Reduced Workplace Injuries and Accidents
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Proper materials handling techniques significantly reduce the risk of workplace injuries and accidents. Incorrect lifting, carrying, and moving heavy or awkward items can lead to back injuries, strains, sprains, and other musculoskeletal disorders. Training employees on proper lifting techniques, using appropriate materials handling equipment, and understanding ergonomic principles minimizes these risks. A well-trained workforce is less likely to engage in unsafe practices, reducing the likelihood of accidents that can result in injuries, downtime, and financial losses. This also helps to reduce the amount of compensation claims.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <TrendingUp size={16} /> Increased Efficiency and Productivity
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Proper materials handling streamlines workflows, reduces handling time, and optimizes the flow of materials. By implementing efficient materials handling systems and techniques, organizations can minimize delays, reduce bottlenecks, and improve overall productivity. Well-trained employees can handle materials more quickly and efficiently, reducing the time required for tasks such as loading, unloading, and moving materials within the facility. This increased efficiency translates to faster production cycles, improved order fulfilment rates, and enhanced customer satisfaction. This also reduces the amount of wasted time.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Award size={16} /> Reduced Material Damage and Waste
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Proper materials handling minimizes the risk of damage to materials and products during handling, storage, and transportation. By using appropriate handling techniques and equipment, organizations can prevent damage from impacts, drops, and other hazards. Proper storage practices, such as using appropriate containers and storage systems, further protect materials from damage and deterioration. Reducing material damage and waste leads to cost savings, improved product quality, and reduced environmental impact. This also reduces the need for replacement materials.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Layout size={16} /> Improved Space Utilization
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Proper materials handling practices optimize space utilization within storage facilities and warehouses. By using efficient storage systems and techniques, organizations can maximize the use of available space and minimize storage costs. Proper stacking, shelving, and organization of materials ensure that space is used effectively and that materials are easily accessible. This also includes the correct use of vertical space.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Database size={16} /> Enhanced Inventory Control and Accuracy
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Proper materials handling facilitates accurate inventory control and tracking. By implementing clear labelling, coding, and tracking systems, organizations can minimize errors and ensure that inventory records are accurate. This allows for real-time visibility into inventory levels and movements, preventing stockouts and overstocking. Accurate inventory control improves order fulfilment rates, reduces discrepancies, and enhances customer satisfaction. This also reduces the risk of theft.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Users size={16} /> Improved Employee Morale and Job Satisfaction
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Providing employees with proper materials handling training and equipment demonstrates a commitment to their safety and well-being. This can lead to improved employee morale and job satisfaction. Employees who feel safe and supported are more likely to be engaged and productive. Furthermore, proper materials handling can reduce physical strain and fatigue, improving the overall work experience. This also increases employee loyalty.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <ListChecks size={16} /> Compliance with Safety Regulations
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Proper materials handling practices ensure compliance with safety regulations and standards. By adhering to established guidelines, organizations can avoid penalties and legal issues related to workplace safety. Compliance with safety regulations also demonstrates a commitment to employee safety and well-being. This also helps to protect the company's reputation.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <DollarSign size={16} /> Cost Savings
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Proper materials handling leads to cost savings in several ways. Reduced workplace injuries and accidents minimize workers' compensation claims and lost productivity. Reduced material damage and waste minimize the need for replacements and repairs. Increased efficiency and productivity reduce labour costs and improve overall operational efficiency. This also includes reduced insurance premiums.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-globe-600 dark:text-globe-400 flex items-center gap-2">
                    <GlobeIcon size={16} /> Improved Supply Chain Efficiency
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Proper materials handling improves the efficiency of the overall supply chain. By minimizing delays, reducing errors, and optimizing material flow, organizations can enhance their ability to meet customer demands and maintain a competitive edge. This also allows for better communication, with suppliers, and customers.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Target size={16} /> Enhanced Customer Satisfaction
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    By ensuring timely delivery of undamaged goods, proper materials handling contributes to enhanced customer satisfaction. This leads to increased customer loyalty and repeat business. This also includes, the correct packaging, and labelling, of goods.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 2: Equipment Used for Storage and Handling Materials */}
            <div
              ref={(el) => {
                sectionRefs.current['equipment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Equipment Used for Storage and Handling Materials
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Efficient storage and handling of materials are crucial for optimizing warehouse operations, reducing costs, and ensuring safety. A wide array of equipment is available, each designed for specific purposes and material types. Selecting the right equipment is essential for streamlining processes, minimizing damage, and maximizing productivity. This equipment ranges from simple hand tools to complex automated systems, catering to diverse storage and handling needs.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <LayersIcon size={16} /> Shelving and Racking Systems
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    These systems provide organized storage solutions for various materials, maximizing vertical space utilization. Shelving units are typically used for storing smaller items, while racking systems are designed for heavier loads and palletized goods. Racking systems can be further categorized into pallet racking, cantilever racking, and drive-in racking, each suited for specific storage requirements. The selection of shelving and racking depends on factors such as the weight and size of materials, storage density requirements, and accessibility needs. Properly designed and installed shelving and racking systems enhance storage capacity, improve organization, and facilitate easy retrieval of materials. These systems also allow for the correct storage of different types of materials, and ensure the safe storage of heavy items.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Truck size={16} /> Forklifts and Pallet Jacks
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Forklifts and pallet jacks are essential for moving palletized materials within a warehouse. Forklifts are motorized vehicles equipped with forks for lifting and transporting heavy loads, while pallet jacks are manually operated or electric-powered devices for moving pallets over short distances. Forklifts offer greater lifting capacity and manoeuvrability, allowing for efficient handling of heavy and bulky items. Pallet jacks are ideal for moving pallets in confined spaces and for short-distance transport. Proper training and certification are required for operating forklifts to ensure safety and prevent accidents. These devices, greatly increase the speed, and efficiency, of moving palletized goods.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Move size={16} /> Conveyor Systems
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Conveyor systems are used for automated transportation of materials between different areas of a warehouse. They consist of a series of rollers, belts, or chains that move materials along a predetermined path. Conveyor systems can be customized to suit specific material handling requirements, such as sorting, accumulating, and transporting materials over long distances. They enhance efficiency by automating material flow, reducing manual handling, and minimizing transportation time. Conveyor systems are especially useful in high-volume operations where continuous material flow is essential. These systems, also reduce the risk of injury, from manual handling.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Database size={16} /> Automated Storage and Retrieval Systems (AS/RS)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    AS/RS are automated systems that use robots or cranes to store and retrieve materials from designated storage locations. They provide high-density storage, improve inventory accuracy, and enhance retrieval speed. AS/RS systems are ideal for organizations with high storage density requirements and frequent material movement. They can be integrated with inventory management systems to provide real-time visibility into inventory levels and locations. AS/RS systems significantly reduce labour costs and improve overall warehouse efficiency. These systems, are very accurate, and reduce the risk of human error.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Cpu size={16} /> Automated Guided Vehicles (AGVs) and Robots
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    AGVs and robots are used for automated materials handling within a warehouse. AGVs are self-guided vehicles that follow predetermined paths, while robots are more versatile and can perform a wider range of tasks. They can be used for tasks such as picking, packing, and sorting materials. AGVs and robots improve efficiency, reduce labour costs, and enhance safety by automating repetitive and hazardous tasks. They can also operate 24/7, increasing overall productivity. These systems, increase the speed, and accuracy, of warehouse operations.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Box size={16} /> Storage Bins and Containers
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Storage bins and containers are used for organizing and storing small parts and components. They come in various sizes and materials, allowing for flexible storage solutions. Storage bins and containers help to prevent damage to materials, improve organization, and facilitate easy retrieval. They can be used in conjunction with shelving systems to create organized storage areas. These containers, also help to protect items from dust, and other contaminants.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                    <Crane size={16} /> Cranes and Hoists
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Cranes and hoists are used for lifting and moving heavy or bulky materials. They can be overhead cranes, gantry cranes, or jib cranes, each suited for specific lifting requirements. Cranes and hoists enhance safety and efficiency by automating heavy lifting tasks. They are essential for handling materials that are too heavy or awkward to be moved manually. These items, reduce the risk of injury, from manual lifting.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Package size={16} /> Packaging Equipment
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Packaging equipment, such as wrapping machines, sealing machines, and labelling machines, is used to prepare materials for shipping or storage. These machines automate packaging processes, improving efficiency, and ensuring consistent packaging quality. Packaging equipment helps to protect materials during transit and ensures that they are properly labelled and identified. This also increases the speed, of the packaging process.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Dock size={16} /> Dock Equipment
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Dock equipment, such as dock levellers, dock seals, and truck restraints, is used to facilitate loading and unloading operations at loading docks. Dock levellers bridge the gap between the loading dock and the truck, while dock seals prevent air leakage and protect materials from weather conditions. Truck restraints secure trucks to the loading dock, preventing accidents. This equipment, increases the safety, and efficiency, of loading, and unloading operations.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Scan size={16} /> Barcode Scanners and RFID Readers
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    These devices are used to capture data from barcodes or RFID tags, allowing for accurate inventory tracking and management. Barcode scanners and RFID readers automate data collection, reducing manual errors and improving efficiency. They provide real-time visibility into inventory levels and locations, facilitating better inventory control. This data, is vital for inventory control.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: Effects of Double Handling */}
            <div
              ref={(el) => {
                sectionRefs.current['double-handling'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Effects of Double Handling
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Double handling, the unnecessary movement of materials or products within a warehouse or production facility, is a significant source of inefficiency and cost in supply chain operations. It is not merely a matter of wasted time; it is a cascade of negative effects that ripple through the entire operation, impacting profitability, productivity, and customer satisfaction. Understanding the detrimental effects of double handling is crucial for organizations seeking to optimize their processes and minimize waste.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <DollarSign size={16} /> Increased Labour Costs
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Double handling directly translates to increased labour costs. Each unnecessary movement of materials requires additional labour time, which translates to higher wages and overtime expenses. This is especially significant in labour-intensive operations where materials are frequently moved. The extra handling not only adds to the direct labour cost but also reduces the time available for value-added activities. Employees who are constantly moving materials are less productive in their primary roles. The cumulative effect of these extra movements can significantly impact the overall labour budget and reduce efficiency.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Gauge size={16} /> Reduced Throughput and Productivity
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Double handling slows down the flow of materials, leading to reduced throughput and overall productivity. Each additional movement creates a bottleneck, delaying subsequent processes and impacting the efficiency of the entire operation. This results in longer lead times, slower order fulfilment, and reduced output. In manufacturing settings, this can lead to production delays and missed deadlines. In warehousing and distribution, it can result in slower order processing and shipping. This slowdown has a knock-on effect, on every stage of the process.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertTriangle size={16} /> Increased Material Damage and Waste
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Each time materials are handled, there is an increased risk of damage from impacts, drops, and other hazards. Double handling increases the likelihood of materials being damaged, leading to waste, rework, and increased costs. This is particularly problematic for fragile or delicate items. Damaged materials may need to be repaired, replaced, or scrapped, leading to additional expenses and delays. This also increases the amount of waste that is generated.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <ClockIcon size={16} /> Increased Handling Time and Delays
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Double handling adds unnecessary time to the handling process, leading to delays in production, order fulfilment, and delivery. Each extra movement requires time for loading, unloading, and transportation, which can accumulate significantly over time. This can result in longer lead times, missed deadlines, and customer dissatisfaction. Delays caused by double handling can also disrupt the flow of materials to other departments or processes, creating a domino effect of delays throughout the operation. This time could have been used for value added activities.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Layout size={16} /> Increased Storage Costs
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Double handling often results in materials being stored in multiple locations, leading to increased storage costs. This includes costs associated with additional storage space, equipment, and labour. Furthermore, materials that are frequently moved may require more space for temporary storage, adding to the overall storage footprint. Inefficient storage practices can also lead to clutter and disorganization, making it more difficult to locate and retrieve materials. This also increases the risk of damage, due to poor storage conditions.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Shield size={16} /> Increased Risk of Accidents and Injuries
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Each time materials are handled, there is a risk of accidents and injuries. Double handling increases the likelihood of these incidents, leading to potential injuries, downtime, and workers' compensation claims. The extra movements increase the exposure of workers to hazards such as heavy lifting, awkward postures, and potential collisions with material handling equipment. This also increases the risk of repetitive strain injuries.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Database size={16} /> Reduced Inventory Accuracy
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Double handling can lead to inaccuracies in inventory records. As materials are moved multiple times, there is a greater chance of errors in tracking and recording their movements. This can result in discrepancies between physical inventory and recorded inventory, leading to stockouts or overstocking. Inaccurate inventory data can also lead to poor decision-making regarding procurement, production, and sales. This also increases the risk of theft.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Target size={16} /> Decreased Customer Satisfaction
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Delays and errors caused by double handling can lead to customer dissatisfaction. Late deliveries, damaged goods, and inaccurate orders can damage a company's reputation and lead to lost business. This is especially true in today's competitive market, where customers expect fast and accurate service. This also impacts customer loyalty.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-globe-600 dark:text-globe-400 flex items-center gap-2">
                    <GlobeIcon size={16} /> Increased Energy Consumption
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Each movement of materials requires energy, whether it is from manual labour or powered equipment. Double handling increases energy consumption, leading to higher operating costs and a larger carbon footprint. This is especially relevant in automated warehouses or facilities with extensive conveyor systems. This increased energy usage, also increases the environmental impact.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-layout-600 dark:text-layout-400 flex items-center gap-2">
                    <Layout size={16} /> Reduced Space Utilization
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Double handling can lead to inefficient use of space, as materials are moved and stored in multiple locations. This can result in clutter and disorganization, making it difficult to locate and retrieve materials. This also reduces the amount of space, that is available for other activities.
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
                  💡 Materials Handling Insight
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
                  <span>Benefits</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Equipment Types</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Double Handling Effects</span>
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
                Materials handling is a critical function that impacts safety, efficiency, and cost. Proper handling techniques reduce injuries, improve productivity, and minimise waste. Choosing the right equipment—shelving, forklifts, conveyors, AS/RS, AGVs, etc.—is essential for optimising operations. Double handling is a major source of inefficiency, leading to increased labour costs, reduced throughput, damage, delays, and customer dissatisfaction. Eliminating unnecessary movements is key to operational excellence.
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
                <strong className="text-white">Benefits</strong> – reduced injuries, increased efficiency, less damage, better space utilisation, improved inventory accuracy, higher morale, compliance, cost savings, supply chain efficiency, and customer satisfaction.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Equipment</strong> – shelving/racking, forklifts/pallet jacks, conveyors, AS/RS, AGVs/robots, storage bins, cranes/hoists, packaging equipment, dock equipment, and barcode scanners/RFID readers.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Double Handling Effects</strong> – increased labour costs, reduced throughput, more damage, longer handling times, higher storage costs, more accidents, reduced inventory accuracy, decreased customer satisfaction, increased energy consumption, and reduced space utilisation.
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
            Sidemann Academic Registry • ND Purchasing &amp; Supply – Materials Handling 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;
