import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  GlobeIcon,
  Shield,
  ListChecks,
  FileText,
  Users,
  BarChart,
  AlertTriangle,
  Leaf,
  Package,
  Ship,
  Lock,
  Gavel,
  Award,
  AlertCircle,
  DollarSign,
  Landmark,
  Truck,
  MapPin,
  Cpu as CpuIcon,
  ListFilter as Recycling,
  Fuel,
  CloudRain,
  Layout,
  HardDriveIcon,
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
  { id: 'powers', label: 'Powers & Duties' },
  { id: 'roles', label: 'Government Roles' },
  { id: 'international', label: 'International Distribution' },
  { id: 'export', label: 'Export Controls' },
  { id: 'duty', label: 'Duty Considerations' },
  { id: 'recycling', label: 'Recycling & Disposal' },
  { id: 'environment', label: 'Environmental Issues' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome8: React.FC = () => {
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
        text: 'The European Union alone produces over 2.5 billion tonnes of waste per year, with packaging accounting for a significant portion. Effective recycling and disposal in logistics can drastically reduce this.',
      },
      {
        title: 'Pro Tip',
        text: 'When dealing with export controls, always stay up to date with the latest regulations from your country\'s export control agency. Misclassification can lead to severe penalties.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key environmental issues in logistics as "PACE": Pollution (air/noise), Packaging waste, Climate change contributions, and Energy consumption.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t overlook the role of local governments in logistics. Zoning, local road maintenance, and permits can significantly affect distribution efficiency.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The European Union alone produces over 2.5 billion tonnes of waste per year, with packaging accounting for a significant portion. Effective recycling and disposal in logistics can drastically reduce this.',
      },
      {
        title: 'Pro Tip',
        text: 'When dealing with export controls, always stay up to date with the latest regulations from your country\'s export control agency. Misclassification can lead to severe penalties.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key environmental issues in logistics as "PACE": Pollution (air/noise), Packaging waste, Climate change contributions, and Energy consumption.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t overlook the role of local governments in logistics. Zoning, local road maintenance, and permits can significantly affect distribution efficiency.',
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

  // Helper to render a clean card (no coloured left border)
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
      <header className="bg-[#7c2d12] dark:bg-[#431407] border-b border-orange-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Government Logistics &{' '}
            <span className="text-orange-300 font-bold italic">
              Environmental Sustainability
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to powers and duties of governments in logistics, export controls, duty considerations, recycling, disposal, and environmental issues in distribution management.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Landmark size={14} className="inline mr-1" /> Government
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Leaf size={14} className="inline mr-1" /> Sustainability
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Recycling size={14} className="inline mr-1" /> Recycling
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
                placeholder="Search for a concept, duty, environmental issue..."
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
            {/* SECTION 1: Intro – Powers and Duties (overview) */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Powers and Duties of Central and Local Governments in Logistics
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine building a road for delivery trucks. The central government makes the big rules about how roads are built across the whole country, and the local government takes care of the roads in your town. They both have jobs to do to make sure things move smoothly.
                  </p>
</div>
            </div>

            {/* SECTION 2: Central & Local Government details */}
            <div
              ref={(el) => {
                sectionRefs.current['powers'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Central Government Powers and Duties
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. National Infrastructure Development', icon: <GlobeIcon size={16} />, content: 'Planning and developing major infrastructure projects – highways, railways, ports, airports. Sets the standards for the nation\'s transport network, funding new highways or expanding seaports to handle trade.' },
                  { title: '2. Regulatory Framework and Standards', icon: <Shield size={16} />, content: 'Establishing national regulations for transportation, safety, and environmental protection. Creates consistent rules for vehicle safety, hazardous materials transport, and customs procedures.' },
                  { title: '3. International Trade and Customs', icon: <Ship size={16} />, content: 'Managing international trade agreements and customs procedures. Negotiates free trade agreements and manages customs at borders to facilitate smooth cross-border flow of goods.' },
                  { title: '4. National Transportation Planning', icon: <Layout size={16} />, content: 'Developing national transportation plans and strategies. Conducts long-term studies and plans for future railway expansion, ensuring a cohesive national network.' },
                  { title: '5. National Security', icon: <Lock size={16} />, content: 'Responsible for the security of the nation\'s transportation networks, including border security and protecting critical infrastructure from threats.' },
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

              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase mt-12">
                Local Government Powers and Duties
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Local Road Maintenance and Development', icon: <MapPin size={16} />, content: 'Maintaining and developing local roads and infrastructure. Fixes potholes, builds new roads, and ensures smooth movement of goods within the local area.' },
                  { title: '2. Land Use Planning and Zoning', icon: <Layout size={16} />, content: 'Controlling land use planning and zoning for warehouses and distribution centres. Designates industrial areas near highways, encouraging business development.' },
                  { title: '3. Local Traffic Management', icon: <BarChart size={16} />, content: 'Managing local traffic flow and implementing traffic regulations. Adjusts traffic light timings and implements calming measures to facilitate delivery trucks.' },
                  { title: '4. Local Permits and Licenses', icon: <FileText size={16} />, content: 'Issuing permits and licenses for logistics activities like truck parking and delivery operations. Controls permits for oversized loads and loading/unloading zones.' },
                  { title: '5. Enforcement of Local Regulations', icon: <Gavel size={16} />, content: 'Enforcing local regulations related to transportation and logistics, such as parking restrictions and noise ordinances. Issues fines for violations to maintain community order.' },
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

            {/* SECTION 3: Role of Government Departments */}
            <div
              ref={(el) => {
                sectionRefs.current['roles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Role of Government Departments in Safety, Environment, and Public Interests
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Think of government departments as the people who make sure delivery trucks are safe, do not pollute too much, and do not bother people living nearby. They set rules and check that companies follow them.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Safety Regulations and Enforcement', icon: <Shield size={16} />, content: 'Establishing and enforcing safety regulations for vehicles, warehouses, and handling of goods. Includes truck maintenance standards, driver training, and hazardous materials rules to prevent accidents.' },
                  { title: '2. Environmental Protection and Sustainability', icon: <Leaf size={16} />, content: 'Setting regulations to minimize environmental impact – emissions, waste disposal, noise pollution. Requires cleaner fuels, recycling programs, and noise ordinances to reduce the carbon footprint.' },
                  { title: '3. Public Health and Welfare', icon: <Users size={16} />, content: 'Ensuring distribution activities do not harm public health, such as regulating food and pharmaceutical transport. Includes temperature-controlled transport for perishable goods and safe handling of medicines.' },
                  { title: '4. Infrastructure Planning and Development', icon: <Layout size={16} />, content: 'Planning and developing transportation infrastructure – roads, bridges, ports. Invests in new highways and port expansions to support efficient and safe distribution.' },
                  { title: '5. Consumer Protection', icon: <Target size={16} />, content: 'Protecting consumers from unfair or unsafe practices – product labelling and consumer rights. Requires accurate origin information and safety compliance, enabling informed choices.' },
                  { title: '6. Emergency Response and Preparedness', icon: <AlertCircle size={16} />, content: 'Coordinating emergency response for natural disasters or accidents. Deploys emergency supplies, manages clean-up of hazardous spills, and ensures essential supplies reach those in need.' },
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

            {/* SECTION 4: International Distribution Problems */}
            <div
              ref={(el) => {
                sectionRefs.current['international'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Problems and Factors in Distributing Goods to International Areas
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine sending a package to someone in another country. It is not as simple as sending it to your neighbour. You must deal with different rules, paperwork, and ways of moving things. There might be delays, extra costs, and you need to make sure everything is legal.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Documentation and Licensing', icon: <FileText size={16} />, content: 'Complex documentation (invoices, certificates, customs declarations) and licensing requirements. Each country has unique rules; errors can cause delays, fines, or seizure of goods.' },
                  { title: '2. Movement of Freight Through Airports and Seaports', icon: <Ship size={16} />, content: 'Congestion, limited capacity, and complex security checks at ports and airports can cause significant delays. Infrastructure inadequacies and lengthy inspections add to transit times.' },
                  { title: '3. Customs and Tariffs', icon: <DollarSign size={16} />, content: 'Varied customs procedures and tariffs that can change unpredictably. Tariffs increase costs; customs inspections can be time-consuming and require detailed documentation.' },
                  { title: '4. Cultural and Language Barriers', icon: <Users size={16} />, content: 'Communication and business practice differences can lead to misunderstandings and errors. Awareness of local customs and building strong relationships is crucial.' },
                  { title: '5. Currency Exchange and Financial Risks', icon: <DollarSign size={16} />, content: 'Fluctuating exchange rates affect costs and profits. Payment terms and methods vary; managing currency risk and understanding local payment practices is essential.' },
                  { title: '6. Transportation and Logistics Infrastructure', icon: <Truck size={16} />, content: 'Inadequate roads, railways, and ports in some countries lead to delays and higher costs. Remote or landlocked destinations are particularly challenging.' },
                  { title: '7. Political and Economic Instability', icon: <AlertTriangle size={16} />, content: 'Changes in government policies, trade disputes, or political unrest can disrupt supply chains. Monitoring conditions and having contingency plans is vital.' },
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

            {/* SECTION 5: Export Controls */}
            <div
              ref={(el) => {
                sectionRefs.current['export'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Export Controls
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Export controls are government regulations that restrict the export of certain goods, technologies, and services to protect national security, foreign policy, and economic interests.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Shield size={16} /> Purpose of Export Controls
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>National Security:</strong> Prevent sensitive technologies from reaching adversaries.</li>
                    <li><strong>Foreign Policy:</strong> Support human rights, prevent weapons proliferation, impose sanctions.</li>
                    <li><strong>Economic Interests:</strong> Protect domestic industries and strategic technologies.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <ListChecks size={16} /> Key Aspects
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Controlled Goods:</strong> Lists of items with military or dual‑use applications.</li>
                    <li><strong>Licensing Requirements:</strong> Permits needed before exporting controlled items.</li>
                    <li><strong>Destination Restrictions:</strong> Prohibited exports to certain countries.</li>
                    <li><strong>End‑User &amp; End‑Use Controls:</strong> Restrictions based on intended use or user.</li>
                    <li><strong>Compliance:</strong> Exporters must ensure adherence; violations lead to penalties.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 6: Duty Considerations */}
            <div
              ref={(el) => {
                sectionRefs.current['duty'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Duty Considerations in Government Logistics and Distribution Management
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In government logistics, "duty considerations" refer to responsibilities, obligations, and legal requirements that agencies must adhere to in planning, executing, and overseeing the movement of goods. They ensure ethical, efficient, and legally compliant operations.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Fiscal Responsibility and Accountability', icon: <DollarSign size={16} />, content: 'Using taxpayer money responsibly – competitive bidding, cost-effectiveness analysis, transparent record-keeping, and budget compliance.' },
                  { title: '2. Legal and Regulatory Compliance', icon: <Shield size={16} />, content: 'Adherence to procurement laws, transportation regulations, customs and trade laws, security regulations, and labour laws.' },
                  { title: '3. Ethical Considerations', icon: <Award size={16} />, content: 'Avoiding conflicts of interest, bribery, and corruption; ensuring fairness, impartiality, and environmental responsibility.' },
                  { title: '4. Performance and Efficiency', icon: <Target size={16} />, content: 'Meeting service level agreements, optimizing inventory, improving transportation efficiency, and using technology effectively.' },
                  { title: '5. Public Safety and Welfare', icon: <Users size={16} />, content: 'Providing emergency response logistics, ensuring delivery of essential services, and stockpiling supplies for disasters.' },
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
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} /> Consequences of Neglecting Duty Considerations
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Legal penalties (fines, lawsuits, criminal charges)</li>
                  <li>Reputational damage (loss of public trust)</li>
                  <li>Financial losses (increased costs, budget overruns)</li>
                  <li>Inefficient operations (delays, stockouts)</li>
                  <li>Security breaches (theft, safety threats)</li>
                </ul>
              </div>
            </div>

            {/* SECTION 7: Recycling and Disposal */}
            <div
              ref={(el) => {
                sectionRefs.current['recycling'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Recycling and Disposal in Logistics and Distribution Management
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Recycling and disposal are critical for sustainable logistics, minimizing environmental impact, reducing waste, and complying with regulations. Integrating responsible practices throughout the supply chain is essential.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Importance', icon: <Target size={16} />, content: 'Environmental protection (reduce landfill, pollution, conserve resources), regulatory compliance, cost reduction, brand reputation, and social responsibility.' },
                  { title: '2. Key Areas for Recycling', icon: <Package size={16} />, content: (
                    <>
                      <p><strong>Packaging:</strong> Cardboard, plastic, styrofoam, stretch wrap, wood pallets, metal strapping – each with specific recycling streams.</p>
                      <p><strong>Damaged Inventory:</strong> Recycle components, donate usable items, refurbish, or responsibly dispose.</p>
                      <p><strong>E‑waste:</strong> Computers, monitors, printers – use certified recyclers to recover valuable and hazardous materials.</p>
                      <p><strong>Transport Equipment:</strong> Tires, vehicle parts, batteries – recycle or properly dispose of hazardous fluids.</p>
                      <p><strong>Office/Warehouse Supplies:</strong> Paper, ink cartridges, batteries – recycle through designated programs.</p>
                    </>
                  ) },
                  { title: '3. Best Practices', icon: <ListChecks size={16} />, content: 'Conduct waste audits, implement waste reduction strategies (source reduction, reuse, inventory optimization), separate collection streams, train employees, partner with recycling companies, use responsible disposal (landfill as last resort), track and report performance, embrace circular economy principles, and leverage technology for efficient waste management.' },
                  { title: '4. Challenges', icon: <AlertTriangle size={16} />, content: 'Cost (recycling can be more expensive), infrastructure limitations, complexity of sorting, contamination of recyclables, and varying regulations by jurisdiction.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                      {typeof item.content === 'string' ? <p>{item.content}</p> : item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 8: Environmental Issues */}
            <div
              ref={(el) => {
                sectionRefs.current['environment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Environmental Issues in Logistics and Distribution Management
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Logistics and distribution, by its nature, moves goods and people, leading to significant environmental impacts. Recognizing and addressing these concerns is crucial for sustainable supply chains.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Transportation Emissions', icon: <Fuel size={16} />, content: 'GHG emissions (CO₂, CH₄, N₂O) contribute to climate change; air pollutants (PM, NOx, SOx) cause smog and respiratory issues; noise pollution disrupts communities.' },
                  { title: '2. Packaging Waste', icon: <Package size={16} />, content: 'Landfill overflow, resource depletion (trees, petroleum), plastic pollution in oceans and waterways, and microplastics.' },
                  { title: '3. Energy Consumption', icon: <CpuIcon size={16} />, content: 'Warehouse lighting, heating/cooling, equipment; fuel for vehicles; data centre energy use for IT infrastructure.' },
                  { title: '4. Land Use', icon: <Landmark size={16} />, content: 'Warehouses and distribution centres displace habitats; transportation infrastructure fragments ecosystems; deforestation linked to packaging and agriculture.' },
                  { title: '5. Water Pollution', icon: <CloudRain size={16} />, content: 'Vehicle washing, spills/leaks of fuel and hazardous materials, stormwater runoff from parking lots and loading docks.' },
                  { title: '6. Depletion of Natural Resources', icon: <HardDriveIcon size={16} />, content: 'Over-reliance on fossil fuels; extraction of raw materials for packaging (trees, minerals, petroleum).' },
                  { title: '7. Climate Change Impacts on Logistics', icon: <AlertCircle size={16} />, content: 'Extreme weather (hurricanes, floods) disrupts supply chains; sea level rise threatens coastal ports; changes in agricultural production affect food supply chains.' },
                  { title: '8. Waste Management Issues', icon: <Recycling size={16} />, content: 'Improper disposal of e-waste and hazardous materials (batteries, cleaning supplies, refrigerants).' },
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
                  <Target size={16} /> Mitigation Strategies
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Sustainable Transportation:</strong> Fuel efficiency, alternative fuels (EVs, hydrogen), modal shift to rail/water, shipment consolidation.</li>
                  <li><strong>Sustainable Packaging:</strong> Reduce, reuse, recycle, use bio-based materials.</li>
                  <li><strong>Energy Efficiency:</strong> Efficient lighting, HVAC, renewable energy (solar, wind), smart energy management.</li>
                  <li><strong>Sustainable Warehousing:</strong> Green building design, water conservation, waste reduction programs.</li>
                  <li><strong>Reverse Logistics:</strong> Efficient returns management, repair, reuse, recycling.</li>
                  <li><strong>Collaboration:</strong> Work with suppliers and customers to reduce impacts across the supply chain.</li>
                  <li><strong>Technology &amp; Data:</strong> Route optimization, fuel monitoring, performance tracking.</li>
                  <li><strong>Regulatory Compliance:</strong> Adhere to environmental regulations.</li>
                  <li><strong>Carbon Offsetting:</strong> Invest in emission reduction projects.</li>
                  <li><strong>Circular Economy:</strong> Design systems that minimize waste and maximize resource utilisation.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Governance &amp; Sustainability Insight
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
                  <span>Government Duty Areas</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Environmental Issues</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>International Distribution Factors</span>
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
                Government logistics involve both central and local powers – from national infrastructure to local zoning. Export controls and duty considerations ensure legal and ethical operations. Recycling, disposal, and environmental sustainability are increasingly critical for responsible supply chain management. Understanding these issues and implementing mitigation strategies is essential for public and private organisations alike.
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
                <strong className="text-white">Government Powers</strong> – central governments handle national infrastructure, regulations, and trade; local governments manage roads, zoning, traffic, and permits.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Government Roles</strong> – departments ensure safety, environmental protection, public health, infrastructure planning, consumer protection, and emergency response.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">International Distribution</strong> – challenges include documentation, port congestion, tariffs, cultural barriers, currency risks, infrastructure gaps, and political instability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Export Controls &amp; Duty</strong> – controls protect security and foreign policy; duty considerations cover fiscal, legal, ethical, performance, and public safety obligations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Sustainability</strong> – recycling and disposal reduce waste; environmental issues (emissions, packaging, energy, land, water) require mitigation through sustainable transport, packaging, energy efficiency, and circular economy principles.
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
            Sidemann Academic Registry • Government Logistics &amp; Sustainability 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome8;
