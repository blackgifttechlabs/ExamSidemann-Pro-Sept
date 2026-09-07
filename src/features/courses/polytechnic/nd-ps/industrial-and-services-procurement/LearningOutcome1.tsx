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
  ShoppingCart,
  CreditCard,
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
  Headphones,
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
  ArrowRightCircle,
  GitBranch,
  Store,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw as RefreshIcon,
  ChevronUp,
  AlertCircle,
  Monitor,
  Link2,
  Zap as ZapIcon,
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
  { id: 'commodities', label: 'Primary Commodities' },
  { id: 'pricing', label: 'Pricing Factors' },
  { id: 'markets', label: 'Commodity Markets' },
  { id: 'buying-methods', label: 'Buying Methods' },
  { id: 'guard-strategies', label: 'Guard Strategies' },
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
        text: 'Mbare Musika is one of Zimbabwe\'s oldest and largest fresh produce markets, serving as a vital link between rural farmers and urban consumers for over a century.',
      },
      {
        title: 'Pro Tip',
        text: 'When buying commodities, consider using a mix of spot contracts and long-term contracts. This strategy provides flexibility while ensuring supply security.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 7 factors that influence commodity pricing: Supply & Demand, Global Economy, Geopolitics, Weather, Currency, Speculation, and Regulations.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t rely on a single supplier for critical commodities. Diversifying supply sources reduces risk and gives you negotiating power.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Mbare Musika is one of Zimbabwe\'s oldest and largest fresh produce markets, serving as a vital link between rural farmers and urban consumers for over a century.',
      },
      {
        title: 'Pro Tip',
        text: 'When buying commodities, consider using a mix of spot contracts and long-term contracts. This strategy provides flexibility while ensuring supply security.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 7 factors that influence commodity pricing: Supply & Demand, Global Economy, Geopolitics, Weather, Currency, Speculation, and Regulations.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t rely on a single supplier for critical commodities. Diversifying supply sources reduces risk and gives you negotiating power.',
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
            Primary Commodities in{' '}
            <span className="text-emerald-300 font-bold italic">
              Industrial &amp; Services Procurement
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Complete guide to primary commodities, characteristics, pricing factors, commodity markets, buying methods, and strategies to guard against price and supply fluctuations.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Wheat size={14} className="inline mr-1" /> Primary Commodities
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <DollarSign size={14} className="inline mr-1" /> Pricing Factors
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Handshake size={14} className="inline mr-1" /> Buying Methods
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <SearchIcon className="ml-4 text-orange-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, commodities, hedging..."
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
            {/* SECTION 1: Primary Commodities */}
            <div
              ref={(el) => {
                sectionRefs.current['commodities'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Primary Commodities in Industrial &amp; Services Procurement
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Primary commodities are raw materials or basic agricultural products that are traded and used in the production of other goods and services. They're the building blocks of many industries, like the flour used to bake bread or the metal used to build cars.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Target size={16} /> What are Primary Commodities?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Primary commodities are raw materials or basic agricultural products that are traded and used in the production of other goods and services. They're the building blocks of many industries, like the flour used to bake bread or the metal used to build cars.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <FactoryIcon size={16} /> 1. Primary Commodities
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Raw materials that are used to make other things.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> In the context of industrial and services procurement, primary commodities are the foundational materials that industries rely on for their operations. These are often naturally occurring resources that are extracted or harvested, and then processed to some degree before being used in manufacturing or other processes. Examples include metals like copper, aluminium, and iron ore; agricultural products like wheat, corn, and coffee; and energy resources like crude oil and natural gas. These commodities are essential inputs for a wide range of industries, from manufacturing and construction to food production and energy generation. Their availability, price, and quality can significantly impact the costs and operations of businesses that rely on them. Because of their fundamental nature, they are the base of many supply chains.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <ListChecks size={16} /> 2. Characteristics of Primary Commodities
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Things that make raw materials different from other things we buy.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Primary commodities have several defining characteristics that distinguish them from manufactured goods or services.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Standardization:</strong> Many primary commodities are relatively standardized, meaning that they have consistent quality and specifications. For example, crude oil is graded based on its density and sulfur content, and wheat is graded based on its protein content. This standardization allows for efficient trading and pricing.</li>
                  <li><strong>Price Volatility:</strong> Primary commodity prices can fluctuate significantly due to factors such as supply and demand, weather conditions, and geopolitical events. For example, a drought can lead to a sharp increase in the price of agricultural commodities.</li>
                  <li><strong>Global Trade:</strong> Primary commodities are often traded globally, with production and consumption occurring in different regions. This global trade creates complex supply chains and exposes businesses to international risks.</li>
                  <li><strong>Bulk Handling:</strong> Primary commodities are typically handled in bulk, requiring specialized transportation and storage infrastructure. For example, crude oil is transported by tankers and stored in large tanks, and iron ore is transported by rail and stored in stockpiles.</li>
                  <li><strong>Limited Differentiation:</strong> Primary commodities are often difficult to differentiate, meaning that they are largely interchangeable. For example, one barrel of crude oil is generally similar to another barrel of crude oil. This limited differentiation can lead to intense price competition.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Layers size={16} /> 3. Types of Primary Commodities
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Different kinds of raw materials.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Primary commodities can be broadly classified into several categories:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Metals:</strong> These include ferrous metals (e.g., iron ore, steel) and non-ferrous metals (e.g., copper, aluminum, gold). Metals are used in a wide range of industries, including construction, manufacturing, and electronics.</li>
                  <li><strong>Energy:</strong> These include fossil fuels (e.g., crude oil, natural gas, coal) and renewable energy sources (e.g., uranium, biofuels). Energy commodities are essential for powering industries and transportation.</li>
                  <li><strong>Agricultural Products:</strong> These include grains (e.g., wheat, corn, rice), oilseeds (e.g., soybeans, canola), and soft commodities (e.g., coffee, sugar, cotton). Agricultural commodities are used in food production, textiles, and other industries.</li>
                  <li><strong>Livestock and Meat:</strong> This includes animals such as cattle, hogs, and poultry, and their derived products.</li>
                  <li><strong>Forestry Products:</strong> This includes timber, pulp, and paper.</li>
                  <li><strong>Minerals:</strong> This includes items such as diamonds, and salt.</li>
                  <li><strong>Chemicals:</strong> Some basic chemicals are considered primary commodities.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 2: Factors Influencing Pricing */}
            <div
              ref={(el) => {
                sectionRefs.current['pricing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors Influencing Pricing of Primary Commodities
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What Influences Primary Commodity Prices?</strong> It's about understanding why the price of raw materials like oil, gold, or wheat goes up and down. It's like figuring out why the price of your favourite fruit changes at the grocery store.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Scale size={16} /> 1. Supply and Demand
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  If there's a lot of something and not many people want it, the price goes down. If there's not much of something and lots of people want it, the price goes up.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> The fundamental principle of supply and demand plays a significant role in determining the prices of primary commodities. When the supply of a commodity exceeds demand, prices tend to fall. Conversely, when demand exceeds supply, prices tend to rise. Factors that can affect supply include weather conditions (e.g., droughts, floods), production levels, and technological advancements. For example, a severe drought in a major wheat-producing region can significantly reduce the supply of wheat, leading to higher prices. Similarly, increased demand for a commodity, driven by factors such as population growth or economic development, can also lead to price increases. For instance, the rapid industrialization of developing countries has led to increased demand for metals and energy resources, driving up their prices. The interplay between supply and demand is constantly changing, making commodity prices volatile and unpredictable.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Globe size={16} /> 2. Global Economic Conditions
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  If the world's economy is doing well, people buy more stuff, and prices go up. If it's doing poorly, people buy less, and prices go down.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Global economic conditions have a profound impact on commodity prices. During periods of economic growth, businesses and consumers tend to increase their spending, leading to higher demand for primary commodities. Conversely, during economic downturns, demand for commodities tends to decline, leading to lower prices. For example, a global recession can lead to a significant decrease in demand for crude oil, as businesses reduce their production and consumers cut back on travel. Similarly, economic growth in emerging markets can lead to increased demand for metals and energy resources, as these countries invest in infrastructure and industrial development. Therefore, the overall health of the global economy is a crucial factor in determining commodity prices.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <AlertTriangle size={16} /> 3. Geopolitical Events
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Wars, political problems, and things happening between countries can change prices suddenly.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Geopolitical events, such as wars, political instability, and trade disputes, can significantly disrupt the supply and demand of primary commodities, leading to price volatility. For example, a war in a major oil-producing region can disrupt the supply of crude oil, leading to sharp price increases. Similarly, trade disputes between countries can lead to tariffs and other trade barriers, which can affect the prices of imported and exported commodities. These events can create uncertainty and speculation in the market, further contributing to price fluctuations. Therefore, geopolitical events are a significant source of risk for businesses that rely on primary commodities.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <CloudRain size={16} /> 4. Weather Conditions
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Bad weather can ruin crops, making food prices go up.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Weather conditions play a crucial role in determining the supply of agricultural commodities. Droughts, floods, and other extreme weather events can significantly reduce crop yields, leading to higher prices. For example, a prolonged drought in a major grain-producing region can lead to a significant decrease in the supply of grains, leading to higher prices for bread and other food products. Similarly, favorable weather conditions can lead to bumper crops, which can lead to lower prices. Therefore, weather conditions are a significant source of risk for businesses that rely on agricultural commodities.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <DollarSign size={16} /> 5. Currency Exchange Rates
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The value of money changing between countries affects how much things cost when you buy them from other places.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Currency exchange rates can affect the prices of primary commodities, especially those that are traded globally. Changes in exchange rates can make imported commodities more or less expensive, depending on the relative value of the currencies involved. For example, if the value of the US dollar weakens against the euro, it becomes more expensive for European buyers to purchase commodities that are priced in US dollars. Similarly, if the value of the US dollar strengthens, it becomes less expensive for European buyers to purchase these commodities. Therefore, currency exchange rates are an important factor to consider when purchasing primary commodities from international suppliers.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <TrendingUp size={16} /> 6. Speculation and Investment
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  People buying and selling commodities hoping to make money can change the prices too.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Speculation and investment in commodity markets can also influence prices. Traders and investors buy and sell commodity futures contracts, hoping to profit from price fluctuations. This can create artificial demand and supply, leading to price volatility. For example, if traders believe that the price of crude oil is going to rise, they may buy futures contracts, driving up the price. Similarly, if traders believe that the price of crude oil is going to fall, they may sell futures contracts, driving down the price. Therefore, speculation and investment are important factors to consider when analyzing commodity prices.
                </p>
              </div>
            </div>

            {/* SECTION 3: Commodity Markets - Mbare Musika */}
            <div
              ref={(el) => {
                sectionRefs.current['markets'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Commodity Markets: The Example of Mbare Musika
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What are Commodity Markets?</strong> Commodity markets are places where raw materials or primary agricultural products are bought and sold. It's like a big marketplace where people trade things like grains, metals, or energy.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Store size={16} /> 1. Commodity Markets
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Places where people buy and sell raw materials or basic farm goods.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Commodity markets facilitate the trading of raw materials, which are essential inputs for various industries. These markets can be physical locations or virtual platforms where buyers and sellers come together to exchange goods. They play a vital role in the global economy by providing a mechanism for price discovery, risk management, and the efficient allocation of resources. For example, a farmer might sell their crops in a commodity market, while a food processing company might buy those crops to produce packaged foods. These markets are essential for ensuring that raw materials flow smoothly from producers to consumers. They provide a transparent platform to buy and sell these goods, with the price being determined by the forces of supply and demand.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <MapPin size={16} /> 2. Mbare Musika as a Local Commodity Market
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Mbare Musika is a real-life example of a local commodity market in Zimbabwe.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Mbare Musika, a bustling market in Harare, Zimbabwe, serves as a local example of a commodity market. It is a place where farmers from rural areas bring their produce, such as fruits, vegetables, and grains, to sell to traders and consumers. In Mbare Musika, you can witness the basic principles of commodity markets in action. Farmers, acting as suppliers, bring their goods, and traders and consumers, acting as buyers, negotiate prices based on the availability and quality of the produce. The prices fluctuate based on the season, weather conditions, and the volume of goods brought to the market. For instance, during a good harvest season, the market may be flooded with produce, leading to lower prices. Conversely, during a drought or a period of scarcity, prices may rise significantly. Mbare Musika showcases how local commodity markets function, providing a crucial link between rural producers and urban consumers. It also shows how important the local market is for the local economy. It is a place where many people make their living.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <ListChecks size={16} /> 3. Characteristics Observed in Mbare Musika
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Things you can see at Mbare Musika that are common in commodity markets.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Several characteristics of commodity markets can be observed in Mbare Musika:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Price Volatility:</strong> Prices change frequently based on supply and demand, weather, and seasonal factors. For example, tomato prices may be high during the dry season and low during the rainy season.</li>
                  <li><strong>Direct Interaction:</strong> Farmers and traders engage in direct negotiations, determining prices through bargaining and haggling.</li>
                  <li><strong>Standardization (to a degree):</strong> While not as standardized as global commodities, produce is often sorted and graded based on quality and size, influencing prices.</li>
                  <li><strong>Local Supply and Demand:</strong> The market is primarily driven by local supply from surrounding farms and local demand from urban consumers.</li>
                  <li><strong>Accessibility:</strong> It is a place where many people can go to buy and sell goods.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 4: Methods of Buying Commodities */}
            <div
              ref={(el) => {
                sectionRefs.current['buying-methods'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Methods of Buying Commodities
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What are Commodity Buying Methods?</strong> These are different ways companies buy raw materials. It's like having different options when you buy groceries – you can buy just what you need for today, or you can plan ahead and buy in bulk.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Clock size={16} /> 1. Hand-to-Mouth Buying
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Buying only what you need right now, not planning for the future.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Hand-to-mouth buying, also known as immediate or spot purchasing, involves buying commodities only when they are needed for immediate consumption or production. This method minimizes inventory holding costs and reduces the risk of obsolescence or spoilage. However, it also exposes the buyer to price volatility and potential supply disruptions. For example, a bakery might buy flour only when they need to bake bread for the day, rather than storing large quantities of flour. This approach is suitable for businesses with predictable demand and short lead times, but it can be risky for businesses that rely on commodities with volatile prices or long lead times. If a sudden surge in demand occurs, or if the commodity price rises sharply, the company might be unable to secure the necessary materials at a reasonable price. This method is used when storage is an issue, or when the cost of storage is higher than the risk of price fluctuation.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Target size={16} /> 2. Spot Contracts
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Buying commodities for immediate delivery at the current market price.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Spot contracts involve buying commodities for immediate delivery at the current market price. These contracts are typically used for short term purchases and are subject to the prevailing market conditions. For example, a manufacturer might buy a shipment of steel at the current spot price for immediate use in production. This method provides flexibility and allows buyers to take advantage of short-term price fluctuations. However, it also exposes them to the risk of price volatility and potential supply disruptions. Spot contracts are often used when the buyer needs the commodities urgently or when they believe that the current market price is favorable. The price agreed upon is for immediate delivery.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Calendar size={16} /> 3. Futures Contracts
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Agreeing to buy or sell commodities at a future date for a predetermined price.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Futures contracts are agreements to buy or sell commodities at a future date for a predetermined price. These contracts are traded on organized exchanges and are used for hedging price risk and speculating on price movements. For example, a farmer might sell a futures contract for their corn crop at a predetermined price, locking in a future selling price and protecting themselves from price declines. Similarly, a food processing company might buy a futures contract for corn to lock in a future purchase price and protect themselves from price increases. Futures contracts provide price certainty and allow businesses to manage their price risk. However, they also involve the risk of margin calls and potential losses if the market moves against the contract holder. This is a very common way to buy and sell commodities, as it provides a level of certainty.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Handshake size={16} /> 4. Forward Contracts
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Similar to futures, but customized agreements between two parties.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Forward contracts are similar to futures contracts, but they are customized agreements between two parties, rather than standardized contracts traded on exchanges. These contracts are used for hedging price risk and securing future supply. For example, a manufacturer might enter into a forward contract with a supplier to purchase a specific quantity of raw materials at a predetermined price for delivery at a future date. Forward contracts provide flexibility and allow businesses to tailor the contract terms to their specific needs. However, they also involve counterparty risk, meaning that one party might default on the contract.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <FileText size={16} /> 5. Long-Term Contracts
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Agreeing to buy commodities from the same supplier for a long period, often at a fixed price.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Long-term contracts involve agreements to purchase commodities from the same supplier for an extended period, often at a fixed price or a price formula. These contracts provide price stability and supply security, but they also limit flexibility and might result in paying above market prices if market prices decline. For example, a power plant might enter into a long-term contract with a coal supplier to secure a stable supply of fuel. Long-term contracts are often used for essential commodities that are subject to price volatility or supply disruptions.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Shield size={16} /> 6. Hedging
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Using financial instruments to protect against price changes.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Hedging involves using financial instruments, such as futures contracts or options, to protect against price fluctuations. This strategy allows businesses to minimize their exposure to price risk and stabilize their costs. For example, an airline might use jet fuel futures contracts to hedge against rising fuel prices. Hedging does not guarantee a profit, but it can help to minimize losses and provide price certainty.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Warehouse size={16} /> 7. Strategic Stockpiling
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Building up a reserve of commodities to protect against shortages or price spikes.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Strategic stockpiling involves building up a reserve of commodities to protect against potential shortages or price spikes. This method can be used for essential commodities that are subject to supply disruptions or price volatility. For example, a government might maintain a strategic petroleum reserve to ensure a stable supply of oil during emergencies. Strategic stockpiling involves significant storage costs and risks of obsolescence or spoilage, but it can provide a buffer against supply disruptions and price volatility.
                </p>
              </div>
            </div>

            {/* SECTION 5: Ways of Guarding Against Price and Supply Fluctuations */}
            <div
              ref={(el) => {
                sectionRefs.current['guard-strategies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Ways of Guarding Against Price and Supply Fluctuations for Commodities
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What are Ways to Guard Against Commodity Fluctuations?</strong> These are strategies companies use to protect themselves from sudden changes in the price or availability of raw materials. It's like having a plan in place to deal with unexpected changes in the cost of things you need.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Users size={16} /> 1. Supplier Development
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Helping your suppliers get better so they can provide you with a more reliable supply.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Supplier development involves investing in the capabilities of your suppliers to improve their performance and ensure a stable supply of commodities. This can include providing training, technical assistance, or financial support. By working closely with suppliers to improve their production processes, quality control, and logistics, companies can reduce the risk of supply disruptions and price volatility. For example, a company might help a farmer improve their farming techniques or invest in new equipment to increase their crop yields. This can lead to a more reliable supply of agricultural commodities and reduce the risk of price spikes due to shortages. Supplier development also fosters stronger relationships with suppliers, leading to better communication and collaboration. This can be very important when problems arise, as a good relationship will increase the likely hood of a good outcome.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Shield size={16} /> 2. Hedging
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Using financial tools to protect against price changes.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Hedging involves using financial instruments, such as futures contracts or options, to protect against price fluctuations. This strategy allows companies to lock in a future price for a commodity, reducing their exposure to price risk. For example, an airline might use jet fuel futures contracts to hedge against rising fuel prices. Hedging does not guarantee a profit, but it can help to minimize losses and provide price certainty. This is a common practice for companies that rely on commodities with volatile prices. It allows them to budget more accurately and avoid unexpected cost increases.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <ArrowRightCircle size={16} /> 3. Backward Integration
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Buying or controlling the companies that supply your raw materials.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Backward integration involves acquiring or controlling upstream suppliers in the supply chain. This strategy allows companies to secure a stable supply of commodities and reduce their reliance on external suppliers. For example, a food processing company might acquire a farm or a mining company might acquire a mine. Backward integration can provide greater control over the supply chain and reduce the risk of supply disruptions. However, it also involves significant capital investment and management challenges. This strategy is often used by large companies that rely on essential commodities. It is a large investment, and therefore a large risk, but it can provide a very stable supply.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <GitBranch size={16} /> 4. Diversification of Supply Sources
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Buying from multiple suppliers in different locations to reduce the risk of shortages.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Diversification of supply sources involves sourcing commodities from multiple suppliers in different regions. This strategy reduces the risk of supply disruptions due to localized events, such as weather conditions, political instability, or natural disasters. For example, a company might source raw materials from suppliers in different countries or regions. This ensures that if one supplier experiences a disruption, the company can still obtain the necessary materials from other sources. Diversification also promotes competition among suppliers, which can lead to better pricing and improved quality.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <FileText size={16} /> 5. Long-Term Contracts
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Agreeing to buy commodities from the same supplier for a long time, often at a fixed price.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Long-term contracts involve agreements to purchase commodities from the same supplier for an extended period, often at a fixed price or a price formula. These contracts provide price stability and supply security, but they also limit flexibility and might result in paying above market prices if market prices decline. For example, a power plant might enter into a long-term contract with a coal supplier to secure a stable supply of fuel. Long-term contracts are often used for essential commodities that are subject to price volatility or supply disruptions. These contracts provide a level of certainty that is very valuable to some companies.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Package size={16} /> 6. Inventory Management
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Keeping a reserve of commodities to protect against shortages or price spikes.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Inventory management involves maintaining a strategic reserve of commodities to protect against potential shortages or price spikes. This strategy can be used for essential commodities that are subject to supply disruptions or price volatility. For example, a company might maintain a buffer stock of raw materials to ensure uninterrupted production. However, inventory management involves significant storage costs and risks of obsolescence or spoilage. Therefore, it is important to carefully balance the benefits and costs of maintaining inventory.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Handshake size={16} /> 7. Building Strong Supplier Relationships
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Working closely with suppliers to build trust and cooperation.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Building strong supplier relationships involves fostering open communication, mutual trust, and a collaborative approach with suppliers. This strategy can lead to better communication, faster problem resolution, and improved supply chain resilience. For example, a company might hold regular meetings with suppliers to discuss performance, identify areas for improvement, and explore new opportunities for collaboration. Strong supplier relationships can help to mitigate the impact of supply disruptions and price volatility. When issues arise, a good relationship can allow for quick and effective problem solving.
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
                  💡 Commodity Insight
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
                  <span>Pricing Factors</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Buying Methods</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Guard Strategies</span>
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
                Understanding primary commodities is essential for effective procurement. Know the characteristics of different commodities, the factors that influence their pricing, and the various methods of buying them. Use strategies like hedging, diversification, and supplier development to guard against price and supply fluctuations. These principles apply across industries and are critical for cost management and supply chain resilience.
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
                <strong className="text-white">Primary Commodities</strong> – raw materials like metals, energy, agricultural products, livestock, forestry products, and minerals that form the foundation of industrial and services procurement.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Pricing Factors</strong> – supply and demand, global economic conditions, geopolitical events, weather conditions, currency exchange rates, and speculation all influence commodity prices.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Buying Methods</strong> – hand-to-mouth buying, spot contracts, futures contracts, forward contracts, long-term contracts, hedging, and strategic stockpiling each offer different trade-offs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Guard Strategies</strong> – supplier development, hedging, backward integration, diversification of supply sources, long-term contracts, inventory management, and building strong supplier relationships help mitigate risks.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Mbare Musika</strong> – a real-world example of a local commodity market demonstrating price volatility, direct interaction, local supply and demand, and accessibility.
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
            Sidemann Academic Registry • ND Purchasing &amp; Supply – Primary Commodities 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;
