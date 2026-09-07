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
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'historical-periods', label: 'Historical Periods' },
  { id: 'great-zimbabwe', label: 'Great Zimbabwe' },
  { id: 'socio-economic', label: 'Socio-Economic' },
  { id: 'mutapa', label: 'Mutapa' },
  { id: 'rozvi', label: 'Rozvi' },
  { id: 'ndebele', label: 'Ndebele' },
  { id: 'governance', label: 'Governance' },
  { id: 'influence', label: 'Influence' },
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
        text: 'Great Zimbabwe was built and inhabited by the Shona people between the 11th and 15th centuries. Its stone walls are the largest ancient structures in sub-Saharan Africa.',
      },
      {
        title: 'Pro Tip',
        text: 'The name "Zimbabwe" comes from "Dzimba dza mabwe" meaning "houses of stone" – a direct reference to the Great Zimbabwe ruins.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the pre-colonial states in chronological order: Great Zimbabwe → Mutapa → Rozvi → Ndebele.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse the Rozvi and Ndebele states. The Rozvi were a Shona state that expelled the Portuguese; the Ndebele were a later Nguni-speaking state that arrived during the Mfecane.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Great Zimbabwe was built and inhabited by the Shona people between the 11th and 15th centuries. Its stone walls are the largest ancient structures in sub-Saharan Africa.',
      },
      {
        title: 'Pro Tip',
        text: 'The name "Zimbabwe" comes from "Dzimba dza mabwe" meaning "houses of stone" – a direct reference to the Great Zimbabwe ruins.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the pre-colonial states in chronological order: Great Zimbabwe → Mutapa → Rozvi → Ndebele.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse the Rozvi and Ndebele states. The Rozvi were a Shona state that expelled the Portuguese; the Ndebele were a later Nguni-speaking state that arrived during the Mfecane.',
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
                ? 'bg-amber-700 text-white shadow-md shadow-amber-200 dark:shadow-amber-900/30'
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
            <History size={14} className="inline mr-1" /> ZIMBABWE HISTORY & HERITAGE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 2{' '}
            <span className="text-sky-300 font-bold italic">
              Pre-Colonial Zimbabwe
            </span>
          </h1>
          <p className="text-lg text-amber-100 max-w-2xl leading-relaxed">
            Explore the rich history of pre-colonial Zimbabwe: Great Zimbabwe,
            the Mutapa Empire, the Rozvi State, and the Ndebele Kingdom. Understand
            their governance, economies, and lasting influence on modern Zimbabwe.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-amber-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Castle size={14} className="inline mr-1" /> Great Zimbabwe
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Crown size={14} className="inline mr-1" /> Mutapa
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Ndebele
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-amber-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, state, or period..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-amber-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-amber-200" />
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
                Introduction to Zimbabwe History and Heritage
              </h2>

              <div className="p-4 sm:p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Zimbabwe's history is rich and complex, stretching back millennia. Pre-colonial civilizations like Great Zimbabwe, the Mutapa Empire, the Rozvi State, and the Ndebele Kingdom demonstrate sophisticated governance, trade, and culture. Understanding this heritage is essential for building national identity and pride.
                  </p>
</div>
            </div>

            {/* Historical Periods */}
            <div
              ref={(el) => {
                sectionRefs.current['historical-periods'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Understanding the Historical Periods
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">1 Pre-Colonial Period</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The time before European colonization – the centuries when African peoples lived, organized societies, built empires, and developed civilizations entirely on their own terms. Includes Great Zimbabwe, Mutapa, Rozvi, and Ndebele.</p>
                  <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-amber-600">💡 Why this matters:</span> The pre-colonial period proves that African people were already organized, civilized, and self-governing long before European contact.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">2 Colonial Period</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">From 1890 (colonization by the British South Africa Company) to 1980 – defined by foreign governance, economic exploitation, racial segregation, and the dismantling of indigenous systems. Effects continue to shape Zimbabwe today.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">3 Independent Period</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Begins April 18, 1980 – Zimbabwe gains independence after a long liberation struggle. Moment of national hope and the beginning of self-governance.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">4 Post-Independence Period</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">From 1980 to the present – nation-building, land reform, economic challenges, and the ongoing process of forging a shared Zimbabwean identity.</p>
                </div>
              </div>
            </div>

            {/* Great Zimbabwe */}
            <div
              ref={(el) => {
                sectionRefs.current['great-zimbabwe'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Great Zimbabwe – The Stone House Civilization
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">1 What Was Great Zimbabwe?</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A powerful, sophisticated, and prosperous state that flourished before the 15th century. Known for extraordinary dry-stone architecture – the largest ancient stone structures south of the Sahara. Capital of a regional state, home to 10,000–20,000 people, and a hub of long-distance trade.</p>
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-blue-600">🏛️ Key Fact:</span> The name 'Zimbabwe' was inspired by this civilization, chosen at independence to reflect the nation's indigenous heritage.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">2 Who Built It?</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Built by the Shona people, ancestors of the majority of Zimbabwe's current population. Colonial-era attempts to credit Phoenicians or Arabs have been comprehensively debunked.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">3 The Stone Structures</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Served multiple functions: security (defensible enclosures), religious/ceremonial purposes, symbols of prestige and power, and social/economic organization. Construction began around 1200 CE.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">4 Political Organization</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Highly centralized state under the Mambo (king), who held supreme political, economic, and religious authority. Supported by a ruling class of nobles and administrators, collecting tribute from subordinate chiefdoms.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">5 Economic Life</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Diverse economy based on agriculture (millet, sorghum), livestock (cattle as wealth), and long-distance trade in gold and ivory, connecting to the Swahili Coast and Indian Ocean world. Imported glass beads from India and porcelain from China.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">6 Historical Evidence</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Oral traditions, Portuguese and Arab writings, and archaeology (stone structures, pottery, beads, animal bones) provide a rich picture of the civilization.</p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">7 Causes of Decline</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Overpopulation, resource depletion (salt, land, forests), internal conflicts, environmental factors (droughts), and emigration, most notably by Nyatsimba Mutota who established the Mutapa Empire.</p>
                </div>
              </div>
            </div>

            {/* Socio-Economic Organization */}
            <div
              ref={(el) => {
                sectionRefs.current['socio-economic'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Pre-Colonial Socio-Economic Organization
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">1 Agriculture</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Foundation of the economy – millet, sorghum, and later maize. Livestock, especially cattle, were the primary store of wealth, used for lobola and as symbols of status.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">2 Trade Networks</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Extensive regional and international trade – gold and ivory exported to the Swahili Coast, importing beads, porcelain, and cloth. Great Zimbabwe and Mutapa were integrated into global trade networks.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">3 Social Hierarchy</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Stratified societies: ruling class (kings, nobles, royalty), commoners (farmers, craftspeople, herders), and occasionally enslaved people. Land was held communally, allocated by chiefs.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">4 The Tribute System</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A fundamental political-economic mechanism – subordinate communities delivered goods, services, or labor to the central authority as a sign of submission and support. Could become oppressive if demands were excessive.</p>
                </div>
              </div>
            </div>

            {/* Mutapa */}
            <div
              ref={(el) => {
                sectionRefs.current['mutapa'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Mutapa State – Lord of Conquering
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">1 Foundation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Founded by Nyatsimba Mutota, who departed Great Zimbabwe (possibly seeking salt or due to succession disputes) and conquered northward into the Zambezi Valley. Earned the title 'Munhumutapa' – Lord of Conquering.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">2 Political Structure</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Centralized state under the Munhumutapa, supported by a council of advisors. Provinces governed by appointed governors. Women held significant positions, including co-rulership (e.g., Nehanda). Large standing army.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">3 Religion and Culture</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Shared Shona beliefs: worship of Mwari (supreme creator), ancestral spirits (Mondoros) mediated through spirit mediums like Dzivaguru, Nehanda, and Chaminuka. Spirit mediums played crucial political roles.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">4 Economy and Portuguese Impact</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Agriculture, livestock, craft production, and long-distance trade in gold and ivory. Portuguese involvement brought destabilization: increased demands, guns, prazeros (Portuguese settlements), and interference in succession.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">5 Mining and Hunting</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Mining (gold, iron, copper, silver) was crucial but disrupted by Portuguese pressure. Hunting transformed from subsistence to commercial ivory trade, with ecological consequences.</p>
                </div>
              </div>
            </div>

            {/* Rozvi */}
            <div
              ref={(el) => {
                sectionRefs.current['rozvi'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Rozvi State – Masters of the Plateau
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">1 Rise Under Changamire Dombo</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Rose to prominence around 1634, established capital at Thabazikamambo. Exceptional military strength – defeated and expelled the Portuguese from the plateau. Controlled territory between Zambezi and Limpopo.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">2 Political Structure</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Centralized under the Changamire, with tribute from subordinate chiefs. Strong military organization and religious institutions reinforced legitimacy.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">3 Decline and Collapse</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Destroyed by the Mfecane: Zwangendaba's Nguni, Sebitwane's Kololo, and finally Mzilikazi's Ndebele between 1836-1840. Rapid sequence of defeats overwhelmed the state.</p>
                </div>
              </div>
            </div>

            {/* Ndebele */}
            <div
              ref={(el) => {
                sectionRefs.current['ndebele'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Ndebele State – A Warrior Kingdom
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">1 Origins</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Born from the Mfecane – originally Khumalo clan under Mzilikazi, broke from Shaka around 1821, led a migration northward, eventually settling in southwestern Zimbabwe and establishing Bulawayo.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">2 Sphere of Influence</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Concentric zones: direct Ndebele rule (Bulawayo heartland), indirect rule (tributary Shona/Kalanga), raided areas, and beyond reach – sophisticated political influence management.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">3 Social Caste Structure</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Zansi (original Nguni, aristocracy), Enhla (Sotho/Tswana absorbed), Hole (Shona/Kalanga conquered). Social mobility possible through military service.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">4 Economic System</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pastoralism (cattle central), raiding, tribute, cultivation, trade (ivory), and subsidiary activities (pottery, basketry, fishing).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">5 Religion</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Blend of Nguni (Nkulunkulu), Shona (spirit mediums), and Venda (Njelele rain-making cult). King served as chief priest.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">6 Political System</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Highly centralized and militaristic under the king. Supported by Umphakhathi (inner council) and iZikhulu (larger council). Age regiments (amabutho) served military and social functions.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">7 Lineage and Succession</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Patrilineal descent within the Khumalo dynasty. Succession of Lobengula after Mzilikazi (1868) was contested because his mother was Enhla, illustrating tensions at the intersection of caste and royal power.</p>
                </div>
              </div>
            </div>

            {/* Governance */}
            <div
              ref={(el) => {
                sectionRefs.current['governance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Systems of Governance in Pre-Colonial States
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">1 Comparative Overview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                      <p className="text-xs font-bold text-amber-700">Great Zimbabwe</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Centralized Mambo with ruling class controlling trade and tribute.</p>
                    </div>
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <p className="text-xs font-bold text-blue-700">Mutapa</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Munhumutapa with provincial governors; spirit mediums as political actors.</p>
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-xs font-bold text-green-700">Rozvi</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Centralized under Changamire, military strength key.</p>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <p className="text-xs font-bold text-red-700">Ndebele</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Highly centralized, militaristic, with caste hierarchy and age regiments.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">2 Common Features</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Centralized Authority</span> – paramount ruler as ultimate source of power.</li>
                    <li><span className="font-bold">Hierarchical Structures</span> – chains of authority from ruler to community.</li>
                    <li><span className="font-bold">Tribute Systems</span> – regular transfer of goods/services to the center.</li>
                    <li><span className="font-bold">Military Organization</span> – armies for defense, conquest, and internal control.</li>
                    <li><span className="font-bold">Religious Influence</span> – rulers as sacred figures, spirit mediums as advisors.</li>
                    <li><span className="font-bold">Oral Traditions</span> – primary means of preserving history, law, and culture.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Influence */}
            <div
              ref={(el) => {
                sectionRefs.current['influence'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Influence on Contemporary Zimbabwe
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">1 National Identity</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The name 'Zimbabwe' and the Zimbabwe Bird (from Great Zimbabwe) are national symbols. Pride in pre-colonial achievement provides psychological foundation against colonial dehumanization.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">2 Traditional Leadership</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Chieftaincy continues, legally recognized in land allocation, customary law, and community mediation – a direct legacy of pre-colonial governance.</p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">3 Land Issues</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The land question is deeply rooted in pre-colonial communal tenure vs. colonial dispossession. Understanding this history is essential for engaging with contemporary land reform debates.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">4 Cultural Values, Language, and Spirituality</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Shona and Ndebele languages, Ubuntu philosophy, ancestral spirit veneration, and customary law continue to shape social life and community organization.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">5 Architectural Inspiration</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Great Zimbabwe's dry-stone architecture influences contemporary design and national symbolism. A reminder of what Zimbabweans have achieved and can achieve again.</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-700 text-white rounded-xl">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <BookOpen size={18} className="text-yellow-300" /> Historical Reflection
                </h4>
                <p className="text-sm">The study of pre-colonial history is not simply about the past – it is a resource for thinking about who Zimbabweans are, what they have achieved, and what they might become.</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-amber-100 dark:border-amber-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  💡 History Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-amber-500 dark:text-amber-400" />
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
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Pre-Colonial States</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Historical Periods</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">4</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Zimbabwe's pre-colonial civilizations demonstrate sophisticated governance,
                trade, and culture. Understanding this history is essential for building
                national pride, identity, and a foundation for future development.
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
          className="w-12 h-12 bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-amber-700 to-amber-900 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-amber-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-amber-300 font-bold">•</span>
              <span>
                <strong className="text-white">Great Zimbabwe</strong> (11th-15th c.) was a powerful Shona state with remarkable stone architecture and extensive trade networks.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-300 font-bold">•</span>
              <span>
                <strong className="text-white">Mutapa Empire</strong> founded by Nyatsimba Mutota; expanded north, controlled gold trade, and faced Portuguese destabilization.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-300 font-bold">•</span>
              <span>
                <strong className="text-white">Rozvi State</strong> under Changamire Dombo expelled the Portuguese; collapsed due to Mfecane invasions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-300 font-bold">•</span>
              <span>
                <strong className="text-white">Ndebele State</strong> under Mzilikazi was a highly centralized, militaristic kingdom with a distinct caste system.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-300 font-bold">•</span>
              <span>
                <strong className="text-white">Common governance</strong> included centralized authority, hierarchies, tribute, military organization, religious influence, and oral traditions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-300 font-bold">•</span>
              <span>
                <strong className="text-white">Legacy</strong> includes national identity, traditional leadership, land issues, cultural values, and architectural inspiration.
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
            Sidemann Academic Registry • NASS Zimbabwe History & Heritage 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;