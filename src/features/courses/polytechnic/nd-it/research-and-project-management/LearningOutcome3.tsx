import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Calculator,
  FileText,
  ClipboardList,
  Target,
  Eye,
  CheckCircle,
  Terminal,
  GitBranch,
  Bell,
  Activity,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  BookOpen,
  AlertCircle,
  Monitor,
  Smartphone,
  Cpu,
  Layers,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'discrete', label: 'Discrete Distributions' },
  { id: 'continuous', label: 'Continuous Distributions' },
  { id: 'hypothesis', label: 'Hypothesis Testing' },
  { id: 'z-test-mean', label: 'Z-test for Mean' },
  { id: 'z-test-proportion', label: 'Z-test for Proportion' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome3: React.FC = () => {
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
        text: 'The normal distribution is often called the "bell curve" because of its shape. It is widely used in natural and social sciences to represent real‑valued random variables.',
      },
      {
        title: 'Pro Tip',
        text: 'When performing hypothesis tests, always state your null and alternative hypotheses clearly. The p‑value is the probability of observing your data (or more extreme) if the null hypothesis is true.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three distributions: Binomial (count of successes in trials), Poisson (events in a time/space interval), Normal (continuous, bell‑shaped). The Z‑test uses the normal distribution.',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t confuse the standard deviation with the standard error. The standard error is the standard deviation of the sampling distribution of a statistic (e.g., mean), calculated as σ/√n.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The normal distribution is often called the "bell curve" because of its shape. It is widely used in natural and social sciences to represent real‑valued random variables.',
      },
      {
        title: 'Pro Tip',
        text: 'When performing hypothesis tests, always state your null and alternative hypotheses clearly. The p‑value is the probability of observing your data (or more extreme) if the null hypothesis is true.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three distributions: Binomial (count of successes in trials), Poisson (events in a time/space interval), Normal (continuous, bell‑shaped). The Z‑test uses the normal distribution.',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t confuse the standard deviation with the standard error. The standard error is the standard deviation of the sampling distribution of a statistic (e.g., mean), calculated as σ/√n.',
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <BarChart3 size={14} className="inline mr-1" /> LEARNING OUTCOME 3
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Probability Distributions &{' '}
            <span className="text-purple-300 font-bold italic">
              Hypothesis Testing
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master binomial, Poisson, normal distributions, Z‑tests for means and proportions, and hypothesis testing.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <BarChart3 size={14} className="inline mr-1" /> Distributions
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Hypothesis Testing
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Calculator size={14} className="inline mr-1" /> Z‑test
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
                placeholder="Search for a concept, binomial, p‑value..."
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
            {/* Section 1: Discrete Probability Distributions */}
            <div
              ref={(el) => {
                sectionRefs.current['discrete'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Discrete Probability Distributions
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Discrete distributions deal with countable outcomes (e.g., number of heads in coin flips, number of defective items). Two important ones are the Binomial and Poisson distributions.
                  </p>
</div>

              {/* Binomial */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Binomial Distribution</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Meaning:</strong> Probability of exactly k successes in n independent Bernoulli trials (two outcomes: success/failure) with probability p.
                </p>
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm overflow-x-auto">
                  <span className="text-gray-700 dark:text-gray-300">Formula: P(X = k) = C(n, k) * p<sup>k</sup> * (1-p)<sup>(n-k)</sup></span>
                </div>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Example:</strong> Probability of exactly 3 heads in 5 coin flips (p=0.5).</li>
                  <li>n=5, k=3, p=0.5 → P(X=3) = C(5,3)*(0.5)<sup>3</sup>*(0.5)<sup>2</sup> = 10 * 0.125 * 0.25 = 0.3125</li>
                </ul>
              </div>

              {/* Poisson */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Poisson Distribution</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Meaning:</strong> Probability of a given number of events occurring in a fixed interval of time/space, with a known average rate λ.
                </p>
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm overflow-x-auto">
                  <span className="text-gray-700 dark:text-gray-300">Formula: P(X = k) = (e<sup>-λ</sup> * λ<sup>k</sup>) / k!</span>
                </div>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Example:</strong> Average customers per hour = 10. Probability of exactly 15 customers in an hour.</li>
                  <li>λ=10, k=15 → P(X=15) = (e<sup>-10</sup> * 10<sup>15</sup>) / 15! ≈ 0.0347</li>
                </ul>
              </div>
            </div>

            {/* Section 2: Continuous Probability Distributions */}
            <div
              ref={(el) => {
                sectionRefs.current['continuous'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Continuous Probability Distributions
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Continuous distributions deal with outcomes that can take any value within a range (e.g., height, weight).
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Normal Distribution</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Meaning:</strong> Bell‑shaped, symmetrical distribution defined by mean (μ) and standard deviation (σ). Used extensively in natural and social sciences.
                </p>
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm overflow-x-auto">
                  <span className="text-gray-700 dark:text-gray-300">Z‑score: Z = (X - μ) / σ</span>
                </div>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Example:</strong> Women's heights: μ=64", σ=2". Probability that a woman is between 62" and 66".</li>
                  <li>Z(62) = (62-64)/2 = -1; Z(66) = (66-64)/2 = 1.</li>
                  <li>P(-1 &lt; Z &lt; 1) = P(Z &lt; 1) - P(Z &lt; -1) ≈ 0.8413 - 0.1587 = 0.6826</li>
                </ul>
              </div>
            </div>

            {/* Section 3: Hypothesis Testing */}
            <div
              ref={(el) => {
                sectionRefs.current['hypothesis'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Hypothesis Testing
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Hypothesis testing is a formal procedure for deciding between two competing claims about a population parameter.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Formulating Null and Alternative Hypotheses</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Null Hypothesis (H₀):</strong> Statement of no effect or no difference (status quo).</li>
                  <li><strong>Alternative Hypothesis (H₁):</strong> Statement that contradicts H₀ (researcher's belief).</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2"><strong>Example:</strong> Test if average women's height is different from 64".</p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>H₀: μ = 64</li>
                  <li>H₁: μ ≠ 64 (two‑tailed)</li>
                </ul>
              </div>
            </div>

            {/* Section 4: Z‑test for Mean */}
            <div
              ref={(el) => {
                sectionRefs.current['z-test-mean'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Z‑test on the Mean of a Population
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Use when population standard deviation (σ) is known or sample size is large (n ≥ 30).
                </p>
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm overflow-x-auto">
                  <span className="text-gray-700 dark:text-gray-300">Z = (x̄ - μ) / (σ / √n)</span>
                </div>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>State hypotheses.</li>
                  <li>Determine significance level (α).</li>
                  <li>Calculate Z‑score.</li>
                  <li>Find critical value(s) or p‑value.</li>
                  <li>Make decision (reject or fail to reject H₀).</li>
                  <li>State conclusion.</li>
                </ol>
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Example</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    n=50, x̄=65, σ=2.5. Test if μ ≠ 64 at α=0.05.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Z = (65-64) / (2.5/√50) ≈ 2.83. Critical values: ±1.96. Since 2.83 &gt; 1.96, reject H₀. Conclusion: evidence that average height differs from 64".
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Z‑test for Proportion */}
            <div
              ref={(el) => {
                sectionRefs.current['z-test-proportion'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Z‑test on Population Proportion
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm overflow-x-auto">
                  <span className="text-gray-700 dark:text-gray-300">Z = (p̂ - p₀) / √(p₀(1 - p₀) / n)</span>
                </div>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>p̂:</strong> sample proportion</li>
                  <li><strong>p₀:</strong> population proportion under H₀</li>
                  <li><strong>n:</strong> sample size</li>
                </ul>
                <div className="mt-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                  <p className="text-sm text-pink-800 dark:text-pink-300 font-medium">Example</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Test if more than 50% of voters support a candidate. n=200, 110 support (p̂=0.55). α=0.05, one‑tailed.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    H₀: p=0.5, H₁: p&gt;0.5. Z = (0.55-0.5)/√(0.5*0.5/200) ≈ 1.41. Critical value: 1.645. Since 1.41 &lt; 1.645, fail to reject H₀. No sufficient evidence that &gt;50% support.
                  </p>
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
                  <span>Distributions</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Test Types</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">2</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Hypothesis testing is a cornerstone of inferential statistics. Always define H₀ and H₁ clearly. Choose the correct test (Z‑test for means/proportions) and interpret the p‑value or critical value correctly. Understand the assumptions: normality, known σ, or large sample.
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
                <strong className="text-white">Binomial Distribution</strong> – models number of successes in n trials; formula uses combinations and powers of p.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Poisson Distribution</strong> – models count of events in a fixed interval; uses average rate λ.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Normal Distribution</strong> – bell‑shaped, continuous; use Z‑scores to find probabilities.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Hypothesis Testing</strong> – formal procedure with H₀, H₁, α; Z‑test for means (known σ) and proportions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Z‑test Formulas</strong> – mean: (x̄ - μ)/(σ/√n); proportion: (p̂ - p₀)/√(p₀(1‑p₀)/n).
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
            Sidemann Academic Registry • Probability &amp; Hypothesis Testing 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;