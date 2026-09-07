import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Flag,
  Shield,
  Network,
  ShieldCheck,
  ArrowRight,
  Zap,
  Radio,
  Binary,
  Globe,
  Laptop,
  Users,
  Building2,
  Layers,
  Cpu,
  Server,
  Monitor,
  Info,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Wifi,
  Database,
  RefreshCw,
  Smartphone as Mobile,
  HardDrive,
  Search,
  ClipboardList,
  Settings,
  Activity,
  Box,
  Lock,
  BookOpen,
  Cable,
  ListChecks,
  ArrowLeft,
  Router,
  Repeat,
  Phone,
  Terminal,
  ChevronUp,
  Trophy,
  Target,
  GraduationCap,
  X,
  Sparkles,
  Briefcase,
  Award,
  BookMarked,
  Compass,
  DollarSign,
  Factory,
  FileText,
  Handshake,
  Heart,
  HeartHandshake,
  Home,
  Landmark,
  Map,
  MessageCircle,
  Package,
  Rocket,
  Scale,
  Star,
  Store,
  TreePine,
  TrendingUp,
  UserX,
  BookOpen as BookIcon,
  CloudRain,
  Swords,
  ShoppingBag,
  Tag,
  Truck,
  Megaphone,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Clipboard,
  BarChart,
  PieChart,
  Calculator,
  Percent,
  TrendingUp as TrendingUpIcon,
  Smile,
  ThumbsUp,
  Award as AwardIcon,
  Target as TargetIcon,
  GitBranch,
  Layers as LayersIcon,
  ArrowUpRight,
  AlertOctagon,
  Fingerprint,
  Gavel,
  Leaf,
  Cloud,
  Sun,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'risk-management', label: 'Risk Management' },
  { id: 'business-ethics', label: 'Business Ethics' },
  { id: 'social-responsibility', label: 'Social Responsibility' },
  { id: 'exam-tips', label: 'Tips' },
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
        text: 'Risk is not just about threats – it also includes opportunities. ISO 31000 defines risk as "the effect of uncertainty on objectives," which can be positive or negative.',
      },
      {
        title: 'Pro Tip',
        text: 'The 4Ts of risk treatment are: Terminate (avoid), Treat (reduce), Transfer (share), and Tolerate (retain). Choose the right strategy for each risk.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three levels of social responsibility as "P-S-S": Profit responsibility, Stakeholder responsibility, Societal responsibility.',
      },
      {
        title: 'Common Mistake',
        text: 'Ethics and law are not the same. Something can be legal but unethical (e.g., exploiting a loophole to cheat customers). Business ethics is about doing what is right, not just what is allowed.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Risk is not just about threats – it also includes opportunities. ISO 31000 defines risk as "the effect of uncertainty on objectives," which can be positive or negative.',
      },
      {
        title: 'Pro Tip',
        text: 'The 4Ts of risk treatment are: Terminate (avoid), Treat (reduce), Transfer (share), and Tolerate (retain). Choose the right strategy for each risk.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three levels of social responsibility as "P-S-S": Profit responsibility, Stakeholder responsibility, Societal responsibility.',
      },
      {
        title: 'Common Mistake',
        text: 'Ethics and law are not the same. Something can be legal but unethical (e.g., exploiting a loophole to cheat customers). Business ethics is about doing what is right, not just what is allowed.',
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
                ? 'bg-red-600 text-white shadow-md shadow-red-200 dark:shadow-red-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Shield size={14} className="inline mr-1" /> RISK, ETHICS & RESPONSIBILITY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 5{' '}
            <span className="text-rose-300 font-bold italic">
              Risk Management, Ethics &amp; Social Responsibility
            </span>
          </h1>
          <p className="text-lg text-red-100 max-w-2xl leading-relaxed">
            Master the principles of risk management, business ethics, and
            social responsibility. Build a business that is resilient, ethical,
            and contributes positively to society.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-red-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <AlertTriangle size={14} className="inline mr-1" /> Risk
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Gavel size={14} className="inline mr-1" /> Ethics
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Leaf size={14} className="inline mr-1" /> Responsibility
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-red-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, term, or principle..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-red-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-red-200" />
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
                Read This First
              </h2>

              <div className="p-4 sm:p-5 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Before you read a single word of content, remember this: <span className="font-bold underline">understanding beats memorising every single time.</span> These topics — Risk Management, Ethics, and Social Responsibility — are topics where the examiner wants to know if you <span className="italic">get the concept</span>, not if you can photocopy the textbook with your pen.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                    Risk management sounds very corporate and complicated. Ethics sounds very philosophical. But when you strip them back, they are both about very practical, very human things — protecting yourself from bad outcomes, and doing the right thing in business. You have experienced both of these concepts in your own life, even if you never called them by these names.
                  </p>
                  <p className="text-sm md:text-base bg-white dark:bg-[#121212] p-3 rounded-lg mt-3">
                    Read this notebook like you are having a conversation with someone who is explaining things properly. When you finish each section, close the notes and try to explain it back to yourself or to a friend. If you can do that — you are ready for any exam question on it.
                  </p>
</div>
            </div>

            {/* Risk Management */}
            <div
              ref={(el) => {
                sectionRefs.current['risk-management'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Risk Management
              </h2>

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mt-2">
                What Is Risk?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                The ISO 31000 definition says risk is <span className="font-bold italic">"the effect of uncertainty on objectives."</span> That is a very formal way of saying something quite simple:
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                <span className="font-bold">Risk is anything that might happen — good or bad — that could affect whether you achieve what you are trying to achieve.</span>
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                The key word is <span className="font-bold">uncertainty</span>. Risk exists because we cannot predict the future perfectly. Notice also that risk can be <span className="font-bold">positive or negative</span>. Most people think of risk as only a bad thing, but in a business sense, risk also includes the possibility of unexpected opportunities.
              </p>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 mt-4">
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400">🟢 Simple Explanation</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Think of risk this way: you are walking to school and it looks cloudy. There is a RISK of rain — meaning it might rain and you get soaked (bad outcome), or it might not rain and you arrive dry (fine outcome). You cannot know for sure. Risk management would say: carry an umbrella just in case. You are not predicting rain with certainty — you are <span className="font-bold">managing uncertainty.</span></p>
              </div>

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mt-6">
                What Is Risk Management?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Risk management is the <span className="font-bold">organised, systematic process of identifying what could go wrong, figuring out how likely it is and how bad it would be, and then doing something about it before it happens.</span>
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                The textbook definition says it is: <span className="italic">"the systematic process of identifying, assessing, and prioritizing risks, followed by the coordinated and economical application of resources to minimize, monitor, and control the probability and/or impact of adverse events."</span>
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                <li><span className="font-bold">Systematic</span> – you do not worry randomly; you follow a proper method.</li>
                <li><span className="font-bold">Identify</span> – find all the risks — what could possibly go wrong?</li>
                <li><span className="font-bold">Assess and prioritise</span> – figure out which risks matter most.</li>
                <li><span className="font-bold">Application of resources</span> – use money, time, staff, and systems to protect against risks.</li>
              </ul>

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mt-6">
                Sources of Risk
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-blue-600 dark:text-blue-400">Financial markets</span> – exchange rates, interest rates, inflation.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-green-600 dark:text-green-400">Project failures</span> – budget overruns, delays, poor outcomes.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-red-600 dark:text-red-400">Legal liabilities</span> – lawsuits, regulatory penalties.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-purple-600 dark:text-purple-400">Credit risk</span> – customers failing to pay.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-orange-600 dark:text-orange-400">Accidents and natural disasters</span> – fires, floods, earthquakes.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-600 dark:text-slate-400">Human threats</span> – theft, fraud, cyberattacks.
                </div>
              </div>

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mt-6">
                Intangible Risk Management
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Intangible risks are risks that are almost certain to happen — the notes say they have a "100% probability of occurrence" — but they often go unmanaged because they are hard to see and measure.
              </p>
              <div className="space-y-2 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Knowledge risk</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Risk that people in the business do not have the knowledge they need to do their jobs properly.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Relationship risk</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Risk that relationships within the team or with partners are not working effectively.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Process-engagement risk</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Risk that the business's operational procedures are not being followed or are not working properly.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mt-6">
                The Risk Management Process
              </h3>
              <div className="space-y-2 mt-2">
                <div className="flex gap-3 items-start p-2 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">1</span>
                  <div><span className="font-bold">Identify, Characterize, and Assess Threats</span> – systematically look at everything that could go wrong.</div>
                </div>
                <div className="flex gap-3 items-start p-2 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">2</span>
                  <div><span className="font-bold">Assess Vulnerability</span> – how exposed is your business to each threat?</div>
                </div>
                <div className="flex gap-3 items-start p-2 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">3</span>
                  <div><span className="font-bold">Determine Risk</span> – Risk = Probability × Impact.</div>
                </div>
                <div className="flex gap-3 items-start p-2 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">4</span>
                  <div><span className="font-bold">Identify Risk Reduction Measures</span> – for each significant risk, develop strategies.</div>
                </div>
                <div className="flex gap-3 items-start p-2 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">5</span>
                  <div><span className="font-bold">Prioritize Risk Reduction Measures</span> – implement the most important first.</div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mt-6">
                Four Ways to Treat Risk (4Ts)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">RISK AVOIDANCE</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Don't do the risky thing. Sidestep the risk entirely.</p>
                  <p className="text-sm italic text-slate-500 dark:text-slate-400">Example: not buying a property to avoid legal liability.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">RISK REDUCTION</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Take steps to lower probability or impact.</p>
                  <p className="text-sm italic text-slate-500 dark:text-slate-400">Example: installing sprinklers to reduce fire damage.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">RISK SHARING (TRANSFER)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Let someone else carry part of the risk.</p>
                  <p className="text-sm italic text-slate-500 dark:text-slate-400">Example: insurance, joint ventures.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">RISK RETENTION</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Accept and live with the risk.</p>
                  <p className="text-sm italic text-slate-500 dark:text-slate-400">Example: small risks where the cost of managing them exceeds the likely loss.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mt-6">
                ISO 31000 Principles of Risk Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Create Value</div>
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Integral Part of Processes</div>
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Part of Decision Making</div>
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Address Uncertainty</div>
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Systematic and Structured</div>
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Based on Best Available Information</div>
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Tailored</div>
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Take Into Account Human Factors</div>
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Transparent and Inclusive</div>
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Dynamic and Responsive</div>
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Capable of Continual Improvement</div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">If asked about the risk management process, remember: <span className="font-bold">Identify → Assess → Prioritize → Mitigate → Monitor.</span> You can remember this as "I Always Prioritise Managing My risks."</p>
              </div>
            </div>

            {/* Business Ethics */}
            <div
              ref={(el) => {
                sectionRefs.current['business-ethics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Business Ethics
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                What Is Ethics?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Ethics is the study of <span className="font-bold">right and wrong behaviour</span> — how we should act, what we should value, and how we should treat others. It is about the moral principles that guide decision-making not just in personal life, but in professional and business life too.
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                The notes make a very important point: business ethics is NOT separate from general human ethics. An entrepreneur or manager is still a human being with moral responsibilities. The fact that you are in a business context does not suspend your ethical obligations or create a special zone where the normal rules of right and wrong do not apply.
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                <span className="font-bold">Ethics and law are not the same thing.</span> Something can be legal but unethical, and something can be ethical but technically illegal. The law sets the minimum standard — ethics asks what the RIGHT thing to do is, not just what you are legally allowed to do.
              </p>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 mt-4">
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400">🟢 Simple Explanation</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Ethics is basically your inner moral compass telling you what is right and wrong. In business, it means asking yourself not just "can I do this?" (is it legal?) but "should I do this?" (is it right?). A business that only asks "is it legal?" and not "is it right?" is a business that will eventually cause harm.</p>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                Ethics vs Social Responsibility
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Business Ethics</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Focuses on the moral behaviour of the business and its people in their business dealings — honesty, fairness, transparency.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Social Responsibility</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Broader – about the impact the business has on society as a whole, including environment and community.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                Ethical Issues in Business
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Product Issues</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Honesty regarding safety, quality, and value. The fundamental obligation is to not harm users.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Promotion Issues</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Extortion, bribery, grease money, gifts — ethical questions about when persuasion becomes manipulation.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Pricing Issues</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Price-fixing, predatory pricing, failure to disclose full price.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Place (Distribution) Issues</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Unfair practices toward distributors, unreasonable demands, abrupt terminations.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                AMA Code of Ethics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Responsibility for actions and consequences</div>
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Adherence to laws and regulations</div>
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Honesty with all stakeholders</div>
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Avoiding conflicts of interest</div>
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Safe and fit products</div>
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Truthful communications</div>
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Good faith obligations</div>
                <div className="p-2 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">Equitable grievance resolution</div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Prohibits price fixing, predatory pricing, deceptive research practices, and manipulation or coercion of customers.</p>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">If asked about ethical issues in marketing, structure your answer by the marketing mix: Product ethics, Promotion ethics, Pricing ethics, and Distribution (Place) ethics. One clear example for each category makes your answer much stronger.</p>
              </div>
            </div>

            {/* Social Responsibility */}
            <div
              ref={(el) => {
                sectionRefs.current['social-responsibility'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Social Responsibility
              </h2>

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight mt-2">
                What Is Social Responsibility?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Social responsibility means that businesses, as organisations operating within society, have <span className="font-bold">obligations to that society that go beyond just making profit.</span> A business does not exist in isolation — it uses public infrastructure, employs community members, affects the environment, and shapes the social fabric of the communities around it.
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                This does not mean businesses cannot make profits — profit is necessary for survival and growth. Social responsibility is not anti-profit. It is about recognising that how you make those profits matters.
              </p>

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight mt-6">
                Three Levels of Social Responsibility
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">PROFIT RESPONSIBILITY</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Maximising profit within legal and ethical boundaries. Creates employment, pays taxes, contributes to economic growth.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">STAKEHOLDER RESPONSIBILITY</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Expands concern to employees, customers, suppliers, local communities, creditors – all groups affected by business decisions.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">SOCIETAL RESPONSIBILITY</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Broadest – general public and wider environment. Environmental protection, community development, contributing positively to human welfare.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight mt-6">
                Strategies for Social Responsibility
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400">Reactive Strategy</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Only addresses issues when forced – by crisis, media, or regulators.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Defensive Strategy</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Acknowledges issues but tries to minimise obligations through legal arguments or lobbying.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Accommodation Strategy</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Acknowledges problems and makes changes when pressured – not leading, not resisting.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Proactive Strategy</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Anticipates issues and takes voluntary action before being pressured – the gold standard.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight mt-6">
                Why Businesses Choose to Be Socially Responsible
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Moral obligation</span> – it is simply the right thing to do.</li>
                <li><span className="font-bold">Leading by example</span> – respected businesses influence others.</li>
                <li><span className="font-bold">Enlightened self-interest</span> – good for business in the long run.</li>
                <li><span className="font-bold">Public relations benefits</span> – positive publicity.</li>
                <li><span className="font-bold">Self-regulation to avoid legislation</span> – if industries police themselves, governments are less likely to impose heavy-handed regulation.</li>
              </ul>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">The three levels (Profit, Stakeholder, Societal) and the four strategies (Reactive, Defensive, Accommodating, Proactive) are very examinable. Know them in order from lowest to highest standard. Be able to explain each with a real-world example.</p>
              </div>
            </div>

            {/* Final Exam Tips */}
            <div
              ref={(el) => {
                sectionRefs.current['exam-tips'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Final Exam Tips
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">📌 On Risk Management questions</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The examiner wants to see that you understand risk management as a PROCESS, not just a list of risk types. Show the sequence: identify → assess → prioritise → treat → monitor. For the four risk treatment options, an example for each one dramatically improves your answer.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">📌 On Ethics questions</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The classic structure is: define ethics, explain the specific ethical issue asked about, give a real example, and then explain what the ethical course of action would be. Never just define – always show you can apply the concept.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">📌 On Social Responsibility questions</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The three levels (Profit, Stakeholder, Societal) and the four strategies (Reactive, Defensive, Accommodating, Proactive) are very examinable. Know them in order from lowest to highest standard. Be able to explain each with a real-world example.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-purple-600 dark:text-purple-400">📌 Connect the topics</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Risk Management, Ethics, and Social Responsibility are all connected. Unethical behaviour creates legal and reputational RISKS. Failing social responsibility creates regulatory and community relations RISKS. Show that connection in your answers when it is relevant – it demonstrates deeper thinking.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Understand it. Own it. Go write that exam with confidence. 🎓</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-red-100 dark:border-red-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400">
                  💡 Ethics & Risk Tip
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-red-500 dark:text-red-400" />
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
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Risk Treatment Options</span>
                  <span className="font-bold text-red-600 dark:text-red-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Social Responsibility Levels</span>
                  <span className="font-bold text-red-600 dark:text-red-400">3</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Ethics and risk management are not constraints on business – they
                are foundations for sustainable success. A business that manages
                risk well and acts ethically builds trust, reputation, and
                resilience that competitors without those values cannot match.
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
          className="w-12 h-12 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-red-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>
                <strong className="text-white">Risk management</strong> is a systematic process of identifying, assessing, prioritising, and treating risks (4Ts: Avoid, Reduce, Transfer, Retain).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>
                <strong className="text-white">Business ethics</strong> is about distinguishing right from wrong in business decisions. Ethics goes beyond the law and applies to product, price, promotion, and distribution.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>
                <strong className="text-white">Social responsibility</strong> has three levels: Profit (economic), Stakeholder (legal/ethical), and Societal (discretionary/philanthropic).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>
                <strong className="text-white">Strategies</strong> for social responsibility range from Reactive (doing nothing) to Proactive (leading the way).
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Footer Branding ────────────────────────────────────────────── */}
      <footer className="mx-auto px-[5px] sm:px-6 md:px-8 pb-8 text-center opacity-30">
        <div className="inline-flex items-center gap-2">
          <BookIcon size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">
            Sidemann Academic Registry • Entrepreneurship Skills Development – Risk, Ethics & Responsibility 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;
