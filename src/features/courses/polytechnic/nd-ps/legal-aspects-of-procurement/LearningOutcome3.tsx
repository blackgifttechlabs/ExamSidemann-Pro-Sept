import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  SettingsIcon,
  Scale,
  Gavel,
  Handshake,
  FileCheck,
  Truck,
  Package,
  Building2,
  Key,
  Shield as ShieldIcon,
  Users,
  DollarSign,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Award,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Flag,
  GitBranch,
  PackageCheck,
  Users2,
  BookOpen,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  AlertCircle,
  Monitor,
  Cpu,
  Layers,
  Link2,
  Zap,
  Globe,
  FileCode,
  UserCheck,
  GraduationCap,
  Briefcase,
  Rocket,
  Menu,
  MousePointer,
  Touchpad,
  Grid3X3,
  Palette,
  Settings,
  FileText,
  MessageSquare,
  Mail,
  Calendar,
  MapPin as MapPinIcon,
  Globe as GlobeIcon,
  Factory,
  TrendingUp,
  Activity,
  Database,
  Warehouse,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'elements', label: 'Contract Elements' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'ownership-risk', label: 'Ownership & Risk' },
  { id: 'seller-duties', label: 'Seller Duties' },
  { id: 'buyer-duties', label: 'Buyer Duties' },
  { id: 'movable-immovable', label: 'Movable vs Immovable' },
  { id: 'hire-purchase', label: 'Hire-Purchase' },
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
        text: 'The concept of "caveat emptor" (let the buyer beware) has been a principle in sale of goods law for centuries, placing the onus on the buyer to inspect goods before purchase.',
      },
      {
        title: 'Pro Tip',
        text: 'Always specify the time and place of delivery in a sale contract. Ambiguity in these terms is a common source of disputes.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 5 essential elements of a sale contract: Offer, Acceptance, Consideration, Capacity, and Certainty.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse delivery with ownership. Delivery is the physical transfer of possession; ownership is the legal right to the property. They don\'t always happen at the same time.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The concept of "caveat emptor" (let the buyer beware) has been a principle in sale of goods law for centuries, placing the onus on the buyer to inspect goods before purchase.',
      },
      {
        title: 'Pro Tip',
        text: 'Always specify the time and place of delivery in a sale contract. Ambiguity in these terms is a common source of disputes.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 5 essential elements of a sale contract: Offer, Acceptance, Consideration, Capacity, and Certainty.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse delivery with ownership. Delivery is the physical transfer of possession; ownership is the legal right to the property. They don\'t always happen at the same time.',
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Law of Purchase &amp; Sale{' '}
            <span className="text-purple-300 font-bold italic">
              and Hire-Purchase Contracts
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Complete guide to the law of purchase and sale, elements of contract, delivery concepts, passing of ownership and risk, duties of parties, movable and immovable property, and hire-purchase contracts.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scale size={14} className="inline mr-1" /> Law of Sale
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Gavel size={14} className="inline mr-1" /> Hire-Purchase
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Truck size={14} className="inline mr-1" /> Delivery
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
                placeholder="Search for a concept, delivery, ownership..."
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
            {/* SECTION 1: Law of Purchase and Sale */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Law of Purchase and Sale
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The law of purchase and sale, also known as the law of sales, governs the legal relationship between a buyer and a seller when goods or property are exchanged for money. It sets out the rights and obligations of each party, ensuring fairness and clarity in commercial transactions. Essentially, it is the legal framework that makes buying and selling things work smoothly.
                  </p>
</div>
            </div>

            {/* SECTION 2: Elements of the Contract of Sale */}
            <div
              ref={(el) => {
                sectionRefs.current['elements'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Elements of the Contract of Sale
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A contract of sale, to be legally valid, must generally contain certain essential elements. These elements ensure that both parties understand and agree to the terms of the transaction.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Handshake size={16} /> Offer and Acceptance
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    This is the foundation of any contract. An offer is a clear proposal by one party (the seller) to sell goods or property to another party (the buyer). Acceptance occurs when the buyer agrees to the terms of the offer without any significant changes. To be valid, the offer and acceptance must be clear, unambiguous, and communicated effectively. For instance, if a store displays a product with a price tag, it is considered an offer. When a customer takes the product to the cashier and pays, that is considered acceptance. The moment the acceptance is communicated to the offeror a contract is formed. If the buyer attempts to change the price or add conditions, that is considered a counteroffer, and the original offer is voided.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Target size={16} /> Intention to Create Legal Relations
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Not every agreement is a legally binding contract. The parties must intend that their agreement will have legal consequences. This is usually presumed in commercial transactions. For example, when you buy groceries at a supermarket, both you and the supermarket intend to create a legally binding transaction. However, social agreements, like promising to bring a friend a gift, are generally not considered legally binding contracts because there is no intention to create legal relations. Therefore, the context of the agreement is very important.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <DollarSign size={16} /> Consideration
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Consideration refers to the exchange of value between the parties. In a sale, the consideration is usually the purchase price paid by the buyer and the goods or property transferred by the seller. This means that both parties must give something of value to the other. A promise to give a gift without receiving anything in return is not a valid contract because there is no consideration from the receiver of the gift. It is required for the contract to be valid that both parties receive a benefit or give up a detriment.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Users size={16} /> Capacity to Contract
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Both the buyer and the seller must have the legal capacity to enter a contract. This generally means they must be of legal age, mentally competent, and not legally prohibited from entering contracts. For example, minors (generally those under 18) and individuals declared legally incompetent may not have the capacity to enter binding contracts. The purpose of this is to protect vulnerable people from being exploited.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <FileCheck size={16} /> Certainty of Terms
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The terms of the contract must be clear and definite. This includes the description of the goods or property, the price, and any other essential terms. Ambiguous or vague terms can make the contract unenforceable. For example, if a contract states that the buyer will pay "a reasonable price," it may be too vague to be enforceable. A clearly defined price, such as $100, would be considered certain. The goods being sold must also be clearly defined.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: Concept of Delivery */}
            <div
              ref={(el) => {
                sectionRefs.current['delivery'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Concept of Delivery
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Delivery, in the context of a sale, is the act of transferring possession of the goods from the seller to the buyer. It signifies the fulfilment of the seller's obligation to provide the goods as agreed upon.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Package size={16} /> Actual Delivery
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    This is the most common form of delivery, where the seller physically hands over the goods to the buyer. For example, when you buy a book from a bookstore, the cashier handing you the book is an example of actual delivery. This is the most straight forward method, and usually provides the least number of legal questions. When the buyer takes physical possession, then delivery has occured.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Key size={16} /> Constructive Delivery
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Constructive delivery occurs when the seller transfers control or possession of the goods to the buyer without physically handing them over. This can be done by transferring documents of title, such as a bill of lading for goods stored in a warehouse, or by giving the buyer the keys to a storage unit. Essentially, instead of physically handing over the goods, the seller hands over the means to access or control them. If a buyer purchases a car, and the seller hands over the keys and the title, then constructive delivery has occurred.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Flag size={16} /> Symbolic Delivery
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Symbolic delivery involves transferring something that represents the goods, such as a key to a warehouse where the goods are stored. This is like constructive delivery, but the object transferred is more symbolic than directly related to controlling the goods. The delivery of a warehouse key, when the warehouse contains the goods, is a symbolic delivery.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Truck size={16} /> Delivery to a Carrier
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    In some cases, delivery may be considered complete when the seller hands over the goods to a carrier (e.g., a shipping company) for transport to the buyer. This is particularly relevant in long-distance sales. The terms of the contract will specify when delivery is considered to have occurred. If the contract states that delivery is complete when the item is given to the shipping company, then the seller has completed their obligation when they hand the item to the carrier.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <MapPin size={16} /> Place of Delivery
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The place of delivery is critical. The sales contract should specify where the goods are to be delivered. The default is usually the seller's place of business, but the parties can agree to a different location. If no location is specified, the location of delivery will be the sellers place of business. If a contract states that the item is to be delivered to the buyer's home address, then that is the place of delivery.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Clock size={16} /> Time of Delivery
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The time of delivery is also important. The contract should state when the goods are to be delivered. If no time is specified, delivery must occur within a reasonable time. What is considered a reasonable time will depend on the nature of the goods and the circumstances of the sale. If a contract states delivery will occur on a specific date, then delivery must occur on that date.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 4: Passing of Ownership and Risk */}
            <div
              ref={(el) => {
                sectionRefs.current['ownership-risk'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Passing of Ownership and Risk (Merx)
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    "Merx" is a Latin term that refers to the goods or subject matter of a sale. Determining when ownership and risk pass from the seller to the buyer is crucial because it affects who is responsible for the goods if they are damaged or lost.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <ShieldIcon size={16} /> Passing of Ownership
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Ownership typically passes when the parties intend it to pass. This intention can be expressed in the contract or inferred from the circumstances. Generally, if nothing is stated in the contract, ownership passes when the goods are delivered. However, specific rules can vary depending on the type of goods and the jurisdiction. For example, if a car is sold, the ownership may change when the title is transferred, not necessarily when the physical car is handed over. If a person purchases a house, the ownership is transferred when the deed is recorded. The transfer of ownership is very important, because it determines who has the right to sell the item, and who can do what with it. If a person does not own an item, they cannot sell it.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertTriangle size={16} /> Passing of Risk
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Risk refers to who bears the loss if the goods are damaged or destroyed. In many jurisdictions, risk passes with ownership. However, this is not always the case. The parties can agree that risk will pass at a different time, such as when the goods are delivered to a carrier. For example, if a business purchases a large amount of product, and has the product shipped, the parties may agree that the risk of the product is transferred to the buyer when the product is handed to the shipping company. This would mean that if the shipping company loses or damages the product, the buyer is responsible for that loss. Therefore, many businesses purchase shipping insurance.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 5: Duties of the Seller */}
            <div
              ref={(el) => {
                sectionRefs.current['seller-duties'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Duties of the Seller
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The seller has several key duties in a sales contract:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Truck size={16} /> Duty to Deliver the Goods
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The seller must deliver the goods to the buyer at the agreed-upon time and place. This includes ensuring that the goods are in the condition promised. If the seller fails to deliver the goods, or delivers them late, the buyer may have the right to cancel the contract or claim damages. For example, if a person purchases a new refrigerator, the seller has the duty to deliver the refrigerator to the buyer's house, on the agreed upon date, and in new working condition. If the refrigerator arrives damaged, or late, the seller has failed in their duty.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <FileCheck size={16} /> Duty to Transfer Ownership
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The seller must transfer ownership of the goods to the buyer. This means that the seller must have the legal right to sell the goods and must take the necessary steps to transfer ownership. For example, when selling a car, the seller must give the buyer the title, and the buyer must register the title. Without this, the seller has not transferred ownership.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <CheckCircle size={16} /> Duty to Provide Goods of Conformity
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    This means that the goods must match the description or sample provided by the seller. If the goods do not conform, the buyer may have the right to reject them or claim damages. If a person purchases a shirt that is listed as 100% cotton, and it arrives and it is a cotton polyester blend, then the seller has failed in their duty to provide conforming goods.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Award size={16} /> Duty to Warrant Quality
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    In many jurisdictions, the seller provides implied warranties about the quality of the goods. This may include a warranty that the goods are of merchantable quality (i.e., fit for their ordinary purpose) or fit for a particular purpose. Sellers can also provide express warranties, which are specific promises about the quality of the goods. For example, a warranty on a new appliance, that it will be free from defects for a certain amount of time, is an express warranty. If a person purchases a lawnmower, there is an implied warranty that the lawnmower will cut grass.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 6: Duties of the Buyer */}
            <div
              ref={(el) => {
                sectionRefs.current['buyer-duties'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Duties of the Buyer
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The buyer also has important duties in a sales contract:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <DollarSign size={16} /> Duty to Pay the Purchase Price
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The buyer must pay the agreed-upon purchase price at the agreed upon time. If the buyer fails to pay, the seller may have the right to cancel the contract or claim damages. For instance, if a buyer agrees to purchase a computer for $1,000, they have the duty to pay that amount to the seller.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <PackageCheck size={16} /> Duty to Accept Delivery
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The buyer must accept delivery of the goods when they are tendered by the seller. If the buyer refuses to accept delivery without a valid reason, the seller may have the right to claim damages. If a buyer purchases furniture, and the furniture is delivered on the agreed upon date, the buyer has the duty to accept the delivery of the furniture.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Eye size={16} /> Duty to Inspect the Goods
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The buyer has a reasonable opportunity to inspect the goods after delivery. If the buyer discovers any defects, they must notify the seller within a reasonable time. If a buyer purchases a television, and after plugging it in, discovers that the screen is cracked, they have a duty to notify the seller of the defect.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <ShieldIcon size={16} /> Duty to Take Care of Goods Pending Transfer of Ownership
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    If the risk has passed to the buyer, but the ownership has not yet passed, the buyer has a duty to take reasonable care of the goods. If the buyer damages the goods, they may be liable to the seller. If a buyer purchases a large appliance, and it is delivered to their house, but they have not yet paid for it, they have the duty to take reasonable care of the item, and not damage it.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 7: Movable and Immovable Property */}
            <div
              ref={(el) => {
                sectionRefs.current['movable-immovable'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Movable and Immovable Property
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Understanding the distinction between movable and immovable property is fundamental in the law of sale, as different rules apply to the transfer of ownership and delivery for each type.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Package size={16} /> Movable Property
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Definition:</strong> Movable property refers to items that can be transported from one location to another. This includes tangible goods like furniture, vehicles, electronics, and personal belongings.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Delivery Methods:</strong>
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Actual Delivery:</strong> Physical transfer of the goods.</li>
                    <li><strong>Constructive Delivery:</strong> Transfer of control without physical handover.</li>
                    <li><strong>Symbolic Delivery:</strong> Transfer of something representing the goods.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Key Considerations:</strong> Ownership often passes upon delivery, but this can vary by contract. Risk typically passes to the buyer upon delivery.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Building2 size={16} /> Immovable Property
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Definition:</strong> Immovable property refers to land and anything permanently attached to it, such as buildings, structures, and fixtures.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Delivery Methods:</strong>
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Registration:</strong> Transfer of title through official records.</li>
                    <li><strong>Transfer of Deeds:</strong> Legal documents conveying ownership.</li>
                    <li><strong>Handing Over Keys:</strong> Symbolic transfer of possession.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Key Considerations:</strong> Ownership is formalized through registration and legal documentation. The process is more complex and involves specific legal formalities.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <GitBranch size={16} /> Key Differences Between Movable and Immovable Property
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Physicality:</strong> Movable involves physical transfer; immovable involves transfer of legal rights and title.</li>
                  <li><strong>Formalities:</strong> Immovable transactions require extensive legal formalities; movable transactions are generally simpler.</li>
                  <li><strong>Registration:</strong> Immovable transfers are registered; movable transfers generally do not require registration.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 8: Hire-Purchase Contracts */}
            <div
              ref={(el) => {
                sectionRefs.current['hire-purchase'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Hire-Purchase Contracts
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A hire-purchase contract is a specific type of agreement where the buyer (hirer) gains possession of goods but does not acquire ownership until all instalments are paid.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Key size={16} /> Key Features
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Possession, Not Ownership:</strong> Hirer takes possession but seller retains ownership until final payment.</li>
                    <li><strong>Instalment Payments:</strong> Payments are made over a specified period.</li>
                    <li><strong>Option to Purchase:</strong> Hirer has the option to purchase by paying the final instalment.</li>
                    <li><strong>Right of Repossession:</strong> Seller can repossess if the hirer defaults.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <SettingsIcon size={16} /> How It Works
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Hirer agrees to pay instalments for the use of the goods.</li>
                    <li>Seller retains ownership until all instalments are paid.</li>
                    <li>If the hirer fails to pay, the seller can repossess the goods.</li>
                    <li>Once all payments are made, ownership transfers to the hirer.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <ThumbsUp size={16} /> Advantages
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Allows buyers to acquire goods they might not afford in a lump sum.</li>
                    <li>Provides sellers with a way to finance sales and retain security.</li>
                    <li>Allows for budget management by spreading out payments.</li>
                    <li>Provides access to goods that are needed immediately.</li>
                    <li>Allows for a trial period before final purchase.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <ThumbsDown size={16} /> Disadvantages
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Total cost is usually higher due to interest and finance charges.</li>
                    <li>Hirer does not own the goods until the final payment is made.</li>
                    <li>Hirer is often responsible for maintenance and repairs.</li>
                    <li>Strict terms and conditions can lead to repossession.</li>
                    <li>The hirer may build no equity until the final payment.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Sale of Goods Insight
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
                  <span>Contract Elements</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Delivery Types</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Seller/Buyer Duties</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">4 each</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                The law of purchase and sale is fundamental to commercial transactions. Understand the essential elements of a sale contract, the different forms of delivery, and when ownership and risk pass. Know the duties of both sellers and buyers, and the distinction between movable and immovable property. Hire-purchase contracts offer a unique alternative to outright purchase but come with specific considerations.
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
                <strong className="text-white">Elements of Sale</strong> – Offer, Acceptance, Intention to Create Legal Relations, Consideration, Capacity, and Certainty of Terms are essential for a valid contract of sale.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Delivery</strong> – Can be Actual, Constructive, Symbolic, or to a Carrier. The place and time of delivery must be clearly specified in the contract.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Ownership and Risk</strong> – Ownership and risk do not always pass together. The parties can agree on when risk transfers, independent of ownership.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Duties of Parties</strong> – Sellers must deliver conforming goods and transfer ownership; buyers must pay, accept delivery, and inspect goods.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Hire-Purchase</strong> – Involves possession without ownership until final payment; offers flexibility but comes with higher costs and repossession risks.
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
            Sidemann Academic Registry • Legal Studies – Law of Purchase &amp; Sale 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;
