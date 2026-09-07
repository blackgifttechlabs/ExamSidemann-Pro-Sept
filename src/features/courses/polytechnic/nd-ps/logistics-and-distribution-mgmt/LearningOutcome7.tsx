import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  Clock,
  Layout,
  Database,
  Gauge,
  Award,
  Ruler,
  DollarSign,
  Users,
  Shield,
  TrendingUp,
  Calculator,
  HeartHandshake,
  BarChart3,
  Activity,
  Star,
  ArrowUpDown,
  Link,
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
  { id: 'objectives', label: 'Objectives' },
  { id: 'benchmarking', label: 'Benchmarking & DPP' },
  { id: 'standards', label: 'Quality/Service/Cost' },
  { id: 'workmeasure', label: 'Work & Productivity' },
  { id: 'costing', label: 'Costing & Pricing' },
  { id: 'optimization', label: 'Optimization & Trade-offs' },
  { id: 'or', label: 'OR & Queuing' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome7: React.FC = () => {
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
        text: 'Benchmarking was first popularized by Xerox in the 1970s, leading to significant improvements in their manufacturing processes and setting the standard for performance measurement.',
      },
      {
        title: 'Pro Tip',
        text: 'When measuring customer satisfaction, combine quantitative surveys with qualitative feedback to get a complete picture of customer perceptions and areas for improvement.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three key standards: Quality (how good), Service (how well treated), and Cost (how efficient) — they form the foundation of performance management.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t focus only on cost reduction at the expense of service quality. The goal is to find the optimal balance, not to minimize costs regardless of customer impact.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Benchmarking was first popularized by Xerox in the 1970s, leading to significant improvements in their manufacturing processes and setting the standard for performance measurement.',
      },
      {
        title: 'Pro Tip',
        text: 'When measuring customer satisfaction, combine quantitative surveys with qualitative feedback to get a complete picture of customer perceptions and areas for improvement.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three key standards: Quality (how good), Service (how well treated), and Cost (how efficient) — they form the foundation of performance management.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t focus only on cost reduction at the expense of service quality. The goal is to find the optimal balance, not to minimize costs regardless of customer impact.',
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
      <header className="bg-[#312e81] dark:bg-[#1e1b4b] border-b border-indigo-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> PERFORMANCE MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Performance Measurement &{' '}
            <span className="text-indigo-300 font-bold italic">
              Operational Research
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to performance objectives, benchmarking, DPP, quality, service, cost standards, work measurement, productivity, costing, pricing, and OR techniques.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Objectives
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <BarChart3 size={14} className="inline mr-1" /> Benchmarking
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Calculator size={14} className="inline mr-1" /> Costing
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
                placeholder="Search for a concept, technique, standard..."
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
            {/* SECTION 1: Objectives of Measuring Performance + Customer Satisfaction */}
            <div
              ref={(el) => {
                sectionRefs.current['objectives'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Objectives of Measuring Performance &amp; Customer Satisfaction
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Measuring performance helps businesses understand how well they are doing, identify areas for improvement, and track progress toward goals. Customer satisfaction measurement ensures that the business meets customer expectations, fostering loyalty and growth.
                  </p>
</div>

              <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4">Performance Objectives</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Identify Areas for Improvement', icon: <Target size={16} />, content: 'Pinpoints bottlenecks and inefficiencies by tracking metrics like delivery times and order accuracy. Without data, problems may go unnoticed, leading to increased costs and decreased customer satisfaction.' },
                  { title: '2. Track Progress and Monitor Goals', icon: <TrendingUp size={16} />, content: 'Allows businesses to monitor progress toward specific goals by setting targets and tracking performance over time. For example, reducing delivery times by 10% through regular tracking and adjustments.' },
                  { title: '3. Make Informed Decisions', icon: <Database size={16} />, content: 'Provides valuable insights from trends and patterns to identify opportunities and risks. For instance, declining customer satisfaction in a region can trigger targeted service improvements.' },
                  { title: '4. Increase Accountability', icon: <Shield size={16} />, content: 'Holds individuals and teams accountable by setting clear performance targets. Creates a culture of responsibility and encourages excellence, e.g., warehouse managers accountable for inventory accuracy.' },
                  { title: '5. Optimize Resource Allocation', icon: <DollarSign size={16} />, content: 'Identifies where resources are used effectively and where they are wasted, allowing reallocation to maximize output and minimize waste.' },
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

              <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4">Benefits of Measuring Customer Satisfaction</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Identify Customer Needs and Expectations', icon: <Users size={16} />, content: 'Surveys and feedback provide insights into what customers want, enabling tailored products and services. For example, customers value timely delivery and accurate tracking.' },
                  { title: '2. Improve Customer Loyalty and Retention', icon: <HeartHandshake size={16} />, content: 'Satisfied customers are more likely to remain loyal and make repeat purchases. Consistent on-time delivery and excellent service build strong relationships.' },
                  { title: '3. Enhance Brand Reputation', icon: <Star size={16} />, content: 'Positive experiences lead to positive word-of-mouth and online reviews, strengthening brand reputation and attracting new customers.' },
                  { title: '4. Increase Revenue and Profitability', icon: <TrendingUp size={16} />, content: 'Satisfied customers spend more and recommend the business to others. Studies show highly satisfied customers spend an average of 20% more.' },
                  { title: '5. Gain a Competitive Advantage', icon: <Award size={16} />, content: 'Excellent customer service differentiates a company from competitors. Personalized service and proactive communication attract and retain customers.' },
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

            {/* SECTION 2: Benchmarking and DPP */}
            <div
              ref={(el) => {
                sectionRefs.current['benchmarking'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Benchmarking and Direct Product Profitability (DPP)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Benchmarking compares your performance to industry best practices to identify gaps and improvement opportunities. DPP calculates the true profitability of each product by considering all direct costs, providing a more accurate picture than gross margin alone.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Ruler size={16} /> Benchmarking
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Definition:</strong> Comparing business processes and performance metrics to industry best practices or best-performing companies.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Benefits:</strong> Identifies areas for improvement, sets realistic goals, promotes continuous improvement, and helps stay competitive.</li>
                    <li><strong>Types:</strong> Internal (different departments) or external (against competitors).</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <DollarSign size={16} /> Direct Product Profitability (DPP)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Definition:</strong> Calculates the actual profit generated by a product after considering all direct costs (purchase, handling, transport, shelf space).
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Benefits:</strong> Identifies most and least profitable products, informs pricing and shelf space decisions, optimizes inventory, and improves overall profitability.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Link size={16} /> How They Relate
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Benchmarking can compare your DPP results to industry averages, highlighting areas where product profitability lags and providing insights for improvement. For example, benchmarking handling costs can reveal opportunities for cost reduction using DPP analysis.
                </p>
              </div>
            </div>

            {/* SECTION 3: Quality, Service, and Cost Standards */}
            <div
              ref={(el) => {
                sectionRefs.current['standards'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Quality, Service, and Cost Standards
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Standards define the expected levels of quality, service, and cost performance. They help maintain consistency, control costs, and meet customer expectations.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Award size={16} /> 1. Quality Standards
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Define the level of excellence a product or service must achieve. Includes product specifications, process efficiency, and material quality. Implementation involves setting clear goals, developing procedures, monitoring, and continuous improvement.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Users size={16} /> 2. Service Standards
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Define the level of customer care, including response times, delivery speed, and support quality. Implementation involves understanding customer needs, training employees, monitoring satisfaction, and providing feedback.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <DollarSign size={16} /> 3. Cost Standards
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Define acceptable expense ranges for production, operations, transportation, and inventory. Implementation involves setting realistic targets, tracking expenses, identifying cost reduction opportunities, and implementing savings measures.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 4: Work Measurement and Productivity */}
            <div
              ref={(el) => {
                sectionRefs.current['workmeasure'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Work Measurement and Productivity
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Work measurement determines the time required for tasks, providing data for setting performance standards and planning. Productivity measures output relative to input, reflecting efficiency.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Clock size={16} /> Work Measurement
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Definition:</strong> Determining the time to complete specific tasks using techniques like time studies, activity sampling, and predetermined motion time systems.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Purposes:</strong> Setting performance standards, planning and scheduling work, determining labour costs, improving efficiency, and capacity planning.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Gauge size={16} /> Productivity
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Definition:</strong> Efficiency measure – ratio of output to input. Includes labour productivity (output per worker), capital productivity, and total factor productivity.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Improvement:</strong> Streamlining processes, investing in technology, training employees, and improving resource utilization.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Link size={16} /> The Relationship
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Work measurement provides the data needed to assess and improve productivity. By understanding task durations, businesses can identify inefficiencies and reduce waste, ultimately improving the output-to-input ratio.
                </p>
              </div>
            </div>

            {/* SECTION 5: Costing and Pricing */}
            <div
              ref={(el) => {
                sectionRefs.current['costing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Costing and Pricing of Goods in Stock
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Costing determines the actual cost of inventory, including purchase, ordering, holding, transportation, and handling costs. Pricing sets the selling price, influenced by cost, market demand, competition, and desired profit margin.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Calculator size={16} /> Costing of Goods in Stock
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Components:</strong> Purchase costs, ordering costs, holding costs, transportation costs, handling costs.</li>
                    <li><strong>Valuation Methods:</strong> FIFO (First-In, First-Out), LIFO (Last-In, First-Out), Average cost.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <DollarSign size={16} /> Pricing of Goods in Stock
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Factors:</strong> Cost of goods, market demand, competition, profit margin, customer perception.</li>
                    <li><strong>Strategies:</strong> Cost-plus pricing, competitive pricing, value-based pricing, dynamic pricing.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Link size={16} /> The Relationship
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Accurate costing is essential for effective pricing. Underestimating costs leads to low prices and losses; overestimating may reduce competitiveness. Pricing must balance cost recovery with market conditions to ensure profitability.
                </p>
              </div>
            </div>

            {/* SECTION 6: Optimization and Trade-offs */}
            <div
              ref={(el) => {
                sectionRefs.current['optimization'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Optimization of Costs and Service Performance &amp; Total Costs and Trade-offs
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Optimization involves balancing cost reduction with customer satisfaction to find the most efficient and effective distribution strategy. Trade-offs occur when improving one aspect (e.g., faster delivery) increases another (e.g., transportation cost). Understanding total costs and trade-offs is key to making informed decisions.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Target size={16} /> Optimization of Costs and Service Performance
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Efficiency:</strong> Streamlining processes to reduce waste and improve productivity.</li>
                  <li><strong>Technology:</strong> Using automation to improve visibility and speed.</li>
                  <li><strong>Collaboration:</strong> Working with suppliers and customers to optimize the supply chain.</li>
                  <li><strong>Data Analysis:</strong> Using data to identify areas for improvement.</li>
                  <li><strong>Flexibility:</strong> Adapting to changing market conditions.</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <DollarSign size={16} /> Total Costs in Distribution
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Transportation costs</li>
                    <li>Warehousing costs</li>
                    <li>Inventory holding costs</li>
                    <li>Order processing costs</li>
                    <li>Customer service costs</li>
                    <li>Cost of lost sales due to poor service</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Analysing total costs reveals where savings can be made without sacrificing service.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <ArrowUpDown size={16} /> Trade-offs
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Transportation vs. Inventory:</strong> Faster transport reduces inventory holding costs but increases freight costs.</li>
                    <li><strong>Service Level vs. Costs:</strong> Higher service levels (e.g., next-day delivery) increase costs but improve satisfaction.</li>
                    <li><strong>Warehousing vs. Transportation:</strong> More warehouses reduce transportation distance but increase facility costs.</li>
                    <li><strong>Inventory vs. Lost Sales:</strong> More inventory reduces stockouts but increases holding costs.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Effective management finds the optimal balance between these trade-offs.</p>
                </div>
              </div>
            </div>

            {/* SECTION 7: OR Techniques and Queuing Theory */}
            <div
              ref={(el) => {
                sectionRefs.current['or'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Operational Research (OR) Techniques &amp; Queuing Theory
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    OR applies mathematical models to solve complex problems and optimize decisions. Queuing theory, a branch of OR, studies waiting lines to improve service efficiency and resource utilization in distribution.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Activity size={16} /> Operational Research (OR) Techniques
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Optimization:</strong> Finding best solutions (min cost, max profit).</li>
                    <li><strong>Simulation:</strong> Creating models to test scenarios.</li>
                    <li><strong>Statistical Analysis:</strong> Identifying patterns and trends.</li>
                    <li><strong>Decision Analysis:</strong> Evaluating options.</li>
                    <li><strong>Queuing Theory:</strong> Analysing waiting lines.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Applications in Distribution:</strong> Route optimization, inventory management, warehouse layout design, supply chain planning.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Clock size={16} /> Queuing Theory
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Definition:</strong> Studies waiting lines, analysing arrival rates, service times, and number of servers to optimize performance.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Key Concepts:</strong> Arrival rate, service time, number of servers, queue length, waiting time.</li>
                    <li><strong>Applications:</strong> Dock management (optimal number of loading docks), customer service (staffing levels), warehouse operations (bottleneck reduction), delivery scheduling.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Performance Insight
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
                  <span>Performance Objectives</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Customer Satisfaction Benefits</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Trade-off Pairs</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Effective performance management balances quality, service, and cost. Benchmarking and DPP help identify improvement opportunities and product profitability. Work measurement and productivity analysis drive efficiency. Optimization involves understanding total costs and trade-offs. OR techniques, including queuing theory, provide powerful tools for data-driven decision-making in logistics and distribution.
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
                <strong className="text-white">Performance Measurement</strong> – objectives include identifying improvement areas, tracking progress, informed decision-making, accountability, and resource optimization.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Customer Satisfaction</strong> – benefits: identifies needs, builds loyalty, enhances reputation, increases revenue, and provides competitive advantage.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Benchmarking &amp; DPP</strong> – benchmarking compares performance to best practices; DPP calculates true product profitability by including all direct costs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Standards</strong> – quality, service, and cost standards set expectations and guide performance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Work Measurement &amp; Productivity</strong> – work measurement provides task time data; productivity measures efficiency; both drive improvement.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Costing, Pricing &amp; Optimization</strong> – accurate costing informs pricing; optimization balances costs and service; trade-offs require careful analysis.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">OR &amp; Queuing</strong> – OR techniques solve complex problems; queuing theory optimises waiting lines and resource allocation in distribution.
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
            Sidemann Academic Registry • Performance Management &amp; OR 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome7;