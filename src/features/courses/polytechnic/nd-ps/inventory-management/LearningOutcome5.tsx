import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Award,
  GitBranch,
  Network,
  BarChart3,
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
  Layers,
  Link2,
  Zap,
  Globe,
  FileCode,
  UserCheck,
  GraduationCap,
  Briefcase,
  Rocket,
  Menu,
  MousePointer,
  Touchpad,
  Grid3X3,
  Palette,
  Settings,
  FileText,
  MessageSquare,
  Mail,
  Calendar,
  MapPin,
  Globe as GlobeIcon,
  Factory,
  Target,
  TrendingUp,
  Users,
  Shield,
  Clock,
  DollarSign,
  PieChart,
  LineChart,
  Activity,
  CheckCircle,
  AlertTriangle,
  Database,
  Package,
  Truck,
  Warehouse,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'or-techniques', label: 'OR Techniques' },
  { id: 'benchmarking', label: 'Benchmarking & KPIs' },
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
        text: 'Network analysis techniques like CPM and PERT were developed in the 1950s and revolutionised project management by identifying the critical path in complex projects.',
      },
      {
        title: 'Pro Tip',
        text: 'When benchmarking, choose partners who are best-in-class in the specific function you are evaluating, even if they are in a different industry.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 4 types of benchmarking: Internal, Competitive, Functional, and Generic.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t benchmark against the wrong competitors. Choose partners whose performance you genuinely want to emulate, not just anyone in your industry.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Network analysis techniques like CPM and PERT were developed in the 1950s and revolutionised project management by identifying the critical path in complex projects.',
      },
      {
        title: 'Pro Tip',
        text: 'When benchmarking, choose partners who are best-in-class in the specific function you are evaluating, even if they are in a different industry.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 4 types of benchmarking: Internal, Competitive, Functional, and Generic.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t benchmark against the wrong competitors. Choose partners whose performance you genuinely want to emulate, not just anyone in your industry.',
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
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Operational Research &amp;{' '}
            <span className="text-rose-300 font-bold italic">
              Performance Measurement
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Comprehensive guide to network analysis, decision trees, benchmarking, and key performance indicators for stores management.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Network size={14} className="inline mr-1" /> Network Analysis
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <GitBranch size={14} className="inline mr-1" /> Decision Trees
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <BarChart3 size={14} className="inline mr-1" /> Benchmarking &amp; KPIs
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
                placeholder="Search for a concept, benchmarking, KPI..."
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
            {/* SECTION 1: Operational Research Techniques */}
            <div
              ref={(el) => {
                sectionRefs.current['or-techniques'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Operational Research Techniques: Network Analysis and Decision Trees
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Performance evaluation in stores management, often achieved through benchmarking, relies on robust performance measures. To further enhance decision making and optimize operations, operational research techniques like network analysis and decision trees are invaluable tools. These techniques provide a structured approach to analysing complex problems, identifying optimal solutions, and improving overall efficiency.
                  </p>
</div>

              {/* Network Analysis */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Network size={16} /> Network Analysis
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Definition and Purpose:</strong> Network analysis is a technique used to model and analyse complex systems that involve interconnected activities or events. It visually represents the relationships between these activities, allowing for the identification of critical paths, bottlenecks, and dependencies. In stores management, network analysis can be used to optimize material flow, schedule deliveries, and manage projects related to warehouse layout or process improvements. The goal is to improve the efficiency and effectiveness of the overall system by identifying areas for optimization and streamlining processes. This technique is particularly useful in projects with many interconnected tasks and helps to identify the shortest possible completion time.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Key Components:</strong>
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Nodes:</strong> Represent activities or events within the system.</li>
                  <li><strong>Arcs/Edges:</strong> Represent the relationships or dependencies between activities.</li>
                  <li><strong>Critical Path:</strong> The longest sequence of activities that determines the shortest possible completion time for the project.</li>
                  <li><strong>PERT/CPM:</strong> Project Evaluation and Review Technique (PERT) and Critical Path Method (CPM) are common network analysis techniques used for project scheduling and management. PERT uses probabilistic time estimates, while CPM uses deterministic time estimates. These methods help to identify the critical path, calculate project completion time, and manage resources effectively. Within a warehouse environment, these tools can be used to calculate the most efficient path for order fulfilment.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Applications in Stores Management:</strong>
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Material Flow Optimization:</strong> Network analysis can be used to map the flow of materials within a warehouse, identifying bottlenecks and optimizing routes.</li>
                  <li><strong>Project Scheduling:</strong> It can be used to schedule projects related to warehouse layout changes, equipment installations, or process improvements.</li>
                  <li><strong>Delivery Route Optimization:</strong> It can be used to optimize delivery routes, minimizing transportation costs, and improving delivery times.</li>
                  <li><strong>Resource Allocation:</strong> Network analysis can help in allocating resources effectively by identifying critical activities and dependencies.</li>
                  <li><strong>Supply Chain Analysis:</strong> Network analysis can be used to model and analyse the entire supply chain, identifying areas for improvement and optimizing overall efficiency.</li>
                </ul>
              </div>

              {/* Decision Trees */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <GitBranch size={16} /> Decision Trees
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Definition and Purpose:</strong> Decision trees are a visual representation of decision-making processes, showing possible outcomes and their associated probabilities. They provide a structured approach to evaluating different options and selecting the most favourable course of action. In stores management, decision trees can be used to make decisions related to inventory control, equipment selection, and process improvements. The aim is to make informed decisions by considering all possible outcomes and their associated risks. This technique is particularly useful in situations with uncertainty, where multiple factors need to be considered.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Key Components:</strong>
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Decision Nodes:</strong> Represent points where a decision needs to be made.</li>
                  <li><strong>Chance Nodes:</strong> Represent points where there is uncertainty and multiple possible outcomes.</li>
                  <li><strong>Branches:</strong> Represent possible options or outcomes.</li>
                  <li><strong>Leaf Nodes:</strong> Represent the final outcomes or results.</li>
                  <li><strong>Probabilities:</strong> Represent the likelihood of each outcome occurring.</li>
                  <li><strong>Payoffs:</strong> Represent the value or cost associated with each outcome. Decision trees allow for the easy visualization of complex problems and allow for the calculation of the expected value of each decision.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Applications in Stores Management:</strong>
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Inventory Control Decisions:</strong> Decision trees can be used to determine optimal inventory levels, considering factors such as demand variability, lead times, and holding costs.</li>
                  <li><strong>Equipment Selection:</strong> They can be used to evaluate different equipment options, considering factors such as cost, performance, and reliability.</li>
                  <li><strong>Process Improvement Decisions:</strong> Decision trees can be used to evaluate different process improvement options, considering factors such as cost, efficiency, and risk.</li>
                  <li><strong>Supplier Selection:</strong> Decision trees can assist in the supplier selection process, considering factors like cost, delivery times, and quality.</li>
                  <li><strong>Risk Management:</strong> Decision trees can be used to assess and manage risks associated with different decisions, such as the risk of stockouts or obsolescence.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 2: Benchmarking and Measures of Performance */}
            <div
              ref={(el) => {
                sectionRefs.current['benchmarking'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Benchmarking and Measures of Performance
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Benchmarking and measures of performance are essential tools for evaluating and improving the efficiency and effectiveness of stores management operations. Benchmarking involves comparing an organization's performance against industry best practices or competitors to identify areas for improvement. Measures of performance, also known as key performance indicators (KPIs), are metrics used to track and assess the performance of specific processes or activities within the stores function. Together, these tools provide a structured approach to identifying gaps, setting targets, and driving continuous improvement.
                  </p>
</div>

              {/* Benchmarking */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Award size={16} /> Benchmarking
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Definition and Purpose:</strong> Benchmarking is the process of comparing an organization's performance, processes, or practices against those of industry leaders or competitors. It involves identifying best practices, understanding the factors that contribute to superior performance, and adapting those practices to improve the organization's own performance. The goal of benchmarking is to identify areas for improvement, set realistic targets, and drive continuous improvement. It allows organizations to gain valuable insights into their strengths and weaknesses, and to understand how they compare to others in the industry. Benchmarking is not about simply copying others; it is about learning from best practices and adapting them to fit the organization's specific context.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Types of Benchmarking:</strong>
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Internal Benchmarking:</strong> Comparing performance within different departments or units of the same organization.</li>
                  <li><strong>Competitive Benchmarking:</strong> Comparing performance against direct competitors in the same industry.</li>
                  <li><strong>Functional Benchmarking:</strong> Comparing performance against organizations in different industries that excel in specific functions or processes.</li>
                  <li><strong>Generic Benchmarking:</strong> Comparing performance against best-in-class organizations regardless of industry.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Process of Benchmarking:</strong>
                </p>
                <ul className="list-decimal pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Planning:</strong> Define the scope of the benchmarking study, identify the areas to be benchmarked, and select the benchmarking partners.</li>
                  <li><strong>Data Collection:</strong> Gather data on the organization's own performance and the performance of the benchmarking partners.</li>
                  <li><strong>Analysis:</strong> Analyse the data to identify performance gaps and understand the factors that contribute to superior performance.</li>
                  <li><strong>Implementation:</strong> Develop and implement action plans to close the performance gaps and improve the organization's performance.</li>
                  <li><strong>Monitoring:</strong> Continuously monitor and evaluate the effectiveness of the implemented changes.</li>
                </ul>
              </div>

              {/* Measures of Performance (KPIs) */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <BarChart3 size={16} /> Measures of Performance (KPIs)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Definition and Purpose:</strong> Measures of performance, or KPIs, are metrics used to track and assess the performance of specific processes or activities within the stores function. They provide quantifiable data that can be used to monitor progress, identify trends, and make informed decisions. The purpose of KPIs is to provide a clear and objective assessment of performance, allowing organizations to identify areas for improvement and track the impact of improvement initiatives. Effective KPIs should be relevant, measurable, achievable, and time-bound (SMART).
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Key Performance Indicators (KPIs) in Stores Management:</strong>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {[
                    'Inventory Turnover',
                    'Stockout Rate',
                    'Order Fulfilment Rate',
                    'Warehouse Space Utilization',
                    'Picking Accuracy',
                    'Put-Away Time',
                    'Cycle Count Accuracy',
                    'Inventory Holding Costs',
                    'Order Cycle Time',
                    'Supplier Lead Time',
                  ].map((kpi) => (
                    <div key={kpi} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {kpi}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Using KPIs for Performance Improvement:</strong>
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Setting Targets:</strong> Establish realistic targets for each KPI based on benchmarking data or industry best practices.</li>
                  <li><strong>Monitoring Performance:</strong> Regularly track and monitor KPIs to identify trends and deviations from targets.</li>
                  <li><strong>Analysing Data:</strong> Analyse KPI data to identify the root causes of performance issues.</li>
                  <li><strong>Acting:</strong> Develop and implement action plans to address performance issues and improve KPIs.</li>
                  <li><strong>Continuous Improvement:</strong> Continuously monitor and evaluate the effectiveness of improvement initiatives and adjust as needed.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Operational Research Insight
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
                  <span>OR Techniques</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">2</span>
                </li>
                <li className="flex justify-between">
                  <span>Benchmarking Types</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>KPIs</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">10</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Operational research techniques—network analysis and decision trees—provide structured approaches to complex problems. Network analysis optimises material flow, project scheduling, and resource allocation. Decision trees help make informed choices under uncertainty. Benchmarking compares performance against industry leaders, while KPIs track and measure specific performance metrics. Together, these tools drive continuous improvement in stores management.
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
                <strong className="text-white">Network Analysis</strong> – models interconnected activities, identifies critical paths and bottlenecks. Uses PERT/CPM for project scheduling, material flow optimisation, and resource allocation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Decision Trees</strong> – visual decision-making tool with decision nodes, chance nodes, branches, probabilities, and payoffs. Used for inventory control, equipment selection, supplier selection, and risk management.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Benchmarking</strong> – compares performance against industry leaders. Types: Internal, Competitive, Functional, Generic. Process: Plan → Collect → Analyse → Implement → Monitor.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">KPIs</strong> – track performance with metrics like Inventory Turnover, Stockout Rate, Order Fulfilment Rate, Picking Accuracy, Cycle Count Accuracy, and Order Cycle Time.
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
            Sidemann Academic Registry • ND Purchasing &amp; Supply – Operational Research &amp; KPIs 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;
