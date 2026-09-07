import React, { useState, useEffect, useRef } from 'react';
import {
  Map,
  Network,
  Wifi,
  Shield,
  Settings,
  Server,
  Router,
  GitBranch,
  GitMerge,
  Link,
  Activity,
  BarChart2,
  FileText,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  GraduationCap,
  Award,
  Sparkles,
  BookMarked,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  MapPin,
  Building,
  Home,
  Briefcase,
  Zap,
  Lock,
  Key,
  Eye,
  EyeOff,
  Cpu,
  HardDrive,
  Database,
  Cloud,
  WifiOff,
  Bluetooth,
  Usb,
  Antenna,
  Radio,
  Globe,
  Share2,
  Cable,
  Terminal,
  CodeIcon,
  CommandIcon,
  Wrench,
  Thermometer,
  Wind,
  Droplets,
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  KeyRound,
  Unlock,
  CloudUpload,
  CloudDownload,
  CloudOff,
  Sun,
  Moon,
  Phone,
  Tablet,
  Smartphone,
  Battery,
  Power,
  Scan,
  QrCode,
  Barcode,
  Search,
  X,
  RefreshCw as RefreshIcon,
  BookOpen,
  ChevronRight,
  Target,
  Users,
  Scale,
  Globe as GlobeIcon,
  HardDrive as HardDriveIcon,
  Server as ServerIcon,
  Database as DatabaseIcon,
  Cloud as CloudIcon,
  Wifi as WifiIcon,
  ChevronUp as ChevronUpIcon,
  Sparkles as SparklesIcon,
  ClipboardCheck,
} from 'lucide-react';
import { AdSense } from '../../../../analytics/AdSense';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'diagrams', label: 'Network Diagrams' },
  { id: 'deploy', label: 'Deploying Devices' },
  { id: 'connectivity', label: 'Connectivity Devices' },
  { id: 'access', label: 'Access Devices' },
  { id: 'security', label: 'Security Devices' },
  { id: 'other-devices', label: 'Other Devices' },
  { id: 'cabling-standards', label: 'Cabling Standards' },
  { id: 'cabling-components', label: 'Cabling Components' },
  { id: 'ethernet', label: 'Ethernet Standards' },
  { id: 'ip-config', label: 'IP Configuration' },
  { id: 'routing', label: 'Routing Protocols' },
  { id: 'testing-monitoring', label: 'Testing & Monitoring' },
  { id: 'cable-testing', label: 'Cable Testing' },
  { id: 'tdr-otdr', label: 'TDR & OTDR' },
  { id: 'toner', label: 'Toner Probe' },
  { id: 'cmd-tools', label: 'Command Line Tools' },
  { id: 'documentation', label: 'Documentation' },
  { id: 'practice', label: 'Practice Q&A' },
  { id: 'exam-tips', label: 'Exam Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome2: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(null);

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
        text: 'Routers connect different networks; switches connect devices within the same network – they serve different purposes!',
      },
      {
        title: 'Pro Tip',
        text: 'Always label cables during installation – it saves hours of troubleshooting later.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 6 components of structured cabling: Entrance, Equipment Room, Backbone, Telecom Room, Horizontal, Work Area – "EEBTHW".',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a hub with a switch – hubs send data to ALL devices, switches send only to the intended device.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Routers connect different networks; switches connect devices within the same network – they serve different purposes!',
      },
      {
        title: 'Pro Tip',
        text: 'Always label cables during installation – it saves hours of troubleshooting later.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 6 components of structured cabling: Entrance, Equipment Room, Backbone, Telecom Room, Horizontal, Work Area – "EEBTHW".',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a hub with a switch – hubs send data to ALL devices, switches send only to the intended device.',
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
  const [quiz5Answer, setQuiz5Answer] = useState<number | null>(null);
  const [quiz6Answer, setQuiz6Answer] = useState<number | null>(null);

  const [showQuiz1Result, setShowQuiz1Result] = useState(false);
  const [showQuiz2Result, setShowQuiz2Result] = useState(false);
  const [showQuiz3Result, setShowQuiz3Result] = useState(false);
  const [showQuiz4Result, setShowQuiz4Result] = useState(false);
  const [showQuiz5Result, setShowQuiz5Result] = useState(false);
  const [showQuiz6Result, setShowQuiz6Result] = useState(false);

  const checkAnswer = (quizNumber: number, selectedAnswer: number, correctAnswer: number) => {
    switch (quizNumber) {
      case 1: setQuiz1Answer(selectedAnswer); setShowQuiz1Result(true); break;
      case 2: setQuiz2Answer(selectedAnswer); setShowQuiz2Result(true); break;
      case 3: setQuiz3Answer(selectedAnswer); setShowQuiz3Result(true); break;
      case 4: setQuiz4Answer(selectedAnswer); setShowQuiz4Result(true); break;
      case 5: setQuiz5Answer(selectedAnswer); setShowQuiz5Result(true); break;
      case 6: setQuiz6Answer(selectedAnswer); setShowQuiz6Result(true); break;
    }
  };

  // ─── Table Component ──────────────────────────────────────────────────────
  const Table = ({ headers, rows, title }: { headers: string[]; rows: string[][]; title?: string }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-[#121212]">
      {title && (
        <div className="px-4 py-2 font-semibold bg-slate-50 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm">
          {title}
        </div>
      )}
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-50 dark:bg-[#1a1a1a]">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="border border-slate-200 dark:border-slate-700 p-3 text-left font-semibold text-slate-800 dark:text-slate-200">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-[#121212]' : 'bg-slate-50 dark:bg-[#1a1a1a]'}>
              {row.map((cell, j) => (
                <td key={j} className="border border-slate-200 dark:border-slate-700 p-3 text-slate-700 dark:text-slate-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ─── Question Reveal Component ────────────────────────────────────────────
  const QuestionReveal = ({ question, answer }: { question: string; answer: string }) => {
    const [revealed, setRevealed] = useState(false);
    return (
      <div className="bg-white dark:bg-[#121212] p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-4">
        <p className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">{question}</p>
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
          >
            Click to reveal answer
          </button>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-slate-800 dark:text-slate-200 whitespace-pre-line text-sm">{answer}</p>
            <button
              onClick={() => setRevealed(false)}
              className="text-xs text-slate-500 dark:text-slate-400 mt-2 hover:underline"
            >
              Hide answer
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Network size={14} className="inline mr-1" /> NETWORK ADMINISTRATION
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 2{' '}
            <span className="text-sky-300 font-bold italic">
              Network Configuration & Administration
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the practical skills of deploying, configuring, and maintaining
            physical network equipment – from interpreting diagrams to using
            command-line tools.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Settings size={14} className="inline mr-1" /> Configuration
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Terminal size={14} className="inline mr-1" /> CLI
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
                placeholder="Search for a concept, command, or protocol..."
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
          {/* Left column: sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* 1. Introduction */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Introduction to Network Configuration & Administration
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    This learning outcome focuses on the practical, hands-on aspects of networking – from reading network diagrams and physically installing equipment to configuring IP addresses, testing connectivity, and documenting the entire setup. These are the skills that network technicians use every day.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Think of network configuration like building and maintaining a city's road system. You need to read the blueprints (diagrams), lay the roads (cables), install traffic lights (routers, switches), and give each building an address (IP address). Then you need tools to test the roads (ping, traceroute) and keep everything running smoothly (monitoring).
                </p>
              </div>
            </div>

            {/* 2. Interpreting Network Diagrams */}
            <div
              ref={(el) => {
                sectionRefs.current['diagrams'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Interpreting Network Diagrams
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Network diagrams are visual maps showing how devices are connected. Being able to read them is essential for deployment and troubleshooting.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Key Elements</h3>
              <Table
                headers={["Element", "What to look for"]}
                rows={[
                  ["Devices", "Computers, routers, switches, firewalls, WAPs, printers, cloud symbols"],
                  ["Connections", "Lines between devices – solid = wired, dashed = wireless"],
                  ["Labels", "Device names, IP addresses, subnet information"],
                  ["Legend", "Key explaining what each symbol means"],
                  ["Colour coding", "Different colours for different network types or departments"],
                ]}
                title="Diagram Elements"
              />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">How to Read a Diagram – 3 Steps</h4>
                <ol className="list-decimal pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Identify network segments</strong> – groups of devices connected to a central switch (usually a department or area).</li>
                  <li><strong>Follow the connections</strong> – trace how devices connect within a segment and how segments connect to the router for internet access.</li>
                  <li><strong>Read the labels</strong> – check IP addresses, device names, and subnet information.</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Benefits</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Troubleshooting</strong> – visually trace problems.</li>
                  <li><strong>Documentation</strong> – clear reference for all IT staff.</li>
                  <li><strong>Planning</strong> – visualise upgrades and additions.</li>
                  <li><strong>Communication</strong> – explain network structure to non-technical people.</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">If asked to interpret a diagram, always start by identifying: devices → connections → labels → data flow direction!</p>
              </div>
            </div>

            {/* 3. Deploying Network Devices */}
            <div
              ref={(el) => {
                sectionRefs.current['deploy'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Deploying Network Devices – Step by Step
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">This is the process of physically installing and setting up network devices according to a network diagram.</p>

              <div className="space-y-6">
                {/* Phase 1 */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><ClipboardCheck size={14} /> Phase 1: Preparation</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Study the network diagram – note device types, quantities, cable types, IP addresses, VLANs.</li>
                    <li>Inventory and pre-configure devices (IP addresses, usernames, passwords) before going on-site.</li>
                    <li>Prepare the site – ensure workspace, power outlets, and rack/cabinet space are ready.</li>
                  </ul>
                </div>

                {/* Phase 2 */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><Wrench size={14} /> Phase 2: Deployment</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Physically mount devices in designated locations (racks/cabinets).</li>
                    <li>Connect cables according to the diagram – label them.</li>
                    <li>Position Wireless Access Points (WAPs) for best coverage.</li>
                    <li>Power up all devices.</li>
                  </ul>
                </div>

                {/* Phase 3 */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"><CheckCircle size={14} /> Phase 3: Post-Deployment Verification</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Check all devices boot up normally – verify LED indicators.</li>
                    <li>Test connectivity – ping devices, test internet access.</li>
                    <li>Complete detailed configuration (IP, security, firewalls, etc.).</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Know the 3 phases: Preparation → Deployment → Post-Deployment Verification. Examiners often ask to outline the steps.</p>
              </div>
            </div>

            {/* 4. Network Connectivity Devices */}
            <div
              ref={(el) => {
                sectionRefs.current['connectivity'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Connectivity Devices
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Router</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Connects DIFFERENT networks together and routes data between them. Uses IP addresses. Like a GPS for data – finds the best path.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Switch</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Connects devices WITHIN the same network using MAC addresses. Sends data only to the intended device – reduces congestion.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Hub (Legacy)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Older device that sends data to ALL connected devices – causes congestion. Mostly obsolete but still mentioned in exams.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Quick Summary</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li>Hub = sends to ALL.</li>
                  <li>Switch = sends only to INTENDED device.</li>
                  <li>Router = between DIFFERENT networks.</li>
                </ul>
              </div>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which device sends data to ALL connected devices, regardless of the intended recipient?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 2)} /> a) Switch
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 2)} /> b) Router
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 2)} /> c) Hub
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 2 ? '✅ Correct! Hubs send data to all devices.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
              </div>
            </div>

            {/* 5. Network Access Devices */}
            <div
              ref={(el) => {
                sectionRefs.current['access'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Access Devices
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Wireless Access Point (WAP)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Creates a Wi-Fi zone so wireless devices (phones, laptops) can connect without cables. Like a wireless "socket in the air."</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400">Modem</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Translates digital data from your network into a format that can travel over telephone or cable lines, and vice versa. <span className="font-bold">MO</span>dulator-<span className="font-bold">DEM</span>odulator.</p>
                </div>
              </div>
            </div>

            {/* 6. Network Security Devices */}
            <div
              ref={(el) => {
                sectionRefs.current['security'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Security Devices
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Firewall</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Guards the network against unauthorised access and malicious traffic. Filters all incoming and outgoing traffic based on security rules. Blocks threats like malware and hacking attempts.</p>
              </div>
            </div>

            {/* 7. Other Network Devices */}
            <div
              ref={(el) => {
                sectionRefs.current['other-devices'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Other Network Devices
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">NIC</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Network Interface Card – allows a computer to connect to a network. Every computer needs one.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Load Balancer</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Distributes incoming traffic across multiple servers so no single server is overloaded. Used in large, high-traffic environments.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">VPN Router</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Creates a secure encrypted tunnel between a remote device and a private network. Used for secure remote access.</p>
                </div>
              </div>
            </div>

            {/* 8. Structured Cabling Standards */}
            <div
              ref={(el) => {
                sectionRefs.current['cabling-standards'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Structured Cabling Standards
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Structured cabling is a standardised, organised system for installing all the cables in a building – like a planned highway system for data, not just random wires everywhere.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Two Main Standards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">ANSI/TIA-568</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">USA standard for telecom cabling – defines Cat5e, Cat6, Cat6A, RJ45 wiring configs (T568A and T568B).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">ISO/IEC 11801</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">International standard for generic cabling systems – broader global standard.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">5 Benefits of Structured Cabling</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Improved Performance</strong> – fewer errors, faster speeds.</li>
                  <li><strong>Enhanced Reliability</strong> – reduces loose connections and downtime.</li>
                  <li><strong>Scalability</strong> – easy to add new devices without rewiring.</li>
                  <li><strong>Maintainability</strong> – labelled, organised cables = faster troubleshooting.</li>
                  <li><strong>Interoperability</strong> – components from different manufacturers work together.</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Know BOTH standards and be able to compare them. Also know the 5 benefits!</p>
              </div>
            </div>

            {/* 9. Components of Structured Cabling */}
            <div
              ref={(el) => {
                sectionRefs.current['cabling-components'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Components of Structured Cabling
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">There are 6 components – learn them in order from outside to inside.</p>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Entrance Facility (EF) – "The Entry Door"</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Entry point where ISP cables come INTO the building. Contains demarcation point, main cross-connect, and surge protectors.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Equipment Room (ER) – "The Engine Room"</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Central hub housing servers, routers, switches, firewalls, and patch panels. The most important room!</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Backbone Cabling – "The Motorway"</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">High-speed main cables (Cat6+) connecting EF to ERs and TRs across the building. Carries the most traffic.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Telecommunication Room (TR) – "Local Exchange Point"</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Distribution point on each floor. Contains patch panels, connects backbone to horizontal cabling. Like a mini-hub for each floor.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Horizontal Cabling – "The Side Streets"</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Connects individual work areas (desks) to the nearest TR. Uses Cat5e or Cat6 with RJ45 connectors. Like side streets connecting houses to the main road.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">Work Area – "The Houses"</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Where users are – desks and workstations. Contains wall plate jacks and short patch cords connecting computers to wall jacks.</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Know all 6 components IN ORDER from outside-in: EF → ER → Backbone → TR → Horizontal → Work Area!</p>
              </div>

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which component of structured cabling connects individual workstations to the nearest Telecommunication Room?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 4)} /> a) Backbone Cabling
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 4)} /> b) Equipment Room
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 2, 4)} /> c) Entrance Facility
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 3, 4)} /> d) Horizontal Cabling
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 3 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 3 ? '✅ Correct! Horizontal cabling connects workstations to the TR.' : '❌ Incorrect. The correct answer is d.'}
                  </div>
                )}
              </div>
            </div>

            {/* 10. Ethernet Deployment Standards */}
            <div
              ref={(el) => {
                sectionRefs.current['ethernet'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Ethernet Deployment Standards (IEEE 802.3)
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Ethernet standards define how data is physically transmitted over cables.</p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Speed Standards</h3>
              <Table
                headers={["Standard", "Speed", "Notes"]}
                rows={[
                  ["10BASE-T", "10 Mbps", "Original Ethernet – very old"],
                  ["100BASE-TX", "100 Mbps", "Fast Ethernet – still common"],
                  ["1000BASE-T", "1 Gbps", "Gigabit Ethernet – current standard"],
                  ["10GbE", "10 Gbps", "10 Gigabit – used in data centres"],
                ]}
                title="Ethernet Speeds"
              />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Other Important Standards</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>PoE (Power over Ethernet) – IEEE 802.3af/at/bt</strong> – Delivers power AND data through one Ethernet cable. Used for IP cameras, VoIP phones, WAPs.</li>
                  <li><strong>Auto-Negotiation</strong> – Devices automatically detect and agree on the best connection speed.</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">PoE is very popular in exams. Remember: PoE = power + data through ONE cable!</p>
              </div>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which technology delivers power and data through a single Ethernet cable?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 2)} /> a) Auto-Negotiation
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 2)} /> b) Gigabit Ethernet
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 2, 2)} /> c) PoE (Power over Ethernet)
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 2 ? '✅ Correct! PoE delivers power and data together.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
              </div>
            </div>

            {/* 11. IP Address Configuration */}
            <div
              ref={(el) => {
                sectionRefs.current['ip-config'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                IP Address Configuration
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Assigning a unique numerical address to every device on a network so they can communicate.</p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Two Types of IP Assignment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Static IP</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manually assigned – never changes. Used for servers, routers, printers that need a permanent, predictable address.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Dynamic IP</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Automatically assigned by a DHCP server – changes periodically. Used for laptops, phones, and everyday devices. Easier to manage.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Additional Configuration Settings</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Subnet Mask</strong> – defines which part is network vs host.</li>
                  <li><strong>Default Gateway</strong> – the router's IP address – the "exit" to the internet.</li>
                  <li><strong>DNS Server</strong> – translates domain names to IP addresses.</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Know the difference between Static (manual, permanent) and Dynamic (automatic, changes) IP addresses, and when each is used!</p>
              </div>

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which type of IP address is manually assigned and never changes?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 0)} /> a) Static
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 0)} /> b) Dynamic
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 0 ? '✅ Correct! Static IPs are manually assigned and permanent.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
              </div>
            </div>

            {/* 12. Routing Protocols */}
            <div
              ref={(el) => {
                sectionRefs.current['routing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Routing Protocols
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Routing protocols are software rules that tell routers how to find the best path for data to travel across a network.</p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Two Main Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Distance Vector (DVRP)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Routers share information about the number of hops to reach a destination. Simple but slower to update. Good for small networks. Examples: RIP, RIPv2.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Link-State (LSRP)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Routers share a complete map of the entire network. More complex but faster and smarter. Good for large networks. Examples: OSPF, IS-IS.</p>
                </div>
              </div>

              <Table
                headers={["Feature", "DVRP", "LSRP"]}
                rows={[
                  ["What's shared", "Distance/hops", "Full network map"],
                  ["Convergence speed", "Slow", "Fast"],
                  ["Complexity", "Simple", "Complex"],
                  ["Best for", "Small networks", "Large networks"],
                  ["Examples", "RIP, RIPv2", "OSPF, IS-IS"],
                ]}
                title="Comparison"
              />

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">DVRP = counts hops (simple). LSRP = shares full network map (smart). Know the examples for each!</p>
              </div>

              {/* Quiz 5 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which type of routing protocol shares a full map of the network with all routers?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 0, 1)} /> a) Distance Vector (DVRP)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 1, 1)} /> b) Link-State (LSRP)
                  </label>
                </div>
                {showQuiz5Result && (
                  <div className={`mt-2 p-2 rounded ${quiz5Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz5Answer === 1 ? '✅ Correct! Link-State protocols share a full map.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 13. Network Testing & Monitoring */}
            <div
              ref={(el) => {
                sectionRefs.current['testing-monitoring'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Testing & Monitoring Tools
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Testing (Proactive)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Proactively checking network health BEFORE problems affect users. Tools: Ping, Traceroute, Bandwidth Testers, Packet Capture, Wireless Site Survey.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Monitoring (Continuous)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Continuously watching the network in real-time – 24/7. Tools: NPM (Network Performance Monitor), System Monitoring, Log Management, Configuration Management.</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Testing = PROACTIVE (done periodically). Monitoring = CONTINUOUS (always running).</p>
              </div>
            </div>

            {/* 14. Cable Testing Tools */}
            <div
              ref={(el) => {
                sectionRefs.current['cable-testing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Cable Testing Tools
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Cable Tester</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Checks if a cable is properly wired and working – finds breaks, wrong pins, short circuits. Simple continuity testers (pass/fail) and advanced testers (measure quality).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Protocol Analyser</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Captures and analyses LIVE network traffic – shows source/destination IP, ports, protocols, and data content. Used for troubleshooting, security, and performance analysis. Example: Wireshark.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Certifier</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Verifies that installed cables MEET performance standards (e.g., Cat5e, Cat6). Tests continuity, wire map, attenuation, crosstalk. Provides documented proof that cable meets the standard.</p>
                </div>
              </div>

              <Table
                headers={["Tool", "Focus", "Used for"]}
                rows={[
                  ["Protocol Analyser", "Network traffic content", "Troubleshooting, security"],
                  ["Certifier", "Physical cable performance", "Installation verification"],
                ]}
                title="Comparison"
              />
            </div>

            {/* 15. TDR & OTDR */}
            <div
              ref={(el) => {
                sectionRefs.current['tdr-otdr'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Cable Testing Equipment – TDR, OTDR, Multimeter
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">TDR</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Sends electrical pulses through copper cables to find faults – breaks, shorts, impedance mismatches. Measures cable length. Used for Ethernet (Cat5e, Cat6).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">OTDR</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Same concept but uses LIGHT PULSES through fibre optic cables. Finds fibre breaks, bad connectors, excessive bending, signal loss. Used for fibre optic cables.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Multimeter</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Measures voltage, current, resistance. For cables: checks basic continuity (is the wire connected?). Quick but limited – can't pinpoint fault location.</p>
                </div>
              </div>

              <Table
                headers={["Tool", "Cable Type", "What it finds"]}
                rows={[
                  ["TDR", "Copper (Cat5e, Cat6)", "Breaks, shorts, fault location"],
                  ["OTDR", "Fibre optic", "Fibre breaks, bad connectors, signal loss"],
                  ["Multimeter", "Any", "Basic continuity only"],
                ]}
                title="Comparison"
              />

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">TDR = copper cables. OTDR = fibre optic cables. Easy to remember!</p>
              </div>
            </div>

            {/* 16. Toner Probe */}
            <div
              ref={(el) => {
                sectionRefs.current['toner'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Toner Probe
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">A two-part tool (toner generator + probe) used to TRACE and IDENTIFY a specific cable among many in a building.</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>How it works:</strong> Attach toner generator to one end of the cable – it injects a signal. Walk along walls/ceilings with the toner probe; it beeps/flashes when near the cable.</li>
                  <li><strong>Used for:</strong> Finding a specific cable in a bundle, tracing cables behind walls, locating cables for moves or repairs.</li>
                  <li><strong>Pros:</strong> Non-destructive, fast, cheap.</li>
                  <li><strong>Cons:</strong> Signal weakens over distance, doesn't work well through metal conduits, doesn't tell cable condition.</li>
                </ul>
              </div>
            </div>

            {/* 17. Command Line Tools */}
            <div
              ref={(el) => {
                sectionRefs.current['cmd-tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Command Line Tools
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">These are commands typed in the Command Prompt (Windows) or Terminal (Linux/Mac) to diagnose network issues. Very popular in exams!</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">ping</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Tests connectivity, measures latency, checks packet loss. Example: ping 192.168.1.1</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">traceroute / tracert</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Shows the complete path (every router hop) to a destination. Example: tracert www.google.com</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">ipconfig</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Displays IP configuration (Windows) – IP, subnet mask, default gateway, DNS.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">ifconfig</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Same as ipconfig for Linux/Mac – also shows interface status.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">arp</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Displays MAC-to-IP mappings (ARP cache). Example: arp -a</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">nslookup</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Queries DNS to resolve domain names to IP addresses. Example: nslookup www.google.com</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-pink-600 dark:text-pink-400">dig</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Advanced DNS lookup (Linux/Mac) – returns detailed DNS records.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">hostname</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Displays your computer's network name.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">route</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Views or edits the routing table.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400">netstat</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Shows active network connections, open ports, routing table.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">nbstat</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Windows-only – shows NetBIOS sessions and name tables.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-lime-600 dark:text-lime-400">mtr</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Combines ping and traceroute in real-time (Linux/Mac).</p>
                </div>
              </div>

              <Table
                headers={["Command", "OS", "What it does"]}
                rows={[
                  ["ping", "All", "Test connectivity, measure latency"],
                  ["tracert/traceroute", "All", "Map path to destination"],
                  ["ipconfig", "Windows", "View IP configuration"],
                  ["ifconfig", "Linux/Mac", "View IP configuration"],
                  ["arp", "All", "View MAC-to-IP mappings"],
                  ["nslookup", "All", "DNS name lookup"],
                  ["dig", "Linux/Mac", "Advanced DNS lookup"],
                  ["hostname", "All", "Display computer name"],
                  ["route", "All", "View/edit routing table"],
                  ["netstat", "All", "View active connections"],
                  ["nbstat", "Windows only", "NetBIOS statistics"],
                  ["mtr", "Linux/Mac", "Real-time ping + traceroute"],
                ]}
                title="Command Line Tools"
              />

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">The MOST tested commands are: ping, traceroute, ipconfig, nslookup, netstat. Know what each does!</p>
              </div>

              {/* Quiz 6 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which command shows the complete path (hops) to a destination?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz6" onChange={() => checkAnswer(6, 0, 1)} /> a) ping
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz6" onChange={() => checkAnswer(6, 1, 1)} /> b) traceroute
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz6" onChange={() => checkAnswer(6, 2, 1)} /> c) nslookup
                  </label>
                </div>
                {showQuiz6Result && (
                  <div className={`mt-2 p-2 rounded ${quiz6Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz6Answer === 1 ? '✅ Correct! traceroute maps the path.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* 18. Network Documentation */}
            <div
              ref={(el) => {
                sectionRefs.current['documentation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Documentation
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">A complete written and visual record of everything about your network – devices, configurations, diagrams, procedures. Like the user manual for your entire network!</p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">6 Benefits</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><strong>Enhanced Troubleshooting</strong> – quick reference when things go wrong.</li>
                <li><strong>Improved Onboarding</strong> – new IT staff understand the network quickly.</li>
                <li><strong>Efficient Change Management</strong> – track changes and impact.</li>
                <li><strong>Network Visibility</strong> – clear picture of all interconnections.</li>
                <li><strong>Improved Security</strong> – identify vulnerabilities and gaps.</li>
                <li><strong>Reduced Costs & Downtime</strong> – faster fixes = less downtime = less money lost.</li>
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">What to Include</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">Network Topology Diagram</div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">Wiring Layout and Rack Diagrams</div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">IDF/MDF Documentation</div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">Server Configuration</div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">Network Equipment Records</div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">Network Configuration</div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">Performance Baseline</div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">Key Applications Used</div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">Network Services (DNS, DHCP, etc.)</div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">SOPs (Standard Operating Procedures)</div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Documentation questions often ask "What should be included in network documentation?" – learn the elements above!</p>
              </div>
            </div>

            {/* 19. Practice Q&A */}
            <div
              ref={(el) => {
                sectionRefs.current['practice'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Practice Questions & Answers
              </h2>

              <QuestionReveal
                question="Q1. What are the 3 phases of deploying network devices and what happens in each phase?"
                answer="1. Preparation – Study the network diagram, gather equipment, pre-configure devices if possible, prepare the physical installation site.\n\n2. Deployment – Physically install devices in designated locations, connect cables as per diagram, position WAPs, power up all devices.\n\n3. Post-Deployment Verification – Check devices boot correctly, test basic connectivity using ping, complete detailed configuration of each device."
              />

              <QuestionReveal
                question="Q2. Differentiate between a Router, Switch, and Hub."
                answer="A router connects different networks together and routes data between them using IP addresses – it is what connects your internal network to the internet. A switch connects devices WITHIN the same network and uses MAC addresses to forward data only to the intended device, reducing congestion. A hub is an older device that sends incoming data to ALL connected devices regardless of who it's intended for – this causes congestion and inefficiency, which is why hubs are no longer used in modern networks."
              />

              <QuestionReveal
                question="Q3. List and describe the 6 components of a structured cabling system."
                answer="1. Entrance Facility (EF) – Entry point for ISP services; contains demarc point, main cross-connect, and surge protectors.\n\n2. Equipment Room (ER) – Central hub housing servers, routers, switches, firewalls, and patch panels.\n\n3. Backbone Cabling – High-speed cables (Cat6+) connecting EF to ERs and TRs throughout the building.\n\n4. Telecommunication Room (TR) – Floor-level distribution point with patch panels connecting backbone to horizontal cables.\n\n5. Horizontal Cabling – Cables (Cat5e/Cat6) connecting individual workstations to the nearest TR, with RJ45 connectors.\n\n6. Work Area – User desks with wall plate jacks and patch cords connecting computers to the network."
              />

              <QuestionReveal
                question="Q4. What is PoE and why is it useful?"
                answer="PoE (Power over Ethernet) is a technology defined in IEEE 802.3af/at/bt that allows electrical power to be delivered to a device through the same Ethernet cable that carries data. This eliminates the need for a separate power cable and power outlet for the device. It is particularly useful for wireless access points, VoIP phones, and IP security cameras because these devices can be installed in locations where power outlets are not available, such as on ceilings or high on walls."
              />

              <QuestionReveal
                question="Q5. Compare Distance Vector and Link-State routing protocols."
                answer="Distance Vector protocols (like RIP) work by sharing information about the number of hops to reach a destination. They are simple to configure and suitable for small networks, but suffer from slow convergence (slow to update when network changes happen) and can create routing loops. Link-State protocols (like OSPF) share a complete map of the entire network topology with all routers. They are more complex to configure but converge much faster and make more efficient routing decisions, making them better suited for large and complex networks."
              />

              <QuestionReveal
                question="Q6. What is the difference between ping and traceroute?"
                answer="Ping tests whether your device can reach another device on the network. It sends ICMP packets and reports back the response time and whether any packets were lost – it simply confirms connectivity and measures latency. Traceroute goes further by revealing the complete path (every router hop) that data travels from your device to the destination. It shows how long each hop takes, allowing you to identify exactly which router along the path is causing delays or failures."
              />

              <QuestionReveal
                question="Q7. What is a Protocol Analyser and what is it used for?"
                answer="A protocol analyser (like Wireshark) is a tool that captures and analyses live network traffic data packets flowing through a network. It records details like source and destination IP addresses, port numbers, protocols used, and in some cases the actual data content. It is used for: identifying network performance bottlenecks, debugging communication issues between devices, detecting security threats and suspicious traffic, verifying that protocols are functioning correctly, and monitoring network activity for troubleshooting and optimisation."
              />

              <QuestionReveal
                question="Q8. List FIVE command-line tools and state what each does."
                answer="1. ping – Tests connectivity between two devices and measures response time (latency).\n\n2. traceroute/tracert – Maps the path data takes to reach a destination, showing each router hop.\n\n3. ipconfig – Displays the IP address, subnet mask, default gateway, and DNS settings of your Windows computer.\n\n4. nslookup – Queries DNS servers to translate domain names to IP addresses for DNS troubleshooting.\n\n5. netstat – Displays all active network connections, open ports, and routing table information."
              />

              <QuestionReveal
                question="Q9. What is network documentation and why is it important?"
                answer="Network documentation is a comprehensive written and visual record of all components, configurations, diagrams, and procedures that make up a network. It is important because it speeds up troubleshooting by providing a quick reference guide, helps new IT staff understand the network quickly, enables effective change management by tracking modifications, improves network security by identifying vulnerabilities, and reduces costly downtime through faster problem resolution."
              />

              <QuestionReveal
                question="Q10. Differentiate between TDR and OTDR."
                answer="TDR (Time Domain Reflectometry) uses electrical pulses to test copper cables (like Cat5e and Cat6). It identifies faults like breaks, short circuits, and impedance mismatches, and can pinpoint exactly where along the cable the fault is located. OTDR (Optical Time Domain Reflectometry) does the same thing but uses light pulses to test fibre optic cables. It identifies fibre breaks, bad connectors, excessive bends, and signal loss. The key difference is the cable type: TDR = copper cables, OTDR = fibre optic cables."
              />
            </div>

            {/* 20. Exam Tips */}
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Phases of Device Deployment</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Preparation → Deployment → Post-Deployment Verification – know each phase.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Structured Cabling Components</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">6 components in order: EF, ER, Backbone, TR, Horizontal, Work Area – "EEBTHW".</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Ethernet Standards</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Know the speed standards (10BASE-T, 100BASE-TX, 1000BASE-T, 10GbE) and PoE.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Routing Protocols</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">DVRP (RIP) vs LSRP (OSPF) – know the differences and examples.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Command Line Tools</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">ping, traceroute, ipconfig, nslookup, netstat – know their purpose and when to use them.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Network Documentation</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">What to include: topology, wiring, server configs, equipment records, baselines, applications, services, SOPs.</p>
                </div>
              </div>

              {/* Cheat Sheet */}
              <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
                <h3 className="font-bold text-lg text-purple-800 dark:text-purple-300 mb-4">📋 Quick Cheat Sheet</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Phases of deployment</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">3</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Cabling components</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">6</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Benefits of structured cabling</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">5</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Ethernet speed standards</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">4</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Routing protocol types</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">2</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Common CLI tools</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">12</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Configure. Test. Document. Succeed. ⚙️</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 CLI Insight
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
                  <span>Deployment Phases</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>CLI Tools Listed</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">12</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Configuration and administration are hands-on skills. Practice reading diagrams, identifying devices, and memorising command-line tools. Relate each concept to real-world scenarios – it makes everything easier to remember.
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
                <strong className="text-white">Interpreting network diagrams</strong> is the first step – identify devices, connections, labels, and data flow.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Deploying devices</strong> follows a 3-phase process: Preparation, Deployment, and Post-Deployment Verification.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Key devices</strong> include routers (between networks), switches (within networks), firewalls (security), and WAPs (wireless).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Structured cabling</strong> has 6 components and follows ANSI/TIA-568 or ISO/IEC 11801 standards – providing performance, reliability, and scalability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Command-line tools</strong> like ping, traceroute, ipconfig, and nslookup are essential for troubleshooting and configuration.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Documentation</strong> is vital – topology, configurations, baselines, and SOPs ensure maintainability and reduce downtime.
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
            Sidemann Academic Registry • Network Configuration & Administration 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;
