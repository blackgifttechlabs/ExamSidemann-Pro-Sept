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
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'advantages', label: 'Advantages' },
  { id: 'signals', label: 'Signals' },
  { id: 'types', label: 'Network Types' },
  { id: 'topologies', label: 'Topologies' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'models', label: 'Models' },
];

const networkImage = (filename: string) =>
  new URL(`./images/${filename}`, import.meta.url).href;

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
        text: 'The first computer network was ARPANET, created in 1969. It had only four nodes and eventually evolved into the modern internet.',
      },
      {
        title: 'Pro Tip',
        text: 'When designing a network, always consider scalability and redundancy. Plan for growth and ensure there are backup paths for critical connections.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember the OSI model layers: "Please Do Not Throw Sausage Pizza Away" – Physical, Data Link, Network, Transport, Session, Presentation, Application.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people confuse "Internet" with "World Wide Web". The Internet is the network infrastructure; the Web is a service that runs on it (HTTP).',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first computer network was ARPANET, created in 1969. It had only four nodes and eventually evolved into the modern internet.',
      },
      {
        title: 'Pro Tip',
        text: 'When designing a network, always consider scalability and redundancy. Plan for growth and ensure there are backup paths for critical connections.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember the OSI model layers: "Please Do Not Throw Sausage Pizza Away" – Physical, Data Link, Network, Transport, Session, Presentation, Application.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people confuse "Internet" with "World Wide Web". The Internet is the network infrastructure; the Web is a service that runs on it (HTTP).',
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
            <Network size={14} className="inline mr-1" /> COMPUTER NETWORKING
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 1{' '}
            <span className="text-emerald-300 font-bold italic">
              Networking Fundamentals
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the core concepts of computer networking: network types,
            topologies, transmission media, signals, and internetworking
            technologies. Build a solid foundation for IT careers.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 7 sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Globe size={14} className="inline mr-1" /> Network basics
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Terminal size={14} className="inline mr-1" /> Models &amp; protocols
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
                placeholder="Search for a concept, topology, or device..."
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
                Definition: What Is a Computer Network?
              </h2>

              <div className="flex items-center gap-3 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                  A computer network is simply two or more computers or devices
                  joined together, using cables or wireless signals, so they
                  can talk to each other, send files, and share things like
                  printers or an internet connection.
                </p>
              </div>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                In simple words: think of a network like a group chat, but for
                machines. Instead of typing messages, computers send small
                packets of data back and forth over a cable or through the
                air (Wi-Fi). "Data communications" is just the name for this
                sending and receiving of data between devices.
              </p>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight mt-6">
                A Short History — How It All Started
              </h3>

              <img
                src={networkImage('intro-history-arpanet.png')}
                alt="Early computer network history, 1960s computer room"
                className="w-full h-64 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mt-2"
              />

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mt-3">
                Long before computers, people communicated over distance using
                letters, then the telegraph (sending beeps of Morse code down
                a wire), then the telephone. These systems could only carry
                one type of message between two fixed points.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Computers changed this. In 1969, American researchers built{' '}
                <strong className="text-slate-900 dark:text-white">ARPANET</strong>,
                the first real computer network, connecting just four
                university computers. Before this, if you wanted to use a
                distant computer's data, you physically carried tapes or
                punch cards to it. ARPANET let researchers send data down a
                wire instead — instantly, and without leaving their building.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                ARPANET grew over the following decades, connecting more
                universities, then companies, then homes — eventually
                becoming what we now call the Internet.
              </p>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight mt-6">
                Why Were Networks Created?
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Networks were built to solve three simple problems: (1) computers
                were expensive, so people wanted to <strong className="text-slate-900 dark:text-white">share
                one expensive machine or printer</strong> between many users;
                (2) researchers needed a fast way to <strong className="text-slate-900 dark:text-white">send
                and receive data</strong> without physically transporting it;
                and (3) people wanted a reliable way to{' '}
                <strong className="text-slate-900 dark:text-white">communicate and collaborate</strong>{' '}
                even when they were in different buildings or countries.
              </p>
            </div>

            {/* Advantages of Computer Networks */}
            <div
              ref={(el) => {
                sectionRefs.current['advantages'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Advantages &amp; Disadvantages of Computer Networks
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight flex items-center gap-2">
                    <CheckCircle size={20} /> Advantages
                  </h3>
                  {[
                    "Resource sharing (printers, scanners, software)",
                    "Improved communication (email, IM, video conferencing)",
                    "Increased productivity (easy access to information)",
                    "Enhanced decision-making (real-time data)",
                    "Global reach (expand markets)",
                    "Cost-effectiveness (shared resources)",
                    "Scalability (flexible for growth)",
                    "Security (encryption, firewalls)",
                    "Ease of use (intuitive interfaces)",
                    "Innovation (access to new technologies)",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                      <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight flex items-center gap-2">
                    <AlertTriangle size={20} /> Disadvantages
                  </h3>
                  {[
                    "Security risks (hacking, malware, breaches)",
                    "Dependence on technology (failure = downtime)",
                    "Complexity (management and maintenance)",
                    "Cost (setup and ongoing expenses)",
                    "Downtime (disrupts business)",
                    "Privacy concerns (data interception)",
                    "Bandwidth limitations (performance impact)",
                    "Technical support requirements",
                    "Compliance requirements (data protection laws)",
                    "Obsolescence (need for upgrades)",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                      <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Analog vs Digital Signals */}
            <div
              ref={(el) => {
                sectionRefs.current['signals'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Analog vs Digital Signals
              </h2>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Before data can travel down a cable or through the air, it must
                be turned into a <strong className="text-slate-900 dark:text-white">signal</strong> —
                an electrical, light, or radio wave. There are two kinds of
                signal: <strong className="text-slate-900 dark:text-white">analog</strong>, which
                is a smooth, ever-changing wave (like your voice), and{' '}
                <strong className="text-slate-900 dark:text-white">digital</strong>, which is
                broken into simple on/off steps — 1s and 0s. Almost all modern
                networks (Wi-Fi, Ethernet, the Internet) use digital signals
                because they are easier to send long distances without errors.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">Analog Signals</h3>
                  <img
                    src={networkImage('signal-analog-wave.png')}
                    alt="Analog signal sine wave diagram"
                    className="w-full h-40 object-contain rounded-lg border border-slate-200 dark:border-slate-700 mt-3 bg-white"
                  />
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-3">
                    <strong>Definition:</strong> An analog signal is a
                    continuous wave that can take any value, rising and
                    falling smoothly — like a hill with no flat steps.
                  </p>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400 list-disc pl-4">
                    <li>Continuous signals that represent physical measurements.</li>
                    <li>Denoted by sine waves.</li>
                    <li>Use a continuous range of values.</li>
                    <li>More susceptible to noise and distortion.</li>
                    <li>Used in telephone, cable TV, DSL, AM/FM radio.</li>
                  </ul>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Example: Modulation – combining analog signal with carrier wave.</p>
                  </div>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">Digital Signals</h3>
                  <img
                    src={networkImage('signal-digital-wave.png')}
                    alt="Digital signal square wave diagram"
                    className="w-full h-40 object-contain rounded-lg border border-slate-200 dark:border-slate-700 mt-3 bg-white"
                  />
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-3">
                    <strong>Definition:</strong> A digital signal only has two
                    states — on or off, high or low, 1 or 0 — like a light
                    switch with no dimmer. Data is sent as patterns of these
                    two states.
                  </p>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400 list-disc pl-4">
                    <li>Discrete signals that represent data as a sequence of values (0 and 1).</li>
                    <li>Denoted by square waves.</li>
                    <li>Use discrete values (binary).</li>
                    <li>Less susceptible to noise; error detection/correction possible.</li>
                    <li>Used in Ethernet, Wi-Fi, DSL, cable modems.</li>
                  </ul>
                  <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400">Example: Data represented as 0s and 1s (binary).</p>
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="mt-6 overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212]">
                <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Feature/Aspect</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Analog</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Digital</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Definition</td>
                      <td className="p-3">Continuous signals representing physical measurements</td>
                      <td className="p-3">Discrete signals representing data as separate values</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Waveform</td>
                      <td className="p-3">Sine waves</td>
                      <td className="p-3">Square waves</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Values</td>
                      <td className="p-3">Continuous range</td>
                      <td className="p-3">Discrete (0 and 1)</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Noise</td>
                      <td className="p-3">More susceptible</td>
                      <td className="p-3">Less susceptible</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Network Types */}
            <div
              ref={(el) => {
                sectionRefs.current['types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Types
              </h2>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Networks are grouped by size — how far apart the connected
                devices are. A network in your pocket linking your phone to
                your earbuds is tiny; the network linking every country on
                Earth is the Internet. Below are the six sizes you need to know,
                from smallest to largest.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {[
                  {
                    t: "PAN (Personal Area Network)",
                    d: "Interconnects devices within an individual's workspace (few feet). Bluetooth, USB.",
                    icon: Smartphone,
                    img: "network-pan.png",
                  },
                  {
                    t: "LAN (Local Area Network)",
                    d: "Connects computers within a limited area (home, school, office). Ethernet, Wi-Fi.",
                    icon: Laptop,
                    img: "network-lan.png",
                  },
                  {
                    t: "WLAN (Wireless LAN)",
                    d: "A LAN that uses wireless technology (Wi-Fi) to connect devices.",
                    icon: Wifi,
                    img: "network-wlan.png",
                  },
                  {
                    t: "CAN (Campus Area Network)",
                    d: "Interconnects multiple LANs within a university or corporate campus.",
                    icon: Building2,
                    img: "network-can.png",
                  },
                  {
                    t: "MAN (Metropolitan Area Network)",
                    d: "Spans a city or metropolitan area. Larger than LAN, smaller than WAN.",
                    icon: Globe,
                    img: "network-man.png",
                  },
                  {
                    t: "WAN (Wide Area Network)",
                    d: "Connects LANs across large geographic areas (countries, continents). The Internet.",
                    icon: Network,
                    img: "network-wan.png",
                  },
                ].map((type, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                  >
                    <img
                      src={networkImage(type.img)}
                      alt={type.t}
                      className="w-full h-32 object-contain rounded-lg bg-white border border-slate-100 dark:border-slate-800 mb-3"
                    />
                    <div className="flex items-center gap-3">
                      <type.icon size={24} className="text-indigo-500" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase">
                        {type.t}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                      {type.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Network Topologies */}
            <div
              ref={(el) => {
                sectionRefs.current['topologies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Topologies
              </h2>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                A <strong className="text-slate-900 dark:text-white">topology</strong> is
                simply the shape or layout of how cables and devices are
                arranged in a network — the same way a map shows how roads
                connect towns. The shape you choose affects cost, speed, and
                how easily the network survives a single broken cable.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {[
                  {
                    t: "Point-to-Point",
                    d: "Direct link between two computers. Simple, fast, reliable, but limited to small areas.",
                    img: "topology-point-to-point.png",
                  },
                  {
                    t: "Bus Topology",
                    d: "Single cable connects all nodes. Inexpensive, easy to install, but a single cable failure breaks the network.",
                    img: "topology-bus.png",
                  },
                  {
                    t: "Ring Topology",
                    d: "Each device has exactly two neighbors. Token passing. Fault-tolerant but difficult to troubleshoot.",
                    img: "topology-ring.png",
                  },
                  {
                    t: "Star Topology",
                    d: "All nodes connect to a central hub/switch. Easy to troubleshoot, but hub failure disables the network.",
                    img: "topology-star.png",
                  },
                  {
                    t: "Mesh Topology",
                    d: "Every node connects to every other. High redundancy, robust, but expensive and complex to implement.",
                    img: "topology-mesh.png",
                  },
                  {
                    t: "Tree Topology",
                    d: "Hierarchical structure with root node. Combines star and bus. Easy to expand, but hub failure affects branches.",
                    img: "topology-tree.png",
                  },
                  {
                    t: "Hybrid Topology",
                    d: "Combines two or more topologies. Flexible and scalable, but complex design and expensive.",
                    img: "topology-hybrid.png",
                  },
                ].map((topo, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                  >
                    <img
                      src={networkImage(topo.img)}
                      alt={topo.t}
                      className="w-full h-36 object-contain rounded-lg bg-white border border-slate-100 dark:border-slate-800 mb-3"
                    />
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      {topo.t}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                      {topo.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Networking Equipment & Transmission Media */}
            <div
              ref={(el) => {
                sectionRefs.current['equipment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Equipment &amp; Transmission Media
              </h2>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                These are the physical boxes that make a network actually
                work — each one has one main job, and data usually passes
                through several of them on its way from your device to the
                internet and back.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {[
                  { t: "Firewall", d: "A guard that checks every bit of traffic coming in or out, and blocks anything that looks unsafe or isn't allowed.", icon: Shield, img: "device-firewall.png" },
                  { t: "Router", d: "Connects different networks together (e.g. your home network to the internet) and decides which path data should take using IP addresses.", icon: Router, img: "device-switch-photo-extra.png" },
                  { t: "Switch", d: "Connects multiple devices within one local network (LAN) and sends data directly to the right device using its MAC address, instead of blasting it to everyone.", icon: Network, img: "device-switch.png" },
                  { t: "Hub", d: "An older, simpler version of a switch — it just repeats incoming data out to every connected device, which wastes bandwidth. Rarely used today.", icon: Layers, img: "device-hub.png" },
                  { t: "Bridge", d: "Joins two separate network segments into one and only passes traffic across that actually needs to go to the other side, reducing unnecessary traffic.", icon: Layers, img: "device-bridge.png" },
                  { t: "Modem", d: "Translates between your ISP's incoming signal (over phone or cable line) and the digital signal your router and devices understand.", icon: Cable, img: "device-modem.png" },
                  { t: "Access Point (AP)", d: "Broadcasts Wi-Fi so wireless devices (phones, laptops) can join a wired network without a cable.", icon: Wifi, img: "device-access-point.png" },
                  { t: "Media Converter", d: "Lets two different cable types talk to each other — for example, joining a copper Ethernet cable to a fiber optic line.", icon: Repeat, img: "device-media-converter.png" },
                  { t: "Range Extender", d: "Picks up a weak Wi-Fi signal and rebroadcasts it further, so rooms far from the router still get coverage.", icon: Wifi, img: "device-range-extender.png" },
                  { t: "VoIP Endpoint", d: "A phone or app that makes voice calls over the internet instead of the traditional phone line, using a protocol called SIP.", icon: Phone, img: "device-voip-endpoint.png" },
                ].map((dev, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm flex flex-col gap-3"
                  >
                    <img
                      src={networkImage(dev.img)}
                      alt={dev.t}
                      className="w-full h-28 object-contain rounded-lg bg-white"
                    />
                    <div className="flex items-start gap-3">
                      <dev.icon size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                          {dev.t}
                        </h5>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                          {dev.d}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight mt-8 mb-4">
                Transmission Media
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                <strong className="text-slate-900 dark:text-white">Transmission media</strong> is
                just the physical path data actually travels down — the
                "road" the signal drives on. It can be a wire carrying
                electricity, a glass strand carrying light, or empty air
                carrying radio waves (wireless). The type you pick affects
                speed, cost, distance, and how much it resists interference
                (EMI = electromagnetic interference, like the buzz you get
                near a microwave or power line).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <img src={networkImage('media-twisted-pair.png')} alt="Twisted pair cable" className="w-full h-28 object-contain rounded-lg bg-white mb-3" />
                  <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase">Twisted Pair</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    <strong>What it is:</strong> Pairs of copper wires
                    twisted around each other — the twisting cancels out
                    outside electrical noise, like two people humming
                    opposite notes to cancel each other's hum.
                  </p>
                  <ul className="mt-2 space-y-1 text-[11px] text-slate-600 dark:text-slate-400 list-disc pl-4">
                    <li><strong>UTP</strong> (unshielded) — cheaper, used for most home/office Ethernet cables.</li>
                    <li><strong>STP</strong> (shielded) — has extra foil wrapping for noisy environments (factories, near motors).</li>
                    <li>Cheapest option, easy to install, but shorter range and more prone to signal loss than fiber.</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <img src={networkImage('media-coaxial.png')} alt="Coaxial cable" className="w-full h-28 object-contain rounded-lg bg-white mb-3" />
                  <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase">Coaxial</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    <strong>What it is:</strong> One copper core wire,
                    wrapped in insulation, then a metal shield, then an
                    outer jacket — like the antenna cable behind an old TV.
                    The shield layer blocks outside interference well.
                  </p>
                  <ul className="mt-2 space-y-1 text-[11px] text-slate-600 dark:text-slate-400 list-disc pl-4">
                    <li>Carries a stronger, more stable signal over longer distances than twisted pair.</li>
                    <li>Common for cable TV and cable internet (the line coming into your router from your ISP).</li>
                    <li>Bulkier and more expensive to install than twisted pair.</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <img src={networkImage('media-fiber-optic.png')} alt="Fiber optic cable" className="w-full h-28 object-contain rounded-lg bg-white mb-3" />
                  <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase">Fiber Optic</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    <strong>What it is:</strong> A thin strand of glass or
                    plastic that carries data as pulses of light instead of
                    electricity — like flashing a torch on and off very
                    fast down a tube.
                  </p>
                  <ul className="mt-2 space-y-1 text-[11px] text-slate-600 dark:text-slate-400 list-disc pl-4">
                    <li>Because it's light, not electricity, it's completely immune to EMI.</li>
                    <li>Carries huge amounts of data over very long distances with almost no signal loss.</li>
                    <li>Most expensive and delicate — needs special tools to install and repair.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Networking Models */}
            <div
              ref={(el) => {
                sectionRefs.current['models'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Networking Models &amp; Protocols
              </h2>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                A <strong className="text-slate-900 dark:text-white">model</strong> is
                just a diagram that breaks the journey of data — from the
                app on your screen down to the cable or radio wave — into
                separate jobs, or "layers". Splitting the work into layers
                means engineers can fix or upgrade one layer (say, swap Wi-Fi
                for a cable) without redesigning everything else.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase">OSI Model (7 Layers)</h3>
                  <img src={networkImage('model-osi.png')} alt="OSI 7-layer model diagram" className="w-full h-56 object-contain rounded-lg bg-white border border-slate-100 dark:border-slate-800 my-3" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    <strong>Definition:</strong> A theoretical, 7-step map of
                    everything that has to happen for data to get from one
                    device to another. It's used mainly for teaching and
                    troubleshooting — not every real network follows it
                    exactly.
                  </p>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <li><strong className="text-slate-900 dark:text-white">7. Application</strong> — the app you actually use (browser, email).</li>
                    <li><strong className="text-slate-900 dark:text-white">6. Presentation</strong> — formats/encrypts the data so both sides understand it.</li>
                    <li><strong className="text-slate-900 dark:text-white">5. Session</strong> — opens and keeps track of the conversation between devices.</li>
                    <li><strong className="text-slate-900 dark:text-white">4. Transport</strong> — breaks data into pieces and makes sure they all arrive.</li>
                    <li><strong className="text-slate-900 dark:text-white">3. Network</strong> — figures out the best path (routing) using IP addresses.</li>
                    <li><strong className="text-slate-900 dark:text-white">2. Data Link</strong> — handles devices on the same local network using MAC addresses.</li>
                    <li><strong className="text-slate-900 dark:text-white">1. Physical</strong> — the actual cable, radio signal, or light pulse carrying the bits.</li>
                  </ul>
                  <p className="text-[10px] text-slate-500 mt-2 italic">Memory trick: "Please Do Not Throw Sausage Pizza Away"</p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase">TCP/IP Model (4 Layers)</h3>
                  <img src={networkImage('model-tcpip.png')} alt="TCP/IP 4-layer model diagram" className="w-full h-56 object-contain rounded-lg bg-white border border-slate-100 dark:border-slate-800 my-3" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    <strong>Definition:</strong> The simpler, real-world model
                    that the actual Internet runs on. It squashes OSI's top
                    three layers into one and is what you'll see referenced
                    in real networking work.
                  </p>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <li><strong className="text-slate-900 dark:text-white">4. Application</strong> — the app and its protocol (HTTP, email, DNS, etc).</li>
                    <li><strong className="text-slate-900 dark:text-white">3. Transport</strong> — splits data into segments and ensures reliable delivery (TCP) or fast delivery (UDP).</li>
                    <li><strong className="text-slate-900 dark:text-white">2. Internet</strong> — addresses and routes data across networks using IP.</li>
                    <li><strong className="text-slate-900 dark:text-white">1. Network Access</strong> — the physical cable/Wi-Fi and local delivery, combining OSI's bottom two layers.</li>
                  </ul>
                  <p className="text-[10px] text-slate-500 mt-2 italic">Core protocols: TCP, UDP, IP, ICMP, ARP</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight mt-8 mb-4">
                Common Protocols &amp; Ports
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                A <strong className="text-slate-900 dark:text-white">protocol</strong> is
                just an agreed set of rules two computers follow so they
                understand each other — like both people on a phone call
                agreeing to say "hello" first. A{' '}
                <strong className="text-slate-900 dark:text-white">port</strong> is like
                a numbered door on a computer; each service listens on its
                own door number so incoming data knows where to go.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { name: "HTTP", port: "80", desc: "Loads normal (non-secure) websites in your browser." },
                  { name: "HTTPS", port: "443", desc: "Loads websites with encryption, so no one can spy on the data — the padlock icon in your browser." },
                  { name: "FTP", port: "20/21", desc: "Uploads or downloads files between two computers over a network." },
                  { name: "SSH", port: "22", desc: "Lets you securely log in and control another computer from a terminal." },
                  { name: "Telnet", port: "23", desc: "Old way to remotely control another computer — not secure, rarely used now." },
                  { name: "SMTP", port: "25", desc: "Sends emails from your device or server out to the recipient's mail server." },
                  { name: "POP3", port: "110", desc: "Downloads your emails onto one device and usually removes them from the server." },
                  { name: "IMAP", port: "143", desc: "Syncs your emails across all your devices, keeping copies on the server." },
                  { name: "DNS", port: "53", desc: "Turns a website name (like google.com) into the numeric address computers actually use." },
                  { name: "DHCP", port: "67/68", desc: "Automatically hands out an IP address to your device when it joins a network." },
                  { name: "SNMP", port: "161", desc: "Lets admins monitor and manage network devices like routers and switches remotely." },
                  { name: "RDP", port: "3389", desc: "Lets you see and control another computer's desktop over the network, as if sitting in front of it." },
                ].map((p, i) => (
                  <div key={i} className="p-3 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-lg">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {p.name} <span className="text-indigo-500 font-semibold">({p.port})</span>
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                      {p.desc}
                    </p>
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
                  💡 Networking Tip
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
                  <span>Network Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Topologies</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Networking is the foundation of modern IT. Understanding
                topologies, protocols, and models is essential for building and
                troubleshooting any network.
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
                <strong className="text-white">Network Types:</strong> PAN, LAN,
                WLAN, CAN, MAN, WAN – each covers a different geographic area.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Topologies:</strong> Point-to-Point,
                Bus, Ring, Star, Mesh, Tree, Hybrid – each has different
                advantages and disadvantages.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Signals:</strong> Analog (continuous)
                vs Digital (discrete). Digital is more reliable and commonly used
                in modern networks.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Models:</strong> OSI (7 layers) and
                TCP/IP (4 layers) are reference models for understanding network
                communication.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Equipment:</strong> Routers,
                switches, firewalls, modems, access points – each plays a
                specific role in network infrastructure.
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

export default LearningOutcome1;
