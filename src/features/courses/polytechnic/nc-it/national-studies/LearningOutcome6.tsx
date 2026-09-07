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
  Castle,
  Crown,
  Mountain,
  History,
  Gavel as GavelIcon,
  Package as PackageIcon,
  MessageCircle as MessageCircleIcon,
  Sparkles as SparklesIcon,
  Cross,
  Skull,
  Ship,
  Bomb,
  Pill,
  ShoppingCart,
  Users2,
  Scroll,
  PenTool,
  Flame,
  Bird,
  Moon,
  Tractor,
  HandFist,
  Building,
  AlertTriangle as AlertTriangleIcon,
  BarChart as BarChartIcon,
  Gem,
  LandPlot,
  Music,
  VolumeX,
  Link,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'conflict-definition', label: 'Conflict' },
  { id: 'sources', label: 'Sources' },
  { id: 'resolution', label: 'Resolution' },
  { id: 'styles', label: 'Styles' },
  { id: 'impact', label: 'Impact' },
  { id: 'traditional', label: 'Traditional' },
  { id: 'international', label: 'International' },
  { id: 'theories', label: 'Theories' },
  { id: 'foreign-policy', label: 'Foreign Policy' },
  { id: 'peace', label: 'Peace' },
  { id: 'sanctions', label: 'Sanctions' },
  { id: 'peace-strategies', label: 'Peace Strategies' },
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
        text: 'There are five conflict resolution styles: Accommodating, Avoiding, Collaborating, Competing, and Compromising – each appropriate in different situations.',
      },
      {
        title: 'Pro Tip',
        text: 'Traditional African conflict resolution focused on restorative justice – repairing harm and restoring relationships, not just punishing wrongdoers.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the difference between negative peace (absence of war) and positive peace (presence of justice, equity, and human dignity).',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse "compromise" with "collaboration". Compromise involves both sides giving up something; collaboration creates a win-win solution that meets both parties\' core needs.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'There are five conflict resolution styles: Accommodating, Avoiding, Collaborating, Competing, and Compromising – each appropriate in different situations.',
      },
      {
        title: 'Pro Tip',
        text: 'Traditional African conflict resolution focused on restorative justice – repairing harm and restoring relationships, not just punishing wrongdoers.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the difference between negative peace (absence of war) and positive peace (presence of justice, equity, and human dignity).',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse "compromise" with "collaboration". Compromise involves both sides giving up something; collaboration creates a win-win solution that meets both parties\' core needs.',
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
                ? 'bg-green-600 text-white shadow-md shadow-green-200 dark:shadow-green-900/30'
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
      <header className="bg-[#134e4a] dark:bg-[#042f2e] border-b border-teal-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <HeartHandshake size={14} className="inline mr-1" /> CONFLICT, PEACE & INTERNATIONAL RELATIONS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 6{' '}
            <span className="text-cyan-300 font-bold italic">
              Conflict, Peace &amp; International Relations
            </span>
          </h1>
          <p className="text-lg text-green-100 max-w-2xl leading-relaxed">
            Understand conflict and its sources, explore conflict resolution
            styles and traditional African methods, and examine international
            relations, foreign policy, and strategies for building sustainable peace.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-green-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Swords size={14} className="inline mr-1" /> Conflict
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <HeartHandshake size={14} className="inline mr-1" /> Peace
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Globe size={14} className="inline mr-1" /> Relations
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-green-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, theory, or resolution style..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-green-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-green-200" />
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
                Introduction to Conflict, Peace &amp; International Relations
              </h2>

              <div className="p-4 sm:p-5 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Conflict is a natural part of human life – but how we manage
                    it determines whether it destroys or builds. This learning
                    outcome explores the sources of conflict, resolution styles,
                    traditional African approaches, international relations
                    theories, and strategies for building sustainable peace.
                  </p>
</div>
            </div>

            {/* Conflict Definition */}
            <div
              ref={(el) => {
                sectionRefs.current['conflict-definition'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Conflict – What It Is and Where It Comes From
              </h2>

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight mt-2">
                1 Defining Conflict
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Conflict occurs whenever two or more people, groups, or countries
                have goals, interests, or values that they believe cannot both be
                achieved at the same time – so they come into opposition with each
                other. Conflict is not inherently bad – managed well, it can drive
                positive change and surface important issues.
              </p>

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight mt-6">
                2 Sources of Conflict
              </h3>
              <div className="space-y-3 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <MessageCircle size={14} /> Misunderstandings
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">When one party incorrectly interprets the words, actions, or intentions of another. Often resolved through better communication.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Heart size={14} /> Differences in Values or Beliefs
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Deep convictions about what is right, important, and worth protecting – often the most difficult conflicts to resolve.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Gem size={14} /> Competition for Resources
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">When land, water, money, jobs, or political power are scarce, different groups may compete for the same limited supply.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Crown size={14} /> Power Struggles
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Competition to control decision-making – who leads, who makes the rules, whose interests those rules serve.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <VolumeX size={14} /> Communication Breakdowns
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Poor communication multiplies misunderstandings, erodes trust, and shrinks the space for finding common ground.</p>
                </div>
              </div>
            </div>

            {/* Conflict Resolution */}
            <div
              ref={(el) => {
                sectionRefs.current['resolution'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Conflict Resolution – Finding Peaceful Solutions
              </h2>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Conflict resolution is the process of finding peaceful, mutually
                  acceptable solutions to disputes. It involves identifying root
                  causes, creating safe spaces for communication, exploring
                  solutions from each side's perspective, negotiating agreements,
                  and monitoring implementation. The goal is to minimize negative
                  impacts, preserve relationships, and create lasting solutions.
                </p>
              </div>
            </div>

            {/* Conflict Resolution Styles */}
            <div
              ref={(el) => {
                sectionRefs.current['styles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Five Conflict Resolution Styles
              </h2>

              <div className="space-y-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Accommodating</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Prioritizing the other party's needs over your own. Appropriate when the issue is minor, the other party cares more, or maintaining the relationship is most important.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400">Avoiding</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Withdrawing from the conflict entirely. Appropriate when the issue is trivial, when both parties are too emotional, or when more information is needed.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Collaborating</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Working together to find a win-win solution that meets both parties' core needs. The most constructive approach when both parties are willing to invest the effort.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Competing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Asserting your own needs strongly, even at the other's expense. Appropriate when quick, decisive action is needed or when defending rights against bad faith.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Compromising</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Both parties give up something to reach agreement – a middle ground. Works for temporary solutions or when both have equal power.</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2"> Key Insight
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">No single style is always right or always wrong. The most effective conflict resolvers recognize which style is needed in a given situation and deliberately choose to use it.</p>
              </div>
            </div>

            {/* Impact */}
            <div
              ref={(el) => {
                sectionRefs.current['impact'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Impact of Conflict Resolution on Socio-Economic Development
              </h2>

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight mt-2">
                1 Positive Impacts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">Peace and Stability</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Creates the basic conditions development requires.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Economic Growth</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Unlocks potential by removing direct and indirect costs of conflict.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Social Cohesion</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Restores broken relationships and shared identity.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Improved Governance</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Strengthens institutions and inclusive decision-making.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight mt-6">
                2 Negative Impacts of Unresolved Conflict
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">Economic Stagnation</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Infrastructure destroyed, investment flees, revenues collapse.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">Social Breakdown</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Mistrust, crime, disrupted families, psychological wounds.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">Political Instability</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Erodes trust in government, deters long-term planning.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">Humanitarian Crises</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Mass displacement, famine, collapse of healthcare.</p>
                </div>
              </div>
            </div>

            {/* Traditional African Methods */}
            <div
              ref={(el) => {
                sectionRefs.current['traditional'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Traditional African Conflict Resolution Methods
              </h2>

              <div className="space-y-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Mediation and Arbitration</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Respected elders or chiefs facilitate dialogue or make binding decisions based on community values and respect.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Restorative Justice</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Focus on repairing harm and restoring relationships, not punishment. Compensation, apology, and reintegration into community.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Community Councils (Dare / Kgotla)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Public gatherings where the whole community participates in discussing and resolving disputes – consensus-based, participatory.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Rituals and Ceremonies</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Cleansing ceremonies, sharing symbolic foods, traditional oaths – addressing spiritual and emotional dimensions of conflict.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400">Elders' Councils</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Specialized councils of respected elders who maintain customary law and make binding decisions based on community values.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Family and Clan Involvement</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Extended families bear collective responsibility – negotiations involve family representatives and address broader relationships.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">The Indaba – Traditional Conference</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Structured, dialogical process where all stakeholders have a voice – decisions emerge from collective dialogue rather than being imposed from above.</p>
                </div>
              </div>
            </div>

            {/* International Relations */}
            <div
              ref={(el) => {
                sectionRefs.current['international'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Conflict, Competition &amp; Cooperation in International Relations
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Swords size={14} /> Conflict
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Active opposition or hostility between nations. Arises when goals or interests appear incompatible. Ranges from diplomatic disputes to armed warfare.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <TrendingUp size={14} /> Competition
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ongoing rivalry for advantage in trade, investment, technology, political influence. Can drive innovation but may escalate into conflict without agreed rules.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Handshake size={14} /> Cooperation
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Recognition that some challenges require coordinated responses – climate change, pandemic disease, nuclear proliferation. Institutionalized through UN, AU, SADC, COMESA.</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Diplomacy</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">The practice of managing formal relations between governments through negotiation, representation, and communication. Zimbabwe's foreign policy evolved from non-alignment to 'Look East' in response to Western sanctions.</p>
              </div>
            </div>

            {/* Theories */}
            <div
              ref={(el) => {
                sectionRefs.current['theories'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Theories of International Relations
              </h2>

              <div className="space-y-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400">Realism</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Power is everything. The international system is anarchic – states must rely on their own power for security. Conflict is an expected feature of international life.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Liberalism</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Cooperation and progress are possible. Democratic states are less likely to go to war; economic interdependence creates mutual interests; international institutions can manage competition.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Constructivism</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ideas and identity shape behavior. State interests are socially constructed – shaped by history, culture, norms, and shared understandings.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Marxism / Critical Theory</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Economics and power structures. The international system is structured by capitalism, systematically advantaging wealthy countries at the expense of developing nations.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-pink-600 dark:text-pink-400">Feminism</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Gender matters in international relations. Women are disproportionately affected by conflict as civilians; women's participation in peace processes produces more durable outcomes.</p>
                </div>
              </div>
            </div>

            {/* Foreign Policy */}
            <div
              ref={(el) => {
                sectionRefs.current['foreign-policy'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Zimbabwe's Foreign Policy
              </h2>

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight mt-2">
                1 Core Principles
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Protection of national sovereignty</span> – absolute right to self-governance and freedom from foreign interference</li>
                <li><span className="font-bold">Pan-Africanism</span> – solidarity and cooperation among African nations based on shared history and commitment to self-determination</li>
              </ul>

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight mt-6">
                2 Historical Evolution
              </h3>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-bold">Non-alignment (1980-2000):</span> Refused formal alignment with either Western or Soviet blocs during the Cold War.
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                  <span className="font-bold">'Look East' policy (2000s):</span> Redirected diplomatic and economic engagement toward China, Russia, and Asian countries in response to Western sanctions after land reform.
                </p>
              </div>
            </div>

            {/* Peace */}
            <div
              ref={(el) => {
                sectionRefs.current['peace'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Peace and Sustainable Peace
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400">Negative Peace</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The absence of war or violence. Minimal and fragile – society can be at negative peace while still filled with injustice, poverty, and discrimination.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Positive Peace</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The presence of justice, equity, human rights, inclusive governance, and social arrangements that resolve conflicts before they turn violent.</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Sustainable Peace</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Building structures, institutions, and processes that maintain peace over the long term – addressing grievances, reforming institutions, supporting reconciliation, and building civil society.</p>
              </div>
            </div>

            {/* Sanctions */}
            <div
              ref={(el) => {
                sectionRefs.current['sanctions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Impact of Sanctions on Development
              </h2>

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight mt-2">
                1 What Are Sanctions?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Economic or political restrictions imposed by one or more countries
                against another to compel behavior change without resorting to armed
                force. Zimbabwe has faced sanctions from the US and EU in response
                to land reform and democracy concerns.
              </p>

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight mt-6">
                2 Economic Impacts
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Reduced Trade</span> – restricted exports and imports, reduced foreign exchange earnings</li>
                <li><span className="font-bold">Investment Deterrence</span> – uncertainty, risk, and reputational concerns discourage foreign investment</li>
                <li><span className="font-bold">Financial Restrictions</span> – limited access to international banking systems and financial markets</li>
                <li><span className="font-bold">Increased Poverty and Currency Devaluation</span> – economic contraction, unemployment, inflation</li>
              </ul>

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight mt-6">
                3 Social and Political Impacts
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Humanitarian Consequences</span> – reduced access to food, medicine, and essential supplies</li>
                <li><span className="font-bold">Increased Nationalism</span> – governments can blame economic hardship on foreign interference</li>
                <li><span className="font-bold">Political Entrenchment</span> – sanctions often strengthen rather than weaken targeted governments</li>
              </ul>
            </div>

            {/* Peace Strategies */}
            <div
              ref={(el) => {
                sectionRefs.current['peace-strategies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Strategies for Building Sustainable Peace
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Inclusive Governance</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ensure all significant groups have representation and grievances can be raised through legitimate channels.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Economic Development</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Poverty and inequality drive conflict – investment in development creates opportunities for marginalized groups.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Social Cohesion and Reconciliation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Structured dialogue, acknowledgement of harms, and promotion of shared national narratives that honor diversity.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Security Sector Reform</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Genuine civilian control over security forces, community-based policing, independent oversight, and addressing impunity.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Addressing Historical Injustices</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Truth and reconciliation commissions acknowledge historical wrongs and create shared historical record.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-pink-600 dark:text-pink-400">Empowering Women in Peacebuilding</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Women's meaningful participation in peace processes produces better, more durable outcomes.</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-700 text-white rounded-xl">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <HeartHandshake size={18} className="text-yellow-300" /> 🇿🇼 Understand Conflict. Choose Peace. Build Zimbabwe.
                </h4>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-green-100 dark:border-green-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400">
                  💡 Peace Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-green-500 dark:text-green-400" />
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
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Conflict Sources</span>
                  <span className="font-bold text-green-600 dark:text-green-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>IR Theories</span>
                  <span className="font-bold text-green-600 dark:text-green-400">5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Peace is not just the absence of war – it is the presence of
                justice, equity, and human dignity. Understanding conflict and
                peacebuilding is essential for building a better Zimbabwe.
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
          className="w-12 h-12 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-green-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-300 font-bold">•</span>
              <span>
                <strong className="text-white">Conflict</strong> arises from misunderstandings, values differences, resource competition, power struggles, and communication breakdowns.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-300 font-bold">•</span>
              <span>
                <strong className="text-white">Five resolution styles</strong> – Accommodating, Avoiding, Collaborating, Competing, Compromising – each appropriate in different situations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-300 font-bold">•</span>
              <span>
                <strong className="text-white">Traditional African methods</strong> include mediation, restorative justice, community councils, rituals, and elders' councils – focusing on repairing relationships and community harmony.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-300 font-bold">•</span>
              <span>
                <strong className="text-white">International relations theories</strong> – Realism, Liberalism, Constructivism, Marxism, and Feminism – offer different lenses for understanding global politics.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-300 font-bold">•</span>
              <span>
                <strong className="text-white">Peace</strong> is not just absence of war (negative peace) but presence of justice and equity (positive peace). Sustainable peace requires inclusive governance, economic development, reconciliation, and women's empowerment.
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
            Sidemann Academic Registry • NASS Conflict, Peace &amp; International Relations 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome6;
