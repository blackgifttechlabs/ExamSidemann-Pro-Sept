import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Cpu,
  Layers,
  HardDrive,
  CheckCircle,
  Info,
  Zap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Database,
  BookOpen,
  FileText,
  Monitor,
  Disc,
  Tablet,
  ChevronRight,
  Terminal,
  Search,
  X,
  ChevronUp,
  RefreshCw,
  Trophy,
  Target,
  GraduationCap,
  Network,
  Server,
  Wifi,
  Router,
  Globe,
  ListChecks,
  Activity,
  ClipboardList,
  PenTool,
  Settings,
  Map,
  Flag,
  Shield,
  Binary,
  Layout,
} from 'lucide-react';
// import { AdSense } from '../../../../analytics/AdSense'; // keep if needed

// ──────────────────────────────────────────────────────────────────────────────
// INTERACTIVE IMAGE COMPONENT (unchanged)
// ──────────────────────────────────────────────────────────────────────────────
interface InteractiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

const InteractiveImage: React.FC<InteractiveImageProps> = ({ src, alt, className = "" }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${alt.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(src, '_blank');
    }
  };

  return (
    <div className={`my-4 ${className}`}>
      <div
        className="relative group cursor-pointer overflow-hidden bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-white/10 shadow-sm transition-all duration-300 hover:shadow-lg w-full rounded-xl"
        onClick={() => setIsZoomed(true)}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02] mx-auto"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/90 dark:bg-black/80 p-2 rounded-full shadow-xl">
            <ChevronUp size={20} className="text-[#003153] dark:text-white rotate-45" />
          </div>
        </div>
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <button className="absolute top-8 right-8 p-3 text-white hover:bg-white/10 rounded-full transition-colors">
            <X size={32} />
          </button>
          <img src={src} alt={alt} className="max-w-full max-h-[85vh] object-contain shadow-2xl animate-pop-bounce" />
          <div className="mt-8 text-center">
            <h4 className="text-white font-black uppercase tracking-[0.2em] mb-4">{alt}</h4>
            <button
              onClick={handleDownload}
              className="px-10 py-3 bg-white text-black font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-transform rounded"
            >
              Save Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// NAVIGATION TABS
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'interpret', label: 'Interpret Designs' },
  { id: 'wiring', label: 'Wiring Standards' },
  { id: 'cables', label: 'Cable Termination' },
  { id: 'deployment', label: 'Deployment Standards' },
  { id: 'configure', label: 'Configure Devices' },
  { id: 'test', label: 'Test Connectivity' },
  { id: 'documentation', label: 'Documentation' },
];

