import React, { useState, useEffect, useRef } from 'react';
import {
  Code,
  GraduationCap,
  Rocket,
  Brain,
  ChevronRight,
  Terminal,
  Database,
  Layout,
  CheckCircle,
  Clock,
  BookOpen,
  ChevronUp,
  X,
  Sparkles,
  BookMarked,
  Target,
  Users,
  Scale,
  AlertTriangle,
  Globe,
  Swords,
  HeartHandshake,
  Flag,
  RefreshCw,
  Search,
  Cpu,
  HardDrive,
  Server,
  Network,
  Shield,
  Lock,
  Key,
  UserCheck,
  UserX,
  Cloud,
  GitBranch,
  Zap,
  Wifi,
  Lightbulb,
} from 'lucide-react';
import { SQLConsole } from './XAMPPSQLCode';
import { AdSense } from '../../../../analytics/AdSense';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'software-integration', label: 'Software Integration' },
  { id: 'patch-updates', label: 'Patch Updates' },
  { id: 'maintenance-training', label: 'Maintenance & Training' },
  { id: 'data-migration', label: 'Data Migration' },
  { id: 'maintenance-guide', label: 'Maintenance Guide' },
  { id: 'dbms-updates', label: 'DBMS Updates' },
  { id: 'planning-resources', label: 'Planning Resources' },
  { id: 'exam-tips', label: 'Tips' },
];

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
        text: 'A patch update is like a band-aid for software – it fixes a specific vulnerability or bug without changing the whole program.',
      },
      {
        title: 'Pro Tip',
        text: 'Always test database updates in a staging environment before applying them to your production database. This saves you from costly downtime.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the data migration steps: ETL – Extract, Transform, Load. Extract data, Transform it to match the new system, then Load it in.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to back up your database BEFORE applying any patches or updates. A failed update can corrupt your data.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'A patch update is like a band-aid for software – it fixes a specific vulnerability or bug without changing the whole program.',
      },
      {
        title: 'Pro Tip',
        text: 'Always test database updates in a staging environment before applying them to your production database. This saves you from costly downtime.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the data migration steps: ETL – Extract, Transform, Load. Extract data, Transform it to match the new system, then Load it in.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to back up your database BEFORE applying any patches or updates. A failed update can corrupt your data.',
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
                ? 'bg-orange-600 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30'
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
    switch(quizNumber) {
      case 1: setQuiz1Answer(selectedAnswer); setShowQuiz1Result(true); break;
      case 2: setQuiz2Answer(selectedAnswer); setShowQuiz2Result(true); break;
      case 3: setQuiz3Answer(selectedAnswer); setShowQuiz3Result(true); break;
      case 4: setQuiz4Answer(selectedAnswer); setShowQuiz4Result(true); break;
      case 5: setQuiz5Answer(selectedAnswer); setShowQuiz5Result(true); break;
      case 6: setQuiz6Answer(selectedAnswer); setShowQuiz6Result(true); break;
    }
  };

  // ─── Data arrays ──────────────────────────────────────────────────────────
  const advantagesPatchUpdates = [
    "Closes security holes - Stops hackers from getting into your system through known weaknesses.",
    "Reduces risk of data theft - Protects your important information from being stolen.",
    "Prevents malware installation - Stops harmful software from being put on your computer.",
    "Improves system stability - Makes your computer or software crash less often.",
    "Enhances performance - Makes programs run faster and smoother.",
    "Fixes software bugs - Removes errors that cause unexpected problems.",
    "Maintains vendor support - Keeps you eligible for help from the software company.",
    "Keeps you compliant with regulations - Helps meet legal requirements for data protection.",
    "Protects against new threats - Updates your defense against the latest attack methods.",
    "Saves money in the long run - Prevents costly security breaches and system failures."
  ];

  const disadvantagesPatchUpdates = [
    "Can cause compatibility issues - A patch might stop other software from working correctly.",
    "May introduce new bugs - Sometimes a fix for one problem creates a different problem.",
    "Requires downtime - Your system might need to restart or be offline during installation.",
    "Takes time to install - Updates can take several minutes or even hours to complete.",
    "Might fail to install properly - Sometimes patches don't work and need to be reinstalled.",
    "Can consume storage space - Patches take up room on your hard drive.",
    "May change user interface - Buttons or menus might move, confusing users.",
    "Requires internet connection - You need to be online to download most patches.",
    "Automatic updates can be intrusive - They might restart your computer at bad times.",
    "Some patches are not thoroughly tested - Rarely, a patch might cause more harm than good."
  ];

  const advantagesDBMaintenance = [
    "Faster query performance - Your database searches and retrieves data more quickly.",
    "Reduced system crashes - The database stays running without unexpected stops.",
    "Better data accuracy - Information remains correct and trustworthy.",
    "Lower storage costs - Removing unused data frees up expensive storage space.",
    "Improved security posture - Your database is harder for attackers to break into.",
    "Easier disaster recovery - Backups work properly when you need them.",
    "Longer hardware life - Well-maintained databases put less strain on servers.",
    "Higher user satisfaction - People can do their work without frustrating delays.",
    "Regulatory compliance - Meets legal requirements for data management.",
    "Predictable maintenance windows - You can schedule work during quiet times."
  ];

  const disadvantagesDBMaintenance = [
    "Requires skilled staff - You need trained people who understand databases.",
    "Takes time away from other work - Maintenance tasks use up your team's hours.",
    "Can be expensive - You may need to buy tools or hire specialists.",
    "Might require downtime - Users cannot access the database during some tasks.",
    "Risk of human error - A mistake during maintenance could damage data.",
    "Complex to plan - You need to coordinate with many different teams.",
    "Hard to test properly - You cannot always simulate the real environment.",
    "May uncover hidden problems - Fixing one issue might reveal another.",
    "Requires constant attention - Maintenance is never 'finished' once and for all.",
    "Can be boring for staff - Repetitive tasks may lead to mistakes from fatigue."
  ];

  const advantagesDBTraining = [
    "Users make fewer mistakes - Trained people enter data correctly the first time.",
    "Less IT support needed - Users can solve simple problems themselves.",
    "Faster work completion - People know how to find what they need quickly.",
    "Better data quality - Information stays clean, complete, and consistent.",
    "Improved security awareness - Users know how to avoid phishing and password mistakes.",
    "Higher employee confidence - People feel capable and less frustrated.",
    "More data insights - Users can create reports and find trends on their own.",
    "Reduced help desk tickets - Fewer calls about basic database questions.",
    "Consistent procedures - Everyone follows the same correct methods.",
    "Better return on investment - Your database tools get fully used and valued."
  ];

  const disadvantagesDBTraining = [
    "Costs money to develop - Creating good training materials is expensive.",
    "Takes employees away from work - Training hours are not productive work hours.",
    "People forget what they learned - Without practice, skills fade over time.",
    "Not everyone learns the same way - One training style may not work for all.",
    "Training becomes outdated - Software changes, so training needs updates.",
    "Some employees resist learning - People may refuse to change their habits.",
    "Hard to measure results - It is difficult to prove training improved anything.",
    "Requires skilled trainers - Bad trainers can teach wrong information.",
    "May create overconfidence - A little knowledge can lead to risky behavior.",
    "Language barriers - Not all employees understand the training materials well."
  ];

  const advantagesDataMigration = [
    "Move to better technology - You can switch to a faster, newer database system.",
    "Consolidate multiple databases - Bring all your data together in one place.",
    "Reduce storage costs - Modern databases often need less space.",
    "Improve performance - Newer systems run queries much faster.",
    "Enhance security features - Modern databases have better protection.",
    "Enable cloud access - Your data can be available from anywhere.",
    "Standardize data formats - All your information follows the same rules.",
    "Clean up bad data - Migration is a good time to remove errors and duplicates.",
    "Scale more easily - New systems can grow with your business.",
    "Gain new features - You can use advanced tools like analytics and AI."
  ];

  const disadvantagesDataMigration = [
    "Risk of data loss - Information might be accidentally deleted or corrupted.",
    "Very time consuming - Large migrations can take weeks or months.",
    "Expensive to perform - You may need special tools and outside experts.",
    "Requires system downtime - Users may lose access during the migration.",
    "Complex planning needed - Many details must be carefully coordinated.",
    "Potential compatibility issues - Old data might not fit into the new system.",
    "Data format problems - Numbers, dates, or text may not convert correctly.",
    "Hidden costs appear - Unexpected problems always arise during migration.",
    "User retraining needed - People must learn the new system after migration.",
    "Rollback is difficult - Going back to the old system is rarely easy."
  ];

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Database size={14} className="inline mr-1" /> DATABASE ADMINISTRATION
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 3{' '}
            <span className="text-purple-300 font-bold italic">
              Implement &amp; Maintain Database
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master database implementation and maintenance: software integration,
            patch updates, data migration, security, training, and resource planning.
            Keep your database running smoothly, securely, and efficiently.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Database size={14} className="inline mr-1" /> Maintenance
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Security
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-orange-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, patch, or migration step..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-orange-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-orange-200" />
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
                Introduction to Database Implementation &amp; Maintenance
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Welcome to Learning Outcome 3 – Database Implementation and
                    Maintenance! In this module, you'll learn how to keep your
                    database running smoothly, securely, and efficiently. From
                    patch updates to data migration, from user training to
                    resource planning – this guide covers everything you need
                    to maintain a healthy database.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Maintaining a database is like maintaining a car. You need
                  regular oil changes (patch updates), check the tires (performance
                  optimization), replace worn parts (data cleaning), and teach
                  new drivers how to operate it (user training). Skip maintenance,
                  and you'll end up stranded on the side of the road.
                </p>
              </div>
            </div>

            {/* Software Integration */}
            <div
              ref={(el) => {
                sectionRefs.current['software-integration'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Connecting Supporting Software Effectively
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Compatibility Checks</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Before updating your DBMS, verify that all connected software will still work correctly. Read vendor documentation and test in a safe environment first.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Integration Tools</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Special software that moves data between systems automatically, ensuring formats match and reducing manual errors.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">API Management</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">APIs act as waiters between your database and other programs. Keep them updated and maintain clear documentation.</p>
                </div>
              </div>

              <div className="mt-4">
                <SQLConsole
                  code={`-- Checking your database status after an update\nSHOW STATUS LIKE 'Uptime';\n\n-- Checking which version we are running\nSELECT VERSION();\n\n-- Checking connected users and their activities\nSHOW PROCESSLIST;`}
                  isDarkMode={isDarkMode}
                  databaseName="maintenance_console"
                />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">💡 Key Takeaway</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">By planning your resources carefully and creating a clear step-by-step process for connecting your supporting software, you can make sure that database maintenance and updates run smoothly. This approach minimizes disruptions to your work.</p>
              </div>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Why is it important to check compatibility before updating your DBMS?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 1)} /> a) Because updates are always free and easy to install
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 1)} /> b) To ensure other software that connects to the database will still work correctly
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 1)} /> c) To make the database run slower on purpose
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 1 ? '✅ Correct! Compatibility checks ensure all connected software keeps working after an update.' : '❌ Incorrect. The right answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Patch Updates */}
            <div
              ref={(el) => {
                sectionRefs.current['patch-updates'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Patch Updates – Keeping Your Software Secure
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A <span className="font-bold">patch update</span> (also called a
                security patch) is a small piece of software that fixes a specific
                problem or weakness in a larger program. Think of it like a patch
                on a bicycle tire – it covers a hole so air doesn't escape.
              </p>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Why Patch Updates Are Important
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Plugging Security Holes</span> – Fix weaknesses in software code that hackers look for.</li>
                <li><span className="font-bold">Improved Stability and Performance</span> – Fix bugs that cause crashes or freezing.</li>
                <li><span className="font-bold">Maintaining Vendor Support</span> – Keep eligibility for technical support from the software company.</li>
              </ul>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Automatic Updates (Best Way)</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Windows:</span> Windows Update</li>
                    <li><span className="font-bold">macOS:</span> System Preferences → Software Update</li>
                    <li><span className="font-bold">Linux:</span> APT or Yum package managers</li>
                    <li><span className="font-bold">Software Apps:</span> Auto-update settings in Preferences</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Manual Updates (Do It Yourself)</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Visit the software vendor's website for downloads</li>
                    <li>Check software settings for "Check for Updates" button</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                10 Advantages of Patch Updates
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {advantagesPatchUpdates.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-4">
                10 Disadvantages of Patch Updates
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {disadvantagesPatchUpdates.map((dis, idx) => (
                  <li key={idx}>{dis}</li>
                ))}
              </ul>

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What is the main purpose of a security patch?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 1)} /> a) To add new features and make the program look prettier
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 1)} /> b) To fix specific weaknesses (vulnerabilities) that attackers could use
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 2, 1)} /> c) To delete all your files
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 1 ? '✅ Correct! Security patches fix vulnerabilities that attackers could use to break into your system.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Maintenance & Training */}
            <div
              ref={(el) => {
                sectionRefs.current['maintenance-training'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Why Database Maintenance and Training Matter
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Databases are like the heart of most organizations. They store all
                the important information. Just like a car needs regular oil changes
                and tire rotations, a database needs ongoing care and attention.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Database Maintenance</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Performance Optimization</span> – Clean up clutter for faster queries</li>
                    <li><span className="font-bold">Data Integrity</span> – Validate and clean data for accuracy</li>
                    <li><span className="font-bold">Security Enhancement</span> – Apply patches and review access</li>
                    <li><span className="font-bold">Disaster Preparedness</span> – Backups and recovery testing</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Database Training</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Improved Productivity</span> – Users find what they need faster</li>
                    <li><span className="font-bold">Enhanced Data Quality</span> – Fewer entry errors</li>
                    <li><span className="font-bold">Reduced Security Risks</span> – Users recognize phishing and other threats</li>
                    <li><span className="font-bold">Unlocking Potential</span> – Users discover powerful features</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                10 Advantages of Regular Database Maintenance
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {advantagesDBMaintenance.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-4">
                10 Disadvantages of Regular Database Maintenance
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {disadvantagesDBMaintenance.map((dis, idx) => (
                  <li key={idx}>{dis}</li>
                ))}
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                10 Advantages of Database Training for Users
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {advantagesDBTraining.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-4">
                10 Disadvantages of Database Training for Users
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {disadvantagesDBTraining.map((dis, idx) => (
                  <li key={idx}>{dis}</li>
                ))}
              </ul>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which of these is a benefit of database training for users?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 0)} /> a) Users make fewer data entry mistakes and call IT less often
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 0)} /> b) Training automatically fixes all security problems
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 2, 0)} /> c) Training makes the database run faster without technical work
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 0 ? '✅ Correct! Training helps users make fewer mistakes and reduces IT support calls.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
              </div>
            </div>

            {/* Data Migration */}
            <div
              ref={(el) => {
                sectionRefs.current['data-migration'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Migrating Your Data – A Step-by-Step Guide
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Data migration means moving information from one system to another.
                This could be moving from an old database to a new one, or from a
                paper system to a digital database.
              </p>

              <div className="space-y-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Step 1: Planning and Analysis</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Decide what data you are moving and where it is going. Check for differences in how systems store information. Write a detailed plan.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Step 2: Data Extraction</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pull the data out of the source system using the right tools. Note missing values or problems. Anonymize personal data if needed.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Step 3: Data Transformation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Change data formats to match the target system. Clean the data – remove duplicates, fix spelling, fill in missing information.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Step 4: Data Loading</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Put the data into the new target system. Check that everything arrived correctly.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Step 5: Post-Migration Activities</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Verify everything works. Have users test applications. Archive or shut down the old system once confident.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Data Conversion Methods
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Schema Mapping</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Map how each piece of data connects from source to target.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Data Type Conversion</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Change data types to match what the new system expects.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Code Translation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Translate codes between systems (e.g., "NY" → "US-NY").</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Data Cleansing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Find and fix problems before loading into the new system.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                10 Advantages of Data Migration
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {advantagesDataMigration.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-4">
                10 Disadvantages of Data Migration
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {disadvantagesDataMigration.map((dis, idx) => (
                  <li key={idx}>{dis}</li>
                ))}
              </ul>

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What is the purpose of the "transformation" step in data migration?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 1)} /> a) To delete all the old data
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 1)} /> b) To change the data format so it matches what the new system expects
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 2, 1)} /> c) To make copies of the data
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 1 ? '✅ Correct! Transformation changes the data format so the new system can understand it.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Maintenance Guide */}
            <div
              ref={(el) => {
                sectionRefs.current['maintenance-guide'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Maintaining Your Database – A Complete Guide
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Performance Optimization</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Index Management</span> – Remove unused indexes, rebuild fragmented ones</li>
                    <li><span className="font-bold">Query Optimization</span> – Rewrite slow queries, review query plans</li>
                    <li><span className="font-bold">Statistics Update</span> – Keep statistics accurate for smart query decisions</li>
                  </ul>
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 mt-3">Data Integrity</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Data Validation</span> – Set rules that check data on entry</li>
                    <li><span className="font-bold">Data Cleaning</span> – Fix duplicates, missing info, inconsistent formatting</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Security Maintenance</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Software Updates</span> – Install security patches promptly</li>
                    <li><span className="font-bold">User Access Review</span> – Remove access when roles change</li>
                    <li><span className="font-bold">Backup and Recovery</span> – Regular backups, test disaster recovery</li>
                  </ul>
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 mt-3">General Maintenance</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Unused Object Removal</span> – Remove unused tables, indexes, procedures</li>
                    <li><span className="font-bold">Disk Space Management</span> – Monitor free space, archive old data</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                How to Tell Users About Database Maintenance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Be Transparent</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Give advance notice</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Use Plain Language</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">No technical jargon</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Use Many Channels</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Email, intranet, app messages</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Follow Up Afterward</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Let everyone know it's complete</p>
                </div>
              </div>

              {/* Quiz 5 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which of these is a security maintenance task?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 0, 2)} /> a) Removing unused indexes to make queries faster
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 1, 2)} /> b) Updating database statistics
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 2, 2)} /> c) Reviewing user access and removing unneeded privileges
                  </label>
                </div>
                {showQuiz5Result && (
                  <div className={`mt-2 p-2 rounded ${quiz5Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz5Answer === 2 ? '✅ Correct! Reviewing user access is a security task.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
              </div>
            </div>

            {/* DBMS Updates */}
            <div
              ref={(el) => {
                sectionRefs.current['dbms-updates'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Importance of Keeping Your DBMS Up-to-Date
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Enhanced Security</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Patching Vulnerabilities</span> – Fix known security holes</li>
                    <li><span className="font-bold">Staying Ahead of Threats</span> – Get latest defenses</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Improved Performance</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Performance Optimizations</span> – Faster queries</li>
                    <li><span className="font-bold">New Features</span> – Get new capabilities for free</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Compatibility and Integration</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Maintaining Compatibility</span> – Keep everything working together</li>
                    <li><span className="font-bold">Staying Supported</span> – Remain eligible for vendor help</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Overall System Stability</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Bug Fixes</span> – Fix code errors</li>
                    <li><span className="font-bold">Minimized Downtime</span> – Less crashing</li>
                  </ul>
                </div>
              </div>

              {/* Quiz 6 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What happens if you never update your DBMS and keep using a very old version?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz6" onChange={() => checkAnswer(6, 0, 0)} /> a) You stop receiving security patches, bug fixes, and technical support
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz6" onChange={() => checkAnswer(6, 1, 0)} /> b) The database gets faster and more secure by itself
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz6" onChange={() => checkAnswer(6, 2, 0)} /> c) The vendor pays you for using an old version
                  </label>
                </div>
                {showQuiz6Result && (
                  <div className={`mt-2 p-2 rounded ${quiz6Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz6Answer === 0 ? '✅ Correct! Old versions lose vendor support, including security patches.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
              </div>
            </div>

            {/* Planning Resources */}
            <div
              ref={(el) => {
                sectionRefs.current['planning-resources'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Planning Resources for Database Maintenance and Updates
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Human Resources (People)</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Database Administrator (DBA)</span> – Dedicated specialist</li>
                    <li><span className="font-bold">IT Support Staff</span> – Help with installation and fixes</li>
                    <li><span className="font-bold">End-Users</span> – Inform them of downtime</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Hardware and Software Resources</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Hardware</span> – CPU, RAM, storage capacity</li>
                    <li><span className="font-bold">Software</span> – Migration, monitoring, backup tools</li>
                    <li><span className="font-bold">Testing Environment</span> – Copy for safe testing</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Documentation and Training</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Documentation</span> – Written records of configuration, access, backups</li>
                    <li><span className="font-bold">Training</span> – Train DBA, IT staff, and users</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400">📝 Final Summary</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Keeping your database secure, fast, and reliable requires ongoing attention. By understanding patch updates, performing regular maintenance, training your users, planning careful data migrations, keeping your DBMS current, and allocating the right resources, you can protect your organization's most valuable asset – its data.</p>
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
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400">📌 Know the ETL Process</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Remember Extract, Transform, Load – the three steps of data migration. Be able to explain each with examples.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400">📌 Patch Updates</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Understand the advantages and disadvantages of patch updates. Know the difference between automatic and manual updates.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400">📌 Maintenance vs Training</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Be able to distinguish between technical maintenance tasks and user training. Both are essential but serve different purposes.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400">📌 Planning Resources</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">When asked about resource planning, cover all three categories: People (DBA, IT staff), Hardware/Software, and Documentation/Training.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Understand it. Maintain it. Secure it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Maintenance Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-orange-500 dark:text-orange-400" />
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
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Migration Steps</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Security Layers</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">3</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                A well-maintained database is a secure, fast, and reliable database.
                Regular maintenance, user training, and careful planning are the
                keys to success. Never skip backups – they are your insurance policy.
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
          className="w-12 h-12 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-orange-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Patch updates</strong> fix security vulnerabilities and bugs. Always apply them promptly, but test in a staging environment first.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Database maintenance</strong> includes performance optimization, data integrity checks, security reviews, and regular backups.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">User training</strong> reduces errors, improves productivity, and enhances security awareness.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Data migration</strong> follows ETL: Extract, Transform, Load. Plan carefully, test thoroughly, and always have a rollback plan.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Resource planning</strong> covers people (DBA, IT staff), hardware/software (server capacity, tools), and documentation/training.
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
            Sidemann Academic Registry • Database Implementation & Maintenance 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;