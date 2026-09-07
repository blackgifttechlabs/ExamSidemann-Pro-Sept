import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  GlobeIcon,
  Shield,
  ListChecks,
  SettingsIcon,
  LayersIcon,
  FileText,
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
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
  EditIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'contents', label: 'Manual Contents' },
  { id: 'advantages', label: 'Advantages & Disadvantages' },
  { id: 'procedure', label: 'Basic Procedure' },
  { id: 'simplify', label: 'Simplifying Procedures' },
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
        text: 'A well-written purchasing manual can reduce procurement cycle times by up to 30% by providing clear guidelines and eliminating guesswork from the purchasing process.',
      },
      {
        title: 'Pro Tip',
        text: 'Review your purchasing manual at least annually. Market conditions, regulations, and company needs change — your manual should evolve with them.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 6 steps of basic purchasing procedure: Identify Need → Select Supplier → Issue PO → Receive Goods → Approve Invoice → Maintain Records.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t let your purchasing manual become a bureaucratic burden. Balance control with efficiency by simplifying procedures for routine and small-value purchases.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'A well-written purchasing manual can reduce procurement cycle times by up to 30% by providing clear guidelines and eliminating guesswork from the purchasing process.',
      },
      {
        title: 'Pro Tip',
        text: 'Review your purchasing manual at least annually. Market conditions, regulations, and company needs change — your manual should evolve with them.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 6 steps of basic purchasing procedure: Identify Need → Select Supplier → Issue PO → Receive Goods → Approve Invoice → Maintain Records.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t let your purchasing manual become a bureaucratic burden. Balance control with efficiency by simplifying procedures for routine and small-value purchases.',
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

  // Helper to render a clean card
  const renderCard = (title: string, icon: React.ReactNode, content: React.ReactNode) => {
    return (
      <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-4">
        <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
          {icon} {title}
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          {typeof content === 'string' ? <p>{content}</p> : content}
        </div>
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> PROCUREMENT &amp; SUPPLY CHAIN
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Purchasing Manual &amp;{' '}
            <span className="text-purple-300 font-bold italic">
              Procedures
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to purchasing manual contents, advantages and disadvantages, basic purchasing procedures, and simplifying procedures.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <File size={14} className="inline mr-1" /> Manual
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Clipboard size={14} className="inline mr-1" /> Procedures
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Package size={14} className="inline mr-1" /> Purchasing
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
                placeholder="Search for a concept, procedure step, manual content..."
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
                  <XIcon size={18} className="text-indigo-200" />
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
            {/* SECTION 1: What is a Purchasing Manual */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                What is a Purchasing Manual?
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    It is like a rulebook for the "buying department." It tells them how to do their job, what steps to follow, and what rules to obey. It ensures everyone buys things the same way and helps avoid mistakes.
                  </p>
</div>
            </div>

            {/* SECTION 2: Contents of a Purchasing Manual */}
            <div
              ref={(el) => {
                sectionRefs.current['contents'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Contents of a Purchasing Manual
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Introduction and Purpose', icon: <BookOpen size={16} />, content: 'Sets the stage by explaining the manual\'s purpose and importance. Outlines the company\'s commitment to ethical purchasing, compliance with laws, and efficient resource use. Provides the foundation for the entire document.' },
                  { title: '2. Purchasing Policies and Procedures', icon: <ListChecks size={16} />, content: 'The core of the manual — detailed policies and procedures for all purchasing activities. Covers initiating requests, supplier selection, contract negotiation, approval processes, and ethical considerations. Ensures consistency, transparency, and accountability.' },
                  { title: '3. Supplier Management', icon: <Users size={16} />, content: 'Guidelines on finding, evaluating, and working with suppliers. Covers supplier selection criteria (quality, price, delivery, reliability), supplier audits, performance monitoring, and dispute resolution. Aims to build mutually beneficial relationships.' },
                  { title: '4. Contract Management', icon: <Link size={16} />, content: 'Guidance on creating and managing supplier contracts. Covers drafting, negotiating terms and conditions, monitoring performance, handling disputes, renewals, and terminations. Ensures all contracts are legally sound and protect the company\'s interests.' },
                  { title: '5. Ethical Considerations', icon: <Shield size={16} />, content: 'Emphasizes ethical conduct in all purchasing activities. Outlines policies on conflicts of interest, bribery, gifts, and reporting violations. Ensures decisions are fair and transparent, maintaining the company\'s reputation for integrity.' },
                  { title: '6. Technology and Systems', icon: <SettingsIcon size={16} />, content: 'Instructions on using e-procurement systems, databases, and other technology tools. Covers creating purchase orders, tracking shipments, managing supplier information, and ensuring data security and confidentiality.' },
                  { title: '7. Appendices and Forms', icon: <FileText size={16} />, content: 'Additional resources including templates for purchase orders, supplier evaluation forms, contract checklists, glossary of terms, and contact information. Provides quick reference and easy access to essential documents.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: Advantages and Disadvantages */}
            <div
              ref={(el) => {
                sectionRefs.current['advantages'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Advantages and Disadvantages of a Purchasing Manual
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2 mb-2">
                    <ListChecks size={16} /> Advantages
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Standardization:</strong> Consistent processes across the organization</li>
                    <li><strong>Improved Compliance:</strong> Ensures adherence to laws and ethical standards</li>
                    <li><strong>Enhanced Efficiency:</strong> Streamlines purchasing, saves time</li>
                    <li><strong>Cost Savings:</strong> Guidelines for competitive bidding and negotiation</li>
                    <li><strong>Improved Supplier Relationships:</strong> Clear procedures for selection and management</li>
                    <li><strong>Reduced Errors and Fraud:</strong> Controls and approval processes</li>
                    <li><strong>Training and Development:</strong> Valuable resource for staff training</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} /> Disadvantages
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Lack of Flexibility:</strong> Rigid rules can stifle creativity and adaptation</li>
                    <li><strong>Bureaucracy and Delays:</strong> Complex manuals can slow down processes</li>
                    <li><strong>Difficulty Keeping Up to Date:</strong> Requires ongoing effort to maintain relevance</li>
                    <li><strong>Limited Applicability:</strong> Cannot cover every possible scenario</li>
                    <li><strong>Potential for Misinterpretation:</strong> Ambiguous language can cause confusion</li>
                    <li><strong>Increased Paperwork:</strong> Extensive documentation can be burdensome</li>
                    <li><strong>Resistance to Change:</strong> Employees may resist new procedures</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 4: Basic Purchasing Procedure */}
            <div
              ref={(el) => {
                sectionRefs.current['procedure'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Basic Purchasing Procedure
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    It is like a recipe for buying things. It outlines the steps a company takes to make sure they get what they need, at the right price, and from the right supplier.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Identify the Need', icon: <Target size={16} />, content: 'A department identifies a need for goods or services, documented in a purchase requisition with details like item description, quantity, and delivery date. Prevents unnecessary spending and waste by ensuring the company buys only what it needs.' },
                  { title: '2. Select a Supplier', icon: <Search size={16} />, content: 'Researching potential suppliers, evaluating capabilities, and comparing prices and terms. Factors considered include quality, reliability, delivery time. May involve competitive bidding. Selection impacts quality and overall cost.' },
                  { title: '3. Issue a Purchase Order', icon: <FileText size={16} />, content: 'A formal document authorizing the supplier to deliver goods or services. Includes item description, quantity, price, delivery date, and payment terms. Serves as a legally binding contract between buyer and supplier.' },
                  { title: '4. Receive the Goods or Services', icon: <Package size={16} />, content: 'Inspecting delivered goods to ensure they meet specifications — checking quality, quantity, and condition. Discrepancies reported to supplier immediately. For services, verifying work completion against agreed terms.' },
                  { title: '5. Approve Invoice and Make Payment', icon: <Receipt size={16} />, content: 'Reviewing supplier\'s invoice to ensure it matches the purchase order. Resolving any discrepancies before payment. Processing payment according to agreed terms. Maintains good supplier relationships.' },
                  { title: '6. Maintain Records', icon: <Archive size={16} />, content: 'Keeping accurate records of all transactions — purchase requisitions, purchase orders, invoices, receiving documents. Essential for auditing, tracking spending, and resolving disputes. Provides complete history of all purchasing activities.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5: Simplifying Purchasing Procedures */}
            <div
              ref={(el) => {
                sectionRefs.current['simplify'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Simplifying Purchasing Procedures
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    It is about making the buying process easier and faster. Think of it as taking out unnecessary steps and paperwork to save time and reduce mistakes.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <EditIcon size={16} /> 1. Combine or Eliminate Forms
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Getting rid of extra paperwork or putting information into fewer forms. Review and streamline forms used in the process — identify redundant or unnecessary forms and combine or eliminate them. Reduces paperwork, saves time, reduces errors, and creates a more user-friendly process.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Example:</strong> Combining separate purchase requisition and purchase order forms into a single integrated form.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Target size={16} /> 2. Simplified Procedure for Small Orders
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Making it easier to buy small things without lots of paperwork. Small orders often account for a significant portion of transactions but may not require the same scrutiny as larger orders.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Blanket Purchase Orders:</strong> For recurring small purchases from the same supplier</li>
                    <li><strong>Petty Cash or Purchasing Cards:</strong> For very small, low-value purchases</li>
                    <li><strong>Pre-Approved Supplier Lists:</strong> For common small purchases</li>
                    <li><strong>Simplified Approval Process:</strong> Department managers approve purchases below a threshold</li>
                  </ul>
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
                  💡 Procurement Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <RefreshIcon size={16} className="text-indigo-500 dark:text-indigo-400" />
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
                  <span>Manual Contents</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Procedure Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Simplifying Methods</span>
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
                A purchasing manual is the rulebook for the buying department, containing policies, procedures, supplier management guidelines, contract management, ethical considerations, and technology instructions. While manuals provide standardization, compliance, and efficiency benefits, they must be balanced against potential bureaucracy and inflexibility. The basic purchasing procedure follows six steps: identify need, select supplier, issue PO, receive goods, approve invoice, and maintain records. Simplify procedures by combining forms and implementing streamlined processes for small orders.
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
                <strong className="text-white">Purchasing Manual</strong> – a rulebook for the buying department containing policies, procedures, supplier management, contract management, ethical guidelines, technology instructions, and forms.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Advantages</strong> – standardization, improved compliance, enhanced efficiency, cost savings, improved supplier relationships, reduced errors and fraud, and training support.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Disadvantages</strong> – lack of flexibility, bureaucracy, difficulty keeping up to date, limited applicability, potential misinterpretation, increased paperwork, and resistance to change.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Basic Procedure</strong> – six steps: Identify Need → Select Supplier → Issue PO → Receive Goods → Approve Invoice → Maintain Records.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Simplifying Procedures</strong> – combine or eliminate forms and implement simplified procedures for small orders using blanket orders, purchasing cards, pre-approved suppliers, and streamlined approvals.
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
            Sidemann Academic Registry • Procurement &amp; Supply Chain Management 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;