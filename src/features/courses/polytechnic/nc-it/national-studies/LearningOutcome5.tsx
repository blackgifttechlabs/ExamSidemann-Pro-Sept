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
  Link,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'heritage', label: 'Heritage' },
  { id: 'social-cultural', label: 'Social & Cultural' },
  { id: 'natural-resources', label: 'Natural Resources' },
  { id: 'legal-studies', label: 'Legal Studies' },
  { id: 'sources-of-law', label: 'Sources of Law' },
  { id: 'constitution', label: 'Constitution' },
  { id: 'declaration-rights', label: 'Rights' },
  { id: 'executive', label: 'Executive' },
  { id: 'judiciary', label: 'Judiciary' },
  { id: 'international', label: 'International' },
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
        text: 'Zimbabwe\'s Constitution includes a Declaration of Rights modeled on the UN Universal Declaration of Human Rights – protecting fundamental freedoms for all citizens.',
      },
      {
        title: 'Pro Tip',
        text: 'The Zimbabwe Bird on the national flag comes from the soapstone carvings found at Great Zimbabwe – connecting modern Zimbabwe to its ancient heritage.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three branches of government: Legislature (makes laws), Executive (implements laws), Judiciary (interprets laws) – each checks the others.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse "customary law" with "legislation". Customary law evolves from community practices; legislation is formally enacted by Parliament.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Zimbabwe\'s Constitution includes a Declaration of Rights modeled on the UN Universal Declaration of Human Rights – protecting fundamental freedoms for all citizens.',
      },
      {
        title: 'Pro Tip',
        text: 'The Zimbabwe Bird on the national flag comes from the soapstone carvings found at Great Zimbabwe – connecting modern Zimbabwe to its ancient heritage.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three branches of government: Legislature (makes laws), Executive (implements laws), Judiciary (interprets laws) – each checks the others.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse "customary law" with "legislation". Customary law evolves from community practices; legislation is formally enacted by Parliament.',
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
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30'
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
            <Scale size={14} className="inline mr-1" /> HERITAGE, LAW & GOVERNANCE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 5{' '}
            <span className="text-rose-300 font-bold italic">
              Heritage, Law, Governance &amp; International Relations
            </span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Understand Zimbabwe's heritage, legal system, governance structures,
            and international relations. Know your rights, understand your laws,
            and engage with the world.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-blue-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Flag size={14} className="inline mr-1" /> Heritage
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scale size={14} className="inline mr-1" /> Law
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Globe size={14} className="inline mr-1" /> Relations
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-blue-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a right, symbol, or legal concept..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-blue-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-blue-200" />
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
                Introduction to Heritage, Law, Governance &amp; International Relations
              </h2>

              <div className="p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    This learning outcome explores the foundations of Zimbabwean
                    national identity, the legal framework that governs the country,
                    the structures of governance, and Zimbabwe's place in the
                    international community. Understanding these elements is
                    essential for active, informed citizenship.
                  </p>
</div>
            </div>

            {/* Heritage */}
            <div
              ref={(el) => {
                sectionRefs.current['heritage'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Zimbabwe's Heritage – What It Is and Why It Matters
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 Defining Heritage
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Heritage refers to a legacy – a pivotal event, achievement,
                tradition, ideal, or set of values passed down from previous
                generations that continues to define who Zimbabweans are as a
                people and as a nation. Heritage is living history – it continues
                to shape present attitudes, motivations, and aspirations.
              </p>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 The Second Chimurenga as Central Heritage
              </h3>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  The most defining element of Zimbabwe's modern national heritage
                  is the Second Chimurenga – the liberation war that produced
                  independence in 1980. The values of sovereignty, dignity, equity,
                  and African self-governance that animated the struggle form the
                  ideological bedrock of Zimbabwe's national identity.
                </p>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                3 Dimensions of Heritage
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Political</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">National sovereignty – the right of Zimbabweans to self-governance, free from external interference.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Economic</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Natural resources belong to all Zimbabweans equally – land, minerals, wildlife, water.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Cultural</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The value and dignity of African culture against colonial cultural imperialism.</p>
                </div>
              </div>
            </div>

            {/* Social and Cultural Heritage */}
            <div
              ref={(el) => {
                sectionRefs.current['social-cultural'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Social and Cultural Heritage
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 Ethnic and Cultural Diversity
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Zimbabwe is multi-ethnic: Shona (~84%), Ndebele (~7%), and other
                groups including Tonga, Venda, Kalanga, and Chewa. Each contributes
                distinct traditions to Zimbabwe's cultural mosaic.
              </p>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 Core Values of Zimbabwean African Culture
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                    <Heart size={14} /> Family
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Centrality of nuclear and extended family – social security, emotional support, economic assistance, identity.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Handshake size={14} /> Respect
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Deep respect for elders, parents, and those in authority – recognizing age and experience carry wisdom.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Tractor size={14} /> Hard Work
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Hard work and honest labor as moral virtue and practical necessity, rooted in agricultural heritage.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                3 Traditional African Culture, Religion, and Christianity
              </h3>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Zimbabwe is predominantly Christian, but Christianity arrived as
                  part of colonial project. Many Zimbabweans negotiate a complex
                  relationship between Christian faith and traditional African values
                  – family, community, respect for elders, and reverence for the
                  sacred. Traditional medicine and herbal remedies remain valued.
                </p>
              </div>
            </div>

            {/* Natural Resources and National Symbols */}
            <div
              ref={(el) => {
                sectionRefs.current['natural-resources'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Zimbabwe's Natural Resources and National Symbols
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 Natural Resources – A National Inheritance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                    <LandPlot size={12} /> Land
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">390,000 sq km, productive highveld, formerly 'breadbasket of Africa.'</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                    <Gem size={12} /> Minerals
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Chrome, platinum, gold, diamonds, nickel, iron, coal.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <TreePine size={12} /> Wildlife
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Major game parks, tourism foundation, foreign exchange earnings.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <Users size={12} /> People
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">~97% literacy rate, diverse skills, significant human capital.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 National Symbols
              </h3>
              <div className="space-y-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Flag size={14} /> The National Flag
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                    <div className="p-1 bg-green-100 dark:bg-green-900/30 text-center rounded">
                      <span className="text-xs font-bold text-green-700 dark:text-green-400">Green</span>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400">Flora, agriculture</p>
                    </div>
                    <div className="p-1 bg-yellow-100 dark:bg-yellow-900/30 text-center rounded">
                      <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">Yellow</span>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400">Mineral wealth</p>
                    </div>
                    <div className="p-1 bg-red-100 dark:bg-red-900/30 text-center rounded">
                      <span className="text-xs font-bold text-red-700 dark:text-red-400">Red</span>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400">Blood of heroes</p>
                    </div>
                    <div className="p-1 bg-slate-900 dark:bg-slate-700 text-center rounded">
                      <span className="text-xs font-bold text-white">Black</span>
                      <p className="text-[10px] text-gray-300">Black majority</p>
                    </div>
                    <div className="p-1 bg-white dark:bg-slate-800 text-center rounded border border-slate-200 dark:border-slate-700">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">White</span>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400">Peace</p>
                    </div>
                    <div className="p-1 bg-red-700 text-center rounded">
                      <span className="text-xs font-bold text-white">Red Star</span>
                      <p className="text-[10px] text-gray-300">Socialist ideals</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Zimbabwe Bird – stylized soapstone carving from Great Zimbabwe, connecting modern nation to ancient heritage.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Music size={14} /> National Anthem
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">'Blessed be the Land of Zimbabwe' – written by Professor Solomon Mutsvairo, performed in Shona, Ndebele, and English. Commemorates the liberation struggle, invokes divine blessing, articulates national aspirations, fosters unity.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Castle size={14} /> Great Zimbabwe &amp; Victoria Falls
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Great Zimbabwe ruins – testament to pre-colonial African civilization. Victoria Falls (Mosi-oa-Tunya) – one of world's greatest natural wonders, symbol of natural magnificence and economic potential.</p>
                </div>
              </div>
            </div>

            {/* Legal Studies */}
            <div
              ref={(el) => {
                sectionRefs.current['legal-studies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Legal and Parliamentary Studies – What Is Law?
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 Defining Law
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Law is a set of rules of behavior established and enforced by a
                society or governing authority to regulate conduct, resolve disputes,
                protect rights, and maintain order. Law serves both idealistic
                purposes (order, predictability, justice) and realistic purposes
                (protecting the interests of those with power).
              </p>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 Purposes of Law
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Heart size={14} /> Idealistic Purpose
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Law establishes and maintains order, predictability, stability, and peace – society's social contract where individuals accept constraints in exchange for security.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <AlertTriangle size={14} /> Realistic Purpose
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Law protects the interests of those who have the power to create and enforce it – history shows legal systems can be technically sophisticated yet fundamentally unjust.</p>
                </div>
              </div>
            </div>

            {/* Sources of Law */}
            <div
              ref={(el) => {
                sectionRefs.current['sources-of-law'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Sources of Law – Where Does Law Come From?
              </h2>

              <div className="space-y-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">1 Customs</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The oldest source – repeated, consistent community practices that evolved into binding rules. Natural law (habits) → Social customs (expected behavior) → Legal customs (recognized by courts or codified).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">2 Judicial Precedent (Stare Decisis)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Law made by courts – 'to stand by what has been decided.' Ensures consistency, predictability, and equality before the law. Higher courts' decisions bind lower courts.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">3 Legislation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Law made by Parliament – the most explicit and deliberate form of law. Bills become Acts through formal legislative process. Subsidiary legislation provides detailed rules.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">4 Roman-Dutch Law</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Zimbabwe's legal system inherited Roman-Dutch law from Dutch colonial expansion. Writers of legal scholars (Grotius, Voet) are authoritative sources in Roman-Dutch tradition.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                Principles of Modern Law
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">Just Application</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Legal rules must be honorable and fair.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Equality</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Law applies consistently to all, regardless of status.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Uniformity</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Same rules produce same outcomes in similar cases.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Authority</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Law must derive from legitimate source.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">Certainty</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Laws must be clear, unambiguous, and publicly known.</p>
                </div>
              </div>
            </div>

            {/* Constitution */}
            <div
              ref={(el) => {
                sectionRefs.current['constitution'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Constitution and Zimbabwe's Parliament
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 The Constitution – Supreme Law
              </h3>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  The Constitution is the foundational legal document – the supreme
                  law to which all other laws and governmental powers must conform.
                  It establishes the institutions of state (Executive, Legislature,
                  Judiciary), defines their powers and limits, and contains the
                  Declaration of Rights – fundamental freedoms guaranteed to every
                  citizen.
                </p>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 Three Branches of Government
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Building size={14} /> Legislature
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Parliament – makes laws. Debates, amends, and enacts legislation.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Crown size={14} /> Executive
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">President and Cabinet – implements policy, enforces laws, manages administration.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Scale size={14} /> Judiciary
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Courts – interprets laws, adjudicates disputes, ensures constitutional compliance.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                3 Zimbabwe's Bicameral Parliament
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">House of Assembly</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">150 members: 120 elected, 10 provincial governors, 8 chiefs, 12 appointed. Primary law-making body, debates national issues, controls government finances.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Senate</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">66 members: 50 elected provincial, President of Chiefs' Council, 8 chiefs, 6 appointed. Reviews legislation, safeguards national values, prevents hasty laws.</p>
                </div>
              </div>
            </div>

            {/* Declaration of Rights */}
            <div
              ref={(el) => {
                sectionRefs.current['declaration-rights'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Declaration of Rights
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 What Is the Declaration of Rights?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Chapter 3 of Zimbabwe's Constitution – a comprehensive catalogue
                of fundamental rights and freedoms guaranteed to every person,
                modeled on the UN Universal Declaration of Human Rights. These
                rights belong to you personally – knowing them is the first step
                to claiming and defending them.
              </p>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 Key Rights
              </h3>
              <div className="space-y-3 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Heart size={14} /> Right to Life
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The most fundamental right – the state cannot arbitrarily take a person's life. Exceptions: lawful execution for most serious crimes, justifiable force in self-defense.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Users size={14} /> Personal Liberty
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Protection against unlawful arrest and detention. Arrested persons must be informed of reason, brought to court promptly, have right to remain silent, and consult a lawyer.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Link size={14} /> Freedom from Slavery and Forced Labor
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Absolute prohibition on slavery. Forced labor prohibited except for convicted prisoners, public emergencies, or normal civic obligations.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <AlertTriangle size={14} /> Protection from Inhuman Treatment
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Prohibits torture and degrading treatment – reflects the inherent dignity of every human being.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <MessageCircle size={14} /> Freedom of Expression, Assembly, Movement
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Hold and express opinions, receive information, meet peacefully, move freely within and outside Zimbabwe – subject to necessary limitations for national security and public order.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2">
                    <Scale size={14} /> Protection from Discrimination
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Prohibits discrimination on grounds of race, tribe, origin, political opinion, color, creed, gender – allows for affirmative action and certain customary law exceptions.</p>
                </div>
              </div>
            </div>

            {/* Executive */}
            <div
              ref={(el) => {
                sectionRefs.current['executive'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Executive – President and Cabinet
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 The President
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Simultaneously Head of State, Head of Government, and Commander-in-Chief of Defence Forces. Qualifications: Zimbabwean citizen by birth/descent, at least 40 years old, ordinarily resident in Zimbabwe. Elected by registered voters. Term: 6 years (under Lancaster House Constitution).</p>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 Executive Functions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Chief Guardian of Constitution</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Upholds Constitution, ensures laws faithfully executed.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">Foreign Affairs</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Appoints diplomats, enters treaties, conducts foreign policy.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">Commander-in-Chief</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Declares martial law and war – ultimate military decisions.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Cabinet Relations</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Appoints Vice-Presidents and Ministers, dissolves Parliament.</p>
                </div>
              </div>
            </div>

            {/* Judiciary */}
            <div
              ref={(el) => {
                sectionRefs.current['judiciary'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Judiciary – Zimbabwe's Court System
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 Role and Importance
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                The Judiciary ensures both Legislature and Executive remain within
                constitutional limits and protects citizens' rights. Judicial
                independence is essential – judges must be free to decide cases
                according to law, without interference.
              </p>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 The Court System
              </h3>
              <div className="space-y-3 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Building size={14} /> Magistrates' Courts
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Entry point – handles most criminal and civil cases. Jurisdiction varies by magistrate rank. Civil cases up to $12,000; criminal cases up to 7 years imprisonment.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Landmark size={14} /> High Court
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Serious criminal and civil cases. Exclusive jurisdiction over murder, treason, rape. Hears appeals from Magistrates' Courts.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Gavel size={14} /> Supreme Court
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Highest court – court of final appeal. Primary function: hear appeals from High Court. Special original jurisdiction in Declaration of Rights cases.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                3 Appointment of Judges
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Qualifications</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Judge of unlimited jurisdiction or legal practitioner for at least 7 years.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">Appointment</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Appointed by President after consulting Judicial Service Commission.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Tenure & Removal</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Retire at 65 (or 70 if extended). Removed only for inability or serious misbehavior – requires formal tribunal.</p>
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
                International Relations
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 The Three Cs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Swords size={14} /> Conflict
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Disagreements ranging from diplomatic disputes to armed warfare. Arises from competition for resources, territory, ideology, trade, historical grievances.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <TrendingUp size={14} /> Competition
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ongoing rivalry for advantage in trade, technology, political influence, strategic positioning. Can drive innovation but can escalate into conflict.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Handshake size={14} /> Cooperation
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Recognition that many challenges require coordinated responses – climate change, pandemic disease, nuclear proliferation.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 Diplomacy
              </h3>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Diplomacy is the practice of managing formal relations between
                  governments through negotiation, representation, and communication.
                  Zimbabwe's foreign policy evolved from non-alignment during the
                  Cold War to the 'Look East' policy in the 2000s – redirecting
                  engagement toward China, Russia, and Asian countries in response
                  to Western diplomatic isolation.
                </p>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                3 Zimbabwe's International Engagements
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">United Nations</span> – broad platform for international cooperation</li>
                <li><span className="font-bold">African Union</span> – coordinates continental policies</li>
                <li><span className="font-bold">SADC</span> – Southern African Development Community</li>
                <li><span className="font-bold">COMESA</span> – Common Market for Eastern and Southern Africa</li>
              </ul>

              <div className="mt-6 p-4 bg-blue-700 text-white rounded-xl">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Flag size={18} className="text-yellow-300" /> 🇿🇼 Know Your Rights. Understand Your Laws. Engage Your World.
                </h4>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  💡 Legal Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-blue-500 dark:text-blue-400" />
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
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Branches of Government</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Key Rights</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Zimbabwe's heritage, laws, and governance structures are the
                foundation of its national identity. Understanding them is
                essential for active, informed citizenship and meaningful
                participation in the nation's future.
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
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-blue-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Heritage</strong> is living history – the Second Chimurenga is Zimbabwe's most defining modern heritage, embodying sovereignty, dignity, and self-determination.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">National symbols</strong> – the flag, anthem, Great Zimbabwe, and Victoria Falls – express Zimbabwe's identity, values, and history.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Law</strong> comes from customs, judicial precedent (stare decisis), legislation, and Roman-Dutch tradition. Key principles: just application, equality, uniformity, authority, certainty.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Government</strong> has three branches: Legislature (makes laws), Executive (implements laws), Judiciary (interprets laws) – each checks the others.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">The Declaration of Rights</strong> guarantees fundamental freedoms – life, liberty, freedom from slavery and torture, expression, assembly, movement, and non-discrimination.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">International relations</strong> are shaped by the Three Cs: Conflict, Competition, Cooperation – managed through diplomacy and international organizations like the UN, AU, SADC, and COMESA.
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
            Sidemann Academic Registry • NASS Heritage, Law &amp; Governance 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;