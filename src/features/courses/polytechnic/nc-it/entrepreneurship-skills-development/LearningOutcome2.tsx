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
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'macro', label: 'Macro' },
  { id: 'micro', label: 'Micro' },
  { id: 'growth', label: 'Growth' },
  { id: 'other', label: 'Other Strategies' },
  { id: 'bizplan', label: 'Business Plan' },
  { id: 'management', label: 'Management' },
  { id: 'roles', label: 'Roles' },
  { id: 'principles', label: 'Principles' },
  { id: 'motivation', label: 'Motivation' },
  { id: 'conclusion', label: 'Conclusion' },
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
        text: 'The informal sector in Zimbabwe employs about 75% of the working population – making it the backbone of the economy.',
      },
      {
        title: 'Pro Tip',
        text: 'Understanding PEST factors (Political, Economic, Social, Technological) helps entrepreneurs anticipate external changes and adapt proactively.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four functions of management: "Planning, Organizing, Leading, Controlling" – P-O-L-C.',
      },
      {
        title: 'Common Mistake',
        text: 'Many confuse "entrepreneurship" with "intrapreneurship". Entrepreneurship is starting a new venture; intrapreneurship is innovating within an existing organisation.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The informal sector in Zimbabwe employs about 75% of the working population – making it the backbone of the economy.',
      },
      {
        title: 'Pro Tip',
        text: 'Understanding PEST factors (Political, Economic, Social, Technological) helps entrepreneurs anticipate external changes and adapt proactively.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four functions of management: "Planning, Organizing, Leading, Controlling" – P-O-L-C.',
      },
      {
        title: 'Common Mistake',
        text: 'Many confuse "entrepreneurship" with "intrapreneurship". Entrepreneurship is starting a new venture; intrapreneurship is innovating within an existing organisation.',
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
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/30'
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
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Briefcase size={14} className="inline mr-1" /> BUSINESS ENVIRONMENT & MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 2{' '}
            <span className="text-sky-300 font-bold italic">
              Micro, Market & Macro Environments
            </span>
          </h1>
          <p className="text-lg text-emerald-100 max-w-2xl leading-relaxed">
            Master the entrepreneurial environment – understand macro and micro
            forces, growth strategies, management functions, and motivation
            theories. Build a solid foundation for business success.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-emerald-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <TrendingUp size={14} className="inline mr-1" /> Business growth
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Management
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-emerald-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, factor, or strategy..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-emerald-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-emerald-200" />
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
                Introduction: The Entrepreneurial Environment
              </h2>

              <div className="flex items-center gap-3 p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                  “Imagine planting a seed in a garden. That seed needs the right
                  conditions to grow—good soil, enough water, proper sunlight,
                  and protection from pests. The same is true for a business!”
                </p>
              </div>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                The <strong className="text-slate-900 dark:text-white">entrepreneurial environment</strong> encompasses all the factors that influence an entrepreneur’s activities and the success of their business. Just like our garden, these factors can help a business thrive or cause it to struggle. Some factors are positive and create opportunities, while others are negative and create challenges.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Understanding this environment is crucial because entrepreneurs don’t operate in a vacuum. They are part of a complex system of forces—some close to the business, some far away—that all affect their chances of success.
              </p>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">The entrepreneurial environment is categorised into two main levels:</p>
                <ul className="list-disc pl-6 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong className="text-slate-900 dark:text-white">Macro-Environment</strong> – The big, external forces that indirectly affect the business</li>
                  <li><strong className="text-slate-900 dark:text-white">Micro-Environment</strong> – The close, internal forces that directly affect the business</li>
                </ul>
              </div>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Let’s explore each of these in detail.
              </p>
            </div>

            {/* Macro-Environment */}
            <div
              ref={(el) => {
                sectionRefs.current['macro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Macro-Environment (External Environment)
              </h2>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-2">
                What is the Macro-Environment?
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                The <strong className="text-slate-900 dark:text-white">macro-environment</strong> consists of factors that indirectly affect business activities. These are forces that the entrepreneur cannot control but must understand and adapt to. Think of them as the weather and climate of the business world—you can’t change the weather, but you can prepare for it.
              </p>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <p className="text-sm font-medium text-slate-900 dark:text-white">The macro-environment includes two main categories:</p>
                <ul className="list-disc pl-6 text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <li><strong>PEST Analysis</strong> (Political, Economic, Social, and Technological factors)</li>
                  <li><strong>Natural Phenomena</strong> (disasters, weather patterns, and natural resources)</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-6">
                PEST Analysis
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                PEST analysis is a framework that helps entrepreneurs understand the big-picture forces affecting their business. Each letter represents a different category of external factors.
              </p>

              {/* Political */}
              <h4 className="text-base font-bold text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2 mt-6">
                <Flag size={18} /> Political Environment
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                The political environment refers to how government actions, policies, and political conditions affect businesses. Politics shapes the rules of the game that every business must play by.
              </p>

              <div className="space-y-3 mt-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400">Political Stability vs. Instability</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">When a country is politically stable, businesses can plan for the long term. Instability creates uncertainty and risk.</p>
                  <p className="text-sm italic text-slate-500 dark:text-slate-400 mt-1"><strong>Example:</strong> In a stable environment, an entrepreneur might confidently invest in a new factory, knowing rules won’t change dramatically.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Government Policies and Regulations</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Licensing, labour laws, tax policies, trade policies – all affect how businesses operate.</p>
                  <p className="text-sm italic text-slate-500 dark:text-slate-400 mt-1"><strong>Example:</strong> A new policy might open up a market or close it down.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-red-600 dark:text-red-400">Political Sanctions</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sanctions restrict trade, limit access to finance, create barriers, and affect the country’s reputation.</p>
                  <p className="text-sm italic text-slate-500 dark:text-slate-400 mt-1"><strong>Example:</strong> Zimbabwe has faced various sanctions, forcing entrepreneurs to become more self-reliant and innovative.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400">Economic Nationalism</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Policies favoring local businesses, restrictions on foreign ownership, tariffs on imports.</p>
                  <p className="text-sm italic text-slate-500 dark:text-slate-400 mt-1"><strong>Example:</strong> Economic nationalism can protect local entrepreneurs but may limit their ability to import needed materials.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-purple-600 dark:text-purple-400">Understanding Political Party Philosophies</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Different parties have different ideas about the economy. Smart entrepreneurs pay attention to politics and anticipate changes.</p>
                </div>
              </div>

              {/* Economic */}
              <h4 className="text-base font-bold text-green-600 dark:text-green-400 uppercase flex items-center gap-2 mt-6">
                <DollarSign size={18} /> Economic Environment
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                The economic environment consists of factors that affect people’s ability to buy and sell goods and services. These factors directly impact an entrepreneur’s decisions about pricing, investment, and growth.
              </p>

              <h5 className="text-sm font-bold text-slate-900 dark:text-white mt-3">Macroeconomic Factors</h5>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212] mt-2">
                <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-emerald-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Factor</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">What It Is</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">How It Affects Entrepreneurs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold">Inflation</td><td className="p-3">Rate at which prices increase</td><td className="p-3">High inflation means costs rise quickly; pricing becomes difficult</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Exchange Rates</td><td className="p-3">Value of local currency vs. foreign</td><td className="p-3">Affects cost of imports and value of exports</td></tr>
                    <tr><td className="p-3 font-bold">Interest Rates</td><td className="p-3">Cost of borrowing money</td><td className="p-3">High rates make loans expensive; low rates encourage investment</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Unemployment</td><td className="p-3">Percentage of people without jobs</td><td className="p-3">High unemployment means fewer customers with money to spend</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-3">
                <p className="text-sm text-slate-600 dark:text-slate-400 italic"><strong>Example:</strong> When inflation is high, an entrepreneur selling groceries must constantly adjust prices and may offer smaller quantities.</p>
              </div>

              <h5 className="text-sm font-bold text-slate-900 dark:text-white mt-3">Microeconomic Factors</h5>
              <ul className="list-disc pl-6 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li><strong>Consumer behaviour</strong> – How do customers in your industry make buying decisions?</li>
                <li><strong>Industry trends</strong> – What’s happening in your specific line of business?</li>
                <li><strong>Local market conditions</strong> – What’s unique about your immediate market?</li>
              </ul>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl mt-3">
                <h5 className="text-xs font-bold text-amber-700 dark:text-amber-400">Importance of Predicting Economic Trends</h5>
                <p className="text-sm text-slate-600 dark:text-slate-400">Successful entrepreneurs anticipate economic changes. They stock up before prices rise, delay investments when rates are high, and prepare for downturns.</p>
              </div>

              {/* Social */}
              <h4 className="text-base font-bold text-orange-600 dark:text-orange-400 uppercase flex items-center gap-2 mt-6">
                <Users size={18} /> Social Environment
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                The social environment consists of cultural values, beliefs, lifestyles, and demographic trends that shape how people live and what they want to buy.
              </p>

              <div className="space-y-3 mt-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-orange-600 dark:text-orange-400">Cultural Values and Beliefs</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Religious beliefs, family structures, attitudes toward work, views on gender roles – all influence consumer behaviour.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-orange-600 dark:text-orange-400">Social Classes</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Different income levels, education, and aspirations affect consumption patterns.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-orange-600 dark:text-orange-400">Religious Values</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Holy days, dietary rules, clothing norms, and celebrations all affect business.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-orange-600 dark:text-orange-400">Language and Communication</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Use language customers understand; avoid offence; choose appropriate channels.</p>
                </div>
              </div>

              {/* Technological */}
              <h4 className="text-base font-bold text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2 mt-6">
                <Zap size={18} /> Technological Environment
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                The technological environment consists of the tools, systems, and knowledge that affect how businesses operate and how people live.
              </p>

              <div className="space-y-3 mt-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400">Technological Advancements</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">New ways to produce, market, sell, and deliver – and threats from obsolescence.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400">Internet and Digital Technologies</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Online presence, e-commerce, digital marketing, online payments, cloud computing, remote work.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400">Impact on Production and Efficiency</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Automated equipment, computer systems, communication tools, inventory systems, customer databases.</p>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl">
                  <h5 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">The Importance of Keeping Up with Technological Trends</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Entrepreneurs must know what technology exists, invest wisely, and train themselves and employees.</p>
                </div>
              </div>

              {/* Natural Phenomena */}
              <h4 className="text-base font-bold text-teal-600 dark:text-teal-400 uppercase flex items-center gap-2 mt-6">
                <CloudRain size={18} /> 2.2. Natural Phenomena
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Natural phenomena are events and conditions in the physical environment that affect businesses – not created by humans.
              </p>

              <div className="space-y-3 mt-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-teal-600 dark:text-teal-400">Natural Disasters</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Fires, floods, earthquakes, cyclones – destroy inventory, equipment, premises.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-teal-600 dark:text-teal-400">Weather Patterns</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Droughts reduce agricultural production; good rains boost rural incomes; seasonal changes affect buying.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-teal-600 dark:text-teal-400">Availability of Natural Resources</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Farmers need land and water; miners need minerals; manufacturers need raw materials.</p>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                  <h5 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">The Need to Study These Trends</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Smart entrepreneurs study weather patterns, climate trends, disaster risks, and resource availability to prepare.</p>
                </div>
              </div>
            </div>

            {/* Micro-Environment */}
            <div
              ref={(el) => {
                sectionRefs.current['micro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Micro-Environment (Internal Environment)
              </h2>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-2">
                What is the Micro-Environment?
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                The <strong className="text-slate-900 dark:text-white">micro-environment</strong> consists of factors that directly affect business activities. These are forces close to the business that the entrepreneur has more influence over—though not complete control. Think of these as the immediate neighborhood of your business.
              </p>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <p className="text-sm font-medium text-slate-900 dark:text-white">The micro-environment includes key stakeholders who interact with the business daily:</p>
                <ul className="list-disc pl-6 text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <li>Employees</li>
                  <li>Providers of finance</li>
                  <li>Customers</li>
                  <li>Suppliers</li>
                  <li>Government</li>
                  <li>Competitors</li>
                </ul>
              </div>

              {/* Employees */}
              <h4 className="text-base font-bold text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2 mt-6">
                <Users size={18} /> Employees
              </h4>
              <div className="space-y-3 mt-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400">Importance of Employee Satisfaction and Well-Being</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Satisfied employees work harder, provide better service, stay longer, and speak positively about the business.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400">Providing Fair Working Conditions and Opportunities</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Fair pay, safe conditions, reasonable hours, growth opportunities, respectful treatment.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-purple-600 dark:text-purple-400">The Effect of Employee Morale on the Business</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">High morale = productivity, good customer service, innovation, retention, positive reputation.</p>
                </div>
              </div>

              {/* Providers of Finance */}
              <h4 className="text-base font-bold text-green-600 dark:text-green-400 uppercase flex items-center gap-2 mt-6">
                <DollarSign size={18} /> Providers of Finance
              </h4>
              <div className="space-y-3 mt-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-amber-600 dark:text-amber-400">Lending Rates and Financial Charges</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Higher interest means less profit; affects cash flow and investment decisions.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400">Return on Investment</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Entrepreneurs must understand what returns financiers expect.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400">Importance of Creditworthiness</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Good payment history, stability, profitability, collateral, and a solid business plan lead to easier and cheaper financing.</p>
                </div>
              </div>

              {/* Customers */}
              <h4 className="text-base font-bold text-orange-600 dark:text-orange-400 uppercase flex items-center gap-2 mt-6">
                <Users size={18} /> Customers
              </h4>
              <div className="space-y-3 mt-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-orange-600 dark:text-orange-400">Understanding Customer Needs and Wants</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Customers buy solutions, not products. Understand their problems, desires, and values.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400">Providing Value, Quality, and Good Service</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Value (price vs. benefit), quality (reliability), good service (friendly, helpful) create loyalty.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-purple-600 dark:text-purple-400">The Importance of Customer Retention</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Loyal customers buy more, cost less to serve, refer others, provide feedback, and stabilise the business.</p>
                </div>
              </div>

              {/* Suppliers */}
              <h4 className="text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2 mt-6">
                <Package size={18} /> Suppliers
              </h4>
              <div className="space-y-3 mt-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Reliability, Quality, and Pricing of Raw Materials</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">If a supplier is unreliable, quality poor, or prices too high, your business suffers.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400">Importance of Maintaining Good Supplier Relationships</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Good relationships bring priority treatment, better terms, advance notice, and problem-solving.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-amber-600 dark:text-amber-400">The Importance of Paying Suppliers on Time</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Paying on time builds trust; late payments can lead to supply cut-offs and damaged reputation.</p>
                </div>
              </div>

              {/* Government */}
              <h4 className="text-base font-bold text-red-600 dark:text-red-400 uppercase flex items-center gap-2 mt-6">
                <Landmark size={18} /> Government
              </h4>
              <div className="space-y-3 mt-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-red-600 dark:text-red-400">Compliance with Laws and Regulations</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Register the business, pay taxes, follow labour laws, obtain licences, meet health and safety standards.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400">Cooperation with Government Policies</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Participate in skills training, support local development, comply with indigenisation, etc.</p>
                </div>
              </div>

              {/* Competitors */}
              <h4 className="text-base font-bold text-pink-600 dark:text-pink-400 uppercase flex items-center gap-2 mt-6">
                <Swords size={18} /> Competitors
              </h4>
              <div className="space-y-3 mt-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-pink-600 dark:text-pink-400">Monitoring Competitor Activities</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Watch their pricing, technology, quality, service, marketing, and new products.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400">Maintaining Competitive Advantage</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Advantages could be lower price, better quality, better service, location, selection, or expertise.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400">How Competition Drives Innovation</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Competition forces businesses to improve, innovate, and work harder – benefiting customers.</p>
                </div>
              </div>
            </div>

            {/* Growth Strategies */}
            <div
              ref={(el) => {
                sectionRefs.current['growth'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Entrepreneurship Growth Strategies
              </h2>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Once a business is established, many entrepreneurs want to grow. <strong className="text-slate-900 dark:text-white">Growth strategies</strong> are the methods used to expand. The <strong className="text-slate-900 dark:text-white">Ansoff Product/Market Expansion Grid</strong> provides a useful framework.
              </p>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <p className="text-sm font-medium text-slate-900 dark:text-white">The grid considers two dimensions:</p>
                <ul className="list-disc pl-6 text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <li><strong>Products</strong> – What you sell (existing or new)</li>
                  <li><strong>Markets</strong> – Who you sell to (existing or new)</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-6">
                A. Intensive Growth Strategies
              </h3>

              <div className="space-y-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400">Market Penetration</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Increase market share with current products in current markets. Sell more to the same people.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <li>Promote increased product usage</li>
                    <li>Attract competitors’ customers</li>
                    <li>Convince non-users to try</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-sm font-bold text-green-600 dark:text-green-400">Market Development</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Find new markets for current products. Sell to new groups of customers.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <li>Identify potential new uses in current areas</li>
                    <li>Expand to new geographic areas</li>
                    <li>Seek new distribution channels</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400">Product Development</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Create new products for current markets. Give existing customers new things to buy.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <li>Add new features</li>
                    <li>Offer different quality levels</li>
                    <li>Pursue technological breakthroughs</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-6">
                B. Integrative Growth
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Backward Integration</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Acquire control of suppliers. Become your own supplier.</p>
                  <p className="text-sm italic text-slate-500 dark:text-slate-400">Example: Furniture maker buys a sawmill.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Forward Integration</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Acquire control of distributors. Become your own distributor.</p>
                  <p className="text-sm italic text-slate-500 dark:text-slate-400">Example: Manufacturer opens its own retail stores.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Horizontal Integration</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Acquire competitors. Combine operations.</p>
                  <p className="text-sm italic text-slate-500 dark:text-slate-400">Example: Supermarket chain buys another chain.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-6">
                C. Diversification Growth
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Entering new markets with new products – the riskiest strategy.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Concentric Diversification</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">New products with technological/marketing similarities.</p>
                  <p className="text-sm italic text-slate-500 dark:text-slate-400">Example: Computer company starts making software.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Horizontal Diversification</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Unrelated products but possibly same customers.</p>
                  <p className="text-sm italic text-slate-500 dark:text-slate-400">Example: Clothing maker starts producing food.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Conglomerate Diversification</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">No relationship with current business.</p>
                  <p className="text-sm italic text-slate-500 dark:text-slate-400">Example: Fax machine maker starts furniture production.</p>
                </div>
              </div>
            </div>

            {/* Other Strategies */}
            <div
              ref={(el) => {
                sectionRefs.current['other'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Other Entrepreneurship Strategies
              </h2>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-2">
                Franchising
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-white">Franchising</strong> is a system for distributing products or services through associated resellers called <strong>franchisees</strong>. The <strong>franchisor</strong> grants rights to use their brand, products, and systems.
              </p>

              <div className="space-y-3 mt-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400">Advantages to the Franchisor</h5>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>Increased distribution network</li>
                    <li>Shared operating costs</li>
                    <li>Shared marketing expenses</li>
                    <li>Enhanced local market acceptance</li>
                    <li>Maintained quality control</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400">Advantages to the Franchisee</h5>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>Reduced risk (proven model)</li>
                    <li>Pre-established promotion</li>
                    <li>Potential financial assistance</li>
                    <li>Credit availability</li>
                    <li>Decision-making assistance</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages to the Franchisor</h5>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>Challenges in controlling distant franchisees</li>
                    <li>Expenses for training and supervision</li>
                    <li>Risk of credit extensions</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages to the Franchisee</h5>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>Limited freedom in management</li>
                    <li>Obligatory purchases from franchisor</li>
                    <li>Expensive to get started</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-6">
                Buying an Established Business
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400">Advantages</h5>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>Existing goodwill and reputation</li>
                    <li>Proven location</li>
                    <li>Established customer base</li>
                    <li>Existing inventory and equipment</li>
                    <li>Known resources and capabilities</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages</h5>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>Inherited ill will or negative reputation</li>
                    <li>Potential inheritance of undesirable employees</li>
                    <li>Existing clientele may not align with target market</li>
                    <li>Difficulties in changing the firm’s image</li>
                    <li>Potential renovation expenses</li>
                    <li>Purchase price may be unsatisfactory</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Business Plan */}
            <div
              ref={(el) => {
                sectionRefs.current['bizplan'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Developing a Business Plan
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-2">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Objectives:</p>
                <ul className="list-disc pl-6 text-sm text-slate-600 dark:text-slate-400">
                  <li>Define a business idea</li>
                  <li>Generate feasible and profitable ideas</li>
                  <li>Develop a business proposal</li>
                  <li>Define a business plan</li>
                  <li>Discuss the elements of a business plan</li>
                  <li>Develop a viable business plan</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-6">
                Generation of a Business Idea
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">A business idea is a concise description of what the business will do. Ideas come from customer needs, wants, problems, weaknesses in existing products, gaps in the market, hobbies, skills.</p>

              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-4">Profitability and Feasibility</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400">Profitability</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Can this business make money?</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400">Feasibility</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Can this business actually work?</p>
                </div>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 mt-3">
                A <strong className="text-slate-900 dark:text-white">feasibility study</strong> examines market availability, competition, location, infrastructure, facilities, raw materials, machinery, labor, and other costs.
              </p>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-6">
                The Business Plan
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">A business plan is a written statement outlining the business’s mission, objectives, operations, finances, and management. It serves as a roadmap, a sales document, and a control tool.</p>

              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-4">Components of a Business Plan</h4>
              <div className="space-y-3 mt-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400">Cover Sheet</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Business name, address, contact, names of principals, date.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400">Table of Contents</h5>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-purple-600 dark:text-purple-400">Executive Summary</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Most important part – aims, strategies, financial projections, request, major achievements. Written last.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-amber-600 dark:text-amber-400">Description of the Business</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">History, owners, key managers, products/services, funding, current status, SWOT.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-red-600 dark:text-red-400">Ownership and Management Structure</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Owners, management team, organizational chart, qualifications, roles, employee policies.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-pink-600 dark:text-pink-400">Marketing Plan</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Target market, marketing mix, competitor analysis, market research.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Production/Operational Plan</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Production process, raw materials, suppliers, location, equipment, costing, quality control.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-teal-600 dark:text-teal-400">Financial Plan/Analysis</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Financial projections, trading, profit/loss, cash flow, balance sheet, break-even analysis, financing needs.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-cyan-600 dark:text-cyan-400">Milestone Schedule</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Timeline of key objectives and target dates.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-gray-600 dark:text-gray-400">Appendix</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Supporting documents: references, charts, resumes, market research, letters, leases, photos.</p>
                </div>
              </div>
            </div>

            {/* Business Management */}
            <div
              ref={(el) => {
                sectionRefs.current['management'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Business Management
              </h2>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-2">
                Business Definition
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">A <strong className="text-slate-900 dark:text-white">business</strong> is a social and/or commercial entity aimed at satisfying consumer needs and wants while generating profits for its owners.</p>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-6">
                Management Definition
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">Management is a social process involving efficient and effective planning and regulation to achieve specific goals. It involves deciding what to do and having others do it.</p>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-6">
                Manager Definition
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">Managers achieve goals through others. They make decisions, allocate resources, and direct activities.</p>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-6">
                Functions of Management
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Planning</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Deciding what to do</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-xs font-bold text-green-600 dark:text-green-400">Leading</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Directing and motivating</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Organising</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Arranging resources</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">Controlling</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Measuring and correcting</p>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">A. Planning</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Bridges the gap between current and desired states. Involves defining objectives, deciding actions, allocating resources, setting timeframes.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">B. Leading</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Actuating methods, staffing, supervising, motivating, communicating. Good leaders inspire and guide.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">C. Organising</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Brings together resources, develops productive relationships. Principles: unity of command, span of control, full authority and responsibility.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">D. Controlling</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Measures performance against standards, corrects deviations. Steps: establish standards, measure actual, compare, take corrective action.</p>
                </div>
              </div>
            </div>

            {/* Management Roles */}
            <div
              ref={(el) => {
                sectionRefs.current['roles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Management Roles (Mintzberg)
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300">Henry Mintzberg identified ten managerial roles categorised into three groups:</p>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-4">
                Interpersonal Roles
              </h3>
              <div className="space-y-3 mt-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400">a) Figurehead</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Symbolic head, performs legal/social duties (greeting visitors, signing documents).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400">b) Leader</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Motivates, staffs, trains subordinates (performance reviews, hiring, mentoring).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-purple-600 dark:text-purple-400">c) Liaison</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Maintains external contacts for information and favors (networking).</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-6">
                Informational Roles
              </h3>
              <div className="space-y-3 mt-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-amber-600 dark:text-amber-400">a) Monitor</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Seeks and receives information (reading reports, scanning environment).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-red-600 dark:text-red-400">b) Disseminator</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Transmits information to organizational members (meetings, memos).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-teal-600 dark:text-teal-400">c) Spokesperson</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Transmits information to external parties (media, board, customers).</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-6">
                Decisional Roles
              </h3>
              <div className="space-y-3 mt-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400">a) Entrepreneur</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Initiates projects, spots opportunities (strategy sessions, new initiatives).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-orange-600 dark:text-orange-400">b) Disturbance Handler</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Handles unexpected disturbances and crises (conflicts, complaints).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400">c) Resource Allocator</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Allocates resources and sets priorities (budgets, scheduling).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-purple-600 dark:text-purple-400">d) Negotiator</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Represents organisation in negotiations (contracts, partnerships).</p>
                </div>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">Managerial Requirements</h4>
              <ul className="list-disc pl-6 text-sm text-slate-600 dark:text-slate-400">
                <li>Managers need to be generalists and specialists.</li>
                <li>Formal authority is required.</li>
                <li>Managers are human and fallible.</li>
              </ul>

              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-4">Managerial Purposes</h4>
              <ul className="list-disc pl-6 text-sm text-slate-600 dark:text-slate-400">
                <li>Designing and maintaining stable systems</li>
                <li>Ensuring organisational satisfaction</li>
                <li>Boundary management</li>
              </ul>
            </div>

            {/* Principles of Management */}
            <div
              ref={(el) => {
                sectionRefs.current['principles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Principles of Management (Fayol)
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300">Henri Fayol’s 14 principles of management remain relevant today.</p>

              <div className="space-y-3 mt-4">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Division of Work</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Specialization increases efficiency.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Authority and Responsibility</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Authority to give orders comes with responsibility for results.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Discipline</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Employees must obey and respect rules.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Unity of Command</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Each employee receives orders from only one supervisor.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Unity of Direction</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">One manager, one plan for each objective.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Subordination of Individual Interest to General Interest</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Organisation’s interests come first.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">Remuneration</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Fair pay that satisfies both employee and organisation.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Centralization</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Balance between top and lower-level decisions.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-pink-600 dark:text-pink-400">Hierarchy (Scalar Chain)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Clear line of authority from top to bottom.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400">Order</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Everything and everyone in the right place.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Equity</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Fair and kind treatment of employees.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Stability of Staff</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Low turnover is good.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Initiative</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Employees should have freedom to conceive and execute plans.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Team Spirit (Esprit de Corps)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Unity is strength – promote harmony and teamwork.</p>
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div
              ref={(el) => {
                sectionRefs.current['motivation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Motivation
              </h2>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-2">
                Definition
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">Motivation is the driving force behind human behaviour in the workplace – the process of inspiring and encouraging employees to perform at their best.</p>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-6">
                Theories of Motivation
              </h3>

              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-4">Maslow’s Hierarchy of Needs</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300">Motivation is structured in a hierarchy: Physiological → Safety → Love/Social → Esteem → Self-Actualization. Lower needs must be satisfied before higher needs motivate.</p>

              <div className="space-y-3 mt-3">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h5 className="text-xs font-bold text-red-600 dark:text-red-400">Physiological</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Basic survival needs – food, water, shelter, clothing. Entrepreneurs must provide fair pay and comfortable working conditions.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h5 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Safety</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Security and protection – safe working conditions, job security, social security provisions.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400">Love/Social</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Belonging, affection, friendships – inclusive culture, teamwork, friendly supervisors.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h5 className="text-xs font-bold text-purple-600 dark:text-purple-400">Esteem</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Recognition, status, achievement – public acknowledgments, job titles, growth opportunities.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h5 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Self-Actualization</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Fulfilling potential, personal growth – challenging projects, innovation, career advancement.</p>
                </div>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6">Herzberg’s Two-Factor Theory</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-gray-600 dark:text-gray-400">Hygiene Factors (Dissatisfiers)</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Salary, job security, working conditions, supervision, company policies, interpersonal relations. Adequate factors prevent dissatisfaction but don’t motivate.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400">Motivator Factors (Satisfiers)</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Achievement, recognition, responsibility, the work itself, growth, advancement. These factors create genuine motivation.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-6">
                Importance of Motivating Employees
              </h3>
              <div className="space-y-3 mt-3">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Increased Productivity</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Motivated employees work harder and smarter.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Increased Efficiency and Effectiveness</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Streamlined processes, innovative solutions.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Good Corporate Image Building</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Positive word-of-mouth attracts customers and talent.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Increased Sales and Profits</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Excellent customer service leads to loyalty and revenue.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Good Customer Relations</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Attentive, responsive employees build strong relationships.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Promotes Team Spirit</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Collaboration and mutual support.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Promotes Entrepreneurship by Employees</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Innovation, creativity, initiative – employees think like owners.</p>
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div
              ref={(el) => {
                sectionRefs.current['conclusion'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Conclusion
              </h2>

              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                <h4 className="text-sm font-black uppercase text-emerald-700 dark:text-emerald-400 mb-4">Key Takeaways:</h4>
                <div className="space-y-3">
                  <div className="p-4 sm:p-5">
  <p className="text-sm text-slate-700 dark:text-slate-300"><strong>The macro-environment</strong> (PEST factors and natural phenomena) shapes business context – entrepreneurs must adapt.</p>
</div>
                  <div className="p-4 sm:p-5">
  <p className="text-sm text-slate-700 dark:text-slate-300"><strong>The micro-environment</strong> (employees, financiers, customers, suppliers, government, competitors) directly affects operations – entrepreneurs can manage these relationships.</p>
</div>
                  <div className="p-4 sm:p-5">
  <p className="text-sm text-slate-700 dark:text-slate-300"><strong>Growth strategies</strong> (market penetration, development, product development, diversification) provide a framework for expansion.</p>
</div>
                  <div className="p-4 sm:p-5">
  <p className="text-sm text-slate-700 dark:text-slate-300"><strong>Franchising and buying existing businesses</strong> are alternative paths with distinct pros and cons.</p>
</div>
                  <div className="p-4 sm:p-5">
  <p className="text-sm text-slate-700 dark:text-slate-300"><strong>A business plan</strong> is essential for clarifying ideas, securing funding, and guiding operations.</p>
</div>
                  <div className="p-4 sm:p-5">
  <p className="text-sm text-slate-700 dark:text-slate-300"><strong>Management</strong> involves planning, leading, organising, and controlling. Managers need technical, human, and conceptual skills.</p>
</div>
                  <div className="p-4 sm:p-5">
  <p className="text-sm text-slate-700 dark:text-slate-300"><strong>Motivation</strong> theories (Maslow, Herzberg) help entrepreneurs create environments where people thrive.</p>
</div>
                </div>
              </div>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mt-6">
                Entrepreneurship is challenging, but understanding these concepts gives entrepreneurs the tools they need to navigate challenges and build successful businesses that contribute to economic development and community well-being.
              </p>

              <div className="bg-emerald-700 text-white p-8 my-10 shadow-2xl rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="text-yellow-300" size={28} />
                  <h4 className="text-sm font-black uppercase text-yellow-300 tracking-wider">🇿🇼 Understand your environment. Manage your business. Build your future.</h4>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  💡 Business Tip
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-emerald-500 dark:text-emerald-400" />
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
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>PEST Factors</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Growth Strategies</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">3+</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                The entrepreneurial environment is dynamic. Stay informed, stay
                flexible, and keep learning – success comes from adapting to
                change and managing internal and external forces effectively.
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
          className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-emerald-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-emerald-300 font-bold">•</span>
              <span>
                <strong className="text-white">Entrepreneurial environment</strong> includes macro (external) and micro (internal) forces – both must be understood and managed.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-300 font-bold">•</span>
              <span>
                <strong className="text-white">PEST analysis</strong> helps entrepreneurs anticipate political, economic, social, and technological changes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-300 font-bold">•</span>
              <span>
                <strong className="text-white">Growth strategies</strong> (Ansoff’s grid) guide expansion – from market penetration to diversification.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-300 font-bold">•</span>
              <span>
                <strong className="text-white">Management</strong> involves planning, leading, organising, and controlling – and requires technical, human, and conceptual skills.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-300 font-bold">•</span>
              <span>
                <strong className="text-white">Motivation</strong> theories (Maslow, Herzberg) show that both hygiene factors and motivators are essential for a productive workforce.
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
            Sidemann Academic Registry • Entrepreneurship Skills Development – Business Environment & Management 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;
