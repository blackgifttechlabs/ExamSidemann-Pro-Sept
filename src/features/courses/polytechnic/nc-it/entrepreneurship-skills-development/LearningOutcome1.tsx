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
  Clock,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'economic', label: 'Economy' },
  { id: 'entrepreneur', label: 'Entrepreneur' },
  { id: 'entrepreneurship', label: 'Entrepreneurship' },
  { id: 'patriotism', label: 'Patriotism' },
  { id: 'vs-intrapreneurship', label: 'vs Intrapreneur' },
  { id: 'characteristics', label: 'Traits' },
  { id: 'sme-roles', label: 'SMEs' },
  { id: 'government', label: 'Government' },
  { id: 'conclusion', label: 'Conclusion' },
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
        text: 'Zimbabwe’s informal sector employs about 75% of the working population – making it the backbone of the economy.',
      },
      {
        title: 'Pro Tip',
        text: 'Patriotic entrepreneurs focus on creating jobs, paying fair taxes, and producing quality goods – they build the nation while building their business.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the characteristics of an entrepreneur with the acronym "A-C-O-R-S": Action-oriented, Calculated risk, Opportunity seeking, Resourceful, Self-motivated.',
      },
      {
        title: 'Common Mistake',
        text: 'Many confuse entrepreneurship with intrapreneurship. Entrepreneurship is starting a new venture; intrapreneurship is innovating inside an existing company.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Zimbabwe’s informal sector employs about 75% of the working population – making it the backbone of the economy.',
      },
      {
        title: 'Pro Tip',
        text: 'Patriotic entrepreneurs focus on creating jobs, paying fair taxes, and producing quality goods – they build the nation while building their business.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the characteristics of an entrepreneur with the acronym "A-C-O-R-S": Action-oriented, Calculated risk, Opportunity seeking, Resourceful, Self-motivated.',
      },
      {
        title: 'Common Mistake',
        text: 'Many confuse entrepreneurship with intrapreneurship. Entrepreneurship is starting a new venture; intrapreneurship is innovating inside an existing company.',
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
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
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
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Briefcase size={14} className="inline mr-1" /> ENTREPRENEURSHIP & PATRIOTISM
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 1{' '}
            <span className="text-emerald-300 font-bold italic">
              Building Zimbabwe through Enterprise
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Understand the role of entrepreneurship in economic development,
            the characteristics of successful entrepreneurs, and how patriotic
            business practices can strengthen Zimbabwe’s economy.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Flag size={14} className="inline mr-1" /> Patriotism
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> SME roles
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-indigo-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, characteristic, or initiative..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-indigo-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-indigo-200" />
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
                Introduction: Entrepreneurship &amp; Patriotism
              </h2>

              <div className="flex items-center gap-3 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                  “Imagine a country where people don’t just work for others,
                  but create their own opportunities, build their own businesses,
                  and in doing so, help their nation grow stronger.”
                </p>
              </div>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-white">Entrepreneurship</strong> is a vital force
                in any nation’s economy, and Zimbabwe is no exception. When
                entrepreneurs operate with <strong className="text-slate-900 dark:text-white">patriotism</strong>—
                love and loyal support for their country—they become powerful
                agents of positive change. Patriotic entrepreneurs play a
                crucial role in economic stabilization and revitalization,
                especially in challenging times.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                This resource explores the deep connection between entrepreneurship
                and national development, particularly within Zimbabwe’s unique
                economic context. By understanding this relationship, you’ll see
                how starting a business isn’t just about making money—it’s about
                building a nation.
              </p>
            </div>

            {/* Economic Landscape */}
            <div
              ref={(el) => {
                sectionRefs.current['economic'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Economic Landscape of Zimbabwe
              </h2>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Before we understand entrepreneurship in Zimbabwe, we need to
                understand the ground where it grows—the country’s economy.
              </p>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                The Informal Sector: Zimbabwe’s Economic Backbone
              </h3>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                When we talk about the economy, we often think of big companies,
                factories, and office buildings. But in Zimbabwe, the real
                economic story happens in markets, homes, and streets—this is
                the <strong className="text-slate-900 dark:text-white">informal sector</strong>.
              </p>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">What is the Informal Sector?</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                  The informal sector refers to economic activities that operate
                  outside formal government regulation and taxation. These
                  businesses aren’t registered with authorities, don’t pay formal
                  taxes, and don’t follow official labour laws. But don’t let
                  the word “informal” fool you—this sector is massive and powerful.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-2">
                  <TrendingUp size={16} /> The Numbers Tell the Story
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <li><strong>Approximately 3,000,000 people</strong> are employed in Zimbabwe’s informal sector</li>
                  <li>This represents about <strong>75% of the country’s employed population</strong></li>
                  <li>Only the remaining <strong>25%</strong> works in formal sector jobs</li>
                </ul>
                <p className="text-sm italic text-slate-500 dark:text-slate-400 mt-2">
                  Think about that: For every one person working a formal job,
                  three people are working in the informal sector.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Economic Significance of Entrepreneurs
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Entrepreneurs are critical to Zimbabwe’s economic stability in
                several ways:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Users size={14} /> 1. Employment Creation
                  </h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">With 75% employed in informal sector, entrepreneurs are the biggest job creators.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <DollarSign size={14} /> 2. Foreign Currency Earnings
                  </h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Cross‑border traders bring foreign currency into Zimbabwe.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Package size={14} /> 3. Goods and Services Provision
                  </h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Entrepreneurs fill gaps in the market, especially in rural areas.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Shield size={14} /> 4. Economic Resilience
                  </h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The informal sector often keeps going when formal economy struggles.</p>
                </div>
              </div>
            </div>

            {/* Understanding the Entrepreneur */}
            <div
              ref={(el) => {
                sectionRefs.current['entrepreneur'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Understanding the Entrepreneur
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-2">
                Who Is an Entrepreneur?
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-2">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  An <strong className="text-slate-900 dark:text-white">entrepreneur</strong> is an individual
                  who initiates and manages a business venture to profitably
                  address identified needs or wants. They organise and manage
                  commercial undertakings, often involving calculated risks.
                </p>
                <p className="text-sm italic text-slate-500 dark:text-slate-400 mt-1">
                  Think of it this way: An entrepreneur sees a problem or need
                  and says, “I can solve that—and make a living doing it.”
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Real-Life Examples
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400">Street Vendor</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A woman sells vegetables from her home, providing convenient access to fresh produce.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400">Hairdresser</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A young man offers affordable braiding services from his home, meeting a local demand.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-purple-600 dark:text-purple-400">Cross‑Border Trader</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A woman imports scarce goods from South Africa and sells them in Zimbabwe.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Key Characteristics
              </h3>
              <div className="space-y-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Target size={14} /> 1. Opportunity Identification
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Entrepreneurs see opportunities where others see nothing. They ask: “What’s missing? What could be better?”</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Package size={14} /> 2. Resource Mobilisation
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">They gather land, capital, labour, and materials to turn ideas into reality.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <AlertTriangle size={14} /> 3. Calculated Risk-Taking
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">They take risks based on research and planning, not recklessness.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Heart size={14} /> 4. Strong Belief
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">They believe in their vision and persist through challenges.</p>
                </div>
              </div>
            </div>

            {/* Understanding Entrepreneurship */}
            <div
              ref={(el) => {
                sectionRefs.current['entrepreneurship'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                What Is Entrepreneurship?
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">
                Varied Definitions, Common Theme
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Different experts define entrepreneurship in different words,
                but they all describe the same essential activity.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Appleby (1989)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                    “The process of bringing together creative and innovative
                    ideas and coupling these with management and organisational
                    skills in order to combine people, money and other resources
                    to meet an identified need and thereby create wealth.”
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Stoner &amp; Freeman (1992)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                    “Seemingly a discontinuous process of combining resources
                    to produce new goods and services.”
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                The Essence of Entrepreneurship
              </h3>
              <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-amber-300 dark:border-amber-700 text-center">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium">
                  At its heart, entrepreneurship is the act of creating and
                  growing a business by combining resources in innovative ways
                  to meet people’s needs and make a profit.
                </p>
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg font-mono text-xs">
                  <p className="text-amber-600 dark:text-amber-400 font-bold">Formula:</p>
                  <p className="text-slate-700 dark:text-slate-300 mt-1">
                    Innovative Idea + Resources + Action = Business that Serves People + Makes Money
                  </p>
                </div>
              </div>
            </div>

            {/* Entrepreneurship and Patriotism */}
            <div
              ref={(el) => {
                sectionRefs.current['patriotism'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Entrepreneurship &amp; Patriotism
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">
                What Is Patriotism?
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-white">Patriotism</strong> is loyal support of
                one’s nation. In business, it means:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                <li>Ethical business practices</li>
                <li>Contributing to national well‑being</li>
                <li>Considering the impact of business decisions on the country</li>
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                The Patriotic Entrepreneur
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                When entrepreneurs operate with patriotism, they become
                nation‑builders. Here’s how:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Users size={14} /> 1. Job Creation with Dignity
                  </h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Fair wages, safe conditions, respect for workers.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <DollarSign size={14} /> 2. Fair Pricing
                  </h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Reasonable prices, no exploitation.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Award size={14} /> 3. Quality Products
                  </h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">High standards, pride in what they produce.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <TreePine size={14} /> 4. Resource Conservation
                  </h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Responsible use of resources, sustainability.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Handshake size={14} /> 5. Ethical Practices
                  </h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Honesty, no bribery, social responsibility.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <FileText size={14} /> 6. Tax Compliance
                  </h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Paying taxes to fund schools, hospitals, roads.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Factory size={14} /> 7. Supporting Large Firms
                  </h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">SMEs act as subcontractors, creating a healthy ecosystem.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2">
                    <Heart size={14} /> 8. Social Impact
                  </h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Reducing crime, giving young people purpose.</p>
                </div>
              </div>
            </div>

            {/* Entrepreneurship vs Intrapreneurship */}
            <div
              ref={(el) => {
                sectionRefs.current['vs-intrapreneurship'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Entrepreneurship vs Intrapreneurship
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2">
                    <Rocket size={20} /> Entrepreneurship
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>What it is:</strong> Initiating and managing a
                    <strong> new </strong> business venture.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Creates new entities from scratch</li>
                    <li>Entrepreneur takes external risks</li>
                    <li>Entrepreneur is the originator and owner (usually)</li>
                  </ul>
                  <p className="text-sm italic text-slate-500 dark:text-slate-400 mt-2">
                    Example: A woman starts her own catering company.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase flex items-center gap-2">
                    <Building2 size={20} /> Intrapreneurship
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>What it is:</strong> Innovation and creativity within
                    an <strong>existing</strong> organisation.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Employees take on entrepreneurial roles</li>
                    <li>Identify opportunities and initiate changes</li>
                    <li>Organisation provides resources</li>
                  </ul>
                  <p className="text-sm italic text-slate-500 dark:text-slate-400 mt-2">
                    Example: An employee develops a new product line within a company.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Comparison Table
              </h3>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212] mt-2">
                <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Aspect</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Entrepreneur</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Intrapreneur</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold">Where they work</td><td className="p-3">Starts own business</td><td className="p-3">Works within existing organisation</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Risk</td><td className="p-3">Personal financial risk</td><td className="p-3">Organisation bears most risk</td></tr>
                    <tr><td className="p-3 font-bold">Resources</td><td className="p-3">Must find/raise own resources</td><td className="p-3">Uses organisation’s resources</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Rewards</td><td className="p-3">Keeps all profits</td><td className="p-3">Receives salary, bonus, recognition</td></tr>
                    <tr><td className="p-3 font-bold">Freedom</td><td className="p-3">Complete independence</td><td className="p-3">Must work within organisational constraints</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Entrepreneurial Characteristics */}
            <div
              ref={(el) => {
                sectionRefs.current['characteristics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Entrepreneurial Characteristics in Detail
              </h2>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                An entrepreneur’s success is heavily influenced by their personal
                characteristics. Below are the key traits that distinguish
                successful entrepreneurs.
              </p>

              <div className="space-y-4 mt-4">
                {[
                  { icon: Zap, title: 'Action-Oriented', desc: 'Focus on immediate results and taking initiative. They learn by doing.' },
                  { icon: Trophy, title: 'Success-Oriented & Optimistic', desc: 'Positive mindset, believe success is possible, bounce back from setbacks.' },
                  { icon: Target, title: 'Opportunity Seeking', desc: 'Identify and act on new business opportunities that others miss.' },
                  { icon: AlertTriangle, title: 'Moderate Risk-Taking', desc: 'Take calculated, balanced risks – not reckless gambles.' },
                  { icon: Target, title: 'Goal Setting (SMART)', desc: 'Set Specific, Measurable, Achievable, Realistic, Time-bound goals.' },
                  { icon: Clock, title: 'Long-Term Perspective', desc: 'Patience and perseverance; think about where they want to be in 5 or 10 years.' },
                  { icon: Heart, title: 'Self-Motivation & Confidence', desc: 'Strong self-belief and internal drive. Push themselves even when others doubt.' },
                  { icon: Star, title: 'Innovativeness & Creativity', desc: 'Generate new ideas and solutions; find better ways to do things.' },
                  { icon: Compass, title: 'Adventuresomeness', desc: 'Willing to experiment and test new ideas. Not afraid of trying something different.' },
                  { icon: Handshake, title: 'Commitment', desc: 'Dedicated to their business; make sacrifices and stick with it through difficulties.' },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 flex items-start gap-3">
                    <item.icon size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">{i+1}. {item.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Additional Important Traits
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Patience', 'Friendliness', 'Hard work', 'Reliability', 'Dedication', 'Responsibility', 'Objectivity', 'Rationality', 'Honesty', 'Determination', 'Courage', 'Flexibility', 'Imagination', 'Knowledge'].map((trait) => (
                  <span key={trait} className="px-3 py-1 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-700 dark:text-slate-300">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Roles of SMEs */}
            <div
              ref={(el) => {
                sectionRefs.current['sme-roles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Roles of Small &amp; Medium Enterprises (SMEs)
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">
                Defining Small Businesses
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                <li><strong>Low Annual Sales</strong> – limited market reach.</li>
                <li><strong>Restricted Asset Base</strong> – limited buildings, equipment.</li>
                <li><strong>Local Market Focus</strong> – serve immediate community.</li>
                <li><strong>Small Workforce</strong> – close-knit team.</li>
                <li><strong>Owner Responsibility</strong> – owner actively involved.</li>
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Types of Small Businesses
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Home size={14} /> Survival Businesses
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Primary goal is to provide a livelihood for the owner and family. Examples: backyard gardens, home‑based hairdressing, tuck shops.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <TrendingUp size={14} /> Growth Businesses
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Aim for higher profits and expansion. Examples: furniture maker hiring more carpenters, restaurant opening second location.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Reasons for Survival of Small Firms
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                <li><strong>Flexibility and Innovation</strong> – adapt quickly.</li>
                <li><strong>Supportive Role for Large Firms</strong> – subcontracting.</li>
                <li><strong>Niche Markets</strong> – serve specialized needs.</li>
                <li><strong>Government Support</strong> – training, funding, lower taxes.</li>
                <li><strong>Flexible Supply</strong> – offer smaller quantities.</li>
                <li><strong>Personalized Services</strong> – know customers by name.</li>
                <li><strong>Technological Adaptation</strong> – test new tech in small ways.</li>
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Roles Played by SMEs in the Economy
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  'Employment Creation',
                  'Provision of Goods & Services',
                  'Reduction of Anti‑Social Activities',
                  'Reduced Rural‑Urban Migration',
                  'Improved Standard of Living',
                  'Economic Stabilization',
                  'Economic Indigenization',
                  'Foreign Currency Generation',
                  'Quality & Affordable Products',
                  'Government Revenue',
                  'National Income (GDP)',
                ].map((role, i) => (
                  <div key={i} className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
                    {role}
                  </div>
                ))}
              </div>
            </div>

            {/* Government Initiatives */}
            <div
              ref={(el) => {
                sectionRefs.current['government'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Government Entrepreneurship Initiatives
              </h2>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Governments support entrepreneurship to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                <li>Promote self‑sustenance</li>
                <li>Encourage entrepreneurship culture</li>
                <li>Economic indigenisation</li>
                <li>Economic stabilisation</li>
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Key Ministries
              </h3>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212] mt-2">
                <table className="w-full text-left border-collapse min-w-[400px] text-xs">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Ministry</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Focus Areas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold">Youth Development, Gender &amp; Employment Creation</td><td className="p-3">Supports young entrepreneurs, gender equality, employment creation</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Small &amp; Medium Enterprises</td><td className="p-3">SME development, training, funding access, business support</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Government‑Backed Institutions &amp; Policies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400">SEDCO</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Small Enterprise Development Corporation – loans, training, premises.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400">Infrastructural Development Bank</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Funds infrastructure projects.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h5 className="text-xs font-bold text-amber-600 dark:text-amber-400">Agribank</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Financing for agricultural entrepreneurs.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h5 className="text-xs font-bold text-purple-600 dark:text-purple-400">Affirmative Action Group (AAG)</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Advocates for black economic empowerment.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h5 className="text-xs font-bold text-red-600 dark:text-red-400">Zimbabwe Cross Border Association</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Supports cross‑border traders.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h5 className="text-xs font-bold text-pink-600 dark:text-pink-400">Zimbabwe Tuck Shop Association</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Represents small shop owners.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 md:col-span-2">
                  <h5 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Black Empowerment &amp; Indigenisation Policies</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Promote local ownership and control of businesses.</p>
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
                Conclusion: Building Zimbabwe through Entrepreneurship
              </h2>

              <div className="p-6 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-amber-300 dark:border-amber-700">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Entrepreneurship is far more than just starting a business to
                  make money. In Zimbabwe, it’s a vital force for:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <li><strong>Economic survival</strong> – providing livelihoods for millions</li>
                  <li><strong>National development</strong> – building the economy from the ground up</li>
                  <li><strong>Community well‑being</strong> – bringing goods, services, and opportunities</li>
                  <li><strong>Patriotic contribution</strong> – serving the nation while serving oneself</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                The Successful Entrepreneur
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 text-center">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Personal Characteristics</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Action‑oriented, optimistic, opportunity‑seeking, risk‑calculating, goal‑setting, patient, self‑motivated, innovative, committed.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 text-center">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase">Business Skills</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Understanding markets, managing money, leading people, planning, problem‑solving.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 text-center">
                  <h5 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Patriotic Spirit</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Creating good jobs, fair pricing, quality products, protecting resources, paying taxes, supporting communities.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-indigo-600 text-white rounded-2xl shadow-lg text-center">
                <p className="text-lg font-bold mb-2">If you’re considering becoming an entrepreneur, remember:</p>
                <p className="text-xl font-black mb-4">You’re not just starting a business. You’re:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
                  <div className="flex items-center gap-2"><CheckCircle className="text-yellow-300" size={16} /> Creating your own future</div>
                  <div className="flex items-center gap-2"><CheckCircle className="text-yellow-300" size={16} /> Providing for your family</div>
                  <div className="flex items-center gap-2"><CheckCircle className="text-yellow-300" size={16} /> Employing others</div>
                  <div className="flex items-center gap-2"><CheckCircle className="text-yellow-300" size={16} /> Serving your community</div>
                  <div className="flex items-center gap-2"><CheckCircle className="text-yellow-300" size={16} /> Building your nation</div>
                  <div className="flex items-center gap-2"><CheckCircle className="text-yellow-300" size={16} /> Contributing to Zimbabwe’s resilience</div>
                </div>
                <p className="mt-4 text-sm italic">
                  The journey isn’t easy, but the reward is knowing you’re part
                  of building something larger than yourself: a prosperous,
                  resilient, and proud Zimbabwe.
                </p>
              </div>

              {/* Key Terms (included as part of conclusion or separate? We'll add as extra section not in tabs maybe) */}
              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Key Terms to Remember
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {[
                  { term: 'Entrepreneur', def: 'Initiates and manages a business venture to profitably address needs.' },
                  { term: 'Entrepreneurship', def: 'Process of combining resources creatively to meet needs and create wealth.' },
                  { term: 'Patriotism', def: 'Loyal support of one’s nation; in business, ethical practices that benefit the country.' },
                  { term: 'Informal Sector', def: 'Economic activities operating outside formal government regulation.' },
                  { term: 'SME', def: 'Small and Medium Enterprise.' },
                  { term: 'Survival Business', def: 'Focused primarily on providing livelihood for the owner.' },
                  { term: 'Growth Business', def: 'Aiming for expansion and higher profits.' },
                  { term: 'Intrapreneurship', def: 'Innovation and entrepreneurship within an existing organisation.' },
                  { term: 'SWOT Analysis', def: 'Assessment of Strengths, Weaknesses, Opportunities, and Threats.' },
                  { term: 'SMART Goals', def: 'Specific, Measurable, Achievable, Realistic, Time‑bound objectives.' },
                  { term: 'Economic Resilience', def: 'Ability of an economy to withstand and recover from shocks.' },
                  { term: 'Indigenisation', def: 'Promoting local ownership and control of economic resources.' },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h5 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{item.term}</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.def}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Discussion Questions
              </h3>
              <div className="space-y-2 mt-2">
                {[
                  'Why is the informal sector so important to Zimbabwe’s economy?',
                  'How can an entrepreneur demonstrate patriotism through their business practices?',
                  "What's the difference between an entrepreneur and an intrapreneur? Which would you rather be and why?",
                  'Think of a successful entrepreneur you know. Which characteristics do they display?',
                  'How does creating a small business in a rural area help more than just the owner?',
                  'Why is it important for entrepreneurs to pay taxes even if they could avoid doing so?',
                  'What role do small businesses play in building Zimbabwe’s economic resilience?',
                ].map((q, i) => (
                  <div key={i} className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{i+1}. {q}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Entrepreneurship Tip
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-indigo-500 dark:text-indigo-400" />
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
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Entrepreneurial Traits</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>SME Roles</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">11</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Entrepreneurship is not just about profit – it’s about creating
                value for the community and the nation. Patriotic entrepreneurs
                build a stronger Zimbabwe.
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
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Entrepreneurship</strong> is the
                engine of Zimbabwe’s economy, especially through the informal
                sector which employs 75% of the workforce.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Patriotic entrepreneurs</strong>{' '}
                create jobs, pay fair taxes, produce quality goods, and
                contribute to national resilience.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Key characteristics</strong>{' '}
                include action‑orientation, opportunity seeking, calculated
                risk‑taking, and strong self‑belief.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">SMEs</strong> play a vital role
                in employment, service provision, and economic stabilisation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Government initiatives</strong>{' '}
                like SEDCO, Agribank, and indigenisation policies support
                entrepreneurs and boost local ownership.
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
            Sidemann Academic Registry • Entrepreneurship Skills Development – Entrepreneurship & Patriotism 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;
