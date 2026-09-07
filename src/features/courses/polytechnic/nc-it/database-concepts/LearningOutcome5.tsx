import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Database,
  RefreshCw,
  ShieldCheck,
  Zap,
  HardDrive,
  Cloud,
  Layers,
  Activity,
  CheckCircle,
  AlertTriangle,
  FileText,
  Users,
  ArrowRight,
  Search,
  Briefcase,
  Save,
  BookOpen,
  Clock,
  DollarSign,
  Scale,
  Code,
  Globe,
  Shield,
  Server,
  Rocket,
  Brain,
  FileCode,
  Database as DatabaseIcon,
  Terminal,
  ChevronUp,
  X,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'recovery', label: 'Recovery' },
  { id: 'importance', label: 'Importance' },
  { id: 'goals', label: 'Goals' },
  { id: 'critical-functions', label: 'Critical Functions' },
  { id: 'risk-assessment', label: 'Risk Assessment' },
  { id: 'university-example', label: 'University Example' },
  { id: 'plan-components', label: 'Plan Components' },
  { id: 'key-roles', label: 'Key Roles' },
  { id: 'backup-media', label: 'Backup Media' },
  { id: 'selecting-medium', label: 'Selecting Medium' },
  { id: 'backup-types', label: 'Backup Types' },
  { id: 'testing', label: 'Testing' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome5: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
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
        text: 'The 3-2-1 backup rule is a gold standard for data protection. It ensures that data is not lost even if multiple failures occur simultaneously.',
      },
      {
        title: 'Pro Tip',
        text: 'Always test your backups regularly. A backup is only as good as its ability to be restored.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the backup types: Full, Incremental, Differential, Mirror – think "FIDM" to recall the order of increasing storage efficiency.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations store backups on the same server as the live data. This defeats the purpose – backups should be kept off-site or in a separate location.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The 3-2-1 backup rule is a gold standard for data protection. It ensures that data is not lost even if multiple failures occur simultaneously.',
      },
      {
        title: 'Pro Tip',
        text: 'Always test your backups regularly. A backup is only as good as its ability to be restored.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the backup types: Full, Incremental, Differential, Mirror – think "FIDM" to recall the order of increasing storage efficiency.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations store backups on the same server as the live data. This defeats the purpose – backups should be kept off-site or in a separate location.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  const setSectionRef = (id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  };

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

  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <DatabaseIcon size={14} className="inline mr-1" /> DATABASE BACKUP & RECOVERY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 5{' '}
            <span className="text-rose-300 font-bold italic">
              Disaster Recovery &amp; Backup
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the essentials of database backup, recovery, disaster
            planning, and business continuity. Learn to protect your data
            and ensure rapid restoration after any failure.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">📚 12 sections</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ShieldCheck size={14} className="inline mr-1" /> Recovery
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Brain size={14} className="inline mr-1" /> Business Continuity
            </span>
          </div>

          {/* Search Bar */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-indigo-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, backup type, or recovery method..."
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

      {/* ─── Navigation ──────────────────────────────────────────────────── */}
      <NavTabs />

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* ─── Content ────────────────────────────────────────────────── */}
          <div ref={listContainerRef} className="space-y-12">

            {/* ─── 1. Database Recovery ─────────────────────────────────── */}
            <div ref={setSectionRef('recovery')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Database Recovery
              </h2>
              <div className="flex items-center gap-3 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                  Database recovery is the process of restoring a database to a
                  usable state after a failure or disruption. It is essential
                  for ensuring availability, integrity, and consistency of data.
                </p>
              </div>
            </div>

            {/* ─── 2. Importance of Database Recovery ──────────────────── */}
            <div ref={setSectionRef('importance')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Importance of Database Recovery
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Database failures can have severe consequences. Recovery ensures:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { t: "Data loss prevention", d: "Restore data from backups or recover from failed transactions." },
                  { t: "System availability", d: "Quickly restore to avoid business disruption and lost revenue." },
                  { t: "Data integrity", d: "Verify consistency after a failure to avoid corruption." },
                  { t: "Business continuity", d: "Critical component of BCP to recover systems after a disaster." },
                  { t: "Regulatory compliance", d: "Meet legal requirements for data protection and recovery plans." },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 flex items-start gap-3">
                    <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                        {item.t}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── 3. Goals of Disaster Recovery Planning ──────────────── */}
            <div ref={setSectionRef('goals')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Goals of Disaster Recovery Planning
              </h2>
              <ol className="space-y-3 list-decimal list-inside text-sm text-slate-700 dark:text-slate-300">
                <li>
                  <strong className="text-slate-900 dark:text-white">Minimizing downtime</strong> – restore critical systems as quickly as possible.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Protecting data</strong> – ensure data is backed up regularly and stored securely.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Maintaining business continuity</strong> – integrate with overall BCP to address all critical functions.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Reducing costs</strong> – identify and mitigate risks to minimise financial impact.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Protecting reputation</strong> – communicate effectively during and after a disaster.
                </li>
              </ol>
            </div>

            {/* ─── 4. Identifying Critical Functions and Infrastructure ── */}
            <div ref={setSectionRef('critical-functions')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Identifying Critical Functions &amp; Infrastructure
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                To build a disaster recovery plan, first identify what must be protected.
              </p>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6 mb-4">Critical Functions</h3>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1 pl-4">
                <li>What functions are essential to deliver products or services?</li>
                <li>What functions are required for legal and regulatory compliance?</li>
                <li>What functions protect employees, customers, and stakeholders?</li>
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6 mb-4">Critical Infrastructure</h3>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1 pl-4">
                <li>Physical assets (servers, data centres, buildings).</li>
                <li>Virtual assets (networks, applications, databases).</li>
                <li>Dependencies on external providers.</li>
              </ul>
            </div>

            {/* ─── 5. Risk Assessment ───────────────────────────────────── */}
            <div ref={setSectionRef('risk-assessment')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Risk Assessment
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Assess risks to critical assets based on:
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1 pl-4 mb-6">
                <li>Likelihood of a disaster occurring.</li>
                <li>Potential impact on operations.</li>
                <li>Ability to recover from the disaster.</li>
              </ul>
              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6 mb-4">Risk Mitigation Strategies</h3>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1 pl-4">
                <li>Physical security measures (access control, environmental controls).</li>
                <li>Data security measures (encryption, access control).</li>
                <li>Disaster recovery plans to restore critical functions.</li>
              </ul>
            </div>

            {/* ─── 6. University Example ────────────────────────────────── */}
            <div ref={setSectionRef('university-example')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Example: University Organization
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">Critical Functions</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc pl-5 mt-2 space-y-1">
                    <li>Student registration and enrollment</li>
                    <li>Academic records management</li>
                    <li>Financial aid processing</li>
                    <li>Student support services</li>
                    <li>Faculty and staff support</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">Critical Infrastructure</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc pl-5 mt-2 space-y-1">
                    <li>Data centres, network equipment, servers</li>
                    <li>Storage devices, application software</li>
                    <li>Campus buildings, libraries, laboratories</li>
                    <li>IT assets: website, LMS, SIS, email</li>
                    <li>Human resources: IT staff, faculty, staff</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ─── 7. Components of a Data Recovery Plan ────────────────── */}
            <div ref={setSectionRef('plan-components')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Components of a Data Recovery Plan
              </h2>
              <ol className="space-y-3 list-decimal list-inside text-sm text-slate-700 dark:text-slate-300">
                <li><strong>Establish recovery goals</strong> – define RTOs and RPOs.</li>
                <li><strong>Identify critical assets</strong> – prioritise data, systems, infrastructure.</li>
                <li><strong>Conduct risk assessment</strong> – evaluate threats and vulnerabilities.</li>
                <li><strong>Define backup &amp; recovery strategies</strong> – choose backup types, frequency, storage locations.</li>
                <li><strong>Establish incident response procedures</strong> – assign roles, communication protocols.</li>
                <li><strong>Document and test the plan</strong> – regularly validate through drills.</li>
                <li><strong>Training and awareness</strong> – educate all personnel.</li>
                <li><strong>Continuous monitoring &amp; improvement</strong> – update as needed.</li>
                <li><strong>Communication and coordination</strong> – ensure clear channels across teams.</li>
                <li><strong>Legal and regulatory compliance</strong> – adhere to data protection laws.</li>
              </ol>
            </div>

            {/* ─── 8. Key Roles in Backup and Recovery ──────────────────── */}
            <div ref={setSectionRef('key-roles')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Key Roles in Database Backup &amp; Recovery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { r: "Database Administrator (DBA)", d: "Develops and implements backup plans, monitors processes, performs recoveries." },
                  { r: "Storage Administrator", d: "Manages storage infrastructure, ensures backup capacity and security." },
                  { r: "Application Developers", d: "Design applications to minimise data loss and facilitate recovery." },
                  { r: "Network Engineers", d: "Ensure network connectivity for backup and recovery operations." },
                  { r: "Security Specialists", d: "Protect backups from unauthorised access and ensure compliance." },
                  { r: "Disaster Recovery Team", d: "Develops overall DR plans, integrates backup and recovery strategies." },
                ].map((role, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 text-center">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">{role.r}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">{role.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── 9. Backup Media / Site ────────────────────────────────── */}
            <div ref={setSectionRef('backup-media')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Backup Media / Site
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase">Media Options</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Removable media</strong> – external drives, USB, optical discs (portable, affordable, less secure).</li>
                    <li><strong>Cloud storage</strong> – Amazon S3, Azure, Google Cloud (secure, scalable, accessible).</li>
                    <li><strong>NAS</strong> – network-attached storage (secure, scalable, on‑site).</li>
                    <li><strong>Tape backups</strong> – traditional, low‑cost, but slower.</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase">Backup Sites</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc pl-5 mt-2 space-y-1">
                    <li><strong>On‑site</strong> – stored at the same location (convenient, vulnerable to local disasters).</li>
                    <li><strong>Off‑site</strong> – different location (more secure, harder to manage).</li>
                    <li><strong>Cloud</strong> – storage service (secure, scalable, most expensive).</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ─── 10. Selecting a Backup Medium ─────────────────────────── */}
            <div ref={setSectionRef('selecting-medium')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Selecting a Backup Medium
              </h2>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#121212] shadow-sm">
                <table className="w-full text-left border-collapse text-xs min-w-[700px]">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Factor</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Removable Media</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Cloud Storage</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">NAS</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Tape</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Cost</td>
                      <td className="p-3">Affordable</td>
                      <td className="p-3">Varies by volume</td>
                      <td className="p-3">More expensive</td>
                      <td className="p-3">Inexpensive for large data</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Reliability</td>
                      <td className="p-3">Susceptible to damage</td>
                      <td className="p-3">Very reliable</td>
                      <td className="p-3">Very reliable</td>
                      <td className="p-3">Very reliable</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Speed</td>
                      <td className="p-3">Varies</td>
                      <td className="p-3">Depends on internet</td>
                      <td className="p-3">Fast</td>
                      <td className="p-3">Slow</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Availability</td>
                      <td className="p-3">Portable</td>
                      <td className="p-3">Worldwide</td>
                      <td className="p-3">On‑site / remote</td>
                      <td className="p-3">Requires physical access</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Usability</td>
                      <td className="p-3">Easy</td>
                      <td className="p-3">User‑friendly</td>
                      <td className="p-3">More complex</td>
                      <td className="p-3">Specialised hardware/software</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ─── 11. Types of Backup ───────────────────────────────────── */}
            <div ref={setSectionRef('backup-types')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Types of Backup
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    t: "Full Backup",
                    d: "Complete copy of all data. Creates a baseline.",
                    adv: ["Most comprehensive protection", "Simple restore"],
                    dis: ["Time‑consuming", "Requires large storage"],
                  },
                  {
                    t: "Incremental Backup",
                    d: "Backs up only data changed since the last full or incremental backup.",
                    adv: ["Faster", "Less storage"],
                    dis: ["Restore requires full + all incrementals"],
                  },
                  {
                    t: "Differential Backup",
                    d: "Backs up all data changed since the last full backup.",
                    adv: ["Faster restore than incremental"],
                    dis: ["More storage than incremental"],
                  },
                  {
                    t: "Mirror Backup",
                    d: "Creates an exact, real‑time copy of the source.",
                    adv: ["Real‑time protection", "No restore needed"],
                    dis: ["Double storage", "Complex setup"],
                  },
                ].map((type, i) => (
                  <div key={i} className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="bg-indigo-600 text-white p-2 text-center rounded-t-lg -mt-5 -mx-5 mb-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">{type.t}</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">{type.d}</p>
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div>
                        <span className="text-[9px] font-bold text-green-600 dark:text-green-400 uppercase">✓ Advantages</span>
                        <ul className="text-[10px] text-slate-600 dark:text-slate-400 font-medium list-disc pl-4">
                          {type.adv.map((a, j) => <li key={j}>{a}</li>)}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-orange-500 uppercase">✗ Disadvantages</span>
                        <ul className="text-[10px] text-slate-600 dark:text-slate-400 font-medium list-disc pl-4">
                          {type.dis.map((d, j) => <li key={j}>{d}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">3-2-1 Backup Rule</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                  <strong>3</strong> copies of your data (original + 2 backups), stored on <strong>2</strong> different media types, with <strong>1</strong> copy kept off‑site.
                </p>
              </div>
            </div>

            {/* ─── 12. Test Backup / Recovery ────────────────────────────── */}
            <div ref={setSectionRef('testing')} className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Test Backup &amp; Recovery
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Regular testing ensures backups are usable and recovery procedures work.
              </p>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6 mb-4">Objectives of Backup Testing</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                <li>Verify backup integrity</li>
                <li>Validate backup process</li>
                <li>Measure backup performance</li>
                <li>Identify restore issues</li>
                <li>Enhance disaster recovery readiness</li>
                <li>Meet regulatory compliance</li>
                <li>Detect security vulnerabilities</li>
                <li>Optimise backup costs</li>
                <li>Improve backup automation</li>
                <li>Empower backup stakeholders</li>
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-8 mb-4">Factors Determining Test Frequency</h3>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#121212] shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Factor</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Criticality of data</td>
                      <td className="p-3">More critical data → more frequent testing (weekly/monthly).</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Frequency of data changes</td>
                      <td className="p-3">Frequently changing data → test daily or weekly.</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Regulatory requirements</td>
                      <td className="p-3">Industry regulations (HIPAA, SEC) specify minimum intervals.</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Available resources</td>
                      <td className="p-3">Balance cost of testing against potential cost of data loss.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-8 mb-4">Actions Based on Test Results</h3>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1 pl-4">
                <li>Remediate data integrity issues – restore or recreate affected data.</li>
                <li>Address backup process errors – fix scheduling or configuration problems.</li>
                <li>Enhance backup automation – improve efficiency and reliability.</li>
                <li>Review backup infrastructure – upgrade hardware if bottlenecks are found.</li>
                <li>Update security measures – patch vulnerabilities.</li>
                <li>Revisit backup frequency – adjust based on risk.</li>
                <li>Document findings and actions – maintain compliance.</li>
              </ul>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Recovery Tip
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
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{SECTION_TABS.length}</span>
                </li>
                <li className="flex justify-between">
                  <span>Backup Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Recovery Goals</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                A backup is only as good as its restore. Regular testing and a
                well‑documented recovery plan are essential. Follow the 3‑2‑1
                rule and involve all key roles in the process.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Scroll-to-Top ────────────────────────────────────────────────── */}
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

      {/* ─── Key Takeaways ────────────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">1.</span>
              <span>
                <strong className="text-white">Database Recovery</strong> – restores
                data after failures, ensuring availability, integrity, and
                business continuity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">2.</span>
              <span>
                <strong className="text-white">Disaster Recovery Goals</strong> –
                minimise downtime, protect data, maintain continuity, reduce
                costs, protect reputation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">3.</span>
              <span>
                <strong className="text-white">Backup Types</strong> – Full,
                Incremental, Differential, Mirror – each with trade‑offs in
                storage, speed, and restore complexity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">4.</span>
              <span>
                <strong className="text-white">3‑2‑1 Rule</strong> – 3 copies,
                2 media, 1 off‑site – a fundamental best practice.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">5.</span>
              <span>
                <strong className="text-white">Testing</strong> – regular testing
                validates backups, identifies issues, and ensures readiness for
                real disasters.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer className="mx-auto px-[5px] sm:px-6 md:px-8 pb-8 text-center opacity-30">
        <div className="inline-flex items-center gap-2">
          <BookOpen size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">
            Sidemann Academic Registry • NC IT Database Registry 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;