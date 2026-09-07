import React, { useState, useEffect } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Activity,
  Search,
  Wrench,
  Briefcase,
  Printer,
  ShieldCheck,
  Monitor,
  Cpu,
  HardDrive,
  Zap,
  Info,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Layers,
  ListChecks,
  BookOpen,
  Tablet,
  Layout,
  ClipboardList,
  Settings,
  Clock,
  BarChart3,
  Database,
  Globe,
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
  { id: 'monitoring', label: 'Monitoring SW' },
  { id: 'performance', label: 'Performance Tests' },
  { id: 'taskmanager', label: 'Task Manager' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'printers', label: 'Printers' },
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
        text: 'The first computer virus, called "Creeper," was created in 1971 as an experiment. It displayed the message "I\'m the creeper, catch me if you can!"',
      },
      {
        title: 'Pro Tip',
        text: 'Always back up your data before performing major troubleshooting steps like reinstalling the operating system or updating drivers.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember the troubleshooting steps: "Identify, Isolate, Investigate, Implement, Verify" – the 5 I\'s of troubleshooting.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people forget to check the simplest things first – like power cables, brightness settings, or restarting the device. Always start with the basics.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first computer virus, called "Creeper," was created in 1971 as an experiment. It displayed the message "I\'m the creeper, catch me if you can!"',
      },
      {
        title: 'Pro Tip',
        text: 'Always back up your data before performing major troubleshooting steps like reinstalling the operating system or updating drivers.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember the troubleshooting steps: "Identify, Isolate, Investigate, Implement, Verify" – the 5 I\'s of troubleshooting.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people forget to check the simplest things first – like power cables, brightness settings, or restarting the device. Always start with the basics.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  // Scroll to section when tab changes
  const scrollToSection = (index: number) => {
    setActiveSectionIndex(index);
    const tab = SECTION_TABS[index];
    const element = document.getElementById(`lo5-${tab.id}`);
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
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <ShieldCheck size={14} className="inline mr-1" /> COMPUTER SYSTEMS MAINTENANCE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 5{' '}
            <span className="text-rose-300 font-bold italic">
              Monitoring &amp; Troubleshooting
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master system monitoring, performance testing, and troubleshooting.
            Learn to use tools like Task Manager, diagnose common problems, and
            implement solutions for a stable computing environment.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 6 sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Activity size={14} className="inline mr-1" /> Diagnostics
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Wrench size={14} className="inline mr-1" /> Troubleshooting
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-indigo-200" size={20} />
              <input
                id="lo5-search-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a tool, issue, or solution..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-indigo-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    document.getElementById('lo5-search-input')?.focus();
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
          <div className="space-y-12">
            {/* Introduction */}
            <div
              id="lo5-intro"
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="flex items-center gap-3 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                  Proactive maintenance protocols and systematic fault
                  rectification for modern computing environments.
                </p>
              </div>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                In this learning outcome, you will learn how to monitor your
                system's health, perform routine performance tests, use built‑in
                tools like Task Manager, and troubleshoot common issues.
                Effective monitoring and troubleshooting are essential skills
                for any IT professional.
              </p>
            </div>

            {/* 1. System Monitoring Software */}
            <div
              id="lo5-monitoring"
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                System Monitoring Software
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                System monitoring software provides real‑time insights into the
                health of IT infrastructure. Below is a breakdown of popular
                options:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                {/* Free/Open Source */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                    <Database size={20} className="text-indigo-500" /> Free and
                    Open‑Source Options
                  </h3>
                  <div className="space-y-4">
                    <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                      <h4 className="font-bold text-slate-900 dark:text-white uppercase">Zabbix</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                        Powerful and scalable platform for network devices,
                        servers, and cloud.
                      </p>
                      <ul className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase space-y-1">
                        <li>• Customizable dashboards and reports</li>
                        <li>• Extensive alerting options</li>
                        <li>• Automatic discovery of network devices</li>
                      </ul>
                    </div>
                    <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                      <h4 className="font-bold text-slate-900 dark:text-white uppercase">Nagios</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                        Known for its extreme flexibility and plugin‑based
                        architecture.
                      </p>
                      <ul className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase space-y-1">
                        <li>• Plugin‑based for extensive capabilities</li>
                        <li>• Active and passive checks</li>
                        <li>• Scalable for large infrastructures</li>
                      </ul>
                    </div>
                    <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                      <h4 className="font-bold text-slate-900 dark:text-white uppercase">PRTG Network Monitor</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                        Ideal for small networks with a user‑friendly interface.
                      </p>
                      <ul className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase space-y-1">
                        <li>• Monitors servers, routers, and websites</li>
                        <li>• Alerting via email, SMS, and push</li>
                        <li>• Real‑time/historical data visualization</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Commercial Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                    <Briefcase size={20} className="text-purple-500" /> Commercial
                    Options
                  </h3>
                  <div className="space-y-4">
                    <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                      <h4 className="font-bold text-slate-900 dark:text-white uppercase">SolarWinds SAM</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                        Comprehensive monitoring for servers and applications.
                      </p>
                      <ul className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase space-y-1">
                        <li>• Real‑time application performance</li>
                        <li>• Automated root cause analysis</li>
                        <li>• Performance optimization recommendations</li>
                      </ul>
                    </div>
                    <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                      <h4 className="font-bold text-slate-900 dark:text-white uppercase">Datadog</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                        Cloud‑based unified monitoring platform.
                      </p>
                      <ul className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase space-y-1">
                        <li>• Real‑user monitoring (RUM)</li>
                        <li>• Log management and analysis</li>
                        <li>• Scalable for complex environments</li>
                      </ul>
                    </div>
                    <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                      <h4 className="font-bold text-slate-900 dark:text-white uppercase">LogicMonitor</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                        Comprehensive monitoring for hybrid IT environments.
                      </p>
                      <ul className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase space-y-1">
                        <li>• Automatic device discovery</li>
                        <li>• AI‑powered anomaly detection</li>
                        <li>• Integrates with various IT tools</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Benefits of Routine Computer Performance Tests */}
            <div
              id="lo5-performance"
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Benefits of Routine Computer Performance Tests
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {[
                  {
                    t: "Identify Performance Issues",
                    d: "Early detection of bottlenecks before they impact your work.",
                  },
                  {
                    t: "Maintain System Stability",
                    d: "Identify overheating or resource issues that cause crashes.",
                  },
                  {
                    t: "Optimize Resource Usage",
                    d: "Understand CPU, RAM, and storage usage to improve allocation.",
                  },
                  {
                    t: "Benchmark Performance",
                    d: "Establish baselines and track changes over time.",
                  },
                  {
                    t: "Inform Upgrade Decisions",
                    d: "Know when to upgrade hardware based on test results.",
                  },
                  {
                    t: "Diagnose Hardware Issues",
                    d: "Pinpoint faulty memory or overheating components.",
                  },
                ].map((benefit, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                  >
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
                      {benefit.t}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      {benefit.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Using Task Manager to Monitor Performance */}
            <div
              id="lo5-taskmanager"
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Using Task Manager to Monitor Performance
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-6 bg-slate-900 text-white rounded-xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full"></div>
                  <h3 className="text-xl font-bold uppercase tracking-widest mb-4 flex items-center gap-3">
                    <Monitor size={24} className="text-blue-400" /> Windows Task
                    Manager
                  </h3>
                  <div className="space-y-5 text-sm font-medium opacity-90 leading-relaxed">
                    <div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] block mb-1">
                        How to Open
                      </span>
                      <p>
                        Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded border border-white/20 text-xs">
                          Ctrl + Shift + Esc
                        </kbd>{' '}
                        or right‑click the taskbar.
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] block mb-1">
                        Metrics Tab
                      </span>
                      <ul className="space-y-2 list-disc pl-4">
                        <li>
                          <strong>CPU:</strong> Shows overall usage and per‑process
                          usage.
                        </li>
                        <li>
                          <strong>Memory:</strong> Displays total/available memory
                          and usage by processes.
                        </li>
                        <li>
                          <strong>Disk:</strong> Shows read/write speeds.
                        </li>
                        <li>
                          <strong>Network:</strong> Monitors sent/received data.
                        </li>
                      </ul>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] block mb-1">
                        Proactive Management
                      </span>
                      <p>
                        Identify high‑CPU or memory processes in the{' '}
                        <strong>Processes</strong> tab and end them if
                        unnecessary.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                      <HardDrive size={20} className="text-indigo-500" /> System
                      Maintenance with Built‑in Tools
                    </h3>
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase text-slate-900 dark:text-white underline">
                        Disk Cleanup (Windows)
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        Identifies and removes temporary files, internet files,
                        and other system‑generated files that consume storage.
                      </p>
                      <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-r-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-relaxed">
                        Step 1: Open File Explorer.<br />
                        Step 2: Right‑click C: Drive → Properties.<br />
                        Step 3: Click Disk Cleanup → Clean up system files.<br />
                        Step 4: Select categories and click OK.
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                      <Settings size={20} className="text-indigo-500" /> Goals of
                      System Monitoring Software
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Proactive Monitoring",
                        "Early Issue Detection",
                        "Performance Optimization",
                        "Alerting & Notification",
                        "Historical Data Analysis",
                        "Improved Stability",
                      ].map((goal, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-slate-600 dark:text-slate-400"
                        >
                          <CheckCircle size={14} className="text-green-500 shrink-0" />{' '}
                          {goal}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Troubleshooting System Problems */}
            <div
              id="lo5-troubleshooting"
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Troubleshooting System Problems
              </h2>

              <div className="p-6 bg-indigo-600 text-white rounded-xl shadow-lg mb-6">
                <h3 className="text-xl font-bold uppercase tracking-widest mb-3 flex items-center gap-3">
                  <Search size={24} /> What is Troubleshooting?
                </h3>
                <p className="text-sm md:text-base font-medium leading-relaxed opacity-90 italic">
                  "Troubleshooting is the systematic process of identifying and
                  resolving problems within a system. It involves a series of
                  steps to diagnose the root cause of an issue and implement
                  solutions to fix it."
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                  Common System Problems and Tips
                </h3>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212]">
                  <table className="w-full text-left border-collapse min-w-[700px] text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700 text-slate-500">
                        <th className="p-3 font-bold uppercase tracking-widest text-[10px] w-1/4">
                          Problem
                        </th>
                        <th className="p-3 font-bold uppercase tracking-widest text-[10px] w-1/4">
                          Possible Causes
                        </th>
                        <th className="p-3 font-bold uppercase tracking-widest text-[10px]">
                          Basic Troubleshooting
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold uppercase text-slate-900 dark:text-white">
                          Computer Won't Start
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">
                          Power supply, faulty hardware, corrupted system files.
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 italic">
                          Check plug/switch. Ensure cables connected. Verify
                          battery charge. Try restarting.
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold uppercase text-slate-900 dark:text-white">
                          The Screen is Blank
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">
                          Loose monitor cable, graphics card issues, monitor
                          malfunction.
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 italic">
                          Verify power/brightness. Check cable to PC. Try
                          different port. Listen for fan/beeps.
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold uppercase text-slate-900 dark:text-white">
                          OS / Software Issues
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">
                          Software bugs, corrupted files, malware infection.
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 italic">
                          Restart. Check for updates. Reinstall malfunctioning
                          program. Run malware scan.
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold uppercase text-slate-900 dark:text-white">
                          Windows Won't Boot
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">
                          Corrupted system files, hard drive issues, boot sector
                          problems.
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 italic">
                          Restart several times. Use Windows recovery options.
                          Consider system restore (backup first).
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold uppercase text-slate-900 dark:text-white">
                          The Screen is Frozen
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">
                          Resource overload, software crashes, hardware
                          malfunctions.
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 italic">
                          Wait a few minutes. Forced restart via power button.
                          End tasks via Task Manager. Update drivers.
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold uppercase text-slate-900 dark:text-white">
                          Computer is Slow
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">
                          Low RAM, cluttered storage, outdated hardware,
                          malware, startup programs.
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 italic">
                          Close background apps. Remove startup programs.
                          Upgrade RAM. Run defragmentation (HDDs).
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold uppercase text-slate-900 dark:text-white">
                          Overheating
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">
                          Dust buildup, malfunctioning fans, inadequate
                          ventilation.
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 italic">
                          Power down and allow to cool. Clean fans with
                          compressed air. Ensure clear vents. Replace thermal
                          paste.
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold uppercase text-slate-900 dark:text-white">
                          Dropped Internet
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">
                          ISP issues, router problems, weak Wi‑Fi, outdated
                          network drivers.
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 italic">
                          Restart modem/router. Check for area outages. Move
                          closer to router. Update network drivers.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Solutions for Identified Problems */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-500" /> Solutions
                  for Identified System Problems
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      t: "Check the Power Supply",
                      d: "Applicable to: Computer won't start, screen is blank. Ensure power cable is secure. Test with multimeter or known‑functional unit.",
                    },
                    {
                      t: "Display Functionality",
                      d: "Applicable to: Screen is blank. Verify monitor power and brightness. Try connecting to a different device.",
                    },
                    {
                      t: "Eliminate External Hardware",
                      d: "Applicable to: Various issues. Disconnect non‑essential devices and restart to isolate conflicts.",
                    },
                    {
                      t: "Reinstall System",
                      d: "Applicable to: OS failure, boot failure. Backup data first, use recovery media or built‑in options.",
                    },
                    {
                      t: "Restart Server",
                      d: "Applicable to: Server slow performance or network issues. Clears temporary files and stops unnecessary processes.",
                    },
                    {
                      t: "Fix Wi‑Fi Problem",
                      d: "Applicable to: Dropped connections. Restart router, check ISP, update drivers, or upgrade firmware.",
                    },
                    {
                      t: "Find Resource‑Hungry Programs",
                      d: "Applicable to: Slowness. Use Task Manager to identify high CPU/RAM apps and close them.",
                    },
                    {
                      t: "Disable Startup Programs",
                      d: "Applicable to: Slow boot times. Use system settings to disable apps that launch automatically.",
                    },
                    {
                      t: "Scan for Malware and Adware",
                      d: "Applicable to: Pop‑ups, slowness. Use reputable antivirus software with up‑to‑date definitions.",
                    },
                  ].map((sol, i) => (
                    <div
                      key={i}
                      className="p-5 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm"
                    >
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase mb-1 leading-tight">
                        {sol.t}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                        {sol.d}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Types of Printers */}
            <div
              id="lo5-printers"
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Types of Printers
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Printers are output devices that produce text and graphics on a
                physical medium such as paper. There are various types of
                printers, each with its own mechanism and use cases.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {[
                  {
                    t: "Inkjet Printers",
                    d: "Spray tiny droplets of ink onto paper. Best for photos and color documents.",
                  },
                  {
                    t: "Laser Printers",
                    d: "Use toner powder and a laser to produce sharp text. Fast and cost‑effective for high volume.",
                  },
                  {
                    t: "Dot Matrix Printers",
                    d: "Use a print head with pins that strike an ink ribbon. Used for multi‑part forms and receipts.",
                  },
                  {
                    t: "Thermal Printers",
                    d: "Use heat to transfer ink onto paper. Common for receipts and label printing.",
                  },
                ].map((type, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                  >
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      {type.t}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                      {type.d}
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
                  💡 Troubleshooting Tip
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
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Common Problems</span>
                  <span className="font-bold text-green-600 dark:text-green-400">8</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                The key to effective troubleshooting is a systematic approach.
                Always start with the simplest solutions, document your steps,
                and don't hesitate to ask for help when needed.
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
                <strong className="text-white">System Monitoring:</strong> Use
                tools like Zabbix, Nagios, Task Manager, and Disk Cleanup to keep
                systems healthy.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Performance Tests:</strong> Routine
                testing identifies issues early, optimizes resources, and informs
                upgrade decisions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Troubleshooting:</strong> Follow a
                systematic process – identify, isolate, investigate, implement,
                verify. Start with the simplest fixes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Common Issues:</strong> Slow
                computers, boot failures, frozen screens, and overheating are
                often fixable with basic steps.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Printer Types:</strong> Inkjet,
                Laser, Dot Matrix, and Thermal – each suited for different tasks.
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
            Sidemann Academic Registry • Standard IT Maintenance 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;
