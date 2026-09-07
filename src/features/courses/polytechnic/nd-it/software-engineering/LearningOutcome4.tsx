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
  LockIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'needs', label: '8 Needs' },
  { id: 'verification-validation', label: 'Verification vs Validation' },
  { id: 'sdlc-phases', label: 'Testing in SDLC' },
  { id: 'levels', label: 'Levels of Testing' },
  { id: 'types', label: 'Types of Testing' },
  { id: 'change-management', label: 'Change Management' },
  { id: 'resistance', label: 'Reducing Resistance' },
  { id: 'impact', label: 'Impact of Modifications' },
  { id: 'justification', label: 'Justification for Updates' },
  { id: 'regression', label: 'Regression Testing' },
  { id: 'practice', label: 'Practice Qs' },
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
        text: 'The cost of fixing a bug increases exponentially the later it is discovered. A bug found during requirements can cost $1 to fix; during design $5; during coding $20; during testing $50; after release $5000 or more!',
      },
      {
        title: 'Pro Tip',
        text: 'Always run regression tests after any change to ensure you haven\'t broken existing functionality. Automation makes regression testing practical and fast.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the difference: Verification = "Are we building it right?" (process); Validation = "Are we building the right thing?" (outcome).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse alpha testing (internal, controlled) with beta testing (external, real users). Alpha is before beta in the testing sequence.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The cost of fixing a bug increases exponentially the later it is discovered. A bug found during requirements can cost $1 to fix; during design $5; during coding $20; during testing $50; after release $5000 or more!',
      },
      {
        title: 'Pro Tip',
        text: 'Always run regression tests after any change to ensure you haven\'t broken existing functionality. Automation makes regression testing practical and fast.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the difference: Verification = "Are we building it right?" (process); Validation = "Are we building the right thing?" (outcome).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse alpha testing (internal, controlled) with beta testing (external, real users). Alpha is before beta in the testing sequence.',
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Code size={14} className="inline mr-1" /> SOFTWARE ENGINEERING
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 4{' '}
            <span className="text-amber-300 font-bold italic">
              Testing &amp; Change Management
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master software testing objectives, needs, verification vs validation, SDLC phases, testing levels, types, change management, and regression testing.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <CheckCircle size={14} className="inline mr-1" /> Testing
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Settings size={14} className="inline mr-1" /> Change Management
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <RefreshCw size={14} className="inline mr-1" /> Regression Testing
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
                placeholder="Search for a concept, verification, regression..."
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
            {/* Section 1: Software Testing Intro */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Software Testing – Deep Dive
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Software testing is the systematic process of evaluating and verifying that a software product meets its specified requirements and performs as expected in all conditions. It is a planned, organised, methodical process with defined objectives, strategies, and documented results.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">4 Objectives of Software Testing</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                    <span className="font-bold text-blue-600 dark:text-blue-400">1. Identify Bugs</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Find errors before users do.</p>
                  </div>
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                    <span className="font-bold text-green-600 dark:text-green-400">2. Verify Requirements</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Ensure all requirements are implemented.</p>
                  </div>
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                    <span className="font-bold text-purple-600 dark:text-purple-400">3. Improve Quality</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Continuously raise reliability.</p>
                  </div>
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                    <span className="font-bold text-amber-600 dark:text-amber-400">4. Prevent User Issues</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Protect users from encountering problems.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: 8 Needs for Software Testing */}
            <div
              ref={(el) => {
                sectionRefs.current['needs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                8 Needs for Software Testing
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: <Shield size={16} />, title: 'Reduce Risk of Failure', desc: 'Fixing bugs before deployment costs dramatically less than after.' },
                    { icon: <Users size={16} />, title: 'Enhanced User Experience', desc: 'Usability testing identifies confusing workflows and errors.' },
                    { icon: <CheckCircle size={16} />, title: 'Improved Software Quality', desc: 'Testing is the primary mechanism for quality control.' },
                    { icon: <DollarSign size={16} />, title: 'Cost Savings', desc: 'Bug fixed in development costs a fraction of production fix.' },
                    { icon: <AlertCircle size={16} />, title: 'Compliance with Regulations', desc: 'Many industries require rigorous testing standards.' },
                    { icon: <LockIcon size={16} />, title: 'Improved Security', desc: 'Security testing finds vulnerabilities before attackers do.' },
                    { icon: <TrendingUp size={16} />, title: 'Performance Optimisation', desc: 'Performance testing reveals bottlenecks under load.' },
                    { icon: <Target size={16} />, title: 'Meeting Business Goals', desc: 'Verifies software actually delivers intended business value.' },
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

            {/* Section 3: Verification vs Validation */}
            <div
              ref={(el) => {
                sectionRefs.current['verification-validation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Verification vs Validation Testing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Verification</h3>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">"Are we building the product RIGHT?"</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Checks that software is built correctly according to specifications.</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Code reviews and design reviews</li>
                    <li>Inspections and walkthroughs</li>
                    <li>Checking requirements translation</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Validation</h3>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">"Are we building the RIGHT product?"</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Checks that software meets actual user needs.</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>User acceptance testing</li>
                    <li>Usability testing</li>
                    <li>Observing real users</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border-collapse">
                    <thead className={theadBg}>
                      <tr>
                        <th className="border p-2 text-left font-bold">Feature</th>
                        <th className="border p-2 text-left font-bold">Verification</th>
                        <th className="border p-2 text-left font-bold">Validation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Core question', '"Are we building it RIGHT?"', '"Are we building the RIGHT thing?"'],
                        ['Focus', 'Process and specifications', 'User needs and real‑world value'],
                        ['When', 'Throughout development', 'End of development / with real users'],
                        ['Tests against', 'Design documents', 'User needs'],
                        ['Methods', 'Code reviews, unit tests', 'User testing, acceptance testing'],
                        ['Performed by', 'Developers and testers', 'End‑users'],
                      ].map((item, idx) => (
                        <tr key={item[0]} className={rowBg(idx)}>
                          <td className="border p-2 font-bold">{item[0]}</td>
                          <td className="border p-2">{item[1]}</td>
                          <td className="border p-2">{item[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Section 4: Testing Throughout the SDLC */}
            <div
              ref={(el) => {
                sectionRefs.current['sdlc-phases'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Testing Throughout the SDLC
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Phase 1: Development Testing</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Unit testing (individual functions) and integration testing (module interactions). Caught bugs immediately.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Phase 2: Test‑Driven Development (TDD)</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tests written BEFORE code. Red‑Green‑Refactor cycle. Produces comprehensive test coverage.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Phase 3: Release Testing</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">System testing (against requirements) and regression testing (ensure no existing functionality broken).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Phase 4: User Testing</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Real users interact with the software to identify usability issues and validate real‑world suitability.</p>
                </div>
              </div>
            </div>

            {/* Section 5: Levels of Software Testing */}
            <div
              ref={(el) => {
                sectionRefs.current['levels'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Levels of Software Testing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { level: 'Unit Testing', scope: 'Smallest', desc: 'Tests individual functions in isolation.', performer: 'Developers' },
                  { level: 'Integration Testing', scope: 'Module interactions', desc: 'Tests how modules work together.', performer: 'Developers/Testers' },
                  { level: 'System Testing', scope: 'Complete system', desc: 'Tests entire system against all requirements.', performer: 'Dedicated testers' },
                  { level: 'Acceptance Testing', scope: 'Real‑world usage', desc: 'End‑users validate real‑world suitability.', performer: 'End‑users' },
                ].map(({ level, scope, desc, performer }) => (
                  <div key={level} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{level}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Scope: {scope}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{desc}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Performed by: {performer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6: Types of Testing */}
            <div
              ref={(el) => {
                sectionRefs.current['types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Types of Software Testing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Alpha Testing</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Internal, controlled testing by development team or trusted internal users. Software may be unstable. First external testing round.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Beta Testing</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">External testing with real users in real environments. Software is mostly stable. Feedback used for final refinements.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Black‑Box Testing</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">No code knowledge – external user perspective. Tests inputs and outputs. Also called functional testing.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">White‑Box Testing</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Full code knowledge – structural testing. Tests internal code paths, decision branches. Also called structural testing.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border-collapse">
                    <thead className={theadBg}>
                      <tr>
                        <th className="border p-2 text-left font-bold">Feature</th>
                        <th className="border p-2 text-left font-bold">Black‑Box</th>
                        <th className="border p-2 text-left font-bold">White‑Box</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Code knowledge', 'None', 'Full'],
                        ['Perspective', 'External user', 'Internal developer'],
                        ['Focus', 'Functionality and outputs', 'Code structure and paths'],
                        ['Who performs it', 'Testers, end‑users', 'Developers, security testers'],
                        ['Also called', 'Functional testing', 'Structural testing'],
                      ].map((item, idx) => (
                        <tr key={item[0]} className={rowBg(idx)}>
                          <td className="border p-2 font-bold">{item[0]}</td>
                          <td className="border p-2">{item[1]}</td>
                          <td className="border p-2">{item[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Section 7: Change Management */}
            <div
              ref={(el) => {
                sectionRefs.current['change-management'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Change Management
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Change management is the structured, planned approach to implementing changes in an organisation in a way that minimises disruption and maximises successful adoption by the people affected.
                </p>
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-3">5 Key Aspects</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">1. Identifying the Need for Change</span> – clearly articulate why change is necessary.</li>
                  <li><span className="font-bold">2. Developing a Change Management Plan</span> – detailed plan with timeline, communication, training, resistance management.</li>
                  <li><span className="font-bold">3. Communicating the Change Effectively</span> – honest, timely, two‑way communication.</li>
                  <li><span className="font-bold">4. Training and Support</span> – comprehensive training and ongoing support resources.</li>
                  <li><span className="font-bold">5. Monitoring and Evaluation</span> – track adoption and success metrics.</li>
                </ul>
              </div>
            </div>

            {/* Section 8: Reducing Resistance to Change */}
            <div
              ref={(el) => {
                sectionRefs.current['resistance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Reducing Resistance to Change
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Involve Employees', desc: 'Consult and involve employees in shaping the change for ownership.' },
                  { title: 'Communicate Clearly', desc: 'Transparent, honest communication reduces anxiety and rumour.' },
                  { title: 'Address Concerns', desc: 'Create channels for feedback and respond substantively.' },
                  { title: 'Offer Training', desc: 'Comprehensive training transforms fear into confidence.' },
                  { title: 'Celebrate Successes', desc: 'Recognise milestones to maintain momentum.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">{title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 9: Impact of System Modification */}
            <div
              ref={(el) => {
                sectionRefs.current['impact'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Impact of System Modification
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><ThumbsUp size={16} /> Positive Impacts</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Improved Efficiency and Productivity</li>
                    <li>Enhanced Functionality</li>
                    <li>Increased User Satisfaction</li>
                    <li>Cost Savings</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><ThumbsDown size={16} /> Negative Impacts</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Disruption and Downtime</li>
                    <li>Training Costs</li>
                    <li>Unforeseen Issues</li>
                    <li>Resistance to Change</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 10: Justification for System Updates */}
            <div
              ref={(el) => {
                sectionRefs.current['justification'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Justification for System Updates
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Security Enhancements', desc: 'Patches close known vulnerabilities to protect against attacks.' },
                  { title: 'Bug Fixes', desc: 'Updates fix issues discovered by users, improving stability.' },
                  { title: 'New Features', desc: 'Add functionality that improves productivity and value.' },
                  { title: 'Compatibility Updates', desc: 'Ensure software works with evolving platforms and dependencies.' },
                  { title: 'Improved Performance', desc: 'Optimisations that make software faster and more efficient.' },
                  { title: 'Compliance with Regulations', desc: 'Meet new legal and regulatory requirements.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">{title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 11: Regression Testing */}
            <div
              ref={(el) => {
                sectionRefs.current['regression'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Regression Testing
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Regression testing is performed after any change to verify that existing functionality has not been broken.
                </p>
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-3">5 Reasons It Is Essential</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">1. Preserves Existing Functionality</span> – confirms previously working features still work.</li>
                  <li><span className="font-bold">2. Maintains Stability</span> – catches destabilising effects of changes.</li>
                  <li><span className="font-bold">3. Reduces Risk of User Issues</span> – minimises update‑induced problems.</li>
                  <li><span className="font-bold">4. Increases Confidence in Updates</span> – teams deploy with evidence of no regression.</li>
                  <li><span className="font-bold">5. Cost‑Effectiveness</span> – cheaper to catch regressions in testing than in production.</li>
                </ul>
              </div>
            </div>

            {/* Section 12: Practice Questions */}
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
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Q1. Define software testing and explain FOUR of its needs.</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Software testing is systematic evaluation to find defects. Needs: reduce failure risk, improve quality, enhance security, and save costs (catching bugs early).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Q2. Differentiate Verification from Validation.</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Verification: "Are we building it right?" – checks against specifications. Validation: "Are we building the right thing?" – checks against user needs.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Q3. Explain the four phases of testing throughout the SDLC.</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Development testing (unit/integration), TDD (tests first), Release testing (system/regression), User testing (real users).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Q4. Compare Black‑Box and White‑Box testing.</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Black‑box: no code knowledge, user perspective. White‑box: full code knowledge, structural testing. Black‑box is functional, white‑box is structural.</p>
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
                  💡 Testing Insight
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
                  <span>Testing Levels</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Testing Types</span>
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
                Testing is not an afterthought – it is an integral part of the software development lifecycle. Verification vs validation, the four testing levels, and regression testing are essential concepts. Change management and understanding the impact of modifications are equally critical for successful software deployment.
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
                <strong className="text-white">Software Testing</strong> – systematic process with objectives to identify bugs, verify requirements, improve quality, and prevent user issues.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Verification vs Validation</strong> – Verification checks technical correctness ("built right"), Validation checks real‑world value ("built the right thing").
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Levels &amp; Types</strong> – Unit, Integration, System, Acceptance. Alpha/Beta, Black‑box/White‑box each serve different purposes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Change Management</strong> – involves clear communication, training, and reducing resistance to ensure successful adoption of system changes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Regression Testing</strong> – essential after any change to verify existing functionality remains intact; prevents regressions from reaching production.
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
            Sidemann Academic Registry • Software Engineering – Testing &amp; Change Management 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;