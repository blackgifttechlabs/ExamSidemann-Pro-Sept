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
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'first-chimurenga', label: 'First Chimurenga' },
  { id: 'causes', label: 'Causes' },
  { id: 'religion', label: 'Religion' },
  { id: 'results', label: 'Results' },
  { id: 'company-rule', label: 'Company Rule' },
  { id: 'settler-rule', label: 'Settler Rule' },
  { id: 'african-workers', label: 'African Workers' },
  { id: 'resistance-independence', label: 'Resistance to Independence' },
  { id: 'post-independence', label: 'Post-Independence' },
  { id: 'third-chimurenga', label: 'Third Chimurenga' },
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
        text: 'The First Chimurenga (1896-97) saw unprecedented cooperation between the Shona and Ndebele peoples, united against colonial rule through the Mwari religious cult.',
      },
      {
        title: 'Pro Tip',
        text: 'Nehanda\'s last words before execution – "My bones will rise again" – became the rallying cry for Zimbabwe\'s liberation struggle, inspiring fighters for generations.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three Chimurengas: First (1896-97) – armed resistance against BSAC; Second (1960s-70s) – liberation struggle; Third (2000s) – land reform/economic liberation.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not think the First Chimurenga was a failure. While militarily defeated, it established the tradition of resistance, created national heroes, and inspired every subsequent struggle for freedom.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The First Chimurenga (1896-97) saw unprecedented cooperation between the Shona and Ndebele peoples, united against colonial rule through the Mwari religious cult.',
      },
      {
        title: 'Pro Tip',
        text: 'Nehanda\'s last words before execution – "My bones will rise again" – became the rallying cry for Zimbabwe\'s liberation struggle, inspiring fighters for generations.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three Chimurengas: First (1896-97) – armed resistance against BSAC; Second (1960s-70s) – liberation struggle; Third (2000s) – land reform/economic liberation.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not think the First Chimurenga was a failure. While militarily defeated, it established the tradition of resistance, created national heroes, and inspired every subsequent struggle for freedom.',
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <HandFist size={14} className="inline mr-1" /> RESISTANCE & INDEPENDENCE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 4{' '}
            <span className="text-amber-300 font-bold italic">
              From Resistance to Independence
            </span>
          </h1>
          <p className="text-lg text-red-100 max-w-2xl leading-relaxed">
            Trace Zimbabwe's journey from the First Chimurenga (1896-97) through
            colonial oppression, the rise of nationalism, the Second Chimurenga,
            independence in 1980, and the complex legacy of the Third Chimurenga.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-red-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Flame size={14} className="inline mr-1" /> Chimurenga
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Flag size={14} className="inline mr-1" /> 1980 Independence
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Tractor size={14} className="inline mr-1" /> Land Reform
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
                placeholder="Search for a leader, event, or concept..."
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
                Introduction to Zimbabwe's Resistance and Independence
              </h2>

              <div className="p-4 sm:p-5 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Zimbabwe's path to independence was forged through resistance
                    – from the First Chimurenga of 1896-97 to the Second Chimurenga
                    of the 1960s and 70s. This learning outcome traces the full
                    arc of that struggle, the colonial systems that provoked it,
                    and the complex legacy of the Third Chimurenga.
                  </p>
</div>
            </div>

            {/* First Chimurenga */}
            <div
              ref={(el) => {
                sectionRefs.current['first-chimurenga'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The First Chimurenga / Umvukela (1896–1897)
              </h2>

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mt-2">
                1 What Was the First Chimurenga?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                The First Chimurenga (Ndebele: Umvukela) was a widespread armed
                uprising against British South Africa Company rule that took place
                between 1896 and 1897 – just six years after the Pioneer Column
                established colonial control. The word 'Chimurenga' derives from
                the spirit medium Sekuru Kaguvi (also known as Murenga) and has
                become the defining term for Zimbabwe's liberation struggles.
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                The uprising was historically remarkable for three reasons:
                it demonstrated that African communities were active resisters,
                not passive victims; it saw unprecedented cooperation between
                the Shona and Ndebele; and it gave Zimbabwe its most enduring
                national heroes – particularly the spirit medium Nehanda.
              </p>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Bird size={16} /> National Significance
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Nehanda's famous last words – 'My bones will rise again' – became
                  the most powerful rallying cry of Zimbabwe's liberation struggle.
                  She is today honored as Zimbabwe's most important national heroine.
                </p>
              </div>
            </div>

            {/* Causes */}
            <div
              ref={(el) => {
                sectionRefs.current['causes'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Causes of the First Chimurenga
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">1 Forced Labor – Chibharo</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">The system of forced labor (chibharo) required African men to work for colonial enterprises under extreme exploitation and physical brutality – beatings, poor conditions, and virtually no wages.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">2 Taxation – The Financial Trap</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Hut tax, dog tax, and others forced African families into the cash economy – the only way to obtain cash was to work for white employers or sell goods at exploitative prices.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">3 Disruption of Traditional Economies</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Shona trade networks were disrupted; Ndebele cattle economy, tribute system, and raiding were abolished after 1893 – communities were stripped of economic independence.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">4 Oppressive and Unjust Administration</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Magistrates and native commissioners were racially biased – settlers' accounts were believed, African complaints dismissed. Justice was impossible for African people.</p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">5 Natural Disasters and Religious Interpretation</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Drought (1894-96), locust plagues, and the rinderpest epidemic that killed cattle were interpreted as ancestral displeasure – the ancestors were angry because the land had been defiled by white settlers.</p>
                </div>
              </div>
            </div>

            {/* Religion */}
            <div
              ref={(el) => {
                sectionRefs.current['religion'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Role of Religion in the First Chimurenga
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Crown size={14} /> A) Nehanda Charwe Nyakasikana
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The great spirit medium who actively organized and inspired the uprising in the Mazowe area. Captured, tried, and executed in March 1898. Her refusal to convert to Christianity and her declaration that her bones would rise again became the defining moment of Zimbabwean resistance mythology.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <Flame size={14} /> B) Sekuru Kaguvi (Murenga)
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Another supremely important spirit medium – from whose name the word 'Chimurenga' derives. Active in Mashonaland, coordinating military activities and providing spiritual protection. Captured and executed in March 1898.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Moon size={14} /> C) Mkwati and the Mwari Cult
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">High priest of the Mwari cult – a religious institution that transcended ethnic boundaries and facilitated unprecedented Shona-Ndebele cooperation. Used the cult's network of shrines to communicate between communities and coordinate resistance.</p>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 mt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">How Religion Functioned</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Religious networks provided communication and coordination infrastructure</li>
                  <li>Proclamations of ancestral support transformed grievances into moral purpose</li>
                  <li>Medicine and amulets boosted morale and courage</li>
                  <li>The Mwari cult enabled Shona-Ndebele cooperation</li>
                </ul>
              </div>
            </div>

            {/* Results */}
            <div
              ref={(el) => {
                sectionRefs.current['results'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Results of the First Chimurenga
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">1 Military Defeat</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The uprising was ultimately defeated due to the overwhelming technological gap – BSAC forces possessed machine guns and modern rifles against spears and older firearms. Some African communities also collaborated with the BSAC.</p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">2 Loss of Leadership</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">The capture and execution of Nehanda, Kaguvi, and other leaders was designed to break the uprising's spiritual backbone. In the short term, it succeeded. But in the long term, these leaders became immortal symbols of resistance – figures whose memory inspired every subsequent struggle.</p>
                </div>
              </div>
            </div>

            {/* Company Rule */}
            <div
              ref={(el) => {
                sectionRefs.current['company-rule'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                From Company Rule to Responsible Government (1890–1923)
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">1 Early Challenges</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The anticipated gold bonanza never materialized. Labor shortages, transportation bottlenecks (no railways), and the First Chimurenga made the early years difficult for the BSAC.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">2 Shift to Agriculture</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Around 1898, the BSAC pivoted to agriculture as the primary economic activity. Rail lines connecting to South African and Mozambican ports made agricultural exports viable.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">3 Responsible Government (1923)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The 1922 referendum among white settlers voted for Responsible Government – self-rule by the white community. On October 1, 1923, Southern Rhodesia was granted Responsible Government, shifting colonial control from a private company to a settler political class.</p>
                </div>
              </div>
            </div>

            {/* Settler Rule */}
            <div
              ref={(el) => {
                sectionRefs.current['settler-rule'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Settler Rule and Its Devastating Impact on Africans (1923–1965)
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">1 The Structure of Settler Government</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A parliamentary democracy for the white minority – Africans were almost completely disenfranchised. Native Commissioners administered African affairs. Traditional chiefs were reduced to tax collectors and labor recruiters.</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">2 The Land Apportionment Act (1930)</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">48.1 million acres allocated to 50,000 white settlers. 21.1 million acres allocated to 1,000,000+ African people. Each white settler received ~962 acres; each African person received ~21 acres. This was systematic dispossession backed by law.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">3 The Land Husbandry Act (1951)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Placed limits on land and cattle holdings – justified as environmental protection but actually pushed families off the land into urban areas, creating cheap labor for white-owned industries.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">4 Taxation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Hut tax, dog tax, cattle tax – a comprehensive system of financial extraction that forced African families into the colonial labor market and kept them in perpetual economic pressure.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">5 Forced Labor</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The Rhodesian Native Labour Bureau systematized recruitment. The Master and Servants Ordinance criminalized workers breaking employment contracts – effectively indentured servitude.</p>
                </div>
              </div>
            </div>

            {/* African Workers */}
            <div
              ref={(el) => {
                sectionRefs.current['african-workers'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Problems Faced by African Workers
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">1 Working and Living Conditions</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Extremely long hours – 12+ hours/day, 6-7 days/week</li>
                    <li>Hazardous work – mining accidents, lung diseases, agricultural heat exhaustion</li>
                    <li>Physical abuse – beatings and whippings were common and unpunished</li>
                    <li>Crowded, unsanitary housing in compounds</li>
                    <li>Insufficient, poor quality food – chronic malnutrition</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">2 Wage Exploitation and Lack of Rights</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                    <li>Job color bar – skilled jobs reserved for whites</li>
                    <li>Wages set to prevent economic independence</li>
                    <li>Arbitrary deductions and cheating</li>
                    <li>No trade unions – union organizing effectively prohibited</li>
                    <li>No political representation – the legislature was entirely white</li>
                    <li>No legal recourse against abuse</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Resistance to Independence */}
            <div
              ref={(el) => {
                sectionRefs.current['resistance-independence'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                African Resistance and the Path to Independence (1950s–1980)
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">1 Early Forms of Resistance</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Desertion, feigned illness, go-slows, sabotage, and informal communication networks – everyday acts of defiance that collectively represented a refusal to submit fully to colonial authority.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">2 The Rise of Nationalist Movements</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">City Youth League → African National Congress → National Democratic Party → ZAPU (1961, Joshua Nkomo) → ZANU (1963, Ndabaningi Sithole / Robert Mugabe). Repeated bans and arrests by the Rhodesian security state.</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">3 UDI and the Second Chimurenga</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">In November 1965, Ian Smith's Rhodesian Front declared Unilateral Declaration of Independence (UDI) – rejecting majority rule. This made armed struggle inevitable. ZANLA and ZIPRA intensified guerrilla warfare from bases in Mozambique and Zambia.</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">4 Lancaster House Agreement and Independence (1980)</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">The 1979 Lancaster House Conference negotiated a transition to majority rule. Elections in February 1980 – ZANU-PF under Robert Mugabe won decisively. On April 18, 1980, Zimbabwe became independent.</p>
                </div>
              </div>
            </div>

            {/* Post-Independence */}
            <div
              ref={(el) => {
                sectionRefs.current['post-independence'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Post-Independence Zimbabwe (1980–2000)
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">1 Early Years – Unity and Reconstruction</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Mugabe offered reconciliation with the white minority – a pragmatic decision to keep the economy functioning. Unity Cabinet included ZAPU and some whites. Achievements: expanded education, free primary healthcare, high literacy rates.</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">2 The Gukurahundi Crisis (1982–1987)</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">A violent military campaign in Matabeleland and the Midlands – an estimated 20,000 civilians killed, mostly Ndebele. The Fifth Brigade conducted mass killings, torture, and collective punishment. The Unity Accord of 1987 merged ZANU-PF and ZAPU but did not address the wounds.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">3 Economic Policies and Structural Adjustment</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The ZIMCORD conference (1981) raised aid for development. The Five-Year Development Plan (1986) aimed to restructure the economy. The 1991 Structural Adjustment Program (SAP) – imposed by IMF/World Bank – led to trade liberalization, spending cuts, and currency devaluation, causing severe hardship.</p>
                </div>
              </div>
            </div>

            {/* Third Chimurenga */}
            <div
              ref={(el) => {
                sectionRefs.current['third-chimurenga'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Third Chimurenga – The Struggle for Economic Liberation
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">1 What Is the Third Chimurenga?</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The Third Chimurenga centers on the 'unfinished business' of liberation – the economic dimension, particularly land redistribution. The argument: political independence without economic independence (especially land) is incomplete liberation.</p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">2 Causes</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                    <li><span className="font-bold">Lancaster House limitations</span> – 'willing seller, willing buyer' slowed redistribution; by 2000, 4,500 white farmers still owned 70% of the best land.</li>
                    <li><span className="font-bold">1998 Land Donor Conference failure</span> – pledged funds were never disbursed, seen as betrayal.</li>
                    <li><span className="font-bold">2000 Referendum defeat</span> – led to farm invasions by war veterans and landless peasants, then fast-track land reform.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">3 Intended Effects</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Correcting historical land injustice</li>
                    <li>Economic empowerment of the black majority</li>
                    <li>Completing the liberation struggle's promise</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">4 Unintended Effects</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                    <li>Agricultural production declined dramatically – Zimbabwe went from 'breadbasket' to food insecure</li>
                    <li>Hyperinflation (reaching incomprehensible levels by 2008)</li>
                    <li>Allegations of violent evictions and politically motivated land allocation</li>
                    <li>International sanctions and damaged investor confidence</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-900 dark:bg-black text-white rounded-xl">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <BookOpen size={18} className="text-yellow-400" /> Historical Reflection
                </h4>
                <p className="text-sm">The Third Chimurenga represents one of the most complex episodes in post-independence African history. The injustice it sought to address was genuine, but the implementation was chaotic and economically damaging. A balanced understanding must hold both truths simultaneously.</p>
              </div>

              <div className="mt-6 p-4 bg-red-700 text-white rounded-xl">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Flag size={18} className="text-yellow-300" /> 🇿🇼 The Struggle Continues
                </h4>
                <p className="text-sm">Learn the past. Shape the future.</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-red-100 dark:border-red-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400">
                  💡 Liberation Insight
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
                  <span>Chimurenga Wars</span>
                  <span className="font-bold text-red-600 dark:text-red-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Key Spirit Mediums</span>
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
                Zimbabwe's journey to independence was forged through resistance
                – from the First Chimurenga of 1896 to the Second Chimurenga of
                the 1970s. Understanding this struggle is essential for understanding
                the nation's identity and the challenges that followed.
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
        <div className="mt-8 p-6 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-red-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>
                <strong className="text-white">The First Chimurenga</strong> (1896-97) was a widespread armed uprising against BSAC rule, featuring unprecedented Shona-Ndebele cooperation and spirit mediums like Nehanda and Kaguvi.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>
                <strong className="text-white">Causes</strong> included forced labor (chibharo), taxation, economic disruption, unjust administration, and natural disasters interpreted as ancestral anger.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>
                <strong className="text-white">Settler rule</strong> (1923-1965) was devastating – the Land Apportionment Act (1930) gave 48.1 million acres to 50,000 whites and 21.1 million acres to 1,000,000+ Africans.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>
                <strong className="text-white">Independence</strong> came on April 18, 1980 after the Second Chimurenga and Lancaster House Agreement. Early achievements in education and healthcare were later overshadowed by the Gukurahundi crisis and economic challenges.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>
                <strong className="text-white">The Third Chimurenga</strong> (2000s) sought economic liberation through land reform – addressing genuine historical injustice but with chaotic implementation and severe economic consequences.
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
            Sidemann Academic Registry • NASS From Resistance to Independence 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;