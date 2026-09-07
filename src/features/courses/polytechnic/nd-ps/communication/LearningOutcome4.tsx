import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  GlobeIcon,
  Shield,
  SettingsIcon,
  LayersIcon,
  FileText,
  Users,
  Calendar,
  CheckSquare,
  Clipboard,
  BarChart,
  Clock,
  AlertCircle,
  CreditCard,
  FileCheck,
  FileSearch,
  Handshake,
  Lamp,
  MessageCircle,
  MessageSquare,
  TrendingUp,
  BookOpen,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  AlertTriangle,
  Monitor,
  Cpu,
  Link2,
  Zap,
  Globe,
  FileCode,
  FolderTree as FolderTreeIcon,
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
  MessageSquare as MessageSquareIcon,
  Hand,
  Package,
  Truck,
  Store,
  Building,
  CreditCard as CreditCardIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'conducting-suppliers', label: 'Conducting Suppliers' },
  { id: 'confirmation', label: 'Seek Confirmation' },
  { id: 'supplier-interface', label: 'Supplier Interface' },
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
        text: 'The first recorded procurement practices date back to ancient Mesopotamia, where scribes recorded transactions on clay tablets to track goods and payments.',
      },
      {
        title: 'Pro Tip',
        text: 'Always confirm all order details with suppliers before processing. A simple confirmation email can prevent costly mistakes and delivery delays.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 7 key aspects of conducting suppliers: Communicate → Standardise → Enforce → Automate → Monitor → Resolve → Improve.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to document all supplier communications. Proper documentation protects both parties and helps resolve disputes quickly.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first recorded procurement practices date back to ancient Mesopotamia, where scribes recorded transactions on clay tablets to track goods and payments.',
      },
      {
        title: 'Pro Tip',
        text: 'Always confirm all order details with suppliers before processing. A simple confirmation email can prevent costly mistakes and delivery delays.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 7 key aspects of conducting suppliers: Communicate → Standardise → Enforce → Automate → Monitor → Resolve → Improve.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to document all supplier communications. Proper documentation protects both parties and helps resolve disputes quickly.',
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
            Procurement Efficiency &{' '}
            <span className="text-amber-300 font-bold italic">
              Supplier Management
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Complete guide to procurement procedures, supplier communication, confirmation of arrangements, and maintaining effective supplier interfaces.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileCheck size={14} className="inline mr-1" /> Procurement Procedures
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Handshake size={14} className="inline mr-1" /> Supplier Management
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <MessageCircle size={14} className="inline mr-1" /> Communication
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
                placeholder="Search for a concept, procurement, supplier..."
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
            {/* SECTION 1: Conducting Suppliers to Process Purchase Orders */}
            <div
              ref={(el) => {
                sectionRefs.current['conducting-suppliers'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Conducting Suppliers to Process Purchase Orders in Accordance with Procurement Procedures
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    This involves clear communication, thorough documentation, and consistent enforcement of procurement policies. By guiding suppliers through the purchase order process, organizations can minimize errors, reduce delays, and build strong, mutually beneficial relationships.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <MessageCircle size={16} /> Clear Communication of Procurement Procedures
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The foundation of successful supplier compliance lies in clear and comprehensive communication of procurement procedures. This involves providing suppliers with detailed documentation outlining the organization's purchase order process, including requirements for order confirmation, delivery, invoicing, and payment. This documentation should be easily accessible and regularly updated to reflect any changes in procedures. Regular training sessions or workshops can also be conducted to ensure that suppliers fully understand the expectations. Effective communication minimizes misunderstandings and ensures that suppliers are equipped to process purchase orders correctly. This should be done, when on-boarding new suppliers, and at regular intervals for existing suppliers.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <FileText size={16} /> Standardization of Purchase Order Formats and Information
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Using standardized purchase order formats and ensuring that all required information is included is essential for efficient processing. This eliminates ambiguity and reduces the likelihood of errors. The purchase order should clearly specify the items, quantities, prices, delivery dates, and any other relevant details. It should also include the organization's purchase order number, which serves as a unique identifier for tracking purposes. Standardized information ensures that suppliers can quickly and accurately process orders, reducing processing time and minimizing delays. This standardization also helps in automating certain aspects of the procurement process.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Shield size={16} /> Enforcement of Compliance Through Contractual Agreements
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Contractual agreements should clearly outline the supplier's obligations to adhere to the organization's procurement procedures. This provides a legal framework for enforcing compliance and addressing any deviations from the established process. The contract should specify the consequences of non-compliance, such as penalties or termination of the agreement. Regular audits and performance reviews can be conducted to ensure that suppliers are meeting their contractual obligations. By embedding compliance requirements into contracts, organizations can ensure that suppliers are held accountable for adhering to procurement procedures. This also allows for a clear path of recourse, in cases of non-compliance.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <SettingsIcon size={16} /> Utilizing Technology for Automated Purchase Order Processing
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Implementing e-procurement systems or other automated tools can significantly streamline the purchase order process and improve compliance. These systems can automate the generation, transmission, and tracking of purchase orders, reducing manual errors and improving efficiency. They can also enforce compliance by automatically validating purchase orders against established rules and procedures. Furthermore, these systems provide real-time visibility into the status of purchase orders, allowing organizations to track progress and identify any potential delays. The use of technology, allows for a much more efficient, and transparent process.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <BarChart size={16} /> Regular Monitoring and Performance Evaluation of Suppliers
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Regular monitoring and performance evaluation of suppliers are crucial for ensuring ongoing compliance with procurement procedures. This involves tracking key performance indicators (KPIs), such as order fulfillment rates, delivery times, and accuracy of invoices. Performance evaluations should be conducted regularly and used to identify areas for improvement. Feedback should be provided to suppliers, and corrective actions should be implemented as needed. This process helps to build strong supplier relationships and ensures that suppliers are consistently meeting the organization's expectations. This also allows for the early identification of potential problems.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <MessageSquare size={16} /> Establishing Clear Communication Channels for Issue Resolution
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Establishing clear communication channels for issue resolution is essential for addressing any problems that may arise during the purchase order process. This involves designating specific individuals or teams to handle supplier inquiries and resolve any disputes. Suppliers should be provided with clear contact information and guidelines for reporting issues. Prompt and effective issue resolution helps to maintain positive supplier relationships and minimizes disruptions to the supply chain. Clear communication, also ensures that problems are resolved quickly, and efficiently.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <TrendingUp size={16} /> Providing Feedback and Continuous Improvement Opportunities
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Providing suppliers with constructive feedback and opportunities for continuous improvement is essential for building long-term partnerships. This involves sharing performance data and identifying areas where suppliers can enhance their processes. Encouraging suppliers to provide feedback on the organization's procurement procedures can also help to identify areas for improvement. This collaborative approach fosters a culture of continuous improvement and ensures that the procurement process is constantly evolving to meet the needs of both the organization and its suppliers.
                </p>
              </div>
            </div>

            {/* SECTION 2: Seek Confirmation of Purchasing and Supply Arrangements */}
            <div
              ref={(el) => {
                sectionRefs.current['confirmation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Seek Confirmation of Purchasing and Supply Arrangements
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Seeking confirmation of purchasing and supply arrangements is a fundamental practice in procurement that ensures clarity, alignment, and reduces the risk of costly misunderstandings between buyers and suppliers. It's not merely a procedural formality; it's a strategic step that solidifies agreements, validates expectations, and establishes a clear audit trail. This process of seeking confirmation ensures that all parties involved have a shared understanding of the terms, conditions, and expectations of the purchasing and supply arrangement, leading to more efficient and effective supply chain management.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <CheckSquare size={16} /> Validating the Accuracy of Order Details
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The primary purpose of seeking confirmation is to validate the accuracy of all order details. This includes verifying item descriptions, quantities, unit prices, total costs, delivery dates, and payment terms. Discrepancies between the buyer's purchase order and the supplier's understanding can lead to significant problems, such as incorrect shipments, delayed deliveries, and financial disputes. By seeking confirmation, buyers ensure that all parties have a mutual understanding of the order, minimizing the potential for errors and misunderstandings. This process acts as a final check, before the supplier begins processing the order.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <FileCheck size={16} /> Securing Formal Acceptance and Agreement
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Seeking confirmation provides a formal record of the supplier's acceptance of the purchasing and supply arrangement. This is crucial for establishing a legally binding agreement and protecting the buyer's interests. Written confirmation, whether in the form of an email, a signed document, or an electronic acknowledgment, serves as evidence of the supplier's commitment to fulfill the order according to the agreed-upon terms. This formal acceptance is vital for dispute resolution and contract enforcement. This also creates a paper trail, that can be used for auditing.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Calendar size={16} /> Confirming Delivery Schedules and Logistics
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Delivery schedules and logistics are critical aspects of purchasing and supply arrangements. Seeking confirmation ensures that the supplier understands and agrees to the specified delivery dates, times, and locations. It also allows for the clarification of shipping methods, carrier information, and any special delivery requirements. This confirmation helps to prevent delivery delays and ensures that goods are received when and where they are needed. By confirming logistics, the buyer can ensure that they have the required storage, and staffing, ready for when the goods arrive.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Target size={16} /> Clarifying Quality Standards and Specifications
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  For many purchases, especially those involving complex or specialized items, quality standards and specifications are paramount. Seeking confirmation ensures that the supplier understands and agrees to the required quality levels. This may involve providing samples, confirming adherence to industry standards, or obtaining quality certifications. This clarification helps to prevent the delivery of substandard goods and ensures that the products meet the buyer's expectations. This is especially important for items that will be used in production.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <CreditCard size={16} /> Establishing Clear Payment Terms and Invoicing Procedures
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Clear and unambiguous payment terms are essential for avoiding financial disputes. Seeking confirmation ensures that both parties have a shared understanding of payment methods, deadlines, discounts, and penalties. It also allows for the clarification of invoicing procedures, such as the required format and documentation. This confirmation helps to ensure timely payments and maintain positive supplier relationships. This also prevents confusion, that could lead to late payments.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <AlertCircle size={16} /> Addressing Potential Issues and Concerns Proactively
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The confirmation process provides an opportunity to address any potential issues or concerns before they escalate. This may involve clarifying ambiguities, negotiating changes to the terms, or resolving discrepancies. By addressing these issues proactively, buyers can prevent problems from arising later and ensure a smooth transaction. This proactive approach, saves time, and money.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <FileText size={16} /> Creating an Audit Trail and Documentation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Seeking and documenting confirmation creates an audit trail that can be used to track the progress of the purchasing and supply arrangement and resolve any disputes. This documentation may include emails, signed documents, or electronic records. Maintaining accurate records is essential for compliance, accountability, and future reference. This audit trail, is very important for financial reporting.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Handshake size={16} /> Building Strong Supplier Relationships
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The confirmation process fosters open communication and builds trust between buyers and suppliers. By seeking confirmation, buyers demonstrate their commitment to clear and transparent communication, which can strengthen supplier relationships. This collaborative approach leads to more efficient and effective supply chain management. This also shows the supplier, that the buyer is organized, and professional.
                </p>
              </div>
            </div>

            {/* SECTION 3: Maintain Interface with Suppliers */}
            <div
              ref={(el) => {
                sectionRefs.current['supplier-interface'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Maintain Interface with Suppliers to Ensure Accuracy of Communication Pertaining to Purchasing Issues
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Maintaining a consistent and effective interface with suppliers is paramount in ensuring the accuracy of communication pertaining to purchasing issues. It's not simply about occasional contact; it's about establishing and nurturing a strong, ongoing relationship that facilitates clear, timely, and precise information exchange. This proactive approach minimizes misunderstandings, reduces errors, and fosters a collaborative environment where purchasing issues are addressed efficiently and effectively. By prioritizing open and transparent communication, organizations can optimize their procurement processes and build strong, mutually beneficial partnerships with their suppliers.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <MessageCircle size={16} /> Establishing Clear and Consistent Communication Channels
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Creating designated communication channels for purchasing-related matters is crucial. This involves identifying specific points of contact within both the organization and the supplier's team, and establishing preferred methods of communication (e.g., email, phone, dedicated online portals). Clear communication channels prevent information from getting lost or misdirected. This also ensures that there is a documented record of all communications. Having designated points of contact ensures that all communication is streamlined, and that the correct people are being contacted. This also allows for the tracking of communications, and the monitoring of response times.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Clock size={16} /> Proactive and Timely Communication
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Proactive communication is essential for preventing potential problems and ensuring that purchasing issues are addressed promptly. This involves providing suppliers with timely updates on order status, delivery schedules, and any changes in requirements. Regularly scheduled meetings or check-ins can also help to maintain open lines of communication. Timely communication is vital for resolving issues quickly, and efficiently. This also helps to build trust, and demonstrates that the buyer values the suppliers time.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <FileSearch size={16} /> Accurate and Detailed Information Exchange
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Ensuring the accuracy of information exchanged with suppliers is paramount. This involves providing clear and concise details on purchase orders, specifications, and any other relevant documentation. It also entails verifying information received from suppliers, such as delivery confirmations and invoices. Accurate information exchange minimizes errors and prevents costly misunderstandings. This also includes, clearly communicating any changes to orders, or delivery dates. The information provided, should be easy to understand, and free from ambiguity.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Handshake size={16} /> Building Strong Supplier Relationships
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Maintaining a positive and collaborative relationship with suppliers is crucial for effective communication. This involves treating suppliers with respect, addressing their concerns promptly, and providing constructive feedback. Building strong relationships fosters trust and encourages open communication, which can lead to more efficient problem-solving and improved collaboration. This also ensures that suppliers are more willing to work with the buyer, to resolve any issues that may arise. This also increases supplier loyalty.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <LayersIcon size={16} /> Utilizing Technology for Efficient Communication
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Leveraging technology, such as electronic data interchange (EDI), supplier portals, and collaborative platforms, can significantly enhance communication efficiency. These tools can automate information exchange, provide real-time updates, and facilitate seamless collaboration. This reduces manual errors, and speeds up the communication process. These technologies, also allow for the sharing of large amounts of data, quickly, and securely. The use of technology, also allows for the tracking of communication, and the monitoring of supplier performance.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Clipboard size={16} /> Regular Performance Reviews and Feedback Sessions
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Conducting regular performance reviews and feedback sessions with suppliers provides an opportunity to discuss communication effectiveness and identify areas for improvement. This allows for open dialogue and ensures that both parties are aligned on communication expectations. These sessions can also be used to address any recurring communication issues and develop strategies for resolving them. These reviews, allow for the building of a culture of continuous improvement.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <FileText size={16} /> Documenting Communication for Audit Trails and Reference
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Maintaining accurate records of all communication with suppliers is essential for creating audit trails and providing a reference point for future discussions. This involves documenting emails, phone calls, meeting minutes, and any other relevant information. This documentation can be invaluable in resolving disputes or clarifying misunderstandings. Good documentation, also helps to protect the company, in any legal disputes.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <GlobeIcon size={16} /> Cultural Awareness and Sensitivity
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  When dealing with international suppliers, cultural awareness and sensitivity are crucial. This involves understanding cultural differences in communication styles and adapting communication strategies accordingly. This helps to build rapport and avoid misunderstandings. This also includes, being aware of any language barriers, and providing translation services, if needed.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Procurement Insight
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
                  <span>Procurement Key Aspects</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Confirmation Points</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Supplier Interface Points</span>
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
                Effective procurement relies on clear communication, standardised processes, and strong supplier relationships. Always confirm arrangements with suppliers, document all communications, and maintain ongoing interfaces to ensure accuracy and efficiency. These practices build trust, reduce errors, and create a reliable supply chain.
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
                <strong className="text-white">Conducting Suppliers</strong> – communicate procurement procedures clearly, standardise purchase orders, enforce compliance through contracts, use automation, monitor performance, and establish clear issue resolution channels.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Seek Confirmation</strong> – validate order details, secure formal acceptance, confirm delivery schedules, clarify quality standards, establish payment terms, address issues proactively, and create audit trails.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Supplier Interface</strong> – establish clear communication channels, be proactive and timely, ensure accurate information exchange, build strong relationships, leverage technology, conduct performance reviews, document communications, and be culturally aware.
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
            Sidemann Academic Registry • ND Purchasing &amp; Supply – Procurement Efficiency 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;
