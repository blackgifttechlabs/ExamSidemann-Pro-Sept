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
  TrendingUp,
  Award,
  Users,
  ClipboardCheck,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  AlertCircle,
  RefreshCw,
  HeartHandshake,
  Scale,
  Gavel,
  Leaf,
  Briefcase,
  Handshake,
  Building2,
  UserCheck,
  Sparkles,
  Package,
  Truck,
  Warehouse,
  Clipboard,
  LineChart,
  Boxes,
  Recycle,
  Calculator,
  ShoppingCart,
  Inbox,
  ClipboardList,
  CheckCircle,
  Cloud,
  Clock,
  Filter,
  Grid,
  Move,
  Scan,
  ShieldCheck,
  Sparkle,
  BookOpen as BookOpenIcon,
  Search,
  X as XIcon,
  Lightbulb,
  RefreshCw as RefreshIcon,
  ChevronUp,
  AlertTriangle,
  Monitor,
  Cpu,
  Link2,
  FileCode,
  FolderTree as FolderTreeIcon,
  UserCheck as UserCheckIcon,
  GraduationCap,
  Briefcase as BriefcaseIcon,
  Rocket,
  Menu,
  MousePointer,
  Touchpad,
  Grid3X3,
  Palette,
  Settings,
  FileText as FileTextIcon,
  MessageSquare,
  Handshake as HandshakeIcon,
  Scale as ScaleIcon,
  Landmark,
  PiggyBank,
  CloudRain,
  Sun,
  Wind,
  ArrowRightCircle,
  GitBranch,
  Store,
  HardDrive,
  Building,
  MessageSquare as MessageSquareIcon,
  Mail,
  Calendar,
  MapPin,
  Globe as GlobeIcon,
  Factory,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'elements', label: 'Elements' },
  { id: 'objectives', label: 'Objectives' },
  { id: 'significance', label: 'Significance' },
  { id: 'stores-organisation', label: 'Stores Organisation' },
  { id: 'role-in-management', label: 'Role in Management' },
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
        text: 'The concept of Just-In-Time (JIT) inventory was pioneered by Toyota in the 1970s and revolutionised manufacturing by reducing waste and improving efficiency.',
      },
      {
        title: 'Pro Tip',
        text: 'ABC analysis is a powerful tool for inventory management. Classify items as A (high value, low quantity), B (moderate), and C (low value, high quantity) to prioritise management efforts.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 8 elements of materials management: Demand Forecasting, Inventory Control, Procurement, Materials Handling, MRP, Valuation, Waste Management, and Performance Measurement.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse inventory management with materials management. Inventory management focuses on stock levels and control, while materials management is broader and includes procurement, storage, and distribution.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The concept of Just-In-Time (JIT) inventory was pioneered by Toyota in the 1970s and revolutionised manufacturing by reducing waste and improving efficiency.',
      },
      {
        title: 'Pro Tip',
        text: 'ABC analysis is a powerful tool for inventory management. Classify items as A (high value, low quantity), B (moderate), and C (low value, high quantity) to prioritise management efforts.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 8 elements of materials management: Demand Forecasting, Inventory Control, Procurement, Materials Handling, MRP, Valuation, Waste Management, and Performance Measurement.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse inventory management with materials management. Inventory management focuses on stock levels and control, while materials management is broader and includes procurement, storage, and distribution.',
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
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Inventory &amp;{' '}
            <span className="text-emerald-300 font-bold italic">
              Materials Management
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Complete guide to elements, objectives, significance, stores organisation, and the role of materials management across business functions.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Package size={14} className="inline mr-1" /> Elements
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Warehouse size={14} className="inline mr-1" /> Stores Organisation
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <TrendingUp size={14} className="inline mr-1" /> Significance
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
                placeholder="Search for a concept, inventory, stores..."
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
            {/* SECTION 1: Elements of Inventory/Materials Management */}
            <div
              ref={(el) => {
                sectionRefs.current['elements'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Elements of Inventory/Materials Management
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Inventory/materials management is a critical function in any organization that handles physical goods. It is not simply about storing items; it is a comprehensive approach to planning, controlling, and optimizing the flow of materials from procurement to consumption. Effective materials management ensures that the right materials are available at the right time, in the right quantity, and at the right cost.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    This involves a complex interplay of various elements that contribute to the overall efficiency and effectiveness of the supply chain.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <TrendingUp size={16} /> Demand Forecasting
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Accurate demand forecasting is the cornerstone of effective inventory management. It involves predicting future demand for materials based on historical data, market trends, and other relevant factors. This allows organizations to anticipate material needs and avoid stockouts or overstocking. Sophisticated forecasting techniques, such as statistical analysis and machine learning, can be used to improve forecast accuracy. Demand forecasting is not a one-time activity; it requires continuous monitoring and adjustment to reflect changing market conditions and customer demands. This element is vital because it determines the number of materials that will be required. Over forecasting, can lead to excess inventory, and under forecasting, can lead to stock outs.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <ClipboardCheck size={16} /> Inventory Control
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Inventory control focuses on maintaining optimal inventory levels to meet demand while minimizing costs. This involves implementing strategies for tracking inventory, managing stock levels, and controlling inventory movement. Techniques such as ABC analysis, economic order quantity (EOQ), and just-in-time (JIT) inventory management are commonly used. Inventory control also includes implementing systems for cycle counting and physical inventory counts to ensure accuracy. Proper inventory control helps to prevent stockouts, reduce holding costs, and improve cash flow. The inventory control system must be robust, and accurate, to prevent errors.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <ShoppingCart size={16} /> Procurement and Purchasing
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Procurement and purchasing involve the acquisition of materials from suppliers. This includes activities such as supplier selection, negotiation of contracts, and order placement. Effective procurement practices ensure that materials are purchased at competitive prices and that suppliers are reliable and responsive. This also includes, ensuring that the correct quality of materials, are being purchased. Strong supplier relationships are essential for ensuring a smooth and efficient flow of materials. Procurement strategies should be aligned with the organization's overall inventory management goals. This is also where the quality, and ethical sourcing of materials, is ensured.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Truck size={16} /> Materials Handling and Storage
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Materials handling and storage encompass the physical movement and storage of materials within the organization. This includes activities such as receiving, inspecting, storing, and retrieving materials. Efficient materials handling and storage practices minimize handling costs, prevent damage, and ensure that materials are readily available when needed. This also includes the correct storage of hazardous materials. The warehouse layout, and the equipment used, are also vital to efficient materials handling. Correct labelling, and organization, is also essential.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Boxes size={16} /> Materials Requirement Planning (MRP)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  MRP is a planning and control system that uses demand forecasts and inventory data to calculate material requirements. It helps organizations to determine when and how much material to order. MRP systems can also be used to schedule production and manage inventory levels. This system is very useful for organizations that manufacture goods. The MRP system, ensures that materials are available, when they are needed for production.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Calculator size={16} /> Inventory Valuation and Costing
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Inventory valuation and costing involve determining the value of inventory and tracking the costs associated with inventory management. This includes activities such as calculating the cost of goods sold (COGS), valuing inventory using methods such as FIFO (first-in, first-out) or LIFO (last-in, first-out), and analysing inventory costs. Accurate inventory valuation and costing are essential for financial reporting and decision-making. This also allows for the tracking of inventory costs, and the identification of areas where costs can be reduced.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                  <Recycle size={16} /> Waste Management and Disposal
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Effective materials management includes strategies for minimizing waste and properly disposing of obsolete or damaged materials. This involves implementing recycling programs, reducing scrap, and complying with environmental regulations. Proper waste management not only reduces costs but also promotes sustainability. This also includes the safe disposal of hazardous materials.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2">
                  <BarChart3 size={16} /> Performance Measurement and Analysis
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Regular performance measurement and analysis are essential for evaluating the effectiveness of inventory/materials management practices. This involves tracking key performance indicators (KPIs) such as inventory turnover, stockout rates, and order fulfilment times. Analysing performance data helps to identify areas for improvement and optimize inventory management strategies. This ensures that the inventory management system, is constantly being improved.
                </p>
              </div>
            </div>

            {/* SECTION 2: Objectives of Inventory/Materials Management */}
            <div
              ref={(el) => {
                sectionRefs.current['objectives'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Objectives of Inventory/Materials Management
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The objectives of inventory/materials management are multifaceted, aiming to strike a delicate balance between availability and cost-effectiveness. It is not simply about having enough materials on hand; it is about strategically managing resources to optimize operational efficiency, minimize financial risks, and ensure customer satisfaction. Effective inventory/materials management is crucial for maintaining a competitive edge in today's dynamic business environment.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <CheckCircle size={16} /> Ensuring Availability of Materials
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  One of the primary objectives is to ensure the continuous availability of materials required for production or sales. This involves maintaining adequate inventory levels to meet customer demand and avoid stockouts, which can lead to lost sales, production delays, and customer dissatisfaction. Effective inventory management systems, including demand forecasting and inventory control techniques, are essential for achieving this objective. The goal is to have the right materials available at the right time, in the right quantity, to support operational needs. This prevents production downtime and ensures customer orders can be fulfilled.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <DollarSign size={16} /> Minimizing Inventory Investment
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  While ensuring material availability is crucial, it is equally important to minimize the financial investment tied up in inventory. Excessive inventory levels can lead to increased holding costs, such as storage, insurance, and obsolescence. Inventory management aims to optimize inventory levels to reduce these costs while maintaining adequate stock to meet demand. Techniques such as economic order quantity (EOQ) and just-in-time (JIT) inventory management are employed to achieve this objective. The goal is to free up capital that can be used for other strategic investments. This also reduces the risk of loss, due to damage, or obsolescence.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Activity size={16} /> Reducing Inventory-Related Costs
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Inventory/materials management aims to reduce various inventory related costs, including ordering costs, holding costs, and stockout costs. Ordering costs are associated with placing and processing purchase orders. Holding costs include storage, insurance, and obsolescence costs. Stockout costs are the costs associated with lost sales or production delays due to material shortages. By implementing efficient inventory control and procurement practices, organizations can minimize these costs and improve profitability. This also includes, reducing the costs associated with waste, and damage.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <RefreshCw size={16} /> Improving Inventory Turnover
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Inventory turnover is a measure of how quickly inventory is sold or used. A higher inventory turnover rate indicates efficient inventory management. Inventory/materials management aims to improve inventory turnover by optimizing inventory levels, reducing lead times, and improving demand forecasting. This ensures that inventory is moving quickly, reducing the risk of obsolescence, and maximizing the return on investment. A high turnover rate also frees up warehouse space.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Shield size={16} /> Maintaining Quality Standards
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Effective inventory/materials management includes ensuring that materials meet quality standards. This involves implementing quality control procedures for incoming materials, storing materials properly to prevent damage, and managing material expiration dates. Maintaining quality standards ensures that finished products meet customer expectations and reduces the risk of product recalls or returns. This also helps to maintain the company's reputation.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Zap size={16} /> Supporting Operational Efficiency
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Inventory/materials management plays a vital role in supporting operational efficiency. By ensuring the timely availability of materials, organizations can minimize production delays and improve productivity. Efficient materials handling and storage practices also contribute to streamlined operations. This allows for a smooth, and efficient production process.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                  <Users size={16} /> Enhancing Customer Satisfaction
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Ultimately, the objectives of inventory/materials management are aligned with enhancing customer satisfaction. By ensuring the availability of products and minimizing delivery delays, organizations can meet customer expectations and build customer loyalty. This also includes, ensuring that the products are of a high quality.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2">
                  <Gavel size={16} /> Compliance with Regulations
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  In many industries, inventory/materials management is subject to regulatory requirements, such as those related to hazardous materials or product safety. Inventory management aims to ensure compliance with these regulations to avoid legal penalties and protect the environment. This is vital to avoid fines, and legal action.
                </p>
              </div>
            </div>

            {/* SECTION 3: Significance of Inventory Management */}
            <div
              ref={(el) => {
                sectionRefs.current['significance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Significance of Inventory Management Outlined
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The significance of inventory management cannot be overstated in the context of modern business operations. It is far more than a simple bookkeeping exercise; it is a strategic imperative that directly impacts profitability, customer satisfaction, and overall organizational resilience. Effective inventory management is a delicate balancing act, requiring meticulous planning, precise execution, and continuous adaptation to changing market conditions. It is the lifeblood of a smooth-running supply chain, ensuring that the right materials are available at the right time, in the right quantity, and at the right cost.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <DollarSign size={16} /> Optimizing Working Capital
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Inventory represents a significant portion of a company's working capital. Effective inventory management directly impacts cash flow by minimizing the amount of capital tied up in excess stock. By optimizing inventory levels, organizations can free up capital for other strategic investments, such as research and development, marketing, or expansion. Conversely, poor inventory management can lead to excessive holding costs, obsolescence, and write-offs, which can severely strain a company's financial resources. Optimizing working capital, allows for the company to have better financial stability.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Clock size={16} /> Ensuring Uninterrupted Production and Sales
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Inventory management plays a crucial role in ensuring uninterrupted production and sales operations. By maintaining adequate stock levels, organizations can avoid stockouts, which can lead to production delays, lost sales, and customer dissatisfaction. This is particularly critical in industries with fluctuating demand or long lead times. Effective inventory management systems, including demand forecasting and inventory control techniques, are essential for maintaining a steady flow of materials and finished goods. Uninterrupted production, and sales, also helps to maintain a good company reputation.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <HeartHandshake size={16} /> Enhancing Customer Satisfaction
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Customer satisfaction is directly linked to the availability of products and the speed of delivery. Effective inventory management contributes to enhanced customer satisfaction by ensuring that orders are fulfilled promptly and accurately. By minimizing stockouts and delivery delays, organizations can build customer loyalty and maintain a competitive edge. This is vital, in today's, on demand economy.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Archive size={16} /> Reducing Storage and Handling Costs
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Inventory management aims to minimize storage and handling costs associated with holding inventory. This includes costs related to warehousing, insurance, and handling. Efficient inventory management practices, such as proper storage techniques and optimized warehouse layouts, can help to reduce these costs. Furthermore, effective inventory management can minimize the risk of damage or obsolescence, which can lead to significant financial losses. Reducing these costs, increases profit margins.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Truck size={16} /> Improving Supply Chain Efficiency
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Inventory management is an integral part of supply chain management. By optimizing inventory levels and ensuring the timely flow of materials, organizations can improve the efficiency of their supply chains. Effective inventory management systems facilitate better coordination between suppliers, manufacturers, and distributors, leading to streamlined operations and reduced lead times. This also reduces the risk of bottlenecks, within the supply chain.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <LineChart size={16} /> Enabling Accurate Demand Forecasting
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Effective inventory management relies on accurate demand forecasting. By analysing historical data, market trends, and other relevant factors, organizations can predict future demand and adjust inventory levels accordingly. Accurate demand forecasting minimizes the risk of stockouts or overstocking, ensuring that materials are available when needed. This also allows for better planning, of production schedules.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                  <Recycle size={16} /> Minimizing Waste and Obsolescence
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Inventory management plays a vital role in minimizing waste and obsolescence. By implementing proper inventory control techniques, organizations can prevent the accumulation of excess stock, which can lead to damage, spoilage, or obsolescence. This is particularly important for perishable goods or products with short life cycles. Minimizing waste, also helps with sustainability goals.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2">
                  <Target size={16} /> Supporting Strategic Decision-Making
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Inventory management provides valuable data and insights that can support strategic decision-making. By analysing inventory data, organizations can identify trends, assess performance, and make informed decisions about procurement, production, and sales. This data can also be used to evaluate the effectiveness of inventory management practices and identify areas for improvement. This allows for data driven decision making.
                </p>
              </div>
            </div>

            {/* SECTION 4: Stores Organisation */}
            <div
              ref={(el) => {
                sectionRefs.current['stores-organisation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Stores Organisation
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Stores organisation encompasses the systematic arrangement and management of a storage facility, be it a warehouse, stockroom, or retail store. It is a comprehensive approach that extends beyond mere physical arrangement, encompassing the processes, systems, and procedures that ensure the efficient and effective storage, retrieval, and management of inventory. A well-organized stores operation is fundamental to optimizing space utilization, minimizing operational costs, reducing errors, and ensuring timely access to materials, ultimately contributing to the overall efficiency and profitability of an organization.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Layout size={16} /> Strategic Layout and Space Optimization
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The physical layout of the storage facility is paramount to its efficiency. This involves a strategic design that maximizes space utilization while minimizing travel distances for materials handling. An efficient layout considers the size and shape of the storage area, the types and quantities of materials stored, and the frequency of material movement. Zoning and categorization play a crucial role, whereby materials are grouped and stored based on their characteristics, such as size, weight, frequency of use, and compatibility. For instance, fast-moving items are placed near dispatch areas, heavy items on lower shelves, and hazardous materials in designated safety zones. Furthermore, vertical space utilization through shelving, racking, and mezzanine systems significantly increases storage capacity, allowing for optimal use of available space. This carefully planned layout reduces wasted space, and travel time, which directly increases efficiency.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <HardDriveIcon size={16} /> Implementation of Effective Storage Systems and Equipment
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The selection and implementation of appropriate storage systems and materials handling equipment are essential for efficient stores organization. Shelving and racking systems should be chosen based on the type and weight of materials stored, considering factors such as adjustable shelving, pallet racking, cantilever racking, and mobile shelving. Materials handling equipment, such as forklifts, pallet jacks, hand trucks, and conveyors, should be readily available and properly maintained. Storage containers, such as bins, boxes, and pallets, should be used to protect materials and organize storage areas. The correct equipment, and storage systems, not only increase efficiency, but also reduce the risk of injury.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Database size={16} /> Robust Inventory Management Systems
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Effective inventory management systems are crucial for maintaining accurate and real-time control over inventory levels. This involves implementing inventory tracking systems, such as barcode systems or RFID technology, which allow for seamless monitoring of inventory levels and prevent stockouts or overstocking. Clear inventory control procedures, such as cycle counting and physical inventory counts, are essential for ensuring accuracy and minimizing discrepancies. Stock rotation policies, such as first-in, first-out (FIFO) or last-in, first-out (LIFO), should be implemented to prevent obsolescence and ensure that materials are used in a timely manner. These systems, allow for the reduction of waste, and the reduction of lost revenue, due to stock outs.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Scan size={16} /> Clear Labelling, Identification, and Location Systems
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Clear and accurate labelling is essential for the efficient identification and retrieval of materials. All materials should be clearly labelled with relevant information, such as item name, part number, quantity, and location. Location systems, such as grid systems or alphanumeric systems, should be implemented to pinpoint the exact location of materials within the storage area. This ensures that materials can be located quickly and easily, minimizing retrieval time, and reducing errors. This is vital, for quick, and efficient, order fulfilment.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Shield size={16} /> Prioritization of Safety and Security Measures
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Safety and security are paramount in any store's operation. Safety procedures for materials handling and storage should be established and strictly enforced to prevent accidents and injuries. This includes proper training for personnel, the use of personal protective equipment (PPE), and the safe storage of hazardous materials. Security measures, such as access control and surveillance systems, should be implemented to prevent theft and unauthorized access to materials. A safe, and secure environment also increases employee morale.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Clipboard size={16} /> Emphasis on Housekeeping, Maintenance, and Documentation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Maintaining a clean and organized storage area is essential for safety and efficiency. Regular cleaning and maintenance should be conducted to prevent clutter and debris. Regular inspections of storage systems and equipment should be conducted to ensure that they are in good working order. Accurate records of all inventory transactions, such as receipts, issues, and transfers, should be maintained for inventory control and auditing purposes. This includes documentation of any damaged or obsolete materials. Good record keeping, is also vital for financial reporting.
                </p>
              </div>
            </div>

            {/* SECTION 5: The Role of Materials/Inventory Management in Other Areas */}
            <div
              ref={(el) => {
                sectionRefs.current['role-in-management'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Role of Materials/Inventory Management in Other Areas of Management Functions
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Materials/inventory management is not an isolated function; it is intricately woven into the fabric of other management areas, significantly influencing their effectiveness and overall organizational success. It acts as a bridge, connecting various departments and processes, ensuring a smooth flow of resources and information. Understanding its role in these interconnected functions is crucial for optimizing operations and achieving strategic objectives.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <SettingsIcon size={16} /> Impact on Production Management
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Materials/inventory management is fundamental to production management. It ensures the timely availability of raw materials, components, and work-in-progress inventory, preventing production delays and downtime. Accurate demand forecasting, a core component of materials management, allows production managers to plan production schedules effectively. Inventory control techniques, such as just-in-time (JIT) and materials requirement planning (MRP), optimize material flow and minimize waste, contributing to efficient production processes. Conversely, poor inventory management can lead to material shortages, production bottlenecks, and increased lead times, negatively impacting production output and efficiency. The correct materials, at the correct time, ensures that production schedules are met.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <DollarSign size={16} /> Influence on Financial Management
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Materials/inventory management has a direct impact on financial management through its influence on working capital, cash flow, and profitability. Effective inventory management minimizes the amount of capital tied up in inventory, freeing up resources for other investments. Accurate inventory valuation and costing are essential for financial reporting and decision-making. Inventory turnover rates and holding costs are key metrics that financial managers use to assess the efficiency of inventory management practices. Poor inventory management can lead to excessive holding costs, obsolescence, and write-offs, which can negatively impact a company's financial performance. Good inventory control allows for better financial forecasting.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Target size={16} /> Contribution to Marketing and Sales Management
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Materials/inventory management plays a vital role in supporting marketing and sales efforts by ensuring product availability and timely delivery. Accurate demand forecasting allows sales managers to set realistic sales targets and plan promotional activities effectively. Inventory control techniques, such as safety stock management, help to prevent stockouts and ensure that customer orders are fulfilled promptly. Effective inventory management contributes to customer satisfaction and builds customer loyalty. Conversely, stockouts and delivery delays can lead to lost sales and damage a company's reputation. This is especially important in the e-commerce sector.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Truck size={16} /> Integration with Logistics and Supply Chain Management
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Materials/inventory management is an integral part of logistics and supply chain management. It coordinates the flow of materials from suppliers to customers, ensuring that materials are available when and where they are needed. Effective inventory management systems facilitate better coordination between suppliers, manufacturers, and distributors, leading to streamlined operations and reduced lead times. Inventory management practices, such as vendor-managed inventory (VMI) and collaborative planning, forecasting, and replenishment (CPFR), enhance collaboration and improve supply chain efficiency. This also includes, the correct handling, and storage, of materials during transit.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Users size={16} /> Impact on Human Resources Management
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Materials/inventory management can indirectly influence human resources management by affecting workforce planning and safety. Efficient inventory management practices can reduce the need for excessive overtime and minimize the risk of accidents related to materials handling. Proper training on materials handling procedures and safety protocols is essential for ensuring a safe work environment. Furthermore, effective inventory management can contribute to job satisfaction by ensuring that employees have the necessary materials to perform their tasks effectively. A well-organized warehouse increases staff morale.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <LayersIcon size={16} /> Support for Strategic Planning
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Materials/inventory management provides valuable data and insights that can support strategic planning. By analysing inventory data, organizations can identify trends, assess performance, and make informed decisions about procurement, production, and sales. Inventory management metrics, such as inventory turnover rates and lead times, can be used to evaluate the effectiveness of supply chain strategies and identify areas for improvement. This data driven approach, allows for better long-term planning.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                  <Shield size={16} /> Influence on Quality Management
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Materials/inventory management has a significant impact on quality management. Proper storage and handling of materials can prevent damage and deterioration, ensuring that materials meet quality standards. Effective inventory control techniques, such as lot tracking and traceability, can help to identify and isolate defective materials. Furthermore, strong supplier relationships, fostered through effective procurement practices, can ensure the consistent delivery of high quality materials. This ensures that the final product, meets the quality standards.
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
                  💡 Inventory Insight
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
                  <span>Elements of Materials Management</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Objectives</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">7</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Effective inventory and materials management is essential for operational efficiency and profitability. Understand the key elements—demand forecasting, inventory control, procurement, materials handling, MRP, valuation, waste management, and performance measurement. Recognise the objectives and significance of inventory management, and how it impacts production, finance, marketing, logistics, HR, strategic planning, and quality management. A well-organised stores operation is the foundation of good inventory management.
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
                <strong className="text-white">Elements</strong> – demand forecasting, inventory control, procurement, materials handling, MRP, valuation, waste management, and performance measurement form the core of materials management.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Objectives</strong> – ensure material availability, minimise investment, reduce costs, improve turnover, maintain quality, support efficiency, enhance customer satisfaction, and ensure compliance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Significance</strong> – optimises working capital, ensures uninterrupted operations, enhances customer satisfaction, reduces costs, improves supply chain efficiency, enables forecasting, minimises waste, and supports strategic decisions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Stores Organisation</strong> – strategic layout, effective storage systems, robust inventory systems, clear labelling, safety measures, and good housekeeping are essential for efficient stores operations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Role in Management</strong> – materials management impacts production, finance, marketing, logistics, HR, strategic planning, and quality management across the organisation.
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
            Sidemann Academic Registry • ND Purchasing &amp; Supply – Inventory &amp; Materials Management 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;
