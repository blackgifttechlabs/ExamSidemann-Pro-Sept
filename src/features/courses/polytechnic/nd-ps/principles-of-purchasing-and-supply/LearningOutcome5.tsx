import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  GlobeIcon,
  Shield,
  ListChecks,
  LayersIcon,
  DollarSign,
  Users,
  MessageSquare,
  TrendingUp,
  Leaf,
  Cpu,
  Handshake,
  Ship,
  Lock,
  RefreshCw,
  Star,
  ClockIcon,
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
  { id: 'situations', label: 'Buying Situations' },
  { id: 'evaluation', label: 'Supplier Evaluation' },
  { id: 'local', label: 'Local Buying' },
  { id: 'sourcing', label: 'Sourcing Strategies' },
  { id: 'make-buy', label: 'Make-or-Buy' },
  { id: 'international', label: 'International Sourcing' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome5: React.FC = () => {
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
        text: 'The three buying situations — Straight Rebuy, Modified Rebuy, and New Task — represent increasing levels of complexity and decision-making effort. Understanding which situation applies helps streamline the purchasing process.',
      },
      {
        title: 'Pro Tip',
        text: 'When evaluating suppliers, don\'t focus solely on price. Use a balanced scorecard approach that includes quality, delivery, financial stability, and sustainability.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three buying situations as "S-M-N": Straight Rebuy (routine), Modified Rebuy (some changes), New Task (first-time purchase).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t overlook the hidden costs of international sourcing — longer lead times, currency fluctuations, and quality control challenges can offset apparent cost savings.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The three buying situations — Straight Rebuy, Modified Rebuy, and New Task — represent increasing levels of complexity and decision-making effort. Understanding which situation applies helps streamline the purchasing process.',
      },
      {
        title: 'Pro Tip',
        text: 'When evaluating suppliers, don\'t focus solely on price. Use a balanced scorecard approach that includes quality, delivery, financial stability, and sustainability.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three buying situations as "S-M-N": Straight Rebuy (routine), Modified Rebuy (some changes), New Task (first-time purchase).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t overlook the hidden costs of international sourcing — longer lead times, currency fluctuations, and quality control challenges can offset apparent cost savings.',
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
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> PROCUREMENT &amp; SUPPLY CHAIN
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Buying Situations &amp;{' '}
            <span className="text-rose-300 font-bold italic">
              Supplier Management
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to buying situations, supplier evaluation, local buying, sourcing strategies, reciprocity, make-or-buy decisions, and international purchasing.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Handshake size={14} className="inline mr-1" /> Sourcing
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Ship size={14} className="inline mr-1" /> International
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Make-or-Buy
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
                placeholder="Search for a concept, strategy, challenge..."
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
            {/* SECTION 1: Intro - Buying Situations */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Buying Situations
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    It is about understanding how much thought and effort a company puts into buying something. Sometimes it is a simple, routine purchase, and sometimes it is a big, complex decision.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Straight Rebuy', icon: <RefreshCw size={16} />, content: 'Buying the same thing from the same supplier, like always. This is the most routine and straightforward buying situation. Used for regularly needed items like office supplies or raw materials. The process is automated or streamlined, with minimal decision-making required.' },
                  { title: '2. Modified Rebuy', icon: <Search size={16} />, content: 'Buying something similar, but with some changes. This involves modifications to product specifications, supplier terms, or pricing. Requires some evaluation and decision-making, but is less complex than a new task purchase.' },
                  { title: '3. New Task', icon: <Target size={16} />, content: 'Buying something completely new for the first time. The most complex and time-consuming buying situation. Requires extensive research, evaluation, and multiple stakeholder involvement. High risk and uncertainty due to no prior experience.' },
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

            {/* SECTION 2: Evaluation of Suppliers */}
            <div
              ref={(el) => {
                sectionRefs.current['evaluation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Evaluation of Suppliers
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    It is like checking someone's references before hiring them. You want to make sure the companies you buy from are reliable, provide good products, and are easy to work with.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Shield size={16} /> Why Evaluate Suppliers?
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Risk Mitigation:</strong> Ensuring suppliers are financially stable and capable.</li>
                  <li><strong>Quality Assurance:</strong> Verifying consistent quality standards.</li>
                  <li><strong>Cost Optimization:</strong> Identifying competitive pricing and value.</li>
                  <li><strong>Performance Improvement:</strong> Monitoring and fostering long-term partnerships.</li>
                  <li><strong>Ethical and Sustainable Practices:</strong> Aligning with company values.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <ListChecks size={16} /> Key Evaluation Criteria
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Quality:</strong> Ability to consistently meet specifications</li>
                  <li><strong>Price:</strong> Total cost of ownership, not just purchase price</li>
                  <li><strong>Delivery and Logistics:</strong> On-time delivery and reliability</li>
                  <li><strong>Financial Stability:</strong> Financial health and long-term viability</li>
                  <li><strong>Capacity and Flexibility:</strong> Ability to scale and adapt</li>
                  <li><strong>Technology and Innovation:</strong> R&D capabilities and continuous improvement</li>
                  <li><strong>Communication and Customer Service:</strong> Responsiveness and support</li>
                  <li><strong>Ethical and Sustainable Practices:</strong> Labour practices and environmental responsibility</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Search size={16} /> Evaluation Methods
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Supplier questionnaires</li>
                    <li>Site visits and audits</li>
                    <li>Performance metrics tracking</li>
                    <li>References and reviews</li>
                    <li>Financial analysis</li>
                    <li>Scoring systems</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <ClockIcon size={16} /> Ongoing Evaluation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Supplier evaluation is not a one-time event. It should be an ongoing process to monitor supplier performance, identify areas for improvement, and maintain strong relationships. Regular performance reviews and feedback sessions help ensure suppliers continue to meet your needs.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: Local Buying */}
            <div
              ref={(el) => {
                sectionRefs.current['local'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Local Buying
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Local buying means purchasing goods and services from businesses within your own community or region. It is like choosing to shop at the farmers' market instead of a big supermarket.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Supporting the Local Economy', icon: <TrendingUp size={16} />, content: 'Helping businesses in your area to grow and thrive. When businesses purchase locally, they invest directly in their community, creating a ripple effect of economic activity, job creation, and higher tax revenues.' },
                  { title: '2. Reducing Environmental Impact', icon: <Leaf size={16} />, content: 'Buying goods that do not have to travel far, reducing pollution. Local sourcing reduces transportation costs and emissions, leading to a smaller carbon footprint and more sustainable supply chain.' },
                  { title: '3. Building Stronger Community Relationships', icon: <Users size={16} />, content: 'Getting to know the people you buy from and creating a stronger community. Local buying fosters personal relationships, improved communication, collaboration, and trust between businesses.' },
                  { title: '4. Increased Agility and Responsiveness', icon: <ClockIcon size={16} />, content: 'Getting what you need faster and more easily. Local suppliers provide faster delivery times, more flexible terms, and quicker adaptation to changing requirements.' },
                  { title: '5. Supporting Unique Local Products and Services', icon: <Star size={16} />, content: 'Finding special things you can only get in your area. Local businesses offer unique products and services that reflect community character and culture, adding value and differentiation.' },
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

            {/* SECTION 4: Sourcing Strategies */}
            <div
              ref={(el) => {
                sectionRefs.current['sourcing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Single and Multiple Sourcing
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    It is about how many suppliers a company chooses to buy from. Single sourcing means buying from just one supplier, while multiple sourcing means buying from several different suppliers.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Target size={16} /> Single Sourcing
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Buying everything you need from just one supplier. Often chosen for specialized products or when a strong, long-term partnership is desired. Benefits include preferential pricing, priority service, and customized solutions. Risks include vulnerability to supplier disruptions.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Simplifies logistics and reduces overhead</li>
                    <li>Builds close, collaborative relationships</li>
                    <li>Higher risk if supplier fails</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <LayersIcon size={16} /> Multiple Sourcing
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Buying the same thing from several different suppliers. Chosen to mitigate risks, ensure supply continuity, and maintain competitive pricing. Benefits include diversification, competition among suppliers, and access to wider capabilities.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Reduces dependency on any single supplier</li>
                    <li>Promotes competition for better pricing and quality</li>
                    <li>Increases administrative complexity</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Handshake size={16} /> Reciprocity
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Essentially the "you scratch my back, I'll scratch yours" principle. The feeling of obligation to return favours is a fundamental social norm that influences business interactions. When someone provides a gift, favour, or service, we experience pressure to reciprocate to maintain a harmonious relationship.
                </p>
              </div>
            </div>

            {/* SECTION 5: Make-or-Buy Decisions */}
            <div
              ref={(el) => {
                sectionRefs.current['make-buy'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Make-or-Buy Decisions
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    It is when a company decides whether to produce something themselves ("make") or purchase it from an outside supplier ("buy"). It is like deciding whether to bake a cake from scratch or buy one from the bakery.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Target size={16} /> Evaluating Core Competencies and Strategic Focus
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Figuring out what your company does best and sticking to it. Core competencies are the unique strengths that give a company competitive advantage. If producing a product or service aligns with core competencies, making it in-house might be better. If not, outsourcing might be more efficient and cost-effective. Focus on what you do best, and let others handle what they do best.
                </p>
              </div>
            </div>

            {/* SECTION 6: International Sourcing */}
            <div
              ref={(el) => {
                sectionRefs.current['international'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Buying Abroad (International Sourcing)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Buying abroad, or international sourcing, has become increasingly common for businesses of all sizes. Here are some of the key reasons why companies choose to purchase goods or services from suppliers in other countries.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Lower Labour Costs', icon: <DollarSign size={16} />, content: 'Often the most significant driver — substantial cost savings due to lower labour costs in certain countries, especially for labour-intensive industries like clothing or electronics assembly.' },
                  { title: '2. Access to Specialized Skills and Resources', icon: <Cpu size={16} />, content: 'Unique skills, resources, or expertise not readily available domestically — rare raw materials, specialized manufacturing, or highly skilled labour in specific industries.' },
                  { title: '3. Increased Capacity and Scalability', icon: <LayersIcon size={16} />, content: 'Overseas suppliers may have greater production capacity or scalability, allowing companies to meet increased demand or handle large-scale projects.' },
                  { title: '4. Access to New Markets and Technologies', icon: <GlobeIcon size={16} />, content: 'Provides insights into local market trends, consumer preferences, and emerging technologies. Can also allow for selling products in the manufacturing country.' },
                  { title: '5. Reduced Material Costs', icon: <HardDriveIcon size={16} />, content: 'Lower raw material prices, favourable exchange rates, or government subsidies can reduce material costs significantly.' },
                  { title: '6. Increased Competition and Supplier Diversification', icon: <Users size={16} />, content: 'Increases competition among suppliers, leading to better pricing and quality. Diversifies supplier base, reducing reliance on any single source and mitigating risks.' },
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

              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase mt-8">
                Challenges Encountered When Buying from Abroad
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    It is about the extra problems that come up when you buy things from companies in other countries. Think of it as the extra steps and difficulties you face when ordering something online from a website in a different language.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Cultural and Language Barriers', icon: <MessageSquare size={16} />, content: 'Not understanding the way people do business in other countries or having trouble talking to them. Business practices, communication styles, and negotiation tactics vary widely, leading to misunderstandings and delays.' },
                  { title: '2. Longer Lead Times and Logistics Complexity', icon: <ClockIcon size={16} />, content: 'It takes longer to get things shipped from far away, and it is more complicated. International shipping involves customs regulations, different transportation modes, and potential delays due to weather or political instability.' },
                  { title: '3. Currency Exchange Rate Fluctuations', icon: <DollarSign size={16} />, content: 'The value of money changes, so the price you pay can change too. Exchange rate changes can make imported goods more or less expensive, affecting profit margins.' },
                  { title: '4. Quality Control and Supplier Monitoring', icon: <Target size={16} />, content: 'It is harder to check the quality of goods and keep an eye on suppliers when they are far away. Distance and cultural differences make on-site inspections and audits more challenging.' },
                  { title: '5. Legal and Regulatory Compliance', icon: <Shield size={16} />, content: 'Different countries have different laws, and you must make sure you follow them all. This includes import/export regulations, customs laws, product safety standards, and labour laws.' },
                  { title: '6. Intellectual Property Protection', icon: <Lock size={16} />, content: 'Making sure your ideas and designs do not get stolen. Protecting IP can be a concern, especially in countries with weak or poorly enforced IP laws.' },
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
                  💡 Sourcing Insight
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
                  <span>Buying Situations</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Evaluation Criteria</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>International Challenges</span>
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
                Understanding buying situations (Straight Rebuy, Modified Rebuy, New Task) helps tailor purchasing efforts. Supplier evaluation balances quality, price, delivery, and ethical practices. Local buying supports communities and reduces environmental impact. Sourcing strategies (single vs. multiple) involve trade-offs between risk and efficiency. Make-or-buy decisions should align with core competencies. International sourcing offers cost advantages but presents challenges in culture, logistics, currency, quality, compliance, and IP protection.
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
                <strong className="text-white">Buying Situations</strong> – Straight Rebuy (routine), Modified Rebuy (some changes), New Task (first-time, complex) — each requires different levels of effort and evaluation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Supplier Evaluation</strong> – considers quality, price, delivery, financial stability, capacity, technology, communication, and sustainability practices through ongoing monitoring.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Local Buying</strong> – supports local economies, reduces environmental impact, builds community relationships, increases agility, and provides access to unique products.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Sourcing Strategies</strong> – Single sourcing (strength, simplicity, risk) vs. Multiple sourcing (diversification, competition, complexity). Reciprocity builds relationships through mutual obligation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Make-or-Buy &amp; International</strong> – Make-or-buy decisions should focus on core competencies. International sourcing offers cost and capability advantages but presents challenges in culture, logistics, currency, quality, compliance, and IP protection.
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

export default LearningOutcome5;