const networkImage = (filename: string) =>
  new URL(`./images/${filename}`, import.meta.url).href;

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
      { title: 'Network Fact', text: 'The first Ethernet standard (IEEE 802.3) was published in 1983 and ran at 10 Mbps.' },
      { title: 'Pro Tip', text: 'Always use the same wiring standard (568A or 568B) on both ends of a straight‑through cable to avoid connectivity issues.' },
      { title: 'Remember', text: 'Switches and routers are the backbone – place them centrally to reduce latency and improve performance.' },
      { title: 'Security', text: 'Firewalls should be placed at the edge of your network, between your internal LAN and the internet.' },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      { title: 'Network Fact', text: 'The first Ethernet standard (IEEE 802.3) was published in 1983 and ran at 10 Mbps.' },
      { title: 'Pro Tip', text: 'Always use the same wiring standard (568A or 568B) on both ends of a straight‑through cable to avoid connectivity issues.' },
      { title: 'Remember', text: 'Switches and routers are the backbone – place them centrally to reduce latency and improve performance.' },
      { title: 'Security', text: 'Firewalls should be placed at the edge of your network, between your internal LAN and the internet.' },
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
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Network size={14} className="inline mr-1" /> COMPUTER NETWORKING
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 2{' '}
            <span className="text-sky-300 font-bold italic">
              Interpret &amp; Install
            </span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Master network design interpretation, cabling standards, device
            configuration, and documentation. Learn how to strategically place
            equipment, terminate cables, and test connectivity.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-blue-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              ⚙️ Interactive diagrams
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Zap size={14} className="inline mr-1" /> Practical
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
                placeholder="Search for a networking concept..."
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
              className="space-y-4"
            >
              <div className="flex items-center gap-3 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                  This lesson is about going from a plan on paper to a real,
                  working network. In simple terms: you'll learn how to read a
                  network drawing, wire the cables correctly, set up the
                  devices with the right addresses, check that everything
                  connects, and write it all down so someone else could fix it
                  later.
                </p>
              </div>
              <InteractiveImage
                src={networkImage('intro-plan-to-network.png')}
                alt="From network design to physical installation overview"
              />
            </div>

            {/* 1. Interpret Network Designs */}
            <div
              ref={(el) => {
                sectionRefs.current['interpret'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Interpret Network Designs
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Before you plug in a single cable, you need to read the
                network's "blueprint" — a diagram showing what devices exist
                and how they should connect. "Interpreting" a design just
                means being able to look at that diagram and understand four
                things about it:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {[
                  {
                    t: 'Topology',
                    d: 'The shape of the network — how devices are arranged and cabled together (bus, star, ring, mesh).',
                    img: 'concept-topology-shapes.png',
                  },
                  {
                    t: 'Device Types',
                    d: 'Which boxes are on the diagram and what each one does — switches, routers, firewalls, access points.',
                    img: 'concept-device-types.png',
                  },
                  {
                    t: 'Bandwidth',
                    d: 'How much data needs to move at once — like knowing how wide a road needs to be for its traffic.',
                    img: 'concept-bandwidth-traffic.png',
                  },
                  {
                    t: 'Security',
                    d: 'Where protections (firewalls, passwords, VLANs) sit to keep unauthorized people out.',
                    img: 'concept-security-shield.png',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
                  >
                    <img
                      src={networkImage(item.img)}
                      alt={item.t}
                      className="w-full h-auto object-contain rounded-lg bg-white border border-slate-100 dark:border-slate-800 mb-3"
                    />
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                      {item.t}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                      {item.d}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <Target size={22} className="text-blue-500" /> Strategic Placement
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  "Strategic placement" just means: don't put equipment
                  wherever is convenient — put it where it works best. A
                  router in a locked cupboard in the middle of the building
                  beats one shoved in a corner with no ventilation.
                </p>
                <InteractiveImage
                  src={networkImage('office-equipment-floorplan.png')}
                  alt="Floor plan showing strategic placement of network equipment"
                />
                <div className="space-y-4">
                  <div className="p-5 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                    <h4 className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">
                      Switches &amp; Routers
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      Put these near the center of the building, not in a far
                      corner. The closer they are to every device, the shorter
                      the cable runs and the less delay ("latency") data
                      experiences. Put them where the most devices are, like
                      offices or classrooms.
                    </p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                    <h4 className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400">
                      Firewalls
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      Think of a firewall as the front door guard. It belongs
                      right at the boundary between your internal network and
                      the internet, so it can inspect everything coming in or
                      going out before it reaches the rest of the network.
                    </p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                    <h4 className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">
                      Wireless Access Points
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      Mount these where the most people need Wi-Fi, and away
                      from thick walls, metal cabinets, or other electronics
                      that can weaken or block the signal.
                    </p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                    <h4 className="text-xs font-bold uppercase text-orange-600 dark:text-orange-400">
                      Physical Environment
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      Equipment can overheat or corrode. Keep it somewhere
                      dry, cool, dust-free, and ideally lockable so no one
                      unplugs or tampers with it by accident.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                <h4 className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 tracking-widest">
                  Performance, Security &amp; Reliability
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  {[
                    {
                      t: 'Performance',
                      d: 'Centralised switches and APs minimise distance and improve speed.',
                      icon: Activity,
                    },
                    {
                      t: 'Security',
                      d: 'Edge firewalls protect against unauthorised access.',
                      icon: ShieldCheck,
                    },
                    {
                      t: 'Reliability',
                      d: 'Proper placement reduces outages and ensures stability.',
                      icon: CheckCircle,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl text-center"
                    >
                      <item.icon className="mx-auto text-blue-500 mb-2" size={24} />
                      <h5 className="text-[10px] font-black uppercase text-slate-800 dark:text-white">
                        {item.t}
                      </h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                        {item.d}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Wiring Standards */}
            <div
              ref={(el) => {
                sectionRefs.current['wiring'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                568A &amp; 568B Wiring Standards
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Inside every Ethernet cable are 8 tiny colored wires. If you
                connect them to the RJ-45 plug in a random order, the cable
                won't work reliably. So there are two official "recipes" for
                which color goes in which slot — 568A and 568B. As long as
                both ends of a cable follow the same recipe, the cable works.
              </p>

              <div className="mt-4">
                <InteractiveImage
                  src={networkImage('wiring-568a-568b-pinout.jpg')}
                  alt="568A and 568B Wiring Standards side by side pinout diagram"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {[
                  {
                    title: '568A',
                    color: 'text-blue-600 dark:text-blue-400',
                    note: 'Often used in government, older installations, or where 568A is specified by site policy.',
                    pins: [
                      '1: White/Green',
                      '2: Green',
                      '3: White/Orange',
                      '4: Blue',
                      '5: White/Blue',
                      '6: Orange',
                      '7: White/Brown',
                      '8: Brown',
                    ],
                  },
                  {
                    title: '568B',
                    color: 'text-orange-600 dark:text-orange-400',
                    note: 'Most common in many commercial Ethernet installations.',
                    pins: [
                      '1: White/Orange',
                      '2: Orange',
                      '3: White/Green',
                      '4: Blue',
                      '5: White/Blue',
                      '6: Green',
                      '7: White/Brown',
                      '8: Brown',
                    ],
                  },
                ].map((standard) => (
                  <div key={standard.title} className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl">
                    <h3 className={`text-lg font-bold uppercase tracking-tight ${standard.color}`}>
                      {standard.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-bold">
                      {standard.note}
                    </p>
                    <h4 className={`mt-4 text-[10px] font-black uppercase tracking-widest ${standard.color}`}>
                      Pinout
                    </h4>
                    <ul className="text-xs font-mono text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                      {standard.pins.map((pin) => (
                        <li key={pin}>{pin}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-r-xl">
                <h4 className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">
                  How to choose and test
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  For a straight-through cable, use the same standard on both
                  ends: 568A-to-568A or 568B-to-568B. A cable becomes a
                  crossover cable only when one end uses 568A and the other uses
                  568B. After crimping, use a cable tester to confirm all 8 pins
                  are wired in the correct order.
                </p>
              </div>
            </div>

            {/* 3. Cable Termination (Straight-through & Crossover) */}
            <div
              ref={(el) => {
                sectionRefs.current['cables'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Cable Termination
              </h2>

              {/* Straight-through */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <Terminal size={22} className="text-blue-500" /> Straight‑Through
                  Cable
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  This is the "normal" cable — both ends are wired identically
                  (same standard, same order). Use it whenever you're
                  connecting two <em>different kinds</em> of device, like a
                  computer to a switch, or a switch to a router. This is what
                  you'll use 95% of the time.
                </p>
                <InteractiveImage
                  src={networkImage('cable-straight-through-diagram.png')}
                  alt="Straight-through cable connecting computer to switch diagram"
                />
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#121212] shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700">
                        <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                          Pin
                        </th>
                        <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                          Colour (568B)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {[
                        { p: '1', c: 'White/Orange' },
                        { p: '2', c: 'Orange' },
                        { p: '3', c: 'White/Green' },
                        { p: '4', c: 'Blue' },
                        { p: '5', c: 'White/Blue' },
                        { p: '6', c: 'Green' },
                        { p: '7', c: 'White/Brown' },
                        { p: '8', c: 'Brown' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/5 transition-colors">
                          <td className="p-3 font-bold text-slate-900 dark:text-white">
                            {row.p}
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">
                            {row.c}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl">
                  <h4 className="text-xs font-black uppercase text-blue-600 dark:text-blue-400">
                    Termination Steps
                  </h4>
                  <ol className="text-xs font-medium text-slate-600 dark:text-slate-400 list-decimal pl-5 space-y-1 mt-2">
                    <li>Strip 1 inch of outer jacket.</li>
                    <li>Untwist and straighten wires.</li>
                    <li>Arrange in correct pinout order.</li>
                    <li>Insert into RJ‑45 connector.</li>
                    <li>Crimp with tool.</li>
                    <li>Repeat for other end.</li>
                  </ol>
                </div>
              </div>

              {/* Crossover */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <ArrowRight size={22} className="text-purple-500" /> Crossover
                  Cable
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Two devices normally "talk" on one wire and "listen" on
                  another. If you connect two <em>similar</em> devices (e.g.
                  computer to computer, switch to switch) with a straight
                  cable, both would talk on the same wire and neither would
                  listen — so a crossover cable swaps ("crosses") the talk and
                  listen wires on one end, fixing that mismatch.
                </p>
                <InteractiveImage
                  src={networkImage('cable-crossover-diagram.png')}
                  alt="Crossover cable connecting two computers directly diagram"
                />
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#121212] shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700">
                        <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                          Pin
                        </th>
                        <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                          Left End (568B)
                        </th>
                        <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                          Right End (568A)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {[
                        { p: '1', l: 'White/Orange', r: 'White/Green' },
                        { p: '2', l: 'Orange', r: 'Green' },
                        { p: '3', l: 'White/Green', r: 'White/Orange' },
                        { p: '4', l: 'Blue', r: 'Blue' },
                        { p: '5', l: 'White/Blue', r: 'White/Blue' },
                        { p: '6', l: 'Green', r: 'Orange' },
                        { p: '7', l: 'White/Brown', r: 'White/Brown' },
                        { p: '8', l: 'Brown', r: 'Brown' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/5 transition-colors">
                          <td className="p-3 font-bold text-slate-900 dark:text-white">
                            {row.p}
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">
                            {row.l}
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">
                            {row.r}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-r-xl">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic">
                    Note: Most modern devices support Auto‑MDIX and can
                    automatically detect cable type, so crossover cables are
                    rarely needed today.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Ethernet Deployment Standards */}
            <div
              ref={(el) => {
                sectionRefs.current['deployment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Ethernet Deployment Standards
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Ethernet isn't just "any cable, any way." A group called the
                IEEE writes official rulebooks (numbered standards) so that
                equipment from different manufacturers all works together the
                same way. You don't need to memorize every number — just know
                roughly what each rulebook is responsible for.
              </p>
              <InteractiveImage
                src={networkImage('ethernet-standards-overview.png')}
                alt="Overview diagram of IEEE 802 Ethernet standards and what each covers"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {[
                  {
                    t: 'IEEE 802.3',
                    d: 'Physical and data link layer specs for Ethernet media (copper, fiber).',
                  },
                  {
                    t: 'IEEE 802.1Q',
                    d: 'VLAN protocol to divide networks into logical segments.',
                  },
                  {
                    t: 'IEEE 802.1x',
                    d: 'EAP framework for authenticating users and devices.',
                  },
                  {
                    t: 'IEEE 802.3ad',
                    d: 'LACP for link aggregation to improve performance and reliability.',
                  },
                  {
                    t: 'IEEE 802.3af/at/bt',
                    d: 'Power over Ethernet (PoE) for powering devices like APs and cameras.',
                  },
                ].map((std, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                      {std.t}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                      {std.d}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                <h4 className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 tracking-widest">
                  Deployment Tips
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium mt-2 list-disc pl-5">
                  <li>Use high‑quality cabling and connectors.</li>
                  <li>Label all cables and devices clearly.</li>
                  <li>Create a network diagram for documentation.</li>
                  <li>Regularly test for errors and performance issues.</li>
                  <li>Implement security measures (firewalls, etc.).</li>
                </ul>
              </div>
            </div>

            {/* 5. Configure Network Devices */}
            <div
              ref={(el) => {
                sectionRefs.current['configure'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Configure Network Devices
              </h2>

              {/* IP Addressing */}
              <div className="space-y-4 mt-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <Globe size={22} className="text-blue-500" /> IP Addressing
                  (IPv4 &amp; IPv6)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  An IP address is like a house address for a device on a
                  network — it's how other devices know where to send data.
                  The subnet mask marks which part of the address is the
                  "neighborhood" and which part is the "house number," and
                  the gateway is the address of the door leading out to
                  other networks or the internet.
                </p>
                <InteractiveImage
                  src={networkImage('ip-addressing-ipv4-ipv6.png')}
                  alt="Diagram comparing IPv4 and IPv6 address structure with subnet mask and gateway"
                />
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                      IPv4
                    </h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium space-y-1 mt-2 list-disc pl-5">
                      <li>IP address (e.g., 192.168.1.1)</li>
                      <li>Subnet mask (e.g., 255.255.255.0)</li>
                      <li>Gateway address</li>
                    </ul>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl">
                    <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                      IPv6
                    </h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium space-y-1 mt-2 list-disc pl-5">
                      <li>IPv6 address (e.g., 2001:db8::1)</li>
                      <li>Prefix length (e.g., /64)</li>
                      <li>Gateway address</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* NAT */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <Shield size={22} className="text-purple-500" /> NAT, PAT,
                  SNAT, DNAT
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">NAT</strong> (Network
                  Address Translation) is how your router lets every device
                  on your home or office network share one public internet
                  address. It's like an office receptionist: many staff (private
                  IPs) send mail out, but it all appears to come from one
                  office address (public IP) — and the receptionist knows
                  how to route replies back to the right person.
                </p>
                <InteractiveImage
                  src={networkImage('nat-pat-translation-diagram.png')}
                  alt="Diagram showing NAT translating private IP addresses to a public IP address"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl">
                    <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">
                      Static NAT
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                      Maps one private IP to one public IP (used for servers).
                    </p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl">
                    <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">
                      Dynamic NAT
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                      Maps a pool of private IPs to a pool of public IPs.
                    </p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl">
                    <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">
                      PAT (NAT Overload)
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                      Maps many private IPs to one public IP using different
                      ports.
                    </p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl">
                    <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">
                      DNAT
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                      Translates destination IP for port forwarding.
                    </p>
                  </div>
                </div>
              </div>

              {/* Routing */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <Router size={22} className="text-emerald-500" /> Routing
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Routing is simply deciding which path data should take to
                  reach its destination — like choosing which road to drive
                  on to reach a town. You can either write out the directions
                  yourself (static) or let the network figure out the best
                  road on its own (dynamic).
                </p>
                <InteractiveImage
                  src={networkImage('routing-static-vs-dynamic.png')}
                  alt="Diagram comparing static routing versus dynamic routing between routers"
                />
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                    <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      Static Routing
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                      Manual configuration. Simple, secure, but not scalable.
                    </p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                    <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      Dynamic Routing
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                      Automatic learning via routing protocols. Scalable but
                      more complex.
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-xs font-bold text-slate-500 dark:text-slate-400">
                  Use static routing for small, high‑security networks; dynamic
                  for large or complex networks.
                </div>
              </div>
            </div>

            {/* 6. Test Connectivity & Interpret Results */}
            <div
              ref={(el) => {
                sectionRefs.current['test'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Test Connectivity &amp; Interpret Results
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                After wiring and configuring everything, you still need to
                prove it actually works. Testing just means sending a small,
                harmless signal and checking whether — and how — it comes
                back.
              </p>
              <InteractiveImage
                src={networkImage('ping-traceroute-diagram.png')}
                alt="Diagram showing ping and traceroute testing between two computers across a network"
              />

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                    Physical Layer
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    Use a cable tester to check cable integrity. If the test
                    fails, the cable is damaged or improperly terminated.
                  </p>
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-white/5 rounded text-xs text-slate-500 dark:text-slate-400">
                    <strong>Tips:</strong> Ensure proper connection, check for
                    kinks, and consider signal boosters for long runs.
                  </div>
                </div>

                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">
                    Network Layer
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    Use the <code className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-xs">ping</code>{' '}
                    command to test reachability.
                  </p>
                  <div className="mt-3 p-3 bg-slate-900 text-green-400 font-mono text-sm rounded shadow-inner">
                    ping &lt;IP address&gt;
                  </div>
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-white/5 rounded text-xs text-slate-500 dark:text-slate-400">
                    <strong>Tips:</strong> Verify IP correctness, allow
                    ICMP through firewalls, and restart devices if needed.
                  </div>
                </div>
              </div>

              <div className="mt-6 p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <ClipboardList size={22} className="text-blue-500" /> Interpreting
                  Results
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 font-medium mt-2">
                  <li>
                    <strong>Ping success:</strong> Destination reachable and
                    routing works.
                  </li>
                  <li>
                    <strong>Ping failure:</strong> Destination unreachable due to
                    configuration, firewall, or hardware issues.
                  </li>
                  <li>
                    <strong>Traceroute:</strong> Identifies path and pinpoints
                    where packets are dropped.
                  </li>
                  <li>
                    <strong>DNS lookup:</strong> Verifies domain name resolution.
                  </li>
                </ul>
              </div>
            </div>

            {/* 7. Documentation */}
            <div
              ref={(el) => {
                sectionRefs.current['documentation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Generate Network Documentation
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Documentation is just writing down what you built, so that
                anyone — including future you — can understand, fix, or
                expand the network without having to guess or retrace every
                cable.
              </p>
              <InteractiveImage
                src={networkImage('server-rack-labeled-cables.png')}
                alt="Server rack with neatly labeled and organized network cables"
              />

              <div className="space-y-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight flex items-center gap-3">
                    <FileText size={22} /> Wiring &amp; Port Locations
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    Use network diagrams (Visio, Lucidchart), spreadsheets, or
                    databases to document device, port, cable type, and length.
                  </p>
                  <div className="overflow-x-auto mt-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#121212]">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700">
                          <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                            Device Name
                          </th>
                          <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                            Port
                          </th>
                          <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                            Cable Type
                          </th>
                          <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                            Length
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {[
                          { d: 'Router 1', p: '1', t: 'Cat6', l: '10m' },
                          { d: 'Switch 1', p: '1', t: 'Cat6', l: '10m' },
                          { d: 'Computer 1', p: '1', t: 'Cat6', l: '5m' },
                          { d: 'Computer 2', p: '2', t: 'Cat5e', l: '5m' },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/5 transition-colors">
                            <td className="p-3 font-bold text-slate-900 dark:text-white">
                              {row.d}
                            </td>
                            <td className="p-3 text-slate-600 dark:text-slate-400">{row.p}</td>
                            <td className="p-3 text-slate-600 dark:text-slate-400">{row.t}</td>
                            <td className="p-3 text-slate-600 dark:text-slate-400">{row.l}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-white/5 rounded text-xs text-slate-500 dark:text-slate-400">
                    <strong>Tips:</strong> Use consistent naming, include
                    diagrams, and review regularly.
                  </div>
                </div>

                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight flex items-center gap-3">
                    <Map size={22} /> Physical &amp; Logical Diagrams
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                        Physical Diagram
                      </h4>
                      <InteractiveImage
                        src="https://i.ibb.co/3ykG6101/physical-diagram.png"
                        alt="Physical Network Diagram"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">
                        Shows physical layout – device locations, cables, and
                        wiring.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                        Logical Diagram
                      </h4>
                      <InteractiveImage
                        src="https://i.ibb.co/L77YQG5x/logical-network-diagram.png"
                        alt="Logical Network Diagram"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">
                        Shows IP addressing, subnets, and routing information.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-white/5 rounded text-xs text-slate-500 dark:text-slate-400">
                    <strong>Steps:</strong> Identify audience, collect info,
                    create diagrams (Visio, Lucidchart), review and update.
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
                      <PenTool size={16} /> Labeling
                    </h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium space-y-1 mt-2 list-disc pl-5">
                      <li>Use clear, concise labels.</li>
                      <li>Consistent naming convention.</li>
                      <li>Label devices, cables, and ports.</li>
                      <li>Use durable, readable labels.</li>
                    </ul>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                    <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-2">
                      <Settings size={16} /> Configuration Documentation
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-2">
                      Record device settings, firmware versions, IP addresses,
                      and software configurations.
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Include device name, model, serial, IP, subnet, gateway,
                      DNS, and software version.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  💡 Networking Tip
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
                  <span>Wiring Standards</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">2</span>
                </li>
                <li className="flex justify-between">
                  <span>Interactive Images</span>
                  <span className="font-bold text-green-600 dark:text-green-400">4</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Consistency in cabling standards, proper placement of devices,
                and thorough documentation are key to a reliable network.
                Always test your connections and interpret results carefully.
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
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-blue-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Interpret Designs:</strong> Know
                the topology, device types, bandwidth, and security needs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Wiring Standards:</strong> Use
                568A or 568B consistently; 568B is more common.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Cable Termination:</strong>{' '}
                Straight‑through for different devices; crossover for similar
                (Auto‑MDIX often eliminates the need).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Deployment Standards:</strong>{' '}
                Follow IEEE 802.3, 802.1Q, 802.1x, and PoE standards.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Configuration:</strong> Set up IP
                addressing, NAT/PAT, and routing (static or dynamic).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Testing &amp; Documentation:</strong>{' '}
                Use ping, traceroute, and cable testers; document wiring,
                diagrams, and configurations.
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
            Sidemann Academic Registry • NC IT Networking Registry 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;
