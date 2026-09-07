import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Target,
  Users,
  ClipboardList,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  GitBranch,
  BarChart3,
  PieChart,
  FileText,
  Clock,
  Activity,
  Settings,
  Layers,
  AlertCircle,
  BookOpen,
  Briefcase,
  CreditCard,
  LineChart,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  AlertTriangle,
  Monitor,
  Smartphone,
  Cpu,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'planning', label: 'Planning' },
  { id: 'wbs', label: 'WBS' },
  { id: 'cost', label: 'Cost & Budget' },
  { id: 'scheduling', label: 'Scheduling' },
  { id: 'techniques', label: 'Techniques' },
  { id: 'resources', label: 'Resources' },
  { id: 'tracking', label: 'Tracking' },
  { id: 'software', label: 'Software' },
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
        text: 'The Critical Path Method (CPM) was developed in the 1950s by DuPont and Remington Rand. It revolutionised project management by identifying the longest sequence of dependent tasks.',
      },
      {
        title: 'Pro Tip',
        text: 'Always build a contingency buffer into your project budget. A common rule of thumb is to add 10-20% for unforeseen expenses or scope changes.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the WBS hierarchy: Project → Phase → Deliverable → Work Package → Activity. It helps break down complex projects into manageable chunks.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to account for resource constraints when scheduling. A schedule that ignores resource availability is bound to fail.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The Critical Path Method (CPM) was developed in the 1950s by DuPont and Remington Rand. It revolutionised project management by identifying the longest sequence of dependent tasks.',
      },
      {
        title: 'Pro Tip',
        text: 'Always build a contingency buffer into your project budget. A common rule of thumb is to add 10-20% for unforeseen expenses or scope changes.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the WBS hierarchy: Project → Phase → Deliverable → Work Package → Activity. It helps break down complex projects into manageable chunks.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to account for resource constraints when scheduling. A schedule that ignores resource availability is bound to fail.',
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

  // Helper for table rows
  const rowBg = (index: number) => {
    const even = index % 2 === 0;
    return isDarkMode 
      ? (even ? 'bg-gray-800' : 'bg-gray-750') 
      : (even ? 'bg-white' : 'bg-gray-50');
  };

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Target size={14} className="inline mr-1" /> LEARNING OUTCOME 4
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Project Planning &{' '}
            <span className="text-amber-300 font-bold italic">
              Management
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master project scope, roles, WBS, cost estimation, scheduling, resource allocation, and software evaluation.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Scope &amp; Planning
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Calendar size={14} className="inline mr-1" /> Scheduling
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <DollarSign size={14} className="inline mr-1" /> Cost &amp; Budget
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
                placeholder="Search for a concept, WBS, scheduling..."
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
            {/* Section 1: Project Planning */}
            <div
              ref={(el) => {
                sectionRefs.current['planning'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Project Planning
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Project planning is the foundation of successful project management. It defines what needs to be done, who will do it, when it will be done, and how much it will cost.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Defining Project Scope</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Project scope defines all the work required to complete the project successfully. It specifies what is included and excluded.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Objectives:</strong> SMART goals (Specific, Measurable, Achievable, Relevant, Time‑bound).</li>
                  <li><strong>Deliverables:</strong> Tangible outputs (software, report, product).</li>
                  <li><strong>Requirements:</strong> Functionality, performance, quality.</li>
                  <li><strong>Boundaries:</strong> What is included and excluded.</li>
                  <li><strong>Acceptance Criteria:</strong> How deliverables are judged acceptable.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Defining Roles and Responsibilities</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Use a RACI matrix to clarify who is Responsible, Accountable, Consulted, and Informed for each task.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">The Project Plan Process</h3>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Project Initiation</li>
                  <li>Scope Definition</li>
                  <li>Work Breakdown Structure (WBS)</li>
                  <li>Activity Sequencing</li>
                  <li>Resource Planning</li>
                  <li>Schedule Development</li>
                  <li>Cost Estimation</li>
                  <li>Risk Management</li>
                  <li>Communication Plan</li>
                  <li>Quality Management Plan</li>
                  <li>Stakeholder Management Plan</li>
                  <li>Project Plan Approval</li>
                </ol>
              </div>
            </div>

            {/* Section 2: WBS */}
            <div
              ref={(el) => {
                sectionRefs.current['wbs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Work Breakdown Structure (WBS)
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A WBS is a hierarchical decomposition of the project into smaller, manageable components. It's a crucial tool for planning and control.
                </p>
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-3">Steps to Create a WBS</h4>
                <ol className="list-decimal pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Define the project goal.</li>
                  <li>Decompose into major deliverables or phases.</li>
                  <li>Further decompose each deliverable into work packages.</li>
                  <li>Assign responsibilities to each work package.</li>
                  <li>Estimate effort and cost.</li>
                  <li>Sequence activities.</li>
                  <li>Use the WBS for tracking progress.</li>
                </ol>
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Benefits</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Improved planning and estimation</li>
                    <li>Better communication of scope</li>
                    <li>Enhanced control and tracking</li>
                    <li>Clear responsibilities</li>
                    <li>Reduced risk</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3: Cost Estimation & Budget */}
            <div
              ref={(el) => {
                sectionRefs.current['cost'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Cost Estimation &amp; Budget
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Total Project Cost Estimation</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Use WBS to identify all work packages.</li>
                  <li>Identify resources (labour, materials, equipment).</li>
                  <li>Estimate costs: labour hours × rate, material quantity × unit cost.</li>
                  <li>Add contingency (10‑20% for unforeseen expenses).</li>
                  <li>Aggregate to get total project cost.</li>
                </ul>
                <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Estimation Methods</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Analogous:</strong> Using historical data from similar projects.</li>
                    <li><strong>Parametric:</strong> Using statistical relationships (e.g., cost per square foot).</li>
                    <li><strong>Bottom‑Up:</strong> Estimating each work package individually (most accurate).</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400">Drawing Up a Project Budget</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Use cost baseline from estimation.</li>
                  <li>Time‑phase costs based on schedule.</li>
                  <li>Categorise costs (labour, materials, equipment).</li>
                  <li>Include contingency reserve.</li>
                  <li>Include management reserve for truly unforeseen issues.</li>
                  <li>Obtain budget approval from stakeholders.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Cost‑Benefit Evaluation</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Payback Period:</strong> Time to recover initial investment.</li>
                  <li><strong>Net Present Value (NPV):</strong> Present value of future cash flows minus investment.</li>
                  <li><strong>Return on Investment (ROI):</strong> (Net Profit / Investment) × 100.</li>
                </ul>
              </div>
            </div>

            {/* Section 4: Scheduling */}
            <div
              ref={(el) => {
                sectionRefs.current['scheduling'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Project Scheduling
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Project scheduling defines what activities need to be done, when, and with what resources. It helps ensure projects are completed on time.
                </p>
                <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 mt-3">Key Roles</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Define the project timeline</li>
                  <li>Allocate resources efficiently</li>
                  <li>Identify critical activities</li>
                  <li>Track progress against baseline</li>
                  <li>Facilitate communication</li>
                  <li>Support risk management</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400">Steps in Creating a Schedule</h3>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Define activities (using WBS).</li>
                  <li>Sequence activities (dependencies).</li>
                  <li>Estimate activity durations.</li>
                  <li>Develop the schedule (Gantt, CPM, PERT).</li>
                  <li>Identify the critical path.</li>
                  <li>Allocate resources.</li>
                  <li>Review and adjust.</li>
                  <li>Monitor and control.</li>
                </ol>
              </div>
            </div>

            {/* Section 5: Scheduling Techniques */}
            <div
              ref={(el) => {
                sectionRefs.current['techniques'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Evaluating Scheduling Techniques
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Technique</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Strengths</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Weaknesses</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[
                      { tech: "WBS", desc: "Hierarchical decomposition into work packages.", strengths: "Breaks down complex projects, clarifies scope.", weaknesses: "Doesn't show dependencies/timelines." },
                      { tech: "CPM", desc: "Determines critical path and bottlenecks.", strengths: "Identifies critical activities, optimises duration.", weaknesses: "Can be complex, requires accurate estimates." },
                      { tech: "Gantt Chart", desc: "Visual representation of schedule.", strengths: "Easy to understand, provides overview.", weaknesses: "Can be cluttered for complex projects." },
                      { tech: "PERT", desc: "Uses probabilistic estimates (optimistic, most likely, pessimistic).", strengths: "Accounts for uncertainty.", weaknesses: "More complex than CPM." },
                      { tech: "Fast Tracking/Crashing", desc: "Techniques to shorten project duration.", strengths: "Can reduce duration.", weaknesses: "Increases risk/cost, can impact quality." },
                    ].map((item, idx) => (
                      <tr key={idx} className={rowBg(idx)}>
                        <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">{item.tech}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.desc}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.strengths}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.weaknesses}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 6: Resource Allocation */}
            <div
              ref={(el) => {
                sectionRefs.current['resources'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Allocating Project Resources
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Resource Allocation Process</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Resource Identification:</strong> Identify all resources needed.</li>
                  <li><strong>Resource Availability:</strong> Check availability of personnel, materials, equipment.</li>
                  <li><strong>Resource Assignment:</strong> Assign specific resources to activities.</li>
                  <li><strong>Resource Leveling:</strong> Balance demand and availability.</li>
                  <li><strong>Resource Smoothing:</strong> Optimise usage without affecting critical path.</li>
                  <li><strong>Documentation:</strong> Document allocation plan.</li>
                  <li><strong>Communication:</strong> Communicate plan to team and stakeholders.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Strategies for Managing Resources</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Clear roles and responsibilities (RACI).</li>
                  <li>Detailed resource planning early.</li>
                  <li>Proactive resource management.</li>
                  <li>Open communication.</li>
                  <li>Flexibility and adaptability.</li>
                  <li>Conflict resolution process.</li>
                  <li>Resource optimisation.</li>
                  <li>Training and development.</li>
                  <li>Resource tracking.</li>
                  <li>Use of project management tools.</li>
                  <li>Negotiation skills.</li>
                  <li>Continuous improvement.</li>
                </ul>
              </div>
            </div>

            {/* Section 7: Tracking Effort and Cost */}
            <div
              ref={(el) => {
                sectionRefs.current['tracking'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Tracking Project Effort and Cost
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Tracking Process</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Establish a baseline before project starts.</li>
                  <li>Track actual effort (timesheets, activity reports).</li>
                  <li>Track actual costs (labour, materials, equipment).</li>
                  <li>Compare actual vs. planned and calculate variances.</li>
                  <li>Analyse variances and determine root causes.</li>
                  <li>Use Earned Value Management (EVM) metrics.</li>
                  <li>Report regularly on performance.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400">Strategies to Ensure Adherence to Plan</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Regular progress meetings.</li>
                  <li>Open communication.</li>
                  <li>Formal change management process.</li>
                  <li>Proactive risk management.</li>
                  <li>Issue management process.</li>
                  <li>Performance reporting.</li>
                  <li>Corrective actions.</li>
                  <li>Project audits.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Maintaining Project Scope</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Clearly defined scope from the start.</li>
                  <li>Formal change control process.</li>
                  <li>Scope management plan.</li>
                  <li>Stakeholder management.</li>
                  <li>Regular scope reviews.</li>
                  <li>Document scope changes.</li>
                  <li>Resist scope creep.</li>
                  <li>Clear communication.</li>
                </ul>
              </div>
            </div>

            {/* Section 8: Project Management Software */}
            <div
              ref={(el) => {
                sectionRefs.current['software'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Project Management Software
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">Benefits</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Centralized information repository.</li>
                  <li>Improved collaboration.</li>
                  <li>Enhanced planning and scheduling.</li>
                  <li>Efficient task management.</li>
                  <li>Resource management.</li>
                  <li>Cost management.</li>
                  <li>Risk management.</li>
                  <li>Streamlined communication and reporting.</li>
                  <li>Document management.</li>
                  <li>Real‑time project tracking.</li>
                  <li>Increased productivity.</li>
                  <li>Better decision‑making.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400">Evaluating Software Options</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Project size and complexity.</li>
                  <li>Team size and structure.</li>
                  <li>Industry‑specific needs.</li>
                  <li>Features and functionality.</li>
                  <li>Integration with other tools.</li>
                  <li>Ease of use.</li>
                  <li>Customisation.</li>
                  <li>Pricing.</li>
                  <li>Support and training.</li>
                  <li>Mobile accessibility.</li>
                  <li>Security.</li>
                  <li>Scalability.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Types of Software</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Basic Task Management:</strong> Trello, Asana (small teams, simple projects).</li>
                  <li><strong>Full‑Featured:</strong> Microsoft Project, Jira, Monday.com, Wrike (comprehensive features).</li>
                  <li><strong>Agile:</strong> Jira, VersionOne (sprint planning, Kanban, burndown charts).</li>
                  <li><strong>Collaboration Tools:</strong> Slack, Microsoft Teams (communication and file sharing).</li>
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
                  💡 Project Insight
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
                  <span>Key Techniques</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Cost Methods</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">3</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Project management is about balancing scope, time, and cost (the "triple constraint"). A well‑defined scope, realistic schedule, and accurate budget are essential. Use WBS to break down work, CPM/Gantt for scheduling, and EVM for tracking progress. Choose project management software that fits your team's needs.
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
                <strong className="text-white">Project Planning</strong> – define scope, roles, and create a detailed project plan with WBS, schedule, and budget.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">WBS</strong> – hierarchically decomposes the project into work packages, enabling better planning, estimation, and tracking.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Cost &amp; Budget</strong> – estimate using analogous, parametric, or bottom‑up methods; include contingency and management reserves.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Scheduling</strong> – use CPM, Gantt charts, or PERT to define timelines and identify the critical path.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Resource Allocation &amp; Tracking</strong> – allocate resources effectively, track effort and cost using EVM, and manage scope changes through a formal process.
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
            Sidemann Academic Registry • Project Planning &amp; Management 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;