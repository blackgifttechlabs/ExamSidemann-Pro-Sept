import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
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
  Target,
  Users,
  DollarSign,
  Shield,
  Calendar,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'waterfall', label: 'Waterfall' },
  { id: 'iterative', label: 'Iterative' },
  { id: 'spiral', label: 'Spiral' },
  { id: 'agile', label: 'Agile' },
  { id: 'rup', label: 'RUP' },
  { id: 'ssadm-sdlc', label: 'SSADM vs SDLC' },
  { id: 'activities', label: 'Process Activities' },
  { id: 'change-strategies', label: 'Coping with Change' },
  { id: 'feasibility', label: 'Feasibility Study' },
  { id: 'methodologies', label: 'Methodologies' },
  { id: 'agile-benefits', label: 'Benefits of Agile' },
  { id: 'agile-terms', label: 'Agile Terms' },
  { id: 'project-tools', label: 'Project Tools' },
  { id: 'risk-management', label: 'Risk Management' },
  { id: 'practice', label: 'Practice Qs' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome6: React.FC = () => {
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
        text: 'The Waterfall Model was first described by Dr. Winston W. Royce in 1970. Ironically, Royce described it as flawed and recommended iterative development!',
      },
      {
        title: 'Pro Tip',
        text: 'For high-risk projects, always choose the Spiral Model. Its focus on risk analysis at every stage makes it ideal for mission-critical systems like banking and healthcare.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the RUP phases with "I Eat Chips Too Please": Inception, Elaboration, Construction, Transition, Production.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse SDLC with a specific model. SDLC is the overall concept (the journey from idea to maintenance), while Waterfall, Agile, and Spiral are specific ways of doing it.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The Waterfall Model was first described by Dr. Winston W. Royce in 1970. Ironically, Royce described it as flawed and recommended iterative development!',
      },
      {
        title: 'Pro Tip',
        text: 'For high-risk projects, always choose the Spiral Model. Its focus on risk analysis at every stage makes it ideal for mission-critical systems like banking and healthcare.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the RUP phases with "I Eat Chips Too Please": Inception, Elaboration, Construction, Transition, Production.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse SDLC with a specific model. SDLC is the overall concept (the journey from idea to maintenance), while Waterfall, Agile, and Spiral are specific ways of doing it.',
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
      <header className="bg-[#134e4a] dark:bg-[#042f2e] border-b border-teal-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <BookOpen size={14} className="inline mr-1" /> SOFTWARE ENGINEERING
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 6{' '}
            <span className="text-cyan-300 font-bold italic">
              Process Models &amp; Methodologies
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master software process models (Waterfall, Iterative, Spiral, Agile, RUP), process activities, feasibility studies, risk management, and project management tools.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Layers size={14} className="inline mr-1" /> Process Models
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Feasibility
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Risk Management
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
                placeholder="Search for a concept, Waterfall, Agile, risk..."
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
            {/* Section 1: Introduction */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                What is a Software Process Model?
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A software process model is a step-by-step plan that a team of developers follows when building a software application. Like a recipe for cooking, it defines what needs to be done, who does it, and in what order.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Analogy:</span> Like a builder needs architectural drawings before putting up a house, a software team needs a process model before writing code. Without it, developers would code randomly with no direction, wasting time and money.
                </p>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <Lightbulb size={14} className="inline mr-1" />
                    <span className="font-bold">Key Insight:</span> Each model suits a different type of project. Your job is to understand each one, know when to use it, and explain it clearly.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Waterfall Model */}
            <div
              ref={(el) => {
                sectionRefs.current['waterfall'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Waterfall Model
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A <span className="font-bold">sequential model</span> where each stage must be 100% complete before the next begins. Stages: Requirements → Design → Development → Testing → Deployment.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Called "Waterfall" because you can only go forward — you cannot go back up. Simple to manage but lacks flexibility.
                </p>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm font-bold text-green-700 dark:text-green-400">✅ Advantages</p>
                    <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                      <li>Simple to understand and manage</li>
                      <li>Clear deliverables for each phase</li>
                      <li>Works well when requirements are stable</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm font-bold text-red-700 dark:text-red-400">❌ Disadvantages</p>
                    <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                      <li>No flexibility for changes</li>
                      <li>Expensive to go back to earlier stages</li>
                      <li>Client only sees final product at the end</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <AlertCircle size={14} className="inline mr-1" />
                    <span className="font-bold">Exam Tip:</span> If asked about the disadvantage of Waterfall, always say: <span className="italic">"It lacks flexibility for changes in later stages."</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Iterative Model */}
            <div
              ref={(el) => {
                sectionRefs.current['iterative'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Iterative Model
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Development happens in small cycles called <span className="font-bold">iterations</span>. Each iteration goes through requirements, design, development, and testing — but it is a smaller, focused version.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Customer sees results after each iteration and gives feedback. Much more flexible than Waterfall — can adapt and improve with every round.
                </p>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm font-bold text-green-700 dark:text-green-400">✅ Advantages</p>
                    <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                      <li>Flexible — can adapt to changes</li>
                      <li>Customer involved throughout</li>
                      <li>Reduced risk of building wrong thing</li>
                      <li>Early feedback improves final product</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm font-bold text-red-700 dark:text-red-400">❌ Disadvantages</p>
                    <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                      <li>Requires more customer involvement</li>
                      <li>Can be more complex to manage</li>
                      <li>Scope creep if not controlled</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <Lightbulb size={14} className="inline mr-1" />
                    <span className="font-bold">Analogy:</span> Like making a dress — make a rough version, show the customer, get feedback, improve, repeat until she is happy.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Spiral Model */}
            <div
              ref={(el) => {
                sectionRefs.current['spiral'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Spiral Model
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Combines Waterfall structure with Iterative flexibility. <span className="font-bold">Focuses heavily on RISK</span> at every stage. Each loop asks: "What could go wrong here?" and deals with risks before moving forward.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Four key activities in each loop: Planning → Risk Analysis → Development → Evaluation. If a risk is too big, the project loops back to fix it.
                </p>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm font-bold text-green-700 dark:text-green-400">✅ Advantages</p>
                    <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                      <li>Risk-driven — catches problems early</li>
                      <li>Best for large, complex, high-risk projects</li>
                      <li>Flexible and iterative</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm font-bold text-red-700 dark:text-red-400">❌ Disadvantages</p>
                    <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                      <li>Expensive — risk analysis costs time and money</li>
                      <li>Complex to manage</li>
                      <li>Not suitable for small projects</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <AlertCircle size={14} className="inline mr-1" />
                    <span className="font-bold">Exam Tip:</span> If a question describes a <span className="italic">high-risk project</span> (like a banking system), the answer is almost always the <span className="font-bold">Spiral Model</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Agile Development */}
            <div
              ref={(el) => {
                sectionRefs.current['agile'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Agile Development
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Agile focuses on <span className="font-bold">flexibility, collaboration, and delivering working software quickly in small pieces</span>. Instead of delivering everything at the end, you deliver small working features every few weeks in <span className="font-bold">sprints</span> (1-4 weeks).
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Customer is involved throughout, giving constant feedback. If the customer changes their mind — no problem! Agile can accommodate that.
                </p>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm font-bold text-green-700 dark:text-green-400">✅ Advantages</p>
                    <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                      <li>Flexible — adapts to changing requirements</li>
                      <li>Faster delivery of working software</li>
                      <li>Customer satisfaction is high</li>
                      <li>Continuous testing = higher quality</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm font-bold text-red-700 dark:text-red-400">❌ Disadvantages</p>
                    <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                      <li>Requires highly skilled team</li>
                      <li>Customer must be available throughout</li>
                      <li>Less predictable than Waterfall</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <Lightbulb size={14} className="inline mr-1" />
                    <span className="font-bold">Analogy:</span> Like a soccer team adapting tactics mid-match. The coach doesn't plan every move for 90 minutes — the team adapts as the game goes on.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6: RUP */}
            <div
              ref={(el) => {
                sectionRefs.current['rup'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Rational Unified Process (RUP)
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A very detailed and comprehensive process model originally created by IBM. Tells you exactly what roles exist, what activities to perform, what documents to produce, and in what phase.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <span className="font-bold">5 Phases:</span> Inception (plan the idea) → Elaboration (refine design) → Construction (build software) → Transition (deploy to users) → Production (maintain).
                </p>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm font-bold text-green-700 dark:text-green-400">✅ Advantages</p>
                    <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                      <li>Very thorough — nothing left to chance</li>
                      <li>Clear roles and responsibilities</li>
                      <li>Well-documented process</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm font-bold text-red-700 dark:text-red-400">❌ Disadvantages</p>
                    <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                      <li>Complex and expensive to implement</li>
                      <li>Too heavy for small teams</li>
                      <li>Requires experienced team</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <Lightbulb size={14} className="inline mr-1" />
                    <span className="font-bold">Memory Trick:</span> "I Eat Chips Too Please" — <span className="font-bold">I</span>nception, <span className="font-bold">E</span>laboration, <span className="font-bold">C</span>onstruction, <span className="font-bold">T</span>ransition, <span className="font-bold">P</span>roduction.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 7: SSADM vs SDLC */}
            <div
              ref={(el) => {
                sectionRefs.current['ssadm-sdlc'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                SSADM vs SDLC
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">SSADM</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Structured System Analysis and Design Methodology. Very structured, focuses on user involvement and data modeling. Not commonly used today but many modern methods are based on its ideas.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">SDLC</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Software Development Life Cycle — the <span className="font-bold">big umbrella term</span> for the entire journey of building software. All models (Waterfall, Agile, Spiral) are different ways of implementing the SDLC.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <AlertCircle size={14} className="inline mr-1" />
                    <span className="font-bold">Common Mistake:</span> Students confuse SDLC with a specific model. SDLC is the <span className="italic">overall concept</span>, not a specific model!
                  </p>
                </div>
              </div>
            </div>

            {/* Section 8: Process Activities */}
            <div
              ref={(el) => {
                sectionRefs.current['activities'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Process Activities — The Six Key Tasks
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { num: '1', title: 'Requirements Gathering', desc: 'Ask the client "what do you want?" Like taking an order at a restaurant.' },
                    { num: '2', title: 'Design', desc: 'Create a blueprint. Like an architect drawing house plans.' },
                    { num: '3', title: 'Development', desc: 'The actual coding happens. Build the house.' },
                    { num: '4', title: 'Testing', desc: 'Check for bugs before handing over. Like taste-testing food before serving.' },
                    { num: '5', title: 'Deployment', desc: 'Release to actual users. Like officially opening a shop.' },
                    { num: '6', title: 'Maintenance', desc: 'Keep fixing bugs and adding features. Like servicing a car.' },
                  ].map(({ num, title, desc }) => (
                    <div key={num} className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                      <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{num}. {title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <Lightbulb size={14} className="inline mr-1" />
                    <span className="font-bold">Memory Trick:</span> "Really Dedicated Developers Test Daily, Man!" — R<span className="font-bold">e</span>quirements, <span className="font-bold">D</span>esign, <span className="font-bold">D</span>evelopment, <span className="font-bold">T</span>esting, <span className="font-bold">D</span>eployment, <span className="font-bold">M</span>aintenance.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 9: Coping with Change */}
            <div
              ref={(el) => {
                sectionRefs.current['change-strategies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Strategies for Coping with Change
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Change in a software project is certain — the question is how you handle it!</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {[
                    'Embrace Adaptability',
                    'Early Detection',
                    'Impact Assessment',
                    'Change Management Process',
                    'Version Control',
                    'Iterative Development',
                    'Continuous Testing',
                    'Training and Support',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 10: Feasibility Study */}
            <div
              ref={(el) => {
                sectionRefs.current['feasibility'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                How to Conduct a Feasibility Study
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A feasibility study asks: <span className="font-bold">"Is this project even worth doing?"</span> before spending time and money.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {[
                    '1. Define Project Scope',
                    '2. Identify Stakeholders',
                    '3. Market Research',
                    '4. Technical Feasibility',
                    '5. Economic Feasibility',
                    '6. Operational Feasibility',
                    '7. Schedule Feasibility',
                    '8. Risk Assessment',
                    '9. Present Findings',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <Lightbulb size={14} className="inline mr-1" />
                    <span className="font-bold">Memory Trick:</span> <span className="font-bold">TOERS</span> — <span className="font-bold">T</span>echnical, <span className="font-bold">O</span>perational, <span className="font-bold">E</span>conomic, <span className="font-bold">R</span>isk, <span className="font-bold">S</span>chedule feasibility.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 11: Methodologies Table */}
            <div
              ref={(el) => {
                sectionRefs.current['methodologies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Software Development Methodologies
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className={theadBg}>
                    <tr>
                      <th className="border p-2 text-left font-bold">Methodology</th>
                      <th className="border p-2 text-left font-bold">Simple Explanation</th>
                      <th className="border p-2 text-left font-bold">Analogy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Agile', 'Flexible, short sprints, constant feedback', 'A soccer team adapting tactics'],
                      ['Waterfall', 'Linear, one stage at a time', 'Building a house floor by floor'],
                      ['FDD', 'Build one feature at a time', 'Furnishing one room at a time'],
                      ['Lean', 'Remove waste, deliver value fast', 'A tight budget kitchen — no wastage!'],
                      ['Scrum', 'Short sprints + daily meetings', 'A rugby scrum — teamwork in short bursts'],
                      ['XP', 'Code quality + constant testing', 'A tailor constantly checking stitches'],
                      ['RAD', 'Rapid prototypes + user feedback', 'Sketching designs quickly'],
                      ['DevOps', 'Dev and Ops teams work together', 'A farm where planting and harvesting coordinate'],
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

            {/* Section 12: Benefits of Agile */}
            <div
              ref={(el) => {
                sectionRefs.current['agile-benefits'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Benefits of Agile
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Flexibility — adapts to changing requirements',
                    'Faster Delivery — value sooner',
                    'Better Customer Satisfaction',
                    'Higher Quality — continuous testing',
                    'More Productive Teams',
                    'Reduced Risk',
                    'Better Communication',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 13: Agile Terms */}
            <div
              ref={(el) => {
                sectionRefs.current['agile-terms'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Agile Project Management Terms
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Scrum</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Short daily stand-ups, sprints (1-4 weeks). Roles: Product Owner, Scrum Master, Development Team.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Kanban</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Visual board: To Do → In Progress → Done. Tasks move across the board. Popular for tracking work.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">APF</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Adaptive Project Framework — plans for change instead of trying to avoid it. Highly flexible.</p>
                </div>
              </div>
            </div>

            {/* Section 14: Project Tools */}
            <div
              ref={(el) => {
                sectionRefs.current['project-tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Project Management Tools
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'WBS', desc: 'Work Breakdown Structure — breaks big project into smaller tasks like a tree.' },
                  { title: 'Gantt Chart', desc: 'Bar chart showing tasks on a timeline. Shows when tasks happen and dependencies.' },
                  { title: 'PERT Chart', desc: 'Network diagram with time estimates. Finds the Critical Path — longest route through the project.' },
                  { title: 'Network Diagram', desc: 'Similar to PERT, shows task relationships and the critical path.' },
                  { title: 'Automated Tools', desc: 'Asana, Trello, Monday.com (task management), Toggl (time tracking), Power BI (reporting).' },
                ].map(({ title, desc }) => (
                  <div key={title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 15: Risk Management */}
            <div
              ref={(el) => {
                sectionRefs.current['risk-management'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Risk Management
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Risk management asks: <span className="font-bold">"What could go wrong?"</span> and prepares for it BEFORE it happens.
                </p>
                <h4 className="text-xs font-bold text-red-600 dark:text-red-400 mt-3">4-Step Process</h4>
                <ul className="list-decimal pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Risk Identification</span> — brainstorm all possible things that could go wrong.</li>
                  <li><span className="font-bold">Risk Assessment</span> — ask: How likely? How bad? Use a risk matrix.</li>
                  <li><span className="font-bold">Risk Response Planning</span> — decide: Avoid, Mitigate, Transfer, or Accept.</li>
                  <li><span className="font-bold">Monitor and Control</span> — keep watching risks throughout the project.</li>
                </ul>
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-3">Risk Response Strategies</h4>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {[
                    { s: 'Avoid', d: 'Remove the risk entirely' },
                    { s: 'Mitigate', d: 'Reduce chance or damage' },
                    { s: 'Transfer', d: 'Pass to someone else' },
                    { s: 'Accept', d: 'Accept it and have a backup plan' },
                  ].map(({ s, d }) => (
                    <div key={s} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-bold">{s}</span> — {d}
                    </div>
                  ))}
                </div>
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-3">Types of Risks</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['Scope Risk', 'Schedule Risk', 'Budget Risk', 'Technical Risk', 'Resource Risk', 'Stakeholder Risk'].map(r => (
                    <span key={r} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">{r}</span>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <Lightbulb size={14} className="inline mr-1" />
                    <span className="font-bold">Memory Trick:</span> "A Man Takes Action" — <span className="font-bold">A</span>void, <span className="font-bold">M</span>itigate, <span className="font-bold">T</span>ransfer, <span className="font-bold">A</span>ccept.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 16: Practice Questions */}
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
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Q1. Explain the Waterfall Model and state ONE advantage and ONE disadvantage.</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Waterfall is a sequential model where each stage must be completed before the next begins. Advantage: simple to manage. Disadvantage: lacks flexibility for later changes.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Q2. A company is developing a high-risk banking system. Which model would you recommend and why?</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Spiral Model — it focuses heavily on risk assessment at every stage, making it ideal for complex, high-stakes projects.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Q3. List and explain FOUR types of feasibility.</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Technical (skills/tools), Economic (financial viability), Operational (can the org run it?), Schedule (can it be done on time?).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Q4. Differentiate between a Gantt Chart and a PERT Chart.</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Gantt = timeline bar chart. PERT = network diagram with time estimates and critical path.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Q5. What are the FOUR risk response strategies?</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Avoid (eliminate the risk), Mitigate (reduce chance/impact), Transfer (pass to someone else), Accept (acknowledge and have a backup plan).</p>
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
                  💡 Process Model Insight
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
                  <span>Process Models</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Risk Response Strategies</span>
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
                Choosing the right process model is critical for project success. Waterfall for stable requirements, Agile for changing requirements, Spiral for high-risk projects. Know the feasibility types (TOERS) and the risk response strategies (AMTA). These are exam gold!
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
                <strong className="text-white">Process Models</strong> – Waterfall (sequential, stable requirements), Iterative (feedback loops), Spiral (risk-driven), Agile (flexible), RUP (detailed, thorough).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Process Activities</strong> – Requirements → Design → Development → Testing → Deployment → Maintenance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Feasibility Study</strong> – Technical, Operational, Economic, Risk, Schedule (TOERS). Asks "Is this project worth doing?"
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Risk Management</strong> – Identify → Assess → Respond → Monitor. Response strategies: Avoid, Mitigate, Transfer, Accept (AMTA).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Project Tools</strong> – WBS (breakdown), Gantt (timeline), PERT (network with critical path), automated tools (Asana, Trello).
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
            Sidemann Academic Registry • Software Engineering – Process Models &amp; Methodologies 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome6;