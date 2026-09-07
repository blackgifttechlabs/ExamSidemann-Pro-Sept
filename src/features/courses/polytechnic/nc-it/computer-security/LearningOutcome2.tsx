import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Flag,
  Shield,
  ShieldCheck,
  Lock,
  FileText,
  CheckCircle,
  AlertTriangle,
  Server,
  Database,
  Activity,
  Globe,
  HardDrive,
  Zap,
  RefreshCw,
  Layout,
  Key,
  BookOpen,
  ArrowRight,
  Wifi,
  Terminal,
  Cloud,
  BatteryCharging,
  Save,
  Layers,
  Search,
  X,
  ChevronUp,
  Sparkles,
  Info,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'classification', label: 'Classification' },
  { id: 'access', label: 'Access Control' },
  { id: 'security-controls', label: 'Security Controls' },
  { id: 'physical-logical', label: 'Physical/Logical' },
  { id: 'connectivity', label: 'Connectivity Testing' },
  { id: 'backup', label: 'Backup' },
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
        text: 'The first computer virus, "Creeper," was created in 1971. It displayed the message "I\'m the creeper, catch me if you can!"',
      },
      {
        title: 'Pro Tip',
        text: 'Always use the principle of least privilege – give users only the access they need to do their job, nothing more.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four control types: "Deterrent, Detective, Corrective, Preventive" – think of "DDCP" as "Don\'t Do Crime Please."',
      },
      {
        title: 'Common Mistake',
        text: 'Many organizations focus on technical controls while neglecting physical security. A server without physical protection is vulnerable to theft or tampering.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first computer virus, "Creeper," was created in 1971. It displayed the message "I\'m the creeper, catch me if you can!"',
      },
      {
        title: 'Pro Tip',
        text: 'Always use the principle of least privilege – give users only the access they need to do their job, nothing more.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four control types: "Deterrent, Detective, Corrective, Preventive" – think of "DDCP" as "Don\'t Do Crime Please."',
      },
      {
        title: 'Common Mistake',
        text: 'Many organizations focus on technical controls while neglecting physical security. A server without physical protection is vulnerable to theft or tampering.',
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
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Shield size={14} className="inline mr-1" /> COMPUTER SECURITY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 2{' '}
            <span className="text-sky-300 font-bold italic">
              Data Classification &amp; Access Controls
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master data classification, access control methods (DAC, MAC, RBAC),
            security controls (deterrent, detective, corrective, preventive),
            physical vs logical security, network connectivity testing, and
            backup strategies.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 7 sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Lock size={14} className="inline mr-1" /> Security
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Save size={14} className="inline mr-1" /> Backup
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
                placeholder="Search for a concept, control, or method..."
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
                  Data classification is the process of categorizing data based
                  on its sensitivity, criticality, and value to the organization.
                  This determines the level of security and control that should
                  be applied to it.
                </p>
              </div>
            </div>

            {/* 1. Data Classification */}
            <div
              ref={setSectionRef('classification')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Data Classification
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Data classification helps organizations protect data from
                unauthorized access, use, or disclosure. A common approach uses
                four categories:
              </p>

              <div className="space-y-3 mt-4">
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Public data</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Freely available to the public. Examples: marketing materials, product info, news articles.</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Internal-only data</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Not for public disclosure, but not as sensitive. Examples: employee directories, financial reports.</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Confidential data</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Sensitive data for authorized personnel only. Examples: trade secrets, credit card info, medical records.</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Restricted data</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Highly sensitive with strict security requirements. Examples: government secrets, national security data.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6 mb-4">
                Advantages of Data Classification
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5">
                <li><strong>Improved data security:</strong> Identify and protect sensitive data, reducing breach risk.</li>
                <li><strong>Enhanced compliance:</strong> Meet regulations like GDPR and HIPAA.</li>
                <li><strong>More efficient data management:</strong> Easier to find and manage data.</li>
                <li><strong>Better decision-making:</strong> Prioritize security and compliance efforts.</li>
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6 mb-4">
                Activities Involved
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5">
                <li><strong>Identify:</strong> All different types of data the organization holds.</li>
                <li><strong>Locate:</strong> Where data is stored and how it's accessed.</li>
                <li><strong>Classify:</strong> Assign labels based on sensitivity, criticality, and value.</li>
                <li><strong>Value:</strong> Assess financial, legal, and reputational risks.</li>
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6 mb-4">
                Data Classification Levels
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Public</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Freely shared without restrictions. Examples: press releases, financial statements.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Private</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Limited, authorized access. Examples: personal health info, proprietary research.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Internal</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Internal use only. Examples: employee records, strategic plans.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Confidential</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">High security required. Examples: classified government info, trade secrets.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Restricted</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Highest level – national security importance.</p>
                </div>
              </div>
            </div>

            {/* 2. Access Control Methods */}
            <div
              ref={setSectionRef('access')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Access Control Methods
              </h2>

              <div className="space-y-4 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase">Discretionary Access Control (DAC)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Resource owner controls access. Most common type – used in most operating systems and file systems.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase">Mandatory Access Control (MAC)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Uses labels to classify data and users. Enforces strict rules about who can access what. Used in high-security environments.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase">Role-Based Access Control (RBAC)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Assigns users to roles; permissions granted to roles, not individuals. Easier to manage in large organizations.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase">Rule-Based Access Control (RBAC)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Uses rules to determine access based on factors like user identity, time, location, and device type.
                  </p>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212]">
                <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Method</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Description</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Benefits</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Drawbacks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white uppercase">DAC</td>
                      <td className="p-3">Owner controls access</td>
                      <td className="p-3">Flexible, easy to implement</td>
                      <td className="p-3">Can lead to security vulnerabilities</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white uppercase">MAC</td>
                      <td className="p-3">Labels classify data and users</td>
                      <td className="p-3">High levels of security</td>
                      <td className="p-3">Complex, difficult to manage</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white uppercase">RBAC</td>
                      <td className="p-3">Roles with permissions</td>
                      <td className="p-3">Easier to manage in large orgs</td>
                      <td className="p-3">Complex to set up and maintain</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white uppercase">Rule-Based</td>
                      <td className="p-3">Rules determine access</td>
                      <td className="p-3">Very flexible and granular</td>
                      <td className="p-3">Complex to set up and maintain</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Security Controls */}
            <div
              ref={setSectionRef('security-controls')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Security Controls
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Organizations use four types of internal controls to protect assets and achieve business objectives.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">Deterrent Controls</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Discourage individuals from unauthorized activities. Examples: security cameras, background checks, employee training.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Detective Controls</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Detect unauthorized activities after they occur. Examples: audits, transaction monitoring, log reviews.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">Corrective Controls</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Correct or mitigate impact of unauthorized activities. Examples: reversing fraudulent transactions, restoring lost data.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase">Preventive Controls</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Stop unauthorized activities from happening. Examples: segregating duties, firewalls, intrusion detection systems.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  By implementing a combination of these four types of controls,
                  organizations can reduce the risk of fraud, errors, and other
                  unauthorized activities.
                </p>
              </div>
            </div>

            {/* 4. Physical vs Logical Security */}
            <div
              ref={setSectionRef('physical-logical')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Physical vs Logical Security
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-6 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight border-b pb-2">Physical Security</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-3">
                    Protection of physical assets from unauthorized access, use,
                    or damage.
                  </p>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium space-y-1 list-disc pl-4 mt-3">
                    <li>Perimeter security: fences, gates, intrusion detection</li>
                    <li>Access control: locks, keys, security cards</li>
                    <li>Environmental security: fire, flood, earthquake protection</li>
                  </ul>
                </div>
                <div className="p-6 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight border-b pb-2">Logical Security</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-3">
                    Protection of information and systems from unauthorized
                    access, use, or disclosure.
                  </p>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium space-y-1 list-disc pl-4 mt-3">
                    <li>Access control: passwords, MFA, RBAC</li>
                    <li>Data encryption: protect data confidentiality</li>
                    <li>Network security: firewalls, IDS, IPS</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-r-xl">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  <strong>Relationship:</strong> Physical and logical security
                  are complementary. Physical security protects logical assets
                  (servers, network equipment), while logical security protects
                  physical assets (access control systems, cameras).
                </p>
              </div>
            </div>

            {/* 5. Network Connectivity Testing */}
            <div
              ref={setSectionRef('connectivity')}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Network Connectivity Testing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Common Metrics</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium space-y-2 list-disc pl-4 mt-2">
                    <li><strong>Ping response time:</strong> Time for packet round-trip. Lower = faster.</li>
                    <li><strong>Packet loss:</strong> Percentage of packets lost. Higher = congested/unreliable.</li>
                    <li><strong>Throughput:</strong> Amount of data transferred per second. Higher = faster.</li>
                    <li><strong>Latency:</strong> Delay between send and receive. Lower = more responsive.</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Qualitative Information</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium space-y-2 list-disc pl-4 mt-2">
                    <li><strong>Route reachability:</strong> Can a device reach a destination?</li>
                    <li><strong>Path quality:</strong> Quality of the route between devices.</li>
                    <li><strong>Firewall rules:</strong> Are firewalls blocking or allowing traffic?</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h4 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">Interpretation Examples</h4>

                <div className="p-5 bg-slate-900 text-green-400 rounded-xl font-mono text-sm shadow-lg">
                  <div className="flex items-center gap-2 mb-2 opacity-50 border-b border-white/20 pb-2">
                    <Terminal size={14} />
                    <span className="text-xs uppercase">Example 1: Success</span>
                  </div>
                  <p className="mb-2 font-bold">ping test</p>
                  <p className="text-slate-300">
                    This output indicates the test successfully pinged 8.8.8.8
                    with an average response time of 12ms. The network connection
                    is healthy and responsive.
                  </p>
                </div>

                <div className="p-5 bg-slate-900 text-red-400 rounded-xl font-mono text-sm shadow-lg">
                  <div className="flex items-center gap-2 mb-2 opacity-50 border-b border-white/20 pb-2">
                    <Terminal size={14} />
                    <span className="text-xs uppercase">Example 2: Failure</span>
                  </div>
                  <p className="mb-2 font-bold">ping test</p>
                  <p className="text-slate-300">
                    This output indicates the test was unable to ping 192.168.1.1.
                    Possible causes: network outage, firewall blocking traffic,
                    or destination device problem.
                  </p>
                </div>
              </div>
            </div>

            {/* 6. Backup */}
            <div
              ref={setSectionRef('backup')}
              className="scroll-mt-24 pb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Backup
              </h2>

              <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-r-xl">
                <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">Importance of Backup</h3>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 font-medium list-disc pl-4 mt-3">
                  <li><strong>Protect against data loss:</strong> Hardware failure, software errors, human error, malware.</li>
                  <li><strong>Comply with regulations:</strong> GDPR and other regulations require backup plans.</li>
                  <li><strong>Minimize downtime:</strong> Quick restoration reduces business disruption.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6 mb-4">
                Backup Devices
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl text-center shadow-sm">
                  <HardDrive className="mx-auto text-indigo-400 mb-2" size={24} />
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">External HDD</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">Inexpensive, large capacity</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl text-center shadow-sm">
                  <Server className="mx-auto text-indigo-400 mb-2" size={24} />
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">NAS Device</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">Network attached, RAID support</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl text-center shadow-sm">
                  <Database className="mx-auto text-indigo-400 mb-2" size={24} />
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Tape Drives</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">Durable, large capacity</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl text-center shadow-sm">
                  <Cloud className="mx-auto text-indigo-400 mb-2" size={24} />
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Cloud Storage</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">Offsite, scalable</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6 mb-4">
                Backup Types
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h4 className="text-sm font-bold uppercase">Local Backup</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Data backed up to on-site storage (external HDD, NAS, tape).
                    Inexpensive but vulnerable to fire, theft, or disaster.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase">Online Backup</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Data backed up to cloud storage. Convenient and scalable,
                    but may be more expensive and not suitable for sensitive data.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase">Offsite Backup</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Data backed up to a different physical location. Most secure
                    but most expensive and difficult to implement.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6 mb-4">
                Backup Strategies
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Use a Combination</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Combine local, online, and offsite for comprehensive protection.</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">3-2-1 Rule</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Three copies of data, on two different media types, one offsite.</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Test Regularly</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Restore data from backup to a test environment to verify functionality.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6 mb-4">
                Power Backup
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <BatteryCharging className="text-yellow-600" size={20} />
                    <h4 className="text-sm font-bold text-yellow-700 dark:text-yellow-400 uppercase">UPS</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Uninterruptible Power Supply – provides temporary power for
                    short outages (brownouts, surges).
                  </p>
                </div>
                <div className="p-5 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="text-orange-600" size={20} />
                    <h4 className="text-sm font-bold text-orange-700 dark:text-orange-400 uppercase">Generator</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Provides long-term power for extended outages (natural disasters).
                  </p>
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
                  💡 Security Tip
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
                  <span>Access Control Methods</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Backup Types</span>
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
                Security is a layered approach. Combine data classification,
                access controls, security controls, physical security, and
                regular backups to protect your organization's assets.
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
                <strong className="text-white">Data Classification:</strong> Public,
                Internal, Confidential, Restricted – each requires different
                security controls.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Access Control:</strong> DAC, MAC,
                RBAC, Rule-Based – choose based on security requirements and
                organizational complexity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Security Controls:</strong> Deterrent,
                Detective, Corrective, Preventive – a combination provides the
                best protection.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Physical vs Logical:</strong> Both
                are essential and complementary – physical protects assets,
                logical protects information.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Backup Strategy:</strong> Follow
                the 3-2-1 rule and test regularly. Use UPS and generators for
                power backup.
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
            Sidemann Academic Registry • NC IT Computer Security 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;
