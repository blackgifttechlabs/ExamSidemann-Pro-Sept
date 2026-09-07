import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  Shield,
  DollarSign,
  Award,
  Users,
  Lightbulb,
  Leaf,
  Package,
  CheckCircle,
  MapPin,
  ShoppingCart,
  Building2,
  Clock,
  Users2,
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
  { id: 'specific', label: 'Specific Objectives' },
  { id: 'six-rights', label: 'The Six Rights' },
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
        text: 'The "Six Rights of Purchasing" concept has been a cornerstone of procurement for decades. It ensures that purchasing professionals focus on the key elements that drive value in every transaction.',
      },
      {
        title: 'Pro Tip',
        text: 'To achieve the "Right Quality," always define clear specifications and quality standards before sourcing. This prevents misunderstandings and ensures suppliers meet your expectations.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the Six Rights with the acronym "QSPTTP": Quality, Quantity, Source, Place, Time, Price — they form the foundation of every purchasing decision.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t focus solely on price. The "Right Price" must be balanced with quality, delivery, and service. The cheapest option often costs more in the long run.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The "Six Rights of Purchasing" concept has been a cornerstone of procurement for decades. It ensures that purchasing professionals focus on the key elements that drive value in every transaction.',
      },
      {
        title: 'Pro Tip',
        text: 'To achieve the "Right Quality," always define clear specifications and quality standards before sourcing. This prevents misunderstandings and ensures suppliers meet your expectations.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the Six Rights with the acronym "QSPTTP": Quality, Quantity, Source, Place, Time, Price — they form the foundation of every purchasing decision.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t focus solely on price. The "Right Price" must be balanced with quality, delivery, and service. The cheapest option often costs more in the long run.',
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

  // Helper to render a clean card
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> PROCUREMENT &amp; SUPPLY CHAIN
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Specific Purchasing Objectives{' '}
            <span className="text-amber-300 font-bold italic">
              &amp; The Six Rights
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to specific purchasing objectives including cost reduction, quality improvement, supplier relationships, risk mitigation, innovation, sustainability, and the six rights of purchasing.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Objectives
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <CheckCircle size={14} className="inline mr-1" /> Six Rights
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ShoppingCart size={14} className="inline mr-1" /> Purchasing
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
                placeholder="Search for an objective, right, concept..."
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
            {/* SECTION 1: Specific Purchasing Objectives */}
            <div
              ref={(el) => {
                sectionRefs.current['specific'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Specific Purchasing Objectives
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    What are Specific Purchasing Objectives? These are the clear goals a "buying department" sets to make sure they are doing their job well. It is like having a checklist of things to achieve when you go grocery shopping, like "find the best price on milk" or "buy fresh vegetables."
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Cost Reduction', icon: <DollarSign size={16} />, content: 'Spending less money on what you buy. Involves negotiation, volume discounts, analysing spending patterns, consolidating purchases, and collaborating with suppliers for cost-saving opportunities like optimized packaging or streamlined logistics.' },
                  { title: '2. Quality Improvement', icon: <Award size={16} />, content: 'Getting better stuff to buy. Establishing clear quality standards, rigorous supplier evaluations, and robust quality control procedures. Working with suppliers to improve performance and reliability, ensuring products meet or exceed customer expectations.' },
                  { title: '3. Supplier Relationship Management', icon: <Users size={16} />, content: 'Building good relationships with the people you buy from. Strategic approach to managing interactions, fostering open communication, collaboration, and trust. Developing long-term partnerships that lead to improved quality, reduced costs, and enhanced innovation.' },
                  { title: '4. Risk Mitigation', icon: <Shield size={16} />, content: 'Avoiding problems that could disrupt the supply of goods. Identifying and minimizing risks from supplier instability, geopolitical events, natural disasters, and cyberattacks. Developing contingency plans, diversifying suppliers, and proactive monitoring.' },
                  { title: '5. Innovation and Technology Adoption', icon: <Lightbulb size={16} />, content: 'Using new ideas and technology to improve buying. Leveraging e-procurement systems, data analytics, and AI to streamline processes, improve accuracy, and reduce costs. Fostering a culture of creativity and continuous improvement.' },
                  { title: '6. Sustainability', icon: <Leaf size={16} />, content: 'Buying things in a way that is good for the environment and society. Sourcing materials responsibly, reducing waste, ensuring ethical labour practices. Integrating sustainability into purchasing strategies and working with suppliers to improve their sustainability performance.' },
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

            {/* SECTION 2: General Purchasing Objectives - The Six Rights */}
            <div
              ref={(el) => {
                sectionRefs.current['six-rights'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                General Purchasing Objectives: The Six Rights
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    What are General Purchasing Objectives? These are the fundamental goals that every "buying department" aims to achieve in every purchase. It is like a checklist to make sure you get exactly what you need, when you need it, and at the best possible value.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. The Right Quality', icon: <CheckCircle size={16} />, content: 'Getting goods that meet the needed standards. Ensuring purchased goods or services are fit for their intended purpose — covering durability, performance, reliability, and adherence to specifications. Collaborating with suppliers to establish quality control procedures and monitor performance.' },
                  { title: '2. The Right Quantity', icon: <Package size={16} />, content: 'Buying the correct amount of goods. Balancing the need to avoid stockouts with the need to minimize inventory holding costs. Using forecasting techniques and inventory management systems to determine optimal purchase quantities.' },
                  { title: '3. The Right Source', icon: <Building2 size={16} />, content: 'Buying from the best and most reliable supplier. Evaluating potential suppliers based on quality, price, reliability, delivery time, and financial stability. Building long-term relationships and ensuring ethical and sustainable practices.' },
                  { title: '4. The Right Place', icon: <MapPin size={16} />, content: 'Having the goods delivered to the correct location. Coordinating with suppliers and logistics providers for timely and accurate delivery. Ensuring goods are delivered in the right condition through careful handling and storage.' },
                  { title: '5. The Right Time', icon: <Clock size={16} />, content: 'Getting the goods when they are needed. Aligning deliveries with production schedules, project timelines, or customer demand. Establishing clear delivery deadlines, monitoring lead times, and implementing just-in-time inventory management.' },
                  { title: '6. The Right Price', icon: <DollarSign size={16} />, content: 'Paying a fair and competitive price. Negotiating with suppliers, conducting cost analysis, and monitoring market trends. Ensuring the price aligns with quality, delivery, and service levels, considering total cost of ownership rather than just purchase price.' },
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
                  💡 Purchasing Insight
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
                  <span>Specific Objectives</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>The Six Rights</span>
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
                Purchasing objectives are both specific (cost reduction, quality improvement, supplier relationships, risk mitigation, innovation, sustainability) and general (the Six Rights: Right Quality, Right Quantity, Right Source, Right Place, Right Time, Right Price). Balancing these objectives ensures that purchasing delivers maximum value to the organization while building a resilient and responsible supply chain.
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
                <strong className="text-white">Specific Purchasing Objectives</strong> – include cost reduction, quality improvement, supplier relationship management, risk mitigation, innovation and technology adoption, and sustainability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">The Six Rights</strong> – Right Quality, Right Quantity, Right Source, Right Place, Right Time, Right Price — the fundamental goals of every purchase.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Cost Reduction</strong> – not just about slashing prices, but achieving the best value through negotiation, consolidation, and collaboration with suppliers.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Supplier Relationships</strong> – strategic partnerships built on trust and collaboration lead to better quality, lower costs, and innovation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Risk Mitigation &amp; Sustainability</strong> – proactive risk management ensures supply continuity, while sustainable sourcing builds a responsible and resilient supply chain.
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
            Sidemann Academic Registry • Procurement &amp; Supply Chain Management 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;