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
  Type,
  Edit,
  Hash,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
  HardDriveIcon,
  Archive,
  ClockIcon,
  Layout,
  Scale,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'ethics-materials', label: 'Ethics in Materials' },
  { id: 'inventory-ethics', label: 'Inventory Ethics' },
  { id: 'hazmat', label: 'Hazardous Materials' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome10: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(null);

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
        text: 'Ethical materials management not only builds trust but also reduces supply chain risks. Companies with strong ethical practices often have more resilient and reliable supplier relationships.',
      },
      {
        title: 'Pro Tip',
        text: 'Always document your inventory management decisions. Clear documentation protects against accusations of impropriety and provides a clear audit trail.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five pillars of ethics in materials management: Integrity, Transparency, Conflict Avoidance, Confidentiality, and Sustainability.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations overlook the importance of proper hazardous materials training. Regular, comprehensive training is essential for preventing accidents and ensuring compliance.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Ethical materials management not only builds trust but also reduces supply chain risks. Companies with strong ethical practices often have more resilient and reliable supplier relationships.',
      },
      {
        title: 'Pro Tip',
        text: 'Always document your inventory management decisions. Clear documentation protects against accusations of impropriety and provides a clear audit trail.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five pillars of ethics in materials management: Integrity, Transparency, Conflict Avoidance, Confidentiality, and Sustainability.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations overlook the importance of proper hazardous materials training. Regular, comprehensive training is essential for preventing accidents and ensuring compliance.',
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

  // ─── Helper to render a clean card ──────────────────────────────────────
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

  // ─── Content Data ────────────────────────────────────────────────────────
  const sections = [
    {
      id: 'ethics-materials',
      title: "1. Ethics in Materials Management",
      icon: <Shield size={16} />,
      points: [
        {
          title: "1. Upholding Integrity in Supplier Relationships",
          icon: <Shield size={16} />,
          content: (
            <>
              <p><strong>Being honest and fair when dealing with the companies that provide your materials.</strong></p>
              <p>Ethics in materials management starts with how you treat suppliers. This means being truthful about your needs, expectations, and the reasons for your decisions. It means avoiding any actions that could be seen as unfair or manipulative, such as demanding unreasonable discounts or accepting bribes. It also means treating all suppliers with respect, regardless of their size or influence.</p>
              <p>For example, if you're selecting a supplier, you should do so based on their ability to provide quality materials at a fair price, not on personal relationships or hidden benefits. You should also ensure that all suppliers have a fair chance to compete for your business. Building strong, ethical relationships with suppliers is not only the right thing to do, but it also leads to better long-term partnerships and a more reliable supply chain.</p>
            </>
          ),
        },
        {
          title: "2. Ensuring Transparency in Procurement Processes",
          icon: <GlobeIcon size={16} />,
          content: (
            <>
              <p><strong>Making sure everyone can see how you buy your materials and that it's done openly.</strong></p>
              <p>Transparency in procurement means that all stages of the purchasing process should be open and visible. This includes clearly defining the criteria for selecting suppliers, documenting all decisions, and making information available to relevant stakeholders. For example, if you're using a competitive bidding process, you should ensure that all bidders have access to the same information and that the evaluation criteria are clearly defined. This helps to prevent any suspicion of favoritism or corruption. It also allows for accountability, as anyone can review the process and ensure that it was conducted fairly. Transparency builds trust, not only with suppliers but also with customers and the public. When people can see that materials are being sourced ethically, it strengthens the organization's reputation and fosters a culture of integrity.</p>
            </>
          ),
        },
        {
          title: "3. Avoiding Conflicts of Interest",
          icon: <Target size={16} />,
          content: (
            <>
              <p><strong>Not letting personal relationships or benefits influence your decisions about materials.</strong></p>
              <p>A conflict of interest arises when a person's personal interests could potentially compromise their professional judgment. In materials management, this could mean accepting gifts or favors from suppliers, having a personal relationship with a supplier's employee, or owning a stake in a supplier's company. To avoid conflicts of interest, it's important to establish clear guidelines and policies. Employees should be required to disclose any potential conflicts, and decisions should be made based on objective criteria. For example, if you're evaluating bids from suppliers, you should not participate in the evaluation if you have any personal or financial ties to any of the bidders. Avoiding conflicts of interest ensures that decisions are made in the best interests of the organization and that resources are used responsibly.</p>
            </>
          ),
        },
        {
          title: "4. Maintaining Confidentiality of Sensitive Information",
          icon: <HardDriveIcon size={16} />,
          content: (
            <>
              <p><strong>Keeping secret information about suppliers or materials safe.</strong></p>
              <p>Materials management often involves handling sensitive information, such as pricing data, supplier strategies, and proprietary technologies. It's crucial to maintain the confidentiality of this information to protect the interests of both the organization and its suppliers. This means implementing security measures to prevent unauthorized access and ensuring that employees understand their obligations regarding confidentiality. For example, you should not share a supplier's pricing information with their competitors, and you should not disclose any proprietary information about materials or processes without the supplier's consent. Maintaining confidentiality builds trust and strengthens relationships with suppliers, and helps to maintain a competitive advantage.</p>
            </>
          ),
        },
        {
          title: "5. Promoting Sustainability and Social Responsibility",
          icon: <GlobeIcon size={16} />,
          content: (
            <>
              <p><strong>Choosing materials and suppliers that are good for the environment and people.</strong></p>
              <p>Ethics in materials management extends to promoting sustainability and social responsibility. This means considering the environmental and social impact of materials and suppliers. For example, you might choose to source materials from suppliers who use sustainable practices, such as reducing waste and emissions. You might also choose to work with suppliers who respect human rights and provide fair working conditions. This is not just a matter of doing good, but also a matter of managing risks and building a positive reputation. Consumers and stakeholders are increasingly concerned about the environmental and social impact of products, and organizations that demonstrate a commitment to sustainability and social responsibility are more likely to be successful in the long term.</p>
            </>
          ),
        },
      ],
    },
    {
      id: 'inventory-ethics',
      title: "2. Ethical Issues in Inventory Management",
      icon: <ListChecks size={16} />,
      points: [
        {
          title: "1. Misrepresentation of Inventory Levels or Condition",
          icon: <Edit size={16} />,
          content: (
            <>
              <p><strong>Lying about how much stuff you have or how good it is.</strong></p>
              <p>Ethical issues arise when inventory managers misrepresent the actual state of their stock. This can involve inflating inventory counts to meet performance targets or downplaying the condition of damaged or obsolete items to avoid write-offs. For example, a manager might report that they have a full warehouse when in reality, many items are missing or unusable. Or, they might ship out damaged goods to customers, knowing they're faulty, rather than admitting the mistake. This kind of dishonesty can have serious consequences. It can lead to inaccurate financial reporting, misleading stakeholders about the company's assets, and ultimately, damage the company's reputation. Customers who receive faulty goods lose trust, and investors who rely on false reports can make poor decisions. Maintaining accurate records and being truthful about the state of inventory is crucial for building trust and ensuring ethical management practices.</p>
            </>
          ),
        },
        {
          title: "2. Improper Disposal of Obsolete or Hazardous Inventory",
          icon: <Archive size={16} />,
          content: (
            <>
              <p><strong>Getting rid of old or dangerous stuff in a way that hurts the environment or people.</strong></p>
              <p>Inventory management involves handling obsolete or hazardous materials, which requires responsible disposal practices. Ethical issues arise when companies prioritize cost-cutting over environmental and safety concerns. For instance, a company might illegally dump hazardous chemicals to avoid disposal fees or discard electronic waste in landfills, which can leach harmful substances into the soil and water. This kind of behavior not only violates environmental regulations but also poses a significant risk to public health and the environment. Ethical inventory managers must ensure that all disposal practices comply with regulations and prioritize the safety of their employees and the community. This might involve investing in proper disposal facilities, recycling programs, or working with specialized waste management companies. Choosing the responsible path, even if it costs more, is essential for demonstrating a commitment to ethical and sustainable practices.</p>
            </>
          ),
        },
        {
          title: "3. Prioritizing Personal Gain Over Organizational Interests",
          icon: <Target size={16} />,
          content: (
            <>
              <p><strong>Putting your own interests ahead of what's best for the company.</strong></p>
              <p>Conflicts of interest can arise when inventory managers prioritize personal gain over the organization's interests. This can involve accepting bribes or kickbacks from suppliers in exchange for favorable treatment, or manipulating inventory levels to benefit from insider trading. For example, a manager might accept a gift from a supplier in exchange for placing a large order, even if the supplier's products are of lower quality. Or, they might delay reporting inventory shortages to avoid blame, even if it disrupts production and customer service. These actions undermine the integrity of the inventory management process and can lead to financial losses and reputational damage for the company. Ethical inventory managers must always act in the best interests of the organization and avoid any situations that could compromise their impartiality. This means establishing clear policies on conflicts of interest, promoting transparency, and fostering a culture of accountability.</p>
            </>
          ),
        },
        {
          title: "4. Manipulation of Inventory Data for Performance Metrics",
          icon: <Hash size={16} />,
          content: (
            <>
              <p><strong>Changing the numbers to make it look like you're doing better than you are.</strong></p>
              <p>Inventory managers might be tempted to manipulate inventory data to meet performance metrics or achieve bonuses. This can involve artificially inflating inventory levels, delaying write-offs, or misclassifying inventory to improve financial ratios. For example, a manager might delay reporting damaged goods to avoid a negative impact on their performance evaluation, or they might artificially inflate the value of slow-moving inventory to improve the company's asset value. While this might provide a short-term boost to performance metrics, it can lead to long-term problems, such as inaccurate financial reporting, poor decision-making, and a loss of trust. Ethical inventory managers must maintain accurate and transparent records and resist the temptation to manipulate data for personal gain. This means focusing on achieving real results and building a culture where honesty and integrity are valued.</p>
            </>
          ),
        },
        {
          title: "5. Neglecting Safety Standards in Inventory Storage and Handling",
          icon: <Shield size={16} />,
          content: (
            <>
              <p><strong>Ignoring safety rules when storing or moving materials.</strong></p>
              <p>Inventory storage and handling involve potential safety risks, especially when dealing with hazardous materials or heavy equipment. Ethical issues arise when companies neglect safety standards to cut costs or increase efficiency. For example, a company might overcrowd storage areas, block emergency exits, or fail to provide proper training for employees who handle hazardous materials. This can lead to accidents, injuries, and even fatalities. Ethical inventory managers must prioritize safety and ensure that all storage and handling practices comply with safety regulations. This means investing in proper safety equipment, providing regular training, and conducting safety audits. Creating a safe working environment is not only a legal requirement but also a moral obligation.</p>
            </>
          ),
        },
      ],
    },
    {
      id: 'hazmat',
      title: "3. Management of Hazardous Materials",
      icon: <FileText size={16} />,
      points: [
        {
          title: "1. Identification and Classification of Hazardous Materials",
          icon: <FileText size={16} />,
          content: (
            <>
              <p><strong>Knowing what stuff is dangerous and putting it into the right groups.</strong></p>
              <p>The first step in managing hazardous materials is to identify and classify them correctly. This involves understanding the properties of each material and determining the potential risks it poses to people and the environment. Hazardous materials can include chemicals, flammable liquids, toxic gases, radioactive substances, and biological agents. To classify these materials, we use standardized systems that provide information about their hazards, such as flammability, toxicity, and reactivity. These classifications are often indicated by labels and safety data sheets (SDS). Knowing the correct classification allows for the proper handling, storage, and transportation of these materials. If we don't know what we're working with, we can't take the right precautions. For example, if a material is highly flammable, it needs to be stored away from heat sources and sparks. Accurate identification is the foundation of safe hazardous material management.</p>
            </>
          ),
        },
        {
          title: "2. Safe Storage and Handling Procedures",
          icon: <Layout size={16} />,
          content: (
            <>
              <p><strong>Keeping dangerous stuff in the right place and moving it carefully.</strong></p>
              <p>Once hazardous materials are identified, they must be stored and handled according to strict safety procedures. This includes using appropriate containers, labeling them clearly, and storing them in designated areas that are designed to minimize risks. For instance, corrosive materials might need to be stored in special containers made of materials that won't react with them, and flammable liquids should be kept in well-ventilated areas away from ignition sources. When handling hazardous materials, workers must use personal protective equipment (PPE), such as gloves, respirators, and eye protection. They should also be trained on the proper techniques for moving and handling these materials to prevent spills, leaks, and other accidents. This might include using specialized equipment, like forklifts with explosion proof motors, or following strict protocols for transferring liquids between containers. Proper storage and handling are crucial to prevent accidents and protect workers from exposure to harmful substances.</p>
            </>
          ),
        },
        {
          title: "3. Emergency Response Planning",
          icon: <ClockIcon size={16} />,
          content: (
            <>
              <p><strong>Having a plan for what to do if something bad happens with the dangerous stuff.</strong></p>
              <p>Despite the best precautions, accidents involving hazardous materials can still happen. Therefore, it's essential to have a comprehensive emergency response plan in place. This plan should outline the steps to take in the event of a spill, leak, fire, or other incident. It should also include procedures for evacuating the area, containing the spill, and providing medical assistance. Emergency response plans also need to include contact information for emergency services, such as fire departments, police, and environmental agencies. Regular drills and training sessions should be conducted to ensure that all personnel are familiar with the plan and know how to respond effectively. Having a well-rehearsed plan can minimize the impact of an accident and protect lives and property.</p>
            </>
          ),
        },
        {
          title: "4. Waste Disposal and Environmental Protection",
          icon: <Archive size={16} />,
          content: (
            <>
              <p><strong>Getting rid of the dangerous stuff safely and without hurting the environment.</strong></p>
              <p>Hazardous materials that are no longer needed must be disposed of properly to prevent environmental contamination and protect public health. This involves following strict regulations for the treatment and disposal of hazardous waste. This might include neutralizing chemicals, incinerating waste at high temperatures, or disposing of it in specially designed landfills. Companies must also ensure that they comply with environmental regulations related to air emissions, wastewater discharge, and soil contamination. This may involve installing pollution control equipment, monitoring emissions, and conducting regular environmental audits. Responsible waste disposal practices are not only a legal requirement but also a moral obligation to protect the environment for future generations.</p>
            </>
          ),
        },
        {
          title: "5. Training and Communication",
          icon: <BookOpen size={16} />,
          content: (
            <>
              <p><strong>Teaching people how to work safely with dangerous stuff and keeping everyone informed.</strong></p>
              <p>Effective management of hazardous materials requires ongoing training and communication. All personnel who handle or work near hazardous materials must receive comprehensive training on the hazards, safety procedures, and emergency response plans. This training should be regularly updated to reflect changes in regulations or best practices. Communication is also essential to ensure that everyone is aware of the potential risks and knows how to protect themselves. This might involve posting warning signs, providing safety data sheets, and conducting regular safety meetings. Open communication channels should be established to encourage workers to report any safety concerns or near misses. Investing in training and communication helps to create a culture of safety and prevent accidents.</p>
            </>
          ),
        },
      ],
    },
  ];

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Ethics, Inventory &amp;{' '}
            <span className="text-sky-300 font-bold italic">
              Hazardous Materials
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to ethics in materials management, ethical issues in inventory, and the safe management of hazardous materials.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Ethics
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ListChecks size={14} className="inline mr-1" /> Inventory
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileText size={14} className="inline mr-1" /> Hazardous Materials
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
                placeholder="Search for a principle, issue, hazardous material concept..."
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
            {sections.map((section, idx) => (
              <div
                key={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                  {section.title}
                </h2>

                {section.points.map((point, pIdx) => (
                  <div key={pIdx} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {point.icon} {point.title}
                    </h3>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {point.content}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Ethics Insight
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
                  <span>Ethics in Materials</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Inventory Ethics</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>HazMat Management</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Ethics in materials management requires integrity, transparency, conflict avoidance, confidentiality, and sustainability. Inventory ethics demands honest reporting, proper disposal, avoiding personal gain, accurate data, and safety standards. Hazardous materials management involves proper identification, safe storage and handling, emergency planning, responsible disposal, and comprehensive training. Upholding these principles protects people, the environment, and your organisation.
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
                <strong className="text-white">Ethics in Materials Management</strong> – Five key principles: Integrity in supplier relationships, Transparency in procurement, Avoiding conflicts of interest, Maintaining confidentiality, and Promoting sustainability and social responsibility.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Ethical Issues in Inventory</strong> – Five critical issues: Misrepresentation of inventory, Improper disposal of obsolete/hazardous materials, Prioritising personal gain, Manipulation of inventory data, and Neglecting safety standards in storage and handling.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Hazardous Materials Management</strong> – Five essential practices: Identification and classification, Safe storage and handling, Emergency response planning, Proper waste disposal, and Ongoing training and communication. Safety and compliance are non-negotiable.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Best Practices</strong> – Always document decisions, prioritise safety, maintain transparency, avoid conflicts of interest, and invest in training. Ethical and safe practices protect people, the environment, and your organisation's reputation.
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
            Sidemann Academic Registry • Ethics, Inventory &amp; HazMat Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome10;
