import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  Shield,
  Users,
  Handshake,
  FileText,
  DollarSign,
  Package,
  Truck,
  Warehouse,
  Search as SearchIcon,
  Star,
  Award,
  Clipboard,
  FileCheck,
  Receipt,
  Clock,
  Calendar,
  MapPin,
  Building,
  Briefcase,
  ListChecks,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Gavel,
  Layers,
  Zap,
  Eye,
  BookOpen,
  FilePlus,
  FileMinus,
  FileEdit,
  FileSearch,
  FileSpreadsheet,
  FileClock,
  FileX,
  FileBadge,
  FileKey,
  FileLock,
  Box,
  Factory,
  Globe,
  MessageSquare,
  Phone,
  Mail,
  User,
  UserCheck,
  PenTool,
  Link,
  Scale,
  Coins,
  Landmark,
  PiggyBank,
  BriefcaseBusiness,
  Ship,
  Plane,
  Train,
  Car,
  Bus,
  Bike,
  Footprints,
  BarChart4,
  ChartLine,
  Activity,
  Rocket,
  Anchor,
  GlobeIcon,
  HardHat,
  Leaf,
  Recycle,
  Trash2,
  Heart,
  Timer,
  TruckIcon,
  PackageOpen,
  Boxes,
  Printer,
  QrCode,
  BadgeCheck,
  Check,
  X,
  Minus,
  Plus,
  Divide,
  Equal,
  Percent,
  CircleDollarSign,
  HandCoins,
  FileSignature,
  ClipboardList,
  CalendarDays,
  Wrench,
  HardDrive,
  Server,
  Database,
  Network,
  Cpu,
  Cloud,
  Wheat,
  Coffee,
  Beef,
  Droplet,
  Flame,
  Factory as FactoryIcon,
  Gem,
  Atom,
  TrendingUp,
  CloudRain,
  Sun,
  Wind,
  ChartColumn,
  ChartNoAxesCombined,
  ChartPie,
  LineChart,
  BarChart,
  Sigma,
  Calculator,
  BookOpen as BookOpenIcon,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw as RefreshIcon,
  ChevronUp,
  AlertCircle,
  Monitor,
  Link2,
  FileCode,
  UserCheck as UserCheckIcon,
  GraduationCap,
  Briefcase as BriefcaseIcon,
  Menu,
  MousePointer,
  Touchpad,
  Grid3X3,
  Palette,
  Settings,
  FileText as FileTextIcon,
  MessageSquare as MessageSquareIcon,
  Mail as MailIcon,
  Calendar as CalendarIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'procurement-role', label: 'Procurement Role' },
  { id: 'new-vs-used', label: 'New vs Used' },
  { id: 'circumstances', label: 'Circumstances' },
  { id: 'financial-methods', label: 'Financial Methods' },
  { id: 'nonfinancial-methods', label: 'Nonfinancial Methods' },
  { id: 'whole-life-costing', label: 'Whole Life Costing' },
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
        text: 'The concept of whole life costing originated in the UK government in the 1970s to evaluate the total cost of assets over their entire lifespan, not just the purchase price.',
      },
      {
        title: 'Pro Tip',
        text: 'When evaluating capital equipment, always consider the total cost of ownership (TCO). A cheaper machine may cost more in maintenance and energy over its lifetime.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 4 financial evaluation methods: Payback Period, ARR, NPV, IRR. Each tells you something different about the investment.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t overlook nonfinancial factors like safety, environmental impact, and employee morale. These can have significant long-term consequences for your business.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The concept of whole life costing originated in the UK government in the 1970s to evaluate the total cost of assets over their entire lifespan, not just the purchase price.',
      },
      {
        title: 'Pro Tip',
        text: 'When evaluating capital equipment, always consider the total cost of ownership (TCO). A cheaper machine may cost more in maintenance and energy over its lifetime.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 4 financial evaluation methods: Payback Period, ARR, NPV, IRR. Each tells you something different about the investment.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t overlook nonfinancial factors like safety, environmental impact, and employee morale. These can have significant long-term consequences for your business.',
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
            Capital Equipment{' '}
            <span className="text-purple-300 font-bold italic">
              Procurement
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Complete guide to the role of procurement in capital equipment acquisition, used vs new equipment, financial and nonfinancial evaluation methods, and whole life costing.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FactoryIcon size={14} className="inline mr-1" /> Procurement
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Calculator size={14} className="inline mr-1" /> Evaluation
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <DollarSign size={14} className="inline mr-1" /> Whole Life Costing
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
                placeholder="Search for a concept, NPV, whole life costing..."
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
            {/* SECTION 1: The Role of Procurement */}
            <div
              ref={(el) => {
                sectionRefs.current['procurement-role'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Role of Procurement in the Acquisition of Capital Equipment
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Procurement, in the context of capital equipment acquisition, refers to the process of sourcing, selecting, and purchasing these significant assets. It's not just about buying something; it's about strategically acquiring the right equipment, at the right price, from the right supplier, and at the right time. This is a crucial function because capital equipment represents a substantial investment that can impact a company's productivity, efficiency, and long-term profitability.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Essentially, procurement is the department that makes sure a company gets the best deal when buying big, expensive things. They make sure the company is getting what it needs, at the best possible price.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Target size={16} /> 1. Strategic Sourcing and Supplier Selection
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Procurement plays a vital role in identifying and evaluating potential suppliers. This involves conducting thorough market research, assessing supplier capabilities, and negotiating favorable terms. Procurement professionals analyze factors such as supplier reputation, financial stability, technical expertise, and after-sales support. They aim to establish long-term relationships with reliable suppliers who can provide high-quality equipment and consistent service. This process is not simply about finding the cheapest option; it's about finding the best value. For instance, a procurement team might evaluate multiple suppliers for a specialized piece of manufacturing equipment. They would consider not only the initial purchase price but also factors such as the equipment's lifespan, maintenance costs, and the supplier's ability to provide timely technical support. By conducting thorough due diligence, procurement ensures that the company selects a supplier that meets its specific needs and offers a competitive advantage. This step is about finding the best people to buy from.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <DollarSign size={16} /> 2. Cost Management and Negotiation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  One of the primary responsibilities of procurement is to manage costs effectively. This involves negotiating competitive prices, securing favorable payment terms, and identifying cost-saving opportunities. Procurement professionals analyze cost structures, leverage volume discounts, and explore alternative financing options. They also monitor market trends and commodity prices to ensure that the company is getting the best possible value for its investment. For example, when purchasing a large fleet of vehicles, procurement might negotiate bulk discounts, extended warranties, and favorable financing rates. By managing costs effectively, procurement helps the company maximize its return on investment and maintain financial stability. This is about getting the best price possible.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Shield size={16} /> 3. Risk Mitigation and Contract Management
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Acquiring capital equipment involves various risks, such as supplier delays, quality issues, and contractual disputes. Procurement plays a crucial role in mitigating these risks by conducting thorough risk assessments, developing robust contracts, and ensuring compliance with regulations. Procurement professionals work closely with legal and technical teams to identify potential risks and develop mitigation strategies. They also monitor supplier performance and ensure that contracts are executed according to agreed-upon terms. For instance, procurement might include clauses in contracts that specify penalties for late delivery or non-compliance with quality standards. By proactively managing risks, procurement helps the company avoid costly disruptions and ensure a smooth acquisition process. This is making sure that everything is done by the book, and that the company is protected.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Gavel size={16} /> 4. Ensuring Compliance and Ethical Practices
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Procurement is responsible for ensuring that all acquisition activities are conducted in compliance with relevant laws, regulations, and ethical standards. This includes adhering to procurement policies, promoting fair competition, and preventing fraud and corruption. Procurement professionals establish clear guidelines for supplier selection, contract negotiation, and payment processing. They also conduct regular audits and reviews to ensure compliance and identify areas for improvement. For example, procurement might implement a code of conduct for suppliers that prohibits bribery and corruption. By upholding ethical practices, procurement helps the company maintain its reputation and build trust with stakeholders. This is making sure that everyone is treated fairly, and that all laws are followed.
                </p>
              </div>
            </div>

            {/* SECTION 2: Used vs New Equipment */}
            <div
              ref={(el) => {
                sectionRefs.current['new-vs-used'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Used vs. New Equipment: Advantages and Disadvantages
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When a business needs capital equipment, a key decision is whether to buy new or used. Both options have distinct advantages and disadvantages that must be carefully weighed based on the specific needs and circumstances of the company.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Essentially, it's a choice between the reliability and latest features of something brand new, or the lower cost and faster availability of something that's been used before.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Star size={16} /> New Equipment
                  </h3>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-2">Advantages:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Latest Technology and Features</li>
                    <li>Warranty and Support</li>
                    <li>Longer Lifespan</li>
                    <li>Customization available</li>
                    <li>Higher Reliability</li>
                    <li>Tax Benefits</li>
                  </ul>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-3">Disadvantages:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Higher Initial Cost</li>
                    <li>Rapid Depreciation</li>
                    <li>Longer Lead Times</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <RefreshCw size={16} /> Used Equipment
                  </h3>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-2">Advantages:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Lower Initial Cost</li>
                    <li>Faster Availability</li>
                    <li>Lower Depreciation Rate</li>
                    <li>Proven Reliability (if well-maintained)</li>
                  </ul>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-3">Disadvantages:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Older Technology</li>
                    <li>Limited or No Warranty</li>
                    <li>Shorter Lifespan</li>
                    <li>Higher Maintenance Costs</li>
                    <li>Potential for Hidden Defects</li>
                    <li>Limited Customization</li>
                    <li>Parts Availability Issues</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 3: Circumstances Favoring Acquisition */}
            <div
              ref={(el) => {
                sectionRefs.current['circumstances'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Circumstances Favoring Acquisition of New/Old Equipment
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The decision to acquire new or used (old) equipment hinges on a variety of factors, including the nature of the business, its financial health, the specific needs of the operation, and the type of equipment required. It's about weighing the benefits of cutting-edge technology and reliability against the cost savings and faster availability of pre-owned equipment.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Essentially, it's about figuring out when it makes more sense to buy something shiny and new, or something that's been around for a while.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Rocket size={16} /> New Equipment
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><span className="font-bold">Technological Advancement is Critical</span> – When staying competitive requires the latest technology.</li>
                    <li><span className="font-bold">Long-Term Reliability is Essential</span> – When downtime is costly and frequent repairs are unacceptable.</li>
                    <li><span className="font-bold">Significant Growth Plans</span> – When expansion requires increased capacity and modern equipment.</li>
                    <li><span className="font-bold">Strong Financial Resources</span> – When the company can afford the investment and benefits from tax incentives.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <PiggyBank size={16} /> Used Equipment
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><span className="font-bold">Budget Constraints</span> – When the company is cost-sensitive and needs to minimize initial investment.</li>
                    <li><span className="font-bold">Short-Term Needs</span> – When equipment is needed for a temporary project or short-term operation.</li>
                    <li><span className="font-bold">Minimal Technological Advancements</span> – When the equipment is simple and technology doesn't change rapidly.</li>
                    <li><span className="font-bold">Immediate Availability</span> – When equipment is needed urgently and cannot wait for new equipment lead times.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 4: Financial/Quantifiable Methods */}
            <div
              ref={(el) => {
                sectionRefs.current['financial-methods'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Financial/Quantifiable Methods of Evaluating Capital Equipment
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When a company considers investing in capital equipment, it's crucial to evaluate the financial implications of the investment. Financial/quantifiable methods provide a structured way to assess the profitability and feasibility of these investments. These methods help businesses make informed decisions by quantifying the potential returns and risks.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Essentially, these methods use numbers to figure out if buying a big piece of equipment is a good financial idea.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Clock size={16} /> 1. Payback Period
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The time it takes for an investment to generate enough cash flow to recover its initial cost.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <span className="font-bold">Calculation:</span> Initial Investment / Annual Cash Inflow
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                      <span className="font-bold text-green-700 dark:text-green-400">Pros</span>
                      <ul className="list-disc pl-4 mt-1">
                        <li>Simple and easy to understand</li>
                        <li>Quick liquidity assessment</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                      <span className="font-bold text-red-700 dark:text-red-400">Cons</span>
                      <ul className="list-disc pl-4 mt-1">
                        <li>Ignores cash flows beyond payback</li>
                        <li>Ignores time value of money</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <BarChart4 size={16} /> 2. Accounting Rate of Return (ARR)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Measures the average annual profit generated by an investment as a percentage of the average investment.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <span className="font-bold">Calculation:</span> Average Annual Profit / Average Investment
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                      <span className="font-bold text-green-700 dark:text-green-400">Pros</span>
                      <ul className="list-disc pl-4 mt-1">
                        <li>Simple to calculate</li>
                        <li>Uses readily available accounting data</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                      <span className="font-bold text-red-700 dark:text-red-400">Cons</span>
                      <ul className="list-disc pl-4 mt-1">
                        <li>Ignores time value of money</li>
                        <li>Uses accounting profits (can be manipulated)</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <DollarSign size={16} /> 3. Net Present Value (NPV)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Calculates the present value of all future cash flows from an investment, discounted at a specific rate, minus the initial investment.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <span className="font-bold">Calculation:</span> PV of Cash Inflows - Initial Investment
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                      <span className="font-bold text-green-700 dark:text-green-400">Pros</span>
                      <ul className="list-disc pl-4 mt-1">
                        <li>Considers time value of money</li>
                        <li>Uses cash flows (objective)</li>
                        <li>Clear profitability measure</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                      <span className="font-bold text-red-700 dark:text-red-400">Cons</span>
                      <ul className="list-disc pl-4 mt-1">
                        <li>Requires accurate estimates</li>
                        <li>Complex to calculate</li>
                        <li>Results depend on discount rate chosen</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">Considered one of the best ways to evaluate capital equipment.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <TrendingUp size={16} /> 4. Internal Rate of Return (IRR)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The discount rate that makes the NPV of an investment equal to zero.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <span className="font-bold">Calculation:</span> Requires iterative calculations or financial calculators.
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                      <span className="font-bold text-green-700 dark:text-green-400">Pros</span>
                      <ul className="list-disc pl-4 mt-1">
                        <li>Considers time value of money</li>
                        <li>Provides rate of return for comparison</li>
                        <li>Uses cash flows</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                      <span className="font-bold text-red-700 dark:text-red-400">Cons</span>
                      <ul className="list-disc pl-4 mt-1">
                        <li>Complex to calculate</li>
                        <li>May produce multiple IRRs</li>
                        <li>Assumes reinvestment at IRR</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">If IRR is higher than the required rate of return, it's a good investment.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <CheckCircle size={16} /> Advantages and Disadvantages of Using Financial/Quantifiable Methods
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="font-bold text-green-700 dark:text-green-400">Advantages</p>
                    <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400">
                      <li>Objective and data-driven decision-making</li>
                      <li>Allows comparison of investment options</li>
                      <li>Assesses financial viability</li>
                      <li>Improves resource allocation</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="font-bold text-red-700 dark:text-red-400">Disadvantages</p>
                    <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400">
                      <li>Relies on accurate estimates</li>
                      <li>May not capture qualitative factors</li>
                      <li>Can be complex and time-consuming</li>
                      <li>Over-reliance can miss other important factors</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 5: Nonfinancial/Nonquantifiable Methods */}
            <div
              ref={(el) => {
                sectionRefs.current['nonfinancial-methods'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Nonfinancial/Nonquantifiable Methods of Evaluating Capital Equipment
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    While financial metrics are crucial for evaluating capital equipment, they don't capture the entire picture. Nonfinancial/nonquantifiable methods assess the intangible aspects of an investment, such as its impact on the environment, employees, and the broader community. These factors are often difficult to measure in monetary terms but can significantly influence the long-term success and sustainability of a business.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Essentially, these methods look beyond the numbers to understand how a new piece of equipment will affect things that are hard to measure with money, like how it impacts people and the environment.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Leaf size={16} /> 1. Environmental Factors
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Considers energy consumption, emissions, waste generation, and recyclability. Businesses are increasingly aware of their environmental responsibilities and strive to minimize their carbon footprint. Evaluating the environmental impact ensures compliance with regulations and demonstrates a commitment to sustainability.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Users size={16} /> 2. Effect on Staff Motivation and Morale
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Introducing new, modern equipment can boost employee morale and motivation. Employees often feel valued when provided with the latest tools and technology, leading to increased productivity and job satisfaction. Conversely, outdated equipment can lead to frustration and decreased morale.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Briefcase size={16} /> 3. Effect on Employment
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Capital equipment acquisitions can have both positive and negative effects on employment. New equipment may create new job opportunities but may also lead to job displacement due to automation. Companies should consider the social impact of their investment decisions and strive to balance technological advancements with employment stability.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Heart size={16} /> 4. Impact on Customer Satisfaction
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    New equipment can improve product quality, delivery times, and customer service, leading to increased customer satisfaction and loyalty. For example, a restaurant investing in new kitchen equipment can improve the speed and consistency of food preparation.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Star size={16} /> 5. Effect on Company Image and Reputation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Investing in modern, state-of-the-art equipment can enhance a company's image and reputation. It demonstrates a commitment to innovation, quality, and customer satisfaction. A positive image can attract new customers, investors, and talented employees.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Shield size={16} /> 6. Safety and Ergonomics
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    New equipment can incorporate advanced safety features and ergonomic designs, reducing the risk of accidents and injuries in the workplace. This is especially important in industries with high safety risks, such as construction and manufacturing.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 6: Whole Life Costing */}
            <div
              ref={(el) => {
                sectionRefs.current['whole-life-costing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Whole Life Costing in Capital Equipment
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Whole life costing (WLC) is a method of evaluating the total cost of an asset over its entire lifespan. It goes beyond the initial purchase price to include all costs associated with owning and operating the equipment, from acquisition to disposal. This comprehensive approach helps businesses make informed decisions by considering the long-term financial implications of capital equipment investments.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Essentially, WLC is about looking at the big picture and figuring out how much a piece of equipment will really cost you, not just the price tag. It's about considering everything from the day you buy it to the day you get rid of it.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <DollarSign size={16} /> 1. Initial Acquisition Costs
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Includes the purchase price, delivery, installation, and training costs. It's the first and most obvious cost, but it's only the beginning. For example, if a company buys a new printing press, the initial acquisition costs would include the price of the press itself, the cost of transporting it, installing it, and training employees to use it.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Zap size={16} /> 2. Operating Costs
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Ongoing costs associated with using the equipment, such as energy consumption, fuel, maintenance, repairs, and labor. Operating costs can vary significantly depending on the type of equipment and its usage. A machine that runs 24/7 will have higher energy bills than one that only runs a few hours a day.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Wrench size={16} /> 3. Maintenance and Repair Costs
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Includes routine maintenance, preventative maintenance, and unexpected repairs. Regular maintenance can extend the lifespan of the equipment and prevent costly breakdowns. However, all equipment eventually requires repairs, which can be expensive. The frequency and cost of maintenance and repairs can vary depending on the quality of the equipment and how it is used.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Clock size={16} /> 4. Downtime Costs
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    When equipment is out of service due to breakdowns or maintenance, it can lead to lost production, delays, and missed deadlines. Downtime costs include the cost of lost revenue, idle labor, and potential penalties for late deliveries. Downtime costs are often difficult to quantify but can be substantial.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Trash2 size={16} /> 5. Disposal and Salvage Costs
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    At the end of its useful life, the equipment may need to be disposed of. Disposal costs can include the cost of dismantling, removing, and disposing of the equipment, as well as any environmental cleanup costs. In some cases, the equipment may have salvage value, which can offset disposal costs. For instance, a company might sell used equipment for scrap or recycle valuable components.
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
                  💡 Procurement Insight
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
                  <span>Procurement Roles</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Financial Methods</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>WLC Components</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Effective capital equipment procurement requires a balanced approach. Consider both financial metrics (Payback, ARR, NPV, IRR) and nonfinancial factors (environmental, safety, morale). Whole life costing gives you the full picture of long-term costs. The choice between new and used equipment depends on your specific circumstances, budget, and strategic goals.
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
                <strong className="text-white">Procurement Role</strong> – strategic sourcing, cost management, risk mitigation, and ensuring compliance and ethical practices in capital equipment acquisition.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">New vs Used</strong> – new equipment offers reliability and latest technology but costs more; used equipment is cheaper and faster to acquire but may have higher maintenance costs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Financial Methods</strong> – Payback Period, ARR, NPV, and IRR each provide different insights into the financial viability of capital investments.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Nonfinancial Factors</strong> – environmental impact, staff morale, employment effects, customer satisfaction, company reputation, and safety are critical intangible considerations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Whole Life Costing</strong> – evaluates total costs including acquisition, operation, maintenance, downtime, and disposal, providing a comprehensive view of long-term investment costs.
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
            Sidemann Academic Registry • ND Purchasing &amp; Supply – Capital Equipment Procurement 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;
