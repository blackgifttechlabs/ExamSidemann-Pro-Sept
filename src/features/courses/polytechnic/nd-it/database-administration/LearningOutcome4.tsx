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
  Trash2,
  Upload,
  Download,
  CloudOff,
  HardDrive as HardDriveIcon,
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
  { id: 'role-of-backups', label: 'Role of Backups' },
  { id: 'rto-rpo', label: 'RTO & RPO' },
  { id: 'backup-plan', label: 'Backup Plan' },
  { id: 'backup-risks', label: 'Backup Risks' },
  { id: 'backup-medium', label: 'Backup Medium' },
  { id: 'backup-types-locations', label: 'Backup Types' },
  { id: 'recovery-sites', label: 'Recovery Sites' },
  { id: 'database-failures', label: 'Database Failures' },
  { id: 'recovery-policy', label: 'Recovery Policy' },
  { id: 'exam-tips', label: 'Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome4: React.FC = () => {
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
        text: 'The 3-2-1 backup rule: Keep 3 copies of your data, on 2 different media, with 1 copy stored offsite.',
      },
      {
        title: 'Pro Tip',
        text: 'RTO (Recovery Time Objective) is about time – how long can you be down? RPO (Recovery Point Objective) is about data loss – how much can you afford to lose?',
      },
      {
        title: 'Memory Trick',
        text: 'Remember ETL for data migration: Extract, Transform, Load. Also remember the 3-2-1 rule for backups.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t store backups on the same server as your live data. If the server fails, you lose both.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The 3-2-1 backup rule: Keep 3 copies of your data, on 2 different media, with 1 copy stored offsite.',
      },
      {
        title: 'Pro Tip',
        text: 'RTO (Recovery Time Objective) is about time – how long can you be down? RPO (Recovery Point Objective) is about data loss – how much can you afford to lose?',
      },
      {
        title: 'Memory Trick',
        text: 'Remember ETL for data migration: Extract, Transform, Load. Also remember the 3-2-1 rule for backups.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t store backups on the same server as your live data. If the server fails, you lose both.',
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
                ? 'bg-red-600 text-white shadow-md shadow-red-200 dark:shadow-red-900/30'
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
  const [quiz7Answer, setQuiz7Answer] = useState<number | null>(null);

  const [showQuiz1Result, setShowQuiz1Result] = useState(false);
  const [showQuiz2Result, setShowQuiz2Result] = useState(false);
  const [showQuiz3Result, setShowQuiz3Result] = useState(false);
  const [showQuiz4Result, setShowQuiz4Result] = useState(false);
  const [showQuiz5Result, setShowQuiz5Result] = useState(false);
  const [showQuiz6Result, setShowQuiz6Result] = useState(false);
  const [showQuiz7Result, setShowQuiz7Result] = useState(false);

  const checkAnswer = (quizNumber: number, selectedAnswer: number, correctAnswer: number) => {
    switch(quizNumber) {
      case 1: setQuiz1Answer(selectedAnswer); setShowQuiz1Result(true); break;
      case 2: setQuiz2Answer(selectedAnswer); setShowQuiz2Result(true); break;
      case 3: setQuiz3Answer(selectedAnswer); setShowQuiz3Result(true); break;
      case 4: setQuiz4Answer(selectedAnswer); setShowQuiz4Result(true); break;
      case 5: setQuiz5Answer(selectedAnswer); setShowQuiz5Result(true); break;
      case 6: setQuiz6Answer(selectedAnswer); setShowQuiz6Result(true); break;
      case 7: setQuiz7Answer(selectedAnswer); setShowQuiz7Result(true); break;
    }
  };

  // ─── Data arrays ──────────────────────────────────────────────────────────
  const advantagesBackups = [
    "Protects against data loss - You can recover information that was accidentally deleted or destroyed.",
    "Enables disaster recovery - After a fire, flood, or earthquake, you can restore your data from a safe location.",
    "Defends against ransomware - If hackers encrypt your data, you can restore from backups instead of paying them.",
    "Reduces downtime - You can get back to work faster after a problem because you have a copy of your data.",
    "Provides peace of mind - You and your team can work without constant fear of losing everything.",
    "Helps with legal compliance - Many laws require businesses to keep backups of certain records.",
    "Allows point-in-time recovery - You can go back to exactly how your data looked at a specific date and time.",
    "Protects against hardware failure - When a hard drive dies, your backup still has all your information.",
    "Supports business continuity - Your company can keep serving customers even after a major problem.",
    "Saves money in the long run - The cost of a backup system is much less than the cost of losing all your data."
  ];

  const disadvantagesBackups = [
    "Costs money to set up - You need to buy storage devices, software, or cloud services.",
    "Takes time to perform - Backups can take hours or even days for very large databases.",
    "Uses storage space - Backups take up room on hard drives, tape, or cloud storage.",
    "Can fail without warning - Sometimes backups look successful but the data is actually corrupted.",
    "Requires ongoing management - Someone needs to check that backups are working properly.",
    "May slow down your system - Running backups during work hours can make the database slower.",
    "Creates security risks - Backups contain sensitive data that could be stolen if not protected.",
    "Needs regular testing - You must periodically test restoring from backups to make sure they work.",
    "Complicates your IT systems - Managing backups adds another layer of complexity to your technology.",
    "Can be forgotten or ignored - People often skip backups when they are busy or under pressure."
  ];

  const advantagesRTO_RPO = [
    "Sets clear expectations - Everyone knows how long recovery should take and how much data might be lost.",
    "Guides technology choices - RTO and RPO help you decide what backup systems to buy.",
    "Aligns IT with business needs - You match your recovery capabilities to what the business actually requires.",
    "Helps with budgeting - You can calculate how much money to spend based on your RTO and RPO goals.",
    "Improves customer trust - Customers feel safer knowing you can recover quickly from problems.",
    "Reduces financial losses - Shorter RTO means less money lost during downtime.",
    "Minimizes data loss - Smaller RPO means you lose less recent information when disaster strikes.",
    "Supports compliance requirements - Many regulations specify maximum allowed downtime or data loss.",
    "Enables better planning - You can design realistic recovery procedures based on clear targets.",
    "Creates accountability - Specific people are responsible for meeting the RTO and RPO goals."
  ];

  const disadvantagesRTO_RPO = [
    "Can be expensive to achieve - Very short RTO and very small RPO require expensive technology.",
    "May be unrealistic - Some businesses set targets that are impossible with their budget or technology.",
    "Requires constant monitoring - You need to regularly check if you are still meeting your targets.",
    "Changes over time - As your business grows, your RTO and RPO needs may change.",
    "Hard to calculate exactly - It is difficult to know the true cost of downtime for every situation.",
    "Creates pressure on IT staff - Unrealistic targets cause stress and burnout for the recovery team.",
    "May be ignored during crisis - In a real emergency, people often abandon formal recovery targets.",
    "Different for every system - You need separate RTO and RPO for each database and application.",
    "Requires executive buy-in - Leaders must approve and support the chosen targets with resources.",
    "Testing takes time - You must regularly practice meeting your RTO and RPO, which takes staff away from other work."
  ];

  const advantagesBackupStorage = [
    "Protects data from local disasters - Storing backups in a different building or city keeps them safe from fire or flood.",
    "Enables fast recovery - Local backups can restore data very quickly when you need them.",
    "Reduces bandwidth usage - Local backups don't require sending data over the internet.",
    "Cloud backups offer unlimited scale - You never run out of space with good cloud providers.",
    "Cloud backups are managed by experts - The cloud company handles hardware failures and security.",
    "Tape backups are very durable - Properly stored tape can last for 30 years or more.",
    "Disk backups are fast - Hard drives and SSDs can read and write data very quickly.",
    "Hybrid approaches give flexibility - You can use local backups for fast recovery and cloud for disaster protection.",
    "Encryption protects your data - Modern backup storage can be encrypted so only you can read it.",
    "Versioning keeps history - Many storage systems keep multiple old versions of your data."
  ];

  const disadvantagesBackupStorage = [
    "Local backups are vulnerable - A fire, flood, or theft can destroy both your main data and your backup.",
    "Cloud backups have ongoing costs - You pay every month, and costs add up over time.",
    "Cloud recovery can be slow - Downloading terabytes of data from the cloud can take days or weeks.",
    "Tape backups are slow to restore - Finding and loading the right tape takes time, sometimes hours.",
    "Disk drives can fail - Hard drives have moving parts that eventually break.",
    "SSDs have limited writes - Solid state drives can only be written a certain number of times.",
    "Cloud providers can go out of business - If your cloud backup company fails, you might lose access to your data.",
    "Internet outages block cloud access - If your internet is down, you cannot reach cloud backups.",
    "Storage costs grow with data - As you add more data, storage costs increase.",
    "Managing multiple backup types is complex - Using different storage methods requires more training and planning."
  ];

  const advantagesBackupTypes = [
    "Full backups are complete - Every file is saved, so restore is simple and fast.",
    "Incremental backups are fast - Only changed data is saved, so backups finish quickly.",
    "Differential backups balance speed and simplicity - Easier to restore than incremental, faster than full.",
    "CDP offers no data loss - Every single change is saved continuously.",
    "Full backups are easy to understand - Anyone can restore from a full backup without special training.",
    "Incremental backups use less space - You store only changes, not entire copies of everything.",
    "Differential backups need only two files to restore - The last full backup and the last differential backup.",
    "CDP is great for critical systems - Important databases can be restored to any exact moment.",
    "Mixed strategies give flexibility - You can use full backups weekly with daily incrementals.",
    "Modern software handles complexity - Backup programs automatically manage different backup types for you."
  ];

  const disadvantagesBackupTypes = [
    "Full backups take a long time - Backing up everything can take many hours for large databases.",
    "Full backups use a lot of space - Each full backup is as large as your entire database.",
    "Incremental restores are slow - You need the last full backup plus every incremental backup since then.",
    "Incremental backups can fail as a chain - If one incremental backup is corrupted, later ones may be unusable.",
    "Differential backups grow over time - Each differential backup gets larger until the next full backup.",
    "Differential restores are more complex than full - You need two files instead of one.",
    "CDP is very expensive - Continuous backup requires powerful hardware and software.",
    "CDP can slow down your system - Constant monitoring of every change uses processing power.",
    "Mixed strategies are harder to manage - You need to track multiple backup schedules and types.",
    "Understanding different types requires training - Staff must learn the differences and when to use each."
  ];

  const advantagesRecoverySites = [
    "Hot sites allow immediate failover - You can switch to the backup site in minutes or seconds.",
    "Warm sites balance cost and speed - Faster than cold sites, cheaper than hot sites.",
    "Cold sites are the least expensive - You pay only for the physical space, not running equipment.",
    "Geographic separation protects from local disasters - A flood or fire at your main office won't affect a distant site.",
    "Replicated data means no data loss - Your recovery site has an exact copy of your current data.",
    "Testing can be done without affecting production - You can practice failover without disrupting live systems.",
    "Cloud recovery sites scale easily - You can increase or decrease resources as your needs change.",
    "Multiple recovery sites give extra protection - You can have backups in two different regions for safety.",
    "Managed recovery sites reduce staff burden - The provider handles hardware maintenance and setup.",
    "Compliance with regulations - Many laws require businesses to have an offsite recovery location."
  ];

  const disadvantagesRecoverySites = [
    "Hot sites are very expensive - You pay for duplicate hardware, software, and facilities.",
    "Warm sites still cost significant money - You need to maintain servers and networking equipment.",
    "Cold sites have slow recovery - It can take days or weeks to get systems running at a cold site.",
    "Data replication needs high bandwidth - Keeping the recovery site synchronized uses a lot of network capacity.",
    "Testing is time consuming - Full failover tests require careful planning and staff time.",
    "Configuration drift causes problems - The recovery site may become different from the main site over time.",
    "Cloud recovery has unpredictable costs - Egress fees and storage costs can be hard to estimate.",
    "Human resources need to be available - Staff must be able to travel to or connect to the recovery site.",
    "Third-party providers introduce risk - The company managing your recovery site could have its own problems.",
    "Complex to set up correctly - Many details must be right for failover to work smoothly."
  ];

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Database size={14} className="inline mr-1" /> DATABASE ADMINISTRATION
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 4{' '}
            <span className="text-amber-300 font-bold italic">
              Backup &amp; Disaster Recovery
            </span>
          </h1>
          <p className="text-lg text-red-100 max-w-2xl leading-relaxed">
            Master the essentials of database backup and disaster recovery: RTO,
            RPO, backup types, storage options, recovery sites, and crafting a
            comprehensive recovery plan.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-red-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Database size={14} className="inline mr-1" /> Backups
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Recovery
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-red-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, RTO, RPO, or backup type..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-red-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-red-200" />
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
                Introduction to Database Backup &amp; Disaster Recovery
              </h2>

              <div className="p-4 sm:p-5 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Data backups are the foundation of any good data security plan.
                    Think of backups like a safety net for a tightrope walker. If
                    something bad happens to your main data, you can use your backup
                    to get all your important information back. This learning outcome
                    covers everything from RTO/RPO to recovery sites.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Backups are like a spare tire for your car. You hope you never
                  need it, but if you get a flat, you're glad you have it. A good
                  backup plan is your spare tire for your data.
                </p>
              </div>
            </div>

            {/* Role of Backups */}
            <div
              ref={(el) => {
                sectionRefs.current['role-of-backups'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Crucial Role of Data Backups
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Disaster Recovery</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Floods, fires, earthquakes, and hardware failures can destroy your data. Offsite or cloud backups let you restore and get back to work quickly.</p>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                    <p className="text-xs italic text-slate-500 dark:text-slate-400">Example: A company's data center burns down, but they restore from secure offsite backups within 24 hours.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Human Error</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Accidental deletions, incorrect updates, or overwritten files. Backups act like a time machine to restore lost data.</p>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                    <p className="text-xs italic text-slate-500 dark:text-slate-400">Example: An employee accidentally deletes customer records; the company restores from a recent backup.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Ransomware Attacks</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Viruses that encrypt your data and demand payment. Offline or immutable backups allow recovery without paying.</p>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                    <p className="text-xs italic text-slate-500 dark:text-slate-400">Example: A hospital gets ransomware but restores from cloud backups, refusing to pay the ransom.</p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mt-6">
                10 Advantages of Having Data Backups
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {advantagesBackups.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mt-4">
                10 Disadvantages of Data Backups
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {disadvantagesBackups.map((dis, idx) => (
                  <li key={idx}>{dis}</li>
                ))}
              </ul>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> How do backups help protect against ransomware attacks?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 1)} /> a) Backups make ransomware disappear
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 1)} /> b) Offline/cloud backups are safe from ransomware, so you can restore without paying
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 1)} /> c) Backups automatically pay the ransom
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 1 ? '✅ Correct! Offline or cloud backups are safe from ransomware.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* RTO & RPO */}
            <div
              ref={(el) => {
                sectionRefs.current['rto-rpo'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Balancing Act: RTO and RPO
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">⏱️ Recovery Time Objective (RTO)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Maximum time your business can survive without access to data. Answers: "How much downtime can we afford?"</p>
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Example: An online store might have an RTO of 2 hours; a small accounting office might have 3 days.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">📊 Recovery Point Objective (RPO)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Maximum amount of recent data you are willing to lose. Answers: "How much data can we afford to lose?"</p>
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Example: A bank might have an RPO of a few seconds; a blog might have an RPO of 1 week.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 mt-4">
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">💡 Important Note</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">RTO and RPO work together. Short RTO + small RPO = expensive backup system. Find the right balance for your business and budget.</p>
              </div>

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mt-6">
                10 Advantages of Defining RTO and RPO
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {advantagesRTO_RPO.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mt-4">
                10 Disadvantages of RTO and RPO
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {disadvantagesRTO_RPO.map((dis, idx) => (
                  <li key={idx}>{dis}</li>
                ))}
              </ul>

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What is the difference between RTO and RPO?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 2)} /> a) RTO is about data loss, RPO is about downtime
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 2)} /> b) They mean the same thing
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 2, 2)} /> c) RTO is about downtime, RPO is about data loss
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 2 ? '✅ Correct! RTO = downtime, RPO = data loss.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
              </div>
            </div>

            {/* Backup Plan */}
            <div
              ref={(el) => {
                sectionRefs.current['backup-plan'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Crafting a Comprehensive Backup Plan
              </h2>

              <div className="space-y-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Step 1: Define Scope & Requirements</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Decide which data needs backing up. Write down your RTO and RPO targets.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Step 2: Choose Backup Methods</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Full, Incremental, Differential, or Continuous Data Protection (CDP).</p>
                  <SQLConsole
                    code={`-- Logical backup in MySQL\n-- mysqldump -u root -p my_database > backup_file.sql\n\n-- Creating a backup table\nCREATE TABLE Employees_Backup_2024 AS \nSELECT * FROM Employees;`}
                    isDarkMode={isDarkMode}
                    databaseName="backup_utility"
                  />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Step 3: Select Backup Storage</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Local (external drives, tape), remote (offsite), or cloud (AWS, Azure, Backblaze).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Step 4: Schedule Your Backups</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Based on your RPO – hourly, daily, weekly. Automate the schedule.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Step 5: Verification and Testing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Regularly check backups for corruption. Practice restoring from backups.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Step 6: Documentation and Training</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Write down the plan. Train your staff on procedures.</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <SQLConsole
                  code={`-- Restoring from a backup table\n-- 1. Drop the corrupted table\nDROP TABLE Employees;\n\n-- 2. Restore from backup\nCREATE TABLE Employees AS \nSELECT * FROM Employees_Backup_2024;`}
                  isDarkMode={isDarkMode}
                  databaseName="restore_utility"
                />
              </div>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Why is it important to test restoring from backups?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 1)} /> a) Because restoring is fun
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 1)} /> b) To ensure backups are not corrupted and the process works before a real emergency
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 2, 1)} /> c) Testing is required by law everywhere
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 1 ? '✅ Correct! Testing ensures backups actually work when needed.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Backup Risks */}
            <div
              ref={(el) => {
                sectionRefs.current['backup-risks'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Risks Associated with Accessing and Managing Backups
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Unauthorized Access</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Someone steals or changes backup data. Protect with strong access controls, MFA, and encryption.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Privilege Escalation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Users gain higher access than they should. Follow the principle of least privilege.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Accidental Exposure</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Backups sent to wrong place or misconfigured cloud storage. Train staff and use DLP tools.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Backup Corruption</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Backup files damaged. Verify backups regularly and keep multiple copies.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">🦠 Ransomware Threats to Backups</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ransomware can encrypt connected backups. Use <span className="font-bold">air-gapped</span> or <span className="font-bold">immutable</span> backups (cannot be changed or deleted).</p>
                </div>
              </div>

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What does "air-gapped backup" mean?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 1)} /> a) A backup in a container filled with air
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 1)} /> b) Physically disconnected from the network, safe from ransomware
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 2, 1)} /> c) A backup sent automatically to a different country
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 1 ? '✅ Correct! Air-gapped means physically disconnected, safe from ransomware.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Backup Medium */}
            <div
              ref={(el) => {
                sectionRefs.current['backup-medium'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Backup Medium – The Foundation for Data Safekeeping
              </h2>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212] mt-2">
                <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-red-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Factor</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Description</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Things to Think About</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold">Capacity</td><td className="p-3">How much data can it hold?</td><td className="p-3">Plan for growth.</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Cost</td><td className="p-3">Purchase and maintenance</td><td className="p-3">Initial price, ongoing costs.</td></tr>
                    <tr><td className="p-3 font-bold">Performance</td><td className="p-3">Read/write speed</td><td className="p-3">Faster = more expensive.</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Accessibility</td><td className="p-3">Ease of backup/restore</td><td className="p-3">How often will you access?</td></tr>
                    <tr><td className="p-3 font-bold">Security</td><td className="p-3">Protection from unauthorized access</td><td className="p-3">Encryption? Physical security?</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Durability</td><td className="p-3">Data lifespan</td><td className="p-3">How long do you need to keep backups?</td></tr>
                    <tr><td className="p-3 font-bold">Disaster Recovery</td><td className="p-3">Surviving local disasters</td><td className="p-3">Are backups stored far away?</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mt-6">
                10 Advantages of Different Backup Storage Options
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {advantagesBackupStorage.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mt-4">
                10 Disadvantages of Different Backup Storage Options
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {disadvantagesBackupStorage.map((dis, idx) => (
                  <li key={idx}>{dis}</li>
                ))}
              </ul>
            </div>

            {/* Backup Types */}
            <div
              ref={(el) => {
                sectionRefs.current['backup-types-locations'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Choosing the Right Backup Type and Location
              </h2>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212] mt-2">
                <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-red-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Factor</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Description</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Things to Think About</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold">RTO</td><td className="p-3">Recovery speed</td><td className="p-3">Local = faster than cloud.</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">RPO</td><td className="p-3">Data loss tolerance</td><td className="p-3">Smaller RPO = more frequent backups.</td></tr>
                    <tr><td className="p-3 font-bold">Accessibility</td><td className="p-3">Ease of backup/restore</td><td className="p-3">Network speed, physical access.</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Security</td><td className="p-3">Unauthorized access protection</td><td className="p-3">Encryption? Physical security?</td></tr>
                    <tr><td className="p-3 font-bold">Cost</td><td className="p-3">Storage and access expenses</td><td className="p-3">Storage fees, data transfer costs.</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Disaster Recovery</td><td className="p-3">Surviving local disasters</td><td className="p-3">Offsite location distance.</td></tr>
                    <tr><td className="p-3 font-bold">Compliance</td><td className="p-3">Following laws and regulations</td><td className="p-3">Data residency requirements.</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mt-6">
                10 Advantages of Different Backup Types
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {advantagesBackupTypes.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mt-4">
                10 Disadvantages of Different Backup Types
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {disadvantagesBackupTypes.map((dis, idx) => (
                  <li key={idx}>{dis}</li>
                ))}
              </ul>

              {/* Quiz 5 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What is the difference between incremental and differential backups?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 0, 2)} /> a) They are the same thing
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 1, 2)} /> b) Incremental backs up everything, differential backs up changes
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 2, 2)} /> c) Incremental = changes since last backup (any type), Differential = changes since last full backup
                  </label>
                </div>
                {showQuiz5Result && (
                  <div className={`mt-2 p-2 rounded ${quiz5Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz5Answer === 2 ? '✅ Correct! Incremental = since last backup, Differential = since last full backup.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
              </div>
            </div>

            {/* Recovery Sites */}
            <div
              ref={(el) => {
                sectionRefs.current['recovery-sites'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Configuring Backup Servers and Recovery Sites
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Backup Servers</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Choose hardware with enough CPU, RAM, and storage</li>
                    <li>Install stable OS, harden it, configure firewalls</li>
                    <li>Install reliable backup software with scheduling, encryption, compression</li>
                    <li>Use RAID for redundancy</li>
                    <li>Strict access controls – only trusted people</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Recovery Sites</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Choose a location far from your main site (≥50 miles)</li>
                    <li>Mirror infrastructure – servers, networking, power, cooling</li>
                    <li>Set up data replication – continuous or scheduled</li>
                    <li>Regularly test failover and failback procedures</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Types of Recovery Sites</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li><span className="font-bold">Hot Site</span> – fully equipped, current data – recovery in minutes (most expensive)</li>
                  <li><span className="font-bold">Warm Site</span> – hardware ready, data may need restore – recovery in hours</li>
                  <li><span className="font-bold">Cold Site</span> – empty building with power – recovery in days/weeks (cheapest)</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mt-6">
                10 Advantages of Recovery Sites
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {advantagesRecoverySites.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>

              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mt-4">
                10 Disadvantages of Recovery Sites
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {disadvantagesRecoverySites.map((dis, idx) => (
                  <li key={idx}>{dis}</li>
                ))}
              </ul>

              {/* Quiz 6 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What is the main difference between a hot site and a cold site?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz6" onChange={() => checkAnswer(6, 0, 1)} /> a) Hot sites have AC, cold sites don't
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz6" onChange={() => checkAnswer(6, 1, 1)} /> b) Hot sites are ready for immediate recovery; cold sites are just empty buildings
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz6" onChange={() => checkAnswer(6, 2, 1)} /> c) Hot sites are in hot climates, cold sites in cold climates
                  </label>
                </div>
                {showQuiz6Result && (
                  <div className={`mt-2 p-2 rounded ${quiz6Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz6Answer === 1 ? '✅ Correct! Hot sites are fully ready; cold sites are just space.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Database Failures */}
            <div
              ref={(el) => {
                sectionRefs.current['database-failures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Types of Database Failures – Understanding Your Threats
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Hardware Failure</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Disk crashes, server failures, power outages.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Software Errors</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Bugs or glitches in database software that corrupt data.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Human Error</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Accidental deletion, modification, or overwriting.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Security Threats</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ransomware encryption, malware attacks.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Network Issues</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Connectivity problems disrupting database access.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Database Recovery Techniques</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><span className="font-bold">Backup and Restore</span> – Use full, incremental, or differential backups</li>
                  <li><span className="font-bold">Logging and Rollforward/Rollback</span> – Re-apply or undo transactions</li>
                  <li><span className="font-bold">Checkpointing</span> – Periodic snapshots for faster recovery</li>
                  <li><span className="font-bold">Mirroring</span> – Real-time copy on a separate server</li>
                  <li><span className="font-bold">Shadow Paging</span> – Shadow copy for crash recovery</li>
                </ul>
              </div>

              {/* Quiz 7 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which type of failure is caused by a virus that encrypts your data and demands payment?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz7" onChange={() => checkAnswer(7, 0, 2)} /> a) Hardware failure
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz7" onChange={() => checkAnswer(7, 1, 2)} /> b) Human error
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz7" onChange={() => checkAnswer(7, 2, 2)} /> c) Security threat (ransomware)
                  </label>
                </div>
                {showQuiz7Result && (
                  <div className={`mt-2 p-2 rounded ${quiz7Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz7Answer === 2 ? '✅ Correct! Ransomware is a security threat that encrypts data.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
              </div>
            </div>

            {/* Recovery Policy */}
            <div
              ref={(el) => {
                sectionRefs.current['recovery-policy'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Crafting a Database Recovery Policy and Disaster Recovery Plan
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Database Recovery Policy</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Scope</span> – Which databases and systems</li>
                    <li><span className="font-bold">RTO and RPO targets</span> – Specific numbers</li>
                    <li><span className="font-bold">Backup strategy</span> – Type, frequency, storage</li>
                    <li><span className="font-bold">Roles and responsibilities</span> – Who does what</li>
                    <li><span className="font-bold">Escalation procedures</span> – Who to contact</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Disaster Recovery Plan</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Risk assessment</span> – What could go wrong</li>
                    <li><span className="font-bold">Recovery team</span> – Who is on the team</li>
                    <li><span className="font-bold">Communication plans</span> – Tell employees, customers</li>
                    <li><span className="font-bold">Detailed recovery procedures</span> – Step-by-step</li>
                    <li><span className="font-bold">Return to normal procedures</span> – After recovery</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400">📝 Final Summary</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Backups and disaster recovery are essential for every organization. By understanding RTO, RPO, backup types, storage options, recovery sites, and having written policies and plans, you can ensure your organization can survive any disaster – natural, human, or cyber – and keep working.</p>
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
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">📌 Know RTO vs RPO</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">RTO = downtime tolerance; RPO = data loss tolerance. Both guide your backup strategy.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">📌 The 3-2-1 Backup Rule</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Keep 3 copies of your data, on 2 different media, with 1 copy stored offsite.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">📌 Backup Types</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Full = all data; Incremental = changes since last backup; Differential = changes since last full backup.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">📌 Recovery Sites</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Hot = ready (minutes), Warm = hardware ready (hours), Cold = empty building (days).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">📌 Always Test Backups</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A backup is only as good as your ability to restore from it. Test regularly.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Understand it. Back it up. Recover it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-red-100 dark:border-red-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400">
                  💡 Backup Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-red-500 dark:text-red-400" />
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
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Backup Types</span>
                  <span className="font-bold text-red-600 dark:text-red-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Recovery Sites</span>
                  <span className="font-bold text-red-600 dark:text-red-400">3</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                A backup is only as good as your ability to restore from it.
                Test your backups regularly, keep copies offsite, and have a
                written disaster recovery plan. Don't wait for a crisis to
                discover your backups don't work.
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
          className="w-12 h-12 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-red-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>
                <strong className="text-white">Backups</strong> protect against data loss, hardware failure, human error, ransomware, and natural disasters. Always follow the 3-2-1 rule.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>
                <strong className="text-white">RTO</strong> (Recovery Time Objective) – how long you can be down. <strong>RPO</strong> (Recovery Point Objective) – how much data you can lose. Both guide backup strategy.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>
                <strong className="text-white">Backup types</strong> – Full (all data), Incremental (changes since last backup), Differential (changes since last full backup), CDP (continuous).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>
                <strong className="text-white">Recovery sites</strong> – Hot (minutes), Warm (hours), Cold (days). Choose based on your RTO and budget.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>
                <strong className="text-white">Disaster recovery</strong> requires a written policy and plan. Test regularly, train staff, and keep documentation up to date.
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
            Sidemann Academic Registry • Database Backup & Disaster Recovery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;