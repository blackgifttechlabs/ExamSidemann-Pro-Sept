import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  BarChart3,
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
  PieChart,
  LineChart,
  Activity,
  Copy,
  Check,
  FileText,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  AlertCircle,
  Calculator,
  TrendingUp,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'sampling-overview', label: 'Sampling' },
  { id: 'probability-sampling', label: 'Probability' },
  { id: 'non-probability-sampling', label: 'Non-Probability' },
  { id: 'data-collection', label: 'Data Collection' },
  { id: 'central-tendency', label: 'Central Tendency' },
  { id: 'dispersion', label: 'Dispersion' },
  { id: 'charts', label: 'Charts' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome2: React.FC = () => {
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
        text: 'The mean is sensitive to outliers, while the median is robust. For skewed data, the median is often a better measure of central tendency.',
      },
      {
        title: 'Pro Tip',
        text: 'Always visualise your data before calculating statistics. Charts like histograms and box plots can reveal patterns you might miss in raw numbers.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember "MEAN" as "Average", "MEDIAN" as "Middle", "MODE" as "Most frequent". For dispersion: "Range" (max‑min), "Variance" (average squared deviations), "SD" (square root of variance).',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t confuse a histogram with a bar chart. Histograms are for continuous data (intervals), while bar charts are for categorical data.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The mean is sensitive to outliers, while the median is robust. For skewed data, the median is often a better measure of central tendency.',
      },
      {
        title: 'Pro Tip',
        text: 'Always visualise your data before calculating statistics. Charts like histograms and box plots can reveal patterns you might miss in raw numbers.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember "MEAN" as "Average", "MEDIAN" as "Middle", "MODE" as "Most frequent". For dispersion: "Range" (max‑min), "Variance" (average squared deviations), "SD" (square root of variance).',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t confuse a histogram with a bar chart. Histograms are for continuous data (intervals), while bar charts are for categorical data.',
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

  // Sample data for charts
  const barData = [
    { label: "North", value: 120, color: "#3b82f6" },
    { label: "South", value: 80, color: "#f59e0b" },
    { label: "East", value: 100, color: "#10b981" },
    { label: "West", value: 90, color: "#ef4444" }
  ];
  const histogramData = [
    { range: "0-20", freq: 5 },
    { range: "20-40", freq: 12 },
    { range: "40-60", freq: 18 },
    { range: "60-80", freq: 10 },
    { range: "80-100", freq: 5 }
  ];

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <BarChart3 size={14} className="inline mr-1" /> RESEARCH METHODS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 2{' '}
            <span className="text-sky-300 font-bold italic">
              Simply Easy Statistics
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Sampling Methods, Data Collection, and Data Analysis — probability &amp; non‑probability sampling, central tendency, dispersion, and chart construction.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Sampling
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Activity size={14} className="inline mr-1" /> Data Collection
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <BarChart3 size={14} className="inline mr-1" /> Charts &amp; Analysis
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
                placeholder="Search for a concept, sampling, mean, chart..."
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
            {/* Section 1: Sampling Overview */}
            <div
              ref={(el) => {
                sectionRefs.current['sampling-overview'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Sampling Methods Overview
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Sampling is the process of selecting a subset of individuals or data points from a larger population to study. The goal is to choose a sample that is representative of the population, so that the findings can be generalised.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">Probability vs. Non‑Probability Sampling</h3>
                <table className="min-w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 border-b">Feature</th>
                      <th className="px-4 py-2 border-b">Probability Sampling</th>
                      <th className="px-4 py-2 border-b">Non‑Probability Sampling</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b"><td className="px-4 py-2 font-medium">Selection:</td><td className="px-4 py-2">Randomly selected</td><td className="px-4 py-2">Non‑randomly selected</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium">Chance:</td><td className="px-4 py-2">Every member has a known chance</td><td className="px-4 py-2">Unknown chance</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium">Bias:</td><td className="px-4 py-2">Reduces sampling bias</td><td className="px-4 py-2">More susceptible to bias</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium">Generalisation:</td><td className="px-4 py-2">Allows generalisation</td><td className="px-4 py-2">Limited generalisation</td></tr>
                    <tr><td className="px-4 py-2 font-medium">Use:</td><td className="px-4 py-2">Common in quantitative research</td><td className="px-4 py-2">Common in qualitative research</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Probability Sampling */}
            <div
              ref={(el) => {
                sectionRefs.current['probability-sampling'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Probability Sampling Methods
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Simple Random Sampling</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Every member has an equal chance of being selected. Like drawing names from a hat.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Stratified Sampling</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Divide population into subgroups (strata) and randomly sample from each.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Systematic Sampling</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Select every nth member after a random start. Efficient but can be biased.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Cluster Sampling</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Divide into clusters, randomly select clusters, and sample all members within chosen clusters.</p>
                </div>
              </div>
            </div>

            {/* Section 3: Non-Probability Sampling */}
            <div
              ref={(el) => {
                sectionRefs.current['non-probability-sampling'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Non‑Probability Sampling Methods
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400">Purposive Sampling</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Select participants based on specific criteria relevant to the research.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400">Quota Sampling</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Set quotas for subgroups and fill them using convenience or judgment.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">Snowball Sampling</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Existing participants refer new ones; useful for hard‑to‑reach populations.</p>
                </div>
              </div>
            </div>

            {/* Section 4: Data Collection */}
            <div
              ref={(el) => {
                sectionRefs.current['data-collection'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Data Collection Methods
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Interviews</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Direct interaction; structured or unstructured; rich qualitative data.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Questionnaires</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pre‑designed questions; cost‑effective; large samples; quantifiable.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Observation</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Systematic watching and recording; participant or non‑participant.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Document Analysis</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Review existing documents; historical context; unobtrusive.</p>
                </div>
              </div>
            </div>

            {/* Section 5: Central Tendency */}
            <div
              ref={(el) => {
                sectionRefs.current['central-tendency'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Measures of Central Tendency
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Mean</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">The average of all values. Formula: μ = Σx / n</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Example: Data {`{2, 4, 6, 8, 10}`} → Mean = 6</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Median</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">The middle value when data is ordered. For even number, average of two middle values.</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Example: Data {`{2, 4, 6, 8, 10}`} → Median = 6</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Mode</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">The most frequent value. Data can have multiple modes or none.</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Example: Data {`{2, 4, 6, 6, 8, 10}`} → Mode = 6</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6: Dispersion */}
            <div
              ref={(el) => {
                sectionRefs.current['dispersion'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Measures of Dispersion
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400">Range</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Difference between maximum and minimum values.</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Example: Data {`{2, 4, 6, 8, 10}`} → Range = 8</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400">Variance</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Average of squared differences from the mean.</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Formula: σ² = Σ(x - μ)² / n</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Example: Data {`{2, 4, 6, 8, 10}`} → Variance = 8</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400">Standard Deviation</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Square root of variance; in same units as data.</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Formula: σ = √Variance</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Example: Data {`{2, 4, 6, 8, 10}`} → SD ≈ 2.83</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 7: Charts */}
            <div
              ref={(el) => {
                sectionRefs.current['charts'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Chart Construction and Interpretation
              </h2>

              <div className="space-y-6">
                {/* Pie Chart */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Pie Chart</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Shows parts of a whole; each slice proportional to percentage.</p>
                  <div className="flex justify-center my-4">
                    <svg width="200" height="200" viewBox="0 0 200 200">
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#3b82f6" strokeWidth="40" strokeDasharray="126 502" transform="rotate(-90 100 100)" />
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#f59e0b" strokeWidth="40" strokeDasharray="84 502" transform="rotate(0 100 100)" strokeDashoffset="-126" />
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#10b981" strokeWidth="40" strokeDasharray="70 502" transform="rotate(0 100 100)" strokeDashoffset="-210" />
                      <text x="100" y="105" textAnchor="middle" fill={isDarkMode ? "#e2e8f0" : "#1e293b"} fontSize="14" fontWeight="bold">Sales</text>
                    </svg>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded"></span> Product A 45%</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded"></span> Product B 30%</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span> Product C 25%</span>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Bar Chart</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Compares values across categories; bar height represents value.</p>
                  <div className="flex justify-center items-end gap-4 h-48 my-4">
                    {barData.map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="w-10 bg-blue-500 rounded-t" style={{ height: `${item.value * 0.8}px` }}></div>
                        <span className="mt-1 text-xs">{item.label}</span>
                        <span className="text-xs">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Histogram */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Histogram</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">For continuous data; bars represent frequency in intervals (bins).</p>
                  <div className="flex justify-center items-end gap-3 h-48 my-4">
                    {histogramData.map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="w-10 bg-orange-500 rounded-t" style={{ height: `${item.freq * 8}px` }}></div>
                        <span className="mt-1 text-xs">{item.range}</span>
                        <span className="text-xs">{item.freq}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Frequency Polygon */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Frequency Polygon</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Line graph connecting midpoints of histogram bars; good for comparing distributions.</p>
                  <div className="flex justify-center my-4">
                    <svg width="350" height="200" viewBox="0 0 350 200">
                      <polyline points="30,160 100,110 170,60 240,110 310,160" fill="none" stroke="#3b82f6" strokeWidth="3" />
                      <polyline points="30,130 100,80 170,70 240,130 310,160" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
                      <text x="30" y="180" fill={isDarkMode ? "#94a3b8" : "#475569"} fontSize="10">0-20</text>
                      <text x="100" y="180" fill={isDarkMode ? "#94a3b8" : "#475569"} fontSize="10">20-40</text>
                      <text x="170" y="180" fill={isDarkMode ? "#94a3b8" : "#475569"} fontSize="10">40-60</text>
                      <text x="240" y="180" fill={isDarkMode ? "#94a3b8" : "#475569"} fontSize="10">60-80</text>
                      <text x="310" y="180" fill={isDarkMode ? "#94a3b8" : "#475569"} fontSize="10">80-100</text>
                      <text x="170" y="195" textAnchor="middle" fill={isDarkMode ? "#64748b" : "#64748b"} fontSize="10">Score Ranges</text>
                      <text x="10" y="20" fill={isDarkMode ? "#64748b" : "#64748b"} fontSize="10">Frequency</text>
                    </svg>
                  </div>
                  <div className="flex justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-blue-500"></span> Class A</span>
                    <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-red-500 border-t-2 border-dashed"></span> Class B</span>
                  </div>
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
                  💡 Stats Insight
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
                  <span>Sampling Types</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Chart Types</span>
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
                Statistics is the backbone of research. Understand the differences between sampling methods, choose appropriate data collection techniques, and correctly calculate and interpret measures of central tendency and dispersion. Visualising data with charts helps uncover patterns and communicate findings effectively.
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
                <strong className="text-white">Sampling</strong> – probability (random) methods reduce bias and allow generalisation; non‑probability methods are useful for exploratory or hard‑to‑reach populations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Data Collection</strong> – interviews, questionnaires, observation, and document analysis each have strengths and weaknesses.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Central Tendency</strong> – mean, median, and mode describe the centre of a dataset; choose based on data type and distribution.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Dispersion</strong> – range, variance, and standard deviation describe spread; standard deviation is most interpretable.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Charts</strong> – pie charts for proportions, bar charts for comparisons, histograms for continuous data distributions, and frequency polygons for comparing distributions.
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
            Sidemann Academic Registry • Statistics &amp; Research Methods 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;