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
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'partition', label: 'Partition' },
  { id: 'reasons', label: 'Why Colonize?' },
  { id: 'berlin', label: 'Berlin Conference' },
  { id: 'missionaries', label: 'Missionaries' },
  { id: 'slavery', label: 'Slavery & Crimes' },
  { id: 'zimbabwe-colonization', label: 'Zimbabwe Colonized' },
  { id: 'pioneer-column', label: 'Pioneer Column' },
  { id: 'anglo-ndebele-war', label: 'Anglo-Ndebele War' },
  { id: 'exam-tips', label: 'Tips' },
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
        text: 'The Berlin Conference (1884-1885) divided Africa among European powers without any African representation. Most modern African borders were drawn in Berlin.',
      },
      {
        title: 'Pro Tip',
        text: 'The Rudd Concession of 1888 was the legal basis for the colonization of Zimbabwe. Lobengula was deceived into signing it, believing it was a limited mining agreement.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key dates: Berlin Conference (1884-85), Moffat Treaty (1888), Rudd Concession (1888), BSAC Charter (1889), Pioneer Column (1890), Anglo-Ndebele War (1893).',
      },
      {
        title: 'Common Mistake',
        text: 'Do not think colonization was a peaceful process. The Pioneer Column was an armed invasion, and the 1893 war was a deliberate act of conquest against the Ndebele kingdom.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The Berlin Conference (1884-1885) divided Africa among European powers without any African representation. Most modern African borders were drawn in Berlin.',
      },
      {
        title: 'Pro Tip',
        text: 'The Rudd Concession of 1888 was the legal basis for the colonization of Zimbabwe. Lobengula was deceived into signing it, believing it was a limited mining agreement.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key dates: Berlin Conference (1884-85), Moffat Treaty (1888), Rudd Concession (1888), BSAC Charter (1889), Pioneer Column (1890), Anglo-Ndebele War (1893).',
      },
      {
        title: 'Common Mistake',
        text: 'Do not think colonization was a peaceful process. The Pioneer Column was an armed invasion, and the 1893 war was a deliberate act of conquest against the Ndebele kingdom.',
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Globe size={14} className="inline mr-1" /> COLONIZATION OF AFRICA & ZIMBABWE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 3{' '}
            <span className="text-purple-300 font-bold italic">
              The Scramble &amp; Colonization
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Understand the partition of Africa, the Berlin Conference, the
            economic and political drivers of colonization, and the specific
            process through which Zimbabwe was colonized between 1885 and 1893.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Globe size={14} className="inline mr-1" /> Scramble
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scroll size={14} className="inline mr-1" /> Berlin 1884-85
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Flag size={14} className="inline mr-1" /> Zimbabwe 1890-93
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
                placeholder="Search for a treaty, event, or figure..."
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
                Introduction to the Colonization of Africa &amp; Zimbabwe
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The late 19th century witnessed one of the most dramatic
                    episodes in world history – the rapid, aggressive seizure of
                    virtually the entire African continent by European powers.
                    This learning outcome examines why colonization happened,
                    how it happened, and the specific process through which
                    Zimbabwe was colonized between 1890 and 1893.
                  </p>
</div>
            </div>

            {/* Section 1: Partition */}
            <div
              ref={(el) => {
                sectionRefs.current['partition'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Partition and Colonization of Africa
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-2">
                1 What Was the Scramble for Africa?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                The Scramble for Africa was the rapid, aggressive, and systematic
                seizure of virtually the entire African continent by European
                powers between roughly 1880 and 1900. European nations carved up
                a continent containing hundreds of millions of people, thousands
                of cultures, and immeasurable natural wealth – dividing it among
                themselves as though it were a cake at a dinner party. African
                people were entirely excluded from the negotiations that determined
                their political future.
              </p>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 mt-4">
                <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertTriangle size={16} /> Critical Point
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  By 1900, almost the entire continent of Africa was under European
                  colonial control. Only Ethiopia (which successfully resisted
                  Italian invasion) and Liberia (established by freed American
                  slaves) remained independent.
                </p>
              </div>
            </div>

            {/* Section 2: Why Colonize? */}
            <div
              ref={(el) => {
                sectionRefs.current['reasons'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Why Did Europe Colonize Africa?
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-2">
                1 Economic Reasons – The Primary Driver
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Factory size={14} /> A) Raw Materials
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Industrial Europe needed rubber, cotton, groundnuts, timber, and minerals – Africa was a rich resource repository.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <ShoppingCart size={14} /> B) New Markets
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">European factories produced surplus goods – colonies provided captive markets for manufactured products.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <TrendingUp size={14} /> C) Investment Opportunities
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Surplus European capital sought high returns in colonial mines, plantations, and infrastructure.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Users2 size={14} /> D) Employment
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Colonies offered emigration opportunities for European workers and officials, reducing social pressure at home.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                2 Political and Strategic Reasons
              </h3>
              <div className="space-y-3 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Flag size={14} /> A) European Rivalry and Prestige
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Colonies were symbols of national greatness. Even territories that were not economically profitable were sought for prestige – demonstrating global power and influence.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <Shield size={14} /> B) Strategic Military and Geopolitical Reasons
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Controlling strategically located territories protected trade routes, provided naval bases, and extended European military reach across the globe.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                3 Humanitarian Justifications – The Mask Over Exploitation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Abolition of Slave Trade</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Europeans claimed colonial rule was needed to end the Arab and African slave trade.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Missionary Work</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Presented as spreading Christianity and 'civilization' to African peoples.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">White Man's Burden</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Racist ideology that white Europeans had a duty to 'civilize' African peoples.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                4 Technological Advantages
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                    <Ship size={14} /> Steamboats
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Allowed Europeans to penetrate the African interior via major rivers like the Congo, Niger, and Zambezi.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Bomb size={14} /> Superior Military Technology
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Rapid-fire rifles and machine guns (like the Maxim gun) gave devastating advantage over African armies.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Pill size={14} /> Medical Advances
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Quinine prevented malaria, reducing European mortality in tropical Africa – 'the white man's grave.'</p>
                </div>
              </div>
            </div>

            {/* Section 3: Berlin Conference */}
            <div
              ref={(el) => {
                sectionRefs.current['berlin'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Berlin Conference (1884–1885) – Africa Divided
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-2">
                1 What Was the Berlin Conference?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                The Berlin Conference of 1884-1885 brought together representatives
                of the major European powers to establish agreed rules for the
                partition of Africa. African leaders and peoples were entirely
                excluded from the negotiations that determined the political future
                of their continent.
              </p>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <BookMarked size={16} /> Remember This
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  The borders of most African nations today – including Zimbabwe's –
                  were drawn by European diplomats in Berlin who had often never
                  visited the territories they were dividing. These artificial
                  borders cut across ethnic groups, languages, and pre-existing
                  political boundaries.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                2 Key Agreements
              </h3>
              <div className="space-y-3 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">A) Effective Occupation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A European power could only claim sovereignty over an African territory if it had physical presence and administrative control – this accelerated the scramble.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">B) Freedom of Navigation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Major African rivers (Congo, Niger) were declared open to vessels of all signatory nations – facilitating commercial and military penetration.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">C) Suppression of the Slave Trade</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Provided humanitarian cover for colonization – a profound irony given the forced labor systems colonial powers would impose.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">D) Recognition of King Leopold's Congo</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Leopold's Congo Free State became the site of horrific colonial atrocities – demonstrating the gap between humanitarian rhetoric and colonial reality.</p>
                </div>
              </div>
            </div>

            {/* Section 4: Missionaries */}
            <div
              ref={(el) => {
                sectionRefs.current['missionaries'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Missionaries in Zimbabwe – Faith, Power, and Complicity
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">1 Who Were the Missionaries?</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Christian missionaries – complex figures who genuinely believed they were doing God's work but often served as instruments of colonial conquest. Key figures include Robert Moffat, John Smith Moffat, Charles Helm, and Francois Coillard.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">2 What Did Missionaries Do?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Education</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Established schools – literacy and skills provided, but indigenous knowledge and culture were systematically denigrated.</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-xs font-bold text-green-600 dark:text-green-400">Medicine</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Introduced Western medicine, but discredited traditional healing practices and healers.</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                      <p className="text-xs font-bold text-purple-600 dark:text-purple-400">New Technologies</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Introduced new agricultural techniques, building styles, and manufactured goods, creating economic dependency.</p>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">Destruction of Traditions</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Attacked polygamy, initiation ceremonies, spirit mediums – undermining social cohesion and traditional authority.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">3 Missionaries as Agents of Conquest</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Some missionaries played direct roles in facilitating colonization. John Smith Moffat persuaded Lobengula to sign the Moffat Treaty, and Reverend Charles Helm was present at the Rudd Concession, translating (and omitting key implications) for Lobengula.</p>
                </div>
              </div>
            </div>

            {/* Section 5: Slavery and Crimes Against Humanity */}
            <div
              ref={(el) => {
                sectionRefs.current['slavery'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Slavery, Colonization, and Crimes Against Humanity
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">1 Understanding Slavery</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Slavery was a deeply inhumane system that treated human beings as property. The transatlantic slave trade kidnapped, transported, and enslaved an estimated 12-15 million African people. The wealth generated by enslaved African labor fueled the Industrial Revolution and created the foundations of modern Western prosperity.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">2 Connection Between Slavery and Colonization</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Slavery and colonization were two phases of the same project: the systematic exploitation of African people and resources for European benefit. When the slave trade was abolished, colonization emerged as a new form of exploitation – more efficient and harder to condemn in international law.</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">3 Colonization as a Crime Against Humanity</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Colonization involved forcible seizure of territories, subjugation without consent, systematic racial discrimination, destruction of political systems, and forced extraction of labor and resources – all hallmarks of crimes against humanity.</p>
                </div>
              </div>
            </div>

            {/* Section 6: Colonization of Zimbabwe */}
            <div
              ref={(el) => {
                sectionRefs.current['zimbabwe-colonization'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Colonization of Zimbabwe (1885–1893)
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-2">
                1 Cecil John Rhodes – The Architect
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Cecil John Rhodes was the single most important individual in
                Zimbabwe's colonization. A British-born businessman who made his
                fortune in South African diamonds, he pursued the 'Cape to Cairo'
                vision – a continuous strip of British-controlled territory across
                Africa. For Zimbabwe, his ambitions meant the end of African
                political sovereignty.
              </p>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                2 Why Was Zimbabwe Targeted?
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Mineral wealth</span> – perceived gold deposits, fueled by the memory of Great Zimbabwe's pre-colonial gold trade.</li>
                <li><span className="font-bold">Fertile agricultural land</span> – suitable for European-style farming.</li>
                <li><span className="font-bold">Strategic position</span> – between the Limpopo and Zambezi rivers, crucial for Rhodes's Cape to Cairo vision.</li>
                <li><span className="font-bold">Preventing Boer expansion</span> – Britain wanted to stop Boer encroachment northward from the Transvaal.</li>
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                3 The Treaties and Concessions
              </h3>
              <div className="space-y-3 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">The Grobler Treaty (1887)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Transvaal Boers negotiated a treaty with Lobengula, giving them significant advantages and alarming Britain. Lobengula was barred from trying Boers in his own courts, and Boer hunters were given free access.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">The Moffat Treaty (1888)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Reverend John Smith Moffat persuaded Lobengula to renounce the Grobler Treaty and promise not to enter agreements with any European power without British consent – placing Ndebele foreign policy under British supervision.</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">The Rudd Concession (1888) – The Greatest Deception</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Rhodes's agents (Rudd, Maguire, Thompson) persuaded Lobengula to sign a concession granting exclusive mineral rights. Rudd made oral promises that the document did not include. Lobengula, who could not read English, believed he was granting a small mining operation – he actually signed away control over all minerals in his territory.</p>
                  <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded">
                    <p className="text-xs font-bold text-red-700 dark:text-red-300">⚠️ This was deliberate fraud – the legal basis for colonization.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">The BSAC Charter (1889)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Rhodes lobbied the British government for a Royal Charter for his British South Africa Company. The Charter gave the BSAC the powers of a government – to make treaties, enforce laws, maintain a police force, and exercise legal jurisdiction.</p>
                </div>
              </div>
            </div>

            {/* Section 7: Pioneer Column */}
            <div
              ref={(el) => {
                sectionRefs.current['pioneer-column'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Invasion – The Pioneer Column (1890)
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">1 What Was the Pioneer Column?</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A military and settler force of approximately 200 volunteers and 500 armed troops that invaded and occupied Zimbabwe in 1890. Each settler was promised 3,000 acres of land and 15 gold mining claims upon arrival.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">2 The Strategic Route</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The column marched along the eastern borders of Ndebele territory, avoiding direct confrontation with Lobengula's forces. Forts were established at Tuli, Victoria, and Charter.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">3 Fort Salisbury</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">On September 12, 1890, the Pioneer Column reached the site of present-day Harare and raised the Union Jack, symbolizing the annexation of Mashonaland and the beginning of British colonial rule over 'Rhodesia.'</p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">4 Consequences for Shona Communities</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Land seizure – settlers claimed land that Shona communities had lived on for generations. African people were reclassified as 'squatters' on what was now legally European-owned land. Forced labor – displaced communities were coerced into working for European employers under exploitative conditions.</p>
                </div>
              </div>
            </div>

            {/* Section 8: Anglo-Ndebele War */}
            <div
              ref={(el) => {
                sectionRefs.current['anglo-ndebele-war'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The 1893 Anglo-Ndebele War – The Final Conquest
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">1 Build-Up to War</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The Ndebele kingdom under Lobengula was the last major obstacle to BSAC control. Escalating tensions, deliberate provocations, and fundamentally irreconcilable interests made war inevitable.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">2 BSAC Motivations</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Eliminate an organized African state that challenged colonial ideology</li>
                    <li>Covet Ndebele cattle wealth – the Victoria Agreement promised participants shares of cattle</li>
                    <li>Acquire Matabeleland to complete control between Limpopo and Zambezi</li>
                    <li>Rhodes's personal ambition – defeating the Ndebele enhanced his reputation</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">3 The Victoria Incident – Manufacturing a Pretext</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ndebele raids against Shona communities who had stopped paying tribute were portrayed by the BSAC as unprovoked attacks. Despite Lobengula's attempts to explain and communicate, the BSAC used the incident as justification for war.</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">4 Lobengula's Attempts at Peace</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Lobengula sent ambassadors to the BSAC and Queen Victoria, offering to negotiate. He ordered his forces not to attack white settlers. These diplomatic efforts were systematically ignored by the BSAC, which had already decided for war.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">5 The Military Campaign</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The BSAC launched a three-pronged invasion. The Battle of Mbembezi broke Ndebele resistance. Lobengula burned Bulawayo and fled north, dying shortly after. The Ndebele kingdom was destroyed.</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">6 Consequences</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                    <li>Mass seizure of Ndebele cattle – tens of thousands taken and distributed to settlers</li>
                    <li>Ndebele kingdom destroyed – age-regiment system disbanded, council structures abolished</li>
                    <li>Approximately 1 million acres allocated to European settlers</li>
                    <li>Ndebele people confined to less fertile reserves</li>
                    <li>Forced into the colonial labor system under exploitative conditions</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-900 dark:bg-black text-white rounded-xl">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <BookOpen size={18} className="text-yellow-400" /> Historical Reflection
                </h4>
                <p className="text-sm">The 1893 war planted seeds of resistance that would grow into the First Chimurenga (1896-97) – the first major armed resistance to BSAC colonization. Understanding 1893 is essential for understanding everything that followed in Zimbabwe's colonial history.</p>
              </div>
            </div>

            {/* Exam Tips */}
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 On the Berlin Conference</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Remember that African leaders were excluded, the 'effective occupation' doctrine accelerated the scramble, and the artificial borders drawn still shape Africa today.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 On the Rudd Concession</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Understand the deception – Lobengula thought he was granting a small mining operation, but the document actually gave Rhodes unlimited rights over all minerals. Reverend Helm's role in translating (and omitting key implications) is significant.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 On the 1893 War</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The BSAC deliberately provoked the war. The Victoria Incident was a manufactured pretext. Lobengula genuinely attempted peace. Superior firepower (Maxim guns) decided the outcome.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Connect the Topics</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Show how the Berlin Conference, economic motives, missionary activity, and Rhodes's ambitions all converged to produce Zimbabwe's colonization. Understanding these connections demonstrates deeper thinking.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Understand the past. Challenge injustice. Build a better Zimbabwe. 🇿🇼</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 History Insight
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
                  <span>Key Treaties</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Colonization Stages</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Colonization was not a peaceful civilizing mission – it was a
                violent conquest driven by economic exploitation, political
                rivalry, and racist ideology. Understanding this truth is
                essential for understanding Zimbabwe's history and present.
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
                <strong className="text-white">The Scramble for Africa</strong> (1880-1900) was the rapid, aggressive seizure of Africa by European powers – Africans were excluded from the decisions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Economic motives</strong> (raw materials, markets, investment, employment) were the primary drivers, with political and strategic reasons also important.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">The Berlin Conference</strong> (1884-85) formalized the scramble – African borders were drawn in Europe, ignoring existing ethnic and political boundaries.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Zimbabwe's colonization</strong> was driven by Rhodes's ambitions, achieved through deceptive treaties (Moffat, Rudd), the BSAC Charter, the Pioneer Column invasion (1890), and the 1893 war that destroyed the Ndebele kingdom.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">The legacy</strong> includes land dispossession, forced labor, destroyed political systems, and seeds of resistance that would grow into the Chimurenga wars.
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
            Sidemann Academic Registry • NASS Colonization of Africa &amp; Zimbabwe 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;