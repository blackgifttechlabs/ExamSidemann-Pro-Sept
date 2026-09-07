import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  Shield,
  ListChecks,
  BookOpen,
  LayersIcon,
  FileText,
  Users,
  Building,
  Scale,
  Gavel,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Home,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  ChevronUp,
  AlertTriangle,
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
  FileText as FileTextIcon,
  MessageSquare,
  Mail,
  Calendar,
  MapPin,
  Globe as GlobeIcon,
  Factory,
  TrendingUp,
  Activity,
  Database,
  Warehouse,
  RefreshCw as RefreshIcon,
  ChevronDown,
  Lock,
  Handshake,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'security', label: 'Security Overview' },
  { id: 'mortgage', label: 'Mortgage' },
  { id: 'liens', label: 'Liens' },
  { id: 'pledge', label: 'Pledge' },
  { id: 'suretyship', label: 'Suretyship' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome6: React.FC = () => {
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
        text: 'The word "mortgage" comes from Old French "mort" (dead) and "gage" (pledge), meaning a "dead pledge" because the pledge dies when the debt is paid.',
      },
      {
        title: 'Pro Tip',
        text: 'When acting as a surety, always understand the full extent of your liability. You could be liable for the entire debt if the principal debtor defaults.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 4 types of security: Mortgage (real property), Pledge (movable goods), Lien (legal claim), and Suretyship (personal guarantee).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a pledge with a mortgage. A pledge involves physical delivery of movable goods to the creditor; a mortgage involves real property with the debtor retaining possession.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The word "mortgage" comes from Old French "mort" (dead) and "gage" (pledge), meaning a "dead pledge" because the pledge dies when the debt is paid.',
      },
      {
        title: 'Pro Tip',
        text: 'When acting as a surety, always understand the full extent of your liability. You could be liable for the entire debt if the principal debtor defaults.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 4 types of security: Mortgage (real property), Pledge (movable goods), Lien (legal claim), and Suretyship (personal guarantee).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a pledge with a mortgage. A pledge involves physical delivery of movable goods to the creditor; a mortgage involves real property with the debtor retaining possession.',
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
      <header className="bg-[#134e4a] dark:bg-[#042f2e] border-b border-teal-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Security &amp;{' '}
            <span className="text-cyan-300 font-bold italic">
              Creditor-Debtor Relationships
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Comprehensive guide to security in creditor-debtor relationships, law of mortgage, liens, law of pledge, and contracts of suretyship.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scale size={14} className="inline mr-1" /> Security
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Home size={14} className="inline mr-1" /> Mortgage
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Lock size={14} className="inline mr-1" /> Liens &amp; Pledge
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
                placeholder="Search for a concept, mortgage, pledge..."
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
            {/* SECTION 1: Security Overview */}
            <div
              ref={(el) => {
                sectionRefs.current['security'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Security in Creditor-Debtor Relationships
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In the context of creditor-debtor relationships, "security" refers to an asset or a right that a creditor can use to ensure repayment of a debt. It provides the creditor with a fallback option if the debtor fails to fulfil their obligations. Essentially, it reduces the creditor's risk of loss.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Security, in this context, is a legal mechanism that gives a creditor a proprietary interest in specific assets or rights of the debtor. This interest allows the creditor to:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Take possession of the asset:</strong> If the debtor defaults, the creditor can seize the secured asset.</li>
                    <li><strong>Sell the asset:</strong> The creditor can sell the asset to recover the outstanding debt.</li>
                    <li><strong>Prioritize their claim:</strong> In the event of the debtor's bankruptcy, the secured creditor has a priority claim over other creditors regarding the secured asset.</li>
                  </ul>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Target size={16} /> 1. Definition and Purpose
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    A mortgage is a legal agreement where a borrower (mortgagor) pledges real property as security for a loan from a lender (mortgagee). The primary purpose is to provide the lender with a secure way to recover their funds if the borrower defaults on the loan.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Essentially, it is a way for people to buy expensive real estate, like houses, by spreading the cost over time. The mortgage acts as a safety net for the lender, ensuring they do not lose their money if the borrower cannot pay.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <FileText size={16} /> 2. Creation of a Mortgage
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    A mortgage is typically created through a written agreement that outlines the terms of the loan, including the amount borrowed, the interest rate, and the repayment schedule. This agreement is often registered in public records to provide notice to third parties.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    The registration of the mortgage is very important. This is because it creates a public record of the lender's interest in the property.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Users size={16} /> 3. Rights of the Mortgagor (Borrower)
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Right to possess and use the property if they comply with the terms of the mortgage.</li>
                    <li>Obligation to repay the loan according to the agreed-upon schedule.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    While the property is mortgaged, the borrower is still the owner, but they are limited by the mortgage agreement.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Building size={16} /> 4. Rights of the Mortgagee (Lender)
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Right to receive payments according to the mortgage agreement.</li>
                    <li>Right to foreclose on the property and sell it to recover the outstanding debt if the mortgagor defaults.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Foreclosure is the lender's ultimate remedy and is only taken as a last resort.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle size={16} /> 5. Foreclosure
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Foreclosure is the legal process by which a mortgagee takes possession of a mortgaged property when the mortgagor defaults on the loan. The property is then sold to satisfy the debt.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    There are many legal regulations surrounding the foreclosure process, to protect the rights of the borrower.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <RefreshCw size={16} /> 6. Redemption
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Redemption is the right of the mortgagor to reclaim the property by paying off the outstanding debt, including any accrued interest and costs. This right is typically available until the foreclosure process is complete.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    This right gives the borrower a chance to save their home, even after defaulting on their loan.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <ListChecks size={16} /> 7. Priority of Mortgages
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    If a property has multiple mortgages, the priority of those mortgages determines the order in which the mortgagees are entitled to be paid in the event of foreclosure.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    The first mortgage recorded has the highest priority.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle size={16} /> 8. Discharge of Mortgage
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Once the mortgagor has fully repaid the loan, the mortgagee is obligated to discharge the mortgage, releasing the property from the security interest.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    This clears the title of the property and shows that the loan has been paid in full.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: Liens */}
            <div
              ref={(el) => {
                sectionRefs.current['liens'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Liens
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine you hire someone to fix your roof. They fix it, but you do not pay them. A "lien" is like a legal "hold" they put on your house. It means they have a right to your house until you pay them. If you still do not pay, they can go to court and maybe even sell your house to get their money.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Target size={16} /> Key Points About Liens
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>1. Liens are a way to make sure you get paid.</strong> When someone does work for you, they want to be sure they will get paid back. A lien is a legal tool that helps them do that.</li>
                    <li><strong>2. There are different kinds of liens.</strong> Some liens are created when you agree to them, like a mortgage. Others happen automatically, like when you do not pay your taxes.</li>
                    <li><strong>3. Liens give someone a legal claim on your property.</strong> If you do not pay a debt, the person who has the lien can go to court and try to sell your property to get their money.</li>
                    <li><strong>4. Liens have rules about who gets paid first.</strong> Usually, the first lien filed gets paid first. This is called "priority."</li>
                    <li><strong>5. Liens can be removed.</strong> Once you pay the debt, the lien is removed. This is called "discharging" the lien.</li>
                    <li><strong>6. Liens have time limits.</strong> There are rules about how long a lien is valid.</li>
                    <li><strong>7. Lien laws can be different depending on where you live.</strong> The rules about liens can vary from state to state or country to country.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 4: Law of Pledge */}
            <div
              ref={(el) => {
                sectionRefs.current['pledge'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Law of Pledge
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The law of pledge is a specific type of security arrangement where movable goods are used as collateral for a loan. It is an important concept in commercial transactions, allowing individuals and businesses to borrow money by offering personal property as security.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Imagine you need some quick cash, and you have a valuable watch. You take it to a pawnbroker, who lends you money in exchange for holding onto the watch. If you pay back the loan, you get your watch back. If you do not, the pawnbroker can sell the watch to recover the money. This is essentially how a pledge works.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Target size={16} /> 1. Definition and Purpose
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>A pledge is a legal transaction where movable goods (the "pledge") are delivered by the borrower (the "pledgor") to the lender (the "pledgee") as security for a loan.</li>
                    <li>The purpose is to provide the lender with a secure way to recover their funds if the borrower defaults on the loan.</li>
                    <li>This is a very old practice and has been used for centuries.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <ListChecks size={16} /> 2. Essential Elements
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Delivery of Possession:</strong> The pledgor must physically deliver the goods to the pledgee. This is a crucial element that distinguishes a pledge from other forms of security.</li>
                    <li><strong>Agreement:</strong> There must be a clear agreement between the pledgor and the pledgee regarding the terms of the loan and the pledge.</li>
                    <li><strong>Security for a Debt:</strong> The pledge must be made to secure the payment of a debt or the performance of an obligation.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Users size={16} /> 3. Rights of the Pledgor (Borrower)
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Right to Redeem:</strong> The pledgor has the right to redeem the pledged goods by paying the debt and any accrued interest and costs.</li>
                    <li><strong>Obligation to Pay:</strong> The pledgor is obligated to repay the loan according to the agreed-upon terms.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Building size={16} /> 4. Rights of the Pledgee (Lender)
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Right to Retain Possession:</strong> The pledgee has the right to retain possession of the pledged goods until the debt is paid.</li>
                    <li><strong>Right to Sell:</strong> If the pledgor defaults, the pledgee has the right to sell the pledged goods to recover the outstanding debt.</li>
                    <li><strong>Obligation to Take Care:</strong> The pledgee is obligated to take reasonable care of the pledged goods while they are in their possession.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <XCircle size={16} /> 5. Termination of Pledge
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>The pledge is terminated when the debt is paid, or when the pledgee voluntarily returns the goods to the pledgor.</li>
                    <li>The pledge is also terminated if the pledged goods are lost or destroyed through no fault of the pledgee.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Shield size={16} /> 6. Key Considerations
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>The law of pledge is primarily concerned with movable goods.</li>
                    <li>The pledgee must act in good faith and in a commercially reasonable manner when dealing with the pledged goods.</li>
                    <li>The specific rules and regulations governing pledges can vary depending on the jurisdiction.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 5: Contracts of Suretyship */}
            <div
              ref={(el) => {
                sectionRefs.current['suretyship'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Contracts of Suretyship
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine your friend wants to borrow money from a bank, but the bank is not sure they will pay it back. You tell the bank, "If my friend doesn't pay, I will." That is essentially what a suretyship is. You are promising to pay someone else's debt if they fail to.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Target size={16} /> 1. Definition and Purpose
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>A contract of suretyship is an agreement where a third party (the surety or guarantor) promises to be liable for the debt or obligation of another party (the principal debtor) to a creditor.</li>
                    <li>The purpose is to provide the creditor with additional security, reducing the risk of non-payment or non-performance.</li>
                    <li>This type of contract is very important for providing security for loans, leases, and other contractual obligations.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <ListChecks size={16} /> 2. Essential Elements
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Principal Obligation:</strong> There must be a valid underlying obligation between the principal debtor and the creditor.</li>
                    <li><strong>Agreement:</strong> There must be a clear agreement between the creditor and the surety, outlining the terms of the suretyship.</li>
                    <li><strong>Capacity:</strong> All parties (creditor, principal debtor, and surety) must have the legal capacity to enter a contract.</li>
                    <li><strong>Writing:</strong> In many jurisdictions, a contract of suretyship must be in writing to be enforceable.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Shield size={16} /> 3. Rights of the Surety
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Liability:</strong> The surety is liable to the creditor if the principal debtor defaults.</li>
                    <li><strong>Right of Recourse:</strong> After paying the creditor, the surety has the right to seek reimbursement from the principal debtor.</li>
                    <li><strong>Defences:</strong> The surety may be able to raise certain defences, such as fraud or misrepresentation, to avoid liability.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Building size={16} /> 4. Rights of the Creditor
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Demand Payment:</strong> The creditor has the right to demand payment from the surety if the principal debtor defaults.</li>
                    <li><strong>Duty of Good Faith:</strong> The creditor must act in good faith and not prejudice the surety's rights.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Users size={16} /> 5. Rights of the Principal Debtor
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Primary Liability:</strong> The principal debtor remains primarily liable for the debt or obligation.</li>
                    <li><strong>Duty to Reimburse:</strong> The principal debtor is obligated to reimburse the surety if the surety pays the creditor.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <XCircle size={16} /> 6. Termination of Suretyship
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Payment:</strong> The suretyship is terminated when the principal debt or obligation is paid or performed.</li>
                    <li><strong>Release:</strong> The creditor may release the surety from their obligation.</li>
                    <li><strong>Material Alteration:</strong> A material alteration of the principal obligation without the surety's consent may discharge the surety.</li>
                    <li><strong>Expiration:</strong> If the suretyship is for a specific period, it terminates upon the expiration of that period.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Shield size={16} /> 7. Key Considerations
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Suretyship is a contractual relationship, and the terms of the agreement are crucial.</li>
                    <li>The surety should carefully consider the risks involved before entering into a suretyship agreement.</li>
                    <li>The laws governing suretyship can vary depending on the jurisdiction.</li>
                    <li>It is always best to seek legal advice before entering a suretyship contract.</li>
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
                  💡 Security Insight
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
                  <span>Security Types</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Mortgage Elements</span>
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
                Security in creditor-debtor relationships protects lenders and encourages lending. Understand the four main types: Mortgage (real property), Pledge (movable goods), Lien (legal claim), and Suretyship (personal guarantee). Each has distinct rules for creation, enforcement, and termination. Always consider the legal formalities and seek professional advice when dealing with security arrangements.
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
                <strong className="text-white">Security</strong> – reduces creditor risk by providing a proprietary interest in the debtor's assets or rights.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Mortgage</strong> – security interest in real property; debtor retains possession but creditor can foreclose on default.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Liens</strong> – legal claim on property to secure payment; can be consensual or statutory.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Pledge</strong> – movable goods delivered to creditor as security; creditor retains possession and can sell on default.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Suretyship</strong> – third party guarantees the debtor's obligation; surety has right of recourse against the debtor.
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
            Sidemann Academic Registry • Legal Studies – Security &amp; Creditor-Debtor 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome6;
