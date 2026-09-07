import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  Shield,
  FileText,
  Scissors,
  Archive,
  Package,
  Hand,
  Store,
  Eye,
  Link,
  Users,
  CheckCircle,
  DollarSign,
  Truck,
  BarChart,
  Calendar,
  TrendingUp,
  UserCheck,
  Clock,
  Layers,
  CreditCard,
  Lock,
  PenTool,
  Briefcase,
  Activity,
  ClipboardList,
  ShieldCheck,
  GraduationCap,
  Building,
  Search as SearchIcon,
  Check,
  CheckSquare,
  BookOpen,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  AlertCircle,
  Monitor,
  Cpu,
  Link2,
  Zap,
  Globe,
  FileCode,
  FolderTree as FolderTreeIcon,
  UserCheck as UserCheckIcon,
  GraduationCap as GraduationCapIcon,
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
  Handshake,
  Scale,
  Landmark,
  PiggyBank,
  CloudRain,
  Sun,
  Wind,
  ArrowRightCircle,
  GitBranch,
  Store as StoreIcon,
  HardDrive,
  Building as BuildingIcon,
  MessageSquare as MessageSquareIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'differentiating', label: 'Goods vs Services' },
  { id: 'characteristics', label: 'Service Characteristics' },
  { id: 'classification', label: 'Service Classification' },
  { id: 'challenges', label: 'Procurement Challenges' },
  { id: 'steps', label: 'Procurement Steps' },
  { id: 'compensation', label: 'Compensation Methods' },
  { id: 'inhouse-outsourcing', label: 'In-House vs Outsourcing' },
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
        text: 'Services now account for more than 70% of GDP in many developed economies, making service procurement a critical function for most organisations.',
      },
      {
        title: 'Pro Tip',
        text: 'When defining service requirements, involve end‑users early. They often have insights about what the service should deliver that technical specifications might miss.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 8 differences between goods and services: Tangibility, Storability, Standardisation, Separability, Heterogeneity, Ownership Transfer, Evaluation, Production/Consumption.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t apply goods procurement methods directly to services. Services require more focus on provider relationships, quality measurement, and performance-based compensation.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Services now account for more than 70% of GDP in many developed economies, making service procurement a critical function for most organisations.',
      },
      {
        title: 'Pro Tip',
        text: 'When defining service requirements, involve end‑users early. They often have insights about what the service should deliver that technical specifications might miss.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 8 differences between goods and services: Tangibility, Storability, Standardisation, Separability, Heterogeneity, Ownership Transfer, Evaluation, Production/Consumption.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t apply goods procurement methods directly to services. Services require more focus on provider relationships, quality measurement, and performance-based compensation.',
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
            Goods &amp; Services{' '}
            <span className="text-amber-300 font-bold italic">
              and Service Procurement
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Complete guide to differentiating goods and services, characteristics of services, classification, procurement challenges, steps, compensation methods, and in-house vs outsourcing.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Package size={14} className="inline mr-1" /> Goods vs Services
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Hand size={14} className="inline mr-1" /> Service Procurement
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Truck size={14} className="inline mr-1" /> In‑House vs Outsourcing
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
                placeholder="Search for a concept, tangibility, outsourcing..."
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
            {/* SECTION 1: Differentiating Between Goods and Services */}
            <div
              ref={(el) => {
                sectionRefs.current['differentiating'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Differentiating Between Goods and Services
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Goods and services are both essential components of our economy, but they differ significantly in their nature and characteristics. Understanding these differences is crucial for businesses to effectively market and deliver their offerings.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Essentially, goods are things you can touch, like a car or a phone, while services are things someone does for you, like a haircut or a taxi ride.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Package size={16} /> 1. Tangibility
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Goods are tangible, meaning they have a physical form and can be touched, seen, and handled. Services, on the other hand, are intangible; they cannot be physically touched or held. For example, a loaf of bread is a good – you can hold it, feel its texture, and see its shape. A haircut, however, is a service – you experience it, but you cannot physically possess it. This fundamental difference in tangibility affects how goods and services are produced, marketed, and consumed. Goods are objects, services are actions.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Archive size={16} /> 2. Storability
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Goods can be stored for future use. For example, you can buy groceries and store them in your pantry or refrigerator. Services, however, cannot be stored. Once a service is performed, it is consumed immediately. A doctor's appointment, once completed, cannot be saved for later use. This difference in storability influences inventory management and production planning. You can keep goods for later, but services are used right away.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <FileText size={16} /> 3. Standardization
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Goods can often be standardized, meaning they can be produced consistently with uniform quality. Mass-produced goods, like cars or electronics, are typically identical. Services, however, are often customized and vary depending on the provider and the customer's needs. A massage, for example, can vary significantly depending on the therapist and the customer's preferences. It is easier to make all goods the same, but services are often different each time.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Scissors size={16} /> 4. Separability
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Goods can be separated from their production and distribution. For example, a manufacturer can produce a product in one location and ship it to another location for sale. Services, however, are often inseparable from the provider. The service is typically delivered and consumed simultaneously. For example, you cannot receive a haircut without the barber being present. The person making the service, has to be there for you to get the service.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Layers size={16} /> 5. Heterogeneity
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Goods can achieve a high degree of homogeneity, meaning they can be consistently produced with minimal variations. Services, however, are often heterogeneous, meaning they can vary significantly in quality and consistency. This variability is due to the human element involved in service delivery. For example, the quality of a restaurant meal can vary depending on the chef, the ingredients, and the time of day. Goods are more likely to be the same every time, but services can be very different.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Briefcase size={16} /> 6. Ownership Transfer
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  When you purchase a good, you typically gain ownership of it. For example, when you buy a car, you own it and can use it as you please. When you purchase a service, however, you do not gain ownership of anything tangible. You are paying for the experience or the performance of a task. When you pay for a taxi, you don't own the taxi, you just paid for the ride.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <SearchIcon size={16} /> 7. Evaluation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Goods can often be evaluated before purchase. You can inspect a product, read reviews, or compare specifications. Services, however, are often difficult to evaluate before consumption. You may rely on word-of-mouth recommendations or online reviews, but you cannot fully assess the quality of a service until you experience it. It is easier to know what you are getting with a good, but harder to know with a service.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Calendar size={16} /> 8. Production and Consumption
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Goods are typically produced, then sold, and then consumed. Services are often produced and consumed simultaneously. For example, a factory produces a television, which is then sold to a customer who consumes it at home. A live concert, however, is produced and consumed at the same time. Goods are made, then used. Services are used as they are being made.
                </p>
              </div>
            </div>

            {/* SECTION 2: Characteristics of Services */}
            <div
              ref={(el) => {
                sectionRefs.current['characteristics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Characteristics of Services
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Understanding the unique characteristics of services is essential for effective procurement and management. These characteristics distinguish services from goods and present both opportunities and challenges.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Eye size={16} /> 1. Intangibility
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Services cannot be seen, tasted, felt, heard, or smelled before purchase. Unlike goods, which have a physical form, services are experiences or performances. For example, you cannot physically hold a haircut, a legal consultation, or a financial advisory session. This intangibility makes it challenging for customers to evaluate services before consumption, leading to a greater reliance on trust and reputation. Because you can't touch it, it is harder to know what you are getting.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Link size={16} /> 2. Inseparability
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Services are often produced and consumed simultaneously. The service provider and the customer are typically involved in the service delivery process. For example, a doctor's appointment involves the doctor and the patient interacting directly. This inseparability means that the quality of the service can depend on the interaction between the provider and the customer. The service provider has to be there for the service to be given.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Layers size={16} /> 3. Heterogeneity (Variability)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Services are highly variable and can differ significantly in quality and consistency. This is because services are performed by people, and human performance can vary depending on factors such as the provider's skill, mood, and the customer's specific needs. For example, the quality of a restaurant meal can vary depending on the chef, the ingredients, and the time of day. This means that even the same service, provided by the same person, can be different each time.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Clock size={16} /> 4. Perishability
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Services cannot be stored or inventoried for future use. Once a service is not used, the opportunity to provide it is lost. For example, an empty seat on an airplane or an unused appointment slot at a salon represents lost revenue. This perishability requires service providers to carefully manage capacity and demand. If the service is not used, it is gone forever.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Shield size={16} /> 5. Lack of Ownership
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  When you purchase a service, you do not gain ownership of a tangible asset. You are paying for an experience, a performance, or access to a resource. For example, when you pay for a movie ticket, you are paying for the experience of watching the movie, not for ownership of the film itself. You are paying for the use of something, not for the thing itself.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Users size={16} /> 6. Customer Participation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Customers are often actively involved in the service delivery process. Their participation can influence the quality and outcome of the service. For example, in a personal training session, the customer's effort and engagement directly impact the results. This required participation, means the customer is a part of the service.
                </p>
              </div>
            </div>

            {/* SECTION 3: Classifying Services */}
            <div
              ref={(el) => {
                sectionRefs.current['classification'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Classifying Services
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Services can be classified in several ways, each providing a different perspective on their nature and procurement requirements.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Target size={16} /> 1. By Nature of the Service Act
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>People Processing:</strong> Direct action on people's bodies (healthcare, hairdressing).</li>
                  <li><strong>Possession Processing:</strong> Actions on customers' physical possessions (car repairs, dry cleaning).</li>
                  <li><strong>Mental Stimulus Processing:</strong> Actions directed at people's minds (education, entertainment).</li>
                  <li><strong>Information Processing:</strong> Actions directed at intangible assets (banking, insurance).</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <UserCheck size={16} /> 2. By Degree of Customer Contact
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>High-Contact Services:</strong> Require high interaction (consulting, medical).</li>
                  <li><strong>Low-Contact Services:</strong> Minimal interaction (online banking, automated car washes).</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <GraduationCap size={16} /> 3. By Service Provider's Skill Level
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Professional Services:</strong> High specialized knowledge (legal, accounting).</li>
                  <li><strong>Non-Professional Services:</strong> Less specialized skill (house cleaning, lawn care).</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Store size={16} /> 4. By Market Served
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Consumer Services:</strong> Provided to individual consumers (restaurants, salons).</li>
                  <li><strong>Business Services:</strong> Provided to businesses (IT support, logistics).</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Package size={16} /> 5. By Degree of Tangibility
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Tangible Services:</strong> Accompanied by a tangible good (restaurants).</li>
                  <li><strong>Intangible Services:</strong> Purely an experience (education, consulting).</li>
                </ul>
              </div>
            </div>

            {/* SECTION 4: Difficulties/Challenges in Services Procurement */}
            <div
              ref={(el) => {
                sectionRefs.current['challenges'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Difficulties/Challenges in Services Procurement
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Services procurement involves acquiring services from external providers, which can be significantly different from purchasing tangible goods. Unlike goods, services are often intangible, variable, and involve a high degree of interaction between the provider and the customer. This unique nature of services presents several challenges for procurement professionals.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Essentially, it's about the problems companies face when they need to hire someone to do something for them, instead of buying something they can hold. It's harder to define and control services than it is to define and control products.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <FileText size={16} /> 1. Defining and Specifying Service Requirements
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Unlike goods, which can be defined by specific physical attributes, services are often intangible and subjective. It can be challenging to clearly define the desired outcomes and performance metrics for a service. For example, how do you specify the "quality" of a consulting service or a creative design project? This difficulty in defining requirements can lead to misunderstandings, scope creep, and disputes with service providers. It is often very difficult to put into words, exactly what you need.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  This is made more difficult, by the fact that the service provider also has to understand those specifications, and be able to deliver them.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <BarChart size={16} /> 2. Measuring and Evaluating Service Quality
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Because services are often intangible and variable, measuring and evaluating their quality can be difficult. Unlike goods, which can be inspected for defects, services are often evaluated based on subjective criteria, such as customer satisfaction and perceived value. This makes it challenging to establish objective performance metrics and hold service providers accountable. How do you measure how good a training session was, or how effective a marketing campaign is? This difficulty in measuring service quality can lead to inconsistencies and dissatisfaction.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Often, the quality of a service is only able to be judged, after the service has been completed, which makes it hard to change anything.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Users size={16} /> 3. Managing Service Provider Relationships
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Services often involve a high degree of interaction and collaboration between the buyer and the service provider. This requires effective communication, trust, and relationship management. Unlike goods, which can be purchased and delivered with minimal interaction, services often require ongoing communication and coordination. Managing service provider relationships can be challenging, especially when dealing with complex or long-term service contracts. It is not just about buying something, it is about working together.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  This can be especially difficult when dealing with service providers from different cultures, or with very different business practices.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <DollarSign size={16} /> 4. Controlling Costs and Managing Budgets
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Service costs can be difficult to control, especially when dealing with complex or customized services. Unlike goods, which have fixed prices, service costs can vary depending on factors such as labor rates, project scope, and unforeseen circumstances. This makes it challenging to accurately estimate service costs and manage budgets. It is harder to know how much something will cost, before it is done.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  When dealing with services that are billed by the hour, it can be very difficult to know how many hours will be required.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <ShieldCheck size={16} /> 5. Ensuring Service Provider Compliance
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Service providers may be subject to various regulations and compliance requirements, such as data privacy, security, and labor laws. Ensuring service provider compliance can be challenging, especially when dealing with global service providers or complex regulatory environments. This requires careful due diligence and ongoing monitoring. It is very important to make sure that the people you hire, are following all the rules.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  This can also be difficult to monitor, especially when the service is being provided off site.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Lock size={16} /> 6. Managing Intellectual Property and Confidentiality
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Services often involve the exchange of sensitive information and intellectual property. Managing intellectual property and confidentiality can be challenging, especially when dealing with external service providers. This requires robust contracts and security measures to protect confidential information and prevent unauthorized disclosure. It is vital to make sure that any company secrets, remain secret.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  This is made more difficult, when multiple people, or companies, are involved in the provision of the service.
                </p>
              </div>
            </div>

            {/* SECTION 5: Steps Involved in Services Procurement */}
            <div
              ref={(el) => {
                sectionRefs.current['steps'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Steps Involved in Services Procurement
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Services procurement follows a structured process to ensure that the right service provider is selected and the service is delivered effectively.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <ClipboardList size={16} /> 1. Identify the Need and Define Requirements
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The process begins with recognizing a need for a specific service. This involves clearly defining the objectives, scope, and desired outcomes of the service. It's crucial to specify the required skills, experience, and qualifications of the service provider. This step also includes documenting detailed specifications, performance metrics, and any relevant service level agreements (SLAs). Essentially, figure out why you need the service, and what you want to get out of it.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Target size={16} /> 2. Develop a Procurement Strategy
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Based on the defined requirements, a procurement strategy is developed. This strategy outlines the sourcing approach, evaluation criteria, and selection process. It may involve deciding whether to use a competitive bidding process, a negotiated contract, or a sole-source provider. The strategy also addresses risk management, contract terms, and budget considerations. This is about deciding how you're going to get the service.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Users size={16} /> 3. Source Potential Service Providers
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  This step involves identifying and researching potential service providers who can meet the defined requirements. This can be done through various means, such as online directories, industry networks, referrals, and requests for information (RFIs). The goal is to create a shortlist of qualified providers for further evaluation. This is where you find out who can provide the service.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <FileText size={16} /> 4. Issue Request for Proposals (RFPs) or Quotations
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Once a shortlist of potential providers is created, a formal RFP or quotation is issued. This document outlines the service requirements, evaluation criteria, and submission guidelines. It allows providers to submit detailed proposals or quotations that demonstrate their capabilities and pricing. This is where you ask the providers to tell you how they would perform the service, and how much it would cost.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <CheckCircle size={16} /> 5. Evaluate Proposals and Select a Provider
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The submitted proposals or quotations are evaluated based on the pre-defined criteria. This may involve assessing factors such as technical expertise, experience, pricing, references, and compliance with requirements. The evaluation process should be objective and transparent, leading to the selection of the most suitable provider. This is where you decide which provider is the best.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <PenTool size={16} /> 6. Negotiate and Finalize the Contract
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Once a provider is selected, contract negotiations begin. This involves discussing and finalizing the terms and conditions of the service agreement, including pricing, payment schedules, performance metrics, and dispute resolution mechanisms. A well-defined contract is essential for ensuring clear expectations and protecting the interests of both parties. This is where you agree on all the details of the service.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Activity size={16} /> 7. Manage the Service Delivery
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  After the contract is signed, the service delivery process begins. This involves ongoing communication, coordination, and monitoring of the provider's performance. Regular reviews and feedback sessions are conducted to ensure that the service meets the agreed-upon standards. This is where you make sure the service is being provided as agreed.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Check size={16} /> 8. Evaluate Performance and Close the Contract
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Upon completion of the service or at the end of the contract term, a final evaluation is conducted. This assesses the provider's performance against the agreed-upon metrics and documents any lessons learned. The contract is then formally closed. This is where you check to see how well the service was provided, and then end the agreement.
                </p>
              </div>
            </div>

            {/* SECTION 6: Methods of Compensating Service Providers */}
            <div
              ref={(el) => {
                sectionRefs.current['compensation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Methods of Compensating Service Providers
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Compensating service providers involves determining how they will be paid for the services they deliver. This is a crucial aspect of service procurement, as it directly impacts the provider's motivation, performance, and the overall cost of the service. The method chosen should align with the nature of the service, the desired outcomes, and the level of risk involved.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Essentially, it's about figuring out how to pay someone for doing a job for you, when that job isn't making a physical product. There are many ways to pay for services, and the right way depends on the type of service.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <DollarSign size={16} /> 1. Fixed Price (Lump Sum)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  In this method, the service provider agrees to deliver the service for a predetermined, fixed price, regardless of the actual time or resources required. This method is suitable for well-defined services with clearly specified deliverables and a low degree of uncertainty. For example, a company might hire a web designer to create a website for a fixed price. This method provides cost certainty for the buyer and shifts the risk of cost overruns to the provider. The provider knows how much they will get, and the buyer knows how much they will pay.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  This method is best when the scope of work is very clearly defined.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Clock size={16} /> 2. Time and Materials (T&M)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  This method involves paying the service provider for the actual time spent and materials used in delivering the service. The provider typically charges an hourly rate for labor and adds a markup to the cost of materials. This method is suitable for services with uncertain scopes or complex projects where the exact time and resources required are difficult to estimate upfront. For example, a company might hire an IT consultant to troubleshoot a complex technical issue on a time and materials basis. The buyer pays for the actual time and materials used.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  This method is best when the scope of work is hard to define, or is likely to change.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <CreditCard size={16} /> 3. Cost Plus Fee
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  This method involves reimbursing the service provider for their actual costs plus a predetermined fee, which can be a fixed amount or a percentage of the costs. This method is often used for complex projects or research and development services where the exact costs are difficult to predict. For example, a government agency might hire a research firm to conduct a study on a cost-plus-fee basis. The fee is intended to cover the provider's profit and overhead. The buyer pays for the costs, plus a little extra.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  This method is often used when the buyer needs to have a great deal of oversight into the costs of the project.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <TrendingUp size={16} /> 4. Performance-Based Compensation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  This method ties the service provider's compensation to the achievement of specific performance targets or outcomes. The provider is paid based on the results they deliver, rather than the time or resources they expend. This method is suitable for services where the outcomes are measurable and directly linked to the provider's performance. For example, a marketing agency might be paid based on the number of leads generated or the increase in sales revenue. The better they do, the more they get paid.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  This method is best when the desired outcome can be clearly measured.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Calendar size={16} /> 5. Retainer Fee
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  This method involves paying the service provider a fixed fee on a regular basis (e.g., monthly or annually) for ongoing access to their services. This method is often used for legal, consulting, or creative services where the buyer requires continuous access to the provider's expertise. For example, a company might pay a law firm a monthly retainer fee for ongoing legal advice. The buyer pays a fixed amount, to have access to the service provider.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  This method is best when the buyer needs regular access to the service provider.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <CheckSquare size={16} /> 6. Milestone Payments
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  In this method, payments are made to the service provider upon the completion of specific milestones or deliverables. This method is suitable for projects with clearly defined phases or stages. For example, a software development project might have milestone payments tied to the completion of key functionalities. The buyer pays when certain parts of the project are completed.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  This method is best when the project can be broken down into clear, defined phases.
                </p>
              </div>
            </div>

            {/* SECTION 7: In-House vs. Outsourcing */}
            <div
              ref={(el) => {
                sectionRefs.current['inhouse-outsourcing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                In-House vs. Outsourcing of Services: Advantages and Disadvantages
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When a company needs a service, it faces a fundamental decision: perform the service in-house or outsource it to an external provider. This decision has significant implications for cost, quality, control, and strategic focus.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Essentially, it's about deciding whether to do something yourself, or to hire someone else to do it.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Building size={16} /> In-House Services
                  </h3>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-2">Advantages:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><span className="font-bold">Greater Control:</span> Direct control over service delivery, alignment with standards.</li>
                    <li><span className="font-bold">Enhanced Communication:</span> Seamless collaboration and faster problem-solving.</li>
                    <li><span className="font-bold">Protection of Confidential Information:</span> Reduced risk of data exposure.</li>
                    <li><span className="font-bold">Development of Internal Expertise:</span> Retain valuable skills and knowledge.</li>
                    <li><span className="font-bold">Increased Employee Morale:</span> More varied job functions.</li>
                  </ul>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-3">Disadvantages:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><span className="font-bold">Higher Costs:</span> Salaries, benefits, training, equipment.</li>
                    <li><span className="font-bold">Limited Expertise:</span> May lack specialized skills.</li>
                    <li><span className="font-bold">Resource Constraints:</span> Diverts focus from core activities.</li>
                    <li><span className="font-bold">Lack of Flexibility:</span> Difficult to scale up or down quickly.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Truck size={16} /> Outsourcing Services
                  </h3>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-2">Advantages:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><span className="font-bold">Cost Savings:</span> Leverage economies of scale, lower labor rates.</li>
                    <li><span className="font-bold">Access to Specialized Expertise:</span> Tap into external experts.</li>
                    <li><span className="font-bold">Focus on Core Business Activities:</span> Free up internal resources.</li>
                    <li><span className="font-bold">Greater Flexibility:</span> Easily scale services based on demand.</li>
                  </ul>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-3">Disadvantages:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><span className="font-bold">Loss of Control:</span> Less control over service delivery.</li>
                    <li><span className="font-bold">Communication Challenges:</span> Coordination with remote providers.</li>
                    <li><span className="font-bold">Security and Confidentiality Risks:</span> Increased exposure of sensitive data.</li>
                    <li><span className="font-bold">Dependence on External Providers:</span> Risk if provider fails to deliver.</li>
                    <li><span className="font-bold">Potential for Hidden Costs:</span> Contract negotiation and SLAs must be carefully managed.</li>
                  </ul>
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
                  💡 Service Procurement Insight
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
                  <span>Goods vs Services Differences</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Service Characteristics</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Compensation Methods</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Goods and services are fundamentally different. Services are intangible, inseparable, variable, perishable, and involve customer participation. Service procurement requires careful definition of requirements, relationship management, and appropriate compensation methods. The decision to outsource or keep services in-house depends on cost, control, expertise, and strategic focus. Understanding these concepts is essential for effective procurement and management.
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
                <strong className="text-white">Goods vs Services</strong> – goods are tangible, storable, standardised, and separable; services are intangible, perishable, heterogeneous, and often produced/consumed simultaneously.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Service Characteristics</strong> – intangibility, inseparability, heterogeneity, perishability, lack of ownership, and customer participation are key defining features.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Procurement Challenges</strong> – defining requirements, measuring quality, managing relationships, controlling costs, ensuring compliance, and protecting intellectual property.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Compensation Methods</strong> – fixed price, time and materials, cost plus fee, performance-based, retainer fee, and milestone payments each suit different service types.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">In-House vs Outsourcing</strong> – in‑house offers control and confidentiality; outsourcing offers cost savings and access to expertise. Choice depends on strategic priorities.
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
            Sidemann Academic Registry • ND Purchasing &amp; Supply – Goods &amp; Services Procurement 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;
