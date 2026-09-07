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
  { id: 'ppi', label: 'PPIs' },
  { id: 'reasons', label: '7 Reasons' },
  { id: 'strategies', label: 'Evaluation Strategies' },
  { id: 'problems', label: 'Associated Problems' },
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
        text: 'Purchasing Performance Indicators (PPIs) help organizations measure the effectiveness of their procurement function. The most common PPI is cost savings, but leading organizations track a balanced set of metrics.',
      },
      {
        title: 'Pro Tip',
        text: 'When evaluating purchasing performance, use a balanced scorecard approach that includes financial, operational, supplier, and strategic metrics for a complete picture.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 7 reasons for evaluating purchasing performance: Improvement, Cost, Supplier, Quality, Compliance, Strategy, and Continuous (ICSQSC).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t overemphasize cost reduction at the expense of quality, supplier relationships, or innovation. A balanced approach to performance evaluation leads to better long-term outcomes.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Purchasing Performance Indicators (PPIs) help organizations measure the effectiveness of their procurement function. The most common PPI is cost savings, but leading organizations track a balanced set of metrics.',
      },
      {
        title: 'Pro Tip',
        text: 'When evaluating purchasing performance, use a balanced scorecard approach that includes financial, operational, supplier, and strategic metrics for a complete picture.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 7 reasons for evaluating purchasing performance: Improvement, Cost, Supplier, Quality, Compliance, Strategy, and Continuous (ICSQSC).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t overemphasize cost reduction at the expense of quality, supplier relationships, or innovation. A balanced approach to performance evaluation leads to better long-term outcomes.',
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
      <header className="bg-[#312e81] dark:bg-[#1e1b4b] border-b border-indigo-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> PROCUREMENT &amp; PERFORMANCE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Purchasing Performance{' '}
            <span className="text-indigo-300 font-bold italic">
              Indicators &amp; Evaluation
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to Purchasing Performance Indicators (PPIs), reasons for evaluating purchasing performance, evaluation strategies, and associated problems.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <DollarSign size={14} className="inline mr-1" /> PPIs
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <TrendingUp size={14} className="inline mr-1" /> Evaluation
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Performance
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
                placeholder="Search for a concept, indicator, strategy..."
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
            {/* SECTION 1: Purchasing Performance Indicators (PPIs) */}
            <div
              ref={(el) => {
                sectionRefs.current['ppi'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Purchasing Performance Indicators (PPIs)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These are like report cards for the "buying department." They show how well the department is doing its job by measuring things like cost savings, quality, and how quickly orders are processed.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <DollarSign size={16} /> 1. Cost Savings
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong>What it is:</strong> How much money the "buying department" is saving the company.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  <strong>Detailed Explanation:</strong> Cost savings is a crucial PPI that measures the efficiency of the purchasing department in reducing the overall cost of goods and services. This indicator reflects the department's ability to negotiate favourable prices with suppliers, identify cost-effective alternatives, and optimize spending. It is not just about getting the lowest price; it is about getting the best value for the money spent. To calculate cost savings, companies often compare the actual purchase prices to benchmark prices or previous purchase prices. They might also track the savings achieved through process improvements, such as consolidating orders or streamlining procurement workflows.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  <span className="italic">For example, if a purchasing department negotiates a 10% discount on a key raw material, that translates directly into cost savings for the company. They may also find a new supplier that offers the same quality of materials, but at a cheaper price. The tracking of cost savings helps the company to see if the purchasing department is fulfilling one of its main roles, which is to save the company money.</span>
                </p>
              </div>
            </div>

            {/* SECTION 2: 7 Reasons for Evaluating Purchasing Performance */}
            <div
              ref={(el) => {
                sectionRefs.current['reasons'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                7 Reasons for Evaluating Purchasing Performance
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    It is like giving the "buying department" a check-up to see how well they are doing. It helps the company understand if they are saving money, getting good quality, and working efficiently.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Identifying Areas for Improvement', icon: <Target size={16} />, content: 'Finding out what the "buying department" could do better. Helps identify bottlenecks, inefficiencies, and areas where training or process changes are needed. Without evaluation, problems may be overlooked, resulting in ongoing inefficiencies.' },
                  { title: '2. Ensuring Cost Efficiency', icon: <DollarSign size={16} />, content: 'Making sure the company is getting the best value for its money. Tracking cost savings, price variances, and total cost of ownership helps optimize spending and ensure resources are used wisely.' },
                  { title: '3. Monitoring Supplier Performance', icon: <Award size={16} />, content: 'Keeping track of how well suppliers are doing their job. Assessing delivery reliability, product quality, and responsiveness helps maintain a reliable and efficient supply chain.' },
                  { title: '4. Improving Quality Control', icon: <ClipboardCheck size={16} />, content: 'Making sure the company is getting high-quality goods and services. Tracking defect rates, customer complaints, and product returns helps minimize waste and enhance customer satisfaction.' },
                  { title: '5. Enhancing Compliance', icon: <Shield size={16} />, content: 'Making sure the "buying department" is following all the rules and regulations. Ensuring compliance with laws, regulations, and ethical standards minimizes legal and reputational risks.' },
                  { title: '6. Facilitating Strategic Alignment', icon: <LayersIcon size={16} />, content: 'Making sure the "buying department\'s" goals match the company\'s overall goals. Aligning purchasing strategies with organizational objectives ensures contribution to long-term success.' },
                  { title: '7. Promoting Continuous Improvement', icon: <RefreshCw size={16} />, content: 'Always looking for ways to make the "buying department" better. Encourages a culture of ongoing improvement by tracking trends, benchmarking, and implementing best practices.' },
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

            {/* SECTION 3: Evaluation Strategies */}
            <div
              ref={(el) => {
                sectionRefs.current['strategies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Evaluation Strategies
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These are different ways to check how well something is working. Think of it like different ways a teacher grades students—some might use tests, other projects, and others class participation.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Quantitative Evaluation', icon: <BarChart3 size={16} />, content: 'Using numbers and statistics to measure how well something is working. Focuses on numerical data and statistical analysis for tangible outcomes. Includes tracking cost savings, on-time deliveries, and defect rates. Provides objective and measurable insights for identifying improvement areas.' },
                  { title: '2. Qualitative Evaluation', icon: <Users size={16} />, content: 'Using opinions and observations to judge how well something is working. Gathers subjective data through interviews and surveys. Valuable for assessing intangible aspects like customer satisfaction, supplier relationships, and employee morale.' },
                  { title: '3. Comparative Evaluation', icon: <PieChart size={16} />, content: 'Comparing performance against benchmarks or competitors. Helps identify areas where the organization is excelling or lagging. Includes benchmarking against industry best practices, internal targets, or competitor performance.' },
                  { title: '4. Performance Audits', icon: <ClipboardCheck size={16} />, content: 'A detailed review of processes and records to check for compliance and efficiency. Systematic and independent review assessing compliance, efficiency, and effectiveness. Valuable for identifying risks, weaknesses, and improvement areas.' },
                  { title: '5. 360-Degree Feedback', icon: <Users size={16} />, content: 'Gathering feedback from multiple sources to get a well-rounded view of performance. Includes feedback from supervisors, peers, subordinates, and customers. Provides comprehensive insights for performance appraisals and development planning.' },
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

            {/* SECTION 4: Problems Associated with Performance Evaluation */}
            <div
              ref={(el) => {
                sectionRefs.current['problems'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Problems Associated with Performance Evaluation of the Purchasing Function
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These are the challenges that come up when trying to measure how well the "buying department" is doing. It is like trying to grade a complex project where it is hard to know what is truly important.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Difficulty in Measuring Intangible Factors', icon: <AlertCircle size={16} />, content: 'Some important things, like good relationships with suppliers, are hard to put a number on. Factors like supplier relationships, innovation, and ethical conduct are crucial but lack easily measurable metrics, leading to overemphasis on cost savings.' },
                  { title: '2. Overemphasis on Cost Reduction', icon: <DollarSign size={16} />, content: 'Focusing too much on saving money and not enough on other important things like quality. Can create a culture where purchasing professionals prioritize cost savings above all else, potentially sacrificing quality, supplier relationships, or innovation.' },
                  { title: '3. Lack of Alignment with Strategic Goals', icon: <Target size={16} />, content: 'The "buying department\'s" goals might not match the company\'s overall goals. If performance evaluation systems are not aligned with strategic objectives, purchasing decisions may not contribute to the company\'s overall vision.' },
                  { title: '4. Data Collection and Accuracy Challenges', icon: <Database size={16} />, content: 'It is hard to get good information to measure performance accurately. Outdated systems, manual processes, or lack of data governance can lead to flawed performance evaluations and inconsistent data definitions.' },
                  { title: '5. Subjectivity and Bias', icon: <Users size={16} />, content: 'Personal opinions can affect how performance is judged. Evaluations can be subjective and prone to bias, especially when relying on qualitative data. Clear and objective evaluation criteria are needed to minimize this.' },
                  { title: '6. Time and Resource Constraints', icon: <FileText size={16} />, content: 'It takes a lot of time and effort to do a good job of evaluating performance. Conducting thorough evaluations requires significant time and resources, which may be limited in many organizations.' },
                  { title: '7. Resistance to Change', icon: <RefreshCw size={16} />, content: 'People do not always like it when things change, even if it is for the better. Implementing new evaluation systems can face resistance from employees accustomed to existing practices. Overcoming this requires clear communication and training.' },
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
                  <span>Reasons for Evaluation</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Evaluation Strategies</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Performance Problems</span>
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
                Purchasing Performance Indicators (PPIs) measure the effectiveness of the procurement function. Evaluating purchasing performance helps identify improvement areas, ensure cost efficiency, monitor suppliers, improve quality, enhance compliance, align with strategy, and promote continuous improvement. Evaluation strategies include quantitative, qualitative, comparative, audits, and 360-degree feedback. Common problems include difficulty measuring intangibles, overemphasis on cost, lack of strategic alignment, data challenges, subjectivity, resource constraints, and resistance to change.
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
                <strong className="text-white">Purchasing Performance Indicators (PPIs)</strong> – metrics like cost savings, quality, and efficiency that measure the effectiveness of the procurement function.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">7 Reasons for Evaluation</strong> – identify improvement areas, ensure cost efficiency, monitor suppliers, improve quality, enhance compliance, facilitate strategic alignment, and promote continuous improvement.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Evaluation Strategies</strong> – quantitative, qualitative, comparative, performance audits, and 360-degree feedback provide comprehensive performance insights.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Common Problems</strong> – difficulty measuring intangibles, overemphasis on cost, lack of strategic alignment, data accuracy challenges, subjectivity, resource constraints, and resistance to change.
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
            Sidemann Academic Registry • Procurement Performance Management 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome7;