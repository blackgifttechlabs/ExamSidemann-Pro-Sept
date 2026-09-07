import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingCart,
  ClipboardList,
  FileSignature, // Fixed: Replaced 'FileContract' (FontAwesome) with 'FileSignature'
  Handshake,
  Truck,
  Wrench,        // Fixed: Replaced 'Tools' (non-existent in Lucide) with 'Wrench'
  Lightbulb,
  GraduationCap,
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
  HardDrive,    // Fixed: Resolved duplicate declaration conflict
  FileText,
  ClipboardCheck,
  FileCheck,
  Receipt,
} from 'lucide-react';
import { AdSense } from '../../../../analytics/AdSense';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'stages', label: 'Stages' },
  { id: 'requisition', label: 'Requisition' },
  { id: 'legislation', label: 'Legislation' },
  { id: 'tco', label: 'TCO' },
  { id: 'guidelines', label: 'Guidelines' },
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
        text: 'Total Cost of Ownership (TCO) includes not just purchase price, but also installation, maintenance, training, energy, and disposal costs.',
      },
      {
        title: 'Pro Tip',
        text: 'Always start procurement with a needs assessment – understand the problem before looking for a solution.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the procurement stages: "Identify, Research, Evaluate, Purchase, Install, Support" – like a recipe for buying IT.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse RFI (Request for Information) with RFP (Request for Proposal). RFI is for gathering info; RFP is for formal bids.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Total Cost of Ownership (TCO) includes not just purchase price, but also installation, maintenance, training, energy, and disposal costs.',
      },
      {
        title: 'Pro Tip',
        text: 'Always start procurement with a needs assessment – understand the problem before looking for a solution.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the procurement stages: "Identify, Research, Evaluate, Purchase, Install, Support" – like a recipe for buying IT.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse RFI (Request for Information) with RFP (Request for Proposal). RFI is for gathering info; RFP is for formal bids.',
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

  const [showQuiz1Result, setShowQuiz1Result] = useState(false);
  const [showQuiz2Result, setShowQuiz2Result] = useState(false);
  const [showQuiz3Result, setShowQuiz3Result] = useState(false);
  const [showQuiz4Result, setShowQuiz4Result] = useState(false);

  const checkAnswer = (quizNumber: number, selectedAnswer: number, correctAnswer: number) => {
    switch(quizNumber) {
      case 1: setQuiz1Answer(selectedAnswer); setShowQuiz1Result(true); break;
      case 2: setQuiz2Answer(selectedAnswer); setShowQuiz2Result(true); break;
      case 3: setQuiz3Answer(selectedAnswer); setShowQuiz3Result(true); break;
      case 4: setQuiz4Answer(selectedAnswer); setShowQuiz4Result(true); break;
    }
  };

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Database size={14} className="inline mr-1" /> IT EQUIPMENT PROCUREMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 4{' '}
            <span className="text-amber-300 font-bold italic">
              IT Equipment Procurement
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the systematic process of acquiring IT hardware and software
            — from needs assessment to total cost of ownership, legislation, and
            best practices.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ShoppingCart size={14} className="inline mr-1" /> Procurement
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Handshake size={14} className="inline mr-1" /> TCO
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
                placeholder="Search for a concept, stage, or TCO..."
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
                What is IT Equipment Procurement?
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Procurement simply means <span className="font-bold">the process of buying something</span> — but in an organizational or business context, it's not as simple as just going to a shop and picking something off the shelf. When a company or school needs to buy computers, printers, servers, or any IT equipment, there's a structured process they follow to make sure they're buying the right things, from the right supplier, at the right price, without wasting money.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Think of it like this: if you were buying a phone for yourself, you'd think about what you need it for, how much you can spend, compare a few options, and then buy. Organizations do the same thing — but on a much larger scale, with more people involved, more money at stake, and formal paperwork at every step.
                </p>
              </div>
            </div>

            {/* Stages */}
            <div
              ref={(el) => {
                sectionRefs.current['stages'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Stages of the IT Equipment Procurement Process
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <ClipboardList size={20} /> Stage 1: Identify Hardware Requirements
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Before you can buy anything, you need to know exactly what you need and why. This stage is all about <span className="font-bold">understanding the problem before jumping to a solution.</span>
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><span className="font-bold">Needs assessment</span> – evaluate current IT setup, identify gaps, and consult end users.</li>
                    <li><span className="font-bold">Detailed specification</span> – create a document listing required processing power, RAM, storage, OS, etc.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-lg font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Search size={20} /> Stage 2: Research and Evaluate Vendors
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Once you know what you need, find out who can provide it. A <span className="font-bold">vendor</span> is a company that sells the products you need.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Create a <span className="font-bold">shortlist</span> based on reputation, product range, pricing, and support.</li>
                    <li><span className="font-bold">RFI (Request for Information)</span> – gather product and service details.</li>
                    <li><span className="font-bold">RFP (Request for Proposal)</span> – formal request for detailed bids including pricing and delivery.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-lg font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                    <Scale size={20} /> Stage 3: Evaluate Proposals and Select a Vendor
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Carefully compare proposals and choose the best one.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Evaluate against criteria: technical specs, pricing, Total Cost of Ownership (TCO), vendor qualifications, references.</li>
                    <li><span className="font-bold">Negotiate</span> – improve pricing, payment terms, or additional services.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <FileCheck size={20} /> Stage 4: Purchase and Order Fulfillment
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Issue a <span className="font-bold">Purchase Order (PO)</span> – a legally binding document that formalizes the order.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>PO includes items, prices, delivery dates, and payment terms.</li>
                    <li>Track the order to ensure on-time delivery.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-lg font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2">
                    <Truck size={20} /> Stage 5: Delivery, Installation, and Configuration
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Inspect deliveries, install and configure equipment, and test before acceptance.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Check against PO for quantity, model, and condition.</li>
                    <li>Install OS, software, network settings, and run tests.</li>
                    <li>Formal acceptance after successful testing.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Wrench size={20} /> Stage 6: Ongoing Support and Maintenance
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Procurement doesn't end when the boxes are opened. Maintain records, provide training, and plan for disposal.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Track warranties and support agreements.</li>
                    <li>User training to ensure effective use.</li>
                    <li>Begin disposal planning for end-of-life.</li>
                  </ul>
                </div>
              </div>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which document is a formal request for detailed bids from vendors?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 1)} /> a) RFI
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 1)} /> b) RFP
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 1)} /> c) PO
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 1 ? '✅ Correct! RFP (Request for Proposal) is the formal bid request.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Requisition Form */}
            <div
              ref={(el) => {
                sectionRefs.current['requisition'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Requisition Form — What It Is and Why It Matters
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A <span className="font-bold">requisition form</span> is a formal document used to officially request the purchase of hardware within an organization. It's the starting point of the procurement process — before anything gets bought, someone has to submit a requisition explaining what they need, why they need it, and how many they need.
                </p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                What a Requisition Form Contains
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-teal-600 dark:text-teal-400 block mb-1">Requester Information:</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Your name, department, and date.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-teal-600 dark:text-teal-400 block mb-1">Hardware Details:</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Quantity, type of hardware, brand/model or specifications.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-teal-600 dark:text-teal-400 block mb-1">Justification:</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Why you need it — replacing outdated machines, equipping new staff, etc.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-teal-600 dark:text-teal-400 block mb-1">Specifications:</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Minimum technical requirements if no specific model is chosen.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-teal-600 dark:text-teal-400 block mb-1">Budget Information:</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Estimated cost to help approvers understand financial impact.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-bold text-teal-600 dark:text-teal-400 block mb-1">Approval Signatures:</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Department head, IT, procurement — confirm legitimacy and budget.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">How to Submit a Requisition Form</h4>
                <ol className="list-decimal pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li>Identify your needs clearly (what, why, how many).</li>
                  <li>Obtain the requisition form template from your IT or procurement department.</li>
                  <li>Fill it out completely and accurately.</li>
                  <li>Attach any supporting documents (e.g., vendor quotes).</li>
                  <li>Submit through the established process (electronic or physical).</li>
                  <li>The form goes through an approval workflow (department head, IT, procurement).</li>
                  <li>Once approved, procurement initiates the buying process.</li>
                </ol>
              </div>

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What is the primary purpose of a requisition form?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 1)} /> a) To place an order with a vendor
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 1)} /> b) To officially request the purchase of hardware internally
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 2, 1)} /> c) To compare vendor prices
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 1 ? '✅ Correct! A requisition form is an internal request to initiate procurement.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Legislation */}
            <div
              ref={(el) => {
                sectionRefs.current['legislation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Procurement Legislation — The Rules That Govern Buying
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Organizational Policies</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Internal rules covering spending limits, approval workflows, vendor selection, conflict of interest, and contract negotiation. Prevent wasteful spending and corruption.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Local Government Legislation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Local laws may require preference for local businesses or environmental standards. Organizations must comply.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">National Legislation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Public procurement laws (e.g., FAR, EU Directives, PRAZ) enforce fairness, transparency, accountability, and value for money.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Fairness and transparency — equal opportunity for vendors</li>
                    <li>Accountability — decision-makers must justify their choices</li>
                    <li>Value for money — best overall value, not just cheapest</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">International Trade Agreements</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Trade agreements may require that businesses from partner countries be allowed to compete for government contracts, ensuring fair competition across borders.</p>
                </div>
              </div>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which principle of procurement legislation ensures that all vendors have an equal opportunity to compete?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 2)} /> a) Accountability
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 2)} /> b) Value for money
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 2, 2)} /> c) Fairness and transparency
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 2 ? '✅ Correct! Fairness and transparency ensure equal opportunity.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
              </div>
            </div>

            {/* TCO */}
            <div
              ref={(el) => {
                sectionRefs.current['tco'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Total Cost of Ownership (TCO) — The Real Cost
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">TCO</span> means the total amount of money you will spend on a piece of hardware or software throughout its entire life — not just what you pay to buy it. A cheaper purchase price often hides higher long-term costs (energy, maintenance, support, replacement).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Hardware TCO Components</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Initial acquisition cost</li>
                    <li>Deployment costs (installation, configuration, data migration)</li>
                    <li>Software licensing (OS, applications)</li>
                    <li>Warranty and maintenance</li>
                    <li>Training</li>
                    <li>Energy consumption</li>
                    <li>Disposal costs</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Software TCO Components</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Licensing costs (perpetual or subscription)</li>
                    <li>Implementation and customization</li>
                    <li>Training</li>
                    <li>Maintenance and support (updates, patches)</li>
                    <li>Integration with existing systems</li>
                    <li>Security measures</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Why TCO Matters</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  TCO analysis allows organizations to compare options fairly, allocate budgets accurately, and avoid unpleasant surprises from hidden costs. A cheaper initial price can often result in a higher total cost over time.
                </p>
              </div>

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which of the following is NOT typically included in TCO?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 1)} /> a) Purchase price
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 1)} /> b) Training costs
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 2, 1)} /> c) Marketing expenses
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 2 ? '✅ Correct! Marketing expenses are not part of TCO.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
              </div>
            </div>

            {/* Guidelines */}
            <div
              ref={(el) => {
                sectionRefs.current['guidelines'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Guidelines for Effective Hardware and Software Acquisition
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <li><span className="font-bold">Always start with a needs assessment.</span> Understand exactly what you need before looking at products.</li>
                  <li><span className="font-bold">Evaluate existing assets first.</span> Can what you already have be upgraded or repurposed?</li>
                  <li><span className="font-bold">Standardize where possible.</span> Using the same model across departments simplifies maintenance, spare parts, and support.</li>
                  <li><span className="font-bold">Use formal procurement documents</span> (RFI, RFP, PO) to protect the organization and create clear records.</li>
                  <li><span className="font-bold">For software:</span> Choose licensing models carefully, verify compatibility, and test with trials before committing.</li>
                </ul>
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Know the Procurement Stages</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Be able to list and explain each stage: Identify, Research, Evaluate, Purchase, Install, Support. Understand what happens at each and why.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Differentiate Key Documents</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">RFI vs RFP vs PO – know their purposes and when they are used.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Understand TCO</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">TCO is more than purchase price. Include all costs over the lifetime. Be ready to give examples of components.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Procurement Legislation</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Know the principles: fairness, transparency, accountability, value for money. Understand why they are important.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Requisition Form</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Know what information it contains and why it's the starting point of the process.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Procure wisely. Document everything. Think TCO. 📦</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Procurement Insight
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
                  <span>Procurement Stages</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Key Documents</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Procurement is a structured process. Start with a clear needs assessment, use proper documentation, consider the full cost (TCO), and always follow the legal framework. These principles will guide you to successful acquisitions.
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
                <strong className="text-white">Procurement</strong> is a structured process for acquiring IT equipment, not just a simple purchase.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Six stages</strong> – Identify, Research, Evaluate, Purchase, Install, Support – ensure thoroughness and accountability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Key documents</strong> (Requisition, RFI, RFP, PO) formalize each step and protect the organization.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Total Cost of Ownership (TCO)</strong> includes all costs over the lifetime – purchase price is only part of the picture.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Procurement legislation</strong> ensures fairness, transparency, accountability, and value for money.
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
            Sidemann Academic Registry • IT Equipment Procurement 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;