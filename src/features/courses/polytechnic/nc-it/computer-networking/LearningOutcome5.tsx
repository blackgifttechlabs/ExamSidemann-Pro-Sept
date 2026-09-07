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
  Map,
  Layers,
  Network,
  CheckCircle,
  Globe,
  RefreshCw,
  AlertTriangle,
  ListChecks,
  Smartphone,
  Info,
  ClipboardList,
  Save,
  Briefcase,
  Zap,
  Terminal,
  List,
  BookOpen,
  ArrowRight,
  ChevronUp,
  Trophy,
  Target,
  X,
  Sparkles,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'justification', label: 'Justification' },
  { id: 'agent', label: 'Agent vs Agentless' },
  { id: 'forms', label: 'Monitoring Forms' },
  { id: 'plan', label: 'Monitoring Plan' },
  { id: 'indicators', label: 'Problem Indicators' },
  { id: 'maps', label: 'Maps' },
  { id: 'diagnose', label: 'Diagnosing' },
  { id: 'record', label: 'Resolution Record' },
  { id: 'continuity', label: 'BC & DR' },
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
        text: 'The first network monitoring tool was "ping," created in 1983. It was named after the sonar pulse sound used to detect submarines.',
      },
      {
        title: 'Pro Tip',
        text: 'When creating a network monitoring plan, always include escalation procedures so that critical alerts reach the right people immediately.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three monitoring forms: "APP" – Active (probes), Passive (listens), Performance (metrics).',
      },
      {
        title: 'Common Mistake',
        text: 'Many organizations focus only on reactive monitoring. Proactive and predictive monitoring are essential for preventing outages before they happen.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first network monitoring tool was "ping," created in 1983. It was named after the sonar pulse sound used to detect submarines.',
      },
      {
        title: 'Pro Tip',
        text: 'When creating a network monitoring plan, always include escalation procedures so that critical alerts reach the right people immediately.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three monitoring forms: "APP" – Active (probes), Passive (listens), Performance (metrics).',
      },
      {
        title: 'Common Mistake',
        text: 'Many organizations focus only on reactive monitoring. Proactive and predictive monitoring are essential for preventing outages before they happen.',
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
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Network size={14} className="inline mr-1" /> COMPUTER NETWORKING
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 5{' '}
            <span className="text-rose-300 font-bold italic">
              Monitoring &amp; Business Continuity
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master network monitoring, agent vs agentless techniques, monitoring
            forms, problem diagnosis, resolution recording, and business
            continuity &amp; disaster recovery strategies.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 10 sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Activity size={14} className="inline mr-1" /> Monitoring
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Globe size={14} className="inline mr-1" /> Continuity
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
                placeholder="Search for a concept, tool, or process..."
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
                  Network monitoring is the process of continuously observing
                  and analyzing the performance, availability, and security of
                  a computer network. It is a critical component of network
                  management.
                </p>
              </div>
            </div>

            {/* 1. Justification for Network Monitoring */}
            <div
              ref={setSectionRef('justification')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Justification for Network Monitoring
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {[
                  {
                    t: "Proactive Problem Detection",
                    d: "Identify and address potential problems before they escalate into outages or breaches.",
                  },
                  {
                    t: "Performance Optimization",
                    d: "Identify bottlenecks, optimize traffic flow, and improve network responsiveness.",
                  },
                  {
                    t: "Security Enhancement",
                    d: "Detect and prevent cyberattacks by monitoring for suspicious activity.",
                  },
                  {
                    t: "Compliance & Regulatory",
                    d: "Demonstrate compliance with data security and privacy requirements.",
                  },
                  {
                    t: "Capacity Planning",
                    d: "Analyze traffic patterns to anticipate future growth and resource needs.",
                  },
                  {
                    t: "Troubleshooting & Root Cause",
                    d: "Provide evidence for faster troubleshooting and root cause identification.",
                  },
                  {
                    t: "Improved Decision-Making",
                    d: "Gain insights into network behavior for informed infrastructure decisions.",
                  },
                  {
                    t: "Reduced Operational Costs",
                    d: "Prevent problems and optimize performance to save on downtime and resources.",
                  },
                  {
                    t: "Enhanced Customer Satisfaction",
                    d: "Ensure reliable, secure network access for uninterrupted services.",
                  },
                  {
                    t: "Business Continuity",
                    d: "Real-time visibility supports quick recovery from disruptions.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
                  >
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                      {item.t}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                      {item.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Agent and Agentless Monitoring */}
            <div
              ref={setSectionRef('agent')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Agent and Agentless Monitoring
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Agent monitoring and agentless monitoring are two distinct
                approaches to network monitoring, each with its own advantages
                and disadvantages.
              </p>
              <div className="space-y-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Agent Monitoring</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Involves installing software agents on monitored devices to
                    collect performance data and metrics. Provides fine-grained
                    insights but is more intrusive.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Agentless Monitoring</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Extracts performance data without deploying agents, using
                    network protocols and APIs. Less intrusive but provides
                    less granular data.
                  </p>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212]">
                <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Feature</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Agent</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Agentless</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Data collection</td>
                      <td className="p-3">Uses software agents installed on devices</td>
                      <td className="p-3">Extracts data directly from devices or network</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Payload size</td>
                      <td className="p-3">Larger</td>
                      <td className="p-3">Smaller</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Intrusiveness</td>
                      <td className="p-3">More intrusive</td>
                      <td className="p-3">Less intrusive</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Granularity</td>
                      <td className="p-3">Detailed</td>
                      <td className="p-3">Less granular</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Deployment</td>
                      <td className="p-3">Agent installation on each device</td>
                      <td className="p-3">Network configuration and API access</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Monitoring Forms */}
            <div
              ref={setSectionRef('forms')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Monitoring Forms
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase">Active Monitoring</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Injects test traffic to measure performance and proactively
                    detect issues in real-time.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase">Passive Monitoring</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Collects data from existing network traffic without injecting
                    test traffic, relying on logs and SNMP traps.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase">Performance Monitoring</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Focuses on measuring latency, bandwidth, and response times
                    to optimize performance.
                  </p>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212]">
                <table className="w-full text-left border-collapse min-w-[700px] text-xs">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Feature</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Active</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Passive</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Data collection</td>
                      <td className="p-3">Injects test traffic</td>
                      <td className="p-3">Analyzes existing traffic</td>
                      <td className="p-3">Measures specific metrics</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Proactive detection</td>
                      <td className="p-3">Yes</td>
                      <td className="p-3">Relies on history</td>
                      <td className="p-3">Identifies bottlenecks</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Real-time visibility</td>
                      <td className="p-3">Yes</td>
                      <td className="p-3">Historical & current</td>
                      <td className="p-3">Yes</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Intrusiveness</td>
                      <td className="p-3">More</td>
                      <td className="p-3">Less</td>
                      <td className="p-3">Depends on metrics</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Network Monitoring Plan */}
            <div
              ref={setSectionRef('plan')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Monitoring Plan
              </h2>
              <div className="p-6 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">Introduction</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    This plan outlines procedures for monitoring performance,
                    availability, and security to ensure efficient, reliable,
                    and secure network operations.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Scope</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                      Encompasses entire network infrastructure – devices,
                      servers, applications, traffic (physical and virtual).
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Objectives</h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 font-medium space-y-1 list-disc pl-4">
                      <li>Proactively identify issues</li>
                      <li>Optimize performance</li>
                      <li>Enhance security</li>
                      <li>Ensure compliance</li>
                      <li>Support business continuity</li>
                    </ul>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Tools &amp; Techniques</h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 font-medium space-y-1 list-disc pl-4">
                      <li>NMS (Network Management System)</li>
                      <li>SNMP, WMI</li>
                      <li>NetFlow / sFlow</li>
                      <li>IDS/IPS</li>
                      <li>Vulnerability scanners</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Metrics</h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 font-medium space-y-1 list-disc pl-4">
                      <li>Device uptime</li>
                      <li>Traffic volume &amp; patterns</li>
                      <li>Latency &amp; response times</li>
                      <li>Resource utilization (CPU, RAM)</li>
                      <li>Error rates &amp; packet loss</li>
                      <li>Security events</li>
                    </ul>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Frequency</h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 font-medium space-y-1 list-disc pl-4">
                      <li>Critical devices: Continuous</li>
                      <li>Non-critical: Periodic</li>
                      <li>Traffic: Continuous aggregation</li>
                      <li>Security: Real-time alerts</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Responsibilities</h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 font-medium space-y-1 list-disc pl-4">
                      <li>Network admin: Overall</li>
                      <li>Security admin: Security monitoring</li>
                      <li>Network engineer: Troubleshooting</li>
                      <li>End users: Reporting problems</li>
                    </ul>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase">Reporting</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Data analyzed and reported regularly to stakeholders.</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase">Incident Response</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Formal plan for breaches, outages, degradations.</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase">Improvement</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Plan reviewed and updated periodically.</p>
                  </div>
                </div>
                <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">Conclusion</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                    By implementing this plan, the organization can minimize
                    downtime, prevent security breaches, and support business
                    continuity.
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Problem Indicators (SNMP, WMI, PING) */}
            <div
              ref={setSectionRef('indicators')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Problem Indicators
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase">SNMP</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Standard protocol for managing and monitoring network
                    devices. Collects performance, configuration, and health
                    information.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase">WMI</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Standard protocol for managing Windows-based systems.
                    Retrieves configuration, performance, and health data.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase">PING</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Network utility to test reachability. Sends packets and
                    waits for a response to measure latency.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-slate-900 text-white rounded-xl shadow-lg">
                <h5 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                  <Info size={16} /> Scenario Example
                </h5>
                <p className="text-sm font-medium italic opacity-90 leading-relaxed mt-2">
                  A user cannot access a network share. The administrator uses
                  Ping to test reachability. If successful, SNMP is used to
                  query the share's response. If it fails, WMI is used to query
                  internal problems. This isolates the problem to the network
                  share for repair or replacement.
                </p>
              </div>
            </div>

            {/* 6. Network Monitoring Maps */}
            <div
              ref={setSectionRef('maps')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Monitoring Maps
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Visual representations of network infrastructure providing
                topology, components, and connections overview.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Horizontal Plane</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Physical layout – two-dimensional view showing physical
                    locations of routers, switches, and cabling.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Vertical Plane</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Logical structure – layered model showing network stack
                    layers (Physical, Data Link, Network, etc.).
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">Viewpoint</h4>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 font-medium space-y-1 list-disc pl-4 mt-1">
                    <li>Top-down: High-level overview</li>
                    <li>Bottom-up: Granular segment focus</li>
                    <li>User-centric: Specific user/group perspective</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">X-Y Line</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Physical coordinates of devices for precise positioning on
                    the map, useful for large multi-location networks.
                  </p>
                </div>
              </div>
            </div>

            {/* 7. Diagnosing Network Problems */}
            <div
              ref={setSectionRef('diagnose')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Diagnosing Network Problems
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">
                    Step-by-Step Guide
                  </h3>
                  <div className="grid grid-cols-1 gap-3 mt-4">
                    {[
                      {
                        t: "1. Gather Information",
                        d: "Identify problem, impact, timing. Review docs and talk to users.",
                      },
                      {
                        t: "2. Identify Symptoms",
                        d: "Analyze performance (latency, loss), monitor traffic, examine logs.",
                      },
                      {
                        t: "3. Analyze Data",
                        d: "Correlate symptoms, use tools (traceroute, SNMP), consider recent changes.",
                      },
                      {
                        t: "4. Implement Solutions",
                        d: "Formulate hypotheses, test with workarounds, implement final fix.",
                      },
                      {
                        t: "5. Monitor and Verify",
                        d: "Monitor performance, collect user feedback, document the process.",
                      },
                    ].map((step, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-lg"
                      >
                        <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {i + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                            {step.t}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                            {step.d}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">
                    Diagnosis Approaches
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Reactive</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                        Responding to problems as they occur, relying on user
                        complaints or alerts.
                      </p>
                    </div>
                    <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Proactive</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                        Focuses on prevention via monitoring, optimization, and
                        regular maintenance.
                      </p>
                    </div>
                    <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Predictive</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                        Utilizes analytics and machine learning to predict
                        potential failures before impact.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 8. Problem Resolution Record */}
            <div
              ref={setSectionRef('record')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Problem Resolution Record
              </h2>
              <div className="p-6 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                    Key Components
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 text-xs text-slate-600 dark:text-slate-400 font-medium list-disc pl-4">
                    <li>Problem Description: Symptoms, impact, start time</li>
                    <li>Problem Identification: Component, device, or software</li>
                    <li>Problem Analysis: Info gathered, tools used, hypotheses</li>
                    <li>Resolution Steps: Fixes, updates, or repairs</li>
                    <li>Resolution Time: Total time from report to resolution</li>
                    <li>Problem Verification: Confirmation of resolution</li>
                    <li>Root Cause Analysis: Underlying cause identification</li>
                    <li>Preventive Measures: Minimize future risks</li>
                    <li>Additional Notes: Observations or workarounds</li>
                  </ul>
                </div>
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">
                    Benefits of Maintaining Records
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs text-slate-600 dark:text-slate-400 font-medium list-disc pl-4">
                    <li>Improved problem resolution: History aids quicker fixes</li>
                    <li>Knowledge sharing: Knowledge base for others</li>
                    <li>Performance tracking: Identify process optimizations</li>
                    <li>Compliance and auditing: Evidence of due diligence</li>
                    <li>Continuous improvement: Pattern identification</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 9. Business Continuity and Disaster Recovery */}
            <div
              ref={setSectionRef('continuity')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Business Continuity (BC) &amp; Disaster Recovery (DR)
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Strategies implemented to ensure continuation of critical
                business operations in event of unexpected disruptions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">BCP</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                    Focuses on maintaining continuity of essential functions and
                    processes.
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 font-medium space-y-1 list-disc pl-4">
                    <li>Business Impact Analysis (BIA)</li>
                    <li>Risk Assessment</li>
                    <li>BCP Strategies (backup, recovery, communication)</li>
                    <li>Testing and Maintenance</li>
                  </ul>
                </div>
                <div className="p-6 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">DRP</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                    Focuses on restoring critical IT systems and infrastructure.
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 font-medium space-y-1 list-disc pl-4">
                    <li>Data Recovery (backup & restore)</li>
                    <li>Application Recovery</li>
                    <li>Infrastructure Recovery</li>
                    <li>Disaster Recovery Site (DRS)</li>
                    <li>Testing and Maintenance</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-6 bg-slate-900 text-white rounded-xl shadow-lg">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-[0.3em] mb-4">
                  Benefits of Implementing BC and DR Strategies
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-medium opacity-90 leading-relaxed">
                  <p>• Reduced Downtime: Quick resumption limits losses.</p>
                  <p>• Enhanced Resilience: Withstand and adapt to disruptions.</p>
                  <p>• Protected Reputation: Brand image protection during crises.</p>
                  <p>• Regulatory Compliance: Meet industry operational standards.</p>
                  <p>• Peace of Mind: Security for management, employees, customers.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Monitoring Tip
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
                  <span>Monitoring Forms</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Diagnosis Approaches</span>
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
                Effective monitoring combines proactive, reactive, and
                predictive approaches. Always document resolutions and plan
                for business continuity to ensure resilience against disruptions.
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
                <strong className="text-white">Monitoring Justification:</strong> Proactive detection, performance optimization, security, compliance, capacity planning, and business continuity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Agent vs Agentless:</strong> Agent provides granular data but is intrusive; agentless is less intrusive but less granular.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Monitoring Forms:</strong> Active (probes), Passive (listens), Performance (metrics) – each serves a different purpose.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Problem Indicators:</strong> SNMP (device health), WMI (Windows systems), PING (reachability) help isolate faults.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">BC &amp; DR:</strong> Business Continuity Planning (BCP) and Disaster Recovery Planning (DRP) ensure resilience and quick recovery.
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

export default LearningOutcome5;