import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Flag,
  Globe,
  Leaf,
  Users,
  Scale,
  Shield,
  BookOpen,
  Target,
  Heart,
  Briefcase,
  Zap,
  CheckCircle,
  Lightbulb,
  Sprout,
  Gavel,
  Scroll,
  History,
  Landmark,
  Award,
  BarChart3,
  Map,
  Hammer,
  Info,
  Sun,
  RefreshCw,
  Search,
  X,
  ChevronUp,
  BookIcon,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'nass', label: 'NASS' },
  { id: 'expectations', label: 'Expectations' },
  { id: 'vision', label: 'Future Vision' },
  { id: 'purpose-modules', label: 'Purpose & Modules' },
  { id: 'natural-resources', label: 'Natural Resources' },
  { id: 'protecting-resources', label: 'Protecting' },
  { id: 'iks', label: 'IKS' },
  { id: 'significance-iks', label: 'Significance' },
  { id: 'key-insights', label: 'Key Insights' },
  { id: 'exam-tips', label: 'Tips' },
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
        text: 'NASS was introduced in Zimbabwean tertiary institutions to re-instill core civic values and patriotism, bridging the gap between academic knowledge and national responsibility.',
      },
      {
        title: 'Pro Tip',
        text: 'Indigenous Knowledge Systems (IKS) are not just historical – they are living systems of wisdom that can complement modern science in areas like medicine, agriculture, and conservation.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the goals of NASS with the acronym "P-S-S-C": Patriotism, Self-Discipline, Sovereignty, Contribution to National Development.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse "renewable" resources with "infinite". Forests are renewable only if used sustainably – overuse can deplete them.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'NASS was introduced in Zimbabwean tertiary institutions to re-instill core civic values and patriotism, bridging the gap between academic knowledge and national responsibility.',
      },
      {
        title: 'Pro Tip',
        text: 'Indigenous Knowledge Systems (IKS) are not just historical – they are living systems of wisdom that can complement modern science in areas like medicine, agriculture, and conservation.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the goals of NASS with the acronym "P-S-S-C": Patriotism, Self-Discipline, Sovereignty, Contribution to National Development.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse "renewable" resources with "infinite". Forests are renewable only if used sustainably – overuse can deplete them.',
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
            <Flag size={14} className="inline mr-1" /> NATIONAL & STRATEGIC STUDIES
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 1{' '}
            <span className="text-emerald-300 font-bold italic">
              NASS, IKS &amp; Natural Resources
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the foundational concepts of National and Strategic Studies:
            understanding NASS, Indigenous Knowledge Systems, natural resources,
            and the vision for a prosperous Zimbabwe.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> NASS
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Leaf size={14} className="inline mr-1" /> IKS
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Globe size={14} className="inline mr-1" /> Resources
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
                placeholder="Search for a concept, term, or module..."
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
                Introduction to Learning Outcome 1
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Welcome to NASS – National and Strategic Studies. This first learning outcome lays the foundation for understanding the purpose of NASS, the importance of Indigenous Knowledge Systems (IKS), and the stewardship of Zimbabwe's natural resources.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                    This module is about building responsible, patriotic citizens who understand their country's history, values, and natural heritage, and are equipped to contribute to national development.
                  </p>
</div>
            </div>

            {/* Section 1: What is NASS */}
            <div
              ref={(el) => {
                sectionRefs.current['nass'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                What is NASS?
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-2">
                1 Definition and Purpose
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                National and Strategic Studies (NASS) is a formal civic education program introduced in Zimbabwe's tertiary education system. It teaches students how to be responsible, active, and patriotic citizens. NASS bridges the gap between academic knowledge and civic responsibility.
              </p>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Lightbulb size={16} /> Simple Analogy
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Think of NASS like a 'citizenship school within your college.' Just as other courses teach technical skills, NASS teaches how to be a good, responsible Zimbabwean who contributes to national progress.</p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                2 Why Was NASS Created?
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Over time, Zimbabwean society experienced a decline in core civic values – greed, corruption, weakened patriotism, and breakdown of traditional social structures. NASS was created to re-instill these values and ensure educated citizens become agents of positive national transformation.
              </p>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                3 Goals of NASS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                    <Heart size={14} /> Patriotism
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Deep love and commitment to Zimbabwe, understanding its history, and feeling responsibility to protect and advance national interests.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Scale size={14} /> Self-Discipline
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ability to control behavior, actions, and choices – resisting corruption, maintaining work ethic, and holding oneself accountable.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Shield size={14} /> Sovereignty
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Understanding and defending Zimbabwe's right to govern itself freely without external interference.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Briefcase size={14} /> Contribution to National Development
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Using one's skills, career, and life choices to make Zimbabwe a better place.</p>
                </div>
              </div>
            </div>

            {/* Graduate Expectations */}
            <div
              ref={(el) => {
                sectionRefs.current['expectations'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                What NASS Expects from Graduates
              </h2>

              <div className="space-y-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400">1 Patriotism – A Deep Love and Commitment</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Genuine, informed love for Zimbabwe, demonstrated through ethical behavior, service, and decisions that prioritise national interests over personal gain.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">2 Professionalism – High Standards</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Maintaining high standards of quality, ethics, and integrity in one's profession – becoming a positive force in Zimbabwe's economy and society.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">3 Good Behavior – Acting Responsibly</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Making ethical, respectful, and socially responsible choices – being role models in communities and resisting corruption.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">4 Commitment to National Development</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Actively contributing to Zimbabwe's improvement – through work, civic engagement, innovation, and community service.</p>
                </div>
              </div>
            </div>

            {/* Future Vision */}
            <div
              ref={(el) => {
                sectionRefs.current['vision'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Future NASS Envisions for Zimbabwe
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">1 An Uncorrupted Society</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A Zimbabwe where integrity and honesty are the norm – citizens at all levels conduct themselves ethically.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">2 A Generation Committed to Their Country</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A generation that chooses to apply its skills within Zimbabwe, participates in civic processes, and feels a personal stake in national success.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">3 A Prosperous Zimbabwe Through Entrepreneurship</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Entrepreneurship as a patriotic act – building businesses that create jobs, generate tax, and reduce dependence on imports.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">4 A Strong and Independent Zimbabwe</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A nation that can negotiate from confidence, protect its resources, and solve its internal problems without external manipulation.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">5 A United Zimbabwe</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Citizens who see their shared national identity as more important than differences in ethnicity, language, religion, or politics.</p>
                </div>
              </div>
            </div>

            {/* Purpose and Modules */}
            <div
              ref={(el) => {
                sectionRefs.current['purpose-modules'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Purpose and Modules of NASS
              </h2>

              <div className="p-4 bg-indigo-600 text-white rounded-xl mb-4">
                <h3 className="text-sm font-bold">1 Core Purpose</h3>
                <p className="text-sm text-indigo-100">NASS aims to positively transform attitudes toward national identity and convert political achievements into real economic progress – honoring the liberation struggle by building the Zimbabwe those generations died for.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <History size={14} /> 5.2 Zimbabwe History and Heritage
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Provides thorough understanding of Zimbabwe's origins, indigenous communities, impact of colonialism, liberation struggle, and the events that shaped the modern state. Builds appreciation for indigenous knowledge and cultural heritage.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Landmark size={14} /> 5.3 Legal and Parliamentary Affairs
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Educates about Zimbabwe's legal framework, how laws are made, citizens' rights and responsibilities, and how to participate in democratic processes.</p>
                </div>
              </div>
            </div>

            {/* Natural Resources */}
            <div
              ref={(el) => {
                sectionRefs.current['natural-resources'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Natural Resources
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-2">
                1 What Are Natural Resources?
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Natural resources are materials, substances, and energy sources that exist in nature – created by natural processes. They are the raw materials from which civilization is built.
              </p>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                2 Types of Natural Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Sun size={14} /> A) Renewable Resources
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Resources that can replenish themselves naturally over a short period – sunlight, wind, water, forests, fish – if managed sustainably.</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <Zap size={14} /> B) Non-Renewable Resources
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Resources that exist in finite quantities and take millions of years to form – fossil fuels (coal, oil, natural gas), minerals (gold, platinum, diamonds).</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                3 Why Are Natural Resources Important?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Essentials</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Food, water, land for agriculture.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Energy</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Hydroelectric, solar, fossil fuels.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Materials</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Timber, metals, stone, sand for building.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Jobs and Economy</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Mining, agriculture, forestry, tourism.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Environmental Health</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Clean air, water, climate regulation, biodiversity.</p>
                </div>
              </div>
            </div>

            {/* Protecting Resources */}
            <div
              ref={(el) => {
                sectionRefs.current['protecting-resources'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Protecting Natural Resources
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-2">
                1 Traditional and Indigenous Methods
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Traditional communities practiced sustainable resource management: rotational farming, sacred forests (murambo), seasonal fishing bans, and community norms enforced through respect for elders and spiritual beliefs.
              </p>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                2 Modern Methods of Conservation
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                National parks, environmental impact assessments, satellite monitoring, remote sensing, environmental education, waste management, renewable energy, and integrated approaches combining modern and traditional methods.
              </p>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                3 Laws Protecting Natural Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">A) National Laws</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Zimbabwe's Environmental Management Act, Mines and Minerals Act, water, forestry, and wildlife legislation – regulate responsible resource use and impose penalties for violations.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">B) International Agreements</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Zimbabwe is signatory to the Convention on Biological Diversity, Paris Agreement, CITES – coordinating global efforts to protect biodiversity, climate, and endangered species.</p>
                </div>
              </div>
            </div>

            {/* Indigenous Knowledge Systems */}
            <div
              ref={(el) => {
                sectionRefs.current['iks'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Indigenous Knowledge Systems (IKS)
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-2">
                1 What Are Indigenous Knowledge Systems?
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                IKS are vast bodies of accumulated wisdom, skills, practices, and understanding built up by communities over hundreds or thousands of years through direct interaction with their environments. Passed down through oral traditions – stories, songs, ceremonies, apprenticeships.
              </p>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                  <Info size={16} /> Think of IKS Like This
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Imagine a doctor who has spent a thousand years treating patients in your village – generations of doctors, each learning from the previous, all using and perfecting the same knowledge. That accumulated experience is IKS.</p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                2 Components of IKS
              </h3>
              <div className="space-y-3 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">A) Traditional Technologies</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tools, techniques, and practices – water harvesting, traditional building, intercropping, agroforestry, pottery, weaving, metalworking.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">B) Knowledge of the Environment</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Detailed understanding of animal behavior, plant seasons, weather indicators, soil qualities, and ecological relationships.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">C) Social and Cultural Practices</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Customs, rituals, governance systems, reciprocity, community decision-making, and conflict resolution.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">D) Traditional Medicine</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Comprehensive knowledge of medicinal plants, healing practices, and spiritual dimensions of health – many treatments validated by modern science.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">E) Spiritual and Philosophical Beliefs</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Worldviews of interconnectedness, Ubuntu ('I am because we are'), sacredness of nature, community identity.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">F) Language and Oral Traditions</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Languages as repositories of knowledge, oral traditions (stories, proverbs, songs) carrying moral lessons, history, ecological knowledge, and philosophy.</p>
                </div>
              </div>
            </div>

            {/* Significance of IKS */}
            <div
              ref={(el) => {
                sectionRefs.current['significance-iks'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Meaning and Significance of IKS
              </h2>

              <div className="space-y-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">1 Sustainable Resource Management</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">IKS practices are designed for long-term sustainability – rotational grazing, seasonal restrictions, sacred groves, community rules preventing overexploitation.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">2 Biodiversity Conservation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Indigenous territories contain high biodiversity due to traditional practices – sacred groves, sustainable harvesting, protection of culturally significant species.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">3 Cultural Preservation and Identity</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">IKS is the living heart of cultural identity – its loss erodes community heritage and social cohesion. Preserving IKS is essential for national identity.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">4 Community Resilience</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">IKS provides knowledge to survive droughts, floods, and other challenges – traditional early warning systems, food preservation, water harvesting, medicinal responses.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">5 Potential for Innovation and Modern Science</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">IKS is a source of innovation – pharmaceuticals derived from traditional plants, agricultural insights, sustainable building techniques. Collaboration between IKS and modern science can yield breakthrough solutions.</p>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div
              ref={(el) => {
                sectionRefs.current['key-insights'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Key Insights from IKS
              </h2>

              <div className="space-y-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Lightbulb size={14} /> 10.1 Alternative Approaches to Problem-Solving
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">IKS offers holistic, locally appropriate approaches that complement modern scientific methods – expanding our intellectual toolkit.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Map size={14} /> 10.2 Local Solutions to Local Problems
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Effective solutions are deeply rooted in specific communities and environments – development must be participatory and locally adapted.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Leaf size={14} /> 10.3 Respect for Nature as a Guiding Principle
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Indigenous worldviews see humans as part of nature, not masters – offering a philosophy of living respectfully within natural limits.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users size={14} /> 10.4 The Importance of Community-Based Knowledge
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Knowledge is not only produced by experts – communities hold valuable, relevant knowledge that should be integrated into decision-making processes.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 size={14} /> 10.5 IKS as a Source of Long-Term Environmental Data
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Traditional ecological knowledge spans millennia – providing invaluable historical environmental data that complements modern scientific monitoring.</p>
                </div>
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Understand the "Why" Behind NASS</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Examiners want to see that you understand the purpose of NASS – not just definitions. Explain why it was created and what problems it aims to solve.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Use Examples in IKS Questions</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">When discussing IKS, always give real examples – traditional medicine, farming practices, water harvesting. Examples show you understand the concept practically.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Distinguish Renewable vs. Non-Renewable</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Be clear on the difference, and explain why sustainable use matters. Use Zimbabwe-specific examples like minerals (non-renewable) and forests (renewable if managed).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Connect Topics</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Show how NASS, IKS, and natural resource management are interconnected – e.g., IKS informs sustainable resource management, which is part of NASS's vision for national development.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Understand it. Own it. Build Zimbabwe. 🇿🇼</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 NASS Insight
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
                  <span>NASS Goals</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>IKS Components</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                NASS is about building responsible citizens who understand their
                country's history, value indigenous knowledge, and actively
                contribute to a prosperous, united, and independent Zimbabwe.
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
                <strong className="text-white">NASS</strong> is a civic education program that instills patriotism, self-discipline, sovereignty awareness, and commitment to national development.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Indigenous Knowledge Systems (IKS)</strong> are vast, community-developed wisdom passed through generations – covering technologies, environment, medicine, philosophy, and social practices.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Natural resources</strong> are the foundation of civilization – renewable (sun, water, forests) and non-renewable (minerals, fossil fuels) – and must be managed sustainably.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">IKS significance</strong> includes sustainable resource management, biodiversity conservation, cultural preservation, community resilience, and potential for innovation with modern science.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Key insights</strong> from IKS: alternative problem-solving, local solutions, respect for nature, community-based knowledge, and long-term environmental data.
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
            Sidemann Academic Registry • NASS Module LO1 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;