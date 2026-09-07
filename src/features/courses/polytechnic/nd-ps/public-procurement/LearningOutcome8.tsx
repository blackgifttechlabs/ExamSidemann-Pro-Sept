import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  FileText,
  ListChecks,
  ShoppingBag,
  ClipboardCheck,
  Gavel,
  AlertCircle,
  Edit,
  Trash2,
  DollarSign,
  Receipt,
  Clock,
  Calculator,
  TrendingUp,
  Users,
  Handshake,
  Target,
  Award,
  Shield,
  SearchIcon,
  Eye,
  CheckCircle,
  Scale,
  Zap,
  AlertTriangle,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'contracts', label: 'Contracts' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'subcontracting', label: 'Subcontracting' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome8: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(null);

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
        text: 'Fixed-price contracts transfer most risk to the supplier, while cost-reimbursement contracts shift risk to the buyer. Choosing the right contract type is crucial for risk management.',
      },
      {
        title: 'Pro Tip',
        text: 'Always include clear dispute resolution mechanisms in your contracts. This can save significant time and money if disagreements arise.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five pricing approaches with the acronym "F-C-T-U-I": Fixed-Price, Cost-Reimbursement, Time and Materials, Unit Price, and Incentive contracts.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations fail to properly monitor subcontractors. The prime contractor remains fully responsible for subcontractor performance, so regular oversight is essential.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Fixed-price contracts transfer most risk to the supplier, while cost-reimbursement contracts shift risk to the buyer. Choosing the right contract type is crucial for risk management.',
      },
      {
        title: 'Pro Tip',
        text: 'Always include clear dispute resolution mechanisms in your contracts. This can save significant time and money if disagreements arise.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five pricing approaches with the acronym "F-C-T-U-I": Fixed-Price, Cost-Reimbursement, Time and Materials, Unit Price, and Incentive contracts.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations fail to properly monitor subcontractors. The prime contractor remains fully responsible for subcontractor performance, so regular oversight is essential.',
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

  // ─── Helper to render a clean card ──────────────────────────────────────
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
      <header className="bg-[#7c2d12] dark:bg-[#431407] border-b border-orange-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> PROCUREMENT MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Procurement Contracts &amp;{' '}
            <span className="text-orange-300 font-bold italic">
              Subcontracting
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to procurement contracts, pricing approaches, subcontracting, and contract management essentials.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileText size={14} className="inline mr-1" /> Contracts
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <DollarSign size={14} className="inline mr-1" /> Pricing
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Handshake size={14} className="inline mr-1" /> Subcontracting
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
                placeholder="Search for a contract type, pricing approach, term..."
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
            {/* SECTION 1: Introduction */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Introduction to Procurement Contracts
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine you're hiring someone to build a fence around your yard. A procurement contract is like a written agreement that says: what kind of fence they'll build, how much you'll pay them, when they'll finish the job, and what happens if things go wrong. It's a way to make sure everyone knows what they're supposed to do and what to expect.
                  </p>
</div>
            </div>

            {/* SECTION 2: Procurement Contracts */}
            <div
              ref={(el) => {
                sectionRefs.current['contracts'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procurement Contracts
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Definition and Purpose',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p><strong>A formal agreement between a buyer and a seller.</strong></p>
                        <p>A procurement contract is a legally binding agreement between a procuring entity (buyer) and a supplier (seller) for the provision of goods, services, or works.</p>
                        <p>Its primary purpose is to establish the terms and conditions of the agreement, ensuring clarity, accountability, and legal protection for both parties.</p>
                        <p>The contract outlines the obligations of each party, including specifications, delivery schedules, payment terms, and dispute resolution mechanisms.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Elements',
                    icon: <ListChecks size={16} />,
                    content: (
                      <>
                        <p><strong>The important parts of the agreement.</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Offer and Acceptance:</strong> A clear offer by the supplier and acceptance by the procuring entity.</li>
                          <li><strong>Consideration:</strong> The exchange of value, typically payment for goods or services.</li>
                          <li><strong>Specifications:</strong> Detailed descriptions of the goods, services, or works being procured.</li>
                          <li><strong>Delivery Schedule:</strong> Timelines for delivery or completion of the contract.</li>
                          <li><strong>Payment Terms:</strong> Details on how and when payments will be made.</li>
                          <li><strong>Warranty and Guarantee:</strong> Provisions for product or service warranties.</li>
                          <li><strong>Termination Clause:</strong> Conditions under which the contract can be terminated.</li>
                          <li><strong>Dispute Resolution:</strong> Mechanisms for resolving disagreements.</li>
                          <li><strong>Force Majeure:</strong> Clauses addressing unforeseen circumstances.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '3. Types of Contracts',
                    icon: <ShoppingBag size={16} />,
                    content: (
                      <>
                        <p><strong>Different ways to pay for the work.</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Fixed-Price Contracts:</strong> A set price for the entire scope of work.</li>
                          <li><strong>Cost-Reimbursement Contracts:</strong> Reimbursement of actual costs plus a fee.</li>
                          <li><strong>Time and Materials Contracts:</strong> Payment based on hourly rates and material costs.</li>
                          <li><strong>Framework Agreements:</strong> Agreements for recurring purchases over a period of time.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '4. Contract Management',
                    icon: <ClipboardCheck size={16} />,
                    content: (
                      <>
                        <p><strong>Keeping track of the agreement and making sure everyone does their job.</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Tracking performance and deliverables.</li>
                          <li>Managing changes and variations.</li>
                          <li>Processing payments.</li>
                          <li>Resolving disputes.</li>
                          <li>Documenting all contract-related activities.</li>
                        </ul>
                        <p>Good contract management is vital for the success of any procurement.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Legal Considerations',
                    icon: <Gavel size={16} />,
                    content: (
                      <>
                        <p><strong>Following the rules and laws.</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Contract law.</li>
                          <li>Procurement regulations.</li>
                          <li>Intellectual property law.</li>
                          <li>Data protection laws.</li>
                        </ul>
                        <p>Legal counsel should be consulted to ensure compliance.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Risk Management',
                    icon: <AlertCircle size={16} />,
                    content: (
                      <>
                        <p><strong>Planning for things that could go wrong.</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Supplier performance risks.</li>
                          <li>Financial risks.</li>
                          <li>Legal risks.</li>
                          <li>Operational risks.</li>
                        </ul>
                        <p>Risk mitigation strategies should be incorporated into the contract.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Contract Variations and Amendments',
                    icon: <Edit size={16} />,
                    content: (
                      <>
                        <p><strong>Changing the agreement if needed.</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Procedures for contract variations and amendments should be clearly defined.</li>
                          <li>Changes should be documented and agreed upon by both parties.</li>
                          <li>Variations should be justified and approved by relevant authorities.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '8. Contract Termination',
                    icon: <Trash2 size={16} />,
                    content: (
                      <>
                        <p><strong>Ending the agreement.</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Termination for convenience.</li>
                          <li>Termination for default.</li>
                          <li>Notice periods.</li>
                          <li>Consequences of termination.</li>
                        </ul>
                        <p>Proper termination procedures should be followed to avoid legal disputes.</p>
                      </>
                    ),
                  },
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

            {/* SECTION 3: Pricing */}
            <div
              ref={(el) => {
                sectionRefs.current['pricing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Pricing
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Pricing in procurement contracts is a critical aspect that directly impacts the value for money achieved. Choosing the right pricing approach depends on the nature of the procurement, the level of risk involved, and the desired outcomes.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Fixed-Price Contracts (Lump Sum)',
                    icon: <DollarSign size={16} />,
                    content: (
                      <>
                        <p><strong>Description:</strong> A single, predetermined price is agreed upon for the entire scope of work. The supplier bears the risk of cost overruns.</p>
                        <p><strong>Advantages:</strong> Price certainty, simplifies budgeting, incentivises cost control.</p>
                        <p><strong>Disadvantages:</strong> May lead to higher initial prices, difficult to accommodate changes.</p>
                        <p><strong>When to Use:</strong> For well-defined projects with stable requirements, commodity purchases.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Cost-Reimbursement Contracts',
                    icon: <Receipt size={16} />,
                    content: (
                      <>
                        <p><strong>Description:</strong> The procuring entity reimburses the supplier for actual costs incurred, plus a fee. The procuring entity bears the risk of cost overruns.</p>
                        <p><strong>Advantages:</strong> Flexibility to accommodate changes, suitable for complex projects.</p>
                        <p><strong>Disadvantages:</strong> Requires careful monitoring, may lead to higher overall costs.</p>
                        <p><strong>When to Use:</strong> For R&D projects, complex projects with high uncertainty, when cost transparency is essential.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Time and Materials Contracts',
                    icon: <Clock size={16} />,
                    content: (
                      <>
                        <p><strong>Description:</strong> Payment is based on hourly rates for labor and actual costs for materials. The procuring entity bears the risk of cost overruns.</p>
                        <p><strong>Advantages:</strong> Flexibility, suitable for projects where scope is difficult to define upfront.</p>
                        <p><strong>Disadvantages:</strong> Requires careful monitoring of hours and materials, may lead to higher costs.</p>
                        <p><strong>When to Use:</strong> For short-term projects, maintenance work, when speed is important.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Unit Price Contracts',
                    icon: <Calculator size={16} />,
                    content: (
                      <>
                        <p><strong>Description:</strong> Payment is based on a predetermined price per unit of work performed. The total contract price depends on the actual quantity of work completed.</p>
                        <p><strong>Advantages:</strong> Flexibility to accommodate quantity variations, clear pricing.</p>
                        <p><strong>Disadvantages:</strong> Requires accurate measurement of quantities, may lead to disputes.</p>
                        <p><strong>When to Use:</strong> For construction projects, maintenance contracts, when quantities are variable.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Incentive Contracts',
                    icon: <TrendingUp size={16} />,
                    content: (
                      <>
                        <p><strong>Description:</strong> Includes provisions for bonuses or penalties based on performance. Aims to align the interests of both parties.</p>
                        <p><strong>Advantages:</strong> Incentivises suppliers to achieve desired outcomes, promotes innovation.</p>
                        <p><strong>Disadvantages:</strong> Requires careful definition of performance metrics, can be complex to administer.</p>
                        <p><strong>When to Use:</strong> For complex projects with critical performance requirements, when innovation and efficiency are desired.</p>
                      </>
                    ),
                  },
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

              {renderCard(
                'Considerations',
                <ListChecks size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Risk Allocation:</strong> Understand which party bears the risk of cost overruns or variations.</li>
                    <li><strong>Market Conditions:</strong> Consider market trends and pricing when selecting a pricing approach.</li>
                    <li><strong>Contract Complexity:</strong> Choose a pricing approach that aligns with the complexity of the contract.</li>
                    <li><strong>Transparency:</strong> Ensure that the pricing approach is clear and transparent to all parties.</li>
                    <li><strong>Negotiation:</strong> Negotiate pricing terms that are fair and reasonable.</li>
                    <li><strong>Documentation:</strong> Document all pricing agreements and calculations.</li>
                    <li><strong>Legal Compliance:</strong> Ensure the pricing method aligns with legal requirements.</li>
                  </ul>
                </>
              )}
            </div>

            {/* SECTION 4: Subcontracting */}
            <div
              ref={(el) => {
                sectionRefs.current['subcontracting'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Subcontracting
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Subcontracting is a common practice in procurement, where a main contractor (the prime contractor) hires another party (the subcontractor) to perform a portion of the work or provide specific goods or services required under the main contract.
                  </p>
</div>

              {renderCard(
                'What is Subcontracting?',
                <Users size={16} />,
                <>
                  <p>Subcontracting involves a contractual relationship between the prime contractor and a subcontractor.</p>
                  <p>The subcontractor performs a specific part of the work that the prime contractor is obligated to deliver to the procuring entity.</p>
                  <p>The prime contractor remains responsible for the overall performance of the contract, even when subcontractors are involved.</p>
                </>
              )}

              {renderCard(
                'Aspects of Subcontracting',
                <Handshake size={16} />,
                <>
                  <p><strong>Contractual Relationship:</strong> A separate contract exists between the prime contractor and the subcontractor. The procuring entity is typically not a party to this subcontract.</p>
                  <p><strong>Responsibility:</strong> The prime contractor retains overall responsibility for the performance of the entire contract.</p>
                  <p><strong>Specialization:</strong> Subcontracting allows prime contractors to leverage the specialized skills and expertise of subcontractors.</p>
                  <p><strong>Risk Management:</strong> Subcontracting can help prime contractors manage risks by transferring certain responsibilities to subcontractors.</p>
                  <p><strong>Cost Efficiency:</strong> Subcontracting can be a cost-effective way to complete projects, as it allows prime contractors to focus on their core competencies.</p>
                </>
              )}

              {renderCard(
                'Considerations for Subcontracting',
                <ListChecks size={16} />,
                <>
                  <p><strong>Selection of Subcontractors:</strong> Thorough due diligence is essential. Factors to consider include experience, financial stability, past performance, and compliance with regulations.</p>
                  <p><strong>Contractual Agreements:</strong> The subcontract should clearly define scope of work, deliverables, timelines, payment terms, confidentiality, IP rights, dispute resolution, and termination.</p>
                  <p><strong>Monitoring and Control:</strong> Establish effective mechanisms including regular progress meetings, site inspections, and performance reports.</p>
                  <p><strong>Procuring Entity\'s Consent:</strong> The main contract may require the prime contractor to obtain consent before subcontracting certain portions of work.</p>
                  <p><strong>Payment:</strong> Payment terms from the main contract and the subcontract should be aligned.</p>
                  <p><strong>Legal Compliance:</strong> All subcontracts must comply with applicable laws and regulations.</p>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Benefits of Subcontracting',
                    icon: <Zap size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Access to specialized expertise.</li>
                          <li>Increased flexibility.</li>
                          <li>Reduced costs.</li>
                          <li>Improved project efficiency.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Risks of Subcontracting',
                    icon: <AlertTriangle size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Subcontractor default.</li>
                          <li>Quality control issues.</li>
                          <li>Delays.</li>
                          <li>Legal disputes.</li>
                          <li>Reputational damage to the primary contractor.</li>
                        </ul>
                      </>
                    ),
                  },
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
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Contract Insight
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
                  <span>Contract Elements</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Pricing Approaches</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Contract Topics</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Procurement contracts establish the terms and conditions of agreements between buyers and sellers. Key elements include offer/acceptance, consideration, specifications, delivery, payment, warranty, termination, and dispute resolution. Pricing approaches include Fixed-Price, Cost-Reimbursement, Time and Materials, Unit Price, and Incentive contracts. Subcontracting allows prime contractors to leverage specialised expertise but requires careful selection, monitoring, and risk management. Always document everything and ensure legal compliance.
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
                <strong className="text-white">Procurement Contracts</strong> – Legally binding agreements between buyer and seller. Key elements: Offer/Acceptance, Consideration, Specifications, Delivery, Payment, Warranty, Termination, and Dispute Resolution.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Pricing Approaches</strong> – Five main types: Fixed-Price, Cost-Reimbursement, Time and Materials, Unit Price, and Incentive contracts. Each has specific advantages, disadvantages, and use cases based on project complexity and risk allocation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Contract Management</strong> – Tracking performance, managing changes, processing payments, resolving disputes, and documenting all activities. Effective management is essential for successful procurement outcomes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Subcontracting</strong> – Prime contractors hire subcontractors for specialised work. Benefits include access to expertise and cost efficiency. Risks include default, quality issues, delays, and legal disputes. Requires careful selection, monitoring, and clear contractual agreements.
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
            Sidemann Academic Registry • Procurement Contracts &amp; Subcontracting Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome8;