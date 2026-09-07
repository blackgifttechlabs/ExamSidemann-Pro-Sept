import React, { useState, useEffect, useRef } from 'react';
import {
  Microchip,
  MemoryStick,
  Wrench,
  ClipboardList,
  Lightbulb,
  GraduationCap,
  Brain,
  ChevronRight,
  Search,
  Database,
  RefreshCw,
  BookOpen,
  ChevronUp,
  X,
  Sparkles,
  Target,
  Users,
  Scale,
  Globe,
  Lock,
  HardDrive,
  Server,
  Cpu,
  Zap,
  Cog,
  Box,
  Shield,
  Thermometer,
  Cable,
  PlugZap,
  AirVent,
  ShieldAlert,
  HardDrive as HardDriveIcon,
  SquareStack,
  Component,
  Circle,
  ListChecks,
  Activity,
  Gauge,
  Monitor,
  Fan,
  Power,
  Clock,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { AdSense } from '../../../../analytics/AdSense';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'site-prep', label: 'Site Prep' },
  { id: 'compatibility', label: 'Compatibility' },
  { id: 'documentation', label: 'Documentation' },
  { id: 'assembly', label: 'Assembly' },
  { id: 'microprocessors', label: 'Microprocessors' },
  { id: 'memory', label: 'Memory' },
  { id: 'cache', label: 'Cache' },
  { id: 'motherboard', label: 'Motherboard' },
  { id: 'bus-architecture', label: 'Bus Architecture' },
  { id: 'bios-cmos-irq', label: 'BIOS/CMOS/IRQ' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'testing', label: 'Testing' },
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
        text: 'Moore\'s Law states that transistor density on microchips doubles approximately every two years, driving consistent performance improvements.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use an anti-static wrist strap when handling computer components to prevent ESD damage.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember cache levels: L1 is smallest and fastest, L2 is larger, L3 is largest and shared between cores.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse DIMM and SO-DIMM – DIMM is for desktops, SO-DIMM is for laptops and mini-PCs.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Moore\'s Law states that transistor density on microchips doubles approximately every two years, driving consistent performance improvements.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use an anti-static wrist strap when handling computer components to prevent ESD damage.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember cache levels: L1 is smallest and fastest, L2 is larger, L3 is largest and shared between cores.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse DIMM and SO-DIMM – DIMM is for desktops, SO-DIMM is for laptops and mini-PCs.',
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

  // ─── Quiz state ──────────────────────────────────────────────────────────
  const [quiz1Answer, setQuiz1Answer] = useState<number | null>(null);
  const [quiz2Answer, setQuiz2Answer] = useState<number | null>(null);
  const [quiz3Answer, setQuiz3Answer] = useState<number | null>(null);
  const [quiz4Answer, setQuiz4Answer] = useState<number | null>(null);

  const [showQuiz1Result, setShowQuiz1Result] = useState(false);
  const [showQuiz2Result, setShowQuiz2Result] = useState(false);
  const [showQuiz3Result, setShowQuiz3Result] = useState(false);
  const [showQuiz4Result, setShowQuiz4Result] = useState(false);

  const checkAnswer = (quizNumber: number, selectedAnswer: number, correctAnswer: number) => {
    switch(quizNumber) {
      case 1: setQuiz1Answer(selectedAnswer); setShowQuiz1Result(true); break;
      case 2: setQuiz2Answer(selectedAnswer); setShowQuiz2Result(true); break;
      case 3: setQuiz3Answer(selectedAnswer); setShowQuiz3Result(true); break;
      case 4: setQuiz4Answer(selectedAnswer); setShowQuiz4Result(true); break;
    }
  };

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Database size={14} className="inline mr-1" /> HARDWARE INSTALLATION
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 5{' '}
            <span className="text-rose-300 font-bold italic">
              Hardware Installation & Testing
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the complete lifecycle of hardware — from site preparation and
            assembly to memory types, motherboard architecture, troubleshooting,
            and rigorous testing.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Wrench size={14} className="inline mr-1" /> Assembly
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Microchip size={14} className="inline mr-1" /> Microprocessors
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
                placeholder="Search for a component, bus, or test..."
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
      <div id="lesson-scroll-area" className="mx-auto px-[5px] sm:px-6 md:px-8 py-8">
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
                Introduction to Hardware Installation & Testing
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Installing computer hardware is not just about plugging things in. It requires careful site preparation, understanding of compatibility, systematic assembly, knowledge of memory and motherboard architecture, and thorough testing. This learning outcome covers the entire journey — from planning to final verification.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Building a computer is like constructing a house. You start with a solid foundation (site prep), make sure all parts fit together (compatibility), follow a blueprint (documentation), assemble piece by piece (assembly), and finally test everything (testing) to ensure it's safe and functional.
                </p>
              </div>
            </div>

            {/* Site Preparation */}
            <div
              ref={(el) => {
                sectionRefs.current['site-prep'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Preparing a Hardware Installation Site
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Before installing any hardware — especially in a professional setting — you must properly prepare the site. This ensures safety, longevity, and optimal performance.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><MapPin size={14} /> Site Location</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Accessibility, security, environmental conditions (temperature, humidity, cleanliness).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><ShieldAlert size={14} /> Fire Suppression</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Use gas-based systems (CO2, inert gas) — water damages electronics. Comply with local regulations.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><Cable size={14} /> Cable Routing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Plan cable paths, label everything, maintain airflow and cleanliness.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-1"><PlugZap size={14} /> Lighting & Power</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Adequate lighting, verify power capacity, voltage, and proper grounding.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1"><Box size={14} /> Space Requirements</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Equipment footprint, ventilation clearance, access clearance for maintenance.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1"><AirVent size={14} /> Air Conditioning</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Evaluate heat load, use precision AC units for server rooms.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"><Shield size={14} /> Electromagnetic Compatibility (EMC)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Identify sources of EMI (machinery, radio transmitters) and minimize impact through shielding, grounding, and distance.</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">💡 Why It Matters</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Proper site preparation prevents overheating, electrical faults, data loss, and improves maintenance efficiency. Skipping this step leads to costly failures.</p>
              </div>
            </div>

            {/* Compatibility */}
            <div
              ref={(el) => {
                sectionRefs.current['compatibility'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Hardware and Software Compatibility
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">Hardware Compatibility</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Physical components must work together: CPU socket type, RAM type/speed, expansion slots (PCIe), power supply connectors.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">Software Compatibility</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Operating system support, driver availability, minimum hardware requirements, dependencies.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">Common Compatibility Problems</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li>Outdated hardware running new software (e.g., old CPU not supporting modern instructions)</li>
                  <li>Operating system conflicts (e.g., driver not signed for Windows 11)</li>
                  <li>Driver issues (missing, outdated, or incompatible drivers)</li>
                  <li>Resource limitations (insufficient RAM, storage, or power)</li>
                  <li>Missing dependencies (e.g., .NET Framework, Visual C++ Redistributable)</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">How to Minimize Problems</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li>Check system requirements before installing software</li>
                  <li>Keep everything updated — OS, drivers, and software</li>
                  <li>Verify hardware compatibility using manufacturer's compatibility lists</li>
                  <li>Consult professionals for complex installations</li>
                </ul>
              </div>
            </div>

            {/* Documentation */}
            <div
              ref={(el) => {
                sectionRefs.current['documentation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Documenting Hardware Installation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-stone-600 dark:text-stone-400">Why Documentation Matters</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Creates a reference for future work</li>
                    <li>Enables knowledge sharing</li>
                    <li>Supports warranty claims and audits</li>
                    <li>Ensures compliance with policies</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-stone-600 dark:text-stone-400">What to Document</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><span className="font-bold">Before:</span> Hardware details, existing configuration</li>
                    <li><span className="font-bold">During:</span> Each step, photos of complex parts</li>
                    <li><span className="font-bold">After:</span> Test results, final configuration</li>
                    <li><span className="font-bold">Storage:</span> Save in a secure, accessible location</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-stone-600 dark:text-stone-400">Example — RAM Upgrade Documentation</h4>
                <div className="bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                  <p><span className="font-bold">Title:</span> RAM Upgrade — Desktop PC XYZ — 2025-01-15</p>
                  <p><span className="font-bold">Technician:</span> [Name]</p>
                  <p><span className="font-bold">What was installed:</span> 8GB DDR4-3200MHz RAM module</p>
                  <p><span className="font-bold">Pre-installation notes:</span> Verified existing configuration was 1 × 8GB DDR4-2666MHz</p>
                  <p><span className="font-bold">Installation steps:</span> Powered down, opened case, located empty slot, installed new RAM</p>
                  <p><span className="font-bold">Post-installation verification:</span> BIOS shows 16GB total RAM, Windows confirms</p>
                </div>
              </div>
            </div>

            {/* Assembly */}
            <div
              ref={(el) => {
                sectionRefs.current['assembly'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Assembling Computer Hardware — Step by Step
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-4">
                <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400">Before You Touch Anything — Safety First</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li>Power down and unplug all cables.</li>
                  <li>Use ESD protection (anti-static wrist strap, grounded mat).</li>
                  <li>Work on a clean, well-lit, non-carpeted surface.</li>
                  <li>Read the manual for each component before installation.</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">Step 1: Install the CPU</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Align the CPU with the socket (notch/gold triangle), gently lower, secure with lever.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-green-600 dark:text-green-400 block mb-1">Step 2: Install RAM Modules</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Align the notch, insert at a slight angle, press firmly until clips click.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">Step 3: Install Storage Drives</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Mount drives in bays, secure with screws, connect data and power cables.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-yellow-600 dark:text-yellow-400 block mb-1">Step 4: Mount the Motherboard</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Install standoffs, place motherboard, secure with screws.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-orange-600 dark:text-orange-400 block mb-1">Step 5: Install the PSU</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Slide into bay, secure, connect 24-pin ATX and 8-pin EPS connectors.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-pink-600 dark:text-pink-400 block mb-1">Step 6: Install Optional Components</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Graphics card into PCIe x16 slot, case fans, etc.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-cyan-600 dark:text-cyan-400 block mb-1">Step 7: Cable Management</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Route cables neatly, use zip ties, keep away from fans.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">Step 8: Close Up and Power On</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Close case, reconnect peripherals, power on, listen for beep codes, enter BIOS.</p>
                </div>
              </div>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What is the most important safety precaution when assembling computer hardware?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 2)} /> a) Wearing gloves
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 2)} /> b) Using an anti-static wrist strap
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 2)} /> c) Having a fire extinguisher nearby
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 2 ? '✅ Correct! ESD protection prevents damage to sensitive components.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Microprocessors */}
            <div
              ref={(el) => {
                sectionRefs.current['microprocessors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Microprocessors — Modes, Packaging, and Trends
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">Operating Modes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400">Real Mode</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Oldest mode, limited memory (640KB), single-tasking. Essentially obsolete.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400">Protected Mode</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Enabled multitasking, memory protection, stability. Foundation of modern OS.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400">Long Mode (64-bit)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Modern mode with vast memory addressing and 64-bit data processing.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Packaging Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">PGA (Pin Grid Array)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pins on the CPU insert into socket holes. Used by AMD.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">LGA (Land Grid Array)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Flat contact pads on CPU; pins in motherboard socket. Used by Intel.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">BGA (Ball Grid Array)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Soldered directly onto board. Common in laptops and mobile devices.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Development Trends</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-2">
                <p className="font-bold text-indigo-600 dark:text-indigo-400">Moore's Law</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Transistor count on a chip doubles approximately every two years, driving consistent performance improvements.</p>
                <p className="font-bold text-indigo-600 dark:text-indigo-400">CISC vs RISC</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3"><span className="font-bold">CISC</span> — complex instruction sets (Intel/AMD). <span className="font-bold">RISC</span> — simpler, faster instructions (ARM, Apple M-series).</p>
                <p className="font-bold text-indigo-600 dark:text-indigo-400">Multi-core Processors</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Multiple processing cores on a single chip, enabling genuine parallel processing.</p>
              </div>
            </div>

            {/* Memory */}
            <div
              ref={(el) => {
                sectionRefs.current['memory'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Computer Memory — Types and Packaging
              </h2>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">Volatile Memory (Lost When Power Goes Off)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">SRAM (Static RAM)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Extremely fast, expensive. Used for CPU cache memory.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">DRAM (Dynamic RAM)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Standard main memory. Slower but cheaper. Needs constant refreshing.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">SDRAM (Synchronous DRAM)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Synchronized with system clock for improved performance.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">DDR SDRAM</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Double Data Rate — transfers data on both clock edges. Generations: DDR2, DDR3, DDR4, DDR5.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Non-Volatile Memory (Retained Without Power)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">ROM (Read-Only)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Data written during manufacture, cannot be changed. Stores BIOS/firmware.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">PROM</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Programmable ROM — can be written once after manufacture.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">EEPROM</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Electrically Erasable — can be rewritten without special hardware. Enables BIOS updates.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Memory Packaging</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">DIMM</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Standard desktop memory module format.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">SO-DIMM</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Smaller version for laptops and mini-PCs.</p>
                </div>
              </div>

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which type of memory is used for CPU cache?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 1)} /> a) SRAM
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 1)} /> b) DRAM
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 2, 1)} /> c) EEPROM
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 1 ? '✅ Correct! SRAM is fast and used for cache.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
              </div>
            </div>

            {/* Cache */}
            <div
              ref={(el) => {
                sectionRefs.current['cache'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Cache Memory — The CPU's Fast Lane
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Cache memory is a small amount of extremely fast memory built directly into or very close to the CPU. It stores copies of the most frequently used data and instructions, allowing the CPU to access them almost instantly instead of waiting for RAM.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400">L1 Cache</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Smallest and fastest, located on each CPU core. Access time: a few clock cycles.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400">L2 Cache</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Larger than L1, slightly slower. Acts as buffer between L1 and main memory.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400">L3 Cache</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Largest cache level, shared between all cores. Slower than L2 but much faster than RAM.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400">Related Concepts</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><span className="font-bold">Cache Coherence:</span> Ensures all cores have consistent, up-to-date copies of data.</li>
                  <li><span className="font-bold">VRAM:</span> Dedicated memory on graphics card for storing graphics data.</li>
                  <li><span className="font-bold">Virtual Memory:</span> Uses hard drive space as temporary RAM when physical RAM is full.</li>
                  <li><span className="font-bold">ECC Memory:</span> Error-Correcting Code memory that detects and corrects single-bit errors.</li>
                </ul>
              </div>
            </div>

            {/* Motherboard */}
            <div
              ref={(el) => {
                sectionRefs.current['motherboard'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Motherboard Architecture — Integrated vs Non-Integrated
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Integrated Motherboards</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Key components (GPU, sound, network) built directly onto the motherboard. Advantages: cost, simplicity, space-efficient. Disadvantages: limited upgradeability, lower performance, single point of failure.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Non-Integrated Motherboards</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Provides expansion slots for separate component cards. Advantages: flexibility, upgradeability, higher performance. Disadvantages: higher cost, complexity, larger size.</p>
                </div>
              </div>
            </div>

            {/* Bus Architecture */}
            <div
              ref={(el) => {
                sectionRefs.current['bus-architecture'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Computer Bus Architecture
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-sky-600 dark:text-sky-400">Address Bus</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Carries memory addresses. Unidirectional — CPU to memory/devices. Determines how much RAM can be addressed.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-sky-600 dark:text-sky-400">Data Bus</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Carries actual data. Bidirectional — flows both ways. Width determines data transfer capacity.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-sky-600 dark:text-sky-400">Control Bus</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Carries control signals — Read/Write, clock signals, interrupt requests.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-sky-600 dark:text-sky-400">Expansion Buses</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400"><span className="font-bold">PCI</span> — Older standard, largely replaced.</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400"><span className="font-bold">PCIe</span> — Current standard for high-bandwidth components.</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400"><span className="font-bold">AGP</span> — Dedicated graphics slot, now obsolete.</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400"><span className="font-bold">USB</span> — Universal external connection standard.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BIOS/CMOS/IRQ */}
            <div
              ref={(el) => {
                sectionRefs.current['bios-cmos-irq'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                BIOS, CMOS, and IRQ
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">BIOS</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Basic Input/Output System — firmware that runs first on power-on. Performs POST (Power-On Self-Test), finds the operating system, and hands control over.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">CMOS</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Stores BIOS settings (date/time, boot order, hardware config). Powered by a small battery on the motherboard.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">IRQ</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Interrupt Request — mechanism allowing hardware devices to signal the CPU that they need attention.</p>
                </div>
              </div>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What is the role of the BIOS during system startup?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 2)} /> a) It stores user data
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 2)} /> b) It performs POST and loads the OS
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 2, 2)} /> c) It manages memory allocation
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 2 ? '✅ Correct! BIOS performs POST and loads the operating system.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Troubleshooting */}
            <div
              ref={(el) => {
                sectionRefs.current['troubleshooting'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Troubleshooting a Motherboard
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-orange-600 dark:text-orange-400">No power at all</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Check PSU connections, test PSU with multimeter, motherboard may be dead.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-orange-600 dark:text-orange-400">Booting issues</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Reset BIOS defaults, reseat RAM, check cables and components.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-orange-600 dark:text-orange-400">Overheating</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Clean dust, verify fans, replace thermal paste.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-orange-600 dark:text-orange-400">System instability</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Check for overheating, run memory diagnostics, update drivers.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <span className="font-bold text-orange-600 dark:text-orange-400">No display</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Check monitor cable connections, reseat graphics card, try different monitor.</p>
                </div>
              </div>
            </div>

            {/* Testing */}
            <div
              ref={(el) => {
                sectionRefs.current['testing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Hardware Testing — Why It Matters and How to Do It
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-lime-600 dark:text-lime-400">Why Hardware Testing Is Important</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Ensures functionality</li>
                    <li>Improves quality and reliability</li>
                    <li>Optimizes performance</li>
                    <li>Reduces costs</li>
                    <li>Provides documentation</li>
                    <li>Increases customer satisfaction</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-lime-600 dark:text-lime-400">Types of Hardware Tests</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><span className="font-bold">Functionality test:</span> Does it work?</li>
                    <li><span className="font-bold">Compatibility test:</span> Does it work with everything else?</li>
                    <li><span className="font-bold">Performance test:</span> How well does it work?</li>
                    <li><span className="font-bold">Usability test:</span> Is it comfortable to use?</li>
                    <li><span className="font-bold">Stress test:</span> Does it hold up under pressure?</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-lime-600 dark:text-lime-400">Creating a Test Plan</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">A test plan describes exactly how testing will be conducted. It includes scope and objectives, specific test cases, test procedures, pass/fail criteria, resource assignment, and documentation of results.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-lime-600 dark:text-lime-400">Diagnostic tools</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">MemTest86+ for RAM, manufacturer POST diagnostics.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-lime-600 dark:text-lime-400">Benchmarking tools</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Cinebench, Geekbench for CPU; 3DMark for GPU; CrystalDiskMark for storage.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-lime-600 dark:text-lime-400">Monitoring tools</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">HWMonitor, Core Temp for temperatures, fan speeds, voltages.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-lime-600 dark:text-lime-400">Stress testing tools</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Prime95 for CPU/RAM, FurMark for GPU stress testing.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">DMA (Direct Memory Access)</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Allows devices to transfer data directly to and from RAM without CPU involvement, freeing up the CPU for other work. Used by hard drives, network cards, and sound cards.</p>
              </div>

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which type of test evaluates how a system performs under extreme load?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 2)} /> a) Functionality test
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 2)} /> b) Usability test
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 2, 2)} /> c) Stress test
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 2 ? '✅ Correct! Stress testing pushes the system to its limits.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Know the Assembly Sequence</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Be able to list the steps in order: CPU → RAM → Storage → Motherboard → PSU → Components → Cable management → Power on.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Memory Types & Characteristics</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Differentiate volatile (SRAM, DRAM) vs non-volatile (ROM, PROM, EEPROM). Know cache levels and their purposes.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Bus Architecture</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Understand the three buses: Address, Data, Control. Know their directions and functions.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 BIOS, CMOS, IRQ</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">BIOS performs POST and loads OS; CMOS stores settings; IRQ is for device interrupts.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Testing Types</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Functionality, compatibility, performance, usability, stress. Know examples of tools for each.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Plan it. Build it. Test it. Document it. 🛠️</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Hardware Insight
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
                  <span>Memory Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8+</span>
                </li>
                <li className="flex justify-between">
                  <span>Assembly Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Hardware installation is a systematic process. Start with site preparation, ensure compatibility, document everything, follow assembly steps carefully, and test thoroughly. Understanding the 'why' behind each step will help you troubleshoot and perform installations like a pro.
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
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Site preparation</strong> is crucial — consider location, power, cooling, EMC, and fire suppression.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Compatibility</strong> between hardware and software prevents failures; always check requirements.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Documentation</strong> creates a valuable record for future maintenance and audits.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Assembly</strong> follows a logical order: CPU → RAM → Storage → Motherboard → PSU → Components → Cable management → Power on.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Memory types</strong> include volatile (SRAM, DRAM) and non-volatile (ROM, PROM, EEPROM). Cache speeds up CPU operations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Testing</strong> ensures functionality, compatibility, performance, and reliability — document results.
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
            Sidemann Academic Registry • Hardware Installation & Testing 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;
