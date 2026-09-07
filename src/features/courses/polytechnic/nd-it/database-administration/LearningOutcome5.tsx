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
  { id: 'transactions', label: 'Transactions' },
  { id: 'acid', label: 'ACID' },
  { id: 'transaction-states', label: 'Transaction States' },
  { id: 'concurrency-control', label: 'Concurrency Control' },
  { id: 'concurrency-problems', label: 'Concurrency Problems' },
  { id: 'lock-protocols', label: 'Lock Protocols' },
  { id: 'alternative-protocols', label: 'Alternative Protocols' },
  { id: 'deadlock-starvation', label: 'Deadlock vs Starvation' },
  { id: 'exam-tips', label: 'Tips' },
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
        text: 'ACID stands for Atomicity, Consistency, Isolation, Durability – the four properties that ensure reliable database transactions.',
      },
      {
        title: 'Pro Tip',
        text: 'A deadlock occurs when two transactions wait for each other to release resources. Use timeouts or detection to resolve them.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember ACID as "All Changes In Database" – Atomicity, Consistency, Isolation, Durability.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse dirty reads with non-repeatable reads. Dirty reads see uncommitted data; non-repeatable reads see different committed data on repeated reads.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'ACID stands for Atomicity, Consistency, Isolation, Durability – the four properties that ensure reliable database transactions.',
      },
      {
        title: 'Pro Tip',
        text: 'A deadlock occurs when two transactions wait for each other to release resources. Use timeouts or detection to resolve them.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember ACID as "All Changes In Database" – Atomicity, Consistency, Isolation, Durability.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse dirty reads with non-repeatable reads. Dirty reads see uncommitted data; non-repeatable reads see different committed data on repeated reads.',
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
  const advantagesTransactions = [
    "Ensures data accuracy - Transactions make sure that all changes happen completely or not at all.",
    "Prevents partial updates - You never have half-finished changes in your database.",
    "Maintains data integrity - All rules and constraints are enforced automatically.",
    "Provides error recovery - If something goes wrong, the database returns to a safe state.",
    "Simplifies programming - Developers don't have to write complex error-handling code.",
    "Groups related operations - Multiple changes can be treated as one unit of work.",
    "Improves reliability - Users can trust that the database remains correct.",
    "Supports complex operations - Transactions allow many steps to be coordinated together.",
    "Enables rollback capability - You can undo changes if a problem is detected.",
    "Creates audit trail - Transaction logs show exactly what changed and when."
  ];

  const disadvantagesTransactions = [
    "Uses more resources - Transactions require extra memory and processing power.",
    "Can slow down performance - Locking and logging add overhead to database operations.",
    "Creates complexity - Designing proper transactions requires careful planning.",
    "May cause deadlocks - Transactions can block each other, stopping work completely.",
    "Requires transaction logs - Log files take up storage space on your servers.",
    "Makes recovery slower - After a crash, rolling back transactions takes time.",
    "Not suitable for all operations - Some simple operations don't need transaction overhead.",
    "Can lead to long-running locks - Large transactions block other users for a long time.",
    "Needs skilled administrators - Managing transactions requires deep database knowledge.",
    "May hide application bugs - Transactions can mask poorly written code by rolling back errors."
  ];

  const advantagesACID = [
    "Atomicity prevents partial updates - No incomplete changes ever stay in the database.",
    "Consistency enforces business rules - All data follows the rules you set up.",
    "Isolation prevents interference - Concurrent users don't mess up each other's work.",
    "Durability guarantees persistence - Committed data survives crashes and power failures.",
    "Provides predictable behavior - Developers know exactly how transactions will work.",
    "Reduces data corruption risk - ACID properties catch many errors before they cause damage.",
    "Supports financial applications - Banking and accounting depend on ACID guarantees.",
    "Makes debugging easier - Problems are easier to find when transactions are atomic.",
    "Enables reliable backups - ACID ensures backups represent a consistent point in time.",
    "Builds user trust - People can depend on the database being correct."
  ];

  const disadvantagesACID = [
    "High performance cost - ACID compliance requires significant system resources.",
    "Not needed for all data - Some applications (like logs) don't need full ACID guarantees.",
    "Limits scalability - ACID databases are harder to spread across many servers.",
    "Can create bottlenecks - Locking for isolation slows down concurrent access.",
    "Complex to implement - Building an ACID-compliant system requires expert knowledge.",
    "May be overkill - Simple applications pay the cost without needing the benefits.",
    "Transaction logs grow large - Maintaining durability requires storing many logs.",
    "Recovery can be slow - After a crash, applying logs takes time.",
    "Not suitable for real-time systems - ACID overhead can cause unacceptable delays.",
    "Alternative systems (BASE) may be better - Some applications prefer eventual consistency."
  ];

  const advantagesConcurrency = [
    "Prevents lost updates - Two users cannot overwrite each other's changes.",
    "Avoids dirty reads - Users never see uncommitted data that might be rolled back.",
    "Ensures repeatable reads - Reading the same data twice gives consistent results.",
    "Maximizes throughput - Many users can work simultaneously without conflicts.",
    "Maintains data integrity - All database rules stay enforced under heavy load.",
    "Reduces application errors - The database handles concurrency, not the programmer.",
    "Supports high-traffic systems - Websites with millions of users need concurrency control.",
    "Provides predictable performance - Users know what to expect even with many concurrent operations.",
    "Prevents phantom reads - New records appearing during a transaction are handled properly.",
    "Enables serializable schedules - The final result is the same as if transactions ran one by one."
  ];

  const disadvantagesConcurrency = [
    "Creates locking overhead - Managing locks uses CPU time and memory.",
    "Can cause deadlocks - Transactions may block each other permanently.",
    "Reduces performance - More concurrency control means slower individual operations.",
    "Requires tuning - Default settings may not work well for your specific workload.",
    "Complex to understand - Developers need training to write correct concurrent code.",
    "May lead to starvation - Some transactions might wait forever for resources.",
    "Increases chance of deadlock - More locks mean more circular waiting possibilities.",
    "Hard to debug - Concurrency problems are difficult to reproduce and fix.",
    "Adds to database overhead - Every read and write must check locks.",
    "Not needed for single-user systems - Small databases pay the cost without benefits."
  ];

  const advantagesLocks = [
    "Simple to understand - Locks are a straightforward concept for developers.",
    "Widely implemented - Every major database supports lock-based concurrency.",
    "Provides strong isolation - Locks can prevent almost all concurrency problems.",
    "Works for most workloads - Locking is effective for typical business applications.",
    "Predictable behavior - You know exactly what will happen when a lock is held.",
    "Supports different lock types - Shared and exclusive locks give flexibility.",
    "Deadlock detection exists - Databases can automatically detect and resolve deadlocks.",
    "Granularity options - You can lock at row, page, table, or database level.",
    "Automatic management - Databases handle most locking without programmer intervention.",
    "Proven technology - Lock-based systems have been used successfully for decades."
  ];

  const disadvantagesLocks = [
    "Can cause deadlocks - Locks can create circular waiting situations.",
    "Reduces concurrency - Locks block other users from accessing locked data.",
    "Creates overhead - Managing locks uses CPU time and memory.",
    "May cause priority inversion - A low-priority transaction can block a high-priority one.",
    "Lock escalation problems - Too many row locks may escalate to a table lock.",
    "Hard to tune - Choosing the right lock granularity requires expertise.",
    "Can lead to long waits - A long-running transaction blocks many others.",
    "Not suitable for all workloads - Read-heavy systems may not need many locks.",
    "Deadlock resolution kills work - Rolling back a transaction discards its changes.",
    "Phantom reads possible - Some lock levels do not prevent new records from appearing."
  ];

  const advantagesDeadlockHandling = [
    "Databases can detect deadlocks automatically - Most systems find circular waits.",
    "Deadlock resolution is predictable - The database chooses a victim to roll back.",
    "Timeout mechanisms work - You can set limits on how long a transaction waits.",
    "Deadlocks are usually rare - Most well-designed systems have few deadlocks.",
    "Wound-wait schemes exist - Older transactions can force younger ones to wait.",
    "Wait-die schemes prevent indefinite blocking - Older transactions never wait for younger ones.",
    "Deadlock graphs help debugging - You can visualize the circular dependency.",
    "Application retry works - After rollback, the transaction can simply try again.",
    "Lock timeouts are simple - If a lock is not granted in X seconds, abort.",
    "Conservative 2PL prevents deadlocks - Acquiring all locks upfront eliminates circular waits."
  ];

  const disadvantagesDeadlockStarvation = [
    "Deadlocks stop work completely - Transactions wait forever until someone intervenes.",
    "Deadlock detection uses resources - Scanning for circular waits takes CPU time.",
    "Rolling back a victim wastes work - All changes made by that transaction are lost.",
    "Starvation can be hard to detect - The system appears to be working, but a transaction never completes.",
    "Priority-based systems cause starvation - Low-priority work may never get resources.",
    "Deadlocks are hard to reproduce - The same sequence may never happen again.",
    "Starvation is often overlooked - Many monitoring tools don't track waiting transactions.",
    "Fixing starvation requires changing design - You may need to rewrite application code.",
    "Deadlock frequency increases with load - More concurrent users mean more deadlocks.",
    "Both problems are hard to test - They often appear only in production under real loads."
  ];

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Database size={14} className="inline mr-1" /> DATABASE ADMINISTRATION
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 5{' '}
            <span className="text-rose-300 font-bold italic">
              Managing Data Concurrency
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the essentials of data concurrency: database transactions,
            ACID properties, transaction states, concurrency control, lock-based
            protocols, and dealing with deadlocks and starvation.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Database size={14} className="inline mr-1" /> Transactions
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Lock size={14} className="inline mr-1" /> Concurrency
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
                placeholder="Search for a concept, ACID, or lock protocol..."
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
                Introduction to Managing Data Concurrency
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In the real world, many people need to use the same database
                    at the same time. This is called concurrency. While having
                    many users at once is good for productivity, it can also
                    cause problems if not managed properly. This learning outcome
                    covers transactions, ACID properties, concurrency control,
                    and how to handle deadlocks and starvation.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  A database transaction is like a recipe – you need to follow
                  all the steps completely to get the final dish. If any step
                  fails, you don't want to serve a half-cooked meal. Transactions
                  work the same way: either every operation succeeds, or none
                  of them happen at all.
                </p>
              </div>
            </div>

            {/* Transactions */}
            <div
              ref={(el) => {
                sectionRefs.current['transactions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Database Transactions
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A <span className="font-bold">database transaction</span> is a
                group of database operations that are treated as one single unit
                of work. Either every operation in the group succeeds and the
                database is updated, OR none of them happen at all. The database
                stays the same as before you started.
              </p>

              <div className="mt-4">
                <SQLConsole
                  code={`-- Starting a transaction\nSTART TRANSACTION;\n\n-- Step 1: Subtract from Savings\nUPDATE Accounts SET balance = balance - 100 \nWHERE account_id = 'SAV001';\n\n-- Step 2: Add to Checking\nUPDATE Accounts SET balance = balance + 100 \nWHERE account_id = 'CHK001';\n\n-- If everything is correct, save the changes permanently\nCOMMIT;\n\n-- OR, if something goes wrong, undo everything\n-- ROLLBACK;`}
                  isDarkMode={isDarkMode}
                  databaseName="bank_system"
                />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">💡 Simple Example</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Moving $100 from savings to checking: subtract $100 from savings, add $100 to checking. A transaction ensures both steps happen, or neither happens. You never end up with money disappearing but not appearing in checking.</p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                10 Advantages of Database Transactions
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {advantagesTransactions.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">
                10 Disadvantages of Database Transactions
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {disadvantagesTransactions.map((dis, idx) => (
                  <li key={idx}>{dis}</li>
                ))}
              </ul>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What does it mean that a transaction is "all or nothing"?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 1)} /> a) Only half of the operations are saved
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 1)} /> b) Either every operation succeeds, OR none happen and the database stays unchanged
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 1)} /> c) Transactions always fail
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 1 ? '✅ Correct! All or nothing means the entire transaction succeeds or fails completely.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* ACID */}
            <div
              ref={(el) => {
                sectionRefs.current['acid'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                ACID Properties – The Pillars of Transaction Reliability
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Atomicity</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">"All or nothing" – either all operations complete or none do. No in-between state.</p>
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Example: Money transfer – both accounts updated or neither.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Consistency</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Database goes from one valid state to another – all rules and constraints are respected.</p>
                  <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Example: Age cannot be negative – transaction fails if trying to set age to -5.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Isolation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Concurrent transactions don't interfere with each other. Each transaction runs as if alone.</p>
                  <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Example: Two people buying the last ticket – only one succeeds.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Durability</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Once committed, changes are permanent – survive power outages and crashes.</p>
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Example: Payment recorded – survives even if power fails immediately after.</p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                10 Advantages of ACID Properties
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {advantagesACID.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">
                10 Disadvantages of ACID Properties
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {disadvantagesACID.map((dis, idx) => (
                  <li key={idx}>{dis}</li>
                ))}
              </ul>

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which ACID property ensures committed changes survive power outages?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 2)} /> a) Atomicity
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 2)} /> b) Consistency
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 2, 2)} /> c) Durability
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 2 ? '✅ Correct! Durability makes committed changes permanent.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
              </div>
            </div>

            {/* Transaction States */}
            <div
              ref={(el) => {
                sectionRefs.current['transaction-states'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Database Transaction States
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Active</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Transaction has started and operations are being executed. Changes are not yet permanent.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Committed</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Transaction finished successfully. Changes are permanently saved to the database.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Failed/Aborted</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">An error happened. The database rolls back (undoes) any changes, returning to the previous state.</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">💡 Additional States</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li><span className="font-bold">Partially Committed</span> – Some operations completed, but not all (modern databases often skip this)</li>
                  <li><span className="font-bold">Terminated</span> – Transaction ended abnormally (system crash)</li>
                </ul>
              </div>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What happens when a transaction enters the "Failed" or "Aborted" state?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 1)} /> a) The transaction is saved anyway
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 1)} /> b) The database rolls back changes, returning to the state before the transaction started
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 2, 1)} /> c) The transaction keeps running
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 1 ? '✅ Correct! The database rolls back all changes.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Concurrency Control */}
            <div
              ref={(el) => {
                sectionRefs.current['concurrency-control'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Concurrency Control in Databases
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Concurrency control ensures that the final result is the same as
                if all the transactions had run one after another (in some order),
                even though they actually ran at the same time. This is called
                <span className="font-bold"> serializability</span>.
              </p>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                10 Advantages of Concurrency Control
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {advantagesConcurrency.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">
                10 Disadvantages of Concurrency Control
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {disadvantagesConcurrency.map((dis, idx) => (
                  <li key={idx}>{dis}</li>
                ))}
              </ul>

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Why do databases need concurrency control?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 1)} /> a) To make the database slower
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 1)} /> b) To prevent problems like lost updates and dirty reads
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 2, 1)} /> c) To allow only one user at a time
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 1 ? '✅ Correct! Concurrency control prevents data problems with multiple users.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Concurrency Problems */}
            <div
              ref={(el) => {
                sectionRefs.current['concurrency-problems'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Concurrency Control Problems
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Lost Update</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Two transactions update the same data – one update gets overwritten and lost.</p>
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Example: User A and User B both edit the same customer record – one change is lost.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Dirty Read</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Reading uncommitted data that might be rolled back later.</p>
                  <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Example: Transaction A changes price to $15; Transaction B reads $15; Transaction A rolls back to $10. B has incorrect info.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Non-Repeatable Read</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Reading the same data twice gets different results because another transaction changed it in between.</p>
                  <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Example: Transaction A reads balance ($100); Transaction B withdraws $30; Transaction A reads again ($70). Same transaction saw two values.</p>
                  </div>
                </div>
              </div>

              {/* Quiz 5 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What is a "dirty read"?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 0, 1)} /> a) Reading corrupted data
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 1, 1)} /> b) Reading uncommitted data that might be rolled back
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz5" onChange={() => checkAnswer(5, 2, 1)} /> c) Reading the same data twice with different results
                  </label>
                </div>
                {showQuiz5Result && (
                  <div className={`mt-2 p-2 rounded ${quiz5Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz5Answer === 1 ? '✅ Correct! A dirty read is reading uncommitted data.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Lock Protocols */}
            <div
              ref={(el) => {
                sectionRefs.current['lock-protocols'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Lock-Based Protocols – Securing Data Access
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Exclusive Lock (X Lock)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Gives exclusive access – no other transaction can read or write the data.</p>
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Analogy: "Do Not Disturb" sign on a hotel room door.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Shared Lock (S Lock)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Multiple transactions can read, but none can write.</p>
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Analogy: Public library book – many can read, no one can write in it.</p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Two-Phase Locking (2PL) Protocol
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Phase 1: Growing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Acquire new locks, cannot release any.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Phase 2: Shrinking</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Release locks, cannot acquire new ones.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                10 Advantages of Lock-Based Protocols
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {advantagesLocks.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">
                10 Disadvantages of Lock-Based Protocols
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {disadvantagesLocks.map((dis, idx) => (
                  <li key={idx}>{dis}</li>
                ))}
              </ul>
            </div>

            {/* Alternative Protocols */}
            <div
              ref={(el) => {
                sectionRefs.current['alternative-protocols'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Alternative Concurrency Control Protocols
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Timestamp-Based Protocols</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Assign unique timestamps to transactions. Older timestamps have priority. Optimistic – no locks, conflicts checked at commit.</p>
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Older timestamp wins; younger may be restarted.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Validation-Based Protocols</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Transactions run freely without locks. Before commit, validate no conflicts occurred. If conflict, roll back and restart.</p>
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Three phases: Read, Validate, Write. Works well when conflicts are rare.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200 dark:border-teal-800 mt-4">
                <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">💡 When to Use Each</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Lock-based (pessimistic) works well when conflicts are common. Timestamp and validation-based (optimistic) work well when conflicts are rare, such as in read-heavy systems.</p>
              </div>
            </div>

            {/* Deadlock vs Starvation */}
            <div
              ref={(el) => {
                sectionRefs.current['deadlock-starvation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Deadlock vs Starvation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Deadlock</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Two or more transactions stuck waiting for resources each other holds. Circular dependency.</p>
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Example: A locks Table 1 and wants Table 2; B locks Table 2 and wants Table 1.</p>
                  </div>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Four conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Starvation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A transaction is continuously denied resources because higher-priority transactions always go first.</p>
                  <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Example: Low-priority transaction keeps getting pushed to the back of the line.</p>
                  </div>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Prevention: Fair queuing, increase priority over time, guarantee eventual access</p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                10 Advantages of Deadlock Handling Mechanisms
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {advantagesDeadlockHandling.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">
                10 Disadvantages of Deadlock and Starvation
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {disadvantagesDeadlockStarvation.map((dis, idx) => (
                  <li key={idx}>{dis}</li>
                ))}
              </ul>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212] mt-4">
                <table className="w-full text-left border-collapse min-w-[400px] text-xs">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Feature</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Deadlock</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Starvation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold">Blocking</td><td className="p-3">Circular dependency</td><td className="p-3">One-sided blocking</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Resources</td><td className="p-3">All hold some resources</td><td className="p-3">Cannot acquire resources</td></tr>
                    <tr><td className="p-3 font-bold">Recovery</td><td className="p-3">Roll back one (victim)</td><td className="p-3">Prioritize or adjust allocation</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 mt-4">
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400">📝 Final Summary</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Managing data concurrency is essential for any database that multiple people use at the same time. Transactions and the ACID properties ensure data integrity. Concurrency control mechanisms like locking prevent problems such as lost updates, dirty reads, and inconsistent retrievals. Understanding deadlocks and starvation helps you troubleshoot when things go wrong.</p>
              </div>

              {/* Quiz 6 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What is the main difference between deadlock and starvation?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz6" onChange={() => checkAnswer(6, 0, 0)} /> a) Deadlock is circular waiting; starvation is one transaction always skipped
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz6" onChange={() => checkAnswer(6, 1, 0)} /> b) They are the same problem
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz6" onChange={() => checkAnswer(6, 2, 0)} /> c) Starvation is circular; deadlock is one-sided
                  </label>
                </div>
                {showQuiz6Result && (
                  <div className={`mt-2 p-2 rounded ${quiz6Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz6Answer === 0 ? '✅ Correct! Deadlock = circular; starvation = one transaction always losing.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Know ACID Properties</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Atomicity (all or nothing), Consistency (rules respected), Isolation (no interference), Durability (permanent). Be able to give examples of each.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Understand Lock Types</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Exclusive (X) vs Shared (S) locks. Know when each is used and their effects on concurrency.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Concurrency Problems</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Lost Update, Dirty Read, Non-Repeatable Read – know the difference and examples of each.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Deadlock vs Starvation</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Deadlock = circular wait; Starvation = one transaction always loses. Know the four conditions for deadlock.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 2PL Protocol</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Two-Phase Locking: Growing phase (acquire locks) and Shrinking phase (release locks).</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Understand it. Lock it. Commit it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Concurrency Insight
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
                  <span>ACID Properties</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Lock Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">2</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Concurrency control is essential for multi-user databases.
                Transactions and ACID properties ensure data integrity, while
                locking prevents concurrency problems. Understand the tools,
                and you'll keep your data safe and consistent.
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
                <strong className="text-white">Database transactions</strong> are "all or nothing" units of work – either every operation succeeds, or none happen at all.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">ACID properties</strong> – Atomicity, Consistency, Isolation, Durability – ensure reliable and correct transactions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Concurrency control</strong> prevents problems like lost updates, dirty reads, and non-repeatable reads.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Lock types</strong> – Exclusive (X) for writes, Shared (S) for reads. Two-Phase Locking (2PL) prevents many concurrency issues.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Deadlock vs Starvation</strong> – Deadlock is circular waiting; starvation is one transaction always losing. Each requires different prevention strategies.
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
            Sidemann Academic Registry • Managing Data Concurrency 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;