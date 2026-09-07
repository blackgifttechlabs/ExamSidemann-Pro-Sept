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
  FileSignature,
  Timer,
  RefreshCw,
  Star,
  FileCheck2,
  Clock,
  DollarSign as DollarSignIcon,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw as RefreshIcon,
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
  { id: 'intro', label: 'Introduction' },
  { id: 'characteristics', label: 'Characteristics' },
  { id: 'types', label: 'Types' },
  { id: 'transfer', label: 'Transfer' },
  { id: 'check-essentials', label: 'Check Essentials' },
  { id: 'issuing', label: 'Issuing Cheques' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'principles', label: 'Principles' },
  { id: 'promissory-vs-bill', label: 'Promissory vs Bill' },
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
        text: 'The concept of negotiable instruments dates back to ancient times, with merchants using bills of exchange to facilitate trade across long distances.',
      },
      {
        title: 'Pro Tip',
        text: 'Always write the amount in both numbers and words on a cheque. Banks will use the written amount if there is a discrepancy between the two.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 8 essentials of a cheque: Written Order, Unconditional, Signature, Drawee (Bank), Payee, Sum Certain, Date, and Payable on Demand.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a promissory note with a bill of exchange. A promissory note is a promise to pay (two parties), while a bill of exchange is an order to pay (three parties).',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The concept of negotiable instruments dates back to ancient times, with merchants using bills of exchange to facilitate trade across long distances.',
      },
      {
        title: 'Pro Tip',
        text: 'Always write the amount in both numbers and words on a cheque. Banks will use the written amount if there is a discrepancy between the two.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 8 essentials of a cheque: Written Order, Unconditional, Signature, Drawee (Bank), Payee, Sum Certain, Date, and Payable on Demand.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a promissory note with a bill of exchange. A promissory note is a promise to pay (two parties), while a bill of exchange is an order to pay (three parties).',
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Negotiable Instruments &{' '}
            <span className="text-amber-300 font-bold italic">
              Cheque Management
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Comprehensive guide to negotiable instruments, types, essentials of a check, issuing and negotiation, principles, and key differences between promissory notes and bills of exchange.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileSignature size={14} className="inline mr-1" /> Negotiable Instruments
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <DollarSignIcon size={14} className="inline mr-1" /> Cheques
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <PenTool size={14} className="inline mr-1" /> Transfer &amp; Negotiation
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
                placeholder="Search for a concept, cheque, endorsement..."
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
            {/* SECTION 1: Negotiable Instruments */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Negotiable Instruments
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Negotiable instruments are written documents that represent a promise or order to pay a specific sum of money, and which can be transferred from one person to another. They are designed to function as a substitute for cash, making transactions more convenient and efficient. Essentially, they are a way to move money around without moving physical cash.
                  </p>
</div>
            </div>

            {/* SECTION 2: Key Characteristics */}
            <div
              ref={(el) => {
                sectionRefs.current['characteristics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Key Characteristics
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Negotiable instruments have several defining characteristics that distinguish them from other types of documents.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <FileText size={16} /> Written Document
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    A negotiable instrument must be in writing. This provides a tangible record of the agreement and its terms.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle size={16} /> Unconditional Order or Promise
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The instrument must contain an unconditional order or promise to pay a certain sum of money. This means that the payment cannot be subject to any conditions or contingencies.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <DollarSignIcon size={16} /> Sum Certain in Money
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The amount of money to be paid must be clearly stated and definite. This ensures that there is no ambiguity about the value of the instrument.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Users size={16} /> Payable to Order or Bearer
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The instrument must be payable to a specific person (order instrument) or to whoever possesses it (bearer instrument). This allows for easy transferability.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <ClockIcon size={16} /> Payable on Demand or at a Definite Time
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The instrument must be payable either on demand (when requested) or at a specific future date. This provides clarity about when the payment is due.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: Types of Negotiable Instruments */}
            <div
              ref={(el) => {
                sectionRefs.current['types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Types of Negotiable Instruments
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    There are several types of negotiable instruments, each serving different purposes in commercial transactions.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <FileText size={16} /> Bills of Exchange
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    A bill of exchange is a written order by one person (the drawer) to another person (the drawee) to pay a certain sum of money to a third person (the payee). Checks are a common type of bill of exchange.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Example:</strong> Imagine a scenario where a business owner (drawer) owes money to a supplier (payee). Instead of paying cash, the business owner writes a bill of exchange ordering their bank (drawee) to pay the supplier. This simplifies the transaction and provides a record of the payment.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <PenTool size={16} /> Promissory Notes
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    A promissory note is a written promise by one person (the maker) to pay a certain sum of money to another person (the payee). It is essentially an "I owe you" document.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Example:</strong> If a person borrows money from a friend, they might give their friend a promissory note promising to repay the loan with interest by a specific date. This creates a legally binding obligation.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <FileSignature size={16} /> Checks
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    A check is a specific type of bill of exchange drawn on a bank, payable on demand. It is a widely used method for making payments.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Example:</strong> When you write a check, you are instructing your bank to pay the specified amount to the person or entity named on the check. This provides a convenient and secure way to transfer funds.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Archive size={16} /> Certificates of Deposit (CDs)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    A CD is a time deposit, a product offered by banks and credit unions. When a customer deposits money into a CD, they agree to leave the funds untouched for a specified period. In return, the bank agrees to pay a specified amount of interest.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Example:</strong> CDs are a way for a person to invest their money for a set period, and gain interest on that money.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 4: Transfer of Negotiable Instruments */}
            <div
              ref={(el) => {
                sectionRefs.current['transfer'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Transfer of Negotiable Instruments
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Negotiable instruments are designed to be easily transferred from one person to another. There are two primary methods of transfer.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <PenTool size={16} /> Endorsement
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    An endorsement is a signature on the back of a negotiable instrument, which transfers ownership to another person.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Example:</strong> If you receive a check and want to give it to someone else, you can endorse it by signing your name on the back.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Types of Endorsements:</strong>
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Blank endorsement:</strong> Only the payee's signature.</li>
                    <li><strong>Special endorsement:</strong> Specifies the person to whom the cheque is being transferred.</li>
                    <li><strong>Restrictive endorsement:</strong> Limits the use of the cheque (e.g., "for deposit only").</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Handshake size={16} /> Delivery
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    For bearer instruments, delivery alone is sufficient to transfer ownership.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Example:</strong> If a negotiable instrument is payable to the bearer, then whoever physically holds the instrument, owns it.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Key Point:</strong> For order instruments, both endorsement and delivery are required for proper transfer.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 5: Essentials of a Check */}
            <div
              ref={(el) => {
                sectionRefs.current['check-essentials'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Essentials of a Check
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A check is a specific type of negotiable instrument, namely a bill of exchange, drawn on a bank, payable on demand. It is a written order by a drawer (the person writing the check) to their bank (the drawee) to pay a certain sum of money to a payee (the person or entity to whom the check is made payable).
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <FileText size={16} /> Written Order
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    A check must be in writing. This provides a tangible record of the transaction. Oral instructions to a bank to pay money are not considered checks. The writing ensures that there's clear evidence of the drawer's intent and the amount to be paid. This written aspect is very important, because it allows for a clear record of the transaction and allows for evidence to be presented in court if needed.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle size={16} /> Unconditional Order
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The order to pay must be unconditional. This means that the bank must be instructed to pay the specified amount without any conditions or contingencies. If a check states, "Pay to John Doe if he delivers the goods," it is not a valid check. The order to pay must be clear and straightforward. This requirement is in place to provide certainty to the payee, and the bank, that the check will be honoured.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <FileSignature size={16} /> Drawer's Signature
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The check must be signed by the drawer. This authenticates the check and indicates the drawer's authorization for the bank to pay the specified amount. Without the drawer's signature, the check is invalid. The signature is the legal mark of the drawer, that signifies that they agree to the terms of the check.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Building size={16} /> Drawee (Bank)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The check must be drawn on a specific bank (the drawee). This means that the bank where the drawer has an account must be clearly identified. The bank is the entity that will pay the money. The bank is the middleman, that holds the drawer's money, and releases it upon the drawer's order.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Users size={16} /> Payee
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The check must specify the payee, the person or entity to whom the money is to be paid. This can be a specific name or "bearer." If "bearer" is written, anyone who possesses the check can cash it. The Payee is the person who will be receiving the money from the bank.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <DollarSignIcon size={16} /> Sum Certain in Money
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The check must state a definite amount of money to be paid. This amount must be clearly written both in numerical and written form. This prevents any ambiguity or alteration of the amount. The numerical amount and the written amount should match, to prevent fraud.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Calendar size={16} /> Date
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Although not strictly required in all jurisdictions, it is highly recommended that a check contains a date. The date helps to track the transaction and can be used to determine the validity of the check. Some banks may refuse to cash a very old check. The date is a helpful record keeping tool.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <ClockIcon size={16} /> Payable on Demand
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    A check is inherently payable on demand. This means that the bank must pay the specified amount when the check is presented for payment. This is a core feature of a check, that distinguishes it from other negotiable instruments.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 6: Issuing of Cheques */}
            <div
              ref={(el) => {
                sectionRefs.current['issuing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Issuing of Cheques: A Step-by-Step Guide
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Issuing a cheque correctly is essential to ensure it is honoured and to prevent fraud. Here is a step-by-step guide.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <PenTool size={16} /> 1. Filling Out the Check
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    This is the first and most crucial step. The drawer must fill out all the necessary information accurately and legibly.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Date:</strong> Write the current date. This helps track the transaction and can affect the check's validity.</li>
                    <li><strong>Payee:</strong> Write the name of the person or entity to whom the check is being paid.</li>
                    <li><strong>Amount (Numerical):</strong> Write the amount of the payment in numerals in the designated box.</li>
                    <li><strong>Amount (Written):</strong> Write the amount of the payment in words on the line provided. This serves as a double-check against the numerical amount.</li>
                    <li><strong>Memo/For:</strong> Write a brief description of the purpose of the payment (optional).</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Accuracy is key. Any errors or discrepancies can lead to the check being rejected or returned.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <FileSignature size={16} /> 2. Signing the Check
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The drawer must sign the check in the designated area. This signature authenticates the check and authorizes the bank to pay the specified amount.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    The signature should match the signature on file with the bank.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <DollarSignIcon size={16} /> 3. Ensuring Sufficient Funds
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Before issuing a check, the drawer must ensure that there are sufficient funds in their account to cover the payment. Issuing a check with insufficient funds can result in the check being returned unpaid, which can lead to fees and penalties.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    This is very important, because issuing a check without sufficient funds can cause legal issues.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Handshake size={16} /> 4. Delivery of the Check
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Once the check is completed and signed, it must be delivered to the payee. This can be done in person, by mail, or through electronic means (if applicable).
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    The method of delivery should be secure and reliable.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Archive size={16} /> 5. Record Keeping
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The drawer should keep a record of the issued check, including the date, payee, amount, and purpose of the payment. This helps with tracking expenses and reconciling bank statements.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    This can be done by filling out the check book stub, or by using accounting software.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Shield size={16} /> 6. Security Measures
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    To prevent fraud, the drawer should take certain security measures:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Use a pen with indelible ink.</li>
                    <li>Fill out the check completely and avoid leaving blank spaces.</li>
                    <li>Store check books in a secure location.</li>
                    <li>Monitor bank statements regularly for unauthorized transactions.</li>
                    <li>If a check is voided, be sure to write VOID across the check, and keep the voided check.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Calendar size={16} /> 7. Post-Dated Cheques
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    A post-dated cheque is a check that is dated for a future date. While they can be issued, their legal status and enforceability can vary depending on the jurisdiction. Some banks may honour them before the date, while others may not.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Post-dated checks are not recommended, due to the varying legal ramifications.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <ClockIcon size={16} /> 8. Stale Cheques
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    A stale cheque is a check that is presented for payment after a certain period has elapsed (usually six months). Banks may refuse to honour stale cheques.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Be sure to cash checks in a timely manner.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 7: Negotiation of Cheques */}
            <div
              ref={(el) => {
                sectionRefs.current['negotiation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Negotiation of Cheques
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The "negotiation" of cheques refers to the process by which a cheque is transferred from one person to another. This is a key aspect of negotiable instruments, allowing them to circulate as a form of payment. Here is a breakdown:
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Essentially, negotiating a cheque means transferring the rights to that cheque to someone else. This allows that person to then cash or deposit the cheque. The way this transfer happens depends on the type of cheque.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Users size={16} /> Types of Cheques and Negotiation
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Bearer Cheques:</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      These cheques are payable to whoever possesses them. Negotiation of a bearer cheque is accomplished simply by delivery. This means that if you have a bearer cheque, you can give it to someone else, and they become the new holder.
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Because of this ease of transfer, bearer cheques carry a higher risk of loss or theft.
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Order Cheques:</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      These cheques are payable to a specific person or entity. Negotiation of an order cheque requires endorsement and delivery.
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li><strong>Endorsement:</strong> This involves the payee signing the back of the cheque. The endorsement transfers the rights to the cheque to another party.</li>
                      <li><strong>Delivery:</strong> After endorsing the cheque, the payee must then deliver it to the new holder.</li>
                    </ul>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Target size={16} /> Key Aspects of Negotiation
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Transfer of Rights:</strong> Negotiation transfers the legal rights to the cheque, allowing the new holder to claim the funds.</li>
                    <li><strong>Holder in Due Course:</strong> In certain circumstances, a person who receives a negotiated cheque in good faith and for value may become a "holder in due course." This status provides certain legal protections.</li>
                    <li><strong>Endorsement Types:</strong> There are various types of endorsements, such as:
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li><strong>Blank endorsement:</strong> Only the payee's signature.</li>
                        <li><strong>Special endorsement:</strong> Specifies the person to whom the cheque is being transferred.</li>
                        <li><strong>Restrictive endorsement:</strong> Limits the use of the cheque (e.g., "for deposit only").</li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Shield size={16} /> Legal Considerations
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>The rules governing cheque negotiation are typically found in negotiable instruments laws, which vary by jurisdiction.</li>
                    <li>Forged endorsements can create significant legal problems.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 8: Principles of Negotiable Instruments */}
            <div
              ref={(el) => {
                sectionRefs.current['principles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Principles of Negotiable Instruments
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    There are several core principles that govern negotiable instruments, ensuring their reliability and effectiveness in commercial transactions.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <RefreshCw size={16} /> 1. Negotiability
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    This is the core principle. It means that negotiable instruments can be freely transferred from one person to another. This transfer can occur through endorsement and delivery (for order instruments) or simply by delivery (for bearer instruments).
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    This principle allows these instruments to function as substitutes for money, facilitating commerce by enabling easy transfer of value.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Target size={16} /> 2. Certainty
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Negotiable instruments must be certain in their terms. This means that:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>The amount payable must be clearly stated.</li>
                    <li>The parties involved (drawer, drawee, payee) must be identifiable.</li>
                    <li>The time of payment must be definite or determinable.</li>
                    <li>The order or promise to pay must be unconditional.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Certainty reduces ambiguity and ensures that all parties understand their obligations and rights.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Handshake size={16} /> 3. Transferability
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    As mentioned earlier, negotiable instruments are designed to be easily transferable. This principle is crucial for their function as substitutes for money.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    The ability to transfer these instruments allows them to circulate freely in the marketplace, facilitating transactions.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Award size={16} /> 4. Holder in Due Course
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    This principle protects a person who acquires a negotiable instrument in good faith, for value, and without notice of any defects or defences.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    A holder in due course gains enhanced rights and protections, making it more difficult for the original parties to the instrument to raise defences against payment.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    This principle encourages people to accept negotiable instruments, knowing that they can rely on them for payment.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <ClockIcon size={16} /> 5. Presentment
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    This refers to the act of presenting a negotiable instrument to the drawee (e.g., a bank) for payment.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Presentment is necessary to demand payment and to establish liability in case of dishonour.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <AlertCircle size={16} /> 6. Notice of Dishonour
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    If a negotiable instrument is dishonoured (e.g., a check bounces), the holder must provide timely notice of dishonour to the parties liable on the instrument.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    This notice is essential to hold these parties responsible for payment.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <DollarSignIcon size={16} /> 7. Consideration
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Like any contract, a negotiable instrument generally requires consideration. This means that there must be an exchange of value between the parties.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Consideration ensures that the instrument is not a mere gratuity but represents a genuine obligation.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <FileText size={16} /> 8. Formality
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Negotiable instruments must adhere to certain formal requirements, such as being in writing and containing specific language.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    These formalities provide a standardized format that enhances certainty and facilitates recognition of the instrument.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 9: Promissory Notes vs. Bills of Exchange */}
            <div
              ref={(el) => {
                sectionRefs.current['promissory-vs-bill'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Promissory Notes vs. Bills of Exchange
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Both promissory notes and bills of exchange are written instruments that represent a promise or order to pay money, but they differ in their structure and the parties involved.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <PenTool size={16} /> Promissory Notes
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Definition:</strong> A promissory note is a written promise by one party (the maker) to pay a certain sum of money to another party (the payee). It is essentially an "I owe you" document.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Key Characteristics:</strong>
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>It is a two-party instrument.</li>
                    <li>It contains a promise to pay.</li>
                    <li>The maker is primarily liable for payment.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Parties Involved:</strong>
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Maker:</strong> The person who makes the promise to pay.</li>
                    <li><strong>Payee:</strong> The person to whom the promise is made.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Example:</strong> If you borrow money from a friend, you might give them a promissory note promising to repay the loan with interest by a specific date.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <FileText size={16} /> Bills of Exchange
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Definition:</strong> A bill of exchange is a written order by one party (the drawer) to another party (the drawee) to pay a certain sum of money to a third party (the payee).
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Key Characteristics:</strong>
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>It is a three-party instrument.</li>
                    <li>It contains an order to pay.</li>
                    <li>The drawee becomes liable upon acceptance.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Parties Involved:</strong>
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Drawer:</strong> The person who issues the order to pay.</li>
                    <li><strong>Drawee:</strong> The person who is ordered to pay.</li>
                    <li><strong>Payee:</strong> The person to whom the payment is to be made.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Example:</strong> A check is a type of bill of exchange. You (the drawer) order your bank (the drawee) to pay a certain amount to the person or company you are paying (the payee).
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <ListChecks size={16} /> Key Differences Summarized
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Promise vs. Order:</strong> A promissory note contains a promise to pay, while a bill of exchange contains an order to pay.</li>
                  <li><strong>Number of Parties:</strong> A promissory note involves two parties (maker and payee), while a bill of exchange involves three parties (drawer, drawee, and payee).</li>
                  <li><strong>Liability:</strong> In a promissory note, the maker is primarily liable. In a bill of exchange, the drawee becomes liable upon acceptance.</li>
                  <li><strong>Use Cases:</strong> Promissory notes are commonly used for loans and other debt obligations. Bills of exchange are used for various commercial transactions, including checks and trade finance.</li>
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
                  💡 Negotiable Instruments Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <RefreshIcon size={16} className="text-orange-500 dark:text-orange-400" />
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
                  <span>Characteristics</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Types of Instruments</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Check Essentials</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Principles</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">8</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Negotiable instruments are essential tools in commerce. Understand the different types—bills of exchange, promissory notes, checks, and CDs—and their key characteristics. Know the essentials of a valid check, the steps for issuing cheques properly, and the principles that govern negotiable instruments. The distinction between promissory notes (two-party promise) and bills of exchange (three-party order) is fundamental.
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
                <strong className="text-white">Negotiable Instruments</strong> – written documents representing a promise or order to pay money, designed to function as a substitute for cash.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Key Characteristics</strong> – written, unconditional, sum certain, payable to order or bearer, payable on demand or at a definite time.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Types</strong> – Bills of Exchange (three-party order), Promissory Notes (two-party promise), Checks (bank draft payable on demand), and Certificates of Deposit (time deposits).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Check Essentials</strong> – written order, unconditional, drawer's signature, drawee (bank), payee, sum certain, date, and payable on demand.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Principles</strong> – negotiability, certainty, transferability, holder in due course, presentment, notice of dishonour, consideration, and formality.
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
            Sidemann Academic Registry • Legal Studies – Negotiable Instruments 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;
