import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Flag,
  Shield,
  Server,
  Monitor,
  ShieldCheck,
  Activity,
  Search,
  Zap,
  Radio,
  CheckCircle,
  Settings,
  Terminal,
  HardDrive,
  AlertTriangle,
  RefreshCw,
  Wifi,
  Smartphone,
  Globe,
  List,
  BookOpen,
  ArrowRight,
  Users,
  Lock,
  Award,
  Briefcase,
  Plus,
  Save,
  Eye,
  Bell,
  GraduationCap,
  Repeat,
  Network,
  Layers,
  ChevronUp,
  Trophy,
  Target,
  X,
  Sparkles,
  Wrench,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'monitoring', label: 'Monitoring' },
  { id: 'testing', label: 'Testing' },
  { id: 'security', label: 'Security' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'repairs', label: 'Repairs' },
  { id: 'upgrades', label: 'Upgrades' },
  { id: 'servicing', label: 'Servicing' },
];

const networkImage = (filename: string) =>
  new URL(`./images/${filename}`, import.meta.url).href;

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
  // ✅ Safe refs using Record<string, HTMLDivElement | null>
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
        text: 'The first computer network monitoring tool, "ping," was created in 1983 by Mike Muuss. It was named after the sound of a sonar pulse.',
      },
      {
        title: 'Pro Tip',
        text: 'Always document every troubleshooting step you take. It not only helps you track progress but also provides valuable reference for future issues.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the troubleshooting process as "IGIDTVID" – Identify, Gather, Isolate, Develop, Test, Verify, Implement, Document.',
      },
      {
        title: 'Common Mistake',
        text: 'Many administrators forget to check physical connections first. A loose cable can cause hours of unnecessary troubleshooting.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first computer network monitoring tool, "ping," was created in 1983 by Mike Muuss. It was named after the sound of a sonar pulse.',
      },
      {
        title: 'Pro Tip',
        text: 'Always document every troubleshooting step you take. It not only helps you track progress but also provides valuable reference for future issues.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the troubleshooting process as "IGIDTVID" – Identify, Gather, Isolate, Develop, Test, Verify, Implement, Document.',
      },
      {
        title: 'Common Mistake',
        text: 'Many administrators forget to check physical connections first. A loose cable can cause hours of unnecessary troubleshooting.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  // ✅ Safe ref setter function
  const setSectionRef = (id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  };

  // Scroll to section when tab changes
  const scrollToSection = (index: number) => {
    setActiveSectionIndex(index);
    const tab = SECTION_TABS[index];
    const element = sectionRefs.current[tab.id];
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
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
            <Network size={14} className="inline mr-1" /> COMPUTER NETWORKING
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 3{' '}
            <span className="text-purple-300 font-bold italic">
              Network Administration &amp; Maintenance
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master network performance monitoring, security updates,
            troubleshooting, repairs, upgrades, and preventive maintenance.
            Ensure network reliability and efficiency.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 8 sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Activity size={14} className="inline mr-1" /> Monitoring
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Security
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
                placeholder="Search for a tool, concept, or issue..."
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
              ref={setSectionRef('intro')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="flex items-center gap-3 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                  Building a network is only half the job — someone then has
                  to keep it running. In simple terms: this lesson is about
                  watching the network for problems, testing how much it can
                  handle, locking it down against attackers, fixing things
                  when they break, and upgrading parts before they become a
                  problem.
                </p>
              </div>
              <img
                src={networkImage('admin-lifecycle-overview.png')}
                alt="Network administration lifecycle: monitor, test, secure, troubleshoot, repair, upgrade"
                className="w-full h-56 object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm"
              />
            </div>

            {/* 1. Monitor Network Performance */}
            <div
              ref={setSectionRef('monitoring')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Monitor Network Performance
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Monitoring means constantly watching the network the way a
                doctor watches a patient's vital signs — checking things like
                speed, uptime, and traffic so you notice a problem starting
                before it turns into an outage, instead of only finding out
                once everything has already stopped working.
              </p>
              <img
                src={networkImage('network-monitoring-dashboard.png')}
                alt="Network monitoring dashboard showing uptime, traffic, and alerts"
                className="w-full h-56 object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm mt-3"
              />

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6 mb-4">
                Importance of Network Monitoring
              </h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Simply put: watching the network closely means small issues
                get caught and fixed while they are still small, cheap, and
                easy — instead of turning into big, expensive, embarrassing
                outages.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    t: "Improved network performance",
                    d: "Identify and resolve bottlenecks for faster speeds and better application performance.",
                  },
                  {
                    t: "Reduced downtime",
                    d: "Proactively identify and resolve problems to reduce outages and save money.",
                  },
                  {
                    t: "Enhanced security",
                    d: "Identify suspicious activity to prevent security breaches.",
                  },
                  {
                    t: "Better compliance",
                    d: "Meet regulatory requirements for data security and privacy.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
                  >
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                      {item.t}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                      {item.d}
                    </p>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-8 mb-4">
                Network Monitoring Tools
              </h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Each tool below answers a different question about the
                network — "is it healthy?", "what data is actually moving?",
                "which doors are unlocked?", and "which doors have broken
                locks?".
              </p>
              <img
                src={networkImage('network-monitoring-dashboard.png')}
                alt="Network monitoring dashboard showing live traffic and device health"
                className="w-full h-auto object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm mb-4"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    t: "SNMP monitors",
                    icon: Settings,
                    d: "Automatically 'checks in' with routers, switches, and servers to ask how busy they are, how hot they're running, and whether they're still online.",
                  },
                  {
                    t: "Packet sniffers",
                    icon: Search,
                    d: "Captures a copy of the actual data flowing through the network, so you can inspect exactly what's being sent and spot unusual or suspicious traffic.",
                  },
                  {
                    t: "Port scanners",
                    icon: Terminal,
                    d: "Knocks on every 'door' (port) on a device to see which ones are open — useful for finding doors that shouldn't be open to attackers.",
                  },
                  {
                    t: "Vulnerability scanners",
                    icon: Shield,
                    d: "Checks devices against a list of known weaknesses (like an outdated software version) so you can patch them before someone exploits them.",
                  },
                ].map((tool, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <tool.icon size={20} className="text-indigo-500" />
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                        {tool.t}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      {tool.d}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-r-xl text-xs text-slate-600 dark:text-slate-400">
                <strong className="text-orange-600">Note:</strong> Use these
                tools responsibly and ethically. They can capture sensitive data
                or identify vulnerabilities without permission.
              </div>
            </div>

            {/* 2. Network Performance Testing */}
            <div
              ref={setSectionRef('testing')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Performance Testing
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Testing means deliberately putting demand on the network to
                see how it copes — the same way a car is tested on a track
                before it's trusted on the road. It reveals slow spots and
                exactly how much the network can handle before something
                breaks.
              </p>
              <img
                src={networkImage('load-stress-throughput-testing.png')}
                alt="Comparison diagram of load testing, stress testing, and throughput testing"
                className="w-full h-auto object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm mt-3"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    Load testing
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Simulates increasing user load to measure response times,
                    throughput, and resource utilization under varying traffic.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                    Stress testing
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Pushes the network beyond normal limits to determine its
                    breaking point and assess resilience.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    Throughput testing
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Measures the maximum data transfer rate the network can
                    support under specific conditions.
                  </p>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212]">
                <table className="w-full text-left border-collapse min-w-[500px] text-xs">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">
                        Test Type
                      </th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">
                        Purpose
                      </th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">
                        Metrics Measured
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white uppercase">
                        Load Testing
                      </td>
                      <td className="p-3">Evaluate performance under increasing traffic</td>
                      <td className="p-3">Response times, throughput, resource utilization</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white uppercase">
                        Stress Testing
                      </td>
                      <td className="p-3">Determine breaking point</td>
                      <td className="p-3">Error rates, resource exhaustion, failures</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white uppercase">
                        Throughput Testing
                      </td>
                      <td className="p-3">Measure maximum data transfer rate</td>
                      <td className="p-3">Throughput (bits per second)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <img
                src={networkImage('office-equipment-floorplan.png')}
                alt="Office network equipment layout used for planning and testing network performance"
                className="w-full h-auto object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm mt-6"
              />
              <p className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed mt-2 italic">
                In short: load testing asks "can it handle normal-to-busy
                days?", stress testing asks "at what point does it snap?",
                and throughput testing asks "how much can flow through at
                once?"
              </p>
            </div>

            {/* 3. Update Network Security Measures */}
            <div
              ref={setSectionRef('security')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Update Network Security Measures
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Security isn't one lock on one door — it's several layers, so
                that if one fails, another still protects the network.
                Physically stopping someone from touching the equipment,
                confirming who someone is, controlling what they're allowed
                to do, and locking down the Wi-Fi are all separate layers
                covered below.
              </p>

              {/* Physical Security */}
              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6 mb-4">
                Physical Security
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                No amount of software security helps if someone can just walk
                up and unplug — or steal — the actual hardware. Physical
                security is about protecting the equipment itself and the
                room it sits in.
              </p>
              <img
                src={networkImage('physical-security-server-room.png')}
                alt="Secure server room with locked door, access card reader, and camera"
                className="w-full h-auto object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm mb-4"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { t: "Access Control", d: "Security cards, biometrics, fences, doors.", icon: Lock },
                  { t: "Perimeter Security", d: "Fences, walls, motion detectors, cameras.", icon: Shield },
                  { t: "Surveillance", d: "Video cameras, security guards.", icon: Eye },
                  { t: "Alarm Systems", d: "Motion detectors, door/window sensors.", icon: Bell },
                  { t: "Fire Protection", d: "Sprinklers, fire alarms.", icon: Zap },
                  { t: "Environmental Controls", d: "Temperature, humidity, fire suppression.", icon: Activity },
                  { t: "Disaster Preparedness", d: "Evacuation plans, asset protection.", icon: Globe },
                  { t: "Training", d: "Employee awareness of physical security measures.", icon: GraduationCap },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm flex items-start gap-3"
                  >
                    <item.icon size={20} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                        {item.t}
                      </h5>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        {item.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Authentication & Access Control */}
              <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight mt-8 mb-4">
                Authentication and Access Controls
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                These two work together but answer different questions.{' '}
                <strong className="text-slate-900 dark:text-white">Authentication</strong> asks
                "who are you?" (proving your identity, usually with a
                password). <strong className="text-slate-900 dark:text-white">Access
                control</strong> asks "what are you allowed to touch?" —
                like a keycard that opens some doors in a building but not
                others.
              </p>
              <img
                src={networkImage('authentication-vs-access-control.png')}
                alt="Diagram contrasting authentication (identity check) with access control (permissions)"
                className="w-full h-auto object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm mb-4"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Authentication</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Proving that you really are who you say you are — usually
                    by typing a username and password, scanning a fingerprint,
                    or entering a one-time code.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Access Control</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Deciding what a verified user is actually allowed to see
                    or do — for example, a student account can view grades
                    but not edit the school's finance records.
                  </p>
                </div>
              </div>
              <img
                src={networkImage('concept-security-shield.png')}
                alt="Security shield graphic representing multi-factor authentication and account protection"
                className="w-full h-auto object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm my-4"
              />
              <div className="mt-4 p-6 bg-slate-900 text-white rounded-xl shadow-lg">
                <h5 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                  Benefits &amp; Best Practices
                </h5>
                <div className="grid md:grid-cols-2 gap-4 mt-3 text-xs font-medium opacity-90">
                  <ul className="space-y-1 list-disc pl-4">
                    <li>Protects sensitive information</li>
                    <li>Prevents unauthorized access</li>
                    <li>Reduces data breach risk</li>
                    <li>Improves compliance</li>
                  </ul>
                  <ul className="space-y-1 list-disc pl-4">
                    <li>Use strong passwords with regular changes</li>
                    <li>Implement multi-factor authentication (MFA)</li>
                    <li>Use role-based access control (RBAC)</li>
                    <li>Regularly review and update policies</li>
                  </ul>
                </div>
              </div>

              {/* Wireless Security */}
              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-8 mb-4">
                Wireless Network Security
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Because Wi-Fi signals travel through walls into the street,
                anyone nearby could try to listen in. WPA and WPA2 are
                encryption standards that scramble Wi-Fi traffic so it's
                useless to anyone without the password — think of it as
                sealing your letters in a locked box instead of mailing them
                in an open envelope.
              </p>
              <img
                src={networkImage('wpa-vs-wpa2-comparison.png')}
                alt="Comparison diagram of WPA and WPA2 Wi-Fi security encryption"
                className="w-full h-auto object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm mb-4"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase">WPA</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Wi-Fi Protected Access (2003). Uses TKIP encryption,
                    message integrity checks, and mitigation of key reinstallation
                    attacks.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-[9px] font-bold text-green-600 uppercase">Advantages</span>
                      <ul className="text-[10px] text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Superior to WEP</li>
                        <li>Integrity checks</li>
                        <li>Wide compatibility</li>
                      </ul>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-orange-500 uppercase">Disadvantages</span>
                      <ul className="text-[10px] text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>TKIP less secure than AES</li>
                        <li>Susceptible to KRACK attacks</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase">WPA2</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Wi-Fi Protected Access 2 (2004). Uses AES encryption,
                    individual key rotation per user, and is the industry
                    standard.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-[9px] font-bold text-green-600 uppercase">Advantages</span>
                      <ul className="text-[10px] text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>AES encryption</li>
                        <li>Individual key rotation</li>
                        <li>Highly secure</li>
                      </ul>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-orange-500 uppercase">Disadvantages</span>
                      <ul className="text-[10px] text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>High computational overhead</li>
                        <li>Not compatible with older WEP devices</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Network Troubleshooting */}
            <div
              ref={setSectionRef('troubleshooting')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Troubleshooting
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Troubleshooting isn't guessing and randomly restarting things
                until it works — it's a repeatable process, like a doctor
                diagnosing a patient: gather the symptoms, form a theory
                about the cause, test that theory, then fix and confirm.
                Following the same steps every time means you solve problems
                faster and don't miss anything.
              </p>
              <img
                src={networkImage('troubleshooting-process-flowchart.png')}
                alt="Flowchart of the 8-step network troubleshooting process"
                className="w-full h-auto object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm mt-3"
              />

              <div className="mt-6 p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mb-4">
                  The Troubleshooting Process
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { s: "1. Identify the problem", d: "Define symptoms, gather user info, check error logs." },
                    { s: "2. Gather information", d: "Collect topology, hardware, software versions, recent changes." },
                    { s: "3. Isolate the problem", d: "Narrow down affected devices, segments, or applications." },
                    { s: "4. Develop a theory", d: "Formulate a hypothesis (hardware, bug, config, congestion)." },
                    { s: "5. Test the theory", d: "Use diagnostics (ping, trace) to gather evidence." },
                    { s: "6. Implement a solution", d: "Fix root cause (replace, update, adjust)." },
                    { s: "7. Verify the solution", d: "Test and monitor performance to confirm resolution." },
                    { s: "8. Document the process", d: "Keep records for future reference." },
                  ].map((step, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-lg"
                    >
                      <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                          {step.s}
                        </h4>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                          {step.d}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-8 mb-4">
                Troubleshooting Tools
              </h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Most of these tools are free and already built into your
                computer — you just have to know when and how to use them.
              </p>
              <img
                src={networkImage('troubleshooting-tools-kit.png')}
                alt="Common network troubleshooting tools: multimeter, cable tester, laptop with command line"
                className="w-full h-auto object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm mb-4"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { t: "Multimeter", d: "A handheld tool that checks whether electrical wiring or a power supply is actually delivering the voltage it should." },
                  { t: "Cable tester", d: "Plugs into both ends of a cable and confirms every wire is connected correctly and nothing is broken inside." },
                  { t: "Tone generator", d: "Sends a signal down a cable that a matching probe can 'hear', letting you find one specific cable in a tangled bundle." },
                  { t: "tracert/traceroute", d: "Shows every router (hop) data passes through on its way to a destination, so you can see exactly where it slows down or stops." },
                  { t: "ping", d: "Sends a tiny test message to another device and times how long it takes to reply — confirms it's reachable and roughly how fast." },
                  { t: "netstat", d: "Lists which connections and ports are currently active on your computer, useful for spotting unexpected connections." },
                  { t: "ifconfig/ipconfig", d: "Shows your device's own network settings — its IP address, subnet mask, and hardware (MAC) address." },
                  { t: "nslookup", d: "Asks a DNS server what IP address a website name points to — useful for confirming DNS is working correctly." },
                ].map((tool, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
                  >
                    <h5 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                      {tool.t}
                    </h5>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                      {tool.d}
                    </p>
                  </div>
                ))}
              </div>
              <img
                src={networkImage('ping-traceroute-diagram.png')}
                alt="Diagram showing how ping and traceroute test network reachability"
                className="w-full h-auto object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm mt-4"
              />
            </div>

            {/* 5. Network Repairs */}
            <div
              ref={setSectionRef('repairs')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Repairs
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Once troubleshooting has told you what's wrong, a repair is
                the actual fix — reconnecting a cable, restarting a device,
                replacing a broken part, or changing a setting. Below are
                some of the most common problems you'll be asked to repair,
                and where to start looking.
              </p>
              <img
                src={networkImage('server-rack-labeled-cables.png')}
                alt="Labeled server rack cabling used during network repair and fault isolation"
                className="w-full h-auto object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm mt-3"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="bg-red-600 text-white p-2 text-center rounded-t-lg">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                      <AlertTriangle size={14} /> Unable to connect to the internet
                    </h4>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4 mt-3">
                    <li>Check cable connections (Ethernet plugged in?)</li>
                    <li>Restart computer and router/modem</li>
                    <li>Check ISP status for regional outages</li>
                    <li>Try a different DNS server (e.g. 8.8.8.8)</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="bg-red-600 text-white p-2 text-center rounded-t-lg">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                      <AlertTriangle size={14} /> Slow internet speed
                    </h4>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4 mt-3">
                    <li>Check internet plan (volume limits?)</li>
                    <li>Move router away from metal/interference</li>
                    <li>Upgrade router firmware</li>
                    <li>Check for malware/viruses hogging bandwidth</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="bg-red-600 text-white p-2 text-center rounded-t-lg">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                      <AlertTriangle size={14} /> Unable to connect to a network printer
                    </h4>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4 mt-3">
                    <li>Ensure printer is on and connected</li>
                    <li>Check cable connections (power and data)</li>
                    <li>Restart printer and computer</li>
                    <li>Install correct/latest printer drivers</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="bg-red-600 text-white p-2 text-center rounded-t-lg">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                      <AlertTriangle size={14} /> Network congestion
                    </h4>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4 mt-3">
                    <li>Upgrade network infrastructure (router/switches)</li>
                    <li>Prioritize traffic via QoS settings</li>
                    <li>Use traffic analyzer to find bandwidth-hungry apps</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mb-4">
                  Documenting an Implemented Solution
                </h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Writing down what broke and how you fixed it means the
                  next person (or future you) doesn't have to solve the same
                  problem from scratch. A good record covers these six
                  things:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { t: "Identify Problem", d: "Define symptoms, affected devices, error messages." },
                    { t: "Gather Info", d: "Collect topology, hardware, error logs." },
                    { t: "Troubleshooting Process", d: "Describe steps taken and tools used." },
                    { t: "Implemented Solution", d: "Explain the fix (hardware/software/workaround)." },
                    { t: "Verification", d: "Detail testing procedures performed." },
                    { t: "Sharing", d: "Outline the problem/fix for technical teams." },
                  ].map((step, i) => (
                    <div
                      key={i}
                      className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-lg"
                    >
                      <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                        {step.t}
                      </h4>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                        {step.d}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 6. Network Upgrades */}
            <div
              ref={setSectionRef('upgrades')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Upgrades
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Upgrading is planned replacement, not emergency repair — you
                swap out hardware or software before it fails or falls too
                far behind, the same way you'd replace worn car tires ahead
                of a long trip rather than waiting for a blowout.
              </p>
              <img
                src={networkImage('hardware-software-upgrade-cycle.png')}
                alt="Diagram of the network hardware and software upgrade planning cycle"
                className="w-full h-auto object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm mt-3"
              />

              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-6 mb-2">
                Common reasons a network needs upgrading
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                {[
                  "Increased Traffic",
                  "Advanced Tech",
                  "Evolving Apps",
                  "Security Threats",
                  "Compliance",
                  "End-of-life",
                  "Expansion",
                  "Cost Savings",
                  "User Experience",
                  "Future Growth",
                ].map((cause, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-lg text-center flex flex-col items-center"
                  >
                    <CheckCircle size={16} className="text-blue-500 mb-1" />
                    <span className="text-[9px] font-medium text-slate-600 dark:text-slate-400 leading-tight">
                      {cause}
                    </span>
                  </div>
                ))}
              </div>

              <img
                src={networkImage('device-switch-photo-extra.png')}
                alt="Network switch hardware being prepared as part of a hardware upgrade"
                className="w-full h-auto object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm mt-6"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-6 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                    Hardware Upgrades
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 italic mt-2">
                    Swapping physical equipment — routers, switches, cables.
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-decimal pl-4 mt-3">
                    <li>Identify hardware for upgrade (Overload/EOL)</li>
                    <li>Select replacement hardware (Specs/Features)</li>
                    <li>Schedule upgrade downtime</li>
                    <li>Back up network configurations</li>
                    <li>Decommission old hardware (Disposal)</li>
                    <li>Install new hardware</li>
                    <li>Configure new hardware settings</li>
                    <li>Test and verify functionality</li>
                  </ul>
                </div>
                <div className="p-6 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">
                    Software Upgrades
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 italic mt-2">
                    Updating the programs and firmware that run on the
                    equipment — no new physical parts needed.
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-decimal pl-4 mt-3">
                    <li>Identify software for upgrade (Updates/Patches)</li>
                    <li>Download and prepare software</li>
                    <li>Schedule upgrade downtime</li>
                    <li>Back up network configurations</li>
                    <li>Upgrade software on devices</li>
                    <li>Test and verify functionality</li>
                    <li>Monitor network performance post-upgrade</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 7. Service Network Hardware */}
            <div
              ref={setSectionRef('servicing')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Service Network Hardware
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Maintenance falls into three timings: doing things{' '}
                <strong className="text-slate-900 dark:text-white">before</strong> a
                problem happens (preventive), fixing things{' '}
                <strong className="text-slate-900 dark:text-white">after</strong> a
                problem happens (corrective), and{' '}
                <strong className="text-slate-900 dark:text-white">continuously</strong> tweaking
                the network as usage patterns change (adaptive).
              </p>
              <img
                src={networkImage('preventive-corrective-adaptive-maintenance.png')}
                alt="Diagram comparing preventive, corrective, and adaptive network maintenance"
                className="w-full h-auto object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm mt-3"
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                <div className="p-6 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-blue-500 transition-all">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight flex items-center gap-2">
                    <Settings size={20} /> Preventive
                  </h3>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic mt-2">
                    A proactive approach aiming to prevent network problems from
                    occurring.
                  </p>
                  <ul className="text-[10px] text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4 mt-3">
                    <li>Regular hardware checks (Cables/Ventilation)</li>
                    <li>Firmware and software updates</li>
                    <li>Regular data backups</li>
                    <li>Continuous performance monitoring</li>
                    <li>Documentation and knowledge sharing</li>
                  </ul>
                </div>
                <div className="p-6 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-red-500 transition-all">
                  <h3 className="text-lg font-bold text-orange-500 dark:text-orange-400 uppercase tracking-tight flex items-center gap-2">
                    <RefreshCw size={20} /> Corrective
                  </h3>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic mt-2">
                    A reactive approach focusing on fixing network problems
                    after they have occurred.
                  </p>
                  <ul className="text-[10px] text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4 mt-3">
                    <li>Problem identification (Symptoms/Errors)</li>
                    <li>Troubleshooting and log analysis</li>
                    <li>Problem resolution (Hardware/Software)</li>
                    <li>Post-resolution testing</li>
                    <li>Root cause analysis (Recurring issues)</li>
                  </ul>
                </div>
                <div className="p-6 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-emerald-500 transition-all">
                  <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight flex items-center gap-2">
                    <Repeat size={20} /> Adaptive
                  </h3>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic mt-2">
                    An ongoing process of monitoring and adjusting to optimize
                    usage patterns.
                  </p>
                  <ul className="text-[10px] text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4 mt-3">
                    <li>Network capacity planning and forecasting</li>
                    <li>Traffic optimization (QoS/Load Balancing)</li>
                    <li>Security adaptation to new threats</li>
                    <li>New technology evaluation</li>
                    <li>Continuous improvement and refining practices</li>
                  </ul>
                </div>
              </div>

              <img
                src={networkImage('server-rack-labeled-cables.png')}
                alt="Neatly organized server room cabling during routine maintenance"
                className="w-full h-auto object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm mt-6"
              />
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Admin Tip
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
                  <span>Monitoring Tools</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Security Measures</span>
                  <span className="font-bold text-green-600 dark:text-green-400">8+</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Effective network administration combines proactive monitoring,
                strong security, systematic troubleshooting, and regular
                maintenance. Document everything and always test after changes.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
                <strong className="text-white">Monitoring:</strong> Use SNMP,
                packet sniffers, port scanners, and vulnerability scanners to
                track performance and security.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Testing:</strong> Load, stress,
                and throughput testing help identify bottlenecks and breaking
                points.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Security:</strong> Physical
                security, authentication, access control, and WPA/WPA2 are
                essential layers of defense.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Troubleshooting:</strong> Follow
                a systematic process (Identify → Gather → Isolate → Theory → Test
                → Implement → Verify → Document).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Maintenance:</strong> Preventive
                (proactive), Corrective (reactive), and Adaptive (continuous)
                practices keep networks healthy.
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

export default LearningOutcome3;
