import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Hash,
  Paperclip,
  SearchIcon,
  ClockIcon,
  Layout,
  HardDriveIcon,
  Edit,
  Target,
  GlobeIcon,
  Shield,
  ListChecks,
  SettingsIcon,
  Type,
  BookOpen,
  LayersIcon,
  FileText,
  Scissors,
  CircleIcon,
  Archive,
  Database,
  DollarSign,
  Users,
  Wrench,
  BarChart,
  MessageSquare,
  Calendar,
  Mail,
  User,
  Headphones,
  TrendingUp,
  AlertTriangle,
  Leaf,
  Cpu,
  File,
  Clipboard,
  BookMarked,
  Link,
  CreditCard,
  Receipt,
  Package,
  Handshake,
  Building,
  Ship,
  Lock,
  Scale,
  Gavel,
  FileCheck,
  CheckCircle,
  XCircle,
  PenTool,
  Award,
  AlertCircle,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  BookOpen as BookOpenIcon,
  Hand,
  Truck,
  Store,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'essentials', label: 'Essentials' },
  { id: 'operation', label: 'Operation' },
  { id: 'termination', label: 'Termination' },
  { id: 'breach', label: 'Breach' },
  { id: 'remedies', label: 'Remedies' },
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
        text: 'The concept of "consideration" in contract law originated in England in the 16th century, requiring that something of value must be exchanged for a promise to be legally binding.',
      },
      {
        title: 'Pro Tip',
        text: 'When drafting a contract, always clearly define the obligations of each party. Vague terms are the leading cause of contract disputes.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 6 essentials of a valid contract: Offer, Acceptance, Consideration, Capacity, Consent, and Legality.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse "breach" with "termination". Breach is a violation of the contract, while termination is the end of the contract.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The concept of "consideration" in contract law originated in England in the 16th century, requiring that something of value must be exchanged for a promise to be legally binding.',
      },
      {
        title: 'Pro Tip',
        text: 'When drafting a contract, always clearly define the obligations of each party. Vague terms are the leading cause of contract disputes.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 6 essentials of a valid contract: Offer, Acceptance, Consideration, Capacity, Consent, and Legality.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse "breach" with "termination". Breach is a violation of the contract, while termination is the end of the contract.',
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

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

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

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Law of Contract &{' '}
            <span className="text-sky-300 font-bold italic">
              Breach Remedies
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Comprehensive guide to the essentials of a valid contract, operation, termination, breach, and available remedies.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scale size={14} className="inline mr-1" /> Contract
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Gavel size={14} className="inline mr-1" /> Remedies
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <AlertTriangle size={14} className="inline mr-1" /> Breach
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
                placeholder="Search for a concept, offer, breach..."
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
                  <XIcon size={18} className="text-orange-200" />
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
            {/* SECTION 1: Law of Contract */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Law of Contract
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A legally binding promise or set of promises that a court will enforce. If someone breaks a contract, the law provides a remedy.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    <strong>Detailed Explanation:</strong> The Law of Contract governs the creation, interpretation, and enforcement of agreements between two or more parties, creating legally binding obligations. It establishes whether an agreement is enforceable and provides remedies for breach.
                  </p>
</div>
            </div>

            {/* SECTION 2: Essentials of a Valid Contract */}
            <div
              ref={(el) => {
                sectionRefs.current['essentials'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Essentials of a Valid Contract
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These are the ingredients that must be present for a court to recognize an agreement as a legally enforceable contract.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Handshake size={16} /> Agreement (Offer and Acceptance)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Explanation:</strong> An agreement is the foundation of any contract. It requires a valid offer by one party (the offeror) and an unconditional acceptance of that offer by the other party (the offeree). There must be a "meeting of the minds" – a clear understanding between the parties on the essential terms of the agreement.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Offer Details:</strong> An offer must be definite, communicated to the offeree, and made with the intention to be bound by acceptance. It should not be vague, ambiguous, or an invitation to treat (an invitation to make an offer).
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Acceptance Details:</strong> Acceptance must be absolute and unqualified, communicated to the offeror, and made in the prescribed manner (if any). Silence generally does not constitute acceptance. The acceptance must mirror the offer exactly; any changes constitute a counteroffer, which the original offeror is free to accept or reject.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Example:</strong>
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Offer:</strong> "I will sell you my bicycle for $100."</li>
                  <li><strong>Acceptance:</strong> "I accept your offer. I will buy your bicycle for $100."</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Users size={16} /> Contractual Capacity
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Explanation:</strong> Parties entering a contract must have the legal capacity to do so. Certain individuals or groups may lack the capacity to contract, or their capacity may be limited.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Key Incapacities:</strong>
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Minors (Persons under the Age of Majority):</strong> Generally, contracts entered by minors are voidable at the minor's option (the minor can choose to cancel the contract). There are exceptions for contracts for necessaries (essential goods and services) and beneficial contracts of service (e.g., apprenticeships).</li>
                  <li><strong>Persons with Mental Incapacities:</strong> Individuals who are mentally incapacitated (due to mental illness, intoxication, etc.) may lack the capacity to contract if they are unable to understand the nature and consequences of their actions.</li>
                  <li><strong>Corporations:</strong> Corporations have the capacity to contract, but their capacity may be limited by their constitution or memorandum of association. Acts outside those boundaries are "ultra vires" (beyond its powers).</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Implication:</strong> If a party lacks contractual capacity, the contract may be void or voidable, depending on the circumstances.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Target size={16} /> Reality of Consent (Genuine Consent/Free Will)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Explanation:</strong> The consent of the parties to the contract must be genuine and freely given. Consent is not genuine if it is obtained through:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Coercion/Duress:</strong> The use of threats or force to compel someone to enter a contract.</li>
                  <li><strong>Undue Influence:</strong> Taking unfair advantage of a position of power or trust to persuade someone to enter a contract.</li>
                  <li><strong>Misrepresentation:</strong> A false statement of fact that induces someone to enter a contract. It can be innocent (made without knowledge of its falsity) or fraudulent (made with knowledge of its falsity or reckless disregard for its truth).</li>
                  <li><strong>Mistake:</strong> A misunderstanding or error about a material fact that is essential to the contract. It can be unilateral (one party mistaken) or mutual (both parties mistaken).</li>
                  <li><strong>Fraud:</strong> Deliberate deception to secure unfair or unlawful gain.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Implication:</strong> If consent is not genuine, the contract may be voidable at the option of the injured party.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Shield size={16} /> Legality of Contract (Lawful Object)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Explanation:</strong> The object and purpose of the contract must be legal and not contrary to public policy. A contract that is illegal or violates public policy is void and unenforceable.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Examples of Illegal Contracts:</strong>
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Contracts to commit a crime.</li>
                  <li>Contracts to restrain trade (unduly restrict competition).</li>
                  <li>Contracts that promote immorality.</li>
                  <li>Contracts that are contrary to public policy (e.g., contracts that undermine the administration of justice).</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Implication:</strong> Courts will not enforce illegal contracts.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <CheckCircle size={16} /> Possibility of Performance
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Explanation:</strong> The obligations outlined in the contract must be possible to perform at the time the contract is made. A contract is void if it is impossible to perform from the outset (e.g., a contract to sell something that does not exist or has already been destroyed).
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Types of Impossibility:</strong>
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Initial Impossibility:</strong> Exists at the time the contract is made.</li>
                  <li><strong>Subsequent Impossibility (Frustration):</strong> Arises after the contract is made due to an unforeseen event that makes performance impossible or fundamentally different from what was originally contemplated.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Implication:</strong> Contracts that are impossible to perform are generally void.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <FileText size={16} /> Formalities
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Explanation:</strong> In some cases, the law may require certain formalities to be met for a contract to be valid. This may include requirements that the contract be in writing, signed by the parties, witnessed, or notarized.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Examples:</strong>
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Contracts for the sale of land often require to be in writing.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Implication:</strong> If the required formalities are not met, the contract may be unenforceable.
                </p>
              </div>
            </div>

            {/* SECTION 3: Operation of Contract */}
            <div
              ref={(el) => {
                sectionRefs.current['operation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Operation of Contract
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Think of a contract as an agreement with specific instructions.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Terms:</strong> These are the individual instructions in the agreement. Like the steps in a recipe.</li>
                    <li><strong>Conditions:</strong> These are "if/then" statements that can affect the entire contract. Like saying "if the oven breaks, we can't bake the cake."</li>
                    <li><strong>Stipulations Alteri:</strong> This is a clause that says the agreement will also benefit a third person (someone who did not sign the agreement). Like baking a cake and promising a slice to your neighbour.</li>
                  </ul>
</div>
            </div>

            {/* SECTION 4: Termination of a Contract */}
            <div
              ref={(el) => {
                sectionRefs.current['termination'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Termination of a Contract
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Think of a contract as a job. "Termination" means the job is over. It can end because everyone did what they promised (performance), because everyone agreed to stop (mutual agreement), or because something happened that made the job impossible (supervening impossibility).
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <CheckCircle size={16} /> 1. Termination by Performance
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Core Concept:</strong> This is the most straightforward way a contract ends. Both parties fulfil their obligations according to the terms of the agreement. Once everyone has done what they promised, the contract is considered discharged or terminated.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Performance does not just mean doing something. It means doing exactly what was agreed upon. If the contract specifies a certain quality of goods, the performance must meet that standard. If there is a deadline, the performance must be completed by that deadline. Substantial performance (doing almost everything right) might be accepted, but it could still lead to a claim for damages to cover the minor things that were not done correctly. Complete and conforming performance is the ideal. For example, imagine a construction contract for building a house. The contractor must build the house according to the plans, using the specified materials, and within the agreed timeframe. Once the house is built to those specifications and handed over to the homeowner, and the homeowner pays the agreed price, the contract is terminated by performance. The burden of proof that performance has occurred typically lies with the party who was obligated to perform.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Handshake size={16} /> 2. Termination by Mutual Agreement
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Core Concept:</strong> Contracts are created by agreement, and they can be ended by agreement too. If both (and all) parties to the contract decide they no longer want to be bound by it, they can mutually agree to terminate it.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Agreement can take several forms. A common one is a rescission, where the parties agree to cancel the contract as if it never existed. This might involve returning any consideration (money, goods, services) that had already been exchanged. Another form is a novation, where a new contract is created, replacing the old one. This might involve substituting a new party into the agreement. A third form is an accord and satisfaction. This happens when one party has breached the contract, and the other party agrees to accept something different (usually less) than what they were originally entitled to, in full settlement of the claim. The "accord" is the agreement to accept the different performance, and the "satisfaction" is the actual performance of that agreement. All forms of mutual agreement require a "meeting of the minds" - clear intent from all parties to end the contract under the agreed terms. The agreement to terminate must be supported by consideration. This could be a mutual release of obligations, or some other benefit to each party. For instance, suppose a business hires a marketing consultant for a year. After six months, both parties realize the arrangement is not working out. They can mutually agree to terminate the contract. Perhaps they agree that the consultant will keep the fees already paid, and both parties release each other from any further obligations.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <AlertCircle size={16} /> 3. Termination by Supervening Impossibility (Frustration of Contract)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Core Concept:</strong> Sometimes, something happens after the contract is formed that makes it impossible (or radically different) to fulfil the obligations. This is known as supervening impossibility, and it can excuse performance. In some jurisdictions, a similar concept called "frustration of purpose" applies when the purpose of the contract has been destroyed, even if performance is technically still possible.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> The impossibility must be due to unforeseen circumstances that were not the fault of either party. Common examples include natural disasters (earthquakes, floods), government regulations that make the performance illegal, or the destruction of the subject matter of the contract. Mere difficulty or increased expense is generally not enough to trigger this. The impossibility must be genuine and objective – meaning that no one could perform the contract under the circumstances, not just that this party cannot. It is also important that the event was not foreseeable at the time the contract was made. If the parties could have reasonably anticipated the event and made provisions for it in the contract, the defence of impossibility is less likely to succeed. The doctrine of frustration of purpose is similar, but it focuses on the reason for the contract. If an event occurs that completely defeats the purpose of the contract, even if performance is technically possible, the contract may be discharged. For example, imagine a contract to rent a room with a balcony overlooking a parade route. If the parade is cancelled due to unforeseen circumstances, the renter might be excused from paying rent because the whole purpose of the contract (to watch the parade from the balcony) has been frustrated, even though the room is still available.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Link size={16} /> 4. Termination by Merger
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Core Concept:</strong> Merger occurs when one contract is absorbed into another, typically a later contract between the same parties. The original contract essentially disappears.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> Merger most commonly happens in real estate transactions. For instance, a lease agreement is often merged into the deed when the tenant buys the property. Once the sale is complete, the lease no longer exists; the ownership rights are governed by the deed. The intent of the parties is crucial. Did they intend for the later contract to supersede and replace the earlier one? If the later contract covers the same subject matter as the earlier contract but contains different or additional terms, it is more likely that a merger has occurred. The doctrine of merger prevents parties from bringing claims based on the old contract after the merger has occurred. It assumes that the parties have considered all the terms of the previous contract when entering into the new agreement, and any terms that are not included in the new agreement are intentionally left out.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <DollarSign size={16} /> 5. Termination by Set-Off
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Core Concept:</strong> Set-off is a legal principle that allows a debtor to reduce or eliminate a debt they owe to a creditor by deducting a debt the creditor owes to them. It is like a mutual cancellation of debts.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> For set-off to apply, the debts must be mutual (owed between the same parties), due (payable immediately), and of the same nature (usually both are monetary debts). There are different types of set-off, including legal set-off (allowed by law even without express agreement), equitable set-off (allowed by a court based on fairness), and contractual set-off (explicitly provided for in the contract itself). Set-off can operate as a defence to a claim. For example, if Company A sues Company B for $10,000, and Company B can prove that Company A owes them $6,000, Company B can use set-off to reduce the amount they owe to $4,000. Set-off can lead to termination of the contract in the sense that the debt owed under the contract is extinguished. The contract itself might still exist if there are other remaining obligations, but the specific debt obligation that was subject to set-off is considered fulfilled.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <ClockIcon size={16} /> 6. Termination by Extinctive Prescription (Statute of Limitations)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Core Concept:</strong> Every jurisdiction has laws called statutes of limitations that set time limits for bringing legal claims. If you wait too long to sue for breach of contract, your claim will be barred by extinctive prescription (the statute of limitations).
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Detailed Explanation:</strong> The length of the statute of limitations varies depending on the type of contract (written vs. oral, for example) and the jurisdiction. The clock typically starts running from the date of the breach of contract (when the other party failed to perform their obligations). Once the statutory period has expired, the right to sue is lost. This does not mean the contract never existed; it just means you can no longer enforce it through the courts. The defence of the statute of limitations must be raised by the defendant (the person being sued). If they do not raise it, the court might still allow the case to proceed. There can be exceptions to the statute of limitations, such as tolling (suspending the running of the clock) if the defendant has concealed the breach or if the plaintiff is under a legal disability (like being a minor). For example, if the statute of limitations for breach of contract is six years, and a company breaches a contract in 2024, the other party generally has until 2030 to file a lawsuit. If they wait until 2031, their claim will be barred.
                </p>
              </div>
            </div>

            {/* SECTION 5: Breach of Contract */}
            <div
              ref={(el) => {
                sectionRefs.current['breach'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Breach of Contract
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A breach of contract means that one party to an agreement does not do what they promised to do. It is like breaking a promise that is legally binding. This can range from small mistakes to very serious failures to fulfil the terms.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <AlertTriangle size={16} /> Detailed Explanation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  A breach of contract is a failure, without legal excuse, to perform any promise that forms all or part of the agreement. This failure can occur in several ways:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Failure to Perform:</strong> This is the most obvious type of breach. A party simply does not do what they were obligated to do under the contract.</li>
                  <li><strong>Unsatisfactory Performance:</strong> The party does something, but it is not what was agreed upon in the contract. The quality might be substandard, the goods might be defective, or the service might not meet the required standards.</li>
                  <li><strong>Repudiation (Anticipatory Breach):</strong> Before the performance is due, one party clearly indicates that they will not perform the contract. This allows the other party to treat the contract as breached immediately, rather than waiting for the actual performance date to pass.</li>
                  <li><strong>Interference:</strong> A party actively prevents the other party from performing their obligations under the contract.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Key Considerations Regarding Breach of Contract:</strong>
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Materiality:</strong> Not every breach is equal. A material breach is a serious violation of the contract that goes to the heart of the agreement. It substantially deprives the other party of the benefit they were supposed to receive. A minor breach (also called a partial breach) is a less serious violation that does not significantly affect the overall benefit. The severity of the breach affects the remedies available.</li>
                  <li><strong>Causation:</strong> The breach must have caused damages to the non-breaching party. The non-breaching party must prove that they suffered a loss as a direct result of the other party's failure to perform.</li>
                  <li><strong>Excuse:</strong> There may be valid reasons why a party could not perform their obligations. These could include impossibility (as discussed earlier), frustration of purpose, or the other party's prior breach.</li>
                  <li><strong>Conditions:</strong> Contracts often contain conditions – events that must occur before a party is obligated to perform. If a condition fails to occur, the party's obligation to perform may be excused.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Example:</strong> Imagine a company hires a web developer to build a website by a specific date. If the developer fails to deliver the website by the agreed date, they are in breach of contract. The company could sue for damages to cover the lost revenue they suffered because the website was not ready on time. If finding a new developer would take a very long time and the website is crucial to the company's business, the company might even ask the court to order the original developer to finish the website (specific performance), though that is less likely than a damages award.
                </p>
              </div>
            </div>

            {/* SECTION 6: Remedies Available */}
            <div
              ref={(el) => {
                sectionRefs.current['remedies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Remedies Available When a Breach of Contract Occurs
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When a contract is breached, the non-breaching party has several legal remedies available to them. The choice of remedy depends on the nature of the breach and the specific circumstances of the case.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <XCircle size={16} /> 1. Cancellation (Rescission)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Core Concept:</strong> Rescission is essentially the undoing of the contract. It is a remedy that treats the contract as if it never existed. The goal is to restore both parties to the positions they were in before they entered into the agreement.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>How it Works:</strong> Rescission is typically granted when there has been a material breach of contract, fraud, misrepresentation, mistake, or duress. The non-breaching party must notify the breaching party of their intent to rescind the contract.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Restitution:</strong> Rescission often involves restitution. This means that each party must return any benefits they received under the contract. For example, if a buyer paid money for goods that were never delivered, they would be entitled to a refund of the purchase price.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Limitations:</strong> Rescission is not always available or appropriate. It is less likely to be granted if the non-breaching party has already substantially performed their obligations, or if it would be impossible to return the parties to their original positions. Also, if a party delays too long in seeking rescission after discovering the breach, a court may deny the remedy.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Example:</strong> A person buys a used car from a dealership based on the dealer's false representation that the car has never been in an accident. Upon discovering the car has significant accident damage, the buyer can seek rescission of the contract. They would return the car, and the dealer would refund the purchase price.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <DollarSign size={16} /> 2. Damages
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Damages are the most common remedy for breach of contract. The purpose of damages is to compensate the non-breaching party for their losses resulting from the breach.
                </p>

                <div className="mt-4">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">A. Compensatory Damages</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <em>Core Concept:</em> Compensatory damages aim to put the non-breaching party in the same economic position they would have been in if the contract had been fully performed. It is about making them "whole."
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <em>How it is Calculated:</em> This often involves calculating the direct losses suffered by the non-breaching party. This can include:
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Expectation Damages:</strong> This is the profit or benefit the non-breaching party expected to receive from the contract. It is the difference between what they were promised and what they received.</li>
                    <li><strong>Reliance Damages:</strong> These are damages incurred by the non-breaching party in reliance on the contract. This can include expenses they incurred preparing to perform their obligations. Reliance damages are used when expectation damages are too speculative to calculate.</li>
                    <li><strong>Restitution Damages (Again):</strong> Sometimes, compensatory damages can include restitution, especially if the non-breaching party conferred a benefit on the breaching party.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <em>Example:</em> A contractor agrees to build a deck for $10,000. The homeowner breaches the contract by refusing to allow the contractor to start work. The contractor can sue for compensatory damages. These damages might include the profit the contractor would have made on the job ($10,000 – cost of materials and labour).
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">B. Consequential Damages</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <em>Core Concept:</em> Consequential damages are indirect losses that are a foreseeable result of the breach. They go beyond the direct economic loss.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <em>Foreseeability Requirement:</em> To recover consequential damages, the non-breaching party must prove that the breaching party knew (or had reason to know) at the time the contract was made that these losses were likely to result from a breach. This is often referred to as the Hadley v. Baxendale rule (a famous contract law case).
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <em>Example:</em> A manufacturer contracts with a trucking company to deliver a crucial machine part to its factory by a certain date. The trucking company is aware that the factory will have to shut down production if the part does not arrive on time. The trucking company breaches the contract by delivering the part late, causing the factory to shut down for a day. The manufacturer can sue for consequential damages, including the lost profits from the factory shutdown.
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">C. Liquidated Damages</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <em>Core Concept:</em> These are damages that are specified in the contract itself as a fixed amount to be paid in the event of a breach.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <em>Enforceability:</em> Liquidated damages clauses are enforceable if they are a reasonable estimate of the actual damages that would result from a breach. Courts will not enforce liquidated damages clauses that are a penalty. Factors considered include:
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Was it difficult to estimate damages at the time of contracting?</li>
                    <li>Is the number of liquidated damages a reasonable forecast of potential damages?</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <em>Example:</em> A construction contract includes a clause stating that the contractor will pay $500 per day in liquidated damages for each day the project is completed past the agreed deadline. If the contractor finishes the project 10 days late, they will owe $5,000 in liquidated damages.
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">D. Nominal Damages</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <em>Core Concept:</em> A small number of damages (e.g., $1) awarded when a breach of contract occurred, but the non-breaching party did not suffer any actual financial loss.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <em>Purpose:</em> Nominal damages acknowledge that a legal wrong has occurred, even if there was no harm. This can be important for establishing a legal principle or preventing the breaching party from repeating the conduct.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <em>Example:</em> A band is contracted to play at a wedding, but the wedding is called off, and the band finds another gig for the same night that pays the same amount. The band may still be entitled to nominal damages for the breach of contract, even though they suffered no financial loss.
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">E. Punitive Damages</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <em>Core Concept:</em> Damages intended to punish the breaching party for egregious conduct and to deter similar conduct in the future.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <em>Rarity in Contract Law:</em> Punitive damages are very rarely awarded in breach of contract cases. They are typically only available if the breach is accompanied by a tort (a civil wrong), such as fraud, malice, or bad faith.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <em>Example:</em> A company intentionally breaches a contract to sell defective products, knowing that the products will cause serious harm to consumers. A court might award punitive damages in addition to compensatory damages to punish the company for its malicious conduct.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Target size={16} /> 3. Specific Performance
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Core Concept:</strong> An order from the court requiring the breaching party to perform their obligations under the contract.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>When It is Available:</strong> Specific performance is typically only available when monetary damages would be inadequate to compensate the non-breaching party. This is often the case when the subject matter of the contract is unique or irreplaceable (e.g., land, rare artwork, custom-made goods).
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Limitations:</strong> Specific performance is not available for contracts for personal services (e.g., a court will not force someone to work for you). It is also not available if performance would be impossible or unduly burdensome.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Example:</strong> A seller breaches a contract to sell a piece of land to a buyer. Because land is considered unique, the buyer can seek specific performance, asking the court to order the seller to transfer ownership of the land to the buyer.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Edit size={16} /> 4. Reformation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Core Concept:</strong> A remedy where the court modifies the contract to reflect the true intentions of the parties.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>When It is Available:</strong> Reformation is used when there has been a mistake in the drafting of the contract, such as a clerical error or a misunderstanding of the terms.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Example:</strong> Two parties agree to the sale of a specific property, but the written contract incorrectly describes the property's boundaries. A court can reform the contract to correct the description to match the parties' actual agreement.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Lock size={16} /> 5. Injunctive Relief
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Core Concept:</strong> A court order requiring a party to either do something (mandatory injunction) or refrain from doing something (prohibitory injunction).
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>When It is Available:</strong> Injunctive relief is often used to prevent a party from continuing to breach a contract or to protect a party's rights under a contract.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Example:</strong> A company has a non-compete agreement with a former employee. The employee starts working for a competitor in violation of the agreement. The company can seek an injunction to prevent the former employee from continuing to work for the competitor.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <ListChecks size={16} /> Choosing the Right Remedy
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The appropriate remedy for a breach of contract will depend on the specific facts and circumstances of the case. The non-breaching party should carefully consider their options and seek legal advice to determine which remedy will best protect their interests. Factors to consider include:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>The nature and extent of the breach.</li>
                  <li>The availability of evidence.</li>
                  <li>The cost of litigation.</li>
                  <li>The likelihood of success.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Contract Insight
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
                  <span>Essentials of Contract</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Ways to Terminate</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Contract law governs the agreements that form the backbone of business and personal transactions. Understanding the essentials of a valid contract (offer, acceptance, capacity, consent, legality, possibility) is crucial. Know the difference between terms, conditions, and warranties, and how contracts can be terminated. In case of a breach, several remedies are available, including damages, specific performance, and rescission.
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
        <div className="mt-8 p-6 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-orange-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Essentials of a Valid Contract</strong> – Agreement (Offer & Acceptance), Contractual Capacity, Reality of Consent (Genuine Consent), Legality of Contract (Lawful Object), Possibility of Performance, and Formalities.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Operation of Contract</strong> – Terms (Express and Implied), Conditions (Precedent, Subsequent, Concurrent), and Stipulations Alteri (Contracts for the benefit of a third party).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Termination</strong> – Contracts can end by Performance, Mutual Agreement, Supervening Impossibility (Frustration), Merger, Set-Off, or Extinctive Prescription (Statute of Limitations).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Breach of Contract</strong> – A failure to perform a promise without legal excuse. It can be Material or Minor.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Remedies</strong> – Cancellation (Rescission), Damages (Compensatory, Consequential, Liquidated, Nominal, Punitive), Specific Performance, Reformation, and Injunctive Relief.
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
            Sidemann Academic Registry • Legal Studies – Law of Contract 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;
