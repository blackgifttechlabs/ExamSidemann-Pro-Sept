import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Search,
  BookOpen,
  BarChart3,
  PieChart,
  TrendingUp,
  FileText,
  ClipboardList,
  Users,
  Target,
  Eye,
  CheckCircle,
  Terminal,
  GitBranch,
  FileText as FileTextIcon,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  AlertCircle,
  Monitor,
  Smartphone,
  Cpu,
  Book,
  PenTool,
  Layers,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'scientific-method', label: 'Scientific Method' },
  { id: 'types', label: 'Types' },
  { id: 'process', label: 'Process' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome1: React.FC = () => {
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
        text: 'The word "research" comes from the Old French "recherche", meaning "to search again". It implies a thorough, systematic investigation.',
      },
      {
        title: 'Pro Tip',
        text: 'Always start with a clear research question. A well-defined problem is half the solution. Use the SMART criteria: Specific, Measurable, Achievable, Relevant, Time-bound.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the scientific method with "OHEC": Observation, Hypothesis, Experiment, Conclusion. Or "PEAR": Problem, Experiment, Analysis, Result.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse research methods with methodology. Methods are the techniques (e.g., surveys, interviews), while methodology is the overall strategy and rationale.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The word "research" comes from the Old French "recherche", meaning "to search again". It implies a thorough, systematic investigation.',
      },
      {
        title: 'Pro Tip',
        text: 'Always start with a clear research question. A well-defined problem is half the solution. Use the SMART criteria: Specific, Measurable, Achievable, Relevant, Time-bound.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the scientific method with "OHEC": Observation, Hypothesis, Experiment, Conclusion. Or "PEAR": Problem, Experiment, Analysis, Result.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse research methods with methodology. Methods are the techniques (e.g., surveys, interviews), while methodology is the overall strategy and rationale.',
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
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Search size={14} className="inline mr-1" /> LEARNING OUTCOME 1
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            What is{' '}
            <span className="text-emerald-300 font-bold italic">
              Research?
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master the fundamentals of research: definition, characteristics, types, and the complete research process.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Search size={14} className="inline mr-1" /> Systematic Inquiry
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <BarChart3 size={14} className="inline mr-1" /> Qual &amp; Quant
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileText size={14} className="inline mr-1" /> Research Process
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
                placeholder="Search for a concept, method, process..."
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
            {/* Introduction */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                What is Research?
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Research is a systematic and organized process of investigation aimed at discovering new knowledge, validating existing knowledge, or filling gaps in understanding. It involves asking questions and searching for answers using structured methodologies.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Defining Research</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A careful and detailed study of a subject or problem to discover new facts, information, or relationships. It's not just gathering information; it's critically examining, interpreting, and drawing meaningful conclusions.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Characteristics of Research</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Systematic:</strong> Follows a logical and organized structure.</li>
                  <li><strong>Empirical:</strong> Based on real-world observations or data.</li>
                  <li><strong>Critical:</strong> Involves rigorous scrutiny and evaluation.</li>
                  <li><strong>Analytical:</strong> Requires careful analysis and interpretation.</li>
                  <li><strong>Replicable:</strong> Process documented for others to repeat.</li>
                  <li><strong>Valid and Reliable:</strong> Produces accurate and consistent results.</li>
                  <li><strong>Objective:</strong> Minimises bias and maintains neutrality.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Objectives of Research</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Exploration:</strong> Gain initial insights into a new phenomenon.</li>
                  <li><strong>Description:</strong> Provide a detailed account of a situation.</li>
                  <li><strong>Explanation:</strong> Understand causes and relationships.</li>
                  <li><strong>Prediction:</strong> Forecast future outcomes.</li>
                  <li><strong>Control:</strong> Manipulate variables to achieve outcomes.</li>
                </ul>
              </div>
            </div>

            {/* Scientific Method */}
            <div
              ref={(el) => {
                sectionRefs.current['scientific-method'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Research and the Scientific Method
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  The scientific method provides a structured framework for conducting research, ensuring objectivity and rigor. The typical steps are:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Observation:</strong> Identify a problem or question.</li>
                  <li><strong>Hypothesis:</strong> Formulate a testable explanation.</li>
                  <li><strong>Experimentation:</strong> Design and conduct tests to gather data.</li>
                  <li><strong>Analysis:</strong> Analyse the data to draw conclusions.</li>
                  <li><strong>Conclusion:</strong> Determine if the hypothesis is supported.</li>
                  <li><strong>Communication:</strong> Share findings with the community.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  The method emphasises empirical evidence, logical reasoning, and peer review, ensuring credibility and validity.
                </p>
              </div>
            </div>

            {/* Types of Research */}
            <div
              ref={(el) => {
                sectionRefs.current['types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Different Types of Research
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Research can be categorized in several ways. Here are key distinctions.
              </p>

              {/* Descriptive vs Analytical */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-6">
                <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400">Descriptive vs. Analytical Research</h3>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Feature</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Descriptive</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Analytical</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {[
                        { feature: "Purpose", desc: "Describe characteristics.", anal: "Explain relationships." },
                        { feature: "Focus", desc: "What is?", anal: "Why and how?" },
                        { feature: "Data", desc: "Surveys, observations.", anal: "Experiments, statistics." },
                        { feature: "Example", desc: "Market research.", anal: "Impact of teaching method." },
                      ].map((item, idx) => (
                        <tr key={idx} className={rowBg(idx)}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">{item.feature}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.desc}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.anal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Applied vs Fundamental */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-6">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Applied vs. Fundamental (Basic) Research</h3>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Feature</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Applied</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fundamental</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {[
                        { feature: "Purpose", applied: "Solve practical problems.", basic: "Expand knowledge." },
                        { feature: "Focus", applied: "Immediate application.", basic: "Theoretical understanding." },
                        { feature: "Example", applied: "Developing a drug.", basic: "Investigating dark matter." },
                      ].map((item, idx) => (
                        <tr key={idx} className={rowBg(idx)}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">{item.feature}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.applied}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.basic}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quantitative vs Qualitative */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-6">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">Quantitative vs. Qualitative Research</h3>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Feature</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantitative</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Qualitative</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {[
                        { feature: "Data", quant: "Numerical, measured.", qual: "Text, images, observations." },
                        { feature: "Methods", quant: "Surveys, experiments.", qual: "Interviews, case studies." },
                        { feature: "Focus", quant: "Objective, generalisable.", qual: "Subjective, context-specific." },
                        { feature: "Example", quant: "Marketing campaign effectiveness.", qual: "Lived experiences of refugees." },
                      ].map((item, idx) => (
                        <tr key={idx} className={rowBg(idx)}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">{item.feature}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.quant}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.qual}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Conceptual vs Empirical */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-6">
                <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400">Conceptual vs. Empirical Research</h3>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Feature</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Conceptual</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Empirical</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {[
                        { feature: "Data", conceptual: "Existing ideas, theories.", empirical: "Direct observation/experience." },
                        { feature: "Methods", conceptual: "Literature reviews, analysis.", empirical: "Experiments, surveys, interviews." },
                        { feature: "Focus", conceptual: "Develop new concepts.", empirical: "Test hypotheses." },
                        { feature: "Example", conceptual: "New theory of leadership.", empirical: "Effects of exercise on blood pressure." },
                      ].map((item, idx) => (
                        <tr key={idx} className={rowBg(idx)}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">{item.feature}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.conceptual}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.empirical}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mixed Methods */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Mixed Methods Research</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Combines both quantitative and qualitative approaches in a single study. Provides a more comprehensive understanding by integrating different data types and perspectives.
                </p>
              </div>
            </div>

            {/* Research Process */}
            <div
              ref={(el) => {
                sectionRefs.current['process'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Steps in the Research Process
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  The research process is a systematic journey. Below are the typical steps:
                </p>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Selection of the Research Problem:</strong> Identify a gap or question.</li>
                  <li><strong>Literature Review:</strong> Understand existing knowledge.</li>
                  <li><strong>Making Hypothesis (Optional):</strong> Formulate a testable prediction.</li>
                  <li><strong>Preparing the Research Design:</strong> Plan methods and procedures.</li>
                  <li><strong>Sampling:</strong> Select a representative sample.</li>
                  <li><strong>Data Collection:</strong> Gather data using chosen methods.</li>
                  <li><strong>Data Analysis:</strong> Analyse and interpret data.</li>
                  <li><strong>Hypothesis Testing (If applicable):</strong> Evaluate evidence.</li>
                  <li><strong>Generalization and Interpretation:</strong> Draw conclusions and implications.</li>
                  <li><strong>Preparation of Report:</strong> Communicate findings.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Research Insight
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
                  <span>Research Types</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Process Steps</span>
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
                Research is a systematic, disciplined process. Understand the different types and their appropriate applications. Follow the research process steps to ensure rigour and validity. Always critically evaluate sources and maintain objectivity.
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
                <strong className="text-white">Research</strong> – systematic, empirical, critical, analytical, replicable, valid, reliable, and objective.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Scientific Method</strong> – observation, hypothesis, experimentation, analysis, conclusion, communication.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Types</strong> – descriptive vs analytical, applied vs fundamental, quantitative vs qualitative, conceptual vs empirical, mixed methods.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Research Process</strong> – 10 steps from problem selection to report preparation. Follow systematically.
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
            Sidemann Academic Registry • Research Fundamentals 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;