import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Lightbulb,
  GraduationCap,
  Rocket,
  Brain,
  ChevronRight,
  Terminal,
  Database,
  Layout,
  CheckCircle,
  Clock,
  BookOpen,
  Users,
  TrendingUp,
  Globe,
  Zap,
  Target,
  BarChart3,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw,
  ChevronUp,
  AlertCircle,
  Monitor,
  Smartphone,
  Cpu,
  Layers,
  FileText,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'concept', label: 'Concept' },
  { id: 'radical-vs-incremental', label: 'Radical vs Incremental' },
  { id: 'radical', label: 'Radical' },
  { id: 'incremental', label: 'Incremental' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'process', label: 'Process' },
  { id: 'factors', label: 'Success Factors' },
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
        text: 'The concept of "creative destruction" was coined by economist Joseph Schumpeter, describing how innovation replaces older technologies and creates new economic structures.',
      },
      {
        title: 'Pro Tip',
        text: 'To foster innovation, create a culture where failure is seen as a learning opportunity. Encourage experimentation and reward creativity, not just successful outcomes.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the innovation process as "IDEATE": Idea Generation, Development, Evaluation, Application, Testing, and Execution.',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t confuse invention with innovation. Invention is creating something new; innovation is successfully implementing it and creating value.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The concept of "creative destruction" was coined by economist Joseph Schumpeter, describing how innovation replaces older technologies and creates new economic structures.',
      },
      {
        title: 'Pro Tip',
        text: 'To foster innovation, create a culture where failure is seen as a learning opportunity. Encourage experimentation and reward creativity, not just successful outcomes.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the innovation process as "IDEATE": Idea Generation, Development, Evaluation, Application, Testing, and Execution.',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t confuse invention with innovation. Invention is creating something new; innovation is successfully implementing it and creating value.',
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
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Lightbulb size={14} className="inline mr-1" /> INNOVATION
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 5{' '}
            <span className="text-rose-300 font-bold italic">
              Simply Easy Innovation
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            The Concept of Innovation — radical vs incremental, benefits, process, and success factors.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Zap size={14} className="inline mr-1" /> Radical Innovation
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <TrendingUp size={14} className="inline mr-1" /> Incremental Innovation
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Innovation Process
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
                placeholder="Search for a concept, radical, process..."
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
            {/* Section 1: Concept of Innovation */}
            <div
              ref={(el) => {
                sectionRefs.current['concept'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Concept of Innovation
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Innovation is a crucial driver of progress and success. It's not just about coming up with new ideas; it's about bringing those ideas to life and creating value.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Defining Innovation</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Innovation is the process of creating new ideas and converting them into useful products, services, or methods. It involves developing something new or improving upon existing offerings, and then successfully implementing it to create value. A key aspect is that it must be adopted and have an impact to be truly considered an innovation.
                </p>
              </div>
            </div>

            {/* Section 2: Radical vs Incremental Table */}
            <div
              ref={(el) => {
                sectionRefs.current['radical-vs-incremental'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Radical vs. Incremental Innovation
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Feature</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Radical Innovation</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Incremental Innovation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[
                      { feature: "Nature", rad: "Disruptive, transformative", inc: "Evolutionary, improving existing offerings" },
                      { feature: "Impact", rad: "Creates new markets, changes landscape", inc: "Enhances existing products, improves efficiency" },
                      { feature: "Risk", rad: "High risk, high reward", inc: "Lower risk, moderate reward" },
                      { feature: "Example", rad: "Invention of internet, smartphone", inc: "Software upgrades, new car features" },
                      { feature: "Focus", rad: "Fundamental changes, new technologies", inc: "Refinements, improvements" },
                      { feature: "Market", rad: "Creates entirely new markets", inc: "Addresses existing market needs" },
                    ].map((item, idx) => (
                      <tr key={idx} className={rowBg(idx)}>
                        <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">{item.feature}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.rad}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.inc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Radical Innovation */}
            <div
              ref={(el) => {
                sectionRefs.current['radical'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Radical Innovation
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  This type of innovation involves a fundamental change or breakthrough that disrupts existing markets and creates entirely new ones. It often involves new technologies or scientific discoveries. Think of the invention of the personal computer – it completely changed how we interacted with technology and created a whole new industry.
                </p>
              </div>
            </div>

            {/* Section 4: Incremental Innovation */}
            <div
              ref={(el) => {
                sectionRefs.current['incremental'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Incremental Innovation
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  This type of innovation focuses on making improvements to existing products, services, or processes. It's about refining and enhancing what already exists, making it better, faster, or more efficient. Think of the annual updates to your favourite software – they often include incremental improvements that add new features or enhance performance.
                </p>
              </div>
            </div>

            {/* Section 5: Benefits of Innovation */}
            <div
              ref={(el) => {
                sectionRefs.current['benefits'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Benefits of Innovation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">For Individuals</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Increased opportunities</li>
                    <li>Improved quality of life</li>
                    <li>Personal growth</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400">For Organizations</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Competitive advantage</li>
                    <li>Increased profitability</li>
                    <li>Improved efficiency</li>
                    <li>Growth and expansion</li>
                    <li>Talent attraction</li>
                    <li>Enhanced brand reputation</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400">For Society</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Economic growth</li>
                    <li>Improved living standards</li>
                    <li>Solutions to global challenges</li>
                    <li>Progress and development</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 6: Innovation Process */}
            <div
              ref={(el) => {
                sectionRefs.current['process'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Innovation Process
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  The innovation process is a structured approach to bringing new ideas to fruition, from initial conception to market success. It's not linear, but a general framework helps guide the journey.
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Idea Generation:</strong> Brainstorming, research, market analysis.</li>
                  <li><strong>Idea Evaluation:</strong> Feasibility, market potential, resource requirements.</li>
                  <li><strong>Concept Testing:</strong> Gather feedback from target customers.</li>
                  <li><strong>Product Development:</strong> Design, engineering, prototyping, testing.</li>
                  <li><strong>Testing and Execution:</strong> Thorough testing and launch.</li>
                  <li><strong>Post‑Development:</strong> Commercialisation, marketing, sales, support.</li>
                  <li><strong>Support and Maintenance:</strong> Ongoing support for customer satisfaction.</li>
                </ul>
              </div>
            </div>

            {/* Section 7: Factors Affecting Innovation Success */}
            <div
              ref={(el) => {
                sectionRefs.current['factors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Factors Affecting Innovation Success
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-green-600 dark:text-green-400">Market Needs:</span> Must address a real need or solve a problem.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-blue-600 dark:text-blue-400">Technical Feasibility:</span> Must be technically achievable.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-purple-600 dark:text-purple-400">Organisational Culture:</span> Supportive culture is essential.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-amber-600 dark:text-amber-400">Resources:</span> Adequate resources must be available.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-red-600 dark:text-red-400">Leadership:</span> Strong leadership is crucial.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-cyan-600 dark:text-cyan-400">Market Timing:</span> Timing of market introduction matters.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-pink-600 dark:text-pink-400">Competitive Landscape:</span> Consider competition.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-orange-600 dark:text-orange-400">Intellectual Property:</span> Protect IP for advantage.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">Customer Feedback:</span> Incorporate feedback throughout.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-blue-600 dark:text-blue-400">Risk Management:</span> Identify and mitigate risks.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-green-600 dark:text-green-400">Execution:</span> Proper execution is key.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-purple-600 dark:text-purple-400">Adaptability:</span> Adapt to market changes.
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
                  💡 Innovation Insight
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
                  <span>Innovation Types</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">2</span>
                </li>
                <li className="flex justify-between">
                  <span>Success Factors</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">12</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Innovation is about creating value from ideas. Understand the difference between radical and incremental innovation. Follow a structured process, and consider the key success factors like market needs, culture, resources, and execution. Innovation is not just about invention; it's about implementation and impact.
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
                <strong className="text-white">Innovation</strong> – turning ideas into value; must be implemented and have impact.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Radical Innovation</strong> – disruptive, creates new markets, high risk/reward.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Incremental Innovation</strong> – improves existing offerings, lower risk, evolutionary.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Benefits</strong> – for individuals, organisations, and society; drives growth and progress.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Process &amp; Success Factors</strong> – follow a structured process; consider market needs, resources, culture, and execution.
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
            Sidemann Academic Registry • Innovation Fundamentals 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;