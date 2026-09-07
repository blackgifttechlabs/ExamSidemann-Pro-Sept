import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Code,
  Shield,
  Users,
  Target,
  ClipboardList,
  Calendar,
  DollarSign,
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
  FileText,
  CheckCircle,
  TrendingUp,
  GitBranch,
  Terminal,
  Database,
  Table,
  Box,
  Layout,
  Eye,
  Link2,
  Zap,
  Globe,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Settings,
  Play,
  Pause,
  CheckSquare,
  Square,
  Wrench,
  HardDrive,
  Cloud,
  GitPullRequest,
  Clock,
  Server,
  Upload,
  Download,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'reasons', label: '8 Reasons' },
  { id: 'maintenance-plan', label: 'Maintenance Plan' },
  { id: 'strategies', label: 'Strategies' },
  { id: 'process', label: 'Process' },
  { id: 'types', label: '4 Types' },
  { id: 'deployment', label: 'Deployment' },
  { id: 'deployment-strategies', label: 'Deployment Strategies' },
  { id: 'change-management', label: 'Change Management' },
  { id: 'legacy', label: 'Legacy Systems' },
  { id: 'tracking-tools', label: 'Tracking Tools' },
  { id: 'scm-tools', label: 'SCM Tools' },
  { id: 'practice', label: 'Practice Qs' },
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
        text: 'Software maintenance typically accounts for 60-80% of the total cost of a software system over its lifetime. Development is just the beginning!',
      },
      {
        title: 'Pro Tip',
        text: 'Always have a rollback plan before deploying any change. The most successful deployments are the ones where you\'re prepared for failure.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 4 types of maintenance as "CPPA": Corrective, Preventive, Perfective, Adaptive. Each addresses a different type of need.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse deployment strategies. Full deployment is all at once; Rolling is gradual; Blue-Green uses two environments; Canary tests on a small subset first.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Software maintenance typically accounts for 60-80% of the total cost of a software system over its lifetime. Development is just the beginning!',
      },
      {
        title: 'Pro Tip',
        text: 'Always have a rollback plan before deploying any change. The most successful deployments are the ones where you\'re prepared for failure.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 4 types of maintenance as "CPPA": Corrective, Preventive, Perfective, Adaptive. Each addresses a different type of need.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse deployment strategies. Full deployment is all at once; Rolling is gradual; Blue-Green uses two environments; Canary tests on a small subset first.',
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
  const theadBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Code size={14} className="inline mr-1" /> SOFTWARE ENGINEERING
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 5{' '}
            <span className="text-rose-300 font-bold italic">
              Maintenance, Deployment &amp; Change
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master software maintenance, deployment strategies, change management, legacy systems, and configuration management tools.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Wrench size={14} className="inline mr-1" /> Maintenance
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Upload size={14} className="inline mr-1" /> Deployment
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Settings size={14} className="inline mr-1" /> Change Management
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
                placeholder="Search for a concept, deployment, maintenance..."
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
            {/* Section 1: Software Maintenance Intro */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Software Maintenance – Overview
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Software maintenance is the ongoing process of modifying, updating, and improving a software application AFTER it has been deployed. Deployment is just the BEGINNING of a software system's life.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Analogy:</span> Buying a car is just the beginning — you then spend years maintaining it: oil changes, tyre rotations, brake replacements. Without maintenance, even the best car eventually becomes unreliable. Software is exactly the same.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <span className="font-bold">Key Insight:</span> Software maintenance typically accounts for <span className="font-bold text-orange-600 dark:text-orange-400">60-80%</span> of the total cost of a software system over its lifetime.
                </p>
              </div>
            </div>

            {/* Section 2: 8 Reasons */}
            <div
              ref={(el) => {
                sectionRefs.current['reasons'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                8 Reasons Why Maintenance Is Important
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: <AlertCircle size={16} />, title: 'Bug Fixes', desc: 'Correction of errors discovered by users after deployment.' },
                    { icon: <TrendingUp size={16} />, title: 'Performance Optimisation', desc: 'Addressing bottlenecks as data and users grow.' },
                    { icon: <Shield size={16} />, title: 'Security Enhancements', desc: 'Patching vulnerabilities and adapting to new threats.' },
                    { icon: <Users size={16} />, title: 'Adapting to New Requirements', desc: 'Supporting evolving business needs.' },
                    { icon: <Monitor size={16} />, title: 'Compatibility with New Technologies', desc: 'Ensuring software works with updated platforms.' },
                    { icon: <ThumbsUp size={16} />, title: 'Improved User Experience', desc: 'Acting on user feedback to make software more intuitive.' },
                    { icon: <ClipboardList size={16} />, title: 'Compliance with Regulations', desc: 'Meeting changing legal and regulatory requirements.' },
                    { icon: <DollarSign size={16} />, title: 'Reduced Development Costs', desc: 'Proactive maintenance prevents expensive emergency fixes.' },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="p-3 bg-gray-100 dark:bg-gray-700 rounded flex items-start gap-2 text-sm">
                      <span className="text-orange-500 shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{title}</span>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Creating a Maintenance Plan */}
            <div
              ref={(el) => {
                sectionRefs.current['maintenance-plan'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Creating a Software Maintenance Plan
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">A maintenance plan outlines how a software system will be maintained over its lifetime.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {[
                    '1. Assessment – analyse current code quality and documentation',
                    '2. Scope Definition – define what maintenance activities are covered',
                    '3. Resource Allocation – determine personnel, budget, and tools needed',
                    '4. Version Control Strategy – establish how changes will be tracked',
                    '5. Maintenance Process Definition – define step‑by‑step handling of requests',
                    '6. Documentation Updates – ensure every change updates relevant docs',
                    '7. Testing Strategies – define testing approach for maintenance changes',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Maintenance Strategies */}
            <div
              ref={(el) => {
                sectionRefs.current['strategies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Software Maintenance Strategies
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { color: 'red', title: 'Corrective Maintenance', desc: 'Finding and fixing bugs reported by users.' },
                  { color: 'blue', title: 'Adaptive Maintenance', desc: 'Modifying software to work in a changed environment.' },
                  { color: 'green', title: 'Perfective Maintenance', desc: 'Enhancing functionality and usability based on feedback.' },
                  { color: 'purple', title: 'Preventive Maintenance', desc: 'Proactive activities to prevent future failures.' },
                  { color: 'amber', title: 'Reengineering', desc: 'Redesigning internals to improve maintainability.' },
                  { color: 'indigo', title: 'Reverse Engineering', desc: 'Analysing existing code to understand how it works.' },
                  { color: 'teal', title: 'Documentation Updates', desc: 'Keeping documentation current with every change.' },
                  { color: 'pink', title: 'Version Control', desc: 'Tracking every change made to the software over time.' },
                ].map(({ color, title, desc }) => (
                  <div key={title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className={`text-sm font-bold ${isDarkMode ? `text-${color}-400` : `text-${color}-700`}`}>{title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Maintenance Process (7 Steps) */}
            <div
              ref={(el) => {
                sectionRefs.current['process'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Software Maintenance Process – 7 Steps
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-decimal pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Identifying Issues</span> – user reports, error logs, system monitoring.</li>
                  <li><span className="font-bold">Prioritisation</span> – rank by severity, user impact, and business criticality.</li>
                  <li><span className="font-bold">Impact Analysis</span> – assess what other components might be affected.</li>
                  <li><span className="font-bold">Change Implementation</span> – make code/configuration changes in a controlled environment.</li>
                  <li><span className="font-bold">Testing</span> – unit, integration, regression testing before deployment.</li>
                  <li><span className="font-bold">Deployment</span> – deploy to production using a controlled process.</li>
                  <li><span className="font-bold">Documentation Update</span> – update all relevant documentation.</li>
                </ul>
              </div>
            </div>

            {/* Section 6: 4 Types of Maintenance */}
            <div
              ref={(el) => {
                sectionRefs.current['types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                4 Types of Software Maintenance
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { color: 'red', title: 'Corrective', desc: 'Fixing bugs and errors after deployment', trigger: 'Bug reported', approach: 'Reactive' },
                  { color: 'purple', title: 'Preventive', desc: 'Proactive activities to prevent future failures', trigger: 'Scheduled review', approach: 'Proactive' },
                  { color: 'green', title: 'Perfective', desc: 'Enhancing functionality, usability, or performance', trigger: 'User feedback', approach: 'Planned' },
                  { color: 'blue', title: 'Adaptive', desc: 'Modifying software to work in a changed environment', trigger: 'Environmental change', approach: 'Reactive' },
                ].map(({ color, title, desc, trigger, approach }) => (
                  <div key={title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className={`text-sm font-bold ${isDarkMode ? `text-${color}-400` : `text-${color}-700`}`}>{title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{desc}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded text-center">Trigger: {trigger}</div>
                      <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded text-center">Approach: {approach}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 7: Software Deployment */}
            <div
              ref={(el) => {
                sectionRefs.current['deployment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Software Deployment
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Deployment is the process of making a software application available in a PRODUCTION environment.
                </p>
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-3">5 Stages</h4>
                <ul className="list-decimal pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Planning and Preparation</span> – define strategy, tools, environment setup.</li>
                  <li><span className="font-bold">Building and Packaging</span> – compile, bundle dependencies, create deployment package.</li>
                  <li><span className="font-bold">Testing and Staging</span> – deploy to staging environment, run comprehensive tests.</li>
                  <li><span className="font-bold">Deployment</span> – deploy to production using planned strategy.</li>
                  <li><span className="font-bold">Monitoring and Support</span> – watch metrics, review logs, staff support channels.</li>
                </ul>
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400 mt-3">8 Best Practices</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {['Automation', 'Version Control', 'Configuration Management', 'Staging Environment', 'Deployment Strategy', 'Rollback Plan', 'Monitoring & Alerting', 'Communication & Documentation'].map(item => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">{item}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 8: Deployment Strategies */}
            <div
              ref={(el) => {
                sectionRefs.current['deployment-strategies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                4 Types of Deployment Strategies
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { color: 'red', title: 'Full (Big Bang)', desc: 'Deploy entire new version to all users at once', risk: 'Highest', downtime: 'Likely required' },
                  { color: 'amber', title: 'Rolling', desc: 'Gradually roll out to subsets of users in phases', risk: 'Medium', downtime: 'Minimal' },
                  { color: 'green', title: 'Blue-Green', desc: 'Two identical environments; switch traffic instantly', risk: 'Lowest', downtime: 'None' },
                  { color: 'blue', title: 'Canary', desc: 'Deploy to small subset first for real-world validation', risk: 'Low', downtime: 'None' },
                ].map(({ color, title, desc, risk, downtime }) => (
                  <div key={title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className={`text-sm font-bold ${isDarkMode ? `text-${color}-400` : `text-${color}-700`}`}>{title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{desc}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded text-center">Risk: {risk}</div>
                      <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded text-center">Downtime: {downtime}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 9: Change Management */}
            <div
              ref={(el) => {
                sectionRefs.current['change-management'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Software Change Management
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Software change management is the structured approach to handling modifications to a software system.
                </p>
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-3">7 Key Strategies</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Impact Assessment</span> – analyse what other components might be affected.</li>
                  <li><span className="font-bold">Change Request Management</span> – formal process for proposing, reviewing, approving changes.</li>
                  <li><span className="font-bold">Version Control</span> – track every change with Git or similar.</li>
                  <li><span className="font-bold">Testing and Validation</span> – test every change before deployment.</li>
                  <li><span className="font-bold">Communication and Training</span> – inform stakeholders, provide training.</li>
                  <li><span className="font-bold">Deployment Management</span> – use professional deployment tools and processes.</li>
                  <li><span className="font-bold">Rollback Plan</span> – have a tested, ready rollback plan.</li>
                </ul>
              </div>
            </div>

            {/* Section 10: Legacy Systems */}
            <div
              ref={(el) => {
                sectionRefs.current['legacy'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Legacy Systems
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Legacy systems are old software applications built using outdated technologies that still run critical business functions.
                </p>
                <h4 className="text-xs font-bold text-red-600 dark:text-red-400 mt-3">4 Key Problems</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  {[
                    { icon: <Cpu size={16} />, title: 'Outdated Technology', desc: 'Languages and frameworks no longer widely used.' },
                    { icon: <AlertCircle size={16} />, title: 'Limited Functionality', desc: 'Lacks modern capabilities like mobile access.' },
                    { icon: <Shield size={16} />, title: 'Security Vulnerabilities', desc: 'Outdated security measures, no vendor support.' },
                    { icon: <DollarSign size={16} />, title: 'High Maintenance Costs', desc: 'Specialist developers, complex codebase, rare hardware.' },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="p-3 bg-gray-100 dark:bg-gray-700 rounded flex items-start gap-2 text-sm">
                      <span className="text-red-500 shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{title}</span>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 11: Tracking Tools */}
            <div
              ref={(el) => {
                sectionRefs.current['tracking-tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Tracking Tools for Change Management
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { color: 'blue', title: 'Audit Trails', desc: 'Chronological record of every change with who, what, when, why.' },
                  { color: 'green', title: 'Notifications and Alerts', desc: 'Automated alerts for proposed changes, approvals, deployments.' },
                  { color: 'purple', title: 'Digital Signatures', desc: 'Cryptographic verification of who made/approved a change.' },
                  { color: 'amber', title: 'Version Control Systems', desc: 'Complete history of every change to the codebase (Git).' },
                ].map(({ color, title, desc }) => (
                  <div key={title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className={`text-sm font-bold ${isDarkMode ? `text-${color}-400` : `text-${color}-700`}`}>{title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 12: SCM Tools */}
            <div
              ref={(el) => {
                sectionRefs.current['scm-tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                SCM Tools
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Software Configuration Management tools help manage, track, and control configuration of software systems.
                </p>
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-3">5 Key Functionalities</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {['Version Control', 'Configuration Management', 'Automation', 'Templating', 'Auditing'].map(item => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">{item}</div>
                  ))}
                </div>
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400 mt-3">Open-Source SCM Tools</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['Ansible', 'Chef', 'Puppet', 'SaltStack'].map(tool => (
                    <span key={tool} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">{tool}</span>
                  ))}
                </div>
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-3">Commercial SCM Tools</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['Microsoft Endpoint Manager', 'VMware vRealize Automation', 'Red Hat Ansible Automation Platform'].map(tool => (
                    <span key={tool} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">{tool}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 13: Practice Questions */}
            <div
              ref={(el) => {
                sectionRefs.current['practice'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Practice Questions
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Q1. Explain FIVE reasons why software maintenance is important.</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Bug fixes, security enhancements, adapting to new requirements, compatibility with new technologies, performance optimisation.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Q2. Compare the four types of software maintenance with examples.</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Corrective (fix bugs), Preventive (proactive), Perfective (enhance functionality), Adaptive (environmental changes).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Q3. Compare the four software deployment strategies.</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Full (all at once), Rolling (gradual phases), Blue-Green (two environments), Canary (small subset first).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Q4. Explain FOUR advantages and TWO disadvantages of open-source SCM tools.</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Advantages: cost-effective, customisable, large community, security transparency. Disadvantages: support challenges, feature gaps.</p>
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
                  💡 Maintenance Insight
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
                  <span>Maintenance Types</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Deployment Strategies</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">4</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Software maintenance is the longest and most expensive phase of the software lifecycle. Master the 4 types of maintenance, the deployment strategies, and change management practices. Legacy systems present unique challenges, and SCM tools help manage configuration complexity. These skills are what keep software systems running reliably for years.
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
                <strong className="text-white">Software Maintenance</strong> – accounts for 60-80% of total lifecycle costs; includes corrective, preventive, perfective, and adaptive types.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Maintenance Process</strong> – 7 steps: identify issues, prioritise, impact analysis, implement, test, deploy, update documentation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Deployment Strategies</strong> – Full (all at once), Rolling (gradual), Blue-Green (two environments), Canary (small subset). Each has different risk and downtime profiles.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Change Management</strong> – impact assessment, formal change requests, version control, testing, communication, deployment management, and rollback plans.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">SCM Tools</strong> – open-source (Ansible, Chef, Puppet, SaltStack) and commercial options help manage configuration, automation, and auditing.
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
            Sidemann Academic Registry • Software Engineering – Maintenance &amp; Deployment 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